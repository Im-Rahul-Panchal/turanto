import type { ImageKey } from '@/lib/images';
import type { Address } from './user';

export type OrderStatus = 'preparing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'upi' | 'cod' | 'card' | 'wallet';

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  imageKey: ImageKey;
  quantity: number;
  /** Unit price captured at purchase time. */
  price: number;
  mrp: number;
}

export interface OrderTotals {
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  taxes: number;
  couponDiscount: number;
  productSavings: number;
  totalSavings: number;
  payable: number;
}

/** One step in the visible delivery timeline. */
export interface TrackingStep {
  status: Exclude<OrderStatus, 'cancelled'>;
  label: string;
  description: string;
  /** ISO timestamp; null while the step has not happened yet. */
  at: string | null;
}

export interface Order {
  id: string;
  /** Human-facing reference shown to the shopper, e.g. "TR-4821". */
  reference: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  itemCount: number;
  totals: OrderTotals;
  paymentMethod: PaymentMethod;
  /** Snapshot of the delivery address at purchase time. */
  deliveryAddress: Address;
  deliveryInstructions?: string;
  /** Human-readable delivery window, e.g. "12–14 min". */
  etaLabel: string;
  rating?: number;
  tracking: TrackingStep[];
}
