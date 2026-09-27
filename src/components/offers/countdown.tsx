import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCountdown } from '@/hooks/use-countdown';
import { colors, radius, spacing } from '@/theme';

type CountdownProps = {
  targetIso: string;
  label?: string;
};

/**
 * Live "ends in" timer for flash deals.
 *
 * Ticks once a second and renders nothing once the deadline has passed, so an
 * expired deal does not keep a timer running in the background for no reason.
 */
export function Countdown({ targetIso, label = 'Ends in' }: CountdownProps) {
  const remaining = useCountdown(targetIso);

  if (!remaining || remaining.expired) {
    return (
      <View style={styles.expired}>
        <Icon name="timer-off" size={12} color={colors.textMuted} />
        <Text variant="caption">Deal ended</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.base}
      accessible
      accessibilityLabel={`${label} ${remaining.hours} hours ${remaining.minutes} minutes`}>
      <Text variant="caption" color={colors.accentPressed}>
        {label}
      </Text>
      <View style={styles.units}>
        <TimeUnit value={remaining.hours} unit="h" />
        <Text variant="caption" color={colors.accentPressed}>
          :
        </Text>
        <TimeUnit value={remaining.minutes} unit="m" />
        <Text variant="caption" color={colors.accentPressed}>
          :
        </Text>
        <TimeUnit value={remaining.seconds} unit="s" />
      </View>
    </View>
  );
}

function TimeUnit({ value, unit }: { value: string; unit: string }) {
  return (
    <View style={styles.unit}>
      <Text variant="discount" color={colors.textOnPrimary} lines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  units: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  unit: {
    minWidth: 22,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radius.xs,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  expired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
});
