import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RevenueCatService } from './src/services/RevenueCatService';
import { useRevenueCatStore } from './src/store/useRevenueCatStore';

export default function App() {
  useEffect(() => {
    const initRC = async () => {
      await RevenueCatService.init();
      const isPremium = await RevenueCatService.checkPremiumStatus();
      useRevenueCatStore.getState().setPremiumStatus(isPremium);
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

