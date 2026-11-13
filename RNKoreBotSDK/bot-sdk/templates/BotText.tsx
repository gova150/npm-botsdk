import * as React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import { FallbackCommunicationsAPI } from '../components/LazyCommunications';

import {TEMPLATE_STYLE_VALUES, leftBubbleStyles} from '../theme/styles';

import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {ThemeContext} from '../theme/ThemeContext';
import {botStyles} from '../theme/styles';
import {getBubbleTheme, getButtonTheme} from '../theme/themeHelper';
import ParsedText from 'react-native-parsed-text';
import {getParseList} from '../utils/ParseList';

const WWW_URL_PATTERN = /^www\./i;

//const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];

export interface BotTextProps extends BaseViewProps {
  text?: string;
  optionTitles?: [];
  isFromViewMore?: boolean;
  isLastMsz?: boolean;
  isFilterApply?: boolean;
  text_color?: any;
}
export interface BotTextState extends BaseViewState {}

export default class BotText extends BaseView<BotTextProps, BotTextState> {
  static contextType = ThemeContext;
  // static contextTypes: {
  //   actionSheet: PropTypes.Requireable<(...args: any[]) => any>;
  // };
  //static BotText: {};

  static defaultProps: {
    position: 'left';
    optionTitles: ['Call', 'Text', 'Cancel'];
    isFilterApply: false;
    text_color: undefined;
  };
  // shouldComponentUpdate(nextProps: any) {
  //   return (
  //     !!this.props.text &&
  //     !!nextProps.text &&
  //     this.props.text !== nextProps.text
  //   );
  // }

  onLinkCallback = (url: any) => {
    let isErrorResult = false;

    return new Promise<void>((resolve, reject) => {
      isErrorResult = this.onUrlPress(url);
      isErrorResult ? reject() : resolve();
    });
  };

  private onUrlPress = (url: string) => {
    if (!url || typeof url !== 'string') {
      return false;
    }
    let targetUrl = url.trim();
    const markdownMatch = targetUrl.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownMatch && markdownMatch[2]) {
      targetUrl = markdownMatch[2].trim();
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

    console.log('🔗 [Link Clicked]:', targetUrl, url !== targetUrl ? `(original: "${url}")` : '');

    Linking.canOpenURL(targetUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(targetUrl).catch(err => {
            console.warn('Cannot open URL:', targetUrl, err);
          });
        } else {
          Linking.openURL(targetUrl).catch(err => {
            console.warn('Cannot open URL via fallback:', targetUrl, err);
          });
        }
      })
      .catch(() => {
        Linking.openURL(targetUrl).catch(err => {
          console.warn('Cannot open URL:', targetUrl, err);
        });
      });
    return true;
  };

  // private onPhonePress = (phone: string | null | undefined) => {
  //   const {optionTitles} = this.props;
  //   const options =
  //     optionTitles && optionTitles.length > 0
  //       ? optionTitles.slice(0, 3)
  //       : DEFAULT_OPTION_TITLES;
  //   const cancelButtonIndex = options.length - 1;
  //   // this.context.actionSheet().showActionSheetWithOptions(
  //   //   {
  //   //     options,
  //   //     cancelButtonIndex,
  //   //   },
  //   //   buttonIndex => {
  //   //     switch (buttonIndex) {
  //   //       case 0:
  //   //         Communications.phonecall(phone, true);
  //   //         break;
  //   //       case 1:
  //   //         Communications.text(phone);
  //   //         break;
  //   //       default:
  //   //         break;
  //   //     }
  //   //   },
  //   // );
  // };

  isViewDisable = () => {
    if (this.props.isFromViewMore) {
      return false;
    }

    return !this.props?.isLastMsz;
  };

  private onEmailPress = async (email: string) => {
    try {
      // Try to dynamically load react-native-communications
      const { useLazyCommunications } = await import('../components/LazyCommunications');
      const communications = await this.loadCommunications();
      if (communications) {
        communications.email([email], null, null, null, null);
      } else {
        // Fallback to basic Linking API
        FallbackCommunicationsAPI.email([email], null, null, null, null);
      }
    } catch (error) {
      console.warn('Failed to load communications, using fallback:', error);
      // Fallback to basic Linking API
      FallbackCommunicationsAPI.email([email], null, null, null, null);
    }
  };

  private async loadCommunications() {
    try {
      const CommunicationsModule = await import('react-native-communications');
      return CommunicationsModule.default || CommunicationsModule;
    } catch (error) {
      console.warn('react-native-communications not available:', error);
      return null;
    }
  }
  render() {
    let text = this.props?.text;
    const theme = (this.props?.theme || this.context) as any;
    const bodyBtn =
      (theme?.v3?.body as any)?.buttons ||
      (theme?.v3?.body as any)?.button;
    const buttonTheme = getButtonTheme(theme);
    const brandingBtnBg = buttonTheme?.ACTIVE_BG_COLOR || '#002259';
    const brandingBtnText = buttonTheme?.ACTIVE_TXT_COLOR || '#FFFFFF';
    const brandingBtnBorder =
      bodyBtn?.border_color || bodyBtn?.borderColor || brandingBtnBg;

    const bubbleTheme = getBubbleTheme(theme);

    return text ? (
      <View style={{flexWrap: 'wrap', marginBottom: 5, marginEnd: 30}}>
        <View
          pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
          style={[
            styles.container,
            {
              backgroundColor: bubbleTheme.BUBBLE_LEFT_BG_COLOR,
            },
            leftBubbleStyles[
              theme?.v3?.body?.bubble_style || 'balloon'
            ].bubble_style,
          ]}>
          <ParsedText
            style={[
              styles.text,
              {
                color: bubbleTheme.BUBBLE_LEFT_TEXT_COLOR,
                fontFamily: theme?.v3?.body?.font?.family || 'Inter',
              },
              botStyles[theme?.v3?.body?.font?.size || 'medium']
                ?.size,
              this.props.text_color && {
                color: this.props.text_color,
              },
            ]}
            parse={getParseList(theme, brandingBtnBorder)}>
            {this.props.isFilterApply
              ? text.toString().replace(/\s\s+/g, '\n').trim()
              : text.trim()}
          </ParsedText>
        </View>
      </View>
    ) : (
      <></>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#202124',
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    //backgroundColor: 'red', //'#EFF0F0',
    // marginRight: 30,
    //flexWrap: 'wrap',
    marginLeft: 0,
    minHeight: 10,
    justifyContent: 'center',
  },
});
