import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddressCard } from '@/components/address/address-card';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useToast } from '@/providers/toast-provider';
import { useUser } from '@/providers/user-provider';
import { colors, gutter, radius, spacing } from '@/theme';
import type { Address, AddressLabel } from '@/types';

const LABELS: AddressLabel[] = ['home', 'work', 'other'];

/**
 * Address book.
 *
 * A demo build with no backend still needs a believable address book, so the
 * screen edits a local draft and commits it to the provider in one step. The
 * provider persists the list, so changes survive a restart.
 */
export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { addresses, selectedAddressId, selectAddress, addAddress, updateAddress, removeAddress, setDefaultAddress, labelFor } =
    useUser();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [draft, setDraft] = useState<{
    label: AddressLabel;
    name: string;
    line1: string;
    line2: string;
    city: string;
    pincode: string;
  }>({ label: 'home', name: '', line1: '', line2: '', city: '', pincode: '' });

  function openNew() {
    setEditing(null);
    setDraft({ label: 'home', name: '', line1: '', line2: '', city: '', pincode: '' });
    setSheetOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setDraft({
      label: address.label,
      name: address.name,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      pincode: address.pincode,
    });
    setSheetOpen(true);
  }

  const canSave =
    draft.name.trim().length > 0 &&
    draft.line1.trim().length > 0 &&
    draft.city.trim().length > 0 &&
    draft.pincode.trim().length >= 6;

  function save() {
    if (!canSave) {
      toast.show({
        message: 'Add a name, street, city and a 6-digit pincode.',
        variant: 'info',
      });
      return;
    }

    const payload = {
      label: draft.label,
      name: draft.name.trim(),
      line1: draft.line1.trim(),
      line2: draft.line2.trim() || undefined,
      city: draft.city.trim(),
      pincode: draft.pincode.trim(),
      contactNumber: editing?.contactNumber ?? '+91 98000 00000',
      isDefault: editing?.isDefault ?? addresses.length === 0,
      etaMinutes: editing?.etaMinutes ?? ([10, 20] as [number, number]),
    };

    if (editing) {
      updateAddress(editing.id, {
        label: draft.label,
        name: draft.name.trim(),
        line1: draft.line1.trim(),
        line2: draft.line2.trim() || undefined,
        city: draft.city.trim(),
        pincode: draft.pincode.trim(),
      });
      toast.show({ message: 'Address updated.', variant: 'success' });
    } else {
      const created = addAddress(payload);
      selectAddress(created.id);
      toast.show({ message: 'Address added.', variant: 'success' });
    }

    setSheetOpen(false);
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.navRow}>
          <IconButton
            name="arrow-left"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            backgroundColor={colors.surface}
          />
          <Text variant="h2" lines={1} style={styles.title}>
            Delivery addresses
          </Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.list}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.item}>
              <AddressCard
                address={address}
                labelFor={labelFor}
                selectable
                selected={address.id === selectedAddressId}
                onPress={() => {
                  selectAddress(address.id);
                  toast.show({
                    message: `Delivering to ${labelFor(address.label).toLowerCase()}.`,
                    variant: 'success',
                  });
                }}
              />

              <View style={styles.itemActions}>
                <Button
                  label="Edit"
                  variant="ghost"
                  size="sm"
                  onPress={() => openEdit(address)}
                  style={styles.grow}
                />
                <Button
                  label={address.isDefault ? 'Default' : 'Set as default'}
                  variant="ghost"
                  size="sm"
                  disabled={address.isDefault}
                  onPress={() => {
                    setDefaultAddress(address.id);
                    toast.show({ message: 'Default address updated.', variant: 'success' });
                  }}
                  style={styles.grow}
                />
                <Button
                  label="Remove"
                  variant="ghost"
                  size="sm"
                  disabled={addresses.length === 1}
                  onPress={() => {
                    removeAddress(address.id);
                    toast.show({ message: 'Address removed.', variant: 'info' });
                  }}
                  style={styles.grow}
                />
              </View>
            </View>
          ))}
        </View>

        <Button
          label="Add a new address"
          icon="plus"
          onPress={openNew}
          style={styles.add}
        />

        <Card variant="flat" padding="base" style={styles.note}>
          <Icon name="info" size={16} color={colors.textSecondary} />
          <Text variant="caption" color={colors.textSecondary} lines={3} style={styles.grow}>
            Addresses are stored on this device only. Turanto is a demo storefront and never
            contacts a real delivery partner.
          </Text>
        </Card>
      </ScrollView>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? 'Edit address' : 'New address'}>
        <View style={styles.form}>
          <Text variant="caption" color={colors.textSecondary} lines={1}>
            Label
          </Text>
          <View style={styles.chips}>
            {LABELS.map((label) => (
              <Chip
                key={label}
                label={labelFor(label)}
                selected={draft.label === label}
                onPress={() => setDraft((current) => ({ ...current, label }))}
              />
            ))}
          </View>

          <Field
            label="Receiver name"
            value={draft.name}
            onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
            placeholder="Full name"
          />
          <Field
            label="Flat, building, street"
            value={draft.line1}
            onChangeText={(line1) => setDraft((current) => ({ ...current, line1 }))}
            placeholder="Flat 4B, Lake View Apartments"
          />
          <Field
            label="Landmark (optional)"
            value={draft.line2}
            onChangeText={(line2) => setDraft((current) => ({ ...current, line2 }))}
            placeholder="Opposite the park"
          />
          <Field
            label="City"
            value={draft.city}
            onChangeText={(city) => setDraft((current) => ({ ...current, city }))}
            placeholder="Bengaluru"
          />
          <Field
            label="Pincode"
            value={draft.pincode}
            onChangeText={(pincode) => setDraft((current) => ({ ...current, pincode }))}
            placeholder="560001"
            keyboardType="number-pad"
            maxLength={6}
          />

          <Button label={editing ? 'Save changes' : 'Save address'} block onPress={save} />
        </View>
      </BottomSheet>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
  maxLength?: number;
};

function Field({ label, value, onChangeText, placeholder, keyboardType, maxLength }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text variant="caption" color={colors.textSecondary} lines={1}>
        {label}
      </Text>
      <View style={styles.input}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          keyboardType={keyboardType}
          maxLength={maxLength}
          style={styles.textInput}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
  content: {
    paddingHorizontal: gutter,
    paddingTop: spacing.sm,
  },
  grow: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  list: {
    gap: spacing.md,
  },
  item: {
    gap: spacing.xs,
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  add: {
    marginTop: spacing.lg,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  form: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  field: {
    gap: spacing.xs,
  },
  input: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 15,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
});
