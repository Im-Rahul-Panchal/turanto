import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Thin wrapper around expo-haptics.
 *
 * Feedback is used sparingly on purpose — confirms, adds and removals only.
 * Every call is fire-and-forget and swallows errors, because haptics must never
 * be able to break an interaction or surface a platform warning.
 */

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

function safe(run: () => Promise<unknown>): void {
  if (!enabled) return;
  try {
    void run();
  } catch {
    // Intentionally ignored — haptics are decorative.
  }
}

export const haptics = {
  /** A light tap: chip toggles, tab switches, quantity nudges. */
  light(): void {
    safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  },

  /** A firmer tap: committing an add-to-cart. */
  medium(): void {
    safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  },

  /** Selection change: segmented controls, sort options. */
  selection(): void {
    safe(() => Haptics.selectionAsync());
  },

  success(): void {
    safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  },

  warning(): void {
    safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
  },

  error(): void {
    safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  },
} as const;
