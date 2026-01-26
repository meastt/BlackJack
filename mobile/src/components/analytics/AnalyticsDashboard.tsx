import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { useSimState } from '../../store/SimState';
import { runShadowSession } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 200;
const CHART_WIDTH = SCREEN_WIDTH - 40;

export const AnalyticsDashboard: React.FC = () => {
  const { 
    bankroll, 
    bankrollHistory, 
    evTracking, 
    logicErrors, 
    speedErrors 
  } = useSimState();

  const [simBankroll, setSimBankroll] = useState(bankroll);
  const [ror, setRor] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync sim bankroll with actual bankroll initially
  useEffect(() => {
    setSimBankroll(bankroll);
  }, [bankroll]);

  // Calculate RoR when simBankroll changes
  useEffect(() => {
    calculateRoR();
  }, [simBankroll, logicErrors]); // Logic errors affect errorRate

  const calculateRoR = () => {
    setIsSimulating(true);
    // Debounce or just run? It's synchronous JS loop, might block UI slightly.
    // In a real app, run in Worker or requestAnimationFrame.
    setTimeout(() => {
        // Estimate error rate from logic errors vs total decisions?
        // We don't track total decisions count in SimState explicitly in this snippet (only errors).
        // Let's assume a fixed denominator or estimate.
        // For now, let's say 1 error = 0.5% added to error rate base 0.
        const estErrorRate = Math.min(0.2, logicErrors * 0.01); 

        // Unit bet? Assume $25 unit? Or relative to bankroll?
        // RoR depends on Unit Size relative to Bankroll.
        // Let's assume Unit = Bankroll / 100 for Kelly? No, Unit is fixed usually.
        // Let's assume $10 unit for the simulation default.
        const unitSize = 10;
        
        const result = runShadowSession(simBankroll, unitSize, 10000, estErrorRate);
        setRor(result.probabilityOfRuin);
        setIsSimulating(false);
    }, 100);
  };

  const adjustSimBankroll = (factor: number) => {
      setSimBankroll(prev => Math.floor(prev * factor));
  };

  // Chart Data Preparation
  const chartPath = useMemo(() => {
      if (bankrollHistory.length < 2) return '';
      
      const maxVal = Math.max(...bankrollHistory, bankroll * 1.5);
      const minVal = Math.min(...bankrollHistory, 0); // Allow negative?
      const range = maxVal - minVal || 1;
      
      const points = bankrollHistory.map((val, index) => {
          const x = (index / (bankrollHistory.length - 1)) * CHART_WIDTH;
          const y = CHART_HEIGHT - ((val - minVal) / range) * CHART_HEIGHT;
          return `${x},${y}`;
      });

      return `M ${points.join(' L ')}`;
  }, [bankrollHistory]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics Dashboard</Text>
      
      {/* EV Stats */}
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance EV</Text>
          <View style={styles.row}>
              <View>
                  <Text style={styles.statLabel}>Theoretical Win</Text>
                  <Text style={[styles.statValue, { color: colors.accentGreen }]}>
                      +{evTracking.theoreticalWin.toFixed(1)} Units
                  </Text>
              </View>
              <View>
                  <Text style={styles.statLabel}>Cost of Mistakes</Text>
                  <Text style={[styles.statValue, { color: colors.accentRed }]}>
                      -{evTracking.mistakesCost.toFixed(1)} Units
                  </Text>
              </View>
          </View>
      </View>

      {/* Bankroll Chart */}
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Bankroll Growth</Text>
          <View style={styles.chartContainer}>
            {bankrollHistory.length > 1 ? (
                <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
                    {/* Zero Line if visible */}
                    <Line 
                        x1="0" 
                        y1={CHART_HEIGHT} 
                        x2={CHART_WIDTH} 
                        y2={CHART_HEIGHT} 
                        stroke={colors.border} 
                        strokeWidth="1" 
                    />
                    <Path 
                        d={chartPath} 
                        stroke={colors.accentBlue} 
                        strokeWidth="2" 
                        fill="none" 
                    />
                </Svg>
            ) : (
                <Text style={styles.placeholder}>Not enough history</Text>
            )}
          </View>
          <Text style={styles.currentBankroll}>Current: ${bankroll}</Text>
      </View>

      {/* RoR Simulator */}
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk of Ruin (RoR)</Text>
          <Text style={styles.rorValue}>
              {(ror * 100).toFixed(1)}%
          </Text>
          <Text style={styles.rorSubtitle}>
              Probability of hitting $0 with current play style
          </Text>

          <View style={styles.divider} />
          
          <Text style={styles.label}>What If Analysis: Bankroll</Text>
          <View style={styles.simControls}>
              <TouchableOpacity onPress={() => adjustSimBankroll(0.9)} style={styles.btn}>
                  <Text style={styles.btnText}>-10%</Text>
              </TouchableOpacity>
              
              <Text style={styles.simValue}>${simBankroll}</Text>
              
              <TouchableOpacity onPress={() => adjustSimBankroll(1.1)} style={styles.btn}>
                  <Text style={styles.btnText}>+10%</Text>
              </TouchableOpacity>
          </View>
          <Text style={styles.hint}>
              Adjust bankroll to see how RoR changes based on your simulation stats.
          </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    ...fontStyles.h2,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    ...fontStyles.h3,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  placeholder: {
      color: colors.textMuted,
  },
  currentBankroll: {
      textAlign: 'right',
      color: colors.textPrimary,
      fontWeight: 'bold',
      marginTop: 10,
  },
  rorValue: {
      fontSize: 42,
      fontWeight: 'bold',
      color: colors.accentRed, // High RoR is bad, maybe color scale?
      textAlign: 'center',
  },
  rorSubtitle: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginBottom: 10,
  },
  divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 15,
  },
  label: {
      color: colors.textPrimary,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  simControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  simValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.accentBlue,
  },
  btn: {
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 60,
      alignItems: 'center',
  },
  btnText: {
      color: colors.textPrimary,
      fontWeight: 'bold',
  },
  hint: {
      fontSize: 12,
      color: colors.textMuted,
      fontStyle: 'italic',
  },
});
