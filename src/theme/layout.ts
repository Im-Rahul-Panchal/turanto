import { Dimensions, PixelRatio, type ViewStyle } from 'react-native';

/**
 * Layout tokens plus a small responsive layer.
 *
 * The app targets phones first but must not break on tablets, foldables or the
 * web build. Rather than hard-coding widths we derive a "content width" from the
 * live window and clamp it, so a 4.7" Android and a 6.9" iPhone both get
 * sensible column counts and neither ever overflows horizontally.
 */

/** Window widths at or below these are treated as compact. */
export const breakpoints = {
  compact: 0,
  regular: 411,
  large: 600,
  wide: 840,
} as const;

export const layout = {
  /** Standard horizontal page padding. */
  gutter: 16,
  /** Taller-than-usual bottom bar height (icons + labels + safe area). */
  tabBarHeight: 58,
  /** Height of a single-line text input with comfortable touch target. */
  inputHeight: 48,
  /** Max width for readable multi-column content on wide screens. */
  maxContentWidth: 720,
  /** Sticky action bar height above the safe-area inset. */
  stickyBarHeight: 68,
} as const;

function currentWidth(): number {
  const { width } = Dimensions.get('window');
  return width;
}

export function getBreakpoint(width: number = currentWidth()): keyof typeof breakpoints {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.large) return 'large';
  if (width >= breakpoints.regular) return 'regular';
  return 'compact';
}

export function isCompact(width: number = currentWidth()): boolean {
  return getBreakpoint(width) === 'compact';
}

/**
 * Number of product columns for a grid. Always at least 2 so cards never become
 * unusably wide, and capped so images do not balloon on tablets.
 */
export function getGridColumns(width: number = currentWidth()): number {
  if (width >= breakpoints.wide) return 4;
  if (width >= breakpoints.large) return 3;
  return 2;
}

/**
 * Width available for a grid child once gutters and inter-item gaps are removed.
 * Reading the live window (instead of caching) keeps the layout correct after
 * rotation or a window resize on web.
 */
export function getGridItemWidth(
  width: number = currentWidth(),
  gap: number = 12,
  horizontalPadding: number = layout.gutter * 2,
): number {
  const columns = getGridColumns(width);
  const available = Math.min(width, layout.maxContentWidth) - horizontalPadding;
  return Math.floor((available - gap * (columns - 1)) / columns);
}

/** Centres and caps content so text lines stay readable on wide screens. */
export function centeredContent(maxWidth: number = layout.maxContentWidth): ViewStyle {
  return {
    width: '100%',
    maxWidth,
    alignSelf: 'center',
  };
}

/** Rounds to the device pixel grid to avoid blurry borders on fractional sizes. */
export function hairline(size: number): number {
  return PixelRatio.roundToNearestPixel(size);
}
