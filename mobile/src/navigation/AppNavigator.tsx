import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { Phase1CardValues } from '../screens/GuidedLearning/Phase1CardValues';
import { Phase0BasicStrategy } from '../screens/GuidedLearning/Phase0BasicStrategy';
import { Phase2RunningCount } from '../screens/GuidedLearning/Phase2RunningCount';
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
                headerTintColor: colors.accentBlue,
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
        </Stack.Navigator>
    );
};
