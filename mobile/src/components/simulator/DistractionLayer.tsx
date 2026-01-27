import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { HapticEngine } from '../../utils/HapticEngine';

const { width } = Dimensions.get('window');

type DistractionType = 'WAITRESS' | 'DEALER' | 'PIT_BOSS' | 'NOISE';

interface DistractionEvent {
    id: string;
    type: DistractionType;
    message: string;
    actionLabel?: string;
    duration?: number;
}

export const DistractionLayer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const [currentDistraction, setCurrentDistraction] = useState<DistractionEvent | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Timer refs
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            startDistractionLoop();
        } else {
            stopDistractionLoop();
        }

        return () => stopDistractionLoop();
    }, [isActive]);

    const startDistractionLoop = () => {
        // Random check every 5 seconds
        intervalRef.current = setInterval(() => {
            if (Math.random() > 0.6 && !currentDistraction) { // 40% chance every 5s
                triggerRandomDistraction();
            }
        }, 5000);
    };

    const stopDistractionLoop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        dismissDistraction();
    };

    const triggerRandomDistraction = () => {
        const events: DistractionEvent[] = [
            { id: '1', type: 'WAITRESS', message: 'Cocktails?', actionLabel: 'No Thanks' },
            { id: '2', type: 'DEALER', message: 'Insurance open.', actionLabel: 'Wave Off' },
            { id: '3', type: 'PIT_BOSS', message: 'Pit boss is watching you...', duration: 3000 },
            { id: '4', type: 'NOISE', message: 'High roller cheering nearby!', duration: 2500 },
            { id: '5', type: 'WAITRESS', message: 'Excuse me, is this seat taken?', actionLabel: 'Shoo' },
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];

        setCurrentDistraction(randomEvent);
        HapticEngine.triggerHeatWarning(); // Use warning vibration for distraction

        // Animate In
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Auto dismiss if it has a duration
        if (randomEvent.duration) {
            timeoutRef.current = setTimeout(() => {
                dismissDistraction();
            }, randomEvent.duration);
        }
    };

    const dismissDistraction = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentDistraction(null);
        });
    };

    if (!currentDistraction) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={[styles.popup, getStyleForType(currentDistraction.type)]}>
                <Text style={styles.icon}>{getIconForType(currentDistraction.type)}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.message}>{currentDistraction.message}</Text>
                </View>

                {currentDistraction.actionLabel && (
                    <TouchableOpacity style={styles.actionButton} onPress={dismissDistraction}>
                        <Text style={styles.actionText}>{currentDistraction.actionLabel}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
};

// Helpers
const getStyleForType = (type: DistractionType) => {
    switch (type) {
        case 'WAITRESS': return { borderColor: colors.warning, shadowColor: colors.warning };
        case 'DEALER': return { borderColor: colors.info, shadowColor: colors.info };
        case 'PIT_BOSS': return { borderColor: colors.error, backgroundColor: 'rgba(20,0,0,0.95)', shadowColor: colors.error };
        default: return { borderColor: colors.border, shadowColor: '#000' };
    }
};

const getIconForType = (type: DistractionType) => {
    switch (type) {
        case 'WAITRESS': return '🍸';
        case 'DEALER': return '🃏';
        case 'PIT_BOSS': return '👁️';
        case 'NOISE': return '🎉';
        default: return '⚠️';
    }
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 100,
    },
    popup: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    icon: {
        fontSize: 28,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    message: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginLeft: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
