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
        case 'WAITRESS': return { borderColor: colors.accentYellow };
        case 'DEALER': return { borderColor: colors.accentBlue };
        case 'PIT_BOSS': return { borderColor: colors.accent, backgroundColor: 'rgba(50,0,0,0.9)' };
        default: return { borderColor: colors.border };
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
        top: 100, // Positioned near top where dealer would be
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 100,
    },
    popup: {
        flexDirection: 'row',
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        padding: 15,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    icon: {
        fontSize: 32,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    message: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    actionText: {
        color: colors.accentBlue,
        fontWeight: 'bold',
        fontSize: 14,
    }
});
