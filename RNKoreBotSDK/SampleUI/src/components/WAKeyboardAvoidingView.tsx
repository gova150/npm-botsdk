import * as React from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DEFAULT_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

export const WAKeyboardAvoidingView = ({
  behavior,
  keyboardVerticalOffset,
  style,
  children,
  ...rest
}: any) => {
  const headerHeight = useHeaderHeight() || 0;
  const insets = useSafeAreaInsets();
  const statusBarHeight = Math.max(StatusBar.currentHeight || 0, insets.top || 0);
  const defaultOffset =
    Platform.OS === 'ios' ? headerHeight : headerHeight + statusBarHeight;
  const offset =
    keyboardVerticalOffset !== undefined
      ? keyboardVerticalOffset
      : defaultOffset;

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={behavior || DEFAULT_BEHAVIOR}
      keyboardVerticalOffset={offset}
      {...rest}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WAKeyboardAvoidingView;
