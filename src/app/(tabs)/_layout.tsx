import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type LucideIconName } from '@/components/ui/icon';
import { PressScale } from '@/components/ui/press-scale';
import { Text } from '@/components/ui/text';
import { useCart } from '@/providers/cart-provider';
import { badgePopScale, colors, hairline, layout, radius, spacing, spring } from '@/theme';

type TabConfig = {
  name: string;
  title: string;
  icon: LucideIconName;
};

const TABS: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'house' },
  { name: 'categories', title: 'Browse', icon: 'layout-grid' },
  { name: 'search', title: 'Search', icon: 'search' },
  { name: 'cart', title: 'Cart', icon: 'shopping-bag' },
  { name: 'profile', title: 'Profile', icon: 'user-round' },
];

/**
 * Bottom tab bar.
 *
 * Custom-drawn rather than relying on the default bar alone, for two reasons:
 * the cart badge can pop when the count changes, and the active label fades in
 * rather than snapping. Both make the bar feel responsive at very little cost.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.surfaceSunken },
      }}
      tabBar={(props) => <TabBar {...props} bottomInset={insets.bottom} />}>
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}

function TabBar({ state, navigation, bottomInset }: BottomTabBarProps & { bottomInset: number }) {
  const cart = useCart();
  const safeBottom = Math.max(bottomInset, spacing.sm);

  return (
    <View
      style={[
        styles.bar,
        { height: layout.tabBarHeight + safeBottom, paddingBottom: safeBottom },
      ]}>
      {state.routes.map((route, index) => {
        const config = TABS.find((tab) => tab.name === route.name);
        if (!config) return null;

        const isCart = route.name === 'cart';

        return (
          <TabButton
            key={route.key}
            config={config}
            focused={state.index === index}
            onPress={() => navigation.navigate(route.name, route.params)}
            badge={isCart ? cart.totalQuantity : 0}
            badgeRevision={isCart ? cart.revision : 0}
          />
        );
      })}
    </View>
  );
}

function TabButton({
  config,
  focused,
  onPress,
  badge,
  badgeRevision,
}: {
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
  badge: number;
  badgeRevision: number;
}) {
  const color = focused ? colors.primary : colors.textMuted;
  const emphasis = useSharedValue(focused ? 1 : 0);
  const pop = useSharedValue(1);

  useEffect(() => {
    emphasis.value = withTiming(focused ? 1 : 0, { duration: 160 });
  }, [emphasis, focused]);

  // Pops once per cart mutation, then settles. `revision` is read here purely
  // to re-trigger the animation when the count changes.
  useEffect(() => {
    if (badgeRevision === 0) return;
    pop.value = withSequence(withSpring(badgePopScale, spring), withSpring(1, spring));
  }, [badgeRevision, pop]);

  const labelStyle = useAnimatedStyle(() => ({ opacity: 0.6 + emphasis.value * 0.4 }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  return (
    <View style={styles.tab}>
      <PressScale
        onPress={onPress}
        scaleTo={0.9}
        haptic="selection"
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={badge > 0 ? `${config.title}, ${badge} items in cart` : config.title}
        style={styles.pressable}>
        <View style={styles.iconWrap}>
          <Icon name={config.icon} size={22} color={color} />

          {badge > 0 ? (
            <Animated.View style={[styles.badge, badgeStyle]} pointerEvents="none">
              <Text variant="discount" color={colors.textOnPrimary} lines={1}>
                {badge > 9 ? '9+' : badge}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        <Animated.View style={labelStyle}>
          <Text variant="caption" color={color} lines={1}>
            {config.title}
          </Text>
        </Animated.View>
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: hairline(1),
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: spacing.sm,
  },
  iconWrap: {
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
