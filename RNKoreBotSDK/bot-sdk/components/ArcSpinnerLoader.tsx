import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

export interface ArcSpinnerLoaderProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const ArcSpinnerLoader: React.FC<ArcSpinnerLoaderProps> = ({
  size = 42,
  strokeWidth = 3.8,
  color = '#1B365D',
  style,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const gradientId = useRef(
    `arc_spinner_${Math.random().toString(36).substring(2, 9)}`,
  ).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Draw ~75% arc (270 degrees)
  const arcLength = circumference * 0.75;
  const gapLength = circumference * 0.25;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity="1" />
              <Stop offset="50%" stopColor={color} stopOpacity="0.55" />
              <Stop offset="85%" stopColor={color} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${arcLength} ${gapLength}`}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ArcSpinnerLoader;

