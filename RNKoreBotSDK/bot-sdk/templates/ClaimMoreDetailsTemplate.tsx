import * as React from 'react';
import BaseView, {BaseViewProps, BaseViewState} from './BaseView';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TEMPLATE_TYPES} from '../constants/Constant';
import {IThemeType} from '../theme/IThemeType';
import {TEMPLATE_STYLE_VALUES} from '../theme/styles';
import {getWindowWidth} from '../charts';
import KoreBotClient from 'rn-kore-bot-socket-lib-v79';
import Time from '../chat/components/Time';
import {getBrandingButtonColor} from './DisplayClaimsTemplate';

export interface ClaimHeaderItem {
  title?: string;
  value?: string;
  styles?: {
    color?: string;
    'font-size'?: string;
    'font-weight'?: string;
    [key: string]: any;
  };
}

export interface ClaimMoreDetailsPayloadData {
  template_type?: string;
  footer_msg?: string;
  footerMsg?: string;
  moreDetailData?: {
    claims?: Array<Record<string, any>>;
    LinkUrl?: string;
    linkUrl?: string;
    Linktitle?: string;
    linkTitle?: string;
    claims_headers?: {
      item1?: ClaimHeaderItem;
      item2?: ClaimHeaderItem;
      item3?: ClaimHeaderItem;
      [key: string]: any;
    };
    [key: string]: any;
  };
  payload?: any;
  [key: string]: any;
}

export interface ClaimMoreDetailsTemplateProps extends BaseViewProps {
  payload?: ClaimMoreDetailsPayloadData;
  theme?: IThemeType;
  currentMessage?: any;
  onListItemClick?: (type: string, item: any) => void;
  onBottomSheetClose?: any;
}

export interface ClaimMoreDetailsTemplateState extends BaseViewState {}

interface ClaimFieldItem {
  key: string;
  value: string;
}

export default class ClaimMoreDetailsTemplate extends BaseView<
  ClaimMoreDetailsTemplateProps,
  ClaimMoreDetailsTemplateState
> {
  private getStatusBadgeStyle = (statusStr?: string) => {
    const status = (statusStr || '').trim().toLowerCase();

    // 1. 'completed', 'finalised', 'finalized' and 'paid'
    // #0D4877 as background color, borderColor - 1px solid #0D4877 and color - #FFFFFF
    if (
      status === 'completed' ||
      status === 'finalised' ||
      status === 'finalized' ||
      status === 'paid'
    ) {
      return {
        container: {
          backgroundColor: '#0D4877',
          borderColor: '#0D4877',
          borderWidth: 1,
        },
        text: {
          color: '#FFFFFF',
        },
      };
    }

    // 2. 'pending' and 'suspended'
    // #F4F2F0 as background color, borderColor - 1px solid #DDD and color - #282828
    if (status === 'pending' || status === 'suspended') {
      return {
        container: {
          backgroundColor: '#F4F2F0',
          borderColor: '#DDD',
          borderWidth: 1,
        },
        text: {
          color: '#282828',
        },
      };
    }

    // 3. 'denied'
    // #FFECEC as background color, borderColor #E53A3A, and color #AD2929
    if (status === 'denied') {
      return {
        container: {
          backgroundColor: '#FFECEC',
          borderColor: '#E53A3A',
          borderWidth: 1,
        },
        text: {
          color: '#AD2929',
        },
      };
    }

    return {
      container: {
        backgroundColor: '#F4F2F0',
        borderColor: '#DDD',
        borderWidth: 1,
      },
      text: {
        color: '#282828',
      },
    };
  };

  private parseClaimField = (item: any): ClaimFieldItem | null => {
    if (!item || typeof item !== 'object') {
      return null;
    }
    if (item.key && item.value !== undefined) {
      return {key: String(item.key).trim(), value: String(item.value).trim()};
    }
    if (item.title && item.value !== undefined) {
      return {key: String(item.title).trim(), value: String(item.value).trim()};
    }
    if (item.label && item.value !== undefined) {
      return {key: String(item.label).trim(), value: String(item.value).trim()};
    }
    const entries = Object.entries(item);
    if (entries.length > 0) {
      const [k, v] = entries[0];
      return {key: String(k).trim(), value: String(v ?? '').trim()};
    }
    return null;
  };

  private handleLinkPress = (
    linkUrl?: string,
    linkTitle?: string,
    templateType?: string,
  ) => {
    if (!linkUrl) {
      return;
    }

    if (this.props.onListItemClick) {
      this.props.onListItemClick(
        templateType || TEMPLATE_TYPES.CLAIM_MORE_DETAILS_TEMPLATE,
        {
          url: linkUrl,
          title: linkTitle,
          payload: linkUrl,
          navigationUrl: linkUrl,
          route: linkUrl,
          routeName: linkUrl,
          LinkUrl: linkUrl,
          linkUrl: linkUrl,
        },
      );
    } else if ((this.props as any)?.navigation?.navigate) {
      (this.props as any).navigation.navigate(linkUrl, {
        url: linkUrl,
        title: linkTitle,
      });
    } else if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      Linking.openURL(linkUrl).catch(e =>
        console.warn('Could not open URL:', e),
      );
    }
  };

  private renderFooterMessage = (
    footerMsg: string,
    fontFamily: string,
    footerBgColor: string,
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
              backgroundColor: footerBgColor,
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

  render() {
    let rawPayload: any = this.props?.payload;
    if (typeof rawPayload === 'string') {
      try {
        rawPayload = JSON.parse(rawPayload);
      } catch (e) {}
    }

    let payload: ClaimMoreDetailsPayloadData =
      rawPayload?.payload && typeof rawPayload.payload === 'object'
        ? rawPayload.payload
        : rawPayload;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }

    const moreDetailData = payload?.moreDetailData || (payload as any);
    const claimsHeaders = moreDetailData?.claims_headers || {};
    const footerMsg = payload?.footer_msg || payload?.footerMsg;
    const templateType =
      rawPayload?.template_type ||
      payload?.template_type ||
      TEMPLATE_TYPES.CLAIM_MORE_DETAILS_TEMPLATE;

    const activeTheme: IThemeType =
      this.props?.theme || (this.context as IThemeType);
    const fontFamily =
      activeTheme?.v3?.body?.font?.family ||
      TEMPLATE_STYLE_VALUES.FONT_FAMILY;
    const brandingBtnColor = getBrandingButtonColor(activeTheme);

    // Bot message branding color for template text
    const botMsgColor =
      activeTheme?.v3?.body?.bot_message?.color ||
      (activeTheme as any)?.body?.bot_message?.color ||
      (activeTheme as any)?.body?.botMessage?.color;
    const textColor =
      botMsgColor && botMsgColor !== '#FFFFFF'
        ? botMsgColor
        : TEMPLATE_STYLE_VALUES.TEXT_COLOR || '#282828';

    // Bot message background color for the footer bubble
    const botMsgBg =
      activeTheme?.v3?.body?.bot_message?.bg_color ||
      (activeTheme as any)?.body?.bot_message?.bg_color ||
      (activeTheme as any)?.body?.botMessage?.bgColor;
    const footerBgColor =
      botMsgBg && botMsgBg !== '#3F51B5' ? botMsgBg : '#EFF1F5';

    // 4a. Header Section: Claim Title & Number (from item1)
    const item1: ClaimHeaderItem = claimsHeaders?.item1 || {};
    const claimTitle = item1?.title || 'Claim';
    const claimValue = item1?.value || '';
    const claimHeaderDisplay =
      claimValue && claimValue.startsWith('#')
        ? `${claimTitle} ${claimValue}`
        : claimValue
        ? `${claimTitle} #${claimValue}`
        : claimTitle;

    // 4b. Status Badge: Status: [Paid] (from item3)
    const item3: ClaimHeaderItem = claimsHeaders?.item3 || {};
    const statusKey = item3?.title ? `${item3.title}:` : 'Status:';
    const statusValue = item3?.value || '';
    const statusBadgeStyle = this.getStatusBadgeStyle(statusValue);

    // 5a. Member / Patient Name (from item2)
    const item2: ClaimHeaderItem = claimsHeaders?.item2 || {};
    const memberKey = item2?.title ? `${item2.title}:` : 'Member Name:';
    const memberValue = item2?.value || '';

    // Parse all items from moreDetailData.claims
    let rawClaims: any = moreDetailData?.claims;
    if (typeof rawClaims === 'string') {
      try {
        rawClaims = JSON.parse(rawClaims);
      } catch (e) {}
    }
    const allClaimItems: ClaimFieldItem[] = Array.isArray(rawClaims)
      ? rawClaims
          .map(this.parseClaimField)
          .filter((it): it is ClaimFieldItem => it !== null)
      : [];

    // 5b. Provider Name: from claims.Provider/facility name
    const providerItem = allClaimItems.find(it =>
      it.key.toLowerCase().includes('provider'),
    );
    const providerKey = providerItem?.key
      ? (providerItem.key.endsWith(':') ? providerItem.key : `${providerItem.key}:`)
      : 'Provider Name:';
    const providerValue = providerItem?.value || '';

    // 5c. Date of Service (pending / if present): below Provider Name
    const serviceDateItem = allClaimItems.find(it => {
      const k = it.key.toLowerCase();
      return (
        k.includes('date of service') ||
        k.includes('service date') ||
        (k.includes('service') && k.includes('date'))
      );
    });
    const serviceDateKey = serviceDateItem?.key
      ? (serviceDateItem.key.endsWith(':') ? serviceDateItem.key : `${serviceDateItem.key}:`)
      : 'Date of service:';
    const serviceDateValue =
      serviceDateItem?.value ||
      moreDetailData?.['Date of service'] ||
      moreDetailData?.dateOfService ||
      payload?.['Date of service'] ||
      payload?.dateOfService ||
      '';

    // 7a. Claim Finalized Date: from claims.Claim finalized date
    const finalizedDateItem = allClaimItems.find(
      it =>
        it.key.toLowerCase().includes('finaliz') ||
        it.key.toLowerCase().includes('finalis'),
    );
    const finalizedKey = finalizedDateItem?.key
      ? (finalizedDateItem.key.endsWith(':') ? finalizedDateItem.key : `${finalizedDateItem.key}:`)
      : 'Claim Finalized Date:';
    const finalizedValue = finalizedDateItem?.value || '';

    // 6b. Processing message (pending status): below gridRows
    const processingMsgItem = allClaimItems.find(it => {
      const k = it.key.toLowerCase();
      return (
        k.includes('processing message') ||
        k.replace(/[\s_-]+/g, '').includes('processingmessage')
      );
    });
    const processingMessage =
      processingMsgItem?.value ||
      moreDetailData?.['Processing message'] ||
      moreDetailData?.processingMessage ||
      moreDetailData?.['Processing Message'] ||
      payload?.['Processing message'] ||
      payload?.processingMessage ||
      '';

    // 7b. Denial Reason (denied status): below Claim Finalized Date
    const denialReasonItem = allClaimItems.find(it => {
      const k = it.key.toLowerCase();
      return (
        k.includes('denial reason') ||
        k.includes('denial') ||
        k.replace(/[\s_-]+/g, '').includes('denialreason')
      );
    });
    const denialReasonKey = denialReasonItem?.key
      ? denialReasonItem.key.replace(/:$/, '').trim()
      : 'Denial Reason';
    const denialReasonValue =
      denialReasonItem?.value ||
      moreDetailData?.['Denial Reason'] ||
      moreDetailData?.denialReason ||
      payload?.['Denial Reason'] ||
      payload?.denialReason ||
      '';

    // 7c. Link / Action: directly from payload.moreDetailData.Linktitle and LinkUrl
    const linkTitle = moreDetailData?.Linktitle || '';
    const linkUrl = moreDetailData?.LinkUrl || '';

    // 6. 2x2 Financials Grid: remaining keys (excluding provider, date of service, finalized date, processing message, denial reason)
    const gridItems = allClaimItems.filter(
      it =>
        it !== providerItem &&
        it !== serviceDateItem &&
        it !== finalizedDateItem &&
        it !== processingMsgItem &&
        it !== denialReasonItem &&
        !it.key.toLowerCase().includes('linktitle') &&
        !it.key.toLowerCase().includes('linkurl'),
    );
    const gridRows: ClaimFieldItem[][] = [];
    for (let i = 0; i < gridItems.length; i += 2) {
      gridRows.push(gridItems.slice(i, i + 2));
    }

    const cardWidth = Math.min(getWindowWidth() * 0.85, 380);

    return (
      <View style={{width: cardWidth}}>
        {/* 1. Template section: padding 16, border-radius 8, border 1px solid #DDD, bg #FFFFFF */}
        <View style={styles.cardContainer}>
          {/* 4. Header Section */}
          <View style={styles.section}>
            {/* 4a. Claim Title & Number: fontSize 20, fontStyle normal, fontWeight 700, lineHeight 26 */}
            <Text
              style={[
                styles.claimHeaderTitle,
                {color: textColor},
                fontFamily ? {fontFamily} : null,
              ]}>
              {claimHeaderDisplay}
            </Text>

            {/* 4b. Status Badge: Status: [Paid] */}
            {statusValue ? (
              <View style={styles.statusRow}>
                <Text
                  style={[
                    styles.statusKey,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {statusKey}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    statusBadgeStyle.container,
                  ]}>
                  <Text
                    style={[
                      styles.statusBadgeText,
                      statusBadgeStyle.text,
                      fontFamily ? {fontFamily} : null,
                    ]}>
                    {statusValue}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* 4c. Horizontal divider: #E5E7EB */}
          <View style={styles.divider} />

          {/* 5. Patient & Provider Details */}
          <View style={styles.section}>
            {/* 5a. Member Name: key font 14/700/20, value 14/400/20 */}
            {memberValue ? (
              <View style={styles.fieldGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {memberKey}
                </Text>
                <Text
                  style={[
                    styles.fieldValue,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {memberValue}
                </Text>
              </View>
            ) : null}

            {/* 5b. Provider Name: key font 14/700/20, value 14/400/20 */}
            {providerValue ? (
              <View style={styles.fieldGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {providerKey}
                </Text>
                <Text
                  style={[
                    styles.fieldValue,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {providerValue}
                </Text>
              </View>
            ) : null}

            {/* 5c. Date of Service (pending / if present): below Provider Name */}
            {serviceDateValue ? (
              <View style={styles.fieldGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {serviceDateKey}
                </Text>
                <Text
                  style={[
                    styles.serviceDateValue,
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {serviceDateValue}
                </Text>
              </View>
            ) : null}
          </View>

          {/* 5d. Horizontal divider: #E5E7EB */}
          <View style={styles.divider} />

          {/* 6. Financials Grid & Processing Message */}
          {gridRows.length > 0 || processingMessage ? (
            <View style={styles.section}>
              {gridRows.map((row, rIdx) => (
                <View key={`grid_row_${rIdx}`} style={styles.gridRow}>
                  {/* Left Column */}
                  <View style={styles.gridColLeft}>
                    <Text
                      style={[
                        styles.gridLabel,
                        {color: textColor},
                        fontFamily ? {fontFamily} : null,
                      ]}>
                      {row[0]?.key ? `${row[0].key}:` : ''}
                    </Text>
                    <Text
                      style={[
                        styles.gridValue,
                        {color: textColor},
                        fontFamily ? {fontFamily} : null,
                      ]}>
                      {row[0]?.value || ''}
                    </Text>
                  </View>

                  {/* Right Column */}
                  <View style={styles.gridColRight}>
                    {row[1] ? (
                      <>
                        <Text
                          style={[
                            styles.gridLabel,
                            {color: textColor},
                            fontFamily ? {fontFamily} : null,
                          ]}>
                          {row[1]?.key ? `${row[1].key}:` : ''}
                        </Text>
                        <Text
                          style={[
                            styles.gridValue,
                            {color: textColor},
                            fontFamily ? {fontFamily} : null,
                          ]}>
                          {row[1]?.value || ''}
                        </Text>
                      </>
                    ) : null}
                  </View>
                </View>
              ))}

              {/* 6b. Processing message (pending status): below the gridRows */}
              {processingMessage ? (
                <Text
                  style={[
                    styles.processingMessageText,
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {processingMessage}
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* 6c. Horizontal divider before Bottom Section: only if Finalized Date or Denial Reason exists */}
          {finalizedValue || denialReasonValue ? (
            <View style={styles.divider} />
          ) : null}

          {/* 7. Finalized Date, Denial Reason & Link */}
          <View style={styles.section}>
            {/* 7a. Claim Finalized Date: key 14/700/20, value 14/400/20 */}
            {finalizedValue ? (
              <View style={styles.fieldGroup}>
                <Text
                  style={[
                    styles.fieldLabel,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {finalizedKey}
                </Text>
                <Text
                  style={[
                    styles.fieldValue,
                    {color: textColor},
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {finalizedValue}
                </Text>
              </View>
            ) : null}

            {/* 7b. Denial Reason (denied status): below Claim Finalized Date in same block */}
            {denialReasonValue ? (
              <View style={styles.denialReasonContainer}>
                <Text
                  style={[
                    styles.denialReasonKey,
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {denialReasonKey}
                </Text>
                <Text
                  style={[
                    styles.denialReasonValue,
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {denialReasonValue}
                </Text>
              </View>
            ) : null}

            {/* 7c. Link / Action: underlined blue action link */}
            {linkTitle ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  this.handleLinkPress(linkUrl, linkTitle, templateType)
                }>
                <Text
                  style={[
                    styles.actionLink,
                    {
                      color: brandingBtnColor,
                      textDecorationColor: brandingBtnColor,
                    },
                    fontFamily ? {fontFamily} : null,
                  ]}>
                  {linkTitle}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 8. Footer Message: below the main card */}
        {footerMsg && typeof footerMsg === 'string' && footerMsg.trim().length > 0
          ? this.renderFooterMessage(
              footerMsg.trim(),
              fontFamily,
              footerBgColor,
              textColor,
            )
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginVertical: 4,
  },
  section: {
    marginBottom: 0,
  },
  claimHeaderTitle: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusKey: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 9999,
    alignSelf: 'center',
  },
  statusBadgeText: {
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  serviceDateValue: {
    color: '#333333',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gridColLeft: {
    flex: 1,
    paddingRight: 8,
  },
  gridColRight: {
    flex: 1,
    paddingLeft: 8,
  },
  gridLabel: {
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 16,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  processingMessageText: {
    color: '#333333',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 12,
  },
  denialReasonContainer: {
    backgroundColor: '#FFECEC',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  denialReasonKey: {
    color: '#AD2929',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  denialReasonValue: {
    color: '#333333',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 17,
  },
  actionLink: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    textDecorationLine: 'underline',
    textDecorationColor: '#2574BB',
    marginTop: 4,
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
