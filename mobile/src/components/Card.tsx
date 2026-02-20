import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Card as CardType, Suit, Rank } from '@card-counter-ai/shared';
import { colors, shadows } from '../theme/colors';

interface CardProps {
  card: CardType;
  size?: 'small' | 'medium' | 'large';
  showBack?: boolean;
  showCountImpact?: boolean;
}

const suitSymbols: Record<Suit, string> = {
  [Suit.HEARTS]: '♥',
  [Suit.DIAMONDS]: '♦',
  [Suit.CLUBS]: '♣',
  [Suit.SPADES]: '♠',
};

const suitColors: Record<Suit, string> = {
  [Suit.HEARTS]: colors.hearts,
  [Suit.DIAMONDS]: colors.diamonds,
  [Suit.CLUBS]: colors.clubs,
  [Suit.SPADES]: colors.spades,
};

// Get numeric value for pip count
const getPipCount = (rank: Rank): number => {
  const pipCounts: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  };
  return pipCounts[rank] || 0;
};

const isFaceCard = (rank: Rank): boolean => {
  return ['J', 'Q', 'K'].includes(rank);
};

const isAce = (rank: Rank): boolean => {
  return rank === 'A';
};

const getHiLoValue = (rank: Rank): number => {
  if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) return -1;
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  return 0;
};

// Pip positions for each card (relative positions 0-1)
const getPipPositions = (count: number): { top: number; left: number }[] => {
  const positions: Record<number, { top: number; left: number }[]> = {
    2: [
      { top: 0.2, left: 0.5 },
      { top: 0.8, left: 0.5 },
    ],
    3: [
      { top: 0.2, left: 0.5 },
      { top: 0.5, left: 0.5 },
      { top: 0.8, left: 0.5 },
    ],
    4: [
      { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
      { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
    ],
    5: [
      { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
      { top: 0.5, left: 0.5 },
      { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
    ],
    6: [
      { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
      { top: 0.5, left: 0.25 }, { top: 0.5, left: 0.75 },
      { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
    ],
    7: [
      { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
      { top: 0.35, left: 0.5 },
      { top: 0.5, left: 0.25 }, { top: 0.5, left: 0.75 },
      { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
    ],
    8: [
      { top: 0.2, left: 0.25 }, { top: 0.2, left: 0.75 },
      { top: 0.35, left: 0.5 },
      { top: 0.5, left: 0.25 }, { top: 0.5, left: 0.75 },
      { top: 0.65, left: 0.5 },
      { top: 0.8, left: 0.25 }, { top: 0.8, left: 0.75 },
    ],
    9: [
      { top: 0.15, left: 0.25 }, { top: 0.15, left: 0.75 },
      { top: 0.35, left: 0.25 }, { top: 0.35, left: 0.75 },
      { top: 0.5, left: 0.5 },
      { top: 0.65, left: 0.25 }, { top: 0.65, left: 0.75 },
      { top: 0.85, left: 0.25 }, { top: 0.85, left: 0.75 },
    ],
    10: [
      { top: 0.15, left: 0.25 }, { top: 0.15, left: 0.75 },
      { top: 0.3, left: 0.5 },
      { top: 0.35, left: 0.25 }, { top: 0.35, left: 0.75 },
      { top: 0.65, left: 0.25 }, { top: 0.65, left: 0.75 },
      { top: 0.7, left: 0.5 },
      { top: 0.85, left: 0.25 }, { top: 0.85, left: 0.75 },
    ],
  };
  return positions[count] || [];
};

// Face card symbols
const getFaceSymbol = (rank: Rank): string => {
  const symbols: Record<string, string> = {
    'J': 'J',
    'Q': 'Q',
    'K': 'K',
  };
  return symbols[rank] || '';
};

export const Card: React.FC<CardProps> = ({ card, size = 'medium', showBack = false, showCountImpact = false }) => {
  const cardDimensions = {
    small: { width: 70, height: 98, fontSize: 14, suitSize: 12, pipSize: 10, faceSize: 28, padding: 6 },
    medium: { width: 110, height: 154, fontSize: 20, suitSize: 16, pipSize: 14, faceSize: 40, padding: 8 },
    large: { width: 150, height: 210, fontSize: 28, suitSize: 20, pipSize: 18, faceSize: 56, padding: 10 },
  }[size];

  const { width, height, fontSize, suitSize, pipSize, faceSize, padding } = cardDimensions;

  if (showBack) {
    return (
      <View style={[styles.cardOuter, { width, height }]}>
        <View style={[styles.cardShadow, { width: width, height: height, top: 2, left: 2 }]} />
        <View style={[styles.card, styles.cardBack, { width, height }]}>
          <View style={styles.cardBackInner}>
            {/* Minimalist Logo on back - could be a simple geometric shape */}
            <View style={styles.cardBackDiamond} />
          </View>
        </View>
      </View>
    );
  }

  const suitColor = suitColors[card.suit];
  const suitSymbol = suitSymbols[card.suit];
  const pipCount = getPipCount(card.rank);
  const isFace = isFaceCard(card.rank);

  return (
    <View style={[styles.cardOuter, { width, height }]}>
      {/* Tactical Shadow - sharp offset */}
      <View style={[styles.cardShadow, { width: width, height: height, top: 4, left: 2 }]} />

      {/* Card Surface - Tungsten */}
      <View style={[styles.card, { width, height, padding }]}>

        {/* Top-left corner */}
        <View style={styles.cornerTopLeft}>
          <Text style={[styles.rank, { fontSize, color: suitColor }]}>
            {card.rank}
          </Text>
          <Text style={[styles.cornerSuit, { fontSize: suitSize, color: suitColor }]}>
            {suitSymbol}
          </Text>
        </View>

        {/* Center content */}
        <View style={styles.centerContainer}>
          {isAce(card.rank) ? (
            <Text style={[styles.aceSuit, { fontSize: faceSize * 1.4, color: suitColor }]}>
              {suitSymbol}
            </Text>
          ) : isFace ? (
            <View style={styles.faceCardContainer}>
              <Text style={[styles.faceSymbol, { fontSize: faceSize, color: suitColor, opacity: 0.8 }]}>
                {getFaceSymbol(card.rank)}
              </Text>
              <Text style={[styles.faceSuit, { fontSize: pipSize * 1.5, color: suitColor, opacity: 0.5 }]}>
                {suitSymbol}
              </Text>
            </View>
          ) : (
            <View style={[styles.pipContainer, { width: width - padding * 2 - 30, height: height - padding * 2 - 40 }]}>
              {getPipPositions(pipCount).map((pos, index) => (
                <Text
                  key={index}
                  style={[
                    styles.pip,
                    {
                      fontSize: pipSize,
                      color: suitColor,
                      top: `${pos.top * 100}%`,
                      left: `${pos.left * 100}%`,
                      transform: [
                        { translateX: -pipSize / 2 },
                        { translateY: -pipSize / 2 },
                        ...(pos.top > 0.6 ? [{ rotate: '180deg' }] : []),
                      ],
                    }
                  ]}
                >
                  {suitSymbol}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Bottom-right corner (rotated) */}
        <View style={styles.cornerBottomRight}>
          <Text style={[styles.rank, { fontSize, color: suitColor }]}>
            {card.rank}
          </Text>
          <Text style={[styles.cornerSuit, { fontSize: suitSize, color: suitColor }]}>
            {suitSymbol}
          </Text>
        </View>

        {/* Count Impact Tag Overlay */}
        {showCountImpact && (
          <View style={styles.countImpactContainer}>
            <BlurView intensity={30} tint="dark" style={styles.countImpactBlur}>
              <Text style={[
                styles.countImpactText,
                { fontSize: fontSize * 0.8 },
                getHiLoValue(card.rank) > 0 ? styles.countPos :
                  getHiLoValue(card.rank) < 0 ? styles.countNeg : styles.countNeu
              ]}>
                {getHiLoValue(card.rank) > 0 ? `+${getHiLoValue(card.rank)}` : getHiLoValue(card.rank)}
              </Text>
            </BlurView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.4,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#1a1a1a', // Solid opaque tungsten background
    borderRadius: 8,              // Sharper corners (Radius 8)
    borderColor: colors.surfaceLight, // Graphite border
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 15, // Ensure card renders above table text
    zIndex: 100,
  },
  cardBack: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.borderActive, // Indigo border for back
    borderWidth: 1,
  },
  cardBackInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  cardBackDiamond: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 6,
    left: 8,
    alignItems: 'center',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontWeight: '700', // Bold, chiseled font
    letterSpacing: -0.5,
  },
  cornerSuit: {
    marginTop: -4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  pipContainer: {
    position: 'relative',
  },
  pip: {
    position: 'absolute',
  },
  faceCardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceSymbol: {
    marginBottom: 4,
  },
  faceSuit: {
    marginTop: -8,
  },
  aceSuit: {},
  countImpactContainer: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countImpactBlur: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 40,
    alignItems: 'center',
  },
  countImpactText: {
    fontWeight: '900',
    fontFamily: 'System',
  },
  countPos: { color: colors.success },
  countNeg: { color: colors.error },
  countNeu: { color: colors.textSecondary },
});
