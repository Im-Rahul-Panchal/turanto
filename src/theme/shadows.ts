import { Platform, type ViewStyle } from 'react-native';

import { colors } from './colors';

type ShadowLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ShadowTokens = {
  elevation: number;
  opacity: number;
  radius: number;
  offsetY: number;
};

/**
 * Deliberately restrained. Elevation is reserved for surfaces that genuinely
 * float above the page (sticky bars, sheets, raised CTAs) — cards use borders
 * and a hint of shadow instead of heavy drop shadows.
 */
const tokens: Record<ShadowLevel, ShadowTokens> = {
  none: { elevation: 0, opacity: 0, radius: 0, offsetY: 0 },
  xs: { elevation: 1, opacity: 0.05, radius: 4, offsetY: 1 },
  sm: { elevation: 2, opacity: 0.07, radius: 10, offsetY: 2 },
  md: { elevation: 4, opacity: 0.09, radius: 18, offsetY: 6 },
  lg: { elevation: 10, opacity: 0.12, radius: 28, offsetY: 10 },
  xl: { elevation: 18, opacity: 0.16, radius: 40, offsetY: 18 },
};

/**
 * Builds a cross-platform shadow style. Android uses `elevation`; iOS/web use
 * the `shadow*` family. Both are emitted so a single call site works everywhere.
 */
export function shadow(level: ShadowLevel = 'sm'): ViewStyle {
  const t = tokens[level];

  if (t.elevation === 0 && t.opacity === 0) {
    return {};
  }

  return Platform.select<ViewStyle>({
    android: { elevation: t.elevation },
    default: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: t.offsetY },
      shadowOpacity: t.opacity,
      shadowRadius: t.radius,
    },
  }) as ViewStyle;
}

export const shadows = {
  none: shadow('none'),
  xs: shadow('xs'),
  sm: shadow('sm'),
  md: shadow('md'),
  lg: shadow('lg'),
  xl: shadow('xl'),
} as const;

export type { ShadowLevel };
