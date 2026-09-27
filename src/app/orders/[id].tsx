import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddressCard } from '@/components/address/address-card';
import { PriceSummary } from '@/components/cart/price-summary';
import { OrderStatusPill, paymentLabel } from '@/components/order/order-status-pill';
import { OrderTimeline } from '@/components/order/order-timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { PressScale } from '@/components/ui/press-scale';
import { Rating } from '@/components/product/rating';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { getImage } from '@/lib/images';
import { useOrders } from '@/providers/orders-provider';
import { useToast } from '@/providers/toast-provider';
import { useUser } from '@/providers/user-provider';
import { formatPrice } from '@/utils/pricing';
import { colors, gutter, radius, spacing } from '@/theme';

const RATING_VALUES = [1, 2, 3, 4, 5] as const;

/**
 * Order detail.
 *
 * Everything on this screen is a snapshot taken at checkout — names, prices and
 * the address are stored on the order, not looked up live. That is what makes it
 * safe to reorder, and it is why nothing here re-reads the catalogue.
 */
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const orders = useOrders();
  const toast = useToast();
  const { labelFor } = useUser();

  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const order = typeof id === 'string' ? orders.getOrder(id) : null;

  if (!order) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.navRow}>
          <IconButton name="arrow-left" accessibilityLabel="Go back" onPress={() => router.back()} />
        </View>
        <View style={styles.missing}>
          <EmptyState
            imageKey="error-state"
            title="Order not found"
            description="This order may have been removed, or the link is out of date."
            actionLabel="See all orders"
            onActionPress={() => router.push('/orders')}
          />
        </View>
      </View>
    );
  }

  const canCancel = order.status === 'preparing' || order.status === 'packed';
  const canRate = order.status === 'delivered' && order.rating === undefined;
  const canReorder = order.status !== 'cancelled';

  function confirmCancel() {
    orders.cancelOrder(order!.id);
    setCancelOpen(false);
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.navRow}>
          <IconButton
            name="arrow-left"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            backgroundColor={colors.surface}
          />
          <View style={styles.grow} />
          <IconButton
            name="help-circle"
            accessibilityLabel="Get help with this order"
            onPress={() =>
              toast.show({
                message: 'Support is available 24×7 in the demo build.',
                variant: 'info',
              })
            }
            backgroundColor={colors.surface}
          />
        </View>

        <View style={styles.hero}>
          <Text variant="h1" lines={1}>
            {order.reference}
          </Text>
          <View style={styles.heroMeta}>
            <OrderStatusPill status={order.status} />
            <Text variant="caption" color={colors.textSecondary} lines={1}>
              {`Placed ${formatDate(order.placedAt)} · ${paymentLabel(order.paymentMethod)}`}
            </Text>
          </View>
          {order.status === 'out_for_delivery' || order.status === 'preparing' || order.status === 'packed' ? (
            <Text variant="body" lines={1} style={styles.eta}>
              {`Arriving in ${order.etaLabel}`}
            </Text>
          ) : null}
        </View>

        <View style={styles.block}>
          <SectionHeader title="Tracking" />
          <Card variant="flat" padding="base">
            <OrderTimeline order={order} />
          </Card>
        </View>

        <View style={styles.block}>
          <SectionHeader title="Delivery address" />
          <AddressCard address={order.deliveryAddress} labelFor={labelFor} />
          {order.deliveryInstructions ? (
            <Text variant="caption" color={colors.textSecondary} lines={2}>
              {`Note: ${order.deliveryInstructions}`}
            </Text>
          ) : null}
        </View>

        <View style={styles.block}>
          <SectionHeader title={`Items (${order.itemCount})`} />
          <Card variant="flat" padding="none" style={styles.items}>
            {order.items.map((item, index) => (
              <View key={item.productId}>
                {index > 0 ? <Divider style={styles.itemDivider} /> : null}
                <PressScale
                  onPress={() =>
                    router.push({ pathname: '/product/[id]', params: { id: item.productId } })
                  }
                  scaleTo={0.99}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}, ${item.quantity} × ${formatPrice(item.price)}`}
                  style={styles.item}>
                  <Image
                    source={getImage(item.imageKey)}
                    style={styles.itemImage}
                    contentFit="cover"
                    transition={120}
                    accessibilityElementsHidden
                  />
                  <View style={styles.itemCopy}>
                    <Text variant="bodySmall" lines={2}>
                      {item.name}
                    </Text>
                    <Text variant="caption" lines={1}>
                      {`${item.quantity} × ${formatPrice(item.price)}`}
                    </Text>
                  </View>
                  <Text variant="bodySmall" lines={1}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </PressScale>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.block}>
          <SectionHeader title="Payment summary" />
          <Card variant="flat" padding="base">
            <PriceSummary
              totals={{
                itemCount: order.itemCount,
                itemTotal: order.totals.itemTotal,
                productSavings: order.totals.productSavings,
                deliveryFee: order.totals.deliveryFee,
                handlingFee: order.totals.handlingFee,
                couponDiscount: order.totals.couponDiscount,
                totalSavings: order.totals.totalSavings,
                payable: order.totals.payable,
                freeDeliveryUnlocked: order.totals.deliveryFee === 0,
                amountToFreeDelivery: 0,
                appliedCoupon: null,
              }}
            />
          </Card>
        </View>

        {order.rating !== undefined ? (
          <View style={styles.block}>
            <Card variant="flat" padding="base" style={styles.ratedCard}>
              <Text variant="bodySmall" lines={1}>
                You rated this order
              </Text>
              <Rating rating={order.rating} showValue={false} size={18} />
            </Card>
          </View>
        ) : null}

        {canRate ? (
          <View style={styles.block}>
            <SectionHeader title="Rate this order" subtitle="Your feedback helps the store" />
            <Card variant="flat" padding="base" style={styles.rateCard}>
              <View style={styles.stars}>
                {RATING_VALUES.map((value) => (
                  <PressScale
                    key={value}
                    onPress={() => setPendingRating(value)}
                    scaleTo={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`${value} star${value === 1 ? '' : 's'}`}
                    style={styles.star}>
                    <Text
                      variant="h2"
                      color={
                        (pendingRating ?? order.rating ?? 0) >= value
                          ? colors.warning
                          : colors.textSubtle
                      }>
                      {'★'}
                    </Text>
                  </PressScale>
                ))}
              </View>

              <Button
                label="Submit rating"
                disabled={pendingRating === null}
                onPress={() => {
                  if (pendingRating === null) return;
                  orders.rateOrder(order.id, pendingRating);
                  toast.show({
                    message: 'Thanks for rating your order.',
                    variant: 'success',
                  });
                }}
              />
            </Card>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        {cancelOpen ? (
          <View style={styles.confirm}>
            <Text variant="bodySmall" lines={2} style={styles.grow}>
              Cancel this order? Any amount paid is refunded within 3–5 business days.
            </Text>
            <Button
              label="Keep it"
              variant="ghost"
              size="sm"
              onPress={() => setCancelOpen(false)}
            />
            <Button label="Cancel order" variant="danger" size="sm" onPress={confirmCancel} />
          </View>
        ) : (
          <View style={styles.actions}>
            {canCancel ? (
              <Button
                label="Cancel order"
                variant="secondary"
                onPress={() => setCancelOpen(true)}
                style={styles.grow}
              />
            ) : null}
            {canReorder ? (
              <Button
                label="Reorder"
                onPress={() => {
                  const count = orders.reorder(order);
                  toast.show({
                    message:
                      count > 0
                        ? `${count} ${count === 1 ? 'item' : 'items'} added back to your cart.`
                        : 'Those items are no longer available.',
                    variant: count > 0 ? 'cart' : 'info',
                    action: count > 0 ? { label: 'View cart', onPress: () => router.push('/cart') } : undefined,
                  });
                }}
                style={styles.grow}
              />
            ) : (
              <Button
                label="Start shopping"
                onPress={() => router.push('/categories')}
                style={styles.grow}
              />
            )}
          </View>
        )}
      </View>
    </View>
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
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  content: {
    paddingHorizontal: gutter,
    paddingTop: spacing.sm,
  },
  grow: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
  },
  hero: {
    gap: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eta: {
    marginTop: spacing.xxs,
  },
  block: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  items: {
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  itemDivider: {
    marginVertical: 0,
    marginHorizontal: spacing.base,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  itemCopy: {
    flex: 1,
    gap: 1,
  },
  ratedCard: {
    gap: spacing.sm,
  },
  rateCard: {
    gap: spacing.md,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  star: {
    padding: spacing.xs,
  },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  confirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
