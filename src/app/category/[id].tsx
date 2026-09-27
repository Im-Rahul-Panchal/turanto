import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product/product-card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { PressScale } from '@/components/ui/press-scale';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { getCategory, getProductsByCategory } from '@/data';
import { useResponsive } from '@/hooks/use-responsive';
import { applyProductFilters, defaultFilters, sortProducts } from '@/utils/filtering';
import { colors, gutter, getGridItemWidth, radius, spacing, tints } from '@/theme';
import type { SortKey } from '@/types';

const GRID_GAP = spacing.md;

/**
 * Category listing.
 *
 * A grid rather than a vertical list: shoppers scan shelves, they do not read
 * them, so two-up imagery is the faster interface even on small phones. The
 * column count and item width come from the live window so tablets and the web
 * build get more columns instead of stretched cards.
 */
export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width, gridColumns } = useResponsive();

  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('popularity');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const category = typeof id === 'string' ? getCategory(id) : undefined;
  const tint = category ? tints[category.tint] : null;

  const products = useMemo(
    () => (category ? getProductsByCategory(category.id) : []),
    [category],
  );

  const visible = useMemo(() => {
    const filtered = applyProductFilters(products, {
      ...defaultFilters,
      subcategoryIds: subcategory ? [subcategory] : [],
      inStockOnly: onlyInStock,
    });
    return sortProducts(filtered, sort);
  }, [products, subcategory, onlyInStock, sort]);

  const itemWidth = getGridItemWidth(width, GRID_GAP);

  if (!category) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Header onBack={() => router.back()} title="Category" />
        <View style={styles.missing}>
          <EmptyState
            imageKey="error-state"
            title="Category not found"
            description="This collection may have been renamed or removed."
            actionLabel="Browse categories"
            onActionPress={() => router.push('/categories')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={visible}
        keyExtractor={(product) => product.id}
        numColumns={gridColumns}
        columnWrapperStyle={gridColumns > 1 ? { gap: GRID_GAP } : undefined}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.navRow}>
              <IconButton
                name="arrow-left"
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                backgroundColor={tint?.soft ?? undefined}
              />
              <View style={styles.grow} />
              <IconButton
                name="search"
                accessibilityLabel="Search this category"
                onPress={() => router.push('/search')}
                backgroundColor={tint?.soft ?? undefined}
              />
            </View>

            <View style={styles.titleBlock}>
              <Text variant="emojiLarge" accessibilityElementsHidden>
                {category.glyph}
              </Text>
              <Text variant="h1" lines={2}>
                {category.name}
              </Text>
              <Text variant="bodySmall" color={tint?.strong} lines={2}>
                {`${category.tagline} · ${visible.length} of ${products.length} items`}
              </Text>
            </View>

            <FlatList
              data={[{ id: 'all', name: 'All' }, ...category.subcategories]}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              renderItem={({ item }) => (
                <Chip
                  label={item.name}
                  selected={subcategory === (item.id === 'all' ? null : item.id)}
                  onPress={() => setSubcategory(item.id === 'all' ? null : item.id)}
                />
              )}
            />

            <View style={styles.controls}>
              <View style={styles.grow}>
                <SegmentedControl
                  options={[
                    { value: 'popularity', label: 'Popular' },
                    { value: 'price_asc', label: 'Low price' },
                    { value: 'price_desc', label: 'High price' },
                    { value: 'rating', label: 'Rating' },
                  ]}
                  value={sort}
                  onChange={setSort}
                />
              </View>
              <PressScale
                onPress={() => setOnlyInStock((value) => !value)}
                scaleTo={0.94}
                accessibilityRole="switch"
                accessibilityState={{ checked: onlyInStock }}
                accessibilityLabel="Hide out of stock items"
                style={[styles.stockToggle, onlyInStock && styles.stockToggleOn]}>
                <IconButton
                  name={onlyInStock ? 'circle-check' : 'filter'}
                  size={34}
                  iconSize={16}
                  color={onlyInStock ? colors.success : colors.textSecondary}
                  backgroundColor="transparent"
                  accessibilityLabel={onlyInStock ? 'Showing in-stock only' : 'Showing all items'}
                />
              </PressScale>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.cell, { width: itemWidth, marginBottom: GRID_GAP }]}>
            <ProductCard
              product={item}
              layout="grid"
              width={itemWidth}
              showUnit
              showRating
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {onlyInStock || subcategory ? (
              <EmptyState
                imageKey="empty-search"
                title="Nothing matches those filters"
                description="Try clearing the filters to see everything in this category."
                actionLabel="Clear filters"
                onActionPress={() => {
                  setSubcategory(null);
                  setOnlyInStock(false);
                }}
              />
            ) : (
              <EmptyState
                imageKey="empty-cart"
                title="Coming soon"
                description={`We are stocking up on ${category.name.toLowerCase()}. Check back shortly.`}
                actionLabel="See other categories"
                onActionPress={() => router.push('/categories')}
              />
            )}
          </View>
        }
        ListFooterComponent={
          visible.length > 0 ? (
            <Text variant="caption" center lines={2} style={styles.footer}>
              Prices include all taxes. Items marked sold out will be back soon.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerBar, { paddingTop: insets.top + spacing.sm }]}>
      <IconButton name="arrow-left" accessibilityLabel="Go back" onPress={onBack} />
      <Text variant="bodyMedium" lines={1} style={styles.grow}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  grow: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: gutter,
    paddingBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: gutter,
  },
  header: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  chips: {
    gap: spacing.sm,
    paddingRight: gutter,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stockToggle: {
    borderRadius: radius.pill,
  },
  stockToggleOn: {
    backgroundColor: colors.successSoft,
  },
  cell: {
    alignSelf: 'flex-start',
  },
  empty: {
    paddingVertical: spacing.xxl,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
