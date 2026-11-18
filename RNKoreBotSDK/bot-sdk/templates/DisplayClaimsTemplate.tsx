import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Clipboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {TEMPLATE_TYPES} from '../constants/Constant';
import {IThemeType} from '../theme/IThemeType';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getWindowWidth} from '../charts';
import KoreBotClient from 'rn-kore-bot-socket-lib-v79';
import Time from '../chat/components/Time';

export interface DisplayClaimsItem {
  claimNumber?: string;
  claimType?: string;
  dateOfService?: string;
  memberName?: string;
  patientName?: string;
  providerName?: string;
  claimStatus?: string;
  totalCharged?: string;
  whatYouOwe?: string;
  totalMemberLiability?: string;
  [key: string]: any;
}

export interface DisplayClaimsPayloadData {
  template_type?: string;
  header_msg?: string;
  headerMsg?: string;
  footer_msg?: string;
  footerMsg?: string;
  numberOfClaims?: number;
  moreDetailBtnName?: string;
  buttons?: DisplayClaimsItem[];
  payload?: any;
  [key: string]: any;
}

export interface DisplayClaimsTemplateProps extends BaseViewProps {
  payload?: DisplayClaimsPayloadData;
  theme?: IThemeType;
  currentMessage?: any;
  onListItemClick?: (type: string, item: any) => void;
  onBottomSheetClose?: any;
}

export interface DisplayClaimsTemplateState extends BaseViewState {
  copiedClaimNumber?: string | null;
}

/**
 * Format camelCase object keys into space-separated sentence case labels (first letter capitalized).
 */
export const formatCamelCaseToLabel = (key: string): string => {
  if (!key || typeof key !== 'string') {
    return '';
  }
  const spaced = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_\-]+/g, ' ')
    .toLowerCase()
    .trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : '';
};

/**
 * Extract bg_color from buttons key in theme.
 * Defaults to static color #2574BB if nothing is coming from it.
 */
export const getBrandingButtonColor = (theme?: IThemeType): string => {
  const STATIC_COLOR = '#2574BB';

  const bodyBtn =
    (theme?.v3?.body as any)?.buttons ||
    (theme?.v3?.body as any)?.button ||
    (theme as any)?.body?.buttons;

  const btnBg = bodyBtn?.bg_color || bodyBtn?.bgColor;
  if (btnBg && typeof btnBg === 'string' && btnBg.trim().length > 0) {
    return btnBg.trim();
  }

  return STATIC_COLOR;
};

const CopyIcon = ({
  size = 12,
  color = '#2574BB',
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2H10C8.9 2 8 2.9 8 4Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V8C4 6.9 4.9 6 6 6H8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RightArrowIcon = ({
  size = 18,
  color = '#2574BB',
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default class DisplayClaimsTemplate extends BaseView<
  DisplayClaimsTemplateProps,
  DisplayClaimsTemplateState
> {
  constructor(props: DisplayClaimsTemplateProps) {
    super(props);
    this.state = {
      copiedClaimNumber: null,
    };
  }

  private handleCopyClaimNumber = (claimNumber: string) => {
    const cleanNumber = claimNumber.replace(/^#/, '').trim();
    if (!cleanNumber) {
      return;
    }

    try {
      if (Clipboard && typeof Clipboard.setString === 'function') {
        Clipboard.setString(cleanNumber);
      }
    } catch (e) {
      try {
        const RNCClipboard = require('@react-native-clipboard/clipboard');
        const clip = RNCClipboard?.default || RNCClipboard;
        clip?.setString?.(cleanNumber);
      } catch (err) {
        console.warn('Clipboard copy error:', err);
      }
    }

    this.setState({copiedClaimNumber: cleanNumber});
    setTimeout(() => {
      this.setState(prevState =>
        prevState.copiedClaimNumber === cleanNumber
          ? {copiedClaimNumber: null}
          : null,
      );
    }, 2000);
  };

  private handleCardAction = (
    item: DisplayClaimsItem,
    templateType: string,
  ) => {
    const rawClaimNum = String(item?.claimNumber || '').trim();
    const cleanClaimNum = rawClaimNum.replace(/^#/, '').trim();

    const msgToSend = `More details for ${cleanClaimNum}`;

    if (this.props.onListItemClick) {
      this.props.onListItemClick(
        templateType || TEMPLATE_TYPES.CUSTOM_TEMPLATE_DISPLAY_CLAIMS,
        {
          ...item,
          payload: msgToSend,
          claimNumber: cleanClaimNum,
        },
      );
    } else {
      try {
        KoreBotClient.getInstance()?.sendMessage(
          msgToSend,
          msgToSend,
        );
      } catch (e) {
        console.log('Error sending claimNumber via WebSocket:', e);
      }
    }
  };

  private getStatusBadgeStyle = (statusStr?: string) => {
    const status = (statusStr || '').trim().toLowerCase();

    // 1. 'completed', 'finalised' and 'paid'
    // #0D4877 as background color, borderColor - 1px solid #0D4877 and color - #FFFFFF
    if (
      status === 'completed' ||
      status === 'finalised' ||
      status === 'finalized' ||
      status === 'paid'
    ) {
      return {
        badgeContainer: {
          backgroundColor: '#0D4877',
          borderColor: '#0D4877',
          borderWidth: 1,
        },
        badgeText: {
          color: '#FFFFFF',
        },
      };
    }

    // 3. 'denied'
    // #FFECEC as background color and color - #AD2929
    if (status === 'denied') {
      return {
        badgeContainer: {
          backgroundColor: '#FFECEC',
          borderColor: '#FFECEC',
          borderWidth: 1,
        },
        badgeText: {
          color: '#AD2929',
        },
      };
    }

    // 2. 'pending' and 'suspended' (and default)
    // #F4F2F0 as background color, borderColor - 1px solid #DDD and color - #282828
    return {
      badgeContainer: {
        backgroundColor: '#F4F2F0',
        borderColor: '#DDD',
        borderWidth: 1,
      },
      badgeText: {
        color: '#282828',
      },
    };
  };

  private renderCard = (
    item: DisplayClaimsItem,
    index: number,
    totalCards: number,
    moreDetailBtnName: string,
    templateType: string,
    fontFamily: string,
    brandingBtnColor: string,
    botMsgColor: string = '#282828',
  ) => {
    const isLastCard = index === totalCards - 1;
    const activeBtnColor = brandingBtnColor || '#2574BB';
    const rawClaimNum = String(item?.claimNumber || '').trim();
    const displayClaimNum = rawClaimNum.startsWith('#')
      ? rawClaimNum
      : `#${rawClaimNum}`;

    const claimStatusText = item?.claimStatus
      ? item.claimStatus.charAt(0).toUpperCase() + item.claimStatus.slice(1)
      : '';
    const badgeStyle = this.getStatusBadgeStyle(item?.claimStatus);

    // 2x2 grid field mapping
    const dateKey = 'dateOfService';
    const dateValue = item?.dateOfService || '';

    const memberKey = 'memberName' in item ? 'memberName' : 'patientName' in item ? 'patientName' : 'memberName';
    const memberValue = item?.memberName || item?.patientName || '';

    const oweKey = 'whatYouOwe' in item ? 'whatYouOwe' : 'totalMemberLiability' in item ? 'totalMemberLiability' : 'whatYouOwe';
    const oweValue = item?.whatYouOwe || item?.totalMemberLiability || '';

    const chargedKey = 'totalCharged';
    const chargedValue = item?.totalCharged || '';

    return (
      <View
        key={`claim-card-${index}`}
        style={[styles.card, isLastCard && styles.lastCard]}>
        {/* a. Header Row */}
        <View style={styles.headerRow}>
          {/* i. claimStatus badge */}
          <View style={[styles.badge, badgeStyle.badgeContainer]}>
            <Text
              style={[
                styles.badgeText,
                badgeStyle.badgeText,
                fontFamily ? {fontFamily} : null,
              ]}>
              {claimStatusText}
            </Text>
          </View>

          {/* b. claimNumber & copy button */}
          <View style={styles.claimNumberContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              style={styles.copyButton}
              accessibilityRole="button"
              accessibilityLabel={`Copy claim number ${rawClaimNum}`}
              onPress={() => this.handleCopyClaimNumber(rawClaimNum)}>
              <CopyIcon size={12} color={activeBtnColor} />
            </TouchableOpacity>
            <Text
              style={[
                styles.claimNumberText,
                {color: botMsgColor},
                fontFamily ? {fontFamily} : null,
              ]}>
              {displayClaimNum}
            </Text>
          </View>
        </View>

        {/* 4. Single Row: providerName */}
        {item?.providerName ? (
          <Text
            style={[
              styles.providerName,
              {color: botMsgColor},
              fontFamily ? {fontFamily} : null,
            ]}>
            {item.providerName}
          </Text>
        ) : null}

        {/* 5. 2x2 Grid: dateOfService, memberName, whatYouOwe, totalCharged */}
        <View style={styles.gridContainer}>
          {/* Row 1 */}
          <View style={styles.gridRow}>
            <View style={styles.gridColumnLeft}>
              <Text style={[styles.gridLabel, fontFamily ? {fontFamily} : null]}>
                {`${formatCamelCaseToLabel(dateKey)}:`}
              </Text>
              <Text
                style={[
                  styles.gridValueMedium,
                  {color: botMsgColor},
                  fontFamily ? {fontFamily} : null,
                ]}>
                {dateValue}
              </Text>
            </View>

            <View style={styles.gridColumnRight}>
              <Text style={[styles.gridLabel, fontFamily ? {fontFamily} : null]}>
                {`${formatCamelCaseToLabel(memberKey)}:`}
              </Text>
              <Text
                style={[
                  styles.gridValueMedium,
                  {color: botMsgColor},
                  fontFamily ? {fontFamily} : null,
                ]}>
                {memberValue}
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={[styles.gridRow, styles.lastGridRow]}>
            <View style={styles.gridColumnLeft}>
              <Text style={[styles.gridLabel, fontFamily ? {fontFamily} : null]}>
                {`${formatCamelCaseToLabel(oweKey)}:`}
              </Text>
              <Text
                style={[
                  styles.gridValueBold,
                  {color: botMsgColor},
                  fontFamily ? {fontFamily} : null,
                ]}>
                {oweValue}
              </Text>
            </View>

            <View style={styles.gridColumnRight}>
              <Text style={[styles.gridLabel, fontFamily ? {fontFamily} : null]}>
                {`${formatCamelCaseToLabel(chargedKey)}:`}
              </Text>
              <Text
                style={[
                  styles.gridValueBold,
                  {color: botMsgColor},
                  fontFamily ? {fontFamily} : null,
                ]}>
                {chargedValue}
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Card Action: moreDetailBtnName */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={moreDetailBtnName}
          onPress={() => this.handleCardAction(item, templateType)}>
          <Text
            style={[
              styles.actionButtonText,
              {color: activeBtnColor},
              fontFamily ? {fontFamily} : null,
            ]}>
            {moreDetailBtnName}
          </Text>
          <RightArrowIcon size={18} color={activeBtnColor} />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    let rawPayload: any = this.props?.payload;
    if (typeof rawPayload === 'string') {
      try {
        rawPayload = JSON.parse(rawPayload);
      } catch (e) {}
    }

    let payload: DisplayClaimsPayloadData =
      rawPayload?.payload && typeof rawPayload.payload === 'object'
        ? rawPayload.payload
        : rawPayload;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    // Top Level: header_msg at top above cards, footer_msg below cards.
    const headerMsg = payload?.header_msg || payload?.headerMsg;
    const footerMsg = payload?.footer_msg || payload?.footerMsg;
    const moreDetailBtnName = payload?.moreDetailBtnName || 'More details';
    let rawButtons: any = payload?.buttons;
    if (typeof rawButtons === 'string') {
      try {
        rawButtons = JSON.parse(rawButtons);
      } catch (e) {}
    }
    const buttons: DisplayClaimsItem[] = Array.isArray(rawButtons)
      ? rawButtons
      : [];
    const templateType =
      rawPayload?.template_type ||
      payload?.template_type ||
      TEMPLATE_TYPES.CUSTOM_TEMPLATE_DISPLAY_CLAIMS;

    const activeTheme: IThemeType =
      this.props?.theme || (this.context as IThemeType);
    const fontFamily =
      activeTheme?.v3?.body?.font?.family ||
      TEMPLATE_STYLE_VALUES.FONT_FAMILY;
    const brandingBtnColor = getBrandingButtonColor(activeTheme);

    // Bot message background & text color from branding theme
    const botMsgBg =
      this.props?.theme?.v3?.body?.bot_message?.bg_color ||
      (this.props?.theme as any)?.body?.bot_message?.bg_color ||
      (this.props?.theme as any)?.body?.botMessage?.bgColor;
    const cardBgColor =
      botMsgBg && botMsgBg !== '#3F51B5' ? botMsgBg : '#EFF1F5';

    const botMsgColor =
      this.props?.theme?.v3?.body?.bot_message?.color ||
      (this.props?.theme as any)?.body?.bot_message?.color ||
      (this.props?.theme as any)?.body?.botMessage?.color ||
      '#282828';
    const headerTextColor = botMsgColor;

    const cardWidth = Math.min(getWindowWidth() * 0.85, 380);

    return (
      <View style={{width: cardWidth}}>
        <View
          style={[
            styles.mainContainer,
            {
              width: cardWidth,
              backgroundColor: cardBgColor,
            },
          ]}>
          {headerMsg ? (
            <Text
              style={[
                styles.headerText,
                {color: headerTextColor},
                fontFamily ? {fontFamily} : null,
              ]}>
              {headerMsg}
            </Text>
          ) : null}

          {buttons.map((item, index) =>
            this.renderCard(
              item,
              index,
              buttons.length,
              moreDetailBtnName,
              templateType,
              fontFamily,
              brandingBtnColor,
              botMsgColor,
            ),
          )}
        </View>

        {footerMsg && typeof footerMsg === 'string' && footerMsg.trim().length > 0
          ? this.renderFooterMessage(
              footerMsg.trim(),
              fontFamily,
              cardBgColor,
              headerTextColor,
            )
          : null}
      </View>
    );
  }

  private renderFooterMessage = (
    footerMsg: string,
    fontFamily: string,
    cardBgColor: string,
    textColor: string,
  ) => {
    const theme = this.props?.theme;
    const botName =
      KoreBotClient.getInstance()?.getBotName?.() || 'Digital Advocate';
    const primaryTextColor =
      theme?.v3?.general?.colors?.primary_text || '#111827';
    const createdOn =
      this.props.currentMessage?.createdOn ||
      this.props.currentMessage?.created_at ||
      this.props.currentMessage?.timeMillis ||
      new Date().toISOString();

    return (
      <View style={styles.footerMessageWrapper}>
        <View style={styles.botHeaderRow}>
          <Text
            style={[
              styles.botNameText,
              {color: primaryTextColor},
              fontFamily ? {fontFamily} : null,
            ]}>
            {botName}
          </Text>
          <Time
            createdOn={createdOn}
            position="left"
            theme={theme as IThemeType}
          />
        </View>
        <View
          style={[
            styles.footerBubble,
            {
              backgroundColor: cardBgColor,
            },
          ]}>
          <Text
            style={[
              styles.footerText,
              {color: textColor},
              fontFamily ? {fontFamily} : null,
            ]}>
            {footerMsg.replace(/<br\s*\/?>/gi, '\n')}
          </Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  headerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#282828',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  lastCard: {
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16.5,
  },
  claimNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    width: 12,
    height: 12,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimNumberText: {
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    color: '#282828',
  },
  providerName: {
    marginBottom: 8,
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    color: '#282828',
  },
  gridContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lastGridRow: {
    marginBottom: 8,
  },
  gridColumnLeft: {
    flex: 1,
    paddingRight: 8,
  },
  gridColumnRight: {
    flex: 1,
    paddingLeft: 8,
  },
  gridLabel: {
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  gridValueMedium: {
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
    color: '#282828',
  },
  gridValueBold: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 16,
    color: '#282828',
  },
  actionButton: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionButtonText: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  footerMessageWrapper: {
    marginTop: 16,
    alignItems: 'flex-start',
    width: '100%',
  },
  botHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  botNameText: {
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 19.5,
    marginRight: 6,
  },
  footerBubble: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
});
