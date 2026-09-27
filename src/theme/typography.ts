import { Platform, type TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * Turanto uses the platform's native UI font (San Francisco on iOS, Roboto on
 * Android) so text renders crisply and respects the user's accessibility font
 * settings. Hierarchy comes from weight, size and letter-spacing rather than
 * from a custom typeface, which also keeps the bundle small.
 */
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const fontFamilies = {
  regular: fontFamily,
} as const;

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

/**
 * Every entry includes an explicit `lineHeight` so that long product names and
 * multi-line addresses never clip or collide with adjacent elements.
 */
export const typography = {
  display: {
    fontFamily,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.text,
  },
  h1: {
    fontFamily,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.text,
  },
  h2: {
    fontFamily,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.text,
  },
  h3: {
    fontFamily,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.text,
  },
  h4: {
    fontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.1,
    color: colors.text,
  },
  body: {
    fontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.text,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
  },
  bodySmall: {
    fontFamily,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.textMuted,
  },
  /** Uppercase micro-label used for section eyebrows and status chips. */
  overline: {
    fontFamily,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  button: {
    fontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: colors.textOnPrimary,
  },
  buttonSmall: {
    fontFamily,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
    color: colors.textOnPrimary,
  },
  price: {
    fontFamily,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.text,
  },
  priceLarge: {
    fontFamily,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.text,
  },
  discount: {
    fontFamily,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  rating: {
    fontFamily,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: colors.text,
  },
  code: {
    fontFamily: monoFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.text,
  },
  /**
   * Category/product emoji glyphs from the taxonomy. Rendered at a fixed size so
   * a glyph never reflows the row it sits in, and without a fontFamily override
   * so the platform's colour emoji font is used.
   */
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  /** Large emoji for hero/empty-state accents. */
  emojiLarge: {
    fontSize: 40,
    lineHeight: 48,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
