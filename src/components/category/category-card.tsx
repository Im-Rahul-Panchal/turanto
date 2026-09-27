import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { getProductCount } from '@/data/products';
import { radius, spacing, tints } from '@/theme';
import type { Category } from '@/types';

type CategoryCardProps = {
  category: Category;
  /** `tile` is the home grid; `pill` is the compact browse strip. */
  variant?: 'tile' | 'pill';
  width?: number;
};

/**
 * Category entry point.
 *
 * The glyph is an emoji from the taxonomy, rendered as text so it needs no
 * icon mapping and reads correctly on iOS, Android and web. The surrounding
 * colour comes from the category's tint, so a category keeps a consistent
 * identity everywhere it appears.
 */
export const CategoryCard = memo(function CategoryCard({
  category,
  variant = 'tile',
  width,
}: CategoryCardProps) {
  const tint = tints[category.tint];
  const productCount = getProductCount(category.id);

  function open() {
    // The object form stays type-safe against the generated route map, unlike a
    // widened `const href = `/category/${id}`` which collapses to plain `string`.
    router.push({ pathname: '/category/[id]', params: { id: category.id } });
  }

  if (variant === 'pill') {
    return (
      <PressScale
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${category.name}, ${productCount} products`}
        scaleTo={0.95}
        style={[styles.pill, { backgroundColor: tint.soft }, width ? { width } : null]}>
        <Text variant="emoji" lines={1} accessibilityElementsHidden>
          {category.glyph}
        </Text>
        <Text variant="bodySmall" color={tint.strong} lines={1} center>
          {category.name}
        </Text>
      </PressScale>
    );
  }

  return (
    <PressScale
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${productCount} products`}
      scaleTo={0.96}
      style={[styles.tile, { backgroundColor: tint.soft }, width ? { width } : null]}>
      <View style={[styles.iconWrap, { backgroundColor: tint.mid }]}>
        <Text variant="emoji" accessibilityElementsHidden>
          {category.glyph}
        </Text>
      </View>

      <View style={styles.copy}>
        <Text variant="bodyMedium" color={tint.strong} lines={2}>
          {category.name}
        </Text>
        <Text variant="caption" color={tint.strong} lines={1}>
          {productCount} items
        </Text>
      </View>
    </PressScale>
  );
});

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 112,
  },
  pill: {
    width: 92,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 1,
  },
});
