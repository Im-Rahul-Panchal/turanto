import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ProductImage } from './product-image';
import { QuantityStepper } from './quantity-stepper';
import { Rating } from './rating';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { useCart } from '@/providers/cart-provider';
import { useFavorites } from '@/providers/favorites-provider';
import { formatPrice } from '@/utils/pricing';
import { colors, radius, spacing } from '@/theme';
import type { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  /** Grid cards are square; rail cards are a fixed width and shorter. */
  layout?: 'grid' | 'rail';
  showRating?: boolean;
  showUnit?: boolean;
  width?: number;
};

/**
 * Product tile used by the home grid, category screens, search results and the
 * "Buy again" rail.
 *
 * Memoised because these live inside long `FlatList`s where a re-render of one
 * card must not cost the whole row. The add/stepper switch is driven by cart
 * state, so the control under a tile is always the truth.
 */
export const ProductCard = memo(function ProductCard({
  product,
  layout = 'grid',
  showRating = true,
  showUnit = true,
  width,
}: ProductCardProps) {
  const cart = useCart();
  const favorites = useFavorites();

  const quantity = cart.quantityOf(product.id);
  const inCart = quantity > 0;
  const isFavorite = favorites.isFavorite(product.id);
  const outOfStock = product.stockStatus === 'out_of_stock';

  function open() {
    // The object form stays type-safe against the generated route map, unlike a
    // widened `const href = `/product/${id}`` which collapses to plain `string`.
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  }

  return (
    <View style={[styles.base, layout === 'rail' && styles.rail, width ? { width } : null]}>
      <PressScale
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, ${product.unit}, ${formatPrice(product.price)}`}
        scaleTo={0.98}
        style={styles.mediaWrap}>
        <ProductImage
          imageKey={product.imageKey}
          accessibilityLabel={product.name}
          width={width}
          height={width}
          style={styles.media}
        />

        {product.discountPercentage > 0 ? (
          <Badge label={`${product.discountPercentage}% OFF`} tone="accent" variant="soft" style={styles.discount} />
        ) : null}

        {outOfStock ? (
          <View style={styles.soldOut}>
            <Text variant="discount" color={colors.textOnPrimary}>
              SOLD OUT
            </Text>
          </View>
        ) : null}
      </PressScale>

      <View style={styles.favorite}>
        <IconButton
          name="heart"
          size={30}
          iconSize={15}
          color={isFavorite ? colors.accent : colors.textMuted}
          backgroundColor={isFavorite ? colors.accentSoft : colors.surface}
          accessibilityLabel={isFavorite ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          onPress={() => favorites.toggle(product)}
        />
      </View>

      <PressScale
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={product.name}
        scaleTo={0.99}
        style={styles.body}>
        <Text variant="bodySmall" lines={2}>
          {product.name}
        </Text>

        {showUnit ? (
          <Text variant="caption" lines={1}>
            {product.unit}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text variant="price" color={colors.text}>
            {formatPrice(product.price)}
          </Text>
          {product.mrp > product.price ? (
            <Text variant="caption" style={styles.mrp} lines={1}>
              {formatPrice(product.mrp)}
            </Text>
          ) : null}
        </View>

        {showRating ? <Rating rating={product.rating} reviewCount={product.reviewCount} /> : null}
      </PressScale>

      <View style={styles.action}>
        {outOfStock ? (
          <Text variant="caption" center>
            Currently unavailable
          </Text>
        ) : inCart ? (
          <QuantityStepper
            quantity={quantity}
            productName={product.name}
            onIncrement={() => cart.increment(product.id)}
            onDecrement={() => cart.decrement(product.id)}
            variant="compact"
          />
        ) : (
          <PressScale
            onPress={() => cart.addItem(product)}
            haptic="medium"
            scaleTo={0.94}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart`}
            style={styles.addButton}>
            <View style={styles.addIcon}>
              <Icon name="plus" size={16} color={colors.primaryDark} />
            </View>
            <Text variant="buttonSmall" color={colors.primaryDark} lines={1}>
              Add
            </Text>
          </PressScale>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  rail: {
    flex: 0,
    width: 156,
  },
  mediaWrap: {
    position: 'relative',
  },
  media: {
    width: '100%',
    aspectRatio: 1,
  },
  discount: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  soldOut: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 32, 26, 0.55)',
    borderRadius: radius.md,
  },
  favorite: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  body: {
    gap: spacing.xxs,
    paddingTop: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
  action: {
    paddingTop: spacing.sm,
    minHeight: 32,
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  addIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLighter,
  },
});
