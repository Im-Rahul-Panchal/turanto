import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from './button';
import { Icon, type LucideIconName } from './icon';
import { Text } from './text';
import { getImage, type ImageKey } from '@/lib/images';
import { colors, spacing } from '@/theme';

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Illustration key, e.g. `empty-cart`. Falls back to a plain icon. */
  imageKey?: ImageKey;
  icon?: LucideIconName;
  actionLabel?: string;
  onActionPress?: () => void;
  secondaryActionLabel?: string;
  onSecondaryActionPress?: () => void;
  /** Shrinks the illustration for use inside a card or half-sheet. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared empty/error state.
 *
 * Every list in the app renders one of these instead of a blank area, so a user
 * who has not done something yet always gets an explanation and a next step
 * rather than an ambiguous void.
 */
export function EmptyState({
  title,
  description,
  imageKey,
  icon = 'package-open',
  actionLabel,
  onActionPress,
  secondaryActionLabel,
  onSecondaryActionPress,
  compact = false,
  style,
}: EmptyStateProps) {
  const artSize = compact ? 96 : 132;

  return (
    <View style={[styles.base, compact && styles.compact, style]}>
      {imageKey ? (
        <Image
          source={getImage(imageKey)}
          resizeMode="contain"
          accessible
          accessibilityRole="image"
          // Purely decorative: the title below already carries the meaning.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ width: artSize, height: artSize }}
        />
      ) : (
        <View
          style={[
            styles.iconBubble,
            { width: artSize, height: artSize, borderRadius: artSize / 2 },
          ]}>
          <Icon name={icon} size={compact ? 32 : 44} color={colors.primaryDark} />
        </View>
      )}

      <View style={styles.copy}>
        <Text variant={compact ? 'h3' : 'h2'} center lines={2}>
          {title}
        </Text>
        {description ? (
          <Text variant="bodySmall" color={colors.textSecondary} center lines={4}>
            {description}
          </Text>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Button label={actionLabel} onPress={onActionPress} size={compact ? 'md' : 'lg'} />
      ) : null}
      {secondaryActionLabel && onSecondaryActionPress ? (
        <Button
          label={secondaryActionLabel}
          onPress={onSecondaryActionPress}
          variant="ghost"
          size={compact ? 'md' : 'lg'}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  compact: {
    gap: spacing.base,
    paddingVertical: spacing.lg,
  },
  iconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 320,
  },
});
