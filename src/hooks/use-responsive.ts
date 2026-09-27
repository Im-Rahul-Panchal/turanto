import { useWindowDimensions } from 'react-native';

import { getBreakpoint, getGridColumns, isCompact as isCompactWidth } from '@/theme/layout';
import type { breakpoints } from '@/theme/layout';

type Breakpoint = keyof typeof breakpoints;

/**
 * Window metrics that update on rotation, split-screen resize and web window
 * changes. Screens read these instead of measuring themselves, so layout stays
 * consistent and no screen has to import `Dimensions` directly.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const breakpoint: Breakpoint = getBreakpoint(width);

  return {
    width,
    height,
    breakpoint,
    isCompact: isCompactWidth(width),
    isWide: breakpoint === 'wide',
    gridColumns: getGridColumns(width),
  };
}
