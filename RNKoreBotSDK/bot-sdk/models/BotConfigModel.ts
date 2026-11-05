/**
 * Bot configuration model for Kore.ai Bot SDK.
 * Supports:
 * 1. Pre-fetched static JWT token (`jwtToken`)
 * 2. Enterprise dynamic token callback for expiry & reconnects (`getJwtToken`)
 * 3. Legacy STS credentials (`clientId`, `clientSecret`, `identity`, `value_aud`)
 */
export interface BotConfigModel {
  botName: string;
  botId: string;
  botUrl: string;
  jwtToken?: string; // Pre-fetched token from your corporate API
  getJwtToken?: () => Promise<string> | string; // Function to get a fresh token dynamically (at startup and on reconnect/expiry)

  // Optional (only needed if generating test tokens via Kore STS):
  clientId?: string;
  clientSecret?: string;
  identity?: string;
  jwtServerUrl?: string;
  value_aud?: string;
  isWebHook?: boolean;
  isHeaderVisible?: boolean;
  isFooterVisible?: boolean;

  [key: string]: any;
}

export default BotConfigModel;

