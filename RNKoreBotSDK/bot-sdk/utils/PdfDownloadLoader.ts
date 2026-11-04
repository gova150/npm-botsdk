type LoaderListener = (loading: boolean) => void;

class PdfDownloadLoaderManager {
  private static instance: PdfDownloadLoaderManager;
  private listeners: Set<LoaderListener> = new Set();
  private isLoading: boolean = false;

  private constructor() {}

  public static getInstance(): PdfDownloadLoaderManager {
    if (!PdfDownloadLoaderManager.instance) {
      PdfDownloadLoaderManager.instance = new PdfDownloadLoaderManager();
    }
    return PdfDownloadLoaderManager.instance;
  }

  public showLoader(): void {
    this.isLoading = true;
    this.listeners.forEach(listener => {
      try {
        listener(true);
      } catch (e) {
        console.warn('PdfDownloadLoader listener error:', e);
      }
    });
  }

  public hideLoader(): void {
    this.isLoading = false;
    this.listeners.forEach(listener => {
      try {
        listener(false);
      } catch (e) {
        console.warn('PdfDownloadLoader listener error:', e);
      }
    });
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public subscribe(listener: LoaderListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const showPdfDownloadLoader = (): void => {
  PdfDownloadLoaderManager.getInstance().showLoader();
};

export const hidePdfDownloadLoader = (): void => {
  PdfDownloadLoaderManager.getInstance().hideLoader();
};

// Expose globally so external scripts or components can call it without imports
if (typeof globalThis !== 'undefined') {
  (globalThis as any).showPdfDownloadLoader = showPdfDownloadLoader;
  (globalThis as any).hidePdfDownloadLoader = hidePdfDownloadLoader;
}
if (typeof global !== 'undefined') {
  (global as any).showPdfDownloadLoader = showPdfDownloadLoader;
  (global as any).hidePdfDownloadLoader = hidePdfDownloadLoader;
}

export default PdfDownloadLoaderManager;

