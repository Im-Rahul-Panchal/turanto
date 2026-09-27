import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductRail } from '@/components/product/product-rail';
import { QuantityStepper } from '@/components/product/quantity-stepper';
import { Rating } from '@/components/product/rating';
import { StockPill } from '@/components/product/stock-pill';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { PressScale } from '@/components/ui/press-scale';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { getCategory, getCategoryName, getProduct, resolveRelatedIds } from '@/data';
import { getImage } from '@/lib/images';
import { useCart } from '@/providers/cart-provider';
import { useFavorites } from '@/providers/favorites-provider';
import { formatPrice } from '@/utils/pricing';
import { colors, gutter, layout, shadows, spacing } from '@/theme';

/**
 * Product detail screen.
 *
 * Sticky add-to-cart bar with a quantity stepper, because on a long product page
 * the primary action must never scroll out of reach.
 */
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const cart = useCart();
  const favorites = useFavorites();
  const [quantity, setQuantity] = useState(1);

  const product = typeof id === 'string' ? getProduct(id) : undefined;
  const category = product ? getCategory(product.categoryId) : undefined;

  const related = useMemo(
    () => (product ? resolveRelatedIds(product.frequentlyBoughtWith, 10) : []),
    [product],
  );

  const inCart = product ? cart.quantityOf(product.id) : 0;

  if (!product) {
    return (
      <View style={styles.root}>
        <View style={[styles.back, { top: insets.top + spacing.sm }]}>
          <IconButton name="arrow-left" accessibilityLabel="Go back" onPress={() => router.back()} />
        </View>
        <View style={styles.missing}>
          <EmptyState
            imageKey="error-state"
            title="Product not found"
            description="This item may have been removed from the catalogue."
            actionLabel="Browse the store"
            onActionPress={() => router.push('/categories')}
          />
        </View>
      </View>
    );
  }

  const outOfStock = product.stockStatus === 'out_of_stock';
  const savings = (product.mrp - product.price) * quantity;

  function addToCart() {
    if (!product) return;
    cart.addItem(product, quantity);
    setQuantity(1);
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: layout.stickyBarHeight + insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mediaWrap}>
          <Image
            source={getImage(product.imageKey)}
            style={styles.media}
            contentFit="cover"
            transition={200}
            accessible
            accessibilityLabel={product.name}
          />
          {product.discountPercentage > 0 ? (
            <Badge
              label={`${product.discountPercentage}% OFF`}
              tone="accent"
              style={styles.discountBadge}
            />
          ) : null}
        </View>

        <Animated.View entering={FadeIn.duration(220)} style={styles.block}>
          <PressScale
            onPress={() => router.push(`/category/${product.categoryId}`)}
            scaleTo={0.98}
            accessibilityRole="button"
            accessibilityLabel={getCategoryName(product.categoryId)}
            style={styles.categoryLink}>
            <Text variant="overline" color={colors.primaryDark}>
              {getCategoryName(product.categoryId)}
            </Text>
            <Icon name="chevron-right" size={12} color={colors.primaryDark} />
          </PressScale>

          <Text variant="h1" lines={3}>
            {product.name}
          </Text>

          <Text variant="bodySmall" lines={2}>
            {product.unit}
          </Text>

          <View style={styles.metaRow}>
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
            <StockPill status={product.stockStatus} unitsLeft={product.unitsLeft} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(260)} style={styles.block}>
          <Card variant="flat" padding="base" style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text variant="priceLarge">{formatPrice(product.price)}</Text>
              {product.mrp > product.price ? (
                <>
                  <Text variant="bodySmall" style={styles.strike}>
                    {formatPrice(product.mrp)}
                  </Text>
                  <Badge label={`Save ${formatPrice(product.mrp - product.price)}`} tone="success" />
                </>
              ) : null}
            </View>
            {product.mrp > product.price ? (
              <Text variant="caption" color={colors.textSecondary}>
                {`Inclusive of all taxes · ${product.discountPercentage}% off`}
              </Text>
            ) : null}
          </Card>
        </Animated.View>

        {product.highlights.length > 0 ? (
          <View style={styles.block}>
            <SectionHeader title="Why you'll like it" />
            <Card variant="flat" padding="base" style={styles.highlights}>
              {product.highlights.map((highlight) => (
                <View key={highlight} style={styles.highlightRow}>
                  <Icon name="check" size={16} color={colors.primary} />
                  <Text variant="bodySmall" lines={2} style={styles.highlightText}>
                    {highlight}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        ) : null}

        {product.nutrition ? (
          <View style={styles.block}>
            <SectionHeader title="Nutrition" subtitle="Per 100 g / 100 ml" />
            <Card variant="flat" padding="none" style={styles.nutrition}>
              {product.nutrition.map((row, index) => (
                <View key={row.label}>
                  {index > 0 ? <Divider style={styles.nutritionDivider} /> : null}
                  <View style={styles.nutritionRow}>
                    <Text variant="bodySmall" color={colors.textSecondary}>
                      {row.label}
                    </Text>
                    <View style={styles.grow} />
                    <Text variant="bodySmall">{row.per100}</Text>
                    {row.dailyValue ? (
                      <Badge label={row.dailyValue} tone="primary" />
                    ) : null}
                  </View>
                </View>
              ))}
            </Card>
          </View>
        ) : null}

        {product.badges.length > 0 ? (
          <View style={styles.block}>
            <View style={styles.badgeRow}>
              {product.badges.map((badge) => (
                <Badge key={badge} label={badgeLabel(badge)} tone="tint" tint={category?.tint} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.block}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {product.description}
          </Text>
        </View>

        {related.length > 0 ? (
          <ProductRail
            title="Frequently bought together"
            products={related}
            density="compact"
          />
        ) : null}
      </ScrollView>

      <View style={[styles.sticky, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <View style={styles.backLayer} pointerEvents="box-none">
          <IconButton
            name="arrow-left"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.floatingButton}
          />
          <View style={styles.grow} />
          <IconButton
            name="heart"
            color={favorites.isFavorite(product.id) ? colors.accent : colors.charcoal}
            backgroundColor={favorites.isFavorite(product.id) ? colors.accentSoft : colors.surface}
            accessibilityLabel={
              favorites.isFavorite(product.id)
                ? `Remove ${product.name} from favourites`
                : `Save ${product.name} to favourites`
            }
            onPress={() => favorites.toggle(product)}
            style={styles.floatingButton}
          />
        </View>

        {inCart > 0 ? (
          <View style={styles.inCartRow}>
            <View style={styles.inCartInfo}>
              <Text variant="caption" color={colors.textSecondary}>
                In cart
              </Text>
              <Text variant="bodyMedium" lines={1}>
                {`${inCart} × ${formatPrice(product.price)}`}
              </Text>
            </View>
            <Button
              label="View cart"
              variant="secondary"
              size="sm"
              onPress={() => router.push('/cart')}
            />
          </View>
        ) : null}

        <View style={styles.stickyRow}>
          {outOfStock ? (
            <Button label="Out of stock" size="lg" block disabled />
          ) : (
            <>
              <View style={styles.stepper}>
                <QuantityStepper
                  quantity={quantity}
                  productName={product.name}
                  onIncrement={() => setQuantity((q) => Math.min(10, q + 1))}
                  onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                  variant="full"
                />
              </View>

              <Button
                label={savings > 0 ? `Add · ${formatPrice(product.price * quantity)}` : 'Add to cart'}
                onPress={addToCart}
                size="lg"
                style={styles.addButton}
                trailing={
                  <Icon name="arrow-right" size={18} color={colors.textOnPrimary} />
                }
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function badgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    bestseller: 'Bestseller',
    popular: 'Popular',
    new: 'New',
    organic: 'Organic',
    vegan: 'Vegan',
    deal: 'Great deal',
  };
  return labels[badge] ?? badge;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  content: {
    paddingTop: 0,
  },
  back: {
    position: 'absolute',
    left: gutter,
    zIndex: 2,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
  },
  mediaWrap: {
    position: 'relative',
  },
  media: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
  },
  block: {
    paddingHorizontal: gutter,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  categoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  priceCard: {
    gap: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  highlights: {
    gap: spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  highlightText: {
    flex: 1,
  },
  nutrition: {
    overflow: 'hidden',
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  nutritionDivider: {
    marginVertical: 0,
    marginHorizontal: spacing.base,
  },
  grow: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sticky: {
    paddingHorizontal: gutter,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  backLayer: {
    position: 'absolute',
    top: -56,
    left: gutter,
    right: gutter,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingButton: {
    ...shadows.sm,
  },
  inCartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  inCartInfo: {
    flex: 1,
  },
  stickyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepper: {
    width: 132,
  },
  addButton: {
    flex: 1,
  },
});
