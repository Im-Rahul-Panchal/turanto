import type { ImageKey } from '@/lib/images';

/** A merchandising label used for badges such as "Bestseller" or "New". */
export type ProductBadge = 'bestseller' | 'popular' | 'new' | 'organic' | 'vegan' | 'deal';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

/** Nutrient row shown on the product details screen. */
export interface NutritionInfo {
  label: string;
  /** Per 100 g / 100 ml unless the product states otherwise. */
  per100: string;
  dailyValue?: string;
}

export interface Product {
  id: string;
  name: string;
  /** Lowercase search terms; kept denormalised so search stays synchronous. */
  searchTerms: string[];
  categoryId: string;
  subcategoryId?: string;
  /** Key into the central asset map — never a raw require() at the call site. */
  imageKey: ImageKey;
  price: number;
  mrp: number;
  /** Derived from `price`/`mrp` at construction time so it can never drift. */
  discountPercentage: number;
  unit: string;
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  description: string;
  highlights: string[];
  /** Present for food and personal-care items. */
  ingredients?: string;
  nutrition?: NutritionInfo[];
  stockStatus: StockStatus;
  /** Number of units left when `stockStatus` is `low_stock`. */
  unitsLeft?: number;
  /** Units typically bought together — powers "Frequently bought together". */
  frequentlyBoughtWith?: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  /** Emoji used as a lightweight, friendly category glyph. */
  glyph: string;
}

export interface Category {
  id: string;
  name: string;
  /** Short line shown under the name on the categories screen. */
  tagline: string;
  glyph: string;
  /** Key into the central asset map for the category artwork. */
  imageKey: ImageKey;
  /** Ties the category to a colour so cards feel varied but on-brand. */
  tint: CategoryTint;
  subcategories: Subcategory[];
  /** Sort weight for the categories screen. */
  order: number;
}

/** Named tints keep category colouring declarative and consistent. */
export type CategoryTint = 'green' | 'amber' | 'coral' | 'violet' | 'blue' | 'teal';
