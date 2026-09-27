import { getProduct } from './products';
import { hoursFromNow } from './orders';
import type { HeroBanner, Offer, Product } from '@/types';

/** Horizontal carousel on the home screen. */
export const heroBanners: HeroBanner[] = [
  {
    id: 'weekend-sale',
    title: 'Weekend Sale',
    subtitle: 'Up to 50% off across the store',
    badge: 'Limited time',
    imageKey: 'banner-weekend-sale',
    tint: 'coral',
    targetCategoryId: 'snacks',
  },
  {
    id: 'fresh-fruits',
    title: 'Fresh Fruits Drop',
    subtitle: 'Picked this morning, at your door by 9',
    badge: 'Farm fresh',
    imageKey: 'banner-fresh-fruits',
    tint: 'green',
    targetCategoryId: 'fruits-veg',
  },
  {
    id: 'breakfast-essentials',
    title: 'Breakfast in 10 min',
    subtitle: 'Milk, bread and butter on one basket',
    badge: 'Morning deal',
    imageKey: 'banner-breakfast-essentials',
    tint: 'amber',
    targetCategoryId: 'bakery',
  },
  {
    id: 'household-deals',
    title: 'Home Essentials',
    subtitle: 'Detergents and cleaners, priced lower',
    badge: 'Big savings',
    imageKey: 'banner-household-deals',
    tint: 'blue',
    targetCategoryId: 'household',
  },
  {
    id: 'instant-meals',
    title: '10-Minute Meals',
    subtitle: 'Noodles, pasta and sauces in stock',
    badge: 'Quick pick',
    imageKey: 'banner-instant-meals',
    tint: 'violet',
    targetCategoryId: 'instant-food',
  },
];

/** Deals are grouped by `collection`; the offers screen renders one shelf per group. */
export const offers: Offer[] = [
  {
    id: 'todays-deals',
    kind: 'discount',
    title: "Today's Deals",
    subtitle: 'Hand-picked price drops, refreshed every morning',
    badge: 'Fresh picks',
    tint: 'green',
    imageKey: 'offer-todays-deals',
    collection: 'todays-deals',
    productIds: ['milk', 'bread', 'detergent', 'shampoo', 'atta'],
  },
  {
    id: 'flash-deals',
    kind: 'flash',
    title: 'Flash Deals',
    subtitle: 'Very limited quantities while stock lasts',
    badge: 'Ends soon',
    tint: 'coral',
    imageKey: 'offer-flash-deals',
    collection: 'flash-deals',
    // Resolved relative to launch so the countdown is always live in a demo build.
    endsAt: hoursFromNow(3.5),
    productIds: ['chocolate', 'cola', 'chips', 'almonds'],
  },
  {
    id: 'under-99',
    kind: 'under_price',
    title: 'Under ₹99',
    subtitle: 'Everyday staples that never cost more',
    badge: 'Budget friendly',
    tint: 'teal',
    imageKey: 'offer-under-99',
    collection: 'under-99',
    productIds: ['water', 'salt', 'toothpaste', 'noodles'],
  },
  {
    id: 'bogo',
    kind: 'bogo',
    title: 'Buy 1 Get 1',
    subtitle: 'Snacks and drinks, two for the price of one',
    badge: 'Double up',
    tint: 'violet',
    imageKey: 'offer-bogo',
    collection: 'bogo',
    productIds: ['biscuits', 'namkeen', 'juice', 'rusk'],
  },
  {
    id: 'best-discounts',
    kind: 'discount',
    title: 'Best Discounts',
    subtitle: 'The steepest markdowns in the store right now',
    badge: 'Up to 40% off',
    tint: 'coral',
    imageKey: 'offer-best-discounts',
    collection: 'best-discounts',
    productIds: ['mango', 'paneer', 'battery', 'pet-food'],
  },
  {
    id: 'weekend-specials',
    kind: 'banner',
    title: 'Weekend Specials',
    subtitle: 'Family favourites, at a weekend price',
    badge: 'Family favourite',
    tint: 'amber',
    imageKey: 'offer-weekend-specials',
    collection: 'weekend-specials',
    productIds: ['noodles', 'cheese', 'paneer', 'tea'],
  },
];

/** Offer groups in the order the offers screen should present them. */
export const offerCollections: { key: string; title: string; blurb: string }[] = [
  { key: 'todays-deals', title: "Today's Deals", blurb: 'Refreshed every morning' },
  { key: 'flash-deals', title: 'Flash Deals', blurb: 'Limited stock' },
  { key: 'under-99', title: 'Under ₹99', blurb: 'Budget picks' },
  { key: 'bogo', title: 'Buy 1 Get 1', blurb: 'Two for one' },
  { key: 'best-discounts', title: 'Best Discounts', blurb: 'Steepest markdowns' },
  { key: 'weekend-specials', title: 'Weekend Specials', blurb: 'For the family' },
];

export function getOffer(id: string): Offer | undefined {
  return offers.find((o) => o.id === id);
}

/**
 * Resolves an offer's product ids to live products, dropping any id that is no
 * longer in the catalogue. Callers can therefore assume a non-empty deal has at
 * least one tappable item.
 */
export function resolveOfferProducts(offer: Offer, limit?: number): Product[] {
  const resolved = offer.productIds
    .map((id) => getProduct(id))
    .filter((product): product is Product => Boolean(product));

  return typeof limit === 'number' ? resolved.slice(0, limit) : resolved;
}

/** Best absolute saving available in a deal, used for the "up to ₹X off" line. */
export function getOfferMaxSaving(offer: Offer): number {
  return resolveOfferProducts(offer).reduce(
    (max, product) => Math.max(max, product.mrp - product.price),
    0,
  );
}
