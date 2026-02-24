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

    // Sort packages: MONTHLY → ANNUAL → LIFETIME
    const packageOrder = ['MONTHLY', 'ANNUAL', 'LIFETIME'];
    const displayPackages = offerings.length > 0
        ? [...offerings].sort((a, b) => packageOrder.indexOf(a.packageType) - packageOrder.indexOf(b.packageType))
        : [];

    const getPackageLabel = (type: string) => {
        switch (type) {
            case 'MONTHLY': return 'MONTHLY';
            case 'ANNUAL': return 'ANNUAL';
            case 'LIFETIME': return 'LIFETIME';
            default: return type;
        }
    };

    const getPackageSublabel = (type: string) => {
        switch (type) {
            case 'MONTHLY': return 'per month';
            case 'ANNUAL': return '$2.08 / mo · billed annually';
            case 'LIFETIME': return 'one-time payment';
            default: return '';
        }
    };

    const getPackageDescription = (type: string) => {
        switch (type) {
            case 'MONTHLY': return 'Cancel anytime.';
            case 'ANNUAL': return 'Save over 58% vs monthly.';
            case 'LIFETIME': return 'Pay once, master advantage play forever.';
            default: return '';
        }
    };

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
                                        {getPackageLabel(pkg.packageType)}
                                    </Text>
                                    {pkg.packageType === 'ANNUAL' && (
                                        <View style={styles.bestValueBadge}>
                                            <Text style={styles.bestValueText}>BEST VALUE</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.packagePrice, isSelected && styles.textSelected]}>
                                    {pkg.product.priceString}
                                </Text>
                                <Text style={styles.packageSublabel}>
                                    {getPackageSublabel(pkg.packageType)}
                                </Text>
                                <Text style={styles.packageDescription}>
                                    {getPackageDescription(pkg.packageType)}
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
        padding: 20,
        paddingBottom: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
        marginTop: 10,
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
        marginBottom: 20,
        backgroundColor: colors.surface,
        padding: 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 20,
    },
    packageCard: {
        backgroundColor: colors.surface,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        marginBottom: 12,
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
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    packageSublabel: {
        fontSize: 12,
        color: colors.textSecondary,
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
        marginBottom: 12,
    },
    restoreLink: {
        padding: 6,
        marginBottom: 4,
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
