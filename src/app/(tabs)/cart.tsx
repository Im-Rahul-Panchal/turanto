import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { QuantityStepper } from '@/components/product/quantity-stepper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { PressScale } from '@/components/ui/press-scale';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { getProduct } from '@/data/products';
import { getImage } from '@/lib/images';
import { useCart } from '@/providers/cart-provider';
import { formatPrice } from '@/utils/pricing';
import { colors, gutter, radius, spacing } from '@/theme';
import type { CartItem } from '@/types';

type Tab = 'current' | 'saved';

/**
 * Cart screen.
 *
 * Keeps the bill summary in a sticky footer so the total and the checkout action
 * stay reachable no matter how many lines the list has.
 */
export default function CartScreen() {
  const cart = useCart();
  const [tab, setTab] = useState<Tab>('current');

  const savedProducts = useMemo(
    () =>
      cart.saved
        .map((entry) => getProduct(entry.productId))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [cart.saved],
  );

  const isEmpty = cart.items.length === 0;
  const showEmpty = tab === 'current' ? isEmpty : savedProducts.length === 0;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="h1" lines={1}>
          Your cart
        </Text>
        {cart.items.length > 0 ? (
          <Badge
            label={`${cart.summary.itemCount} ${cart.summary.itemCount === 1 ? 'item' : 'items'}`}
            tone="primary"
          />
        ) : null}
      </View>

      <View style={styles.tabs}>
        <SegmentedControl
          options={[
            { value: 'current', label: `Cart (${cart.items.length})` },
            { value: 'saved', label: `Saved (${cart.saved.length})` },
          ]}
          value={tab}
          onChange={setTab}
          accessibilityLabel="Cart or saved items"
        />
      </View>

      {showEmpty ? (
        <View style={styles.empty}>
          {tab === 'current' ? (
            <EmptyState
              imageKey="empty-cart"
              title="Your cart is empty"
              description="Add your favourite groceries and they will show up here, ready for checkout."
              actionLabel="Start shopping"
              onActionPress={() => router.push('/categories')}
            />
          ) : (
            <EmptyState
              imageKey="empty-favorites"
              title="Nothing saved yet"
              description="Tap Save on any product to park it here for later."
              actionLabel="Browse products"
              onActionPress={() => router.push('/categories')}
            />
          )}
        </View>
      ) : tab === 'current' ? (
        <FlatList
          data={cart.items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={<FreeDeliveryHint summary={cart.summary} />}
          ListEmptyComponent={null}
          initialNumToRender={8}
          windowSize={7}
          removeClippedSubviews
        />
      ) : (
        <FlatList
          data={savedProducts}
          keyExtractor={savedKeyExtractor}
          renderItem={renderSaved}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={Separator}
          initialNumToRender={8}
        />
      )}

      {tab === 'current' && !isEmpty ? (
        <View style={styles.footer}>
          <BillSummary summary={cart.summary} />
          <Button
            label={`Proceed to checkout · ${formatPrice(cart.summary.payable)}`}
            onPress={() => router.push('/checkout')}
            size="lg"
            block
            icon="arrow-right"
          />
        </View>
      ) : null}
    </View>
  );
}

function renderItem({ item }: { item: CartItem }) {
  return <CartRow item={item} />;
}

function renderSaved({ item }: { item: NonNullable<ReturnType<typeof getProduct>> }) {
  return <SavedRow product={item} />;
}

function CartRow({ item }: { item: CartItem }) {
  const cart = useCart();
  const { product, quantity, lineTotal, lineSavings } = item;

  return (
    <View style={styles.row}>
      <PressScale
        onPress={() => router.push(`/product/${product.id}`)}
        accessibilityRole="button"
        accessibilityLabel={product.name}
        scaleTo={0.97}>
        <Image
          source={getImage(product.imageKey)}
          style={styles.rowImage}
          contentFit="cover"
          transition={150}
          accessible
          accessibilityLabel={product.name}
        />
      </PressScale>

      <View style={styles.rowBody}>
        <Text variant="bodySmall" lines={2}>
          {product.name}
        </Text>
        <Text variant="caption" lines={1}>
          {product.unit}
        </Text>

        <View style={styles.rowPriceRow}>
          <Text variant="price">{formatPrice(lineTotal)}</Text>
          {lineSavings > 0 ? (
            <Text variant="caption" style={styles.strike}>
              {formatPrice(product.mrp * quantity)}
            </Text>
          ) : null}
        </View>

        <View style={styles.rowActions}>
          <QuantityStepper
            quantity={quantity}
            productName={product.name}
            onIncrement={() => cart.increment(product.id)}
            onDecrement={() => cart.decrement(product.id)}
            variant="compact"
          />

          <IconButton
            name="bookmark"
            size={30}
            iconSize={15}
            backgroundColor="transparent"
            color={colors.textMuted}
            accessibilityLabel={`Save ${product.name} for later`}
            onPress={() => cart.toggleSaveForLater(product)}
          />
        </View>
      </View>
    </View>
  );
}

function SavedRow({ product }: { product: NonNullable<ReturnType<typeof getProduct>> }) {
  const cart = useCart();

  return (
    <View style={styles.row}>
      <PressScale
        onPress={() => router.push(`/product/${product.id}`)}
        accessibilityRole="button"
        accessibilityLabel={product.name}
        scaleTo={0.97}>
        <Image
          source={getImage(product.imageKey)}
          style={styles.rowImage}
          contentFit="cover"
          transition={150}
          accessible
          accessibilityLabel={product.name}
        />
      </PressScale>

      <View style={styles.rowBody}>
        <Text variant="bodySmall" lines={2}>
          {product.name}
        </Text>
        <Text variant="caption" lines={1}>
          {product.unit}
        </Text>
        <Text variant="price">{formatPrice(product.price)}</Text>

        <View style={styles.rowActions}>
          <Button
            label="Move to cart"
            size="sm"
            variant="secondary"
            icon="shopping-bag"
            onPress={() => cart.moveSavedToCart(product)}
          />
          <IconButton
            name="trash-2"
            size={30}
            iconSize={15}
            backgroundColor="transparent"
            color={colors.textMuted}
            accessibilityLabel={`Remove ${product.name} from saved`}
            onPress={() => cart.removeSaved(product.id)}
          />
        </View>
      </View>
    </View>
  );
}

/** Nudges the shopper toward the free-delivery threshold. */
function FreeDeliveryHint({ summary }: { summary: ReturnType<typeof useCart>['summary'] }) {
  if (summary.freeDeliveryUnlocked) {
    return (
      <View style={styles.hint}>
        <Badge label="Free delivery unlocked" tone="success" icon="truck" />
      </View>
    );
  }

  return (
    <View style={styles.hint}>
      <Text variant="caption" center>
        {`Add ${formatPrice(summary.amountToFreeDelivery)} more for free delivery`}
      </Text>
    </View>
  );
}

function BillSummary({ summary }: { summary: ReturnType<typeof useCart>['summary'] }) {
  return (
    <Card variant="ghost" padding="md" style={styles.bill}>
      <Row label="Item total" value={formatPrice(summary.itemTotal)} />
      <Row
        label="Delivery fee"
        value={summary.deliveryFee === 0 ? 'FREE' : formatPrice(summary.deliveryFee)}
        emphasis={summary.deliveryFee === 0}
      />
      <Row label="Handling" value={formatPrice(summary.handlingFee)} />
      {summary.couponDiscount > 0 ? (
        <Row label="Coupon" value={`− ${formatPrice(summary.couponDiscount)}`} emphasis discount />
      ) : null}
      <Divider style={styles.billDivider} />
      <Row label="To pay" value={formatPrice(summary.payable)} total />
      {summary.totalSavings > 0 ? (
        <Text variant="caption" color={colors.success} center>
          {`You save ${formatPrice(summary.totalSavings)} on this order`}
        </Text>
      ) : null}
    </Card>
  );
}

function Row({
  label,
  value,
  total,
  emphasis,
  discount,
}: {
  label: string;
  value: string;
  total?: boolean;
  emphasis?: boolean;
  discount?: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Text variant={total ? 'bodyMedium' : 'bodySmall'} color={colors.textSecondary}>
        {label}
      </Text>
      <Text
        variant={total ? 'priceLarge' : 'bodySmall'}
        color={discount ? colors.success : emphasis ? colors.success : colors.text}>
        {value}
      </Text>
    </View>
  );
}

function Separator() {
  return <Divider inset={84} style={styles.separator} />;
}

function keyExtractor(item: CartItem) {
  return item.productId;
}

function savedKeyExtractor(product: NonNullable<ReturnType<typeof getProduct>>) {
  return product.id;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.base,
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
  },
  tabs: {
    paddingHorizontal: gutter,
    paddingTop: spacing.base,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: gutter,
  },
  list: {
    paddingHorizontal: gutter,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowImage: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  separator: {
    marginVertical: spacing.md,
  },
  hint: {
    paddingTop: spacing.base,
  },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  bill: {
    gap: spacing.xs,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.base,
  },
  billDivider: {
    marginVertical: spacing.sm,
  },
});
