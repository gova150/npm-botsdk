import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {invertColor, normalize} from '../../../utils/helpers';
import Color from '../../../theme/Color';
import {MIN_HEADER_HEIGHT} from '../../../constants/Constant';
import BaseHeader, {BaseHeaderProps, BaseHeaderState} from './BaseHeader';
import {ThemeType} from '../../../theme/ThemeType';
import {isIOS} from '../../../utils/PlatformCheck';

interface MediumHeaderProps extends BaseHeaderProps {}
interface MediumHeaderState extends BaseHeaderState {}

export default class MediumHeader extends BaseHeader<
  MediumHeaderProps,
  MediumHeaderState
> {
  constructor(props: MediumHeaderProps) {
    super(props);
    this.state = {
      showPopover: false,
    };
  }

  render() {
    const theme = this.context as ThemeType;
    const headerColor = theme?.v3?.header?.bg_color || '#FFFFFF';

    const titleName = theme?.v3?.header?.title?.name;
    const subTitleName = theme?.v3?.header?.sub_title?.name;

    let topText = 'DIGITAL CHAT';
    let bottomText = 'Digital Advocate';

    if (subTitleName?.toLowerCase().includes('chat')) {
      topText = subTitleName;
      bottomText = this.getBotTitleName(titleName) || 'Digital Advocate';
    } else if (titleName?.toLowerCase().includes('chat')) {
      topText = titleName;
      bottomText = this.getBotTitleName(subTitleName) || 'Digital Advocate';
    } else if (subTitleName && titleName) {
      topText = subTitleName;
      bottomText = this.getBotTitleName(titleName);
    } else {
      topText = subTitleName || 'DIGITAL CHAT';
      bottomText = this.getBotTitleName(titleName) || 'Digital Advocate';
    }

    if (bottomText.toUpperCase() === 'DIGITAL ADVOCATE') {
      bottomText = 'Digital Advocate';
    }
    topText = topText.toUpperCase();

    return (
      <View
        style={[
          styles.main,
          {
            backgroundColor: headerColor,
          },
        ]}>
        <View style={styles.sub_con}>
          {this.renderBackIcon(
            {},
            {},
            theme?.v3?.header?.icons_color || invertColor(headerColor, true),
          )}
          <View style={styles.sub_con1}>
            {theme?.v3?.header?.icon?.show && (
              <View style={styles.back_icon_container}>
                {this.renderHeaderIcon(theme, {
                  marginStart: 0,
                })}
              </View>
            )}
            <View style={styles.title_main}>
              <View style={styles.title_sub_con}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title_text,
                    {color: theme?.v3?.header?.sub_title?.color || '#6B7280'},
                  ]}>
                  {topText}
                </Text>
              </View>
              <View style={styles.title_sub_con1}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title_sub_text,
                    {color: theme?.v3?.header?.title?.color || '#111827'},
                  ]}>
                  {bottomText}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.right_icon_container}>
            {this.renderRightSideIcons(
              theme,
              {},
              {},
              theme?.v3?.header?.icons_color || invertColor(headerColor, true),
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemProps: {
    marginEnd: 0,
  },
  render_icon: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back_icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub_con1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 0,
  },
  title_sub_con1: {
    justifyContent: 'center',
  },
  title_sub_text: {
    fontWeight: '700',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 22,
    color: '#111827',
  },
  title_text: {
    fontWeight: '600',
    fontSize: 11,
    fontStyle: 'normal',
    lineHeight: 15,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  title_sub_con: {
    justifyContent: 'center',
  },
  title_main: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sub_con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  main: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'solid',
    backgroundColor: '#FFFFFF',
  },
  back_icon_container: {
    width: normalize(33),
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 8,
  },
  right_icon_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    display: 'none',
  },
});
