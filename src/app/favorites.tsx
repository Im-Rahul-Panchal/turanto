import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useCart } from '@/providers/cart-provider';
import { useFavorites } from '@/providers/favorites-provider';
import { useToast } from '@/providers/toast-provider';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, gutter, getGridItemWidth, spacing } from '@/theme';

const GRID_GAP = spacing.md;

/**
 * Saved items.
 *
 * Favourites hold product ids only; the products are resolved from the catalogue
 * here, so a saved item that later goes off-sale still shows its current price
 * rather than a stale snapshot.
 */
export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const favorites = useFavorites();
  const cart = useCart();
  const toast = useToast();
  const { width, gridColumns } = useResponsive();

  const products = useMemo(
    () => favorites.products,
    [favorites.products],
  );

  const inStock = useMemo(
    () => products.filter((product) => product.stockStatus !== 'out_of_stock'),
    [products],
  );

  const itemWidth = getGridItemWidth(width, GRID_GAP);

  return (
    <View style={styles.root}>
      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        numColumns={gridColumns}
        columnWrapperStyle={gridColumns > 1 ? { gap: GRID_GAP } : undefined}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}
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
                Saved items
              </Text>
              <View style={styles.spacer} />
            </View>

            {products.length > 0 ? (
              <Text variant="caption" color={colors.textSecondary} lines={1}>
                {`${products.length} ${products.length === 1 ? 'item' : 'items'} saved for later`}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.cell, { width: itemWidth, marginBottom: GRID_GAP }]}>
            <ProductCard product={item} layout="grid" width={itemWidth} showUnit showRating />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              imageKey="empty-favorites"
              title="Nothing saved yet"
              description="Tap the heart on any product to keep it here for later."
              actionLabel="Browse products"
              onActionPress={() => router.push('/categories')}
            />
          </View>
        }
        ListFooterComponent={
          products.length > 1 ? (
            <View style={styles.footer}>
              <Button
                label={`Add ${inStock.length} to cart`}
                variant="secondary"
                block
                disabled={inStock.length === 0}
                onPress={() => {
                  inStock.forEach((product) => cart.addItem(product));
                  toast.show({
                    message: `${inStock.length} ${
                      inStock.length === 1 ? 'item' : 'items'
                    } added to your cart.`,
                    variant: 'cart',
                    action: { label: 'View cart', onPress: () => router.push('/cart') },
                  });
                  router.push('/cart');
                }}
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
    gap: spacing.xs,
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
  cell: {
    alignSelf: 'flex-start',
  },
  empty: {
    paddingVertical: spacing.xxl,
  },
  footer: {
    paddingTop: spacing.lg,
  },
});
