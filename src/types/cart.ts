/**
 * Cart lines are stored as `{ productId, quantity }` only. Product details are
 * always resolved from the catalogue at render time, so a price change in the
 * data can never leave a stale, wrong total on screen.
 */
export interface CartLine {
  productId: string;
  quantity: number;
}

/** A cart line joined with its product, ready to render. */
export interface CartItem extends CartLine {
  product: import('./product').Product;
  /** `price * quantity` */
  lineTotal: number;
  /** `(mrp - price) * quantity` */
  lineSavings: number;
}

export type CouponKind = 'flat' | 'percentage' | 'free_delivery';

export interface Coupon {
  code: string;
  description: string;
  kind: CouponKind;
  /** Flat amount in rupees, or percentage points. Ignored for free delivery. */
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export interface AppliedCoupon extends Coupon {
  /** Discount this coupon actually contributed, after caps. */
  saved: number;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  /** Sum of `price * quantity` across items. */
  itemTotal: number;
  /** Sum of `(mrp - price) * quantity` — the built-in product discount. */
  productSavings: number;
  deliveryFee: number;
  handlingFee: number;
  taxes: number;
  couponDiscount: number;
  /** `productSavings + couponDiscount` */
  totalSavings: number;
  payable: number;
  appliedCoupon: AppliedCoupon | null;
  /** True when the order clears the free-delivery threshold. */
  freeDeliveryUnlocked: boolean;
  /** Rupees still needed to unlock free delivery; 0 once unlocked. */
  amountToFreeDelivery: number;
}

/** A cart line the shopper parked for later. */
export interface SavedItem {
  productId: string;
  savedAt: number;
}
