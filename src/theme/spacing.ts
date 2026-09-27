/**
 * 4pt spacing scale. Every margin, padding and gap in the app resolves to one of
 * these values — no magic numbers — which is what keeps rhythm consistent across
 * screens built by different people.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 40,
  giant: 48,
  massive: 64,
} as const;

/** Horizontal page gutter. Screens use this so content aligns across tabs. */
export const gutter = spacing.base;

/** Minimum tappable size, per platform accessibility guidance. */
export const hitSlopMin = 44;

export type Spacing = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[Spacing];
