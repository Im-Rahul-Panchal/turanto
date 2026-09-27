import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddressCard } from '@/components/address/address-card';
import { PriceSummary } from '@/components/cart/price-summary';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon, type LucideIconName } from '@/components/ui/icon';
import { PressScale } from '@/components/ui/press-scale';
import { QuantityStepper } from '@/components/product/quantity-stepper';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { coupons } from '@/data';
import { getImage } from '@/lib/images';
import { useCart } from '@/providers/cart-provider';
import { useOrders } from '@/providers/orders-provider';
import { useToast } from '@/providers/toast-provider';
import { useUser } from '@/providers/user-provider';
import { formatPrice } from '@/utils/pricing';
import { colors, gutter, radius, spacing } from '@/theme';
import type { PaymentMethod } from '@/types';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string; icon: LucideIconName }[] = [
  { id: 'upi', label: 'UPI', hint: 'Pay with any UPI app', icon: 'smartphone' },
  { id: 'cod', label: 'Cash on delivery', hint: 'Pay the rider at the door', icon: 'banknote' },
  { id: 'card', label: 'Card', hint: 'Credit or debit', icon: 'credit-card' },
  { id: 'wallet', label: 'Wallet', hint: 'Turanto wallet balance', icon: 'wallet' },
];

const INSTRUCTIONS = [
  'Leave the packet at the door',
  'Call when you arrive',
  'Ring the bell twice',
  'Do not disturb neighbours',
];

/**
 * Checkout.
 *
 * The order is placed from a single explicit button rather than on selection
 * changes: a two-tap commit is the right pattern for anything that cannot be
 * undone, and it keeps accidental taps from creating ghost orders.
 */
export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const orders = useOrders();
  const toast = useToast();
  const { addresses, selectedAddress, selectAddress, labelFor } = useUser();

  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [instructions, setInstructions] = useState<string | null>(null);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  const { items, summary } = cart;

  const savings = useMemo(
    () => summary.totalSavings + Math.max(0, summary.taxes),
    [summary.totalSavings, summary.taxes],
  );

  if (items.length === 0) {
    return (
      <View style={styles.root}>
        <View style={[styles.nav, { paddingTop: insets.top + spacing.sm }]}>
          <Button label="Back" variant="ghost" size="sm" onPress={() => router.back()} />
        </View>
        <View style={styles.missing}>
          <EmptyState
            imageKey="empty-cart"
            title="Your cart is empty"
            description="Add a few items before checking out."
            actionLabel="Start shopping"
            onActionPress={() => router.push('/categories')}
          />
        </View>
      </View>
    );
  }

  function placeOrder() {
    if (!selectedAddress) {
      toast.show({ message: 'Choose a delivery address first.', variant: 'info' });
      setAddressSheetOpen(true);
      return;
    }

    setPlacing(true);
    try {
      const order = orders.placeOrder({
        address: selectedAddress,
        paymentMethod: payment,
        instructions: instructions ?? undefined,
      });

      cart.clear();
      router.replace({ pathname: '/order-success/[id]', params: { id: order.id } });
    } catch (error) {
      setPlacing(false);
      toast.show({
        message: error instanceof Error ? error.message : 'Could not place the order.',
        variant: 'error',
      });
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.nav}>
          <Button label="Back" variant="ghost" size="sm" onPress={() => router.back()} />
          <Text variant="bodyMedium" lines={1} style={styles.navTitle}>
            Checkout
          </Text>
          <View style={styles.navSpacer} />
        </View>

        <View style={styles.block}>
          <SectionHeader
            title="Delivering to"
            actionLabel="Change"
            onActionPress={() => setAddressSheetOpen(true)}
          />
          {selectedAddress ? (
            <PressScale
              onPress={() => setAddressSheetOpen(true)}
              scaleTo={0.99}
              accessibilityRole="button"
              accessibilityLabel="Change delivery address"
              accessibilityHint={`Currently delivering to ${labelFor(selectedAddress.label)}`}>
              <AddressCard address={selectedAddress} labelFor={labelFor} />
            </PressScale>
          ) : (
            <Card variant="flat" padding="base" style={styles.noAddress}>
              <Icon name="map-pin-off" size={20} color={colors.warning} />
              <Text variant="bodySmall" color={colors.textSecondary} lines={2} style={styles.grow}>
                No delivery address selected. Add one to continue.
              </Text>
              <Button
                label="Add"
                size="sm"
                onPress={() => router.push('/addresses')}
              />
            </Card>
          )}
        </View>

        <View style={styles.block}>
          <SectionHeader title={`Items (${summary.itemCount})`} />
          <Card variant="flat" padding="none" style={styles.items}>
            {items.map((item, index) => (
              <View key={item.productId}>
                {index > 0 ? <Divider style={styles.itemDivider} /> : null}
                <View style={styles.item}>
                  <Image
                    source={getImage(item.product.imageKey)}
                    style={styles.itemImage}
                    contentFit="cover"
                    transition={120}
                    accessibilityElementsHidden
                  />
                  <View style={styles.itemCopy}>
                    <Text variant="bodySmall" lines={2}>
                      {item.product.name}
                    </Text>
                    <Text variant="caption" lines={1}>
                      {`${formatPrice(item.product.price)} · ${item.product.unit}`}
                    </Text>
                  </View>

                  <QuantityStepper
                    quantity={item.quantity}
                    productName={item.product.name}
                    max={10}
                    onIncrement={() => cart.increment(item.productId)}
                    onDecrement={() => cart.decrement(item.productId)}
                  />
                </View>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.block}>
          <SectionHeader title="Delivery instructions" subtitle="Optional" />
          <View style={styles.chips}>
            {INSTRUCTIONS.map((option) => (
              <PressScale
                key={option}
                onPress={() => setInstructions((current) => (current === option ? null : option))}
                scaleTo={0.95}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: instructions === option }}
                accessibilityLabel={option}
                style={[styles.instruction, instructions === option && styles.instructionOn]}>
                <Text
                  variant="caption"
                  color={instructions === option ? colors.textOnPrimary : colors.textSecondary}
                  lines={1}>
                  {option}
                </Text>
              </PressScale>
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <SectionHeader title="Payment method" />
          <Card variant="flat" padding="none" style={styles.payments}>
            {PAYMENT_METHODS.map((method, index) => {
              const selected = payment === method.id;
              return (
                <View key={method.id}>
                  {index > 0 ? <Divider style={styles.itemDivider} /> : null}
                  <PressScale
                    onPress={() => setPayment(method.id)}
                    scaleTo={0.99}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, checked: selected }}
                    accessibilityLabel={`${method.label}. ${method.hint}`}
                    style={styles.payment}>
                    <View style={[styles.radio, selected && styles.radioOn]}>
                      {selected ? <Icon name="check" size={12} color={colors.textOnPrimary} /> : null}
                    </View>
                    <Icon name={method.icon} size={18} color={colors.textSecondary} />
                    <View style={styles.paymentCopy}>
                      <Text variant="bodySmall" lines={1}>
                        {method.label}
                      </Text>
                      <Text variant="caption" lines={1}>
                        {method.hint}
                      </Text>
                    </View>
                  </PressScale>
                </View>
              );
            })}
          </Card>
        </View>

        <View style={styles.block}>
          <SectionHeader title="Bill details" />
          <Card variant="flat" padding="base">
            <PriceSummary
              totals={{
                itemCount: summary.itemCount,
                itemTotal: summary.itemTotal,
                productSavings: summary.productSavings,
                deliveryFee: summary.deliveryFee,
                handlingFee: summary.handlingFee,
                couponDiscount: summary.couponDiscount,
                totalSavings: summary.totalSavings,
                payable: summary.payable,
                freeDeliveryUnlocked: summary.freeDeliveryUnlocked,
                amountToFreeDelivery: summary.amountToFreeDelivery,
                appliedCoupon: summary.appliedCoupon,
              }}
            />
          </Card>
        </View>

        {cart.couponCode === null && coupons.length > 0 ? (
          <View style={styles.block}>
            <SectionHeader title="Available coupons" />
            {coupons.map((coupon) => (
              <Card key={coupon.code} variant="flat" padding="base" style={styles.coupon}>
                <View style={styles.grow}>
                  <Text variant="bodySmall" lines={1}>
                    {coupon.description}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} lines={1}>
                    {`Min order ${formatPrice(coupon.minOrderValue)}`}
                  </Text>
                </View>
                <Button
                  label="Apply"
                  variant="secondary"
                  size="sm"
                  onPress={() => {
                    const result = cart.applyCoupon(coupon.code);
                    toast.show({
                      message: result.message,
                      variant: result.ok ? 'success' : 'info',
                    });
                  }}
                />
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <View style={styles.footerTop}>
          <View>
            <Text variant="caption" color={colors.textSecondary} lines={1}>
              To pay
            </Text>
            <Text variant="priceLarge" lines={1}>
              {formatPrice(summary.payable)}
            </Text>
          </View>
          {savings > 0 ? (
            <Text variant="caption" color={colors.success} lines={1}>
              {`You save ${formatPrice(savings)}`}
            </Text>
          ) : null}
        </View>

        <Button
          label={placing ? 'Placing order…' : 'Place order'}
          size="lg"
          block
          disabled={placing}
          onPress={placeOrder}
        />
      </View>

      <BottomSheet
        visible={addressSheetOpen}
        onClose={() => setAddressSheetOpen(false)}
        title="Choose delivery address">
        {addresses.map((address) => (
          <View key={address.id} style={styles.sheetItem}>
            <AddressCard
              address={address}
              labelFor={labelFor}
              selectable
              selected={address.id === selectedAddress?.id}
              onPress={() => {
                selectAddress(address.id);
                setAddressSheetOpen(false);
              }}
            />
          </View>
        ))}

        <Button
          label="Add a new address"
          variant="secondary"
          block
          style={styles.sheetAction}
          onPress={() => {
            setAddressSheetOpen(false);
            router.push('/addresses');
          }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  content: {
    paddingHorizontal: gutter,
    paddingBottom: spacing.huge,
  },
  grow: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
  },
  navSpacer: {
    width: 56,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
  },
  block: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  noAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  instruction: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  instructionOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  payments: {
    overflow: 'hidden',
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  radioOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentCopy: {
    flex: 1,
  },
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerTop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sheetItem: {
    marginBottom: spacing.md,
  },
  sheetAction: {
    marginTop: spacing.sm,
  },
});
