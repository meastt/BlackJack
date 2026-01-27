import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { HeatMeter } from '../../components/simulator/HeatMeter';
import { DistractionLayer } from '../../components/simulator/DistractionLayer';
import { fontStyles } from '../../theme/typography';

import { useSimState } from '../../store/SimState';

export const SimulatorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    // Use global state
    const { setSuspicionLevel } = useSimState();
    const [isDistractionActive, setIsDistractionActive] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Casino Simulator</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Test your skills in a chaotic casino environment.
                    (Distraction Engine: Unlocked soon)
                </Text>

                <View style={styles.meterContainer}>
                    <Text style={styles.label}>PIT BOSS HEAT</Text>
                    <HeatMeter />
                </View>

                {/* Distraction Toggle */}
                <TouchableOpacity
                    style={[styles.simulateButton, isDistractionActive && styles.activeButton]}
                    onPress={() => setIsDistractionActive(!isDistractionActive)}
                >
                    <Text style={styles.buttonText}>
                        {isDistractionActive ? 'Disable Distractions' : 'Enable Chaos Mode'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.simulateButton}
                    onPress={() => setSuspicionLevel((prev: number) => Math.min(prev + 10, 100))}
                >
                    <Text style={styles.buttonText}>Simulate Suspicious Bet (+10%)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.simulateButton, styles.resetButton]}
                    onPress={() => setSuspicionLevel(0)}
                >
                    <Text style={styles.buttonText}>Reset Heat</Text>
                </TouchableOpacity>
            </View>

            <DistractionLayer isActive={isDistractionActive} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
    },
    backButton: {
        marginRight: 20,
    },
    backText: {
        color: colors.accentBlue,
        fontSize: 16,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    description: {
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
        marginTop: 20,
        fontSize: 16,
    },
    meterContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    label: {
        color: colors.textMuted,
        marginBottom: 10,
        letterSpacing: 2,
        fontSize: 12,
        fontWeight: 'bold',
    },
    simulateButton: {
        backgroundColor: colors.surface,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.accent,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    resetButton: {
        borderColor: colors.accentBlue,
    },
    activeButton: {
        backgroundColor: colors.surfaceLight,
        borderColor: colors.accentGreen,
    },
    buttonText: {
        color: colors.textPrimary,
        fontWeight: '600',
    }
});
