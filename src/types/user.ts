import type { ImageKey } from '@/lib/images';

export type AddressLabel = 'home' | 'work' | 'other';

export interface Address {
  id: string;
  label: AddressLabel;
  /** Short name for the receiver, e.g. "Rahul". */
  name: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  contactNumber: string;
  isDefault: boolean;
  /** Drives the "Delivering in 10–20 min" promise. */
  etaMinutes: [number, number];
}

export interface User {
  id: string;
  name: string;
  /** Key into the central asset map. */
  avatarKey: ImageKey;
  email: string;
  phone: string;
  /** Loyalty points shown on the profile screen. */
  loyaltyPoints: number;
  membershipTier: 'Turanto Basic' | 'Turanto Plus' | 'Turanto Prime';
  joinedOn: string;
}
