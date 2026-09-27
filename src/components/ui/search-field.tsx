import { StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type LucideIconName } from './icon';
import { PressScale } from './press-scale';
import { colors, layout, radius, spacing } from '@/theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  /** Rendered before the input, e.g. a location or back arrow. */
  leadingIcon?: LucideIconName;
  onLeadingPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  /** Rounds the field and enlarges the text for the main search screen. */
  emphasis?: boolean;
  style?: StyleProp<ViewStyle>;
};

const heights = { sm: 40, md: layout.inputHeight, lg: 54 } as const;

/**
 * Text input used for search and coupon entry.
 *
 * The clear button only mounts when there is text to clear, so the field keeps a
 * stable width and does not reflow as the user types.
 */
export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search for products',
  onSubmit,
  onClear,
  onFocus,
  autoFocus,
  leadingIcon,
  onLeadingPress,
  size = 'md',
  emphasis = false,
  style,
}: SearchFieldProps) {
  const showClear = value.length > 0;

  return (
    <View style={[styles.base, { height: heights[size] }, emphasis && styles.emphasis, style]}>
      {leadingIcon ? (
        <PressScale
          onPress={onLeadingPress}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={styles.leading}>
          <Icon name={leadingIcon} size={20} color={colors.textSecondary} />
        </PressScale>
      ) : (
        <Icon name="search" size={size === 'sm' ? 17 : 19} color={colors.textMuted} />
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        accessibilityLabel={placeholder}
        style={[styles.input, emphasis && styles.inputEmphasis]}
      />

      {showClear ? (
        <PressScale
          onPress={onClear}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          style={styles.clear}>
          <Icon name="x" size={14} color={colors.textOnPrimary} />
        </PressScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
  },
  emphasis: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  leading: {
    paddingRight: spacing.xs,
  },
  input: {
    flex: 1,
    padding: 0,
    color: colors.text,
    fontSize: 15,
  },
  inputEmphasis: {
    fontSize: 16,
  },
  clear: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textSubtle,
  },
});
