import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { colors, radius, spacing, spring } from '@/theme';

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** `compact` is the pill used on product cards; `full` is the cart row. */
  variant?: 'compact' | 'full';
  max?: number;
  disabled?: boolean;
  productName: string;
};

/**
 * Quantity control.
 *
 * The two buttons are always both mounted so the pill never changes width as
 * the count crosses 1, which would otherwise make the row jump on every tap.
 */
export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  variant = 'compact',
  max = 99,
  disabled = false,
  productName,
}: QuantityStepperProps) {
  const compact = variant === 'compact';
  const atMax = quantity >= max;
  // `decrement` removes the item at 1, so the label reads "remove", not "minus".
  const decrementIsRemove = quantity <= 1;

  const popScale = useSharedValue(1);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: popScale.value }] }));

  function bump(fn: () => void) {
    // `SharedValue.value` is Reanimated's documented mutable escape hatch: the
    // assignment is what schedules work on the UI thread, so the React Compiler
    // immutability rule has to be waived for these two lines.
    /* eslint-disable react-hooks/immutability */
    popScale.value = 0.85;
    popScale.value = withSpring(1, spring);
    /* eslint-enable react-hooks/immutability */
    fn();
  }

  return (
    <View
      style={[
        styles.base,
        compact ? styles.compact : styles.full,
        disabled && styles.disabled,
      ]}>
      <PressScale
        onPress={() => bump(onDecrement)}
        disabled={disabled}
        haptic="light"
        scaleTo={0.9}
        accessibilityRole="button"
        accessibilityLabel={
          decrementIsRemove ? `Remove ${productName} from cart` : `Decrease quantity of ${productName}`
        }
        style={[styles.button, compact && styles.buttonCompact, decrementIsRemove && styles.removeButton]}>
        <Icon
          name={decrementIsRemove ? 'trash-2' : 'minus'}
          size={compact ? 14 : 16}
          color={compact && decrementIsRemove ? colors.error : colors.primaryDark}
        />
      </PressScale>

      <Animated.View style={[styles.value, popStyle]}>
        <Text
          variant={compact ? 'bodySmall' : 'bodyMedium'}
          color={colors.primaryDark}
          lines={1}
          accessibilityLabel={`Quantity ${quantity}`}
          accessible>
          {quantity}
        </Text>
      </Animated.View>

      <PressScale
        onPress={() => bump(onIncrement)}
        disabled={disabled || atMax}
        haptic="light"
        scaleTo={0.9}
        accessibilityRole="button"
        accessibilityLabel={`Increase quantity of ${productName}`}
        style={[styles.button, compact && styles.buttonCompact]}>
        <Icon name="plus" size={compact ? 14 : 16} color={colors.primaryDark} />
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLighter,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  compact: {
    height: 32,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    minWidth: 92,
  },
  full: {
    height: 40,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    minWidth: 116,
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    width: 26,
    height: 26,
  },
  removeButton: {
    backgroundColor: colors.errorSoft,
    borderRadius: radius.pill,
  },
  value: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
});
