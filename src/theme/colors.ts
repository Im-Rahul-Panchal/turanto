/**
 * Turanto colour system.
 *
 * The palette is built around an energetic green that feels fresh and fast
 * without borrowing any existing brand's identity. Neutrals carry a slight
 * green tint so the whole surface feels cohesive rather than grey-on-green.
 */

const palette = {
  green50: '#EEFBF3',
  green100: '#D5F5E3',
  green200: '#A9E9C6',
  green300: '#6FD9A2',
  green400: '#2FC77C',
  green500: '#00A65A',
  green600: '#00884A',
  green700: '#046B3C',
  green800: '#05512F',
  green900: '#063A23',

  amber100: '#FFF1D6',
  amber500: '#F5A524',
  amber600: '#D98A0B',

  coral100: '#FFE7DC',
  coral500: '#FF6B35',
  coral600: '#E14F1B',

  red100: '#FDE3E3',
  red500: '#E5484D',
  red600: '#C93A3F',

  blue100: '#E1EDFF',
  blue500: '#2F80ED',
  blue600: '#1B63C4',

  violet100: '#EEE8FF',
  violet500: '#7C5CE0',

  slate900: '#12201A',
  slate800: '#1B2B24',
  slate700: '#33463D',
  slate600: '#52645B',
  slate500: '#6E8078',
  slate400: '#93A29B',
  slate300: '#C2CEC8',
  slate200: '#E1E9E5',
  slate100: '#EEF3F1',
  slate50: '#F6F9F8',
  white: '#FFFFFF',
} as const;

export const colors = {
  /** Brand greens. `primary` is the single action colour used for CTAs. */
  primary: palette.green500,
  primaryPressed: palette.green600,
  primaryDark: palette.green700,
  primaryDeep: palette.green800,
  primaryDeepest: palette.green900,
  primaryLight: palette.green200,
  primaryLighter: palette.green100,
  primarySoft: palette.green50,

  /** Neutrals, tinted green so surfaces feel part of one family. */
  white: palette.white,
  offWhite: palette.slate50,
  surface: palette.white,
  surfaceSunken: palette.slate50,
  surfaceMuted: palette.slate100,
  border: palette.slate200,
  borderStrong: palette.slate300,

  charcoal: palette.slate900,
  text: palette.slate900,
  textSecondary: palette.slate700,
  textMuted: palette.slate500,
  textSubtle: palette.slate400,
  textOnPrimary: palette.white,
  textInverse: palette.white,

  /** Status colours. */
  success: palette.green600,
  successSoft: palette.green50,
  warning: palette.amber500,
  warningSoft: palette.amber100,
  error: palette.red500,
  errorSoft: palette.red100,
  info: palette.blue500,
  infoSoft: palette.blue100,

  /**
   * Accent colours. Used only for offer/deal surfaces and small highlights so
   * the interface stays calm — never as a general action colour.
   */
  accent: palette.coral500,
  accentPressed: palette.coral600,
  accentSoft: palette.coral100,
  offer: palette.violet500,
  offerSoft: palette.violet100,

  /** Star ratings. */
  star: palette.amber500,
  starEmpty: palette.slate300,

  /** Translucent overlays. */
  scrim: 'rgba(9, 26, 19, 0.45)',
  scrimStrong: 'rgba(9, 26, 19, 0.65)',
  shadow: palette.slate900,
} as const;

export type Colors = typeof colors;
