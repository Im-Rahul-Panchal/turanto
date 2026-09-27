import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';
import type { Address, AddressLabel } from '@/types';

type AddressCardProps = {
  address: Address;
  labelFor: (label: AddressLabel) => string;
  selected?: boolean;
  /** Shows the radio-style selection used in pickers. */
  selectable?: boolean;
  onPress?: () => void;
};

/**
 * Saved address.
 *
 * Used both read-only (profile, order summary) and selectable (checkout picker);
 * the selection affordance is a prop so the two never drift apart visually.
 */
export function AddressCard({
  address,
  labelFor,
  selected = false,
  selectable = false,
  onPress,
}: AddressCardProps) {
  const body = (
    <Card
      variant={selected ? 'outline' : 'flat'}
      padding="base"
      style={[styles.card, selected && styles.selected]}>
      <View style={styles.top}>
        {selectable ? (
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected ? <Icon name="check" size={12} color={colors.textOnPrimary} /> : null}
          </View>
        ) : (
          <Icon name="home" size={16} color={colors.primaryDark} />
        )}

        <Text variant="bodyMedium" lines={1} style={styles.label}>
          {labelFor(address.label)}
        </Text>

        {address.isDefault ? (
          <View style={styles.defaultTag}>
            <Text variant="caption" color={colors.primaryDark} lines={1}>
              Default
            </Text>
          </View>
        ) : null}
      </View>

      <Text variant="bodySmall" color={colors.textSecondary} lines={2} style={styles.line}>
        {address.line2 ? `${address.line1}, ${address.line2}` : address.line1}
      </Text>
      <Text variant="bodySmall" color={colors.textSecondary} lines={2} style={styles.line}>
        {`${address.city} ${address.pincode}`}
      </Text>
      <Text variant="caption" lines={1} style={styles.line}>
        {address.name}
      </Text>
    </Card>
  );

  if (!onPress) return body;

  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.98}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={`${labelFor(address.label)}, ${address.line1}`}
      style={styles.pressable}>
      {body}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  card: {
    gap: 1,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    flex: 1,
  },
  defaultTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: colors.primaryLighter,
  },
  line: {
    marginBottom: 1,
  },
});
