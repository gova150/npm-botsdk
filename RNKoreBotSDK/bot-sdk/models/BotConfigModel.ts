/**
 * Bot configuration model for Kore.ai Bot SDK (React Native).
 * Supports:
 * 1. Pre-fetched static JWT token (`jwtToken`)
 * 2. Enterprise dynamic token callback for expiry & reconnects (`getJwtToken`)
 * 3. Custom data object (`customData`)
 * 4. Legacy STS credentials (`clientId`, `clientSecret`, `identity`, `value_aud`)
 */
export interface BotConfigModel {
  botName: string;
  botId: string;
  botUrl: string;
  jwtToken?: string; // Pre-fetched token from your corporate API
  getJwtToken?: () => Promise<string> | string; // Function to get a fresh token dynamically (at startup and on reconnect/expiry)

  // Custom data object passed to the bot
  customData?: Record<string, any>;

  // Optional (only needed if generating test tokens via Kore STS):
  clientId?: string;
  clientSecret?: string;
  identity?: string;
  userName?: string;
  jwtServerUrl?: string;
  value_aud?: string;
  isWebHook?: boolean;
  isHeaderVisible?: boolean;
  isFooterVisible?: boolean;

  [key: string]: any;
}

export default BotConfigModel;
