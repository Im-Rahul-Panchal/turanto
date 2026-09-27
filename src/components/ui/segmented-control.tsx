import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from './press-scale';
import { Text } from './text';
import { colors, radius, spacing } from '@/theme';

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * Two-to-four way switch, e.g. order status or cart/saved.
 *
 * Generic over the option value so callers keep literal types and cannot pass a
 * value the control does not offer.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  return (
    <View
      style={[styles.base, style]}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressScale
            key={option.value}
            onPress={() => onChange(option.value)}
            haptic="selection"
            scaleTo={0.98}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[styles.segment, selected && styles.segmentSelected]}>
            <Text
              variant="bodySmall"
              color={selected ? colors.text : colors.textSecondary}
              lines={1}
              center>
              {option.label}
            </Text>
          </PressScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  segmentSelected: {
    backgroundColor: colors.surface,
  },
});
