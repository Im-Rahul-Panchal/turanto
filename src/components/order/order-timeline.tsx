import { StyleSheet, View } from 'react-native';

import { Icon, type LucideIconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors, radius, spacing } from '@/theme';
import type { Order, TrackingStep } from '@/types';

const stepIcons: Record<TrackingStep['status'], LucideIconName> = {
  preparing: 'chef-hat',
  packed: 'package-check',
  out_for_delivery: 'bike',
  delivered: 'circle-check',
};

type OrderTimelineProps = {
  order: Order;
};

/**
 * Vertical delivery timeline.
 *
 * Steps that have happened are solid; future steps stay muted and are marked
 * "pending" for screen readers, so the state is never conveyed by colour alone.
 */
export function OrderTimeline({ order }: OrderTimelineProps) {
  if (order.status === 'cancelled') {
    return (
      <View style={styles.cancelled}>
        <Icon name="circle-x" size={16} color={colors.error} />
        <Text variant="bodySmall" color={colors.error} lines={2} style={styles.cancelCopy}>
          This order was cancelled. Any amount paid is refunded within 3–5 business days.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {order.tracking.map((step, index) => {
        const done = step.at !== null;
        const isLast = index === order.tracking.length - 1;

        return (
          <View key={step.status} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.node,
                  done ? styles.nodeDone : styles.nodePending,
                  isLast && done && styles.nodeLast,
                ]}>
                <Icon
                  name={stepIcons[step.status]}
                  size={14}
                  color={done ? colors.textOnPrimary : colors.textSubtle}
                />
              </View>
              {!isLast ? (
                <View style={[styles.line, done ? styles.lineDone : styles.linePending]} />
              ) : null}
            </View>

            <View style={[styles.copy, isLast && styles.copyLast]}>
              <Text
                variant="bodyMedium"
                color={done ? colors.text : colors.textSubtle}
                lines={1}>
                {step.label}
              </Text>
              <Text
                variant="caption"
                color={done ? colors.textSecondary : colors.textSubtle}
                lines={2}
                accessibilityLabel={done ? step.description : `${step.description}, pending`}>
                {done ? step.description : `Expected: ${step.description}`}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rail: {
    alignItems: 'center',
    width: 28,
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: colors.primary,
  },
  nodePending: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  nodeLast: {
    backgroundColor: colors.success,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: colors.primary,
  },
  linePending: {
    backgroundColor: colors.border,
  },
  copy: {
    flex: 1,
    paddingBottom: spacing.lg,
    gap: 1,
  },
  copyLast: {
    paddingBottom: 0,
  },
  cancelled: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.errorSoft,
  },
  cancelCopy: {
    flex: 1,
  },
});
