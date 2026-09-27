import { ScrollView, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { Image } from 'expo-image';

import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Icon, type LucideIconName } from '@/components/ui/icon';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { offers } from '@/data';
import { getImage } from '@/lib/images';
import { useCart } from '@/providers/cart-provider';
import { useFavorites } from '@/providers/favorites-provider';
import { useOrders } from '@/providers/orders-provider';
import { useUser } from '@/providers/user-provider';
import { colors, gutter, radius, spacing } from '@/theme';

type Row = {
  label: string;
  icon: LucideIconName;
  href: Href;
  badge?: string;
};

/**
 * Profile screen.
 *
 * Doubles as the app's "your activity" hub: live counts for cart, favourites and
 * orders read straight from the providers, so the numbers are never stale.
 */
export default function ProfileScreen() {
  const { user, selectedAddress, labelFor } = useUser();
  const cart = useCart();
  const favorites = useFavorites();
  const orders = useOrders();

  const rows: Row[] = [
    { label: 'My orders', icon: 'package', href: '/orders', badge: String(orders.orders.length) },
    {
      label: 'Saved items',
      icon: 'heart',
      href: '/favorites',
      badge: favorites.count > 0 ? String(favorites.count) : undefined,
    },
    { label: 'Delivery addresses', icon: 'map-pin', href: '/addresses' },
    { label: 'Offers and deals', icon: 'badge-percent', href: '/offers' },
    { label: 'Help and support', icon: 'circle-help', href: '/offers' },
    { label: 'About Turanto', icon: 'info', href: '/offers' },
  ];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={getImage('avatar-user')}
          style={styles.avatar}
          contentFit="cover"
          transition={150}
          accessible
          accessibilityLabel={`${user.name} profile photo`}
        />

        <View style={styles.identity}>
          <Text variant="h2" lines={1}>
            {user.name}
          </Text>
          <Text variant="bodySmall" lines={1}>
            {user.email}
          </Text>
          <Text variant="caption" lines={1}>
            {user.phone}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat label="In cart" value={cart.totalQuantity} href="/cart" />
        <Stat label="Favourites" value={favorites.count} href="/favorites" />
        <Stat label="Orders" value={orders.orders.length} href="/orders" />
      </View>

      {selectedAddress ? (
        <PressScale
          onPress={() => router.push('/addresses')}
          scaleTo={0.98}
          accessibilityRole="button"
          accessibilityLabel="Change delivery address"
          style={styles.address}>
          <Card variant="flat" padding="base" style={styles.addressCard}>
            <View style={styles.addressTop}>
              <Icon name="map-pin" size={16} color={colors.primaryDark} />
              <Text variant="bodyMedium" color={colors.primaryDark} lines={1}>
                {labelFor(selectedAddress.label)}
              </Text>
              <View style={styles.grow} />
              <Text variant="caption" color={colors.textSecondary} lines={1}>
                Change
              </Text>
            </View>
            <Text variant="bodySmall" lines={2}>
              {`${selectedAddress.line1}, ${selectedAddress.city} ${selectedAddress.pincode}`}
            </Text>
          </Card>
        </PressScale>
      ) : null}

      <Card variant="flat" padding="none" style={styles.menu}>
        {rows.map((row, index) => (
          <View key={row.label}>
            {index > 0 ? <Divider style={styles.menuDivider} /> : null}
            <MenuRow row={row} />
          </View>
        ))}
      </Card>

      <View style={styles.promo}>
        <Text variant="caption" center lines={2}>
          {`${offers.length} live deals · Free delivery over ₹499`}
        </Text>
        <Text variant="caption" center lines={1}>
          Turanto is a demo storefront. No real orders are placed.
        </Text>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: Href }) {
  return (
    <PressScale
      onPress={() => router.push(href)}
      scaleTo={0.95}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      style={styles.stat}>
      <Text variant="h2" lines={1}>
        {value}
      </Text>
      <Text variant="caption" lines={1}>
        {label}
      </Text>
    </PressScale>
  );
}

function MenuRow({ row }: { row: Row }) {
  return (
    <PressScale
      onPress={() => router.push(row.href)}
      scaleTo={0.99}
      accessibilityRole="button"
      accessibilityLabel={row.label}
      style={styles.menuRow}>
      <View style={styles.menuIcon}>
        <Icon name={row.icon} size={18} color={colors.primaryDark} />
      </View>

      <Text variant="body" lines={1} style={styles.menuLabel}>
        {row.label}
      </Text>

      {row.badge ? (
        <View style={styles.menuBadge}>
          <Text variant="caption" color={colors.primaryDark} lines={1}>
            {row.badge}
          </Text>
        </View>
      ) : null}

      <Icon name="chevron-right" size={16} color={colors.textSubtle} />
    </PressScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  identity: {
    flex: 1,
    gap: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  address: {
    marginTop: spacing.lg,
  },
  addressCard: {
    gap: spacing.xs,
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  grow: {
    flex: 1,
  },
  menu: {
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  menuLabel: {
    flex: 1,
  },
  menuBadge: {
    minWidth: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
  },
  menuDivider: {
    marginVertical: 0,
    marginLeft: 62,
  },
  promo: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
});
