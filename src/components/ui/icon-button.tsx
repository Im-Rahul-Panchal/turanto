import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from './press-scale';
import { Icon, type LucideIconName } from './icon';
import { colors, hitSlopMin } from '@/theme';

type IconButtonProps = {
  name: LucideIconName;
  onPress?: () => void;
  /** Required: an icon alone tells a screen reader nothing useful. */
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Extra padding beyond the visual circle, for easier tapping. */
  hitSlop?: number;
};

/**
 * Circular icon control. The touch target is always at least 44×44 even when the
 * visual circle is smaller, which keeps header icons comfortably tappable on
 * small phones.
 */
export function IconButton({
  name,
  onPress,
  accessibilityLabel,
  size = 40,
  iconSize,
  color = colors.charcoal,
  backgroundColor = colors.surfaceMuted,
  disabled = false,
  style,
  hitSlop = Math.max(0, Math.round((hitSlopMin - size) / 2)),
}: IconButtonProps) {
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      hitSlop={hitSlop}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
        disabled && styles.disabled,
        style,
      ]}>
      <View pointerEvents="none">
        <Icon name={name} size={iconSize ?? Math.round(size * 0.5)} color={color} />
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
});
