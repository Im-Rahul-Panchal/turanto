import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressScale } from './press-scale';
import { Icon } from './icon';
import { Text } from './text';
import { colors, spacing } from '@/theme';

type SectionHeaderProps = {
  title: string;
  /** Small uppercase label above the title, e.g. "Today's deal". */
  eyebrow?: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Heading for a list section, with an optional inline action ("See all").
 * Used everywhere a horizontal rail or grid needs a label.
 */
export function SectionHeader({
  title,
  eyebrow,
  subtitle,
  actionLabel,
  onActionPress,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.base, style]}>
      <View style={styles.text}>
        {eyebrow ? <Text variant="overline">{eyebrow}</Text> : null}
        <Text variant="h2" lines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodySmall" lines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <PressScale
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.action}>
          <Text variant="bodySmall" color={colors.primaryDark}>
            {actionLabel}
          </Text>
          <Icon name="chevron-right" size={16} color={colors.primaryDark} />
        </PressScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.base,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.sm,
  },
});
