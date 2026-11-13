type LoaderListener = (loading: boolean, success?: boolean) => void;

class PdfDownloadLoaderManager {
  private static instance: PdfDownloadLoaderManager;
  private listeners: Set<LoaderListener> = new Set();
  private isLoading: boolean = false;
  private timeoutId: any = null;

  private constructor() {}

  public static getInstance(): PdfDownloadLoaderManager {
    if (!PdfDownloadLoaderManager.instance) {
      PdfDownloadLoaderManager.instance = new PdfDownloadLoaderManager();
    }
    return PdfDownloadLoaderManager.instance;
  }

  public showLoader(timeoutMs: number = 25000): void {
    this.isLoading = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Safety auto-dismiss: if bot or network never responds, clear spinner after 25s
    // Not able to download -> success is false
    this.timeoutId = setTimeout(() => {
      this.hideLoader(false);
    }, timeoutMs);

    this.listeners.forEach(listener => {
      try {
        listener(true);
      } catch (e) {
        console.warn('PdfDownloadLoader listener error:', e);
      }
    });
  }

  public hideLoader(success: boolean = false): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isLoading = false;
    this.listeners.forEach(listener => {
      try {
        listener(false, success);
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

export const hidePdfDownloadLoader = (success: boolean = false): void => {
  PdfDownloadLoaderManager.getInstance().hideLoader(success);
};

export default PdfDownloadLoaderManager;

