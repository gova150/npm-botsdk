import * as React from 'react';
import { NativeModules, Platform, Share } from 'react-native';
import Toast from 'react-native-toast-message';
import { hidePdfDownloadLoader } from '../utils/PdfDownloadLoader';
import { IThemeType } from '../theme/IThemeType';

export interface PdfCardItem {
  PDFData: string;
  fileName: string;
}

export interface PdfDataResponseTemplateProps {
  payload?: any;
  theme?: IThemeType;
  currentMessage?: any;
  messageId?: string;
  onListItemClick?: (type: any, data: any) => void;
}

export interface PdfDataResponseTemplateState {
  hasProcessed: boolean;
}

// Global deduplication set to avoid downloading/opening repeatedly on FlatList scroll / remount
const processedKeys = new Set<string>();

/**
 * Cached references to native modules so they are only required when verified non-null.
 * This completely avoids the fatal Hermes error:
 * "Invariant Violation: `new NativeEventEmitter()` requires a non-null argument."
 * which occurs when libraries like react-native-file-viewer or react-native-fs are
 * imported statically while their native module is not linked in the consumer app.
 */
let cachedRNFS: any = null;
let cachedFileViewer: any = null;
let cachedBlobUtil: any = null;

const getNativeFileModules = () => {
  // Check react-native-fs safely
  if (!cachedRNFS) {
    try {
      const nm = NativeModules as any;
      if (nm && (nm.RNFSManager || Platform.OS === 'android')) {
        const mod = require('react-native-fs');
        cachedRNFS = mod?.default || mod;
      }
    } catch (e) {
      // RNFS not available or NativeEventEmitter failed
    }
  }

  // Check react-native-blob-util safely
  if (!cachedBlobUtil) {
    try {
      const nm = NativeModules as any;
      if (nm && nm.ReactNativeBlobUtil) {
        const mod = require('react-native-blob-util');
        cachedBlobUtil = mod?.default || mod;
      }
    } catch (e) {
      // BlobUtil not available
    }
  }

  // Check react-native-file-viewer safely
  // CRITICAL: Only require if RNFileViewer is non-null in NativeModules,
  // otherwise 'new NativeEventEmitter(RNFileViewer)' in its index.js throws Invariant Violation!
  if (!cachedFileViewer) {
    try {
      const nm = NativeModules as any;
      if (nm && nm.RNFileViewer) {
        const mod = require('react-native-file-viewer');
        cachedFileViewer = mod?.default || mod;
      }
    } catch (e) {
      // FileViewer not available
    }
  }

  return {
    RNFS: cachedRNFS,
    RNBlobUtil: cachedBlobUtil,
    FileViewer: cachedFileViewer,
  };
};

/**
 * Resolves a writable directory path for storing the PDF document.
 */
const getDocumentDirectory = (): string | null => {
  const { RNFS, RNBlobUtil } = getNativeFileModules();
  if (RNFS && RNFS.DocumentDirectoryPath) {
    return RNFS.DocumentDirectoryPath;
  }
  if (RNBlobUtil && RNBlobUtil.fs?.dirs?.DocumentDir) {
    return RNBlobUtil.fs.dirs.DocumentDir;
  }
  return null;
};

/**
 * Safely writes base64 data to a file using RNFS or RNBlobUtil.
 */
const writeBase64ToFile = async (
  filePath: string,
  base64Data: string,
): Promise<boolean> => {
  const { RNFS, RNBlobUtil } = getNativeFileModules();
  if (RNFS && typeof RNFS.writeFile === 'function') {
    await RNFS.writeFile(filePath, base64Data, 'base64');
    return true;
  }
  if (
    RNBlobUtil &&
    RNBlobUtil.fs &&
    typeof RNBlobUtil.fs.writeFile === 'function'
  ) {
    await RNBlobUtil.fs.writeFile(filePath, base64Data, 'base64');
    return true;
  }
  console.warn(
    'PdfDataResponseTemplate: Neither react-native-fs nor react-native-blob-util is available to write file',
  );
  return false;
};

/**
 * Opens or shares the downloaded PDF file using FileViewer if available,
 * or React Native's built-in Share API as a 100% crash-free fallback.
 */
const openOrSharePdf = async (filePath: string, fileName: string) => {
  const { FileViewer } = getNativeFileModules();

  if (FileViewer && typeof FileViewer.open === 'function') {
    try {
      await FileViewer.open(filePath, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });
      console.log('PdfDataResponseTemplate: PDF opened with FileViewer');
      return;
    } catch (openErr) {
      console.log(
        'PdfDataResponseTemplate: FileViewer.open error, falling back to Share:',
        openErr,
      );
    }
  }

  // Fallback using React Native built-in Share API (available on all Android & iOS devices)
  try {
    const fileUri =
      Platform.OS === 'android' && !filePath.startsWith('file://')
        ? `file://${filePath}`
        : filePath;

    await Share.share(
      Platform.OS === 'ios'
        ? {
            url: fileUri,
            title: fileName,
          }
        : {
            title: fileName,
            message: `PDF Downloaded: ${fileName}`,
            url: fileUri,
          },
      {
        dialogTitle: `Open ${fileName}`,
      },
    );
  } catch (shareErr) {
    console.log('PdfDataResponseTemplate: Share fallback error:', shareErr);
  }
};

/**
 * Strips data URI prefix (e.g., data:application/pdf;base64,) and removes whitespace/newlines.
 */
export function cleanBase64(raw: string): string {
  if (!raw || typeof raw !== 'string') {
    return '';
  }
  let cleaned = raw.trim();
  if (cleaned.includes('base64,')) {
    cleaned = cleaned.split('base64,')[1] || cleaned;
  }
  return cleaned.replace(/[\r\n\s]+/g, '');
}

/**
 * Ensures the filename is safe for the filesystem and ends with '.pdf'.
 */
export function formatFileName(rawName?: string): string {
  let name = (rawName || 'downloaded_document').trim();
  // Sanitize path characters
  name = name.replace(/[/\\?%*:|"<>]/g, '_');
  if (!name.toLowerCase().endsWith('.pdf')) {
    name += '.pdf';
  }
  return name;
}

/**
 * Traverses payload to extract all PDF data items ({ PDFData, fileName }).
 */
export function extractPdfCards(payload: any): PdfCardItem[] {
  if (!payload) {
    return [];
  }

  let data = payload;
  // If wrapped in a nested payload, drill down
  if (
    data?.payload &&
    (data.payload.pdfData || data.payload.cards || data.payload.PDFData)
  ) {
    data = data.payload;
  }

  let rawCards: any[] = [];

  if (Array.isArray(data?.pdfData?.body?.cards)) {
    rawCards = data.pdfData.body.cards;
  } else if (
    data?.pdfData?.body?.cards &&
    typeof data.pdfData.body.cards === 'object'
  ) {
    rawCards = [data.pdfData.body.cards];
  } else if (Array.isArray(data?.body?.cards)) {
    rawCards = data.body.cards;
  } else if (data?.body?.cards && typeof data.body.cards === 'object') {
    rawCards = [data.body.cards];
  } else if (Array.isArray(data?.pdfData?.cards)) {
    rawCards = data.pdfData.cards;
  } else if (Array.isArray(data?.cards)) {
    rawCards = data.cards;
  } else if (data?.cards && typeof data.cards === 'object') {
    rawCards = [data.cards];
  } else if (data?.PDFData || data?.pdfData?.PDFData) {
    const rawPdf = data?.PDFData || data?.pdfData?.PDFData;
    if (typeof rawPdf === 'string') {
      rawCards = [
        {
          PDFData: rawPdf,
          fileName: data?.fileName || data?.pdfData?.fileName || 'document',
        },
      ];
    }
  }

  const result: PdfCardItem[] = [];
  for (const card of rawCards) {
    if (!card) continue;
    const pdf =
      card.PDFData || card.pdfData || card.pdf_data || card.data || card.fileData;
    const name =
      card.fileName || card.filename || card.FileName || card.name || 'document';
    if (typeof pdf === 'string' && pdf.trim().length > 0) {
      result.push({
        PDFData: pdf.trim(),
        fileName: String(name).trim(),
      });
    }
  }

  return result;
}

/**
 * Downloads and writes base64 PDF(s) to app storage and triggers FileViewer or native Share.
 * Automatically dismisses the loader. Never runs on history.
 */
export const downloadPdfDataResponse = async (
  payload: any,
  messageId?: string,
  isHistory?: boolean,
): Promise<string[]> => {
  // Always hide loader once template arrives
  hidePdfDownloadLoader();

  // NEVER run on history
  if (
    isHistory === true ||
    payload?.isHistory === true ||
    payload?.isFromHistory === true ||
    payload?.payload?.isHistory === true
  ) {
    console.log('PdfDataResponseTemplate: Skipping download on history');
    return [];
  }

  const cards = extractPdfCards(payload);
  if (!cards || cards.length === 0) {
    console.warn('PdfDataResponseTemplate: No PDF cards found in payload');
    return [];
  }

  const destDir = getDocumentDirectory();
  if (!destDir) {
    console.warn('PdfDataResponseTemplate: No document directory available');
    return [];
  }

  const savedPaths: string[] = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const fileName = formatFileName(card.fileName);
    const base64Data = cleanBase64(card.PDFData);

    if (!base64Data) {
      continue;
    }

    // Deduplication key
    const dedupKey = messageId
      ? `${messageId}_${fileName}_${i}`
      : `${fileName}_${base64Data.slice(0, 40)}`;

    if (processedKeys.has(dedupKey)) {
      console.log(
        'PdfDataResponseTemplate: File already processed, skipping duplicate:',
        fileName,
      );
      continue;
    }
    processedKeys.add(dedupKey);

    try {
      const filePath = `${destDir}/${fileName}`;

      console.log('PdfDataResponseTemplate: Saving PDF file to:', filePath);
      const success = await writeBase64ToFile(filePath, base64Data);
      if (!success) {
        continue;
      }
      savedPaths.push(filePath);

      try {
        Toast.show({
          type: 'success',
          text1: 'PDF Downloaded',
          text2: fileName,
        });
      } catch (toastErr) {
        // Toast is optional
      }

      // Automatically open the downloaded PDF in viewer / share sheet
      await openOrSharePdf(filePath, fileName);
    } catch (error) {
      console.error('PdfDataResponseTemplate: Error writing PDF file:', error);
      try {
        Toast.show({
          type: 'error',
          text1: 'Download Failed',
          text2: fileName,
        });
      } catch (tErr) {}
    }
  }

  return savedPaths;
};

export default class PdfDataResponseTemplate extends React.Component<
  PdfDataResponseTemplateProps,
  PdfDataResponseTemplateState
> {
  constructor(props: PdfDataResponseTemplateProps) {
    super(props);
    this.state = {
      hasProcessed: false,
    };
  }

  componentDidMount() {
    hidePdfDownloadLoader();
    // Do NOT run download on mount - downloads are strictly handled for live messages only
  }

  componentDidUpdate() {
    hidePdfDownloadLoader();
  }

  render() {
    // This template is invisible and must NOT display anything in the UI
    return null;
  }
}
