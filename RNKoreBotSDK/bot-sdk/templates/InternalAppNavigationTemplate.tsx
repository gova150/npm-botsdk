import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from '../theme/Color';
import {botStyles, TEMPLATE_STYLE_VALUES, leftBubbleStyles} from '../theme/styles';
import {getBubbleTheme, getButtonTheme} from '../theme/themeHelper';
import {TEMPLATE_TYPES, BubbleTheme, ButtonTheme} from '../constants/Constant';
import {getWindowWidth} from '../charts';
import {parseInternalAppNavigationText} from '../utils/helpers';

export interface InternalAppNavigationButtonItem {
  type?: string;
  title?: string;
  navigationUrl?: string;
  linkurl?: string;
  linkUrl?: string;
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

export interface InternalAppNavigationTemplateState extends BaseViewState {
  disabledIndices: Set<number>;
  clickedIndices: Set<number>;
}

export default class InternalAppNavigationTemplate extends BaseView<
  InternalAppNavigationTemplateProps,
  InternalAppNavigationTemplateState
> {
  constructor(props: InternalAppNavigationTemplateProps) {
    super(props);
    const initialDisabled = new Set<number>();
    let buttons = props?.payload?.buttons || [];

    // Parse buttons if text with $navigationStart$...$navigationEnd$ was passed
    if (!buttons || buttons.length === 0) {
      const textToParse =
        props?.payload?.title ||
        props?.payload?.text ||
        props?.payload?.heading ||
        (typeof props?.payload === 'string' ? props.payload : null);
      if (
        typeof textToParse === 'string' &&
        textToParse.includes('$navigationStart$') &&
        textToParse.includes('$navigationEnd$')
      ) {
        const parsed = parseInternalAppNavigationText(textToParse);
        if (parsed?.buttons) {
          buttons = parsed.buttons;
        }
      }
    }

    buttons.forEach((btn: any, idx: number) => {
      if (btn?.disabled || btn?.isDownloaded) {
        initialDisabled.add(idx);
      }
    });
    this.state = {
      disabledIndices: initialDisabled,
      clickedIndices: new Set<number>(),
    };
  }

  protected isViewDisable = (): boolean => {
    return false;
  };

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
    const isButtonDisabled =
      btn?.disabled === true ||
      btn?.isDownloaded === true ||
      this.state.disabledIndices?.has(index);

    const currentBgColor = isButtonDisabled ? '#DDDDDD' : buttonBgColor;
    const currentBorderColor = isButtonDisabled ? '#DDDDDD' : buttonBorderColor;
    const currentTextColor = isButtonDisabled ? '#7D7D7D' : buttonTextColor;

    return (
      <View
        key={`internal_nav_btn_${index}`}
        style={[
          styles.buttonItemContainer,
          !isLastButton && styles.buttonSpacing,
        ]}>
        <TouchableOpacity
          disabled={isButtonDisabled}
          activeOpacity={0.7}
          style={[
            styles.button,
            {
              backgroundColor: currentBgColor,
              borderColor: currentBorderColor,
              borderWidth: isTextInverted || isButtonDisabled ? 1 : 0,
            },
          ]}
          onPress={() => {
            if (isButtonDisabled) {
              return;
            }
            const clickHandler =
              this.props.onListItemClick ||
              this.props.payload?.onListItemClick;
            if (clickHandler) {
              clickHandler(
                templateType || TEMPLATE_TYPES.INTERNAL_APP_NAVIGATION_TEMPLATE,
                btn,
              );
            }
          }}>
          <Text
            style={[
              styles.buttonText,
              {
                color: currentTextColor,
                fontFamily,
                fontSize: 14,
              },
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

    let title = payload?.title || payload?.text || payload?.heading || '';
    let buttons: InternalAppNavigationButtonItem[] = payload?.buttons || [];

    // Parse formatted text ($navigationStart$...$navigationEnd$) if buttons are not pre-parsed
    if (
      (!buttons || buttons.length === 0) &&
      typeof title === 'string' &&
      title.includes('$navigationStart$') &&
      title.includes('$navigationEnd$')
    ) {
      const parsed = parseInternalAppNavigationText(title);
      if (parsed) {
        title = parsed.title;
        buttons = parsed.buttons;
      }
    }

    const theme = (this.props?.theme || this.context) as any;

    // Theme resolution matching SDK templates
    const btheme: ButtonTheme = getButtonTheme(theme);
    const bbtheme: BubbleTheme = getBubbleTheme(theme);

    // Font styling matching default bot response
    const fontFamily =
      theme?.v3?.body?.font?.family ||
      TEMPLATE_STYLE_VALUES.FONT_FAMILY ||
      'Inter';
    const fontSizeStyle =
      botStyles[theme?.v3?.body?.font?.size || 'medium']?.size ||
      botStyles.medium.size;

    // Default bot_response bubble background & text color
    const cardBgColor = bbtheme?.BUBBLE_LEFT_BG_COLOR;
    const textColor = bbtheme?.BUBBLE_LEFT_TEXT_COLOR;

    // Button colors from theme
    const bodyBtn =
      (theme?.v3?.body as any)?.buttons ||
      (theme?.v3?.body as any)?.button;
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
    const bubbleRadiusStyle =
      leftBubbleStyles[theme?.v3?.body?.bubble_style || 'balloon']?.bubble_style || {
        borderRadius: 8,
      };

    return (
      <View
        pointerEvents="auto"
        style={[
          styles.mainContainer,
          bubbleRadiusStyle,
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
                fontSize: 14,
                fontWeight: '400',
                fontStyle: 'normal',
                lineHeight: 20,
                marginBottom: buttons.length > 0 ? 16 : 0,
              },
            ]}>
            {typeof title === 'string'
              ? title.replace(/<br\s*\/?>/gi, '\n').trim()
              : title}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginLeft: 0,
    marginRight: 0,
  },
  titleText: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 0,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0,
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
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '600',
    textAlign: 'center',
  },
});

