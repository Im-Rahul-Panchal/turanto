import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius } from '@/theme';

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  /** Turns the shimmer off for very large or very dense blocks. */
  animate?: boolean;
};

const SHIMMER_WIDTH = '55%' as const;
const SWEEP_DURATION = 1150;

/**
 * Loading placeholder that matches the shape of the content it stands in for.
 *
 * The shimmer is a translating gradient rather than an opacity pulse, so a grid
 * of skeletons shimmers in step instead of flashing in unison — much calmer to
 * look at while data resolves.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = radius.sm,
  style,
  animate = true,
}: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, { duration: SWEEP_DURATION }), -1, false);
    return () => cancelAnimation(progress);
  }, [animate, progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 320 - 110 }],
  }));

  return (
    <View
      style={[styles.base, { width, height, borderRadius }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading">
      {animate ? (
        <Animated.View style={[styles.shimmer, { width: SHIMMER_WIDTH }, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.75)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

/** Multi-line text placeholder. */
export function SkeletonText({
  lines = 3,
  width = '100%',
  style,
}: {
  lines?: number;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.textGroup, { width }, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          // Last line is short, which reads far more like real text.
          width={index === lines - 1 ? '60%' : '100%'}
          height={12}
          borderRadius={radius.xs}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  textGroup: {
    gap: 8,
  },
});
