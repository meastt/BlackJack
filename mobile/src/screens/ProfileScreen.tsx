import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useProgressStore } from '../store/useProgressStore';
import { colors } from '../theme/colors';

const THEME = { colors };

// Temporary Mock Badge Database
const BADGE_DB = [
    { id: 'first_blood', name: 'First Blood', description: 'Perfect Basic Strategy shoe.', icon: '🎯' },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Under 30s Deck Countdown.', icon: '⚡' },
    { id: 'the_ghost', name: 'The Ghost', description: '7-Day Practice Streak.', icon: '👻' },
    { id: 'true_master', name: 'True Master', description: 'Phase 3 Perfect Run.', icon: '👑' },
];

export function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const {
        totalXP,
        currentStreak,
        badges,
        dailyMissions,
        getCurrentLevel,
        checkDailyMissions
    } = useProgressStore();

    const { level, title, nextLevelXP, progress } = getCurrentLevel();

    // Trigger daily missions check on mount
    useEffect(() => {
        checkDailyMissions();
    }, [checkDailyMissions]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
            {/* Header / Clearance Level */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.subtitle}>SERVICE RECORD</Text>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.levelContainer}>
                    <Text style={styles.levelText}>LVL {level}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.xpText}>{totalXP} / {nextLevelXP} XP</Text>
                </View>

                <View style={styles.streakBadge}>
                    <Text style={styles.streakText}>🔥 {currentStreak} Day Streak</Text>
                </View>
            </View>

            {/* Daily Missions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DAILY BRIEFING</Text>
                {dailyMissions.map((mission) => (
                    <View key={mission.id} style={[styles.missionCard, mission.completed && styles.missionCardCompleted]}>
                        <View style={styles.missionHeader}>
                            <Text style={[styles.missionTitle, mission.completed && styles.missionTextCompleted]}>
                                {mission.title}
                            </Text>
                            <Text style={styles.missionReward}>+{mission.xpReward} XP</Text>
                        </View>
                        <Text style={styles.missionDescription}>{mission.description}</Text>

                        <View style={styles.missionProgressContainer}>
                            <View style={styles.missionProgressBarBg}>
                                <View style={[styles.missionProgressBarFill, { width: `${(mission.progress / mission.target) * 100}%` }, mission.completed && { backgroundColor: THEME.colors.accentCyan }]} />
                            </View>
                            <Text style={styles.missionProgressText}>{mission.progress} / {mission.target}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Achievement Badges */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ACCOLADES</Text>
                <View style={styles.badgeGrid}>
                    {BADGE_DB.map((badge) => {
                        const isUnlocked = badges.includes(badge.id);
                        return (
                            <View key={badge.id} style={[styles.badgeContainer, !isUnlocked && styles.badgeLocked]}>
                                <View style={[styles.badgeIconBg, isUnlocked && styles.badgeIconBgUnlocked]}>
                                    <Text style={[styles.badgeIcon, !isUnlocked && styles.badgeIconLocked]}>{badge.icon}</Text>
                                </View>
                                <Text style={[styles.badgeName, !isUnlocked && styles.badgeNameLocked]}>{badge.name}</Text>
                                <Text style={styles.badgeDescription}>{badge.description}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '800',
        color: THEME.colors.primary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: THEME.colors.textPrimary,
        letterSpacing: 1,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    levelContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    levelText: {
        fontSize: 16,
        fontWeight: '700',
        color: THEME.colors.accentCyan,
        marginBottom: 8,
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: THEME.colors.accentCyan,
        borderRadius: 3,
    },
    xpText: {
        fontSize: 12,
        color: THEME.colors.textTertiary,
        fontWeight: '600',
    },
    streakBadge: {
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 149, 0, 0.3)',
    },
    streakText: {
        color: '#FF9500',
        fontWeight: '700',
        fontSize: 14,
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: THEME.colors.textTertiary,
        letterSpacing: 2,
        marginBottom: 16,
    },
    missionCard: {
        backgroundColor: THEME.colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    missionCardCompleted: {
        borderColor: THEME.colors.primary,
        backgroundColor: 'rgba(255, 45, 124, 0.05)',
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    missionTitle: {
        color: THEME.colors.textPrimary,
        fontWeight: '700',
        fontSize: 16,
    },
    missionTextCompleted: {
        color: THEME.colors.primary,
    },
    missionReward: {
        color: THEME.colors.accentCyan,
        fontWeight: '800',
        fontSize: 14,
    },
    missionDescription: {
        color: THEME.colors.textSecondary,
        fontSize: 13,
        marginBottom: 12,
    },
    missionProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    missionProgressBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    missionProgressBarFill: {
        height: '100%',
        backgroundColor: THEME.colors.primary,
        borderRadius: 2,
    },
    missionProgressText: {
        color: THEME.colors.textTertiary,
        fontSize: 12,
        fontWeight: '600',
        width: 40,
        textAlign: 'right',
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    badgeContainer: {
        width: '48%',
        backgroundColor: THEME.colors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    badgeLocked: {
        opacity: 0.5,
    },
    badgeIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 45, 124, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: THEME.colors.primary,
    },
    badgeIconBgUnlocked: {
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        borderColor: THEME.colors.accentCyan,
        shadowColor: THEME.colors.accentCyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    badgeIcon: {
        fontSize: 24,
    },
    badgeIconLocked: {
        opacity: 0.2,
    },
    badgeName: {
        color: THEME.colors.textPrimary,
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    },
    badgeNameLocked: {
        color: THEME.colors.textTertiary,
    },
    badgeDescription: {
        color: THEME.colors.textSecondary,
        fontSize: 11,
        textAlign: 'center',
    },
});
