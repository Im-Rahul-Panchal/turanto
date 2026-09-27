import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, centeredContent, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  /** Header sits above the scroll area and stays put. */
  header?: ReactNode;
  footer?: ReactNode;
  /** Pinned to the bottom, above the safe area — typically a checkout CTA. */
  stickyFooter?: ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra bottom padding so a sticky footer never covers the last row. */
  bottomInset?: number;
};

/**
 * Screen shell.
 *
 * Owns the three things every screen would otherwise repeat: safe-area padding,
 * clamping content to a readable width on tablets, and making room for a sticky
 * footer. `scrollable` is opt-out so list screens can hand the scroll container
 * to a `FlatList` and keep virtualisation.
 */
export function Screen({
  children,
  header,
  footer,
  stickyFooter,
  scrollable = true,
  backgroundColor = colors.surfaceSunken,
  contentStyle,
  bottomInset = 0,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[centeredContent(), contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor }]}>
      {header ? (
        <View style={[styles.header, { paddingTop: insets.top }]}>{header}</View>
      ) : null}

      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            {
              // Only pad for the bottom inset when nothing is pinned there.
              paddingBottom: spacing.xxl + (stickyFooter ? 0 : insets.bottom + bottomInset),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{content}</View>
      )}

      {footer}

      {stickyFooter ? (
        <View
          style={[
            styles.sticky,
            { paddingBottom: Math.max(insets.bottom, spacing.sm) },
          ]}>
          {stickyFooter}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    width: '100%',
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  sticky: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
