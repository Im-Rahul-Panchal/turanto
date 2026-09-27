import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';

import { ProductCard } from './product-card';
import { SectionHeader } from '@/components/ui/section-header';
import { gutter, spacing } from '@/theme';
import type { Product } from '@/types';

type ProductRailProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  products: Product[];
  /** "all" shows full cards with ratings; "compact" trims for tight rails. */
  density?: 'default' | 'compact';
  actionLabel?: string;
  onActionPress?: () => void;
  emptyMessage?: string;
};

/**
 * Horizontal product carousel.
 *
 * Backed by a `FlatList` rather than a `ScrollView` so the rails keep memory
 * flat when a screen mounts several of them, and so windowing behaves the same
 * as the vertical grids.
 */
export function ProductRail({
  title,
  eyebrow,
  subtitle,
  products,
  density = 'default',
  actionLabel,
  onActionPress,
}: ProductRailProps) {
  const compact = density === 'compact';

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.item}>
      <ProductCard
        product={item}
        layout="rail"
        showRating={!compact}
        showUnit={!compact}
        width={CARD_WIDTH}
      />
    </View>
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeader
          title={title}
          eyebrow={eyebrow}
          subtitle={subtitle}
          actionLabel={actionLabel}
          onActionPress={onActionPress}
        />
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        // Fixed widths allow a cheap initial render plus windowing.
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={3}
        removeClippedSubviews
        ListFooterComponent={<View style={styles.footer} />}
      />
    </View>
  );
}

const CARD_WIDTH = 156;

function keyExtractor(product: Product) {
  return product.id;
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  header: {
    paddingHorizontal: gutter,
    marginBottom: spacing.md,
  },
  rail: {
    paddingHorizontal: gutter,
  },
  item: {
    marginRight: spacing.md,
  },
  footer: {
    width: gutter,
  },
});
