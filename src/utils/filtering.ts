import { FEES } from './pricing';
import type { Product, ProductFilters, SortKey, SortOption } from '@/types';

export const sortOptions: SortOption[] = [
  { key: 'popularity', label: 'Most popular first', shortLabel: 'Popular' },
  { key: 'price_asc', label: 'Price: low to high', shortLabel: 'Price ↑' },
  { key: 'price_desc', label: 'Price: high to low', shortLabel: 'Price ↓' },
  { key: 'rating', label: 'Customer rating', shortLabel: 'Rating' },
  { key: 'discount', label: 'Biggest discount', shortLabel: 'Discount' },
];

export const defaultFilters: ProductFilters = {
  sort: 'popularity',
  categoryIds: [],
  subcategoryIds: [],
  maxPrice: null,
  minRating: 0,
  inStockOnly: false,
};

/** Slider steps for the price filter, derived from the catalogue price range. */
export const priceBounds = {
  min: 0,
  max: 1500,
  step: 50,
} as const;

export const ratingOptions = [4.5, 4, 3.5, 0] as const;

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  popularity: (a, b) =>
    b.reviewCount * b.rating - a.reviewCount * a.rating || b.rating - a.rating,
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  discount: (a, b) => b.discountPercentage - a.discountPercentage,
};

/** Filters then sorts. Returns the input array untouched when nothing applies. */
export function applyProductFilters(
  list: Product[],
  filters: ProductFilters,
): Product[] {
  let result = list;

  if (filters.categoryIds.length > 0) {
    result = result.filter((p) => filters.categoryIds.includes(p.categoryId));
  }
  if (filters.subcategoryIds.length > 0) {
    const subcategoryIds = filters.subcategoryIds;
    result = result.filter((p) => p.subcategoryId && subcategoryIds.includes(p.subcategoryId));
  }
  if (filters.maxPrice !== null) {
    // Captured in a local so TypeScript keeps the null narrowing inside the closure.
    const maxPrice = filters.maxPrice;
    result = result.filter((p) => p.price <= maxPrice);
  }
  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stockStatus !== 'out_of_stock');
  }

  return result;
}

/** Sorts a list by the active key without re-filtering it. */
export function sortProducts(list: Product[], sort: SortKey): Product[] {
  return [...list].sort(comparators[sort]);
}

/** Counts how many filters are narrowing the list, for the filter button badge. */
export function countActiveFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.categoryIds.length > 0) count += 1;
  if (filters.subcategoryIds.length > 0) count += 1;
  if (filters.maxPrice !== null) count += 1;
  if (filters.minRating > 0) count += 1;
  if (filters.inStockOnly) count += 1;
  return count;
}

export function hasActiveFilters(filters: ProductFilters): boolean {
  return countActiveFilters(filters) > 0;
}

/** Label shown on the sort/filter trigger, e.g. "Popular". */
export function activeSortLabel(sort: SortKey): string {
  return sortOptions.find((o) => o.key === sort)?.shortLabel ?? 'Sort';
}

export { FEES };
