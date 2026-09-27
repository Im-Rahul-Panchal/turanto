import { forwardRef, useCallback } from 'react';
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptics } from '@/utils/haptics';
import { pressScale, spring } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** How far to shrink while held. Set to 1 to disable. */
  scaleTo?: number;
  /** Fires a light haptic on press-in, for controls that benefit from it. */
  haptic?: 'none' | 'light' | 'selection' | 'medium';
};

/**
 * Pressable wrapper that adds the tactile "micro-interaction" the rest of the UI
 * is built on: a quick spring scale-down while held that springs back on
 * release, optionally with haptic feedback.
 *
 * The animation is interruptible — pressing again mid-release simply retargets
 * the same shared value rather than queueing.
 */
export const PressScale = forwardRef<View, PressScaleProps>(function PressScale(
  { children, style, scaleTo = pressScale, haptic = 'none', onPressIn, disabled, ...rest },
  ref,
) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;
      scale.value = withSpring(scaleTo, spring);
      if (haptic === 'light') haptics.light();
      else if (haptic === 'selection') haptics.selection();
      else if (haptic === 'medium') haptics.medium();
      onPressIn?.(event);
    },
    [disabled, haptic, onPressIn, scale, scaleTo],
  );

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, spring);
  }, [scale]);

  return (
    <AnimatedPressable
      ref={ref}
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
});
