import { Linking } from 'react-native';

const WWW_URL_PATTERN = /^www\./i;

export type ExternalLinkClickHandler = (url: string, item?: any) => void;

let activeExternalLinkHandler: ExternalLinkClickHandler | null = null;

/**
 * Registers the active KoreChat `onExternalLinkClick` callback.
 * When registered, external URL clicks are delegated to the host app
 * instead of opening automatically via `Linking.openURL`.
 */
export function registerExternalLinkHandler(
  handler: ExternalLinkClickHandler | null,
): void {
  activeExternalLinkHandler = handler;
}

/**
 * Clears the registered external link callback if it matches the provided reference
 * (or unconditionally if no handler is passed).
 */
export function unregisterExternalLinkHandler(
  handler?: ExternalLinkClickHandler | null,
): void {
  if (!handler || activeExternalLinkHandler === handler) {
    activeExternalLinkHandler = null;
  }
}

/**
 * Normalizes a raw URL or markdown link string into a full URL string.
 */
export function normalizeExternalUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '';
  }
  let targetUrl = rawUrl.trim();
  const markdownMatch = targetUrl.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (markdownMatch && markdownMatch[2]) {
    targetUrl = markdownMatch[2].trim();
  }
  if (!targetUrl) {
    return '';
  }
  if (WWW_URL_PATTERN.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  } else if (
    !targetUrl.startsWith('http://') &&
    !targetUrl.startsWith('https://') &&
    !targetUrl.includes('://') &&
    !targetUrl.startsWith('mailto:') &&
    !targetUrl.startsWith('tel:')
  ) {
    targetUrl = `https://${targetUrl}`;
  }
  return targetUrl;
}

/**
 * Handles an external URL click inside the chatbot:
 * - If `onExternalLinkClick` is registered on `<KoreChat />`, invokes it with
 *   the full URL and stops default `Linking.openURL` handling.
 * - Otherwise, opens the URL directly via `Linking.openURL`.
 */
export function handleExternalLinkPress(
  rawUrl: string,
  item?: Record<string, any>,
): boolean {
  const targetUrl = normalizeExternalUrl(rawUrl);
  if (!targetUrl) {
    return false;
  }

  console.log(
    '🔗 [Link Clicked]:',
    targetUrl,
    rawUrl !== targetUrl ? `(original: "${rawUrl}")` : '',
  );

  if (activeExternalLinkHandler) {
    try {
      activeExternalLinkHandler(targetUrl, {
        ...(item && typeof item === 'object' ? item : {}),
        url: targetUrl,
      });
    } catch (err) {
      console.warn('onExternalLinkClick callback error:', err);
    }
    return true;
  }

  Linking.canOpenURL(targetUrl)
    .then(supported => {
      if (supported) {
        Linking.openURL(targetUrl).catch(err => {
          console.warn('Cannot open URL:', targetUrl, err);
        });
      } else {
        // On Android 11+ (API 30+), canOpenURL may return false if <queries>
        // is not declared in AndroidManifest.xml, but openURL still opens the default browser.
        Linking.openURL(targetUrl).catch(err => {
          console.warn('Cannot open URL via fallback:', targetUrl, err);
        });
      }
    })
    .catch(() => {
      Linking.openURL(targetUrl).catch(openErr => {
        console.warn('Cannot open URL:', targetUrl, openErr);
      });
    });

  return true;
}

