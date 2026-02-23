import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { Phase1CardValues } from '../screens/GuidedLearning/Phase1CardValues';
import { Phase0BasicStrategy } from '../components/drills/BasicStrategy';
import { Phase2RunningCount } from '../components/drills/RunningCount';
import { Cancellation } from '../components/drills/Cancellation';
import { DeckCountdown } from '../components/drills/DeckCountdown';
import { DrillDiscardTray } from '../components/drills/DrillDiscardTray';
import { DrillDeviations } from '../components/drills/DrillDeviations';
import { Phase3TrueCount } from '../screens/GuidedLearning/Phase3TrueCount';
import { Phase4Betting } from '../screens/GuidedLearning/Phase4Betting';
import { Phase5Deviations } from '../screens/GuidedLearning/Phase5Deviations';
import { SimulatorScreen } from '../screens/Simulator/SimulatorScreen';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                    borderBottomColor: colors.glassBorder,
                    borderBottomWidth: 1,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: colors.accentCyan,
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 17,
                    color: colors.textPrimary,
                },
                cardStyle: { backgroundColor: colors.background },
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Phase1CardValues"
                component={Phase1CardValues}
                options={{
                    title: 'Card Values',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="Phase0BasicStrategy"
                component={Phase0BasicStrategy}
                options={{
                    title: 'Basic Strategy',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="Phase2RunningCount"
                component={Phase2RunningCount}
                options={{
                    title: 'Running Count',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="DrillCancellation"
                component={Cancellation}
                options={{
                    title: 'Speed Drill',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="DrillDeckCountdown"
                component={DeckCountdown}
                options={{
                    title: 'Deck Countdown',
                    headerTitleAlign: 'center',
                    headerShown: false, // We use custom header in component
                }}
            />
            <Stack.Screen
                name="DrillDiscardTray"
                component={DrillDiscardTray}
                options={{
                    title: 'Discard Estimation',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DrillDeviations"
                component={DrillDeviations}
                options={{
                    title: 'Illustrious 18',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Simulator"
                component={SimulatorScreen}
                options={{
                    title: 'Casino Simulator',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Phase3TrueCount"
                component={Phase3TrueCount}
                options={{
                    title: 'Phase 3: True Count',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Phase4Betting"
                component={Phase4Betting}
                options={{
                    title: 'Phase 4: Betting',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Phase5Deviations"
                component={Phase5Deviations}
                options={{
                    title: 'Phase 5: Deviations',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Analytics"
                component={AnalyticsDashboard}
                options={{
                    title: 'Analytics',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Service Record',
                    headerTitleAlign: 'center',
                }}
            />
            <Stack.Screen
                name="Paywall"
                component={PaywallScreen}
                options={{
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
        </Stack.Navigator>
    );
};
