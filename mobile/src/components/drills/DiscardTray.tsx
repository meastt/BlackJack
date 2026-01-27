import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';

interface DiscardTrayProps {
    totalDecks: number;
    decksDiscarded: number;
    scale?: number; // Scaling factor for visual size
}

export const DiscardTray: React.FC<DiscardTrayProps> = ({
    totalDecks = 6,
    decksDiscarded,
    scale = 1
}) => {
    // Constants for visual representation
    const CARD_THICKNESS = 4 * scale; // Thickness per deck (conceptually)
    const TRAY_HEIGHT = totalDecks * CARD_THICKNESS + 20;
    const CARD_WIDTH = 60 * scale;
    const CARD_HEIGHT = 84 * scale; // Standard ratio

    // Calculate height of the discarded stack
    const stackHeight = decksDiscarded * CARD_THICKNESS * 5; // Multiplier for visual thickness

    return (
        <View style={styles.container}>
            {/* The Tray Holder */}
            <View style={[styles.tray, { height: TRAY_HEIGHT * 5, width: CARD_WIDTH + 20 }]}>
                {/* The Discarded Stack */}
                <View style={[
                    styles.stack,
                    {
                        height: stackHeight,
                        width: CARD_WIDTH,
                        bottom: 4 // Offset from bottom border
                    }
                ]}>
                    {/* Visual details to look like a stack */}
                    <View style={styles.sidePattern} />
                    {decksDiscarded > 0 && <View style={styles.topCard} />}
                </View>
            </View>
            <View style={styles.base} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 20,
    },
    tray: {
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        justifyContent: 'flex-end', // Aligns stack to bottom
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    stack: {
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#CCC',
        position: 'absolute',
    },
    sidePattern: {
        flex: 1,
        backgroundColor: '#EDEDED',
        borderRightWidth: 1,
        borderColor: '#DDD',
        opacity: 0.8,
        // Could add repeating lines for "stack" effect here
    },
    topCard: {
        height: 1,
        width: '100%',
        backgroundColor: '#FFF',
        position: 'absolute',
        top: 0,
    },
    base: {
        height: 10,
        width: 120,
        backgroundColor: '#1A1A1A',
        marginTop: 5,
        borderRadius: 5,
    }
});
