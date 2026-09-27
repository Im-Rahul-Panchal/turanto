import { categories } from './categories';
import { getProduct } from './products';
import { getCoupon } from './coupons';
import { addresses, defaultAddressId } from './user';
import { computeTotals, type PricedLine } from '@/utils/pricing';
import type { CartItem, Order, OrderItem, OrderStatus, PaymentMethod, TrackingStep } from '@/types';
import type { Address } from '@/types/user';

/** ISO timestamp `hours` in the past — used to age the seed orders. */
function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/** ISO timestamp `hours` in the future — used to keep deal countdowns live. */
export function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

/** Resolves product ids into order lines, skipping any that no longer exist. */
function toOrderItems(
  lines: PricedLine[],
): { items: OrderItem[]; priced: PricedLine[] } {
  const items: OrderItem[] = [];
  const priced: PricedLine[] = [];

  for (const line of lines) {
    const product = getProduct(line.productId);
    if (!product) continue;
    items.push({
      productId: product.id,
      name: product.name,
      unit: product.unit,
      imageKey: product.imageKey,
      quantity: line.quantity,
      price: product.price,
      mrp: product.mrp,
    });
    priced.push({ ...line, price: product.price, mrp: product.mrp });
  }

  return { items, priced };
}

const TIMELINE: { status: TrackingStep['status']; label: string; description: string }[] = [
  { status: 'preparing', label: 'Preparing', description: 'Your items are being picked' },
  { status: 'packed', label: 'Packed', description: 'Bagged and ready to go' },
  { status: 'out_for_delivery', label: 'Out for delivery', description: 'Rider is on the way' },
  { status: 'delivered', label: 'Delivered', description: 'Handed over at your door' },
];

/** Builds the visible timeline, stamping only the steps the order has passed. */
function buildTracking(status: OrderStatus, placedHoursAgo: number): TrackingStep[] {
  const reachedIndex = TIMELINE.findIndex((s) => s.status === status);

  return TIMELINE.map((step, index) => {
    if (status === 'cancelled' || index > reachedIndex) {
      return { ...step, at: null };
    }
    return { ...step, at: hoursAgo(Math.max(0, placedHoursAgo - index * 0.18)) };
  });
}

function makeOrder(config: {
  id: string;
  reference: string;
  status: OrderStatus;
  placedHoursAgo: number;
  lines: PricedLine[];
  addressId?: string;
  couponCode?: string;
  etaLabel: string;
  paymentMethod: Order['paymentMethod'];
  instructions?: string;
  rating?: number;
}): Order {
  const { items, priced } = toOrderItems(config.lines);
  const address =
    addresses.find((a) => a.id === (config.addressId ?? defaultAddressId)) ?? addresses[0];
  const totals = computeTotals(priced, { coupon: config.couponCode ? getCoupon(config.couponCode) : null });

  return {
    id: config.id,
    reference: config.reference,
    placedAt: hoursAgo(config.placedHoursAgo),
    status: config.status,
    items,
    itemCount: totals.itemCount,
    totals: {
      itemTotal: totals.itemTotal,
      deliveryFee: totals.deliveryFee,
      handlingFee: totals.handlingFee,
      taxes: 0,
      couponDiscount: totals.couponDiscount,
      productSavings: totals.productSavings,
      totalSavings: totals.totalSavings,
      payable: totals.payable,
    },
    paymentMethod: config.paymentMethod,
    deliveryAddress: address,
    ...(config.instructions !== undefined ? { deliveryInstructions: config.instructions } : {}),
    etaLabel: config.etaLabel,
    ...(config.rating !== undefined ? { rating: config.rating } : {}),
    tracking: buildTracking(config.status, config.placedHoursAgo),
  };
}

/**
 * Seed order history covering every status, so the tracking UI can be shown in
 * all of its states without waiting for a real order to progress.
 */
export const seedOrders: Order[] = [
  makeOrder({
    id: 'ord_1042',
    reference: 'TR-1042',
    status: 'out_for_delivery',
    placedHoursAgo: 0.6,
    lines: [
      { productId: 'milk', quantity: 2, price: 68, mrp: 74 },
      { productId: 'bread', quantity: 1, price: 55, mrp: 65 },
      { productId: 'butter', quantity: 1, price: 58, mrp: 64 },
    ],
    addressId: 'addr_home',
    couponCode: 'TURANTO100',
    etaLabel: 'Arriving in 12–18 min',
    paymentMethod: 'upi',
    instructions: 'Please leave at the door. Ring the bell twice.',
  }),
  makeOrder({
    id: 'ord_1039',
    reference: 'TR-1039',
    status: 'packed',
    placedHoursAgo: 0.2,
    lines: [
      { productId: 'noodles', quantity: 1, price: 168, mrp: 199 },
      { productId: 'chocolate', quantity: 2, price: 90, mrp: 110 },
      { productId: 'cola', quantity: 1, price: 65, mrp: 78 },
    ],
    couponCode: 'SNACKS20',
    etaLabel: 'Arriving in 18–25 min',
    paymentMethod: 'cod',
  }),
  makeOrder({
    id: 'ord_1035',
    reference: 'TR-1035',
    status: 'preparing',
    placedHoursAgo: 0.05,
    lines: [
      { productId: 'atta', quantity: 1, price: 289, mrp: 339 },
      { productId: 'dal', quantity: 2, price: 149, mrp: 179 },
      { productId: 'oil', quantity: 1, price: 139, mrp: 159 },
    ],
    addressId: 'addr_work',
    etaLabel: 'Arriving in 32–40 min',
    paymentMethod: 'wallet',
  }),
  makeOrder({
    id: 'ord_1011',
    reference: 'TR-1011',
    status: 'delivered',
    placedHoursAgo: 74,
    lines: [
      { productId: 'detergent', quantity: 1, price: 289, mrp: 345 },
      { productId: 'dishwash', quantity: 1, price: 129, mrp: 159 },
      { productId: 'toilet-cleaner', quantity: 1, price: 179, mrp: 219 },
    ],
    couponCode: 'FIRSTORDER15',
    etaLabel: 'Delivered in 18 min',
    paymentMethod: 'card',
    rating: 5,
  }),
  makeOrder({
    id: 'ord_998',
    reference: 'TR-0998',
    status: 'delivered',
    placedHoursAgo: 168,
    lines: [
      { productId: 'apple', quantity: 1, price: 149, mrp: 189 },
      { productId: 'almonds', quantity: 1, price: 349, mrp: 429 },
    ],
    etaLabel: 'Delivered in 14 min',
    paymentMethod: 'upi',
    rating: 4,
  }),
];

/**
 * Builds a brand-new order from the current cart.
 *
 * Lives here rather than in the orders provider so that every order — seeded or
 * placed — is constructed by the same code path and therefore has the same
 * shape, timeline and totals.
 */
export function createOrder(input: {
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  couponCode?: string | null;
  instructions?: string;
  /** Delivery window shown on the confirmation screen. */
  etaLabel?: string;
}): Order {
  const priced: PricedLine[] = input.items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
    mrp: item.product.mrp,
  }));

  return makeOrder({
    id: `ord_${Date.now()}`,
    reference: `TR-${String(Math.floor(1000 + Math.random() * 9000))}`,
    status: 'preparing',
    placedHoursAgo: 0,
    lines: priced,
    addressId: input.address.id,
    couponCode: input.couponCode ?? undefined,
    paymentMethod: input.paymentMethod,
    instructions: input.instructions,
    etaLabel: input.etaLabel ?? '12–15 min',
  });
}

/** Products bought in past orders, used by the "Buy again" rail on Home. */
export function getReorderProductIds(): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const order of seedOrders) {
    for (const item of order.items) {
      if (!seen.has(item.productId)) {
        seen.add(item.productId);
        ids.push(item.productId);
      }
    }
  }
  return ids;
}

/** Recently used search terms, seeded for a first launch. */
export const seedRecentSearches: string[] = ['milk', 'bread', 'atta', 'noodles'];

/** Terms surfaced on the search landing screen. */
export const popularSearches: string[] = [
  'milk',
  'chips',
  'atta',
  'shampoo',
  'bread',
  'coffee',
  'banana',
  'detergent',
];

/** Category shortcuts shown before the shopper types anything. */
export const searchSuggestions = categories.slice(0, 8).map((category) => ({
  id: category.id,
  label: category.name,
  kind: 'category' as const,
}));
