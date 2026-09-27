import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferBanner } from '@/components/offers/offer-banner';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { heroBanners, offers, resolveOfferProducts } from '@/data';
import { getImage } from '@/lib/images';
import { formatPrice } from '@/utils/pricing';
import { colors, gutter, radius, spacing, tints } from '@/theme';
import type { Offer } from '@/types';

const TABS = ['All', 'Grocery', 'Food', 'Beauty', 'Home'] as const;

/**
 * Offers hub.
 *
 * A flat list of promo cards rather than a carousel: offers are the one place
 * where vertical scanning beats swiping, because the shopper is comparing value
 * and discounts rather than browsing.
 */
export default function OffersScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');

  const visible = useMemo(() => {
    if (tab === 'All') return offers;

    // Collections are the authored grouping; the tab maps onto it so the copy
    // shown in the chip always matches the deals underneath it.
    return offers.filter((offer) => offer.collection?.includes(tab.toLowerCase()));
  }, [tab]);

  return (
    <View style={styles.root}>
      <FlatList
        data={visible}
        keyExtractor={(offer) => offer.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.huge }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.navRow}>
              <IconButton
                name="arrow-left"
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                backgroundColor={colors.surface}
              />
              <View style={styles.grow} />
              <Text variant="h2" lines={1} style={styles.title}>
                Offers
              </Text>
              <View style={styles.grow} />
              <View style={styles.spacer} />
            </View>

            <OfferBanner banner={heroBanners[0]} />

            <FlatList
              data={TABS}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabs}
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={tab === item}
                  onPress={() => setTab(item)}
                />
              )}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 40).duration(260)}>
            <OfferCard offer={item} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              imageKey="empty-search"
              title="No offers here right now"
              description="New deals are added every week. Have a look at the other categories."
              actionLabel="Show all offers"
              onActionPress={() => setTab('All')}
            />
          </View>
        }
      />
    </View>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const tint = tints[offer.tint];
  const products = useMemo(() => resolveOfferProducts(offer), [offer]);
  const first = products[0];

  function open() {
    if (first) {
      router.push({ pathname: '/product/[id]', params: { id: first.id } });
      return;
    }
    // A deal with no resolvable product still needs somewhere sensible to go.
    router.push('/categories');
  }

  const bestSaving = first ? Math.max(0, first.mrp - first.price) : 0;

  return (
    <PressScale
      onPress={open}
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${offer.badge}. ${offer.subtitle}`}
      style={styles.card}>
      <Image
        source={getImage(offer.imageKey)}
        style={[styles.art, { backgroundColor: tint.soft }]}
        contentFit="cover"
        transition={180}
        accessibilityElementsHidden
      />

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={[styles.badge, { backgroundColor: tint.soft }]}>
            <Text variant="overline" color={tint.strong} lines={1}>
              {offer.badge}
            </Text>
          </View>
          <Text variant="caption" color={colors.textSubtle} lines={1}>
            {`${products.length} ${products.length === 1 ? 'item' : 'items'}`}
          </Text>
        </View>

        <Text variant="bodyMedium" lines={1}>
          {offer.title}
        </Text>
        <Text variant="caption" color={colors.textSecondary} lines={2}>
          {offer.subtitle}
        </Text>

        {bestSaving > 0 ? (
          <Text variant="caption" color={colors.success} lines={1} style={styles.saving}>
            {`up to ${formatPrice(bestSaving)} off`}
          </Text>
        ) : null}
      </View>
    </PressScale>
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
  list: {
    paddingHorizontal: gutter,
  },
  header: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  tabs: {
    gap: spacing.sm,
    paddingRight: gutter,
  },
  separator: {
    height: spacing.md,
  },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  art: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  saving: {
    marginTop: spacing.xxs,
  },
  empty: {
    paddingVertical: spacing.xxl,
  },
});
