import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors, spacing } from '@/theme';

type RatingProps = {
  rating: number;
  reviewCount?: number;
  size?: number;
  /** Shows "4.6 (1.2k)" instead of just the stars. */
  showValue?: boolean;
};

/**
 * Star rating.
 *
 * The stars are decorative and the value is exposed as a single readable label,
 * because reading five individual glyphs is noise for a screen reader.
 */
export function Rating({ rating, reviewCount, size = 14, showValue = true }: RatingProps) {
  const rounded = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 === 0.5;

  const label = reviewCount
    ? `Rated ${rating} out of 5 from ${reviewCount} reviews`
    : `Rated ${rating} out of 5`;

  return (
    <View
      style={styles.base}
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}>
      <View style={styles.stars} importantForAccessibility="no-hide-descendants">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            key={index}
            name={index < fullStars ? 'star' : hasHalf && index === fullStars ? 'star-half' : 'star-off'}
            size={size}
            color={index < fullStars || (hasHalf && index === fullStars) ? colors.star : colors.starEmpty}
          />
        ))}
      </View>

      {showValue ? (
        <Text variant="rating" color={colors.textSecondary}>
          {rating.toFixed(1)}
          {reviewCount ? ` (${formatCount(reviewCount)})` : ''}
        </Text>
      ) : null}
    </View>
  );
}

/** 1284 -> "1.2k", 24000 -> "24k". Keeps review counts from stretching rows. */
function formatCount(count: number): string {
  if (count < 1000) return String(count);
  if (count < 100000) {
    const thousands = count / 1000;
    return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k`;
  }
  return `${Math.round(count / 1000)}k`;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
});

export { formatCount };
