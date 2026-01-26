import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
import { useSimState } from '../../store/SimState';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';

export const Certification: React.FC = () => {
    const { 
        certificationStatus, 
        challengeStats, 
        isProMode, 
        toggleProMode, 
        startChallenge, 
        completeChallenge 
    } = useSimState();

    const [showSuccess, setShowSuccess] = useState(false);
    const [rubric, setRubric] = useState<{ failReason: string; improvementTip: string } | null>(null);
    const [showFail, setShowFail] = useState(false);

    const handleStart = () => {
        Alert.alert(
            "Start Pro Challenge?",
            "You must complete 2 full shoes (approx 200 hands) with PERFECT counting and >98% decision accuracy. No Red Heat allowed.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Start", onPress: () => startChallenge() }
            ]
        );
    };

    const handleFinish = () => {
        const result = completeChallenge();
        if (result.success) {
            setShowSuccess(true);
        } else {
            setRubric(result.rubric);
            setShowFail(true);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Certification</Text>
                <View style={[styles.badge, certificationStatus === 'PRO' ? styles.badgePro : styles.badgeRookie]}>
                    <Text style={styles.badgeText}>{certificationStatus}</Text>
                </View>
            </View>

            {/* Pro Mode Toggle */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.sectionTitle}>Pro Mode</Text>
                        <Text style={styles.subtitle}>Casino Chaos (Audio/Distractions)</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.toggle, isProMode ? styles.toggleOn : styles.toggleOff]}
                        onPress={toggleProMode}
                    >
                        <View style={[styles.thumb, isProMode ? styles.thumbOn : styles.thumbOff]} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Challenge Card */}
            <View style={styles.challengeCard}>
                <Text style={styles.cardTitle}>The Pro Challenge</Text>
                <Text style={styles.criteria}>
                    • 2 Full 6-Deck Shoes{'\n'}
                    • 100% Counting Accuracy{'\n'}
                    • 98%+ Decision Accuracy{'\n'}
                    • No Heat Spikes ({'>'}80%)
                </Text>

                {challengeStats.isActive ? (
                    <View style={styles.activeStats}>
                        <Text style={styles.stat}>Shoes: {challengeStats.shoesCompleted}/2</Text>
                        <Text style={styles.stat}>Hands: {challengeStats.totalHands}</Text>
                        <Text style={styles.stat}>Errors: {challengeStats.decisionErrors}</Text>
                        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
                            <Text style={styles.btnText}>Finish / Claim</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.startBtn} 
                        onPress={handleStart}
                        disabled={certificationStatus === 'PRO'}
                    >
                        <Text style={styles.btnText}>
                            {certificationStatus === 'PRO' ? 'Certified' : 'Start Challenge'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Success Modal */}
            <Modal visible={showSuccess} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>CONGRATULATIONS!</Text>
                        <Text style={styles.modalText}>You have earned PRO Certification.</Text>
                        <View style={styles.certBadge}>
                             <Text style={styles.certText}>PRO CARD COUNTER</Text>
                        </View>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowSuccess(false)}>
                            <Text style={styles.btnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* Failure/Rubric Modal */}
            <Modal visible={showFail} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.failContent]}>
                        <Text style={[styles.modalTitle, styles.failTitle]}>Challenge Failed</Text>
                        
                        <View style={styles.rubricBox}>
                            <Text style={styles.rubricLabel}>DIAGNOSTIC REPORT</Text>
                            <Text style={styles.rubricReason}>{rubric?.failReason}</Text>
                        </View>
                        
                        <View style={styles.tipBox}>
                             <Text style={styles.tipLabel}>COACHING TIP:</Text>
                             <Text style={styles.tipText}>{rubric?.improvementTip}</Text>
                        </View>

                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowFail(false)}>
                            <Text style={styles.btnText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        ...fontStyles.h1,
        color: colors.textPrimary,
    },
    badge: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeRookie: {
        borderColor: colors.textMuted,
        backgroundColor: colors.surfaceLight,
    },
    badgePro: {
        borderColor: colors.accentGreen,
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
    },
    badgeText: {
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    toggle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 2,
    },
    toggleOn: { backgroundColor: colors.accentBlue },
    toggleOff: { backgroundColor: colors.surfaceLight },
    thumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'white',
    },
    thumbOn: { alignSelf: 'flex-end' },
    thumbOff: { alignSelf: 'flex-start' },
    
    challengeCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.accent,
        shadowColor: colors.accent,
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.accent,
        marginBottom: 15,
        textAlign: 'center',
    },
    criteria: {
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: 25,
    },
    startBtn: {
        backgroundColor: colors.accent,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    finishBtn: {
        backgroundColor: colors.accentGreen,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    btnText: {
        color: '#FFF', // textOnPrimary
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeStats: {
        gap: 10,
    },
    stat: {
        color: colors.textPrimary,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface,
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        borderWidth: 2,
        borderColor: colors.accentGreen,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.accentGreen,
        marginBottom: 10,
    },
    modalText: {
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
    },
    certBadge: {
        width: 200,
        height: 120,
        backgroundColor: '#222',
        borderWidth: 4,
        borderColor: 'gold',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    certText: {
        color: 'gold',
        fontWeight: 'bold',
        fontSize: 18,
    },
    closeBtn: {
        padding: 10,
        backgroundColor: colors.surfaceLight,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    failContent: {
        borderColor: colors.accentRed,
    },
    failTitle: {
        color: colors.accentRed,
    },
    rubricBox: {
        width: '100%',
        backgroundColor: 'rgba(255,0,0,0.1)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: colors.accentRed,
    },
    rubricLabel: {
        fontSize: 12,
        color: colors.accentRed,
        fontWeight: 'bold',
        marginBottom: 5,
        letterSpacing: 1,
    },
    rubricReason: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    tipBox: {
        width: '100%',
        marginBottom: 25,
    },
    tipLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    tipText: {
        color: colors.textPrimary,
        fontSize: 16,
        lineHeight: 22,
        fontStyle: 'italic',
    },
});
