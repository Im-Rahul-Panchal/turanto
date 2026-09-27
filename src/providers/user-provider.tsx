import { createContext, useCallback, useContext, useMemo } from 'react';

import { usePersistentState } from '@/hooks/use-persistent-state';
import { storageKeys } from '@/constants/storage';
import { addresses as seedAddresses, currentUser, defaultAddressId, formatAddressLine } from '@/data/user';
import { haptics } from '@/utils/haptics';
import type { Address, AddressLabel } from '@/types';

type UserContextValue = {
  user: typeof currentUser;
  addresses: Address[];
  selectedAddressId: string | null;
  selectedAddress: Address | null;
  hydrated: boolean;
  selectAddress: (id: string) => void;
  addAddress: (address: Omit<Address, 'id'> & { id?: string }) => Address;
  updateAddress: (id: string, patch: Partial<Omit<Address, 'id'>>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  labelFor: (label: AddressLabel) => string;
  formatAddress: (address: Address) => string;
};

const UserContext = createContext<UserContextValue | null>(null);

const addressLabels: Record<AddressLabel, string> = {
  home: 'Home',
  work: 'Work',
  other: 'Other',
};

/**
 * Mock signed-in user and delivery addresses.
 *
 * The user is a fixture, but the address book and the *selected* address are
 * real app state and both persist, so a shopper who adds a work address or picks
 * "Work" sees it again in checkout and in the order summary after a restart.
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const {
    value: addressBook,
    setValue: setAddressBook,
    hydrated: addressesHydrated,
  } = usePersistentState<Address[]>(storageKeys.addresses, seedAddresses);

  const { value: selectedAddressId, setValue: setSelectedAddressId, hydrated: selectionHydrated } =
    usePersistentState<string | null>(storageKeys.selectedAddressId, defaultAddressId);

  const hydrated = addressesHydrated && selectionHydrated;

  const selectedAddress = useMemo(
    () => addressBook.find((address) => address.id === selectedAddressId) ?? null,
    [addressBook, selectedAddressId],
  );

  const selectAddress = useCallback(
    (id: string) => {
      setSelectedAddressId(id);
      haptics.selection();
    },
    [setSelectedAddressId],
  );

  const addAddress = useCallback(
    (address: Omit<Address, 'id'> & { id?: string }) => {
      // A millisecond id is unique enough for a local address book and keeps the
      // function synchronous, which keeps the form simple to submit.
      const created: Address = {
        ...address,
        id: address.id ?? `address-${Date.now()}`,
      };

      setAddressBook((current) => {
        const isFirst = current.length === 0;
        const withNew = [...current, { ...created, isDefault: isFirst || created.isDefault }];
        return created.isDefault ? withNew.map((item) => ({ ...item, isDefault: item.id === created.id })) : withNew;
      });

      setSelectedAddressId(created.id);
      return created;
    },
    [setAddressBook, setSelectedAddressId],
  );

  const updateAddress = useCallback(
    (id: string, patch: Partial<Omit<Address, 'id'>>) => {
      setAddressBook((current) =>
        current.map((address) => (address.id === id ? { ...address, ...patch, id } : address)),
      );
    },
    [setAddressBook],
  );

  const removeAddress = useCallback(
    (id: string) => {
      setAddressBook((current) => {
        const next = current.filter((address) => address.id !== id);
        if (next.length === 0) return next;

        // Never leave the book without a default, and never leave the selection
        // pointing at a row that no longer exists.
        if (!next.some((address) => address.isDefault)) {
          next[0] = { ...next[0], isDefault: true };
        }

        if (selectedAddressId === id) {
          setSelectedAddressId(next[0].id);
        }

        return next;
      });
    },
    [selectedAddressId, setAddressBook, setSelectedAddressId],
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddressBook((current) =>
        current.map((address) => ({ ...address, isDefault: address.id === id })),
      );
      setSelectedAddressId(id);
    },
    [setAddressBook, setSelectedAddressId],
  );

  const labelFor = useCallback((label: AddressLabel) => addressLabels[label], []);

  const formatAddress = useCallback(
    (address: Address) =>
      [formatAddressLine(address), address.city, address.pincode].filter(Boolean).join(', '),
    [],
  );

  const value = useMemo<UserContextValue>(
    () => ({
      user: currentUser,
      addresses: addressBook,
      selectedAddressId,
      selectedAddress,
      hydrated,
      selectAddress,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      labelFor,
      formatAddress,
    }),
    [
      addAddress,
      addressBook,
      formatAddress,
      hydrated,
      labelFor,
      removeAddress,
      selectAddress,
      selectedAddress,
      selectedAddressId,
      setDefaultAddress,
      updateAddress,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside <UserProvider>');
  }
  return context;
}
