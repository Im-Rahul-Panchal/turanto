import { StyleSheet, View } from 'react-native';

import { Icon, type LucideIconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';
import type { StockStatus } from '@/types';

type StockPillProps = {
  status: StockStatus;
  /** Shown as "Only N left" when the item is running low. */
  unitsLeft?: number;
  size?: 'sm' | 'md';
};

type StockCopy = { label: string; foreground: string; background: string; icon: LucideIconName };

/**
 * Stock indicator.
 *
 * Urgency is communicated with copy and colour, never with vibration or colour
 * alone, so the pill stays readable for colour-blind users and screen readers.
 */
export function StockPill({ status, unitsLeft, size = 'md' }: StockPillProps) {
  const copy = resolveStockCopy(status, unitsLeft);
  const compact = size === 'sm';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: copy.background },
        compact && styles.baseCompact,
      ]}
      accessible
      accessibilityLabel={copy.label}>
      <Icon
        name={copy.icon}
        size={compact ? 11 : 12}
        color={copy.foreground}
      />
      <Text
        variant="caption"
        color={copy.foreground}
        lines={1}
        style={compact ? styles.labelCompact : undefined}>
        {copy.label}
      </Text>
    </View>
  );
}

function resolveStockCopy(status: StockStatus, unitsLeft?: number): StockCopy {
  if (status === 'out_of_stock') {
    return {
      label: 'Out of stock',
      foreground: colors.error,
      background: colors.errorSoft,
      icon: 'circle-x',
    };
  }

  if (status === 'low_stock') {
    return {
      label: unitsLeft ? `Only ${unitsLeft} left` : 'Low stock',
      foreground: colors.warning,
      background: colors.warningSoft,
      icon: 'triangle-alert',
    };
  }

  return {
    label: 'In stock',
    foreground: colors.success,
    background: colors.successSoft,
    icon: 'circle-check',
  };
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  baseCompact: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  labelCompact: {
    fontSize: 10,
  },
});
