var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var init_esm_shims = __esm({
  "node_modules/tsup/assets/esm_shims.js"() {
  }
});

// bot-sdk/components/LazyCommunications.tsx
init_esm_shims();
import React2, { Component } from "react";
import { View as View2, Text as Text2, StyleSheet as StyleSheet2, Alert, Linking, Platform } from "react-native";

// bot-sdk/utils/LazyLoader.tsx
init_esm_shims();
import React, { Suspense } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
var LazyLoader = class {
  static cache = /* @__PURE__ */ new Map();
  /**
   * Dynamically import a module with caching
   */
  static async importModule(importFn, moduleKey) {
    if (this.cache.has(moduleKey)) {
      return this.cache.get(moduleKey);
    }
    const modulePromise = importFn().then((module) => module.default);
    this.cache.set(moduleKey, modulePromise);
    return modulePromise;
  }
  /**
   * Create a lazy React component with error boundary
   */
  static createLazyComponent(importFn, fallback, errorFallback) {
    return React.lazy(importFn);
  }
  /**
   * Higher-order component for lazy loading with custom loading states
   */
  static withLazyLoading(importFn, options = {}) {
    const LazyComponent = React.lazy(importFn);
    return (props) => /* @__PURE__ */ React.createElement(
      Suspense,
      {
        fallback: options.fallback || /* @__PURE__ */ React.createElement(View, { style: styles.loadingContainer }, /* @__PURE__ */ React.createElement(ActivityIndicator, { size: "small", color: "#4ECDC4" }), /* @__PURE__ */ React.createElement(Text, { style: styles.loadingText }, options.loadingText || "Loading..."))
      },
      /* @__PURE__ */ React.createElement(LazyComponent, { ...props })
    );
  }
};
var DefaultLoader = ({ text = "Loading..." }) => /* @__PURE__ */ React.createElement(View, { style: styles.loadingContainer }, /* @__PURE__ */ React.createElement(ActivityIndicator, { size: "small", color: "#4ECDC4" }), /* @__PURE__ */ React.createElement(Text, { style: styles.loadingText }, text));
var ErrorFallback = ({
  error = "Failed to load component"
}) => /* @__PURE__ */ React.createElement(View, { style: styles.errorContainer }, /* @__PURE__ */ React.createElement(Text, { style: styles.errorText }, error));
var styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffebee"
  },
  errorText: {
    fontSize: 14,
    color: "#c62828",
    textAlign: "center"
  }
});

// bot-sdk/components/LazyCommunications.tsx
var LazyCommunications = class extends Component {
  mounted = true;
  constructor(props) {
    super(props);
    this.state = {
      CommunicationsModule: null,
      isLoading: false,
      loadError: null
    };
  }
  componentDidMount() {
    if (this.props.autoLoad !== false) {
      this.loadCommunications();
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  async loadCommunications() {
    if (this.state.CommunicationsModule || this.state.isLoading) {
      return this.state.CommunicationsModule;
    }
    this.setState({ isLoading: true, loadError: null });
    try {
      const CommunicationsModule = await LazyLoader.importModule(
        () => import("react-native-communications"),
        "communications"
      );
      if (this.mounted) {
        const Communications = CommunicationsModule || null;
        if (!Communications || !Communications.phonecall) {
          throw new Error("Communications module or required methods not found");
        }
        this.setState({
          CommunicationsModule: Communications,
          isLoading: false,
          loadError: null
        });
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(Communications);
        }
        return Communications;
      }
    } catch (error) {
      console.warn("Failed to load Communications:", error);
      if (this.mounted) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.setState({
          CommunicationsModule: null,
          isLoading: false,
          loadError: errorMessage
        });
        if (this.props.onModuleLoaded) {
          this.props.onModuleLoaded(null);
        }
      }
    }
    return null;
  }
  async phonecall(phoneNumber, prompt = false) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.phonecall(phoneNumber, prompt);
  }
  async email(to, cc, bcc, subject, body) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.email(to, cc, bcc, subject, body);
  }
  async text(phoneNumber, body) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.text(phoneNumber, body);
  }
  async web(url) {
    const communications = await this.loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.web(url);
  }
  render() {
    const {
      fallbackComponent: FallbackComponent,
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent
    } = this.props;
    const { CommunicationsModule, isLoading, loadError } = this.state;
    if (isLoading) {
      if (LoadingComponent) {
        return /* @__PURE__ */ React2.createElement(LoadingComponent, null);
      }
      return /* @__PURE__ */ React2.createElement(DefaultLoader, { text: "Loading communications..." });
    }
    if (loadError) {
      if (ErrorComponent) {
        return /* @__PURE__ */ React2.createElement(ErrorComponent, { error: loadError });
      }
      if (FallbackComponent) {
        return /* @__PURE__ */ React2.createElement(FallbackComponent, null);
      }
      return /* @__PURE__ */ React2.createElement(ErrorFallback, { error: `Communications unavailable: ${loadError}` });
    }
    if (CommunicationsModule) {
      return /* @__PURE__ */ React2.createElement(View2, { style: styles2.readyContainer }, /* @__PURE__ */ React2.createElement(Text2, { style: styles2.readyText }, "Communications ready"));
    }
    return /* @__PURE__ */ React2.createElement(DefaultLoader, { text: "Initializing communications..." });
  }
};
var useLazyCommunications = () => {
  const [state, setState] = React2.useState({
    CommunicationsModule: null,
    isLoading: false,
    loadError: null
  });
  const loadCommunications = React2.useCallback(async () => {
    if (state.CommunicationsModule || state.isLoading) {
      return state.CommunicationsModule;
    }
    setState((prev) => ({ ...prev, isLoading: true, loadError: null }));
    try {
      const CommunicationsModule = await LazyLoader.importModule(
        () => import("react-native-communications"),
        "communications"
      );
      const Communications = CommunicationsModule || null;
      if (!Communications || !Communications.phonecall) {
        throw new Error("Communications module or required methods not found");
      }
      setState({
        CommunicationsModule: Communications,
        isLoading: false,
        loadError: null
      });
      return Communications;
    } catch (error) {
      console.warn("Failed to load Communications:", error);
      setState({
        CommunicationsModule: null,
        isLoading: false,
        loadError: error instanceof Error ? error.message : "Unknown error"
      });
      return null;
    }
  }, [state.CommunicationsModule, state.isLoading]);
  const phonecall = React2.useCallback(async (phoneNumber, prompt = false) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.phonecall(phoneNumber, prompt);
  }, [loadCommunications]);
  const email = React2.useCallback(async (to, cc, bcc, subject, body) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.email(to, cc, bcc, subject, body);
  }, [loadCommunications]);
  const text = React2.useCallback(async (phoneNumber, body) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.text(phoneNumber, body);
  }, [loadCommunications]);
  const web = React2.useCallback(async (url) => {
    const communications = await loadCommunications();
    if (!communications) {
      throw new Error("Communications not available");
    }
    return communications.web(url);
  }, [loadCommunications]);
  React2.useEffect(() => {
    loadCommunications();
  }, [loadCommunications]);
  return {
    CommunicationsModule: state.CommunicationsModule,
    isLoading: state.isLoading,
    loadError: state.loadError,
    loadCommunications,
    phonecall,
    email,
    text,
    web
  };
};
var FallbackCommunications = ({
  onError
}) => {
  React2.useEffect(() => {
    if (onError) {
      onError("Communications not available, using basic Linking fallback");
    }
  }, [onError]);
  return /* @__PURE__ */ React2.createElement(View2, { style: styles2.fallbackContainer }, /* @__PURE__ */ React2.createElement(Text2, { style: styles2.fallbackText }, "Communications not available"), /* @__PURE__ */ React2.createElement(Text2, { style: styles2.fallbackSubText }, "Using basic device linking capabilities"));
};
var FallbackCommunicationsAPI = {
  phonecall: (phoneNumber, prompt = false) => {
    const url = `tel:${phoneNumber}`;
    if (prompt) {
      Alert.alert(
        "Make Phone Call",
        `Call ${phoneNumber}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Call", onPress: () => Linking.openURL(url) }
        ]
      );
    } else {
      Linking.openURL(url).catch((err) => console.error("Failed to make phone call:", err));
    }
  },
  email: (to, cc, bcc, subject, body) => {
    let url = "mailto:";
    if (to && to.length > 0) {
      url += to.join(",");
    }
    const params = [];
    if (subject)
      params.push(`subject=${encodeURIComponent(subject)}`);
    if (body)
      params.push(`body=${encodeURIComponent(body)}`);
    if (cc && cc.length > 0)
      params.push(`cc=${cc.join(",")}`);
    if (bcc && bcc.length > 0)
      params.push(`bcc=${bcc.join(",")}`);
    if (params.length > 0) {
      url += "?" + params.join("&");
    }
    Linking.openURL(url).catch((err) => console.error("Failed to open email:", err));
  },
  text: (phoneNumber, body) => {
    let url = "sms:";
    if (phoneNumber) {
      url += phoneNumber;
    }
    if (body) {
      url += Platform.OS === "ios" ? `&body=${encodeURIComponent(body)}` : `?body=${encodeURIComponent(body)}`;
    }
    Linking.openURL(url).catch((err) => console.error("Failed to open SMS:", err));
  },
  web: (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  }
};
var styles2 = StyleSheet2.create({
  readyContainer: {
    padding: 16,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  readyText: {
    fontSize: 14,
    color: "#2e7d2e",
    fontWeight: "500"
  },
  fallbackContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100
  },
  fallbackText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8
  },
  fallbackSubText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center"
  }
});
var LazyCommunications_default = LazyCommunications;

export {
  __require,
  __esm,
  __export,
  __toCommonJS,
  init_esm_shims,
  LazyLoader,
  DefaultLoader,
  ErrorFallback,
  LazyCommunications,
  useLazyCommunications,
  FallbackCommunications,
  FallbackCommunicationsAPI,
  LazyCommunications_default
};
