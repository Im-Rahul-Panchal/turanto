/**
 * Central asset registry.
 *
 * Every image in Turanto is referenced through this map, keyed by a stable,
 * descriptive slug. Components import `ImageKey` and never call `require()`
 * themselves, so swapping placeholder artwork for final assets is a change to
 * this file alone.
 *
 * Generated alongside the placeholders in `scripts/placeholders.manifest.json`.
 *
 * Note: this module lives in `src/lib` rather than `src/assets`, because the
 * `@/assets/*` alias is reserved for the root `assets/` folder where Expo
 * expects binary assets. A file under `src/assets` would be shadowed by that
 * alias and unresolvable.
 */

import type { ImageSourcePropType } from 'react-native';

export const imageRegistry = {
  // products
  'product-tomato': require('@/assets/images/products/product-tomato.png'),
  'product-onion': require('@/assets/images/products/product-onion.png'),
  'product-potato': require('@/assets/images/products/product-potato.png'),
  'product-carrot': require('@/assets/images/products/product-carrot.png'),
  'product-capsicum': require('@/assets/images/products/product-capsicum.png'),
  'product-spinach': require('@/assets/images/products/product-spinach.png'),
  'product-apple': require('@/assets/images/products/product-apple.png'),
  'product-banana': require('@/assets/images/products/product-banana.png'),
  'product-mango': require('@/assets/images/products/product-mango.png'),
  'product-orange': require('@/assets/images/products/product-orange.png'),
  'product-grapes': require('@/assets/images/products/product-grapes.png'),
  'product-pomegranate': require('@/assets/images/products/product-pomegranate.png'),
  'product-milk': require('@/assets/images/products/product-milk.png'),
  'product-curd': require('@/assets/images/products/product-curd.png'),
  'product-paneer': require('@/assets/images/products/product-paneer.png'),
  'product-butter': require('@/assets/images/products/product-butter.png'),
  'product-cheese': require('@/assets/images/products/product-cheese.png'),
  'product-bread': require('@/assets/images/products/product-bread.png'),
  'product-bun': require('@/assets/images/products/product-bun.png'),
  'product-rusk': require('@/assets/images/products/product-rusk.png'),
  'product-cake': require('@/assets/images/products/product-cake.png'),
  'product-chips': require('@/assets/images/products/product-chips.png'),
  'product-namkeen': require('@/assets/images/products/product-namkeen.png'),
  'product-biscuits': require('@/assets/images/products/product-biscuits.png'),
  'product-chocolate': require('@/assets/images/products/product-chocolate.png'),
  'product-almonds': require('@/assets/images/products/product-almonds.png'),
  'product-tea': require('@/assets/images/products/product-tea.png'),
  'product-coffee': require('@/assets/images/products/product-coffee.png'),
  'product-juice': require('@/assets/images/products/product-juice.png'),
  'product-cola': require('@/assets/images/products/product-cola.png'),
  'product-water': require('@/assets/images/products/product-water.png'),
  'product-energy-drink': require('@/assets/images/products/product-energy-drink.png'),
  'product-noodles': require('@/assets/images/products/product-noodles.png'),
  'product-pasta': require('@/assets/images/products/product-pasta.png'),
  'product-sauce': require('@/assets/images/products/product-sauce.png'),
  'product-oil': require('@/assets/images/products/product-oil.png'),
  'product-rice': require('@/assets/images/products/product-rice.png'),
  'product-atta': require('@/assets/images/products/product-atta.png'),
  'product-sugar': require('@/assets/images/products/product-sugar.png'),
  'product-salt': require('@/assets/images/products/product-salt.png'),
  'product-dal': require('@/assets/images/products/product-dal.png'),
  'product-detergent': require('@/assets/images/products/product-detergent.png'),
  'product-dishwash': require('@/assets/images/products/product-dishwash.png'),
  'product-floor-cleaner': require('@/assets/images/products/product-floor-cleaner.png'),
  'product-toilet-cleaner': require('@/assets/images/products/product-toilet-cleaner.png'),
  'product-mosquito-repellent': require('@/assets/images/products/product-mosquito-repellent.png'),
  'product-soap': require('@/assets/images/products/product-soap.png'),
  'product-shampoo': require('@/assets/images/products/product-shampoo.png'),
  'product-toothpaste': require('@/assets/images/products/product-toothpaste.png'),
  'product-deodorant': require('@/assets/images/products/product-deodorant.png'),
  'product-lotion': require('@/assets/images/products/product-lotion.png'),
  'product-baby-milk': require('@/assets/images/products/product-baby-milk.png'),
  'product-diapers': require('@/assets/images/products/product-diapers.png'),
  'product-baby-soap': require('@/assets/images/products/product-baby-soap.png'),
  'product-baby-food': require('@/assets/images/products/product-baby-food.png'),
  'product-pet-food': require('@/assets/images/products/product-pet-food.png'),
  'product-pet-shampoo': require('@/assets/images/products/product-pet-shampoo.png'),
  'product-notebook': require('@/assets/images/products/product-notebook.png'),
  'product-pen': require('@/assets/images/products/product-pen.png'),
  'product-pencil-box': require('@/assets/images/products/product-pencil-box.png'),
  'product-bandage': require('@/assets/images/products/product-bandage.png'),
  'product-sanitizer': require('@/assets/images/products/product-sanitizer.png'),
  'product-vitamins': require('@/assets/images/products/product-vitamins.png'),
  'product-first-aid': require('@/assets/images/products/product-first-aid.png'),
  'product-air-freshener': require('@/assets/images/products/product-air-freshener.png'),
  'product-battery': require('@/assets/images/products/product-battery.png'),
  // categories
  'category-fruits-veg': require('@/assets/images/categories/category-fruits-veg.png'),
  'category-dairy-breakfast': require('@/assets/images/categories/category-dairy-breakfast.png'),
  'category-bakery': require('@/assets/images/categories/category-bakery.png'),
  'category-snacks': require('@/assets/images/categories/category-snacks.png'),
  'category-beverages': require('@/assets/images/categories/category-beverages.png'),
  'category-instant-food': require('@/assets/images/categories/category-instant-food.png'),
  'category-staples': require('@/assets/images/categories/category-staples.png'),
  'category-household': require('@/assets/images/categories/category-household.png'),
  'category-personal-care': require('@/assets/images/categories/category-personal-care.png'),
  'category-baby-care': require('@/assets/images/categories/category-baby-care.png'),
  'category-pet-care': require('@/assets/images/categories/category-pet-care.png'),
  'category-stationery': require('@/assets/images/categories/category-stationery.png'),
  'category-wellness': require('@/assets/images/categories/category-wellness.png'),
  'category-home-care': require('@/assets/images/categories/category-home-care.png'),
  // banners
  'banner-weekend-sale': require('@/assets/images/banners/banner-weekend-sale.png'),
  'banner-fresh-fruits': require('@/assets/images/banners/banner-fresh-fruits.png'),
  'banner-breakfast-essentials': require('@/assets/images/banners/banner-breakfast-essentials.png'),
  'banner-household-deals': require('@/assets/images/banners/banner-household-deals.png'),
  'banner-instant-meals': require('@/assets/images/banners/banner-instant-meals.png'),
  // offers
  'offer-todays-deals': require('@/assets/images/offers/offer-todays-deals.png'),
  'offer-flash-deals': require('@/assets/images/offers/offer-flash-deals.png'),
  'offer-under-99': require('@/assets/images/offers/offer-under-99.png'),
  'offer-bogo': require('@/assets/images/offers/offer-bogo.png'),
  'offer-best-discounts': require('@/assets/images/offers/offer-best-discounts.png'),
  'offer-weekend-specials': require('@/assets/images/offers/offer-weekend-specials.png'),
  // illustrations
  'empty-cart': require('@/assets/images/illustrations/empty-cart.png'),
  'empty-orders': require('@/assets/images/illustrations/empty-orders.png'),
  'empty-favorites': require('@/assets/images/illustrations/empty-favorites.png'),
  'empty-search': require('@/assets/images/illustrations/empty-search.png'),
  'empty-addresses': require('@/assets/images/illustrations/empty-addresses.png'),
  'order-success': require('@/assets/images/illustrations/order-success.png'),
  'error-state': require('@/assets/images/illustrations/error-state.png'),
  // avatars
  'avatar-user': require('@/assets/images/avatars/avatar-user.png'),
  // placeholders
  'placeholder-product': require('@/assets/images/placeholders/placeholder-product.png'),
  'placeholder-generic': require('@/assets/images/placeholders/placeholder-generic.png'),
} as const;

/** Union of every valid asset slug, e.g. `product-milk`. */
export type ImageKey = keyof typeof imageRegistry;

export function getImage(key: ImageKey): ImageSourcePropType {
  return imageRegistry[key];
}

