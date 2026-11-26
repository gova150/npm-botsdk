import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getWindowWidth} from '../charts';
import {
  extractLiveAgentInfo,
  sanitizeHtmlToPlainText,
} from '../utils/helpers';
import {LiveAgentHeadsetIcon} from '../assets/composebarIcons';
import Time from '../chat/components/Time';
import {ThemeContext} from '../theme/ThemeContext';

export interface LiveAgentTemplateProps extends BaseViewProps {
  payload?: any;
  theme?: any;
  currentMessage?: any;
}

export interface LiveAgentTemplateState extends BaseViewState {}

export default class LiveAgentTemplate extends BaseView<
  LiveAgentTemplateProps,
  LiveAgentTemplateState
> {
  static contextType = ThemeContext;

  render() {
    const {payload, currentMessage} = this.props;
    const theme = (this.props?.theme || this.context) as any;

    const liveAgentInfo = extractLiveAgentInfo(currentMessage || payload);
    const rawText =
      liveAgentInfo?.text ||
      payload?.text ||
      payload?.payload?.text ||
      currentMessage?.message?.[0]?.component?.payload?.text ||
      '';

    const displayText = sanitizeHtmlToPlainText(rawText);

    if (!displayText) {
      return null;
    }

    const fontFamily =
      theme?.v3?.body?.font?.family ||
      TEMPLATE_STYLE_VALUES.FONT_FAMILY ||
      'Inter';

    const createdOn: any =
      currentMessage?.createdOn ||
      currentMessage?.created_at ||
      currentMessage?.timeMillis ||
      payload?.createdOn ||
      currentMessage?.message?.[0]?.component?.payload?.createdOn ||
      currentMessage?.message?.[0]?.createdOn ||
      new Date().toISOString();

    const isSystemSender = liveAgentInfo?.senderType === 'system';

    return (
      <View style={[styles.container, isSystemSender && styles.systemContainer]}>
        <View style={styles.iconContainer}>
          <LiveAgentHeadsetIcon width={18} height={20} color="#333333" />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.messageText,
              {fontFamily},
            ]}>
            {displayText}
          </Text>
        </View>

        <View style={styles.timestampContainer}>
          <Time
            createdOn={createdOn}
            position="center"
            theme={theme}
            textColor="#666666"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemContainer: {
    marginTop: 32,
  },
  iconContainer: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 9,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  textContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: Math.min(getWindowWidth() * 0.85, 360),
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    color: '#333333',
    textAlign: 'center',
  },
  timestampContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

