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
 * 3. Custom data object (`customData`)
 * 4. Guarantees `botInfo` is ALWAYS initialized on the client instance so
 *    Kore.ai's `/api/oAuth/token/jwtgrant`, `/api/rtm/start`, and message endpoints
 *    receive valid bot credentials and custom data without requiring fake `clientId`/`clientSecret`.
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
      const identity = cfg.identity || client.userInfo?.identity || '';
      const userName = cfg.userName || '';

      // Extract customData (React Native style)
      const userCustomData =
        cfg.customData ||
        cfg.botCustomData ||
        client.customData ||
        {};

      const mergedCustomData: Record<string, any> = {
        ...(typeof userCustomData === 'object' && !Array.isArray(userCustomData)
          ? userCustomData
          : {}),
        ...(identity ? { identity } : {}),
        ...(userName ? { userName } : {}),
      };

      if (!client.botCustomData) {
        client.botCustomData = new Map();
      }
      if (client.botCustomData?.set) {
        for (const [key, value] of Object.entries(mergedCustomData)) {
          client.botCustomData.set(key, value);
        }
      }

      client.customData = mergedCustomData;
      client.botUrl = cfg.botUrl || client.botUrl || '';

      // Set internal botInfo required by Kore.ai backend
      client.botInfo = {
        chatBot: botName,
        taskBotId: botId,
        botName: botName,
        botId: botId,
        name: botName,
        _id: botId,
        customData: mergedCustomData,
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

      const botName = config.botName;
      const botId = config.botId;

      const hasDynamicToken =
        typeof config.getJwtToken === 'function' ||
        (config.getJwtToken && typeof config.getJwtToken.then === 'function');
      const hasStaticToken =
        (typeof config.jwtToken === 'string' && config.jwtToken.length > 0) ||
        (typeof config.getJwtToken === 'string' && config.getJwtToken.length > 0);

      if (hasDynamicToken || hasStaticToken) {
        if (!botId || !config.botUrl || !botName) {
          throw new Error(
            'BotConfigModel requires botName, botId, and botUrl when jwtToken or getJwtToken is provided',
          );
        }
      } else {
        // Legacy STS validation (only needed if generating test tokens via Kore STS endpoint)
        if (
          !botId ||
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

    // 4. Runtime helpers to dynamically update or get customData on the client instance
    proto.setCustomData = function (customData: any) {
      if (!customData || typeof customData !== 'object') return;
      const existing = this.botInfo?.customData || this.customData || {};
      const updated = { ...existing, ...customData };
      this.customData = updated;
      if (!this.botInfo) {
        this.botInfo = {};
      }
      this.botInfo.customData = updated;
      if (!this.botCustomData) {
        this.botCustomData = new Map();
      }
      if (this.botCustomData?.set) {
        for (const [k, v] of Object.entries(updated)) {
          this.botCustomData.set(k, v);
        }
      }
    };

    proto.getCustomData = function () {
      return this.botInfo?.customData || this.customData || {};
    };

    // 5. Log all outgoing and incoming WebSocket messages and ensure customData is attached to messages
    const originalSend = proto.send;
    proto.send = function (message: any) {
      if (message) {
        // Ensure customData is synchronized onto outgoing message payload and botInfo
        const customData =
          this.botInfo?.customData ||
          this.customData ||
          this.botConfig?.customData;

        if (customData && typeof customData === 'object') {
          if (this.botInfo) {
            this.botInfo.customData = {
              ...(this.botInfo.customData || {}),
              ...customData,
            };
          }
          if (message.botInfo) {
            message.botInfo.customData = {
              ...(message.botInfo.customData || {}),
              ...customData,
            };
          }
          if (message.message) {
            message.message.customData = {
              ...(message.message.customData || {}),
              ...customData,
            };
          }
        }

        if (message.type !== 'ping') {
          console.log('📤 [WebSocket Sent]:', JSON.stringify(message, null, 2));
        }
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

    // Chat session caching & minimize state helpers
    let cachedMessagesList: any[] = [];
    let isClientMinimized = false;
    const sessionResetListeners = new Set<() => void>();

    proto.setCachedMessages = function (messages: any[]) {
      cachedMessagesList = Array.isArray(messages) ? [...messages] : [];
    };

    proto.getCachedMessages = function () {
      return cachedMessagesList;
    };

    proto.clearCachedMessages = function () {
      cachedMessagesList = [];
    };

    proto.setMinimized = function (minimized: boolean) {
      isClientMinimized = !!minimized;
    };

    proto.isMinimized = function () {
      return isClientMinimized;
    };

    proto.onSessionReset = function (listener: () => void) {
      if (typeof listener === 'function') {
        sessionResetListeners.add(listener);
      }
      return () => {
        sessionResetListeners.delete(listener);
      };
    };

    proto.clearMinimizeState = function () {
      cachedMessagesList = [];
      isClientMinimized = false;
    };

    proto.resetSession = function () {
      this.clearMinimizeState();

      try {
        sessionResetListeners.forEach(listener => {
          try {
            listener();
          } catch (e) {}
        });
      } catch (e) {}

      try {
        if (typeof this.disconnect === 'function') {
          this.disconnect();
        }
      } catch (e) {}

      this.jwtToken = undefined;
      this.userInfo = null;
      this.authorization = null;
      this.botConfig = undefined;
      this.customData = undefined;
      this.botCustomData = new Map();
      this.botInfo = undefined;
    };
  } catch (e) {
    // Fail-safe
  }
}

/**
 * Resets the active Kore chatbot session, clearing minimized/cached
 * message state, disconnecting the WebSocket, and clearing stored user/auth context.
 * Call this when a user logs out of the host application.
 */
export function resetSession(): void {
  try {
    applyKoreBotClientPatches();
    const client: any = KoreBotClient.getInstance();
    if (typeof client?.resetSession === 'function') {
      client.resetSession();
    } else if (typeof client?.disconnect === 'function') {
      client.disconnect();
    }
  } catch (err) {
    console.warn('Error resetting KoreBot session:', err);
  }
}

// Automatically apply patches upon module load
applyKoreBotClientPatches();
