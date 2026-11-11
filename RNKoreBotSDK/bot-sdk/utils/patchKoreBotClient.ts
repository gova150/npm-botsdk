import { Platform } from 'react-native';
import KoreBotClient, {
  RTM_EVENT,
  APP_STATE,
  ApiService,
} from 'rn-kore-bot-socket-lib-v79';

/**
 * Patches KoreBotClient prototype to properly support:
 * 1. Enterprise dynamic JWT token callback (`getJwtToken`)
 * 2. Pre-fetched static JWT token (`jwtToken`)
 * 3. Guarantees `botInfo` is ALWAYS initialized on the client instance so
 *    Kore.ai's `/api/oAuth/token/jwtgrant`, `/api/rtm/start`, and message endpoints
 *    receive valid bot credentials without requiring fake `clientId`/`clientSecret`.
 */
export function applyKoreBotClientPatches() {
  try {
    const clientInstance = KoreBotClient.getInstance();
    const proto = Object.getPrototypeOf(clientInstance);
    if (!proto || proto.__hasJwtPatchV2) {
      return;
    }
    proto.__hasJwtPatchV2 = true;

    // Helper to safely populate botInfo on the KoreBotClient instance
    const ensureBotInfo = (client: any, config?: any) => {
      const cfg = config || client?.botConfig;
      if (!cfg) return;

      const botName = cfg.botName || '';
      const botId = cfg.botId || '';
      const identity = cfg.identity || '';
      const userName = cfg.userName || '';

      if (!client.botCustomData) {
        client.botCustomData = new Map();
      }
      if (client.botCustomData?.set) {
        client.botCustomData.set('identity', identity);
        client.botCustomData.set('username', userName);
      }

      client.botUrl = cfg.botUrl || client.botUrl || '';

      // Set botInfo with all naming conventions expected across Kore.ai backends
      client.botInfo = {
        chatBot: botName,
        taskBotId: botId,
        botName: botName,
        botId: botId,
        name: botName,
        _id: botId,
        customData: {
          identity: identity,
          userName: userName,
        },
        channelClient: Platform.OS,
      };

      if (typeof client.initialize === 'function') {
        client.initialize(client.botInfo, client.botCustomData);
      }
    };

    // 1. Patch initializeBotClient: Allow JWT auth (getJwtToken or jwtToken) without clientId/clientSecret
    proto.initializeBotClient = function (config: any, isFirstTime?: boolean) {
      if (!config) {
        throw new Error('BotConfigModel object cannot be null');
      }

      const hasDynamicToken =
        typeof config.getJwtToken === 'function' ||
        (config.getJwtToken && typeof config.getJwtToken.then === 'function');
      const hasStaticToken =
        (typeof config.jwtToken === 'string' && config.jwtToken.length > 0) ||
        (typeof config.getJwtToken === 'string' && config.getJwtToken.length > 0);

      if (hasDynamicToken || hasStaticToken) {
        if (!config.botId || !config.botUrl || !config.botName) {
          throw new Error(
            'BotConfigModel requires botName, botId, and botUrl when jwtToken or getJwtToken is provided',
          );
        }
      } else {
        // Legacy STS validation (only needed if generating test tokens via Kore STS endpoint)
        if (
          !config.botId ||
          !config.clientId ||
          !config.clientSecret ||
          !config.botUrl ||
          !config.identity ||
          !config.value_aud
        ) {
          throw new Error('BotConfigModel object has some values are missing');
        }
      }

      this.botConfig = config;
      ensureBotInfo(this, config);
      this.connectToBot(config, isFirstTime);
    };

    // 2. Patch createJwtToken: Ensure botInfo is set before JWTGrant and support both async callback and static tokens
    const originalCreateJwtToken = proto.createJwtToken;
    proto.createJwtToken = async function (
      config: any,
      isFirstTime: boolean = true,
    ) {
      if (!this.botConfig && config) {
        this.botConfig = config;
      }
      if (!this.botConfig) return;

      ensureBotInfo(this, config || this.botConfig);

      const hasDynamicResolver = typeof this.botConfig?.getJwtToken === 'function';
      const hasDirectToken =
        typeof this.botConfig?.jwtToken === 'string' && this.botConfig.jwtToken.length > 0;
      const hasPromiseToken =
        (this.botConfig?.getJwtToken && typeof this.botConfig.getJwtToken.then === 'function') ||
        (this.botConfig?.jwtToken && typeof this.botConfig.jwtToken.then === 'function');
      const hasStringGetJwtToken =
        typeof this.botConfig?.getJwtToken === 'string' && this.botConfig.getJwtToken.length > 0;

      if (hasDynamicResolver || hasDirectToken || hasPromiseToken || hasStringGetJwtToken) {
        try {
          if (hasDynamicResolver) {
            this.jwtToken = await this.botConfig.getJwtToken();
          } else if (hasPromiseToken) {
            this.jwtToken = await (this.botConfig.getJwtToken || this.botConfig.jwtToken);
          } else if (hasDirectToken) {
            this.jwtToken = this.botConfig.jwtToken;
          } else {
            this.jwtToken = this.botConfig.getJwtToken;
          }

          if (!this.jwtToken || typeof this.jwtToken !== 'string') {
            throw new Error('Invalid JWT token returned: expected non-empty string');
          }

          if (!this.botConfig?.isWebHook) {
            await this.connectWithJwToken(this.jwtToken, !isFirstTime);
          } else {
            this.getWebhookMeta(this.botConfig, isFirstTime);
          }
          return;
        } catch (err: any) {
          this.emit(RTM_EVENT.ERROR, {
            message: 'Failed to get JWT token: ' + (err?.message || err),
            isBack: false,
          });
          return;
        }
      }

      return originalCreateJwtToken.call(this, config, isFirstTime);
    };

    // 3. Patch connectWithJwToken: Ensure botInfo is present and surface clear error messages on failure
    proto.connectWithJwToken = async function (
      jwtToken: string,
      isReconnectionAttempt: boolean,
    ) {
      if (this.isConnecting) {
        return false;
      }
      this.jwtToken = jwtToken;
      ensureBotInfo(this);

      const apiService = new ApiService(this.botConfig?.botUrl + '', this);
      await apiService.getJwtGrant(
        jwtToken,
        isReconnectionAttempt,
        () => {
          this.emit(RTM_EVENT.CONNECTING);
        },
        async (response: any) => {
          this.userInfo = response.userInfo;
          this.authorization = response.authorization;
          this.emit(RTM_EVENT.ON_JWT_TOKEN_AUTHORIZED);
          if (this.appState === APP_STATE.ACTIVE) {
            await this.initSocketConnection(isReconnectionAttempt);
          }
        },
        (error: any) => {
          this.emit(RTM_EVENT.ERROR, {
            message:
              'JWT Grant Authorization Failed: ' +
              (error?.message || error || 'Please verify bot configuration and JWT token'),
            isBack: false,
          });
        },
      );
      return true;
    };

    // 4. Log all outgoing and incoming WebSocket messages for complete debugging visibility
    const originalSend = proto.send;
    proto.send = function (message: any) {
      if (message && message.type !== 'ping') {
        console.log('📤 [WebSocket Sent]:', JSON.stringify(message, null, 2));
      }
      return originalSend.call(this, message);
    };

    const originalOnMessage = proto.onMessage;
    proto.onMessage = function (messageData: any, isJsonObj: boolean = false) {
      try {
        const parsed = isJsonObj ? messageData : JSON.parse(messageData);
        if (parsed?.type !== 'pong') {
          console.log('📥 [WebSocket Received]:', JSON.stringify(parsed, null, 2));
        }
      } catch (e) {}
      return originalOnMessage.call(this, messageData, isJsonObj);
    };
  } catch (e) {
    // Fail-safe
  }
}

// Automatically apply patches upon module load
applyKoreBotClientPatches();

