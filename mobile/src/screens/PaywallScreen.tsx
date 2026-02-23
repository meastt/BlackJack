import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { colors } from '../theme/colors';
import { fontStyles } from '../theme/typography';
import { Button } from '../components/Button';
import { useRevenueCatStore } from '../store/useRevenueCatStore';
import { RevenueCatService } from '../services/RevenueCatService';
import { PurchasesPackage } from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

export const PaywallScreen = () => {
    const navigation = useNavigation();
    const { offerings, isPremium } = useRevenueCatStore();
    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);

    const handlePurchase = async () => {
        if (!selectedPackage) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);

        const success = await RevenueCatService.purchasePackage(selectedPackage);

        setLoading(false);

        if (success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack(); // Return to previous screen after successful purchase
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleRestore = async () => {
        setLoading(true);
        const success = await RevenueCatService.restorePurchases();
        setLoading(false);

        if (success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    if (isPremium) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.title}>You are already a Pro Counter.</Text>
                <Button title="Return" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    // Find monthly and lifetime packages typically
    const monthlyPackage = offerings.find(p => p.packageType === 'MONTHLY');
    const lifetimePackage = offerings.find(p => p.packageType === 'LIFETIME');

    // Fallback if packages aren't loaded yet
    const displayPackages = offerings.length > 0 ? offerings : [];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.badge}>ENCRYPTED ACCESS</Text>
                    <Text style={styles.title}>UNLOCK PRO</Text>
                    <Text style={styles.subtitle}>Complete the Advantage Play Arsenal.</Text>
                </View>

                <View style={styles.benefitsContainer}>
                    <BenefitItem icon="🔓" text="Unlock Phases 1-5 (Running Count, True Count, Deviations)" />
                    <BenefitItem icon="⚡️" text="Specialized Drills (Speed, Deck Countdown, Discards)" />
                    <BenefitItem icon="🎰" text="Chaos Mode Simulator (6-8 Decks, Heat Meter, Distractions)" />
                    <BenefitItem icon="📊" text="Advanced Analytics & Ev Tracking" />
                    <BenefitItem icon="✈️" text="Full offline capability for practice anywhere" />
                </View>

                <View style={styles.packagesContainer}>
                    {displayPackages.map((pkg) => {
                        const isSelected = selectedPackage?.identifier === pkg.identifier;
                        return (
                            <TouchableOpacity
                                key={pkg.identifier}
                                style={[styles.packageCard, isSelected && styles.packageCardSelected]}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSelectedPackage(pkg);
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={styles.packageHeader}>
                                    <Text style={[styles.packageTitle, isSelected && styles.textSelected]}>
                                        {pkg.packageType === 'LIFETIME' ? 'LIFETIME ACCESS' : 'MONTHLY SUBSCRIPTION'}
                                    </Text>
                                    {pkg.packageType === 'LIFETIME' && (
                                        <View style={styles.bestValueBadge}>
                                            <Text style={styles.bestValueText}>BEST VALUE</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.packagePrice, isSelected && styles.textSelected]}>
                                    {pkg.product.priceString}
                                </Text>
                                <Text style={styles.packageDescription}>
                                    {pkg.packageType === 'LIFETIME' ? 'Pay once, master advantage play forever.' : 'Cancel anytime.'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    {displayPackages.length === 0 && (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
                    )}
                </View>

                <View style={styles.footer}>
                    <Button
                        title={loading ? "Processing..." : "UNLOCK NOW"}
                        onPress={handlePurchase}
                        variant="accent"
                        size="large"
                        disabled={!selectedPackage || loading}
                        style={styles.purchaseButton}
                    />

                    <TouchableOpacity onPress={handleRestore} style={styles.restoreLink} disabled={loading}>
                        <Text style={styles.restoreText}>Restore Purchases</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelLink} disabled={loading}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const BenefitItem = ({ icon, text }: { icon: string; text: string }) => (
    <View style={styles.benefitRow}>
        <View style={styles.benefitIconBox}>
            <Text style={styles.benefitIcon}>{icon}</Text>
        </View>
        <Text style={styles.benefitText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 60,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
        marginTop: 20,
    },
    badge: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        ...fontStyles.h1,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
    benefitsContainer: {
        marginBottom: 40,
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    benefitIconBox: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    benefitIcon: {
        fontSize: 16,
    },
    benefitText: {
        color: '#FFFFFF',
        fontSize: 13,
        flex: 1,
        lineHeight: 18,
    },
    packagesContainer: {
        marginBottom: 40,
    },
    packageCard: {
        backgroundColor: colors.surface,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 20,
        marginBottom: 16,
    },
    packageCardSelected: {
        borderColor: colors.primary,
        backgroundColor: '#0a0a0a',
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    packageTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: colors.textSecondary,
        letterSpacing: 1.5,
    },
    bestValueBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
    },
    bestValueText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: '900',
    },
    textSelected: {
        color: colors.primary,
    },
    packagePrice: {
        fontSize: 24,
        fontWeight: 'BOLD',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    packageDescription: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    footer: {
        alignItems: 'center',
    },
    purchaseButton: {
        width: '100%',
        marginBottom: 20,
    },
    restoreLink: {
        padding: 10,
        marginBottom: 10,
    },
    restoreText: {
        color: colors.textSecondary,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    cancelLink: {
        padding: 10,
    },
    cancelText: {
        color: colors.textTertiary,
        fontSize: 14,
    }
});
