import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderStatusPill, paymentLabel } from '@/components/order/order-status-pill';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { getImage } from '@/lib/images';
import { useOrders } from '@/providers/orders-provider';
import { useUser } from '@/providers/user-provider';
import { formatPrice } from '@/utils/pricing';
import { colors, gutter, radius, spacing } from '@/theme';

/**
 * Order confirmation.
 *
 * The only screen in the app with no header and a single clear next step. It is
 * reached with `replace`, so the back gesture returns to the store rather than
 * to a checkout for a cart that no longer exists.
 */
export default function OrderSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const orders = useOrders();
  const { labelFor } = useUser();

  const order = typeof id === 'string' ? orders.getOrder(id) : null;

  if (!order) {
    return (
      <View style={[styles.root, styles.centered, { paddingTop: insets.top }]}>
        <EmptyState
          imageKey="error-state"
          title="Order not found"
          description="We could not find that order. It may have been placed on another device."
          actionLabel="See all orders"
          onActionPress={() => router.replace('/orders')}
        />
      </View>
    );
  }

  const firstItems = order.items.slice(0, 3);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xxl, paddingBottom: spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.hero}>
          <View style={styles.tick}>
            <Image
              source={getImage('order-success')}
              style={styles.art}
              contentFit="contain"
              transition={220}
              accessibilityElementsHidden
            />
          </View>

          <Text variant="h1" center lines={2}>
            Order confirmed
          </Text>
          <Text variant="bodySmall" center lines={2} color={colors.textSecondary}>
            {`${order.reference} · arriving in ${order.etaLabel}`}
          </Text>

          <OrderStatusPill status={order.status} style={styles.pill} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(300)} style={styles.block}>
          <Card variant="flat" padding="base" style={styles.card}>
            <View style={styles.row}>
              <Text variant="bodySmall" color={colors.textSecondary} lines={1} style={styles.grow}>
                Delivering to
              </Text>
              <Text variant="bodySmall" lines={1}>
                {labelFor(order.deliveryAddress.label)}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="bodySmall" color={colors.textSecondary} lines={1} style={styles.grow}>
                Payment
              </Text>
              <Text variant="bodySmall" lines={1}>
                {paymentLabel(order.paymentMethod)}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="bodySmall" color={colors.textSecondary} lines={1} style={styles.grow}>
                Paid
              </Text>
              <Text variant="bodyMedium" lines={1}>
                {formatPrice(order.totals.payable)}
              </Text>
            </View>

            {order.totals.totalSavings > 0 ? (
              <>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                  <Text variant="bodySmall" color={colors.textSecondary} lines={1} style={styles.grow}>
                    You saved
                  </Text>
                  <Text variant="bodyMedium" color={colors.success} lines={1}>
                    {formatPrice(order.totals.totalSavings)}
                  </Text>
                </View>
              </>
            ) : null}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.block}>
          <Text variant="bodySmall" color={colors.textSecondary} lines={1}>
            {`${order.itemCount} ${order.itemCount === 1 ? 'item' : 'items'} in this order`}
          </Text>

          <View style={styles.thumbs}>
            {firstItems.map((item) => (
              <Image
                key={item.productId}
                source={getImage(item.imageKey)}
                style={styles.thumb}
                contentFit="cover"
                transition={150}
                accessibilityElementsHidden
              />
            ))}
            {order.items.length > firstItems.length ? (
              <View style={[styles.thumb, styles.more]}>
                <Text variant="caption" color={colors.textSecondary} lines={1}>
                  {`+${order.items.length - firstItems.length}`}
                </Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <Button
          label="Track order"
          size="lg"
          block
          onPress={() => router.replace({ pathname: '/orders/[id]', params: { id: order.id } })}
        />
        <Button
          label="Continue shopping"
          variant="ghost"
          block
          onPress={() => router.replace('/categories')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  centered: {
    justifyContent: 'center',
    paddingHorizontal: gutter,
  },
  content: {
    paddingHorizontal: gutter,
    gap: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  tick: {
    width: 132,
    height: 132,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  art: {
    width: 108,
    height: 108,
  },
  pill: {
    alignSelf: 'center',
  },
  block: {
    gap: spacing.sm,
  },
  card: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  grow: {
    flex: 1,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  thumbs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
