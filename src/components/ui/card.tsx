import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, hairline, radius, shadows, spacing } from '@/theme';

type CardProps = {
  children: React.ReactNode;
  /** `flat` for list rows, `raised` for tiles that should feel physical. */
  variant?: 'flat' | 'raised' | 'outline' | 'ghost';
  padding?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
};

const paddingMap: Record<string, number> = {
  none: 0,
  xxs: spacing.xxs,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  base: spacing.base,
  lg: spacing.lg,
  xl: spacing.xl,
  xxl: spacing.xxl,
  huge: spacing.huge,
  giant: spacing.giant,
  massive: spacing.massive,
};

const variants: Record<NonNullable<CardProps['variant']>, ViewStyle> = {
  flat: { backgroundColor: colors.surface, borderWidth: hairline(1), borderColor: colors.border },
  outline: { backgroundColor: 'transparent', borderWidth: hairline(1), borderColor: colors.border },
  ghost: { backgroundColor: colors.surfaceMuted },
  raised: { backgroundColor: colors.surface, ...shadows.sm },
};

/**
 * Surface primitive. Cards lean on hairline borders rather than heavy shadows —
 * elevation is reserved for things that genuinely float (sticky bars, sheets).
 */
export function Card({ children, variant = 'flat', padding = 'base', style }: CardProps) {
  return (
    <View style={[styles.base, variants[variant], { padding: paddingMap[padding] }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
  },
});
