import type { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

/**
 * Motion tokens. Durations are short on purpose: an interface feels premium when
 * transitions are quick and interruptible, never when they are slow and heavy.
 */
export const duration = {
  instant: 90,
  fast: 160,
  normal: 240,
  slow: 360,
  deliberate: 520,
} as const;

export const easing = {
  /** Decelerate — for elements entering the screen. */
  enter: [0.16, 1, 0.3, 1],
  /** Accelerate — for elements leaving the screen. */
  exit: [0.4, 0, 1, 1],
  standard: [0.4, 0, 0.2, 1],
} as const;

/**
 * Default timing config. Reanimated's built-in Easing is used unless a call site
 * needs something specific from `easing` above.
 */
export const timing = (ms: number = duration.normal): WithTimingConfig => ({
  duration: ms,
});

/** A gentle, slightly bouncy spring used for press and pop interactions. */
export const spring: WithSpringConfig = {
  damping: 18,
  stiffness: 220,
  mass: 0.7,
};

/** Softer spring for larger surfaces such as sheets. */
export const springSoft: WithSpringConfig = {
  damping: 26,
  stiffness: 160,
  mass: 0.9,
};

/** Scale applied while a touchable is held down. */
export const pressScale = 0.96;
/** Scale used for the cart badge pop. */
export const badgePopScale = 1.35;
