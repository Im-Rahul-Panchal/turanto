import { StyleSheet, View } from 'react-native';

import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { radius, spacing } from '@/theme';

type ProductCardSkeletonProps = {
  layout?: 'grid' | 'rail';
  /** Side length of the image tile. Grids compute this from the column width. */
  imageSize: number;
};

/**
 * Placeholder matching `ProductCard`'s geometry.
 *
 * Because the real card's shape is mirrored, the grid does not visibly reflow
 * when products arrive — the single most jarring loading artefact in a
 * product feed.
 */
export function ProductCardSkeleton({ layout = 'grid', imageSize }: ProductCardSkeletonProps) {
  return (
    <View style={[styles.base, layout === 'rail' && styles.rail]}>
      <Skeleton
        width={imageSize}
        height={imageSize}
        borderRadius={radius.md}
        animate={false}
      />

      <View style={styles.body}>
        <SkeletonText lines={2} />
        <Skeleton width={56} height={11} borderRadius={radius.xs} />
        <View style={styles.priceRow}>
          <Skeleton width={64} height={15} borderRadius={radius.xs} />
          <Skeleton width={40} height={11} borderRadius={radius.xs} />
        </View>
        <Skeleton width={80} height={11} borderRadius={radius.xs} />
      </View>

      <Skeleton height={32} borderRadius={radius.pill} style={styles.action} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  rail: {
    flex: 0,
    width: 156,
    marginRight: spacing.md,
  },
  body: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  action: {
    marginTop: spacing.sm,
  },
});
