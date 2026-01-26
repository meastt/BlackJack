import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSimState } from '../../store/SimState';
import { colors } from '../../theme/colors';

export const HeatMeter: React.FC = () => {
    const { suspicionLevel } = useSimState();
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate bar width based on percentage
        Animated.timing(widthAnim, {
            toValue: suspicionLevel, // 0 to 100
            duration: 500,
            useNativeDriver: false // Width is layout property
        }).start();
    }, [suspicionLevel]);

    const getBarColor = () => {
        if (suspicionLevel < 30) return colors.accentGreen; // Low heat
        if (suspicionLevel < 70) return '#FFA500'; // Orange/Medium
        return colors.accentRed; // High heat
    };

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>PIT BOSS HEAT</Text>
                <Text style={styles.value}>{suspicionLevel}%</Text>
            </View>
            <View style={styles.track}>
                <Animated.View 
                    style={[
                        styles.bar, 
                        { 
                            width: widthAnim.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%']
                            }),
                            backgroundColor: getBarColor() 
                        }
                    ]} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    value: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    track: {
        height: 10,
        backgroundColor: colors.surfaceLight,
        borderRadius: 5,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 5,
    },
});
