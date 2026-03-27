import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { useSimState } from '../../store/SimState';
import { runShadowSession } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { MetricChip } from '../metrics/MetricChip';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = 200;
const CHART_WIDTH = SCREEN_WIDTH - 40;

export const AnalyticsDashboard: React.FC = () => {
  const {
    edgeScore,
    edgeHistory,
    evTracking,
    metrics,
    getReadinessTier,
    logicErrors,
    speedErrors
  } = useSimState();

  const [simBankroll, setSimBankroll] = useState(edgeScore);
  const [ror, setRor] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const readinessTier = getReadinessTier();

  useEffect(() => {
    setSimBankroll(edgeScore);
  }, [edgeScore]);

  useEffect(() => {
    calculateRoR();
  }, [simBankroll, logicErrors]);

  const calculateRoR = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const estErrorRate = Math.min(0.2, logicErrors * 0.01);
      const unitSize = 10;
      const result = runShadowSession(simBankroll, unitSize, 10000, estErrorRate);
      setRor(result.probabilityOfRuin);
      setIsSimulating(false);
    }, 100);
  };

  const adjustSimBankroll = (factor: number) => {
    setSimBankroll(prev => Math.floor(prev * factor));
  };

  const chartPath = useMemo(() => {
    if (edgeHistory.length < 2) return '';
    const maxVal = Math.max(...edgeHistory, edgeScore * 1.2);
    const minVal = Math.min(...edgeHistory, 0);
    const range = maxVal - minVal || 1;
    const points = edgeHistory.map((val, index) => {
      const x = (index / (edgeHistory.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((val - minVal) / range) * CHART_HEIGHT;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }, [edgeHistory, edgeScore]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ANALYTICS // EDGE PERFORMANCE</Text>

      {/* Edge Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>EDGE QUALITY TRACKING</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.statLabel}>EDGE_CAPTURED</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              +{evTracking.theoreticalWin.toFixed(1)} UNITS
            </Text>
          </View>
          <View>
            <Text style={styles.statLabel}>ERROR_COST</Text>
            <Text style={[styles.statValue, { color: colors.error }]}>
              -{evTracking.mistakesCost.toFixed(1)} UNITS
            </Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <MetricChip label="TIER" value={readinessTier} />
          <MetricChip label="INTEGRITY" value={`${metrics.countIntegrity}%`} />
          <MetricChip label="LATENCY" value={`${metrics.decisionLatencyMs}ms`} />
        </View>
      </View>

      {/* Edge Trajectory */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>EDGE_TRAJECTORY</Text>
        <View style={styles.chartContainer}>
          {edgeHistory.length > 1 ? (
            <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
              <Line x1="0" y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} stroke={colors.border} strokeWidth="1" />
              <Path d={chartPath} stroke={colors.primary} strokeWidth="2" fill="none" />
            </Svg>
          ) : (
            <Text style={styles.placeholder}>[ INSUFFICIENT DATA ]</Text>
          )}
        </View>
        <Text style={styles.currentBankroll}>ACTIVE EDGE SCORE: {edgeScore.toFixed(0)}</Text>
      </View>

      {/* RoR Simulator */}
      <View style={[styles.card, { borderColor: ror > 0.1 ? colors.error : colors.border }]}>
        <Text style={styles.cardTitle}>RISK_OF_RUIN_ESTIMATE</Text>
        <Text style={[styles.rorValue, { color: ror > 0.1 ? colors.error : colors.primary }]}>
          {(ror * 100).toFixed(1)}%
        </Text>
        <Text style={styles.rorSubtitle}>Probability of edge collapse at active decision error-rate</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>WHAT-IF ANALYSIS // EDGE RESILIENCE</Text>
        <View style={styles.simControls}>
          <TouchableOpacity onPress={() => adjustSimBankroll(0.9)} style={styles.btn}>
            <Text style={styles.btnText}>-10%</Text>
          </TouchableOpacity>
          <Text style={styles.simValue}>{simBankroll.toFixed(0)}</Text>
          <TouchableOpacity onPress={() => adjustSimBankroll(1.1)} style={styles.btn}>
            <Text style={styles.btnText}>+10%</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Adjust edge capital assumptions to recalculate resilience against error drift.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 2,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textSecondary,
    marginBottom: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 6,
    fontWeight: '800',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  chartContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 2,
  },
  placeholder: {
    color: colors.textTertiary,
    fontSize: 11,
    letterSpacing: 2,
  },
  currentBankroll: {
    textAlign: 'right',
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    marginTop: 12,
    letterSpacing: 1,
  },
  rorValue: {
    fontSize: 56,
    fontWeight: '900',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  rorSubtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 10,
    letterSpacing: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
    opacity: 0.5,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  simControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.surfaceDark,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  simValue: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  btn: {
    backgroundColor: colors.surface,
    width: 60,
    height: 48,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: colors.textPrimary,
    fontWeight: '900',
    fontSize: 14,
  },
  hint: {
    fontSize: 10,
    color: colors.textTertiary,
    lineHeight: 15,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
});
