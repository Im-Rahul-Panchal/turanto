import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderCard } from '@/components/order/order-card';
import { isOrderActive } from '@/components/order/order-status-pill';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useOrders } from '@/providers/orders-provider';
import { colors, gutter, spacing } from '@/theme';

const TABS = [
  { key: 'active', label: 'Active' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/**
 * Order history.
 *
 * Split into Active / Past / Cancelled because those are the only three things
 * a shopper ever looks for, and a single chronological list makes the one
 * undelivered order easy to lose among delivered ones.
 */
export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { activeOrders, pastOrders, orders } = useOrders();
  const [tab, setTab] = useState<TabKey>('active');

  const cancelled = useMemo(
    () => orders.filter((order) => order.status === 'cancelled'),
    [orders],
  );

  const visible = useMemo(() => {
    if (tab === 'active') return activeOrders;
    if (tab === 'past') return pastOrders.filter((order) => order.status !== 'cancelled');
    return cancelled;
  }, [tab, activeOrders, pastOrders, cancelled]);

  const counts: Record<TabKey, number> = {
    active: activeOrders.length,
    past: pastOrders.filter((order) => order.status !== 'cancelled').length,
    cancelled: cancelled.length,
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={visible}
        keyExtractor={(order) => order.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.huge }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.navRow}>
              <IconButton
                name="arrow-left"
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                backgroundColor={colors.surface}
              />
              <Text variant="h2" lines={1} style={styles.title}>
                My orders
              </Text>
              <View style={styles.spacer} />
            </View>

            <View style={styles.tabs}>
              {TABS.map((item) => (
                <Chip
                  key={item.key}
                  label={`${item.label}${counts[item.key] > 0 ? ` · ${counts[item.key]}` : ''}`}
                  selected={tab === item.key}
                  onPress={() => setTab(item.key)}
                />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => <OrderCard order={item} showEta={isOrderActive(item.status)} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              imageKey={tab === 'cancelled' ? 'empty-orders' : 'empty-cart'}
              title={
                tab === 'active'
                  ? 'No active orders'
                  : tab === 'past'
                    ? 'No past orders yet'
                    : 'No cancelled orders'
              }
              description={
                tab === 'active'
                  ? 'Your live deliveries will show up here with real-time tracking.'
                  : tab === 'past'
                    ? 'Once an order is delivered it will be listed here.'
                    : 'Cancelled orders are refunded within 3–5 business days.'
              }
              actionLabel={tab === 'active' ? 'Start shopping' : undefined}
              onActionPress={() => router.push('/categories')}
            />
          </View>
        }
        ListFooterComponent={
          visible.length > 0 ? (
            <View style={styles.footer}>
              <Text variant="caption" center lines={2}>
                Need help with an order? Our support team replies within a few hours.
              </Text>
              <Button
                label="Contact support"
                variant="secondary"
                size="sm"
                onPress={() => router.push('/offers')}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  list: {
    paddingHorizontal: gutter,
  },
  header: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  separator: {
    height: spacing.md,
  },
  empty: {
    paddingVertical: spacing.xxl,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
});
