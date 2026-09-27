import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProviders } from '@/providers/app-providers';
import { colors } from '@/theme';

/**
 * Root layout.
 *
 * Owns the app-wide singletons (safe-area metrics, gestures, all state
 * providers) so that navigating between screens never remounts them — losing
 * the cart in memory because a tab was re-created would be a real bug.
 *
 * The stack is configured once here rather than per screen: every screen draws
 * its own header, so `headerShown: false` keeps one consistent look and gives
 * full control over back-button placement and safe-area padding.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar style="dark" />
          <View style={styles.root}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.surfaceSunken },
                animation: 'slide_from_right',
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="category/[id]" />
              <Stack.Screen name="checkout/index" />
              <Stack.Screen name="orders/index" />
              <Stack.Screen name="orders/[id]" />
              <Stack.Screen
                name="offers"
                options={{ presentation: 'card', animation: 'slide_from_right' }}
              />
              <Stack.Screen name="favorites" />
              <Stack.Screen name="addresses" />
              <Stack.Screen
                name="order-success/[id]"
                options={{ animation: 'fade' }}
              />
            </Stack>
          </View>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
  },
});
