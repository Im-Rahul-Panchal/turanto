import type { LucideIconName } from '@react-native-vector-icons/lucide';

import type { CategoryTint } from './product';

export type SortKey = 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'discount';

export interface SortOption {
  key: SortKey;
  label: string;
  /** Short label for the compact sort sheet. */
  shortLabel: string;
}

export interface PriceFilter {
  /** Inclusive upper bound in rupees; null means "no limit". */
  maxPrice: number | null;
}

export interface ProductFilters {
  sort: SortKey;
  categoryIds: string[];
  subcategoryIds: string[];
  maxPrice: number | null;
  minRating: number;
  inStockOnly: boolean;
}

/**
 * Toast tones. `cart` and `favorite` exist so the cart and favourites flows can
 * use the same toast surface as the rest of the app instead of bespoke banners.
 */
export type ToastVariant = 'success' | 'info' | 'error' | 'offer' | 'cart' | 'favorite';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastPayload {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Optional Lucide glyph name rendered before the message. */
  icon?: LucideIconName;
  /** Optional inline action, e.g. "Undo" on a removal. */
  action?: ToastAction;
}

export type Tint = CategoryTint;
