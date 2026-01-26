import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Card as CardType, Suit, Rank } from '@card-counter-ai/shared';
import { colors } from '../theme/colors';

interface CardProps {
  card: CardType;
  size?: 'small' | 'medium' | 'large';
  showBack?: boolean;
}

const suitSymbols: Record<Suit, string> = {
  [Suit.HEARTS]: '♥',
  [Suit.DIAMONDS]: '♦',
  [Suit.CLUBS]: '♣',
  [Suit.SPADES]: '♠',
};

const suitColors: Record<Suit, string> = {
  [Suit.HEARTS]: colors.accent,
  [Suit.DIAMONDS]: colors.accent,
  [Suit.CLUBS]: colors.accentBlue,
  [Suit.SPADES]: colors.accentBlue,
};

const suitGlows: Record<Suit, string> = {
  [Suit.HEARTS]: colors.glowPink,
  [Suit.DIAMONDS]: colors.glowPink,
  [Suit.CLUBS]: colors.glowCyan,
  [Suit.SPADES]: colors.glowCyan,
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
    'J': '♞', // Knight/horse
    'Q': '♛', // Crown
    'K': '♚', // King crown
  };
  return symbols[rank] || '';
};

export const Card: React.FC<CardProps> = ({ card, size = 'medium', showBack = false }) => {
  const cardDimensions = {
    small: { width: 70, height: 98, fontSize: 14, suitSize: 12, pipSize: 10, faceSize: 28, padding: 6 },
    medium: { width: 110, height: 154, fontSize: 20, suitSize: 16, pipSize: 14, faceSize: 40, padding: 8 },
    large: { width: 150, height: 210, fontSize: 28, suitSize: 20, pipSize: 18, faceSize: 56, padding: 10 },
  }[size];

  const { width, height, fontSize, suitSize, pipSize, faceSize, padding } = cardDimensions;

  if (showBack) {
    return (
      <View style={[styles.cardOuter, { width, height }]}>
        <View style={[styles.cardShadow, { width: width - 4, height: height - 4 }]} />
        <BlurView intensity={40} tint="dark" style={[styles.card, styles.cardBack]}>
          <View style={styles.cardBackInner}>
            <Text style={styles.cardBackPattern}>♠♥♣♦</Text>
          </View>
        </BlurView>
      </View>
    );
  }

  const suitColor = suitColors[card.suit];
  const suitGlow = suitGlows[card.suit];
  const suitSymbol = suitSymbols[card.suit];
  const pipCount = getPipCount(card.rank);
  const isFace = isFaceCard(card.rank);

  return (
    <View style={[styles.cardOuter, { width, height }]}>
      {/* 3D Shadow layer */}
      <View style={[styles.cardShadow, { width: width - 4, height: height - 4 }]} />

      {/* Neon glow behind card */}
      <View style={[styles.neonGlow, { shadowColor: suitGlow }]} />

      {/* Glass card with blur */}
      <BlurView intensity={60} tint="dark" style={[styles.card, { padding }]}>
        {/* Glass overlay */}
        <View style={styles.glassOverlay} />

        {/* Glass highlight at top */}
        <View style={styles.glassHighlight} />

        {/* Top-left corner */}
        <View style={styles.cornerTopLeft}>
          <Text style={[
            styles.rank,
            { fontSize, color: suitColor },
            { textShadowColor: suitGlow, textShadowRadius: 10 }
          ]}>
            {card.rank}
          </Text>
          <Text style={[
            styles.cornerSuit,
            { fontSize: suitSize, color: suitColor },
            { textShadowColor: suitGlow, textShadowRadius: 8 }
          ]}>
            {suitSymbol}
          </Text>
        </View>

        {/* Center content */}
        <View style={styles.centerContainer}>
          {isAce(card.rank) ? (
            // Ace - large centered suit symbol
            <Text style={[
              styles.aceSuit,
              {
                fontSize: faceSize * 1.4,
                color: suitColor + '70',
                textShadowColor: suitGlow,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 15,
              }
            ]}>
              {suitSymbol}
            </Text>
          ) : isFace ? (
            // Face card design
            <View style={styles.faceCardContainer}>
              {/* Face symbol */}
              <Text style={[
                styles.faceSymbol,
                {
                  fontSize: faceSize,
                  color: suitColor + '60',
                  textShadowColor: 'rgba(0, 0, 0, 0.6)',
                  textShadowOffset: { width: 1, height: 2 },
                  textShadowRadius: 3,
                }
              ]}>
                {getFaceSymbol(card.rank)}
              </Text>
              {/* Decorative suit below */}
              <Text style={[
                styles.faceSuit,
                {
                  fontSize: pipSize * 1.5,
                  color: suitColor + '40',
                }
              ]}>
                {suitSymbol}
              </Text>
            </View>
          ) : (
            // Pip layout for number cards
            <View style={[styles.pipContainer, { width: width - padding * 2 - 30, height: height - padding * 2 - 40 }]}>
              {getPipPositions(pipCount).map((pos, index) => (
                <Text
                  key={index}
                  style={[
                    styles.pip,
                    {
                      fontSize: pipSize,
                      color: suitColor + '70',
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowOffset: { width: 0.5, height: 1 },
                      textShadowRadius: 1,
                      top: `${pos.top * 100}%`,
                      left: `${pos.left * 100}%`,
                      transform: [
                        { translateX: -pipSize / 2 },
                        { translateY: -pipSize / 2 },
                        // Flip bottom pips
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
          <Text style={[
            styles.rank,
            { fontSize, color: suitColor },
            { textShadowColor: suitGlow, textShadowRadius: 10 }
          ]}>
            {card.rank}
          </Text>
          <Text style={[
            styles.cornerSuit,
            { fontSize: suitSize, color: suitColor },
            { textShadowColor: suitGlow, textShadowRadius: 8 }
          ]}>
            {suitSymbol}
          </Text>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    bottom: -8,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    transform: [{ skewX: '-3deg' }],
  },
  neonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 25, 0.3)',
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardBack: {
    borderColor: colors.accentPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackInner: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  cardBackPattern: {
    fontSize: 18,
    color: colors.accentPurple,
    opacity: 0.7,
    letterSpacing: 4,
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
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
  },
  cornerSuit: {
    marginTop: -4,
    textShadowOffset: { width: 0, height: 0 },
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  // Number card pips
  pipContainer: {
    position: 'relative',
  },
  pip: {
    position: 'absolute',
  },
  // Face card styles
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
  // Ace - large centered suit
  aceSuit: {
    textShadowOffset: { width: 0, height: 0 },
  },
});
