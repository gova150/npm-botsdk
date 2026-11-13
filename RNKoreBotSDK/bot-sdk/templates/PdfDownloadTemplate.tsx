import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Color from '../theme/Color';
import {botStyles, TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getBubbleTheme, getButtonTheme} from '../theme/themeHelper';
import {TEMPLATE_TYPES, BubbleTheme, ButtonTheme} from '../constants/Constant';
import {getWindowWidth} from '../charts';
import ArcSpinnerLoader from '../components/ArcSpinnerLoader';
import PdfDownloadLoaderManager, {
  showPdfDownloadLoader,
  hidePdfDownloadLoader,
} from '../utils/PdfDownloadLoader';

export {showPdfDownloadLoader, hidePdfDownloadLoader};

export interface PdfDownloadButtonItem {
  type: string;
  title: string;
  titleName?: string;
  url?: string;
  [key: string]: any;
}

export interface PdfDownloadPayloadData {
  template_type?: string;
  headerMsg?: string;
  footerMsg?: string;
  buttons?: PdfDownloadButtonItem[];
  payload?: any;
  variation?: string;
  [key: string]: any;
}

export interface PdfDownloadTemplateProps extends BaseViewProps {
  payload?: PdfDownloadPayloadData;
  onListItemClick?: (type: string, item: any) => void;
  onBottomSheetClose?: any;
  theme?: any;
}

export interface PdfDownloadTemplateState extends BaseViewState {
  isLoading: boolean;
  clickedIndices: Set<number>;
  disabledIndices: Set<number>;
}

const DownloadIcon = ({
  size = 18,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 10l5 5 5-5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 15V3"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default class PdfDownloadTemplate extends BaseView<
  PdfDownloadTemplateProps,
  PdfDownloadTemplateState
> {
  private unsubscribeLoader?: () => void;

  constructor(props: PdfDownloadTemplateProps) {
    super(props);
    const initialDisabled = new Set<number>();
    const rawPayload = props?.payload;
    const payload: PdfDownloadPayloadData =
      rawPayload?.payload && typeof rawPayload.payload === 'object'
        ? rawPayload.payload
        : rawPayload;
    const buttons: PdfDownloadButtonItem[] = payload?.buttons || [];
    buttons.forEach((btn, idx) => {
      if (btn?.isDownloaded || btn?.disabled) {
        initialDisabled.add(idx);
      }
    });

    this.state = {
      isLoading: false,
      clickedIndices: new Set<number>(),
      disabledIndices: initialDisabled,
    };
  }

  componentDidMount() {
    this.unsubscribeLoader = PdfDownloadLoaderManager.getInstance().subscribe(
      (loading: boolean, success?: boolean) => {
        this.setState(prevState => {
          if (loading) {
            return {
              isLoading: true,
              clickedIndices: prevState.clickedIndices,
              disabledIndices: prevState.disabledIndices,
            };
          }

          // Loader is stopping:
          if (success === true) {
            // SUCCESS: Permanently disable all clicked buttons
            const nextDisabled = new Set(prevState.disabledIndices);
            const rawPayload = this.props?.payload;
            const payload: PdfDownloadPayloadData =
              rawPayload?.payload && typeof rawPayload.payload === 'object'
                ? rawPayload.payload
                : rawPayload;
            const buttons: PdfDownloadButtonItem[] = payload?.buttons || [];

            prevState.clickedIndices.forEach(idx => {
              nextDisabled.add(idx);
              if (buttons[idx]) {
                buttons[idx].isDownloaded = true;
                buttons[idx].disabled = true;
              }
            });

            return {
              isLoading: false,
              clickedIndices: new Set<number>(),
              disabledIndices: nextDisabled,
            };
          } else {
            // FAILED / NOT ABLE TO DOWNLOAD: Re-enable the button for another try
            return {
              isLoading: false,
              clickedIndices: new Set<number>(),
              disabledIndices: prevState.disabledIndices,
            };
          }
        });
      },
    );
  }

  componentWillUnmount() {
    if (this.unsubscribeLoader) {
      this.unsubscribeLoader();
    }
  }

  private renderButton = (
    button: PdfDownloadButtonItem,
    index: number,
    totalButtons: number,
    buttonBgColor: string,
    buttonBorderColor: string,
    buttonTextColor: string,
    titleColor: string,
    fontFamily: string,
    fontSizeStyle: any,
    templateType: string,
  ) => {
    const title = button?.title || '';
    const placeholderName = button?.titleName || 'Download';
    const isLastButton = index === totalButtons - 1;
    const isPermanentlyDisabled =
      button?.isDownloaded === true ||
      button?.disabled === true ||
      this.state.disabledIndices.has(index);
    const isCurrentlyClicked = this.state.clickedIndices.has(index);
    const isButtonDisabled =
      isPermanentlyDisabled || isCurrentlyClicked || this.state.isLoading;

    return (
      <View
        key={`pdf-btn-${index}`}
        style={[
          styles.buttonItemContainer,
          isLastButton && styles.lastButtonItemContainer,
        ]}>
        {title ? (
          <Text
            style={[
              styles.buttonTitle,
              {
                color: titleColor,
                fontFamily,
              },
              fontSizeStyle,
            ]}>
            {title}
          </Text>
        ) : null}
        <TouchableOpacity
          disabled={isButtonDisabled}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={title}
          testID={title}
          // @ts-ignore - custom attribute for title
          title={title}
          // @ts-ignore - custom data-title attribute for web inspection
          data-title={title}
          style={[
            styles.button,
            {
              backgroundColor: isButtonDisabled
                ? '#DDDDDD'
                : buttonBgColor,
              borderColor: isButtonDisabled
                ? '#DDDDDD'
                : buttonBorderColor,
            },
          ]}
          onPress={() => {
            if (isButtonDisabled) {
              return;
            }
            this.setState(prevState => {
              const nextClicked = new Set(prevState.clickedIndices);
              nextClicked.add(index);
              return {
                clickedIndices: nextClicked,
                isLoading: true,
                disabledIndices: prevState.disabledIndices,
              };
            });

            showPdfDownloadLoader();

            if (this.props.onListItemClick) {
              this.props.onListItemClick(
                templateType || TEMPLATE_TYPES.PDF_DOWNLOAD_TEMPLATE,
                button,
              );
            }
          }}>
          <View style={styles.buttonContent}>
            <DownloadIcon
              size={18}
              color={isButtonDisabled ? '#7D7D7D' : buttonTextColor}
            />
            <Text
              style={[
                styles.buttonText,
                {
                  color: isButtonDisabled ? '#7D7D7D' : buttonTextColor,
                  fontFamily,
                },
                fontSizeStyle,
              ]}>
              {placeholderName}
            </Text>
          </View>
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
    const payload: PdfDownloadPayloadData =
      rawPayload?.payload && typeof rawPayload.payload === 'object'
        ? rawPayload.payload
        : rawPayload;

    const headerMsg = payload?.headerMsg || payload?.heading || '';
    const footerMsg = payload?.footerMsg || payload?.footer || '';
    const buttons: PdfDownloadButtonItem[] = payload?.buttons || [];

    // Branding colors matching Button template
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

    // Card background & text colors
    const botMsgBg = this.props?.theme?.v3?.body?.bot_message?.bg_color;
    const cardBgColor =
      botMsgBg && botMsgBg !== '#3F51B5' ? botMsgBg : '#EFF1F5';

    const botMsgColor = this.props?.theme?.v3?.body?.bot_message?.color;
    const textColor =
      botMsgColor && botMsgColor !== '#FFFFFF'
        ? botMsgColor
        : TEMPLATE_STYLE_VALUES.TEXT_COLOR || '#1D2939';

    // Button colors from theme
    const isBackgroundInverted = payload?.variation === 'backgroundInverted';
    const isTextInverted = payload?.variation === 'textInverted';

    const bodyBtn =
      (this.props?.theme?.v3?.body as any)?.buttons ||
      (this.props?.theme?.v3?.body as any)?.button;
    const bodyBtnBg = bodyBtn?.bg_color || bodyBtn?.bgColor;
    const bodyBtnColor = bodyBtn?.color || bodyBtn?.textColor;

    let buttonBgColor =
      bodyBtnBg ||
      btheme.ACTIVE_BG_COLOR ||
      bbtheme.BUBBLE_RIGHT_BG_COLOR ||
      '#205493';
    let buttonBorderColor =
      bodyBtnBg ||
      btheme.ACTIVE_BG_COLOR ||
      bbtheme.BUBBLE_LEFT_BG_COLOR ||
      '#205493';
    let buttonTextColor =
      bodyBtnColor ||
      btheme.ACTIVE_TXT_COLOR ||
      bbtheme.BUBBLE_RIGHT_TEXT_COLOR ||
      Color.white;

    if (isBackgroundInverted) {
      buttonBgColor = bodyBtnBg || bbtheme.BUBBLE_RIGHT_BG_COLOR;
      buttonTextColor = bodyBtnColor || bbtheme.BUBBLE_RIGHT_TEXT_COLOR;
      buttonBorderColor = bodyBtnBg || bbtheme.BUBBLE_RIGHT_BG_COLOR;
    } else if (isTextInverted) {
      buttonBgColor = Color.white;
      buttonTextColor = bodyBtnBg || bbtheme.BUBBLE_RIGHT_BG_COLOR;
      buttonBorderColor = bodyBtnBg || bbtheme.BUBBLE_LEFT_BG_COLOR;
    }

    const themeSeparator =
      this.props?.theme?.v3?.body?.agent_message?.separator;
    const isValidSeparatorColor =
      typeof themeSeparator === 'string' &&
      themeSeparator.trim() !== '' &&
      themeSeparator !== 'line' &&
      themeSeparator !== '2' &&
      (themeSeparator.startsWith('#') ||
        themeSeparator.startsWith('rgb') ||
        themeSeparator.startsWith('hsl'));

    const dividerColor = isValidSeparatorColor ? themeSeparator : '#D0D5DD';
    const templateType =
      rawPayload?.template_type ||
      payload?.template_type ||
      TEMPLATE_TYPES.PDF_DOWNLOAD_TEMPLATE;

    const cardWidth = Math.min(getWindowWidth() * 0.82, 380);

    return (
      <View
        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
        style={[
          styles.mainContainer,
          {
            width: cardWidth,
            backgroundColor: cardBgColor,
          },
        ]}>
        {this.state.isLoading && (
          <View style={styles.overlayLoader} pointerEvents="auto">
            <View style={styles.loaderBox}>
              <ArcSpinnerLoader size={42} strokeWidth={3.8} color={buttonBgColor} />
            </View>
          </View>
        )}

        {headerMsg ? (
          <Text
            style={[
              styles.headerText,
              {
                color: textColor,
                fontFamily,
              },
              fontSizeStyle,
            ]}>
            {headerMsg}
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
                textColor,
                fontFamily,
                fontSizeStyle,
                templateType,
              ),
            )}
          </View>
        ) : null}

        {footerMsg ? (
          <View style={styles.footerContainer}>
            <View style={[styles.divider, {backgroundColor: dividerColor}]} />
            <Text
              style={[
                styles.footerText,
                {
                  color: textColor,
                  fontFamily,
                },
                fontSizeStyle,
              ]}>
              {footerMsg}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 14,
    padding: 14,
    marginVertical: 4,
    marginLeft: 0,
    marginRight: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderBox: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    lineHeight: 20,
    marginBottom: 14,
  },
  buttonsContainer: {
    width: '100%',
  },
  buttonItemContainer: {
    width: '100%',
    marginBottom: 14,
  },
  lastButtonItemContainer: {
    marginBottom: 6,
  },
  buttonTitle: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
  footerContainer: {
    width: '100%',
    marginTop: 6,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#D0D5DD',
    marginTop: 6,
    marginBottom: 12,
  },
  footerText: {
    fontSize: TEMPLATE_STYLE_VALUES.TEXT_SIZE,
    fontFamily: TEMPLATE_STYLE_VALUES.FONT_FAMILY,
    lineHeight: 20,
  },
});
