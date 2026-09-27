import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type LucideIconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PressScale } from '@/components/ui/press-scale';
import { colors, duration, radius, shadows, spacing } from '@/theme';
import type { ToastPayload, ToastVariant } from '@/types';

const variantStyles: Record<ToastVariant, { background: string; foreground: string; icon: LucideIconName }> = {
  success: { background: colors.primaryDark, foreground: colors.textOnPrimary, icon: 'check' },
  error: { background: colors.error, foreground: colors.textOnPrimary, icon: 'triangle-alert' },
  info: { background: colors.charcoal, foreground: colors.textOnPrimary, icon: 'info' },
  offer: { background: colors.offer, foreground: colors.textOnPrimary, icon: 'badge-percent' },
  cart: { background: colors.charcoal, foreground: colors.textOnPrimary, icon: 'shopping-bag' },
  favorite: { background: colors.accent, foreground: colors.textOnPrimary, icon: 'heart' },
};

/**
 * Stack of transient messages.
 *
 * Mounted once at the app root so any screen can raise a toast. Toasts animate
 * in and out, and `Layout` keeps the remaining ones from jumping when one leaves
 * the stack mid-animation.
 */
export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastPayload[];
  onDismiss: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      {toasts.map((toast) => {
        const { background, foreground, icon } = variantStyles[toast.variant];
        return (
          <Animated.View
            key={toast.id}
            entering={FadeInDown.duration(duration.fast)}
            exiting={FadeOutUp.duration(duration.fast)}
            layout={Layout.duration(duration.fast)}
            style={[styles.toast, shadows.lg, { backgroundColor: background }]}>
            <Icon name={toast.icon ?? icon} size={18} color={foreground} />
            <Text variant="bodySmall" color={foreground} lines={2} style={styles.message}>
              {toast.message}
            </Text>
            {toast.action ? (
              <PressScale
                onPress={() => {
                  toast.action?.onPress();
                  onDismiss(toast.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={toast.action.label}
                style={[styles.action, { borderColor: foreground }]}>
                <Text variant="bodySmall" color={foreground}>
                  {toast.action.label}
                </Text>
              </PressScale>
            ) : null}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    zIndex: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'stretch',
    maxWidth: 460,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  message: {
    flex: 1,
    color: colors.textOnPrimary,
  },
  action: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
