/**
 * Single entry point for the mock backend.
 *
 * Screens and providers import from `@/data` only, so swapping these fixtures
 * for real API calls later means changing this folder and nothing else.
 */
export * from './categories';
export * from './products';
export * from './offers';
export * from './orders';
export * from './user';
export * from './coupons';
export { searchProducts, searchCategories, closestMatch } from '@/utils/search';
