import { colors } from './colors';
import { layout } from './layout';
import { shadow, shadows, type ShadowLevel } from './shadows';
import { radius } from './radius';
import { spacing } from './spacing';
import { tints } from './tints';
import { typography } from './typography';

/**
 * Single object consumed by components via `import { theme } from '@/theme'`.
 * Grouped access reads better at call sites than importing six modules, and it
 * gives us one place to evolve the design system.
 */
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  tints,
  shadows,
  shadow,
  layout,
} as const;

export type Theme = typeof theme;
export type { ShadowLevel };
