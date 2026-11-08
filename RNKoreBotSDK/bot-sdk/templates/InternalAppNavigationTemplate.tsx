import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../theme/Color';
import {botStyles, TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getBubbleTheme, getButtonTheme} from '../theme/themeHelper';
import {TEMPLATE_TYPES, BubbleTheme, ButtonTheme} from '../constants/Constant';
import {getWindowWidth} from '../charts';

export interface InternalAppNavigationButtonItem {
  type?: string;
  title?: string;
  navigationUrl?: string;
  [key: string]: any;
}

export interface InternalAppNavigationPayloadData {
  template_type?: string;
  title?: string;
  text?: string;
  heading?: string;
  buttons?: InternalAppNavigationButtonItem[];
  payload?: any;
  variation?: string;
  [key: string]: any;
}

export interface InternalAppNavigationTemplateProps extends BaseViewProps {
  payload?: InternalAppNavigationPayloadData;
  onListItemClick?: (type: string, item: any) => void;
  theme?: any;
  currentMessage?: any;
}

export interface InternalAppNavigationTemplateState extends BaseViewState {}

export default class InternalAppNavigationTemplate extends BaseView<
  InternalAppNavigationTemplateProps,
  InternalAppNavigationTemplateState
> {
  constructor(props: InternalAppNavigationTemplateProps) {
    super(props);
  }

  private renderButton = (
    btn: InternalAppNavigationButtonItem,
    index: number,
    totalButtons: number,
    buttonBgColor: string,
    buttonBorderColor: string,
    buttonTextColor: string,
    isTextInverted: boolean,
    fontFamily: string,
    fontSizeStyle: any,
    templateType: string,
  ) => {
    const isLastButton = index === totalButtons - 1;
    const buttonTitle = btn?.title || '';

    return (
      <View
        key={`internal_nav_btn_${index}`}
        style={[
          styles.buttonItemContainer,
          !isLastButton && styles.buttonSpacing,
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.button,
            {
              backgroundColor: buttonBgColor,
              borderColor: buttonBorderColor,
              borderWidth: isTextInverted ? 1 : 0,
            },
          ]}
          onPress={() => {
            if (this.props.onListItemClick) {
              this.props.onListItemClick(
                templateType || TEMPLATE_TYPES.INTERNAL_APP_NAVIGATION_TEMPLATE,
                btn,
              );
            }
          }}>
          <Text
            style={[
              styles.buttonText,
              {
                color: buttonTextColor,
                fontFamily,
              },
              fontSizeStyle,
            ]}>
            {buttonTitle}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const rawPayload = this.props?.payload;
    if (!rawPayload) {
      return null;
    }

    // Extract payload data safely (handling possible nested payload)
    const payload: InternalAppNavigationPayloadData =
      rawPayload?.payload && typeof rawPayload.payload === 'object' && !rawPayload.buttons
        ? rawPayload.payload
        : rawPayload;

    const title = payload?.title || payload?.text || payload?.heading || '';
    const buttons: InternalAppNavigationButtonItem[] = payload?.buttons || [];

    // Theme resolution matching SDK templates
    const btheme: ButtonTheme = getButtonTheme(this.props?.theme);
    const bbtheme: BubbleTheme = getBubbleTheme(this.props?.theme);

    // Font styling
    const fontFamily =
      this.props?.theme?.v3?.body?.font?.family ||
      TEMPLATE_STYLE_VALUES.FONT_FAMILY ||
      'Inter';
    const fontSizeStyle =
      botStyles[this.props?.theme?.v3?.body?.font?.size || 'medium']?.size ||
      botStyles.medium.size;

    // Card/bubble background & text colors
    const botMsgBg = this.props?.theme?.v3?.body?.bot_message?.bg_color;
    const cardBgColor =
      botMsgBg && botMsgBg !== '#3F51B5'
        ? botMsgBg
        : bbtheme?.BUBBLE_LEFT_BG_COLOR || '#EFF1F5';

    const botMsgColor = this.props?.theme?.v3?.body?.bot_message?.color;
    const textColor =
      botMsgColor && botMsgColor !== '#FFFFFF'
        ? botMsgColor
        : bbtheme?.BUBBLE_LEFT_TEXT_COLOR ||
          TEMPLATE_STYLE_VALUES.TEXT_COLOR ||
          '#1D2939';

    // Button colors from theme
    const bodyBtn =
      (this.props?.theme?.v3?.body as any)?.buttons ||
      (this.props?.theme?.v3?.body as any)?.button;
    const bodyBtnBg =
      bodyBtn?.bg_color || bodyBtn?.bgColor || btheme.ACTIVE_BG_COLOR;
    const bodyBtnColor =
      bodyBtn?.color || bodyBtn?.textColor || btheme.ACTIVE_TXT_COLOR;

    const isBackgroundInverted = payload?.variation === 'backgroundInverted';
    const isTextInverted = payload?.variation === 'textInverted';

    let buttonBgColor = bodyBtnBg || '#1B365D';
    let buttonBorderColor = bodyBtnBg || '#1B365D';
    let buttonTextColor = bodyBtnColor || '#FFFFFF';

    if (isTextInverted) {
      buttonBgColor = Color.white;
      buttonBorderColor = bodyBtnBg || '#1B365D';
      buttonTextColor = bodyBtnBg || '#1B365D';
    } else if (isBackgroundInverted) {
      buttonBgColor = bodyBtnBg || bbtheme.BUBBLE_RIGHT_BG_COLOR;
      buttonBorderColor = bodyBtnBg || bbtheme.BUBBLE_RIGHT_BG_COLOR;
      buttonTextColor = bodyBtnColor || bbtheme.BUBBLE_RIGHT_TEXT_COLOR;
    }

    const templateType =
      rawPayload?.template_type ||
      payload?.template_type ||
      TEMPLATE_TYPES.INTERNAL_APP_NAVIGATION_TEMPLATE;

    const cardWidth = Math.min(getWindowWidth() * 0.82, 380);

    return (
      <View
        pointerEvents={this.isViewDisable() ? 'none' : 'auto'}
        style={[
          styles.mainContainer,
          {
            width: cardWidth,
            backgroundColor: cardBgColor,
          },
        ]}>
        {title ? (
          <Text
            style={[
              styles.titleText,
              {
                color: textColor,
                fontFamily,
              },
              fontSizeStyle,
            ]}>
            {title}
          </Text>
        ) : null}

        {buttons.length > 0 ? (
          <View style={styles.buttonsContainer}>
            {buttons.map((btn, index) =>
              this.renderButton(
                btn,
                index,
                buttons.length,
                buttonBgColor,
                buttonBorderColor,
                buttonTextColor,
                isTextInverted,
                fontFamily,
                fontSizeStyle,
                templateType,
              ),
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginLeft: 0,
    marginRight: 0,
  },
  titleText: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    lineHeight: 20,
    paddingBottom: 12,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  buttonItemContainer: {
    width: '100%',
  },
  buttonSpacing: {
    paddingBottom: 12,
  },
  button: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '600',
    textAlign: 'center',
  },
});

