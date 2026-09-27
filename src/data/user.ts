import type { Address, User } from '@/types';

export const currentUser: User = {
  id: 'usr_rahul',
  name: 'Rahul Sharma',
  avatarKey: 'avatar-user',
  email: 'rahul.sharma@example.com',
  phone: '+91 98450 12345',
  loyaltyPoints: 1840,
  membershipTier: 'Turanto Prime',
  joinedOn: '2023-06-14T00:00:00.000Z',
};

export const addresses: Address[] = [
  {
    id: 'addr_home',
    label: 'home',
    name: 'Rahul Sharma',
    line1: 'Flat 402, Green Meadows Apartments',
    line2: '12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    contactNumber: '+91 98450 12345',
    isDefault: true,
    etaMinutes: [10, 20],
  },
  {
    id: 'addr_work',
    label: 'work',
    name: 'Rahul Sharma',
    line1: '7th Floor, Tower B, Prestige Tech Park',
    line2: 'Marathahalli Outer Ring Road',
    city: 'Bengaluru',
    pincode: '560103',
    contactNumber: '+91 98450 12345',
    isDefault: false,
    etaMinutes: [25, 35],
  },
  {
    id: 'addr_family',
    label: 'other',
    name: 'Anita Sharma',
    line1: 'Flat 12, Lake View Residency',
    line2: '3rd Cross, Jayanagar 4th Block',
    city: 'Bengaluru',
    pincode: '560011',
    contactNumber: '+91 98860 54321',
    isDefault: false,
    etaMinutes: [30, 40],
  },
];

export const defaultAddressId = addresses.find((a) => a.isDefault)?.id ?? addresses[0].id;

/** One-line address used in headers and order summaries. */
export function formatAddressLine(address: Address): string {
  return `${address.line1}, ${address.line2 ?? address.city}`;
}

export function getAddressById(id: string): Address | undefined {
  return addresses.find((a) => a.id === id);
}
