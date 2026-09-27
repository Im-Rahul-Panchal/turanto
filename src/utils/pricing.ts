import type { AppliedCoupon, Coupon } from '@/types';

/** Fees and thresholds. All money in Turanto is stored in whole rupees. */
export const FEES = {
  delivery: 25,
  /** Orders at or above this amount ship free. */
  freeDeliveryThreshold: 499,
  handling: 7,
} as const;

export interface PricedLine {
  productId: string;
  quantity: number;
  price: number;
  mrp: number;
}

export interface Totals {
  itemCount: number;
  itemTotal: number;
  productSavings: number;
  deliveryFee: number;
  handlingFee: number;
  couponDiscount: number;
  totalSavings: number;
  payable: number;
  freeDeliveryUnlocked: boolean;
  amountToFreeDelivery: number;
  appliedCoupon: AppliedCoupon | null;
}

/**
 * Works out what a coupon is actually worth against the current basket.
 * Returns `null` when the basket does not meet the minimum, so callers can
 * explain *why* a coupon was rejected instead of silently ignoring it.
 */
export function evaluateCoupon(coupon: Coupon, itemTotal: number): AppliedCoupon | null {
  if (itemTotal < coupon.minOrderValue) {
    return null;
  }

  if (coupon.kind === 'free_delivery') {
    const saved = itemTotal >= FEES.freeDeliveryThreshold ? 0 : FEES.delivery;
    return { ...coupon, saved };
  }

  const raw = coupon.kind === 'flat' ? coupon.value : (itemTotal * coupon.value) / 100;
  const saved = Math.min(Math.round(raw), coupon.maxDiscount ?? Infinity, itemTotal);
  return { ...coupon, saved };
}

export function computeTotals(
  lines: PricedLine[],
  options: { deliveryFee?: number; coupon?: Coupon | null } = {},
): Totals {
  let itemCount = 0;
  let itemTotal = 0;
  let productSavings = 0;

  for (const line of lines) {
    itemCount += line.quantity;
    itemTotal += line.price * line.quantity;
    productSavings += Math.max(0, line.mrp - line.price) * line.quantity;
  }

  const baseDeliveryFee = options.deliveryFee ?? FEES.delivery;
  const freeDeliveryUnlocked = itemTotal === 0 || itemTotal >= FEES.freeDeliveryThreshold;
  const deliveryFee = freeDeliveryUnlocked ? 0 : baseDeliveryFee;

  const applied = options.coupon ? evaluateCoupon(options.coupon, itemTotal) : null;

  // A free-delivery coupon can never save more than the fee it removes.
  const couponDiscount = applied
    ? Math.min(applied.saved, applied.kind === 'free_delivery' ? deliveryFee : itemTotal)
    : 0;

  const payable = Math.max(0, itemTotal + deliveryFee + FEES.handling - couponDiscount);

  return {
    itemCount,
    itemTotal,
    productSavings,
    deliveryFee,
    handlingFee: FEES.handling,
    couponDiscount,
    totalSavings: productSavings + couponDiscount,
    payable,
    freeDeliveryUnlocked,
    amountToFreeDelivery: freeDeliveryUnlocked
      ? 0
      : Math.max(0, FEES.freeDeliveryThreshold - itemTotal),
    appliedCoupon: applied,
  };
}

/** ₹1,299 — Indian digit grouping, used everywhere a price is rendered. */
export function formatPrice(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** Compact form for dense surfaces: ₹1.3k, ₹12.4k. */
export function formatPriceCompact(amount: number): string {
  if (amount < 1000) return `₹${Math.round(amount)}`;
  const thousands = amount / 1000;
  const text = thousands < 10 ? thousands.toFixed(1) : String(Math.round(thousands));
  return `₹${text.replace(/\.0$/, '')}k`;
}
