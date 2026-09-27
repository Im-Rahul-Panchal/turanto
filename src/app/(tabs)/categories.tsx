import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { BrowseCard } from '@/components/category/browse-card';
import { SearchField } from '@/components/ui/search-field';
import { Text } from '@/components/ui/text';
import { categories, searchCategories, searchProducts } from '@/data';
import { useResponsive } from '@/hooks/use-responsive';
import { getGridColumns, gutter, spacing } from '@/theme';
import type { Category, Product } from '@/types';

/**
 * Browse screen.
 *
 * A searchable list of all 14 categories. The column count is fixed for the
 * lifetime of the screen (derived from the initial width) because `FlatList`
 * cannot change `numColumns` without remounting and losing scroll position.
 */
export default function CategoriesScreen() {
  const { width } = useResponsive();
  const [query, setQuery] = useState('');

  const columns = getGridColumns(width);

  const visible = useMemo(() => {
    const term = query.trim();
    if (!term) return categories;
    const matchedIds = new Set(searchCategories(term, categories.length).map((c) => c.id));
    return categories.filter((category) => matchedIds.has(category.id));
  }, [query]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="h1" lines={1}>
          Browse
        </Text>
        <Text variant="bodySmall" lines={2}>
          Everything in the store, from fresh produce to home essentials.
        </Text>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Filter categories"
          style={styles.search}
        />
      </View>

      <FlatList
        data={visible}
        keyExtractor={keyExtractor}
        numColumns={columns}
        renderItem={renderCategory}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="bodySmall" center>
              No categories match “{query.trim()}”.
            </Text>
          </View>
        }
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}

function renderCategory({ item }: { item: Category }) {
  return (
    <View style={styles.cell}>
      <CategoryRow category={item} />
    </View>
  );
}

function CategoryRow({ category }: { category: Category }) {
  // Thumbnails come from the products actually in this category, so they can
  // never drift out of sync with the catalogue.
  const sample = useMemo(
    () => searchProducts(category.name).slice(0, 3) as Product[],
    [category.name],
  );

  return <BrowseCard category={category} sampleProducts={sample} />;
}

function keyExtractor(category: Category) {
  return category.id;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  search: {
    marginTop: spacing.md,
  },
  list: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  column: {
    gap: spacing.md,
  },
  cell: {
    flex: 1,
    marginBottom: spacing.md,
  },
  empty: {
    paddingVertical: spacing.xxl,
  },
});
