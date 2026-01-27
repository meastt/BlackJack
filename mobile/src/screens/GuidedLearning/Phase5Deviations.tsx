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
                onClose={() => setShowIntro(false)}
                title="Phase 5: Deviations"
                description="Master the Illustrious 18 - strategy deviations based on the True Count. These plays override Basic Strategy when the count is favorable."
                objectives={[
                    'Learn when to deviate from Basic Strategy',
                    'Memorize the top 5 Illustrious 18 plays',
                    'Pass 3 consecutive sessions at 90%+ accuracy',
                ]}
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
