import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { DrillDeviations } from '../../components/drills/DrillDeviations';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';
import { colors } from '../../theme/colors';

export const Phase5Deviations: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <PhaseIntroModal
                visible={showIntro}
                phase="phase5"
                onStart={() => setShowIntro(false)}
            />

            <DrillDeviations navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
