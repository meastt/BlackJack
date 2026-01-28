import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

interface TacticalShoeProps {
    remaining: number; // Cards remaining
    total: number;     // Total cards in shoe
    penetration?: number; // Pre-calculated penetration % (optional)
}

export const TacticalShoe: React.FC<TacticalShoeProps> = ({ remaining, total, penetration: propPenetration }) => {
    const percentage = Math.max(0, Math.min(1, remaining / total));
    const calcPenetration = Math.round((1 - percentage) * 100);
    const penetration = propPenetration !== undefined ? propPenetration : calcPenetration;

    // Visual width of the card stack inside the shoe
    const MAX_STACK_WIDTH = 80;
    const stackWidth = percentage * MAX_STACK_WIDTH;

    return (
        <View style={styles.container}>
            {/* 3D Shoe Body - Fixed Symmetry */}
            <View style={[styles.shoeBody, { transform: [{ perspective: 1000 }, { rotateX: '10deg' }] }]}>

                {/* Main Chassis */}
                <LinearGradient
                    colors={['#1a1a1a', '#0a0a0a']}
                    style={styles.chassis}
                >
                    {/* Deck Railing Shadow */}
                    <View style={styles.rail} />

                    {/* Internal Card Stack */}
                    <View style={styles.stackContainer}>
                        {/* The Pusher (Tactical Wedge) */}
                        <View style={styles.pusher}>
                            <View style={styles.pusherDetail} />
                        </View>

                        {/* The actual Cards - Neon Accent */}
                        <LinearGradient
                            colors={['#06b6d4', '#3b82f6']} // Neon Cyan/Blue
                            style={[styles.cardStack, { width: Math.max(2, stackWidth) }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        >
                            {/* Card edge texture */}
                            <View style={styles.edgeTexture}>
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.cardHash,
                                            { left: i * 2 }
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Gloss line */}
                            <View style={styles.stackGloss} />
                        </LinearGradient>
                    </View>

                    {/* Front Dispenser Face */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0.05)', 'transparent']}
                        style={styles.dispenserFace}
                    />
                </LinearGradient>

                {/* Top Perspective Sheen */}
                <View style={styles.topSheen} />
            </View>

            {/* Info HUD - Clean Penetration Only */}
            <View style={styles.hud}>
                <Text style={styles.penText}>
                    {penetration === 0 ? `${remaining} CARDS LEFT` : `${remaining} LEFT (${penetration}%)`}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 180,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 0,
    },
    shoeBody: {
        width: 160,
        height: 50,
        borderRadius: 4,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    chassis: {
        flex: 1,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    rail: {
        position: 'absolute',
        bottom: 8,
        left: 10,
        right: 15,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    stackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    pusher: {
        width: 8,
        height: 34,
        backgroundColor: '#000',
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginRight: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pusherDetail: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    cardStack: {
        height: 28,
        borderRadius: 1,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
    },
    edgeTexture: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        opacity: 0.3,
        flexDirection: 'row',
    },
    cardHash: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    stackGloss: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    dispenserFace: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    topSheen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    hud: {
        position: 'absolute',
        bottom: -5,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    indicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    statusText: {
        color: colors.textPrimary,
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    penText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 5,
        letterSpacing: 1,
    }
});
