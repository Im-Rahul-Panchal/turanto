import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from './press-scale';
import { Icon, type LucideIconName } from './icon';
import { Text } from './text';
import { colors, radius, shadows, spacing } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIconName;
  /** Rendered after the label — useful for trailing chevrons or amounts. */
  trailing?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  /** Stretches to the container width. */
  block?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Defaults to `label`, which is usually clearer for screen readers. */
  accessibilityLabel?: string;
};

const surface: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.error },
  accent: { backgroundColor: colors.accent },
};

const labelColor: Record<ButtonVariant, string> = {
  primary: colors.textOnPrimary,
  secondary: colors.primaryDark,
  outline: colors.primaryDark,
  ghost: colors.primaryDark,
  danger: colors.textOnPrimary,
  accent: colors.textOnPrimary,
};

const heightBySize: Record<ButtonSize, number> = { sm: 38, md: 48, lg: 54 };

/**
 * The app's only button. Every variant shares one height-per-size scale and one
 * press animation, so CTAs across different screens always feel identical.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  trailing,
  loading = false,
  disabled = false,
  block = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const isInert = disabled || loading;
  const labelVariant = size === 'sm' ? 'buttonSmall' : 'button';

  return (
    <PressScale
      onPress={onPress}
      disabled={isInert}
      haptic="light"
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isInert, busy: loading }}
      style={[
        styles.base,
        { height: heightBySize[size] },
        surface[variant],
        // Only a filled primary button earns a shadow.
        variant === 'primary' && shadows.xs,
        block && styles.block,
        isInert && styles.inert,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={labelColor[variant]}
          accessibilityLabel="Loading"
        />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 18} color={labelColor[variant]} /> : null}
          <Text variant={labelVariant} color={labelColor[variant]} lines={1}>
            {label}
          </Text>
          {trailing}
        </View>
      )}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  block: { alignSelf: 'stretch' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inert: { opacity: 0.45 },
});
