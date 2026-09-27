import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';
import type { OrderStatus, PaymentMethod } from '@/types';

type StatusCopy = {
  label: string;
  foreground: string;
  background: string;
  dot: string;
};

const statusCopy: Record<OrderStatus, StatusCopy> = {
  preparing: {
    label: 'Preparing',
    foreground: colors.warning,
    background: colors.warningSoft,
    dot: colors.warning,
  },
  packed: {
    label: 'Packed',
    foreground: colors.info,
    background: colors.infoSoft,
    dot: colors.info,
  },
  out_for_delivery: {
    label: 'On the way',
    foreground: colors.primaryDark,
    background: colors.primaryLighter,
    dot: colors.primary,
  },
  delivered: {
    label: 'Delivered',
    foreground: colors.success,
    background: colors.successSoft,
    dot: colors.success,
  },
  cancelled: {
    label: 'Cancelled',
    foreground: colors.error,
    background: colors.errorSoft,
    dot: colors.error,
  },
};

const paymentLabels: Record<PaymentMethod, string> = {
  upi: 'UPI',
  cod: 'Cash on delivery',
  card: 'Card',
  wallet: 'Wallet',
};

export function statusLabel(status: OrderStatus): string {
  return statusCopy[status].label;
}

export function paymentLabel(method: PaymentMethod): string {
  return paymentLabels[method];
}

/** Order state pill. The coloured dot is decorative; the label carries meaning. */
export function OrderStatusPill({ status, style }: { status: OrderStatus; style?: object }) {
  const copy = statusCopy[status];

  return (
    <View style={[styles.pill, { backgroundColor: copy.background }, style]}>
      <View style={[styles.dot, { backgroundColor: copy.dot }]} />
      <Text variant="caption" color={copy.foreground} lines={1}>
        {copy.label}
      </Text>
    </View>
  );
}

/** True while the order is still moving and the shopper can expect an update. */
export function isOrderActive(status: OrderStatus): boolean {
  return status === 'preparing' || status === 'packed' || status === 'out_for_delivery';
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
});
