import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Countdown } from './countdown';
import { Badge } from '@/components/ui/badge';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { getImage, type ImageKey } from '@/lib/images';
import { colors, radius, spacing } from '@/theme';
import type { HeroBanner } from '@/types';

type OfferBannerProps = {
  banner: HeroBanner;
  width?: number;
  height?: number;
};

/**
 * Full-width promotional banner for the top of Home.
 *
 * `expo-image` is used rather than `Image` because it decodes off the JS thread
 * and caches by URL, which keeps a carousel of large banners from dropping
 * frames while scrolling.
 */
export function OfferBanner({ banner, width, height = 148 }: OfferBannerProps) {
  return (
    <PressScale
      onPress={() => router.push('/offers')}
      haptic="light"
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
      style={[styles.base, { height }]}>
      <Image
        source={getImage(banner.imageKey)}
        style={styles.image}
        contentFit="cover"
        transition={220}
        accessible
        accessibilityLabel=""
        accessibilityElementsHidden
      />

      <View style={styles.overlay}>
        <Badge label={banner.badge} variant="solid" />
        <View style={styles.copy}>
          <Text variant="h3" color={colors.textOnPrimary} lines={2}>
            {banner.title}
          </Text>
          <Text variant="caption" color={colors.textOnPrimary} lines={2}>
            {banner.subtitle}
          </Text>
        </View>
      </View>
    </PressScale>
  );
}

type FlashDealCardProps = {
  title: string;
  subtitle: string;
  badge: string;
  imageKey: ImageKey;
  endsAt?: string;
  width?: number;
  onPress?: () => void;
};

/** Compact deal tile with a live countdown, used in the deals rail. */
export function FlashDealCard({
  title,
  subtitle,
  badge,
  imageKey,
  endsAt,
  width = 168,
  onPress,
}: FlashDealCardProps) {
  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={[styles.flash, { width }]}>
      <View style={styles.flashMedia}>
        <Image
          source={getImage(imageKey)}
          style={styles.flashImage}
          contentFit="cover"
          transition={200}
          accessibilityElementsHidden
        />
        <Badge label={badge} tone="accent" style={styles.flashBadge} />
      </View>

      <View style={styles.flashBody}>
        <Text variant="bodySmall" lines={1}>
          {title}
        </Text>
        <Text variant="caption" lines={1}>
          {subtitle}
        </Text>
        {endsAt ? <Countdown targetIso={endsAt} /> : null}
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'space-between',
    // Scrim keeps white text legible over arbitrary photography.
    backgroundColor: 'rgba(6, 58, 35, 0.34)',
  },
  copy: {
    gap: spacing.xxs,
  },
  flash: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  flashMedia: {
    position: 'relative',
  },
  flashImage: {
    width: '100%',
    aspectRatio: 1.4,
  },
  flashBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  flashBody: {
    padding: spacing.md,
    gap: 2,
  },
});
