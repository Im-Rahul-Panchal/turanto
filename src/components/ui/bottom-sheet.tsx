import { type PropsWithChildren, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from './icon';
import { Text } from './text';
import { PressScale } from './press-scale';
import { colors, duration, radius, shadows, spacing } from '@/theme';

type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Height as a fraction of the window, e.g. 0.6. Ignored when omitted. */
  heightRatio?: number;
  /** Hides the grab handle for full-bleed sheets such as the cart. */
  showHandle?: boolean;
  /** Blocks backdrop presses, e.g. while an action is in flight. */
  dismissable?: boolean;
}>;

/**
 * Modal sheet used for filters, offers, address pickers and product options.
 *
 * Built on `Modal` so it inherits native focus handling and the hardware back
 * button on Android, with an animated slide plus a scrim fade. The sheet always
 * respects the bottom safe area so its last row is never under a home indicator.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  heightRatio,
  showHandle = true,
  dismissable = true,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: duration.normal });
  }, [progress, visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 420 }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissable ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close"
            importantForAccessibility="no"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            shadows.xl,
            {
              paddingBottom: Math.max(insets.bottom, spacing.base),
              maxHeight: heightRatio ? `${Math.round(heightRatio * 100)}%` : '86%',
              opacity: progress.value,
            },
            sheetStyle,
          ]}>
          {showHandle ? <View style={styles.handle} /> : null}

          {title ? (
            <View style={styles.header}>
              <Text variant="h3" lines={1} style={styles.headerTitle}>
                {title}
              </Text>
              <PressScale
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={12}
                style={styles.close}>
                <Icon name="x" size={18} color={colors.textSecondary} />
              </PressScale>
            </View>
          ) : null}

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    backgroundColor: colors.scrim,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.base,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
});
