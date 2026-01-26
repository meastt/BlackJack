import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { fontStyles } from '../theme/typography';
import * as Haptics from 'expo-haptics';

interface PhaseIntroModalProps {
    visible: boolean;
    phase: 'phase0' | 'phase1' | 'phase2';
    onStart: () => void;
}

const PHASE_CONTENT = {
    phase0: {
        title: 'Basic Strategy',
        subtitle: 'The Foundation',
        icon: '🧠',
        what: 'Learn the mathematically correct move for every hand combination.',
        why: 'Before you can count cards, you must play perfectly. Basic strategy reduces the house edge to < 0.5%.',
        outcome: 'You will instantly know whether to Hit, Stand, Double, or Split without hesitation.',
    },
    phase1: {
        title: 'Card Values',
        subtitle: 'The Language of Counting',
        icon: '🃏',
        what: 'Assign a value (+1, 0, or -1) to every card in the deck.',
        why: 'Card counting relies on tracking the ratio of high cards to low cards. This system is called Hi-Lo.',
        outcome: 'You will see a card and immediately think of its value, not its rank.',
    },
    phase2: {
        title: 'Running Count',
        subtitle: 'Keeping the Beat',
        icon: '🔢',
        what: 'Maintain a cumulative "Running Count" as cards are dealt from the deck.',
        why: 'A high positive count means the deck is rich in 10s and Aces (favorable for you). A negative count means it is poor.',
        outcome: 'You will be able to track the flow of the game across an entire shoe.',
    },
};

export const PhaseIntroModal: React.FC<PhaseIntroModalProps> = ({ visible, phase, onStart }) => {
    const content = PHASE_CONTENT[phase];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <BlurView intensity={40} tint="dark" style={styles.container}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.icon}>{content.icon}</Text>
                        <Text style={styles.title}>{content.title}</Text>
                        <Text style={styles.subtitle}>{content.subtitle}</Text>
                    </View>

                    <ScrollView style={styles.body}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>What you'll do</Text>
                            <Text style={styles.sectionText}>{content.what}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Why it matters</Text>
                            <Text style={styles.sectionText}>{content.why}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>The Destination</Text>
                            <Text style={styles.sectionText}>{content.outcome}</Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            onStart();
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.startButtonText}>LET'S BEGIN</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        maxHeight: '80%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
        paddingBottom: 20,
    },
    icon: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.accentBlue,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
    },
    body: {
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: 'bold',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    sectionText: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: colors.accentGreen,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.glowGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    startButtonText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
});
