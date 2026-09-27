import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type LucideIconName } from './icon';
import { Text } from './text';
import { colors, radius, spacing, tints } from '@/theme';
import type { CategoryTint } from '@/types';

type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'offer'
  | 'accent'
  | 'tint';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  /** Only used when `tone` is `tint` — ties the badge to a category colour. */
  tint?: CategoryTint;
  icon?: LucideIconName;
  /** Filled badges are for emphasis; soft ones sit quietly next to content. */
  variant?: 'solid' | 'soft';
  style?: StyleProp<ViewStyle>;
};

function resolveTone(tone: BadgeTone, tint?: CategoryTint) {
  if (tone === 'tint' && tint) {
    const palette = tints[tint];
    return { background: palette.soft, foreground: palette.strong };
  }
  switch (tone) {
    case 'primary':
      return { background: colors.primaryLighter, foreground: colors.primaryDark };
    case 'success':
      return { background: colors.successSoft, foreground: colors.success };
    case 'warning':
      return { background: colors.warningSoft, foreground: colors.text };
    case 'error':
      return { background: colors.errorSoft, foreground: colors.error };
    case 'info':
      return { background: colors.infoSoft, foreground: colors.info };
    case 'offer':
      return { background: colors.offerSoft, foreground: colors.offer };
    case 'accent':
      return { background: colors.accentSoft, foreground: colors.accentPressed };
    default:
      return { background: colors.surfaceMuted, foreground: colors.textSecondary };
  }
}

/** Small status pill. Used for discounts, stock, order status and counts. */
export function Badge({
  label,
  tone = 'neutral',
  tint,
  icon,
  variant = 'soft',
  style,
}: BadgeProps) {
  const { background, foreground } = resolveTone(tone, tint);
  const isSolid = variant === 'solid';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: isSolid ? colors.primary : background },
        style,
      ]}>
      {icon ? <Icon name={icon} size={12} color={isSolid ? colors.textOnPrimary : foreground} /> : null}
      <Text
        variant="discount"
        color={isSolid ? colors.textOnPrimary : foreground}
        lines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Circular count indicator, used for the cart badge. */
export function CountBubble({ count, style }: { count: number; style?: StyleProp<ViewStyle> }) {
  if (count <= 0) return null;
  return (
    <View style={[styles.bubble, style]}>
      <Text variant="discount" color={colors.textOnPrimary} lines={1}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
  },
  bubble: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
