import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, hairline, spacing } from '@/theme';

type DividerProps = {
  /** `inset` leaves a left margin so it lines up with list content. */
  inset?: number;
  style?: StyleProp<ViewStyle>;
};

export function Divider({ inset = 0, style }: DividerProps) {
  return <View style={[styles.base, { marginLeft: inset }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    height: hairline(1),
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
