import type { ImageKey } from '@/lib/images';

/** Shapes of promotion the offers screen knows how to render. */
export type OfferKind = 'banner' | 'flash' | 'under_price' | 'bogo' | 'discount';
/** Named accent pairs so every deal card shares one visual language. */
export type OfferTint = 'green' | 'coral' | 'violet' | 'amber' | 'blue' | 'teal';

export interface Offer {
  id: string;
  kind: OfferKind;
  title: string;
  subtitle: string;
  /** Short pill shown top-left, e.g. "50% OFF". */
  badge: string;
  tint: OfferTint;
  /** Key into the central asset map for the banner artwork. */
  imageKey: ImageKey;
  /** Product ids this deal points at. */
  productIds: string[];
  /** ISO timestamp; only flash deals render a countdown. */
  endsAt?: string;
  /** Free-form grouping label, e.g. "Under ₹99". */
  collection?: string;
}

/** Full-width promotional banner in the home carousel. */
export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  /** Short pill rendered top-left, e.g. "Up to 50% off". */
  badge: string;
  imageKey: ImageKey;
  /** Tints the badge and accents so the card matches its artwork. */
  tint: OfferTint;
  /** Category this banner deep-links into. */
  targetCategoryId?: string;
  targetProductId?: string;
}
