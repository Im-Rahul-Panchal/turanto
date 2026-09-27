/**
 * AsyncStorage keys. Namespaced so the app can be reset selectively during
 * development, and versioned so a schema change can migrate rather than crash.
 */
const PREFIX = 'turanto.v1';

export const storageKeys = {
  cartLines: `${PREFIX}.cart.lines`,
  cartSaved: `${PREFIX}.cart.saved`,
  cartCoupon: `${PREFIX}.cart.coupon`,
  favorites: `${PREFIX}.favorites`,
  addresses: `${PREFIX}.addresses`,
  selectedAddressId: `${PREFIX}.address.selected`,
  orders: `${PREFIX}.orders`,
  recentSearches: `${PREFIX}.search.recent`,
} as const;
