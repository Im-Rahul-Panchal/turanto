import { Text as RNText, type StyleProp, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/theme';

type TextProps = RNTextProps & {
  /** Picks a step from the typography scale. Defaults to `body`. */
  variant?: TypographyVariant;
  color?: string;
  center?: boolean;
  /** Clamps to `lines` and ellipsises — the safe way to handle long names. */
  lines?: number;
  style?: StyleProp<TextStyle>;
};

/**
 * Typography primitive. Using it everywhere guarantees the app draws only from
 * the type scale, which is what keeps long product names and prices from
 * drifting into mismatched sizes.
 */
export function Text({
  variant = 'body',
  color,
  center,
  lines,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      numberOfLines={lines}
      style={[
        typography[variant],
        color ? { color } : null,
        center ? { textAlign: 'center' } : null,
        style,
      ]}
      {...rest}
    />
  );
}

/** Currency/price text. Tabular figures stop totals jittering as they change. */
export function Price({
  value,
  variant = 'price',
  color,
  style,
  ...rest
}: Omit<TextProps, 'children'> & { value: string }) {
  return (
    <Text
      variant={variant}
      color={color ?? colors.text}
      style={[style, { fontVariant: ['tabular-nums'] }]}
      {...rest}>
      {value}
    </Text>
  );
}
