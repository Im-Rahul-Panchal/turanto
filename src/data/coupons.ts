import type { Coupon } from '@/types';

/**
 * Coupons available in the demo build. `value` is a rupee amount for `flat`, a
 * percentage for `percentage`, and unused for `free_delivery`.
 */
export const coupons: Coupon[] = [
  {
    code: 'TURANTO100',
    description: '₹100 off on orders above ₹799',
    kind: 'flat',
    value: 100,
    minOrderValue: 799,
  },
  {
    code: 'FIRSTORDER15',
    description: '15% off on your first order, up to ₹150',
    kind: 'percentage',
    value: 15,
    minOrderValue: 299,
    maxDiscount: 150,
  },
  {
    code: 'FREEDEL',
    description: 'Free delivery on orders above ₹199',
    kind: 'free_delivery',
    value: 0,
    minOrderValue: 199,
  },
  {
    code: 'SNACKS20',
    description: '20% off on snacks, up to ₹120',
    kind: 'percentage',
    value: 20,
    minOrderValue: 349,
    maxDiscount: 120,
  },
];

export function getCoupon(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
}
