import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from './press-scale';
import { Icon, type LucideIconName } from './icon';
import { Text } from './text';
import { colors, radius, spacing, tints } from '@/theme';
import type { CategoryTint } from '@/types';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIconName;
  /** Tints the chip with a category colour when selected. */
  tint?: CategoryTint;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

/**
 * Selectable pill used for filters, subcategories and sort options.
 *
 * Selection is communicated with a check icon as well as colour, so the state
 * survives greyscale and colour-blind viewing.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  tint,
  size = 'md',
  style,
}: ChipProps) {
  const activeForeground = tint ? tints[tint].strong : colors.primaryDark;
  const activeBackground = tint ? tints[tint].soft : colors.primaryLighter;

  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.94}
      haptic="selection"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        selected ? { backgroundColor: activeBackground, borderColor: activeForeground } : null,
        style,
      ]}>
      <View style={styles.content}>
        {icon ? (
          <Icon name={icon} size={size === 'sm' ? 13 : 15} color={selected ? activeForeground : colors.textMuted} />
        ) : null}
        <Text
          variant={size === 'sm' ? 'caption' : 'bodySmall'}
          color={selected ? activeForeground : colors.textSecondary}
          lines={1}>
          {label}
        </Text>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  md: {
    paddingHorizontal: spacing.lg - 4,
    paddingVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
});
