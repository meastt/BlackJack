import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { Phase1CardValues } from '../screens/GuidedLearning/Phase1CardValues';
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
        </Stack.Navigator>
    );
};
