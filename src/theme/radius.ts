/**
 * Corner radius scale. Turanto leans friendly-but-precise: generous radii on
 * cards and media, tighter radii on controls so buttons still read as buttons.
 */
export const radius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  pill: 999,
  full: 9999,
} as const;

export type Radius = keyof typeof radius;
export type RadiusValue = (typeof radius)[Radius];
