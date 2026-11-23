import * as React from 'react';
import {Component} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {ThemeContext} from '../../theme/ThemeContext';
import {ThemeType} from '../../theme/ThemeType';
import {normalize} from '../../utils/helpers';

interface TypingProps {
  isTypingIndicator?: boolean;
}

interface TypingState {
  indicatorText: string;
}

export default class TypingIndicator extends Component<
  TypingProps,
  TypingState
> {
  static contextType = ThemeContext;
  private typingTimer: ReturnType<typeof setTimeout> | null = null;
  private animatedColor = new Animated.Value(0);
  private animationLoop: Animated.CompositeAnimation | null = null;
  private _isMounted: boolean = false;

  constructor(props: TypingProps) {
    super(props);
    this.state = {
      indicatorText: 'Please wait',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.props.isTypingIndicator) {
      this.startTypingFlow();
    }
  }

  componentDidUpdate(prevProps: TypingProps) {
    if (this.props.isTypingIndicator !== prevProps.isTypingIndicator) {
      if (this.props.isTypingIndicator) {
        this.startTypingFlow();
      } else {
        this.stopTypingFlow();
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.clearTimer();
    this.stopAnimation();
  }

  private startTypingFlow = () => {
    this.clearTimer();
    if (this._isMounted) {
      this.setState({indicatorText: 'Please wait'});
    }
    this.startAnimation();
  };

  private stopTypingFlow = () => {
    this.clearTimer();
    this.stopAnimation();
    if (this._isMounted) {
      this.setState({indicatorText: 'Please wait'});
    }
  };

  private clearTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  };

  private startAnimation = () => {
    if (this.animationLoop) {
      this.animationLoop.stop();
    }
    this.animatedColor.setValue(0);
    this.animationLoop = Animated.loop(
      Animated.timing(this.animatedColor, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    this.animationLoop.start();
  };

  private stopAnimation = () => {
    if (this.animationLoop) {
      this.animationLoop.stop();
      this.animationLoop = null;
    }
    this.animatedColor.setValue(0);
  };

  render() {
    if (!this.props.isTypingIndicator) {
      return null;
    }

    const theme = this.context as ThemeType;
    const botMsgColor =
      theme?.v3?.body?.bot_message?.color ||
      (theme as any)?.body?.bot_message?.color ||
      '#282828';
    const fontFamily =
      theme?.v3?.body?.font?.family ||
      (theme as any)?.body?.font?.family;

    const dot1Color = this.animatedColor.interpolate({
      inputRange: [0, 1 / 3, 2 / 3, 1],
      outputRange: ['#DBE7F2', '#C3DAEB', '#B3D1EB', '#DBE7F2'],
    });

    const dot2Color = this.animatedColor.interpolate({
      inputRange: [0, 1 / 3, 2 / 3, 1],
      outputRange: ['#C3DAEB', '#B3D1EB', '#DBE7F2', '#C3DAEB'],
    });

    const dot3Color = this.animatedColor.interpolate({
      inputRange: [0, 1 / 3, 2 / 3, 1],
      outputRange: ['#B3D1EB', '#DBE7F2', '#C3DAEB', '#B3D1EB'],
    });

    return (
      <View style={styles.container}>
        <View style={[styles.box, styles.box1]}>
          <View style={styles.row}>
            <Text
              style={[
                styles.text,
                {
                  color: botMsgColor,
                  ...(fontFamily ? {fontFamily} : {}),
                },
              ]}>
              {this.state.indicatorText}
            </Text>
            <View style={styles.dotsContainer}>
              <Animated.View
                style={[
                  styles.dot,
                  styles.dotSpacing,
                  {backgroundColor: dot1Color},
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  styles.dotSpacing,
                  {backgroundColor: dot2Color},
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {backgroundColor: dot3Color},
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  box: {
    position: 'absolute',
  },
  box1: {
    top: -normalize(18),
    left: normalize(16),
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 19.5,
    marginRight: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotSpacing: {
    marginRight: 6,
  },
});
