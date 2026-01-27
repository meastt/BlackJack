import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSimState } from '../../store/SimState';
import { colors } from '../../theme/colors';

import { HapticEngine } from '../../utils/HapticEngine';

export const HeatMeter: React.FC = () => {
    // Access state via ref or hook if needed, for now using direct props or mock
    // Assuming context is passed or available globally
    // But aligning with previous file structure:
    const { suspicionLevel } = useSimState();

    // Animation for smooth bar transition
    const widthAnim = useRef(new Animated.Value(0)).current;
    const lastHapticLevel = useRef(0);

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: suspicionLevel,
            duration: 800, // Slower, more deliberate "mechanical" movement
            useNativeDriver: false
        }).start();

        // Haptic Feedback Logic:
        // 1. Trigger when first crossing 80
        // 2. Trigger if level increases by 5+ while above 80
        if (suspicionLevel >= 80) {
            if (lastHapticLevel.current < 80 || suspicionLevel >= lastHapticLevel.current + 5) {
                HapticEngine.triggerHeatWarning();
                lastHapticLevel.current = suspicionLevel;
            }
        } else if (suspicionLevel < 80) {
            // Reset state if we drop below danger zone
            lastHapticLevel.current = suspicionLevel;
        }
    }, [suspicionLevel]);

    const getBarColor = () => {
        if (suspicionLevel < 30) return colors.success;   // Safe (Emerald)
        if (suspicionLevel < 60) return colors.info;      // Watchful (Blue)
        if (suspicionLevel < 85) return colors.warning;   // Suspicious (Amber)
        return colors.error;                              // Burned (Red)
    };

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                {/* Background markers for 30%, 60%, 85% thresholds */}
                <View style={[styles.marker, { left: '30%' }]} />
                <View style={[styles.marker, { left: '60%' }]} />
                <View style={[styles.marker, { left: '85%' }]} />

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
            <View style={styles.labelRow}>
                <Text style={styles.value}>{suspicionLevel}% DETECTED</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 4,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    value: {
        color: colors.textTertiary,
        fontSize: 10,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    track: {
        height: 6,
        backgroundColor: colors.surface,
        borderRadius: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
    },
    bar: {
        height: '100%',
        borderRadius: 1,
    },
    marker: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: colors.border,
        zIndex: 1,
    },
});
