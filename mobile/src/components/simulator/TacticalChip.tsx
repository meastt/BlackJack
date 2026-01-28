import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '../../theme/colors';

export type ChipValue = 1 | 5 | 25 | 100 | 500 | 1000;

interface TacticalChipProps {
    value: ChipValue;
    onPress?: (value: ChipValue) => void;
    disabled?: boolean;
    selected?: boolean;
    style?: ViewStyle;
}

const CHIP_CONFIG: Record<ChipValue, { colors: [string, string], accent: string, text: string }> = {
    1: { colors: ['#E5E7EB', '#9CA3AF'], accent: '#F3F4F6', text: '#111827' },
    5: { colors: ['#EF4444', '#991B1B'], accent: '#FCA5A5', text: '#FFFFFF' },
    25: { colors: ['#10B981', '#065F46'], accent: '#6EE7B7', text: '#FFFFFF' },
    100: { colors: ['#1F2937', '#000000'], accent: '#4B5563', text: '#FFFFFF' },
    500: { colors: ['#8B5CF6', '#4C1D95'], accent: '#C4B5FD', text: '#FFFFFF' },
    1000: { colors: ['#F59E0B', '#92400E'], accent: '#FDE68A', text: '#000000' },
};

export const TacticalChip: React.FC<TacticalChipProps> = ({ value, onPress, disabled, selected, style }) => {
    const config = CHIP_CONFIG[value];

    const handlePress = () => {
        if (!disabled && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress(value);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            disabled={disabled}
            style={[
                styles.container,
                selected && styles.selected,
                disabled && styles.disabled,
                style,
            ]}
        >
            <LinearGradient
                colors={config.colors}
                style={styles.chipBody}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Outer Ridges (Tactical Gear Look) */}
                <View style={[styles.ridges, { borderColor: 'rgba(255,255,255,0.1)' }]}>
                    <View style={[styles.innerCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                        <View style={[styles.centerRing, { borderColor: config.accent }]} />
                    </View>
                </View>

                {/* Value Text - Unconstrained */}
                <View style={styles.valueContainer}>
                    <Text style={[styles.valueText, { color: config.text }]}>
                        {value >= 1000 ? '1K' : value}
                    </Text>
                </View>

                {/* Tactical Gloss Overlay */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'transparent']}
                    style={styles.gloss}
                />
            </LinearGradient>

            {/* Selection Glow */}
            {selected && <View style={styles.glow} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 48,
        borderRadius: 24,
        margin: 2,
        ...shadows.md,
    },
    chipBody: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    ridges: {
        width: '90%',
        height: '90%',
        borderRadius: 24,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: '85%',
        height: '85%',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    centerRing: {
        width: '78%',
        height: '78%',
        borderRadius: 24,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        opacity: 0.25,
    },
    valueContainer: {
        position: 'absolute',
        inset: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 18,
        fontWeight: '900',
        fontFamily: 'System',
        letterSpacing: -1,
    },
    gloss: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        opacity: 0.5,
    },
    selected: {
        transform: [{ translateY: -2 }, { scale: 1.05 }],
    },
    glow: {
        position: 'absolute',
        inset: -3,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.primary,
        opacity: 0.5,
        zIndex: -1,
    },
    disabled: {
        opacity: 0.4,
    },
});
