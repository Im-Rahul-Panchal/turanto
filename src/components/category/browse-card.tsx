import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { getProductCount } from '@/data/products';
import { getImage } from '@/lib/images';
import { colors, radius, spacing, tints } from '@/theme';
import type { Category, Product } from '@/types';

type BrowseCardProps = {
  category: Category;
  /** A few real products from the category, shown as thumbnails. */
  sampleProducts: Product[];
};

/**
 * Category entry for the Browse grid.
 *
 * Showing actual product thumbnails (rather than a generated category image)
 * makes browsing feel like a shop rather than a menu, and gives the shopper a
 * hint of what is inside before they commit to a category.
 */
export function BrowseCard({ category, sampleProducts }: BrowseCardProps) {
  const tint = tints[category.tint];
  const count = getProductCount(category.id);

  return (
    <PressScale
      onPress={() => router.push(`/category/${category.id}`)}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${count} products. ${category.tagline ?? ''}`}
      style={[styles.base, { borderColor: tint.mid, backgroundColor: tint.soft }]}>
      <View style={styles.header}>
        <View style={[styles.glyph, { backgroundColor: tint.mid }]}>
          <Text variant="emoji" accessibilityElementsHidden>
            {category.glyph}
          </Text>
        </View>

        <View style={styles.copy}>
          <Text variant="bodyMedium" color={tint.strong} lines={2}>
            {category.name}
          </Text>
          <Text variant="caption" color={tint.strong} lines={1}>
            {`${count} products`}
          </Text>
        </View>
      </View>

      {sampleProducts.length > 0 ? (
        <View style={styles.thumbs} importantForAccessibility="no-hide-descendants">
          {sampleProducts.map((product) => (
            <Image
              key={product.id}
              source={getImage(product.imageKey)}
              style={styles.thumb}
              contentFit="cover"
              transition={150}
            />
          ))}
        </View>
      ) : null}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  glyph: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  thumbs: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  thumb: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
});
