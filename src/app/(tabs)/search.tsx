import { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/product/product-card-skeleton';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchField } from '@/components/ui/search-field';
import { Text } from '@/components/ui/text';
import {
  categories,
  closestMatch,
  popularSearches,
  searchCategories,
  searchProducts,
  seedRecentSearches,
} from '@/data';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { getGridItemWidth, gutter, spacing } from '@/theme';
import type { Product } from '@/types';

/** Simulated latency so the skeletons are a real loading state, not decoration. */
const SEARCH_DELAY_MS = 280;

/**
 * Search screen.
 *
 * Three states in one screen: the idle landing (recent + popular + categories),
 * results, and "no matches". Debouncing keeps typing responsive on a 66-item
 * catalogue without needing a worker.
 */
export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();

  // Read the deep link once, when the screen mounts. Home pushes `/search?q=…`,
  // which creates a fresh screen, so no effect is needed to re-sync later.
  const initialTerm = typeof params.q === 'string' ? params.q.trim() : '';
  const [query, setQuery] = useState(initialTerm);
  const [committed, setCommitted] = useState(initialTerm);
  const [recent, setRecent] = useState<string[]>(seedRecentSearches);

  const debounced = useDebouncedValue(query, SEARCH_DELAY_MS);
  const pending = debounced.trim();

  // Loading is *derived* from the gap between the debounced input and the
  // committed term, so there is no second state to keep in sync.
  const loading = pending !== committed;

  useEffect(() => {
    // A short beat keeps the skeletons visible long enough to read, so
    // transitioning from results is not a single-frame flicker.
    const timer = setTimeout(() => setCommitted(pending), SEARCH_DELAY_MS / 2);
    return () => clearTimeout(timer);
  }, [pending]);

  const results = useMemo(
    () => (committed ? searchProducts(committed) : []),
    [committed],
  );

  const matchedCategories = useMemo(
    () => (committed ? searchCategories(committed) : []),
    [committed],
  );

  const suggestion = useMemo(() => {
    if (results.length > 0 || !committed) return undefined;
    return closestMatch(committed, popularSearches);
  }, [committed, results.length]);

  const commit = (term: string) => {
    const next = term.trim();
    setCommitted(next);
    if (next) {
      setRecent((current) => [next, ...current.filter((t) => t !== next)].slice(0, 6));
    }
  };

  const isIdle = committed.length === 0;

  return (
    <View style={styles.root}>
      <View style={styles.searchBar}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          onSubmit={() => commit(query)}
          onClear={() => {
            setQuery('');
            commit('');
          }}
          leadingIcon="arrow-left"
          onLeadingPress={() => router.back()}
          placeholder="Search products and categories"
          emphasis
        />
      </View>

      {isIdle ? (
        <ScrollView
          contentContainerStyle={styles.idle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {recent.length > 0 ? (
            <View style={styles.block}>
              <Text variant="h4">Recent searches</Text>
              <View style={styles.chips}>
                {recent.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    icon="history"
                    onPress={() => {
                      setQuery(term);
                      commit(term);
                    }}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.block}>
            <Text variant="h4">Popular right now</Text>
            <View style={styles.chips}>
              {popularSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onPress={() => {
                    setQuery(term);
                    commit(term);
                  }}
                />
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <Text variant="h4">Browse categories</Text>
            <View style={styles.chips}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  tint={category.tint}
                  onPress={() => router.push(`/category/${category.id}`)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          key="grid"
          data={results}
          keyExtractor={keyExtractor}
          numColumns={2}
          renderItem={renderProduct}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.results}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <SearchHeader
              loading={loading}
              count={results.length}
              term={committed}
              categories={matchedCategories}
              suggestion={suggestion}
              onCategoryPress={(id) => router.push(`/category/${id}`)}
            />
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.skeletons}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <View key={index} style={styles.skeletonCell}>
                    <ProductCardSkeleton imageSize={getGridItemWidth()} />
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState
                imageKey="empty-search"
                title={`No results for “${committed}”`}
                description={
                  suggestion
                    ? `Did you mean “${suggestion}”?`
                    : 'Try a shorter word, or browse a category instead.'
                }
                actionLabel="Browse categories"
                onActionPress={() => router.push('/categories')}
              />
            )
          }
          initialNumToRender={6}
          windowSize={7}
          removeClippedSubviews
        />
      )}
    </View>
  );
}

function SearchHeader({
  loading,
  count,
  term,
  categories: matchedCategories,
  suggestion,
  onCategoryPress,
}: {
  loading: boolean;
  count: number;
  term: string;
  categories: ReturnType<typeof searchCategories>;
  suggestion: string | undefined;
  onCategoryPress: (id: string) => void;
}) {
  return (
    <View style={styles.header}>
      <Text variant="caption">
        {loading ? 'Searching…' : `${count} ${count === 1 ? 'result' : 'results'} for “${term}”`}
      </Text>

      {matchedCategories.length > 0 ? (
        <View style={styles.chips}>
          {matchedCategories.map((category) => (
            <Chip
              key={category.id}
              label={`in ${category.name}`}
              tint={category.tint}
              onPress={() => onCategoryPress(category.id)}
            />
          ))}
        </View>
      ) : null}

      {suggestion && !loading ? (
        <View style={styles.suggestion}>
          <Text variant="caption">Did you mean “{suggestion}”?</Text>
        </View>
      ) : null}
    </View>
  );
}

function renderProduct({ item }: { item: Product }) {
  return (
    <View style={styles.cell}>
      <ProductCard product={item} />
    </View>
  );
}

function keyExtractor(product: Product) {
  return product.id;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchBar: {
    paddingHorizontal: gutter,
    paddingTop: spacing.xs,
  },
  idle: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  block: {
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  results: {
    paddingHorizontal: gutter,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  suggestion: {
    flexDirection: 'row',
  },
  column: {
    gap: spacing.md,
  },
  cell: {
    flex: 1,
  },
  skeletons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  skeletonCell: {
    width: '47.8%',
  },
});
