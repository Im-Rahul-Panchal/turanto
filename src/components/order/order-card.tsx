import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { OrderStatusPill, paymentLabel } from '@/components/order/order-status-pill';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { getImage } from '@/lib/images';
import { formatPrice } from '@/utils/pricing';
import { colors, radius, spacing } from '@/theme';
import type { Order } from '@/types';

type OrderCardProps = {
  order: Order;
  /** Emphasises the live ETA; only meaningful for orders still in progress. */
  showEta?: boolean;
};

const THUMB_SIZE = 44;
const MAX_THUMBS = 4;

/**
 * Order summary row for the orders list.
 *
 * The whole card is one tap target, so the sub-elements are not individually
 * pressable — nested pressables are a common source of accidental navigation.
 */
export function OrderCard({ order, showEta = true }: OrderCardProps) {
  const thumbs = order.items.slice(0, MAX_THUMBS);
  const overflow = order.items.length - thumbs.length;

  return (
    <PressScale
      onPress={() => router.push({ pathname: '/orders/[id]', params: { id: order.id } })}
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.reference}, ${order.itemCount} items, ${formatPrice(order.totals.payable)}, ${order.reference}`}
      style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="bodyMedium" lines={1}>
            {order.reference}
          </Text>
          <Text variant="caption" lines={1}>
            {formatDate(order.placedAt)}
          </Text>
        </View>
        <OrderStatusPill status={order.status} />
      </View>

      <View style={styles.middle}>
        <View style={styles.thumbs}>
          {thumbs.map((item) => (
            <Image
              key={item.productId}
              source={getImage(item.imageKey)}
              style={styles.thumb}
              contentFit="cover"
              transition={120}
              accessibilityElementsHidden
            />
          ))}
          {overflow > 0 ? (
            <View style={[styles.thumb, styles.more]}>
              <Text variant="caption" color={colors.textSecondary} lines={1}>
                {`+${overflow}`}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.meta}>
          <Text variant="bodySmall" color={colors.textSecondary} lines={1}>
            {`${order.itemCount} ${order.itemCount === 1 ? 'item' : 'items'} · ${paymentLabel(order.paymentMethod)}`}
          </Text>
          {showEta && order.status !== 'delivered' && order.status !== 'cancelled' ? (
            <Text variant="bodySmall" color={colors.primaryDark} lines={1}>
              {`Arriving in ${order.etaLabel}`}
            </Text>
          ) : null}
          {order.totals.totalSavings > 0 ? (
            <Text variant="caption" color={colors.success} lines={1}>
              {`Saved ${formatPrice(order.totals.totalSavings)}`}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <Text variant="caption" color={colors.textSecondary} lines={1}>
          Total
        </Text>
        <Text variant="bodyMedium" lines={1}>
          {formatPrice(order.totals.payable)}
        </Text>
      </View>
    </PressScale>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.base,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbs: {
    flexDirection: 'row',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.sm,
    marginLeft: -8,
    backgroundColor: colors.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
});
