import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RevenueCatService } from './src/services/RevenueCatService';
import { useRevenueCatStore, DEV_UNLOCK_ALL } from './src/store/useRevenueCatStore';

export default function App() {
  useEffect(() => {
    const initRC = async () => {
      await RevenueCatService.init();
      const actualPremiumStatus = await RevenueCatService.checkPremiumStatus();
      if (!DEV_UNLOCK_ALL) {
        useRevenueCatStore.getState().setPremiumStatus(actualPremiumStatus);
      }
      useRevenueCatStore.getState().setInitialized(true);

      const offerings = await RevenueCatService.getOfferings();
      useRevenueCatStore.getState().setOfferings(offerings);
    };

    initRC();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

