/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
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
  const MIN_HEIGHT = 38;
  const MAX_HEIGHT = 98; // 4 lines max (38 + 3 * 20)
  const LINE_HEIGHT = 20;

  const dimensionsRef = useRef<{width: number; height: number} | undefined>(
    undefined,
  );
  const [isTTS, setTTS] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState(text || '');
  const inputTextRef = useRef(text || '');
  const textInputRef = useRef<TextInput>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const lineCountRef = useRef(1);
  lineCountRef.current = lineCount;
  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

  // Sync local state with parent state when it changes
  useEffect(() => {
    setTTS(isTTSenable);
  }, [isTTSenable]);

  const determineInputSizeChange = useCallback(
    (dimensions: {width: number; height: number}) => {
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

  const updateLineCountAndHeight = useCallback(
    (newLineCount: number) => {
      const clampedLines = Math.max(1, Math.min(newLineCount, 5));
      if (clampedLines === lineCountRef.current) {
        return;
      }
      lineCountRef.current = clampedLines;
      setLineCount(clampedLines);

      const targetHeight = Math.min(
        MAX_HEIGHT,
        MIN_HEIGHT + (Math.min(clampedLines, 4) - 1) * LINE_HEIGHT,
      );

      Animated.timing(animatedHeight, {
        toValue: targetHeight,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();

      determineInputSizeChange({
        width: dimensionsRef.current?.width || 0,
        height: targetHeight,
      });
    },
    [animatedHeight, determineInputSizeChange],
  );

  const calculateLines = useCallback(
    (val: string, width: number): number => {
      if (!val || val.trim().length === 0) {
        return 1;
      }
      const speakerOffset = theme?.v3?.footer?.buttons?.speaker?.show ? 35 : 0;
      const usableWidth = width > 0 ? width - 24 - speakerOffset : 280;
      // Average character width for 14px font on mobile is ~7.5px
      const charsPerLine = Math.max(24, Math.floor(usableWidth / 7.5));

      const paragraphs = val.split('\n');
      let totalLines = 0;
      for (const p of paragraphs) {
        if (p.length === 0) {
          totalLines += 1;
        } else {
          totalLines += Math.max(1, Math.ceil(p.length / charsPerLine));
        }
      }
      return Math.max(1, totalLines);
    },
    [theme],
  );

  // Sync with incoming text prop (e.g. after send or external reset)
  useEffect(() => {
    const currentVal = text || '';
    inputTextRef.current = currentVal;
    setInputText(currentVal);
    if (!currentVal || currentVal.trim().length === 0) {
      if (lineCountRef.current !== 1) {
        updateLineCountAndHeight(1);
      }
    } else {
      const calculated = calculateLines(currentVal, containerWidth);
      if (calculated !== lineCountRef.current) {
        updateLineCountAndHeight(calculated);
      }
    }
  }, [text, containerWidth, calculateLines, updateLineCountAndHeight]);

  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const contentHeight = e.nativeEvent.contentSize?.height;
      if (!contentHeight || contentHeight <= 0) return;

      // If text is empty or blank, ALWAYS reset to 1 line
      if (!inputTextRef.current || inputTextRef.current.trim().length === 0) {
        if (lineCountRef.current !== 1) {
          updateLineCountAndHeight(1);
        }
        return;
      }

      // 1 line:  ~35-38px (<= 40)
      // 2 lines: ~46-58px (41 to 60)
      // 3 lines: ~66-78px (61 to 80)
      // 4 lines: ~86-98px (81 to 100)
      // 5+ lines: > 100
      let detectedLines = 1;
      if (contentHeight > 100) {
        detectedLines = 5;
      } else if (contentHeight > 80) {
        detectedLines = 4;
      } else if (contentHeight > 60) {
        detectedLines = 3;
      } else if (contentHeight > 40) {
        detectedLines = 2;
      } else {
        detectedLines = 1;
      }

      const estLines = calculateLines(inputTextRef.current, containerWidth);
      const finalLines = Math.max(detectedLines, estLines);
      if (finalLines !== lineCountRef.current) {
        updateLineCountAndHeight(finalLines);
      }
    },
    [calculateLines, containerWidth, updateLineCountAndHeight],
  );

  const handleChangeText = (newText: string) => {
    inputTextRef.current = newText;
    setInputText(newText);
    if (!newText || newText.trim().length === 0) {
      if (lineCountRef.current !== 1) {
        updateLineCountAndHeight(1);
      }
    } else {
      const calculated = calculateLines(newText, containerWidth);
      if (calculated !== lineCountRef.current) {
        updateLineCountAndHeight(calculated);
      }
    }
    onTextChanged(newText);
  };

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
  const textColor = invertColor(bgColor, true);

  return (
    <View
      style={{
        justifyContent: 'flex-end',
        backgroundColor: Color.transparent,
        flex: 1,
      }}>
      <TouchableWithoutFeedback
        onPress={() => textInputRef.current?.focus()}
        accessible={false}>
        <Animated.View
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0 && Math.abs(w - containerWidth) > 5) {
              setContainerWidth(w);
            }
          }}
          style={{
            height: animatedHeight,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start',
            borderWidth: currentBorderWidth,
            borderColor: outLineColor,
            borderStyle: 'solid',
            borderRadius: 8,
            backgroundColor: bgColor,
            minHeight: MIN_HEIGHT,
            maxHeight: MAX_HEIGHT,
            overflow: 'hidden',
          }}>
          <TextInput
            ref={textInputRef}
            testID={placeholder}
            accessible
            accessibilityLabel={placeholder}
            placeholder={
              theme?.v3?.footer?.compose_bar?.placeholder || placeholder
            }
            placeholderTextColor={'#9CA3AF'}
            selectionColor={textColor}
            multiline={multiline}
            scrollEnabled={Platform.OS === 'ios' ? true : lineCount >= 4}
            maxLength={MAX_INPUT_TEXT_LENGTH}
            editable={!disableComposer}
            onContentSizeChange={handleContentSizeChange}
            onChangeText={handleChangeText}
            style={[
              styles.textInput,
              {
                flex: 1,
                flexShrink: 1,
                minHeight: MIN_HEIGHT,
                paddingTop: 9,
                paddingBottom: 9,
                paddingHorizontal: 12,
                fontSize: 14,
                lineHeight: 20,
                fontWeight: '400',
                color: textColor,
                alignSelf: 'stretch',
                textAlignVertical: 'top',
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
                alignSelf: 'flex-end',
              }}>
              <SvgIcon
                name={isTTS ? 'SpeakerIcon' : 'SpeakerOffIcon'}
                width={normalize(18)}
                height={normalize(18)}
                color={textColor}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
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
  },
  textInput: {
    flex: 1,
    flexShrink: 1,
    minHeight: 38,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 9,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    color: Color.text_color,
  },
});
