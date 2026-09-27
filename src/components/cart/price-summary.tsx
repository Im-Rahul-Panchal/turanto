import { StyleSheet, View } from 'react-native';

import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { formatPrice } from '@/utils/pricing';
import { colors, radius, spacing } from '@/theme';
import type { Totals } from '@/utils/pricing';

type PriceSummaryProps = {
  totals: Totals;
  /** Hides the "you saved" line, which reads oddly on an already-final bill. */
  showSavings?: boolean;
  compact?: boolean;
};

/**
 * Bill breakdown.
 *
 * The order of the lines is deliberate — what you pay is last, because that is
 * what shoppers scan for. Free delivery is called out explicitly rather than
 * being shown as a ₹0 line, since a zero is easy to miss.
 */
export function PriceSummary({ totals, showSavings = true, compact = false }: PriceSummaryProps) {
  const { appliedCoupon, freeDeliveryUnlocked, amountToFreeDelivery } = totals;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Row label={`Item total (${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'})`} value={formatPrice(totals.itemTotal)} />

      <Row
        label="Delivery fee"
        value={freeDeliveryUnlocked ? 'FREE' : formatPrice(totals.deliveryFee)}
        valueColor={freeDeliveryUnlocked ? colors.success : colors.text}
      />

      <Row label="Handling fee" value={formatPrice(totals.handlingFee)} />

      {appliedCoupon ? (
        <Row
          label={`Coupon · ${appliedCoupon.code}`}
          value={`- ${formatPrice(totals.couponDiscount)}`}
          valueColor={colors.success}
        />
      ) : null}

      {!freeDeliveryUnlocked && amountToFreeDelivery > 0 ? (
        <Text variant="caption" color={colors.primaryDark} lines={2} style={styles.nudge}>
          {`Add ${formatPrice(amountToFreeDelivery)} more for free delivery`}
        </Text>
      ) : null}

      <Divider style={styles.divider} />

      <View style={styles.totalRow}>
        <Text variant="bodyMedium">To pay</Text>
        <Text variant="priceLarge">{formatPrice(totals.payable)}</Text>
      </View>

      {showSavings && totals.totalSavings > 0 ? (
        <View style={styles.savings}>
          <Text variant="caption" color={colors.success} lines={1}>
            {`You saved ${formatPrice(totals.totalSavings)} on this order`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.row}>
      <Text variant="bodySmall" color={colors.textSecondary} lines={1} style={styles.rowLabel}>
        {label}
      </Text>
      <Text variant="bodySmall" color={valueColor} lines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  wrapCompact: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLabel: {
    flex: 1,
  },
  nudge: {
    marginTop: -spacing.xxs,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  savings: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
  },
});
