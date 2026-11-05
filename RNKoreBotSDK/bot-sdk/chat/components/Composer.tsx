/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  MIN_COMPOSER_HEIGHT,
  DEFAULT_PLACEHOLDER,
  MAX_TOOL_BAR_HEIGHT,
  MAX_INPUT_TEXT_LENGTH,
} from '../../constants/Constant';
import Color from '../../theme/Color';
import {invertColor, normalize} from '../../utils/helpers';
import {isAndroid, isIOS} from '../../utils/PlatformCheck';
import {IThemeType} from '../../theme/IThemeType';
import {SvgIcon} from '../../utils/SvgIcon';

export interface ComposerProps {
  composerHeight?: number;
  text?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  textInputProps?: Partial<TextInputProps>;
  textInputStyle?: TextInputProps['style'];
  textInputAutoFocus?: boolean;
  keyboardAppearance?: TextInputProps['keyboardAppearance'];
  multiline?: boolean;
  disableComposer?: boolean;
  onTextChanged?(text: string): void;
  onInputSizeChanged?(layout: {width: number; height: number}): void;
  theme: IThemeType;
  onSpeakerClicked?(isSpeek: boolean): void;
  isTTSenable?: boolean;
  sendButtonBgColor?: string;
}

export function Composer({
  composerHeight = MIN_COMPOSER_HEIGHT,
  disableComposer = false,
  keyboardAppearance = 'default',
  multiline = true,
  onInputSizeChanged = () => {},
  onTextChanged = () => {},
  placeholder = DEFAULT_PLACEHOLDER,
  placeholderTextColor = Color.defaultColor,
  text = '',
  textInputAutoFocus = false,
  textInputProps = {},
  theme,
  onSpeakerClicked = () => {},
  isTTSenable = false,
  sendButtonBgColor,
}: ComposerProps): React.ReactElement {
  const dimensionsRef = useRef<{width: number; height: number} | undefined>(undefined);
  const [isTTS, setTTS] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  //onSpeakerClicked(false);

  // Sync local state with parent state when it changes
  useEffect(() => {
    setTTS(isTTSenable);
  }, [isTTSenable]);

  const composerHeightNew: number = composerHeight || 35;

  const determineInputSizeChange = useCallback(
    (dimensions: {width: number; height: number}) => {
      // Support earlier versions of React Native on Android.
      if (!dimensions) {
        return;
      }

      if (
        !dimensionsRef ||
        !dimensionsRef.current ||
        (dimensionsRef.current &&
          (dimensionsRef.current.width !== dimensions.width ||
            dimensionsRef.current.height !== dimensions.height))
      ) {
        dimensionsRef.current = dimensions;
        onInputSizeChanged(dimensions);
      }
    },
    [onInputSizeChanged],
  );

  const handleContentSizeChange = ({
    nativeEvent: {contentSize},
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
    determineInputSizeChange(contentSize);
  const maxHeight = MAX_TOOL_BAR_HEIGHT || 180;
  const bgColor = theme?.v3?.footer?.compose_bar?.bg_color || '#F3F4F6';
  const sendButtonColor =
    sendButtonBgColor ||
    theme?.v3?.body?.user_message?.bg_color ||
    theme?.v3?.general?.colors?.primary ||
    '#1B365D';
  const focusBorderColor =
    theme?.v3?.footer?.compose_bar?.['outline-color'] || sendButtonColor;
  const outLineColor = isFocused ? focusBorderColor : bgColor;
  const currentBorderWidth = 1;
  //const bubbleTheme = getBubbleTheme(theme);
  const textColor = invertColor(bgColor, true);
  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: Color.transparent,
        flex: 1,
      }}>
      <View
        style={{
          justifyContent: 'center',
          maxHeight: normalize(maxHeight),
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: currentBorderWidth,
          borderColor: outLineColor,
          borderStyle: 'solid',
          borderRadius: 8,
          backgroundColor: bgColor,
          minHeight: 38,
        }}>
        <TextInput
          testID={placeholder}
          accessible
          accessibilityLabel={placeholder}
          placeholder={
            theme?.v3?.footer?.compose_bar?.placeholder || placeholder
          }
          placeholderTextColor={'#9CA3AF'}
          selectionColor={textColor}
          multiline={multiline}
          maxLength={MAX_INPUT_TEXT_LENGTH}
          editable={!disableComposer}
          onContentSizeChange={handleContentSizeChange}
          onChangeText={onTextChanged}
          style={[
            styles.textInput,
            {
              paddingVertical: 9,
              paddingHorizontal: 12,
              fontSize: 14,
              fontWeight: '400',
              color: textColor,
              minHeight: 38,
            },
          ]}
          autoFocus={textInputAutoFocus}
          value={text}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={keyboardAppearance}
          {...textInputProps}
          onFocus={(e: any) => {
            setIsFocused(true);
            textInputProps?.onFocus?.(e);
          }}
          onBlur={(e: any) => {
            setIsFocused(false);
            textInputProps?.onBlur?.(e);
          }}
        />

        {theme?.v3?.footer?.buttons?.speaker?.show && (
          <TouchableOpacity
            onPress={() => {
              const spacker = !isTTS;
              setTTS(spacker);
              onSpeakerClicked(spacker);
            }}
            style={{
              padding: 10,
              backgroundColor: Color.transparent,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgIcon
              name={isTTS ? 'SpeakerIcon' : 'SpeakerOffIcon'}
              width={normalize(18)}
              height={normalize(18)}
              color={textColor}
            />
          </TouchableOpacity>
        )}
        {/* Present not implimenting in mobile device as discuss with Sudeer */}
        {/* {theme?.v3?.footer?.buttons?.emoji?.show && (
          <TouchableOpacity style={styles.emoji_main}>
            <SvgIcon
              name={'HappyIcon'}
              width={normalize(22)}
              height={normalize(22)}
              color={
                theme?.v3?.footer?.buttons?.attachment?.icon_color ||
                theme?.v3?.footer?.icons_color ||
                '#697586'
              }
            />
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji_main: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingEnd: 5,
    paddingStart: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  card_main: {
    backgroundColor: '#FAFAFA',
    //height: normalize(80),
    //position: 'absolute',
    // bottom: 10,
    //alignSelf: 'center',
    //justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 12,
    paddingVertical: 9,
    minHeight: 38,
    textAlignVertical: 'center',
    color: Color.text_color,
  },
});
