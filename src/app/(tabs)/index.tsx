import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { CategoryCard } from '@/components/category/category-card';
import { FlashDealCard, OfferBanner } from '@/components/offers/offer-banner';
import { ProductRail } from '@/components/product/product-rail';
import { IconButton } from '@/components/ui/icon-button';
import { SearchField } from '@/components/ui/search-field';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import {
  categories,
  getProduct,
  getReorderProductIds,
  heroBanners,
  offers,
  products,
} from '@/data';
import { useUser } from '@/providers/user-provider';
import { colors, gutter, spacing } from '@/theme';
import type { Product } from '@/types';

/**
 * Home screen.
 *
 * A vertical scroll of horizontal rails. Each rail is its own virtualised
 * `FlatList`, which keeps the vertical list shallow and the horizontal content
 * windowed — the right trade-off for a feed this compositionally dense.
 */
export default function HomeScreen() {
  const { user, selectedAddress, labelFor } = useUser();
  const [query, setQuery] = useState('');

  const reorderProducts = useMemo(
    () => getReorderProductIds().map(getProduct).filter((p): p is Product => Boolean(p)),
    [],
  );

  const deals = useMemo(
    () => offers.filter((offer) => offer.kind === 'flash' || offer.kind === 'bogo'),
    [],
  );

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 12),
    [],
  );

  const discounted = useMemo(
    () =>
      [...products]
        .filter((product) => product.discountPercentage >= 20)
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 12),
    [],
  );

  const categoriesForGrid = useMemo(() => categories.slice(0, 8), []);
  const addressLine = selectedAddress
    ? `${labelFor(selectedAddress.label)} · ${selectedAddress.city}`
    : 'Add a delivery address';

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.greeting}>
            <Text variant="caption" lines={1}>
              {`Hi, ${user.name.split(' ')[0]}`}
            </Text>
            <Text variant="h3" lines={2}>
              What are you buying today?
            </Text>
          </View>

          <IconButton
            name="map-pin"
            accessibilityLabel={`Deliver to ${addressLine}`}
            onPress={() => router.push('/addresses')}
          />
        </View>

        <SearchField
          value={query}
          onChangeText={setQuery}
          onSubmit={() => router.push({ pathname: '/search', params: { q: query } })}
          placeholder="Search for atta, milk, chips…"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SectionHeader
            title="Shop by category"
            actionLabel="See all"
            onActionPress={() => router.push('/categories')}
          />
        </View>

        <View style={styles.categoryGrid}>
          {categoriesForGrid.map((category) => (
            <View key={category.id} style={styles.categoryCell}>
              <CategoryCard category={category} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SectionHeader
            title="Deals of the day"
            eyebrow="Limited time"
            actionLabel="See all"
            onActionPress={() => router.push('/offers')}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealRow}>
          {heroBanners.map((banner) => (
            <View key={banner.id} style={styles.dealSpacing}>
              <OfferBanner banner={banner} width={272} height={140} />
            </View>
          ))}
          {deals.map((offer) => (
            <View key={offer.id} style={styles.dealSpacing}>
              <FlashDealCard
                title={offer.title}
                subtitle={offer.subtitle}
                badge={offer.badge}
                imageKey={offer.imageKey}
                endsAt={offer.endsAt}
                onPress={() => router.push('/offers')}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {reorderProducts.length > 0 ? (
        <ProductRail
          title="Buy again"
          eyebrow="From your orders"
          products={reorderProducts}
          actionLabel="Orders"
          onActionPress={() => router.push('/orders')}
        />
      ) : null}

      <ProductRail
        title="Top rated this week"
        subtitle="Picked by shoppers like you"
        products={topRated}
        actionLabel="Browse"
        onActionPress={() => router.push('/categories')}
      />

      <ProductRail
        title="Biggest discounts"
        subtitle="20% off and more"
        products={discounted}
        actionLabel="Offers"
        onActionPress={() => router.push('/offers')}
      />

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  content: {
    paddingTop: spacing.md,
  },
  header: {
    paddingHorizontal: gutter,
    gap: spacing.base,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.base,
  },
  greeting: {
    flex: 1,
    gap: 2,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: gutter,
    marginBottom: spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: gutter,
    gap: spacing.md,
  },
  categoryCell: {
    // Two per row with the shared gap handled by the container.
    width: '47.8%',
  },
  dealRow: {
    paddingHorizontal: gutter,
    paddingBottom: spacing.xs,
  },
  dealSpacing: {
    marginRight: spacing.md,
  },
  footer: {
    height: spacing.xxl,
  },
});
