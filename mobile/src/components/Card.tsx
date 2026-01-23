import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card as CardType, Suit } from '@card-counter-ai/shared';
import { colors } from '../theme/colors';

interface CardProps {
  card: CardType;
  size?: 'small' | 'medium' | 'large';
  showBack?: boolean;
}

const suitSymbols = {
  [Suit.HEARTS]: '♥',
  [Suit.DIAMONDS]: '♦',
  [Suit.CLUBS]: '♣',
  [Suit.SPADES]: '♠',
};

const suitColors = {
  [Suit.HEARTS]: colors.hearts,
  [Suit.DIAMONDS]: colors.diamonds,
  [Suit.CLUBS]: colors.clubs,
  [Suit.SPADES]: colors.spades,
};

export const Card: React.FC<CardProps> = ({ card, size = 'medium', showBack = false }) => {
  const cardSize = {
    small: { width: 50, height: 70 },
    medium: { width: 70, height: 100 },
    large: { width: 90, height: 130 },
  }[size];

  const fontSize = {
    small: 20,
    medium: 28,
    large: 36,
  }[size];

  if (showBack) {
    return (
      <View style={[styles.card, cardSize, styles.cardBack]}>
        <View style={styles.cardBackPattern} />
      </View>
    );
  }

  const suitColor = suitColors[card.suit];

  return (
    <View style={[styles.card, cardSize]}>
      <View style={styles.cardContent}>
        {/* Top left */}
        <View style={styles.cornerTop}>
          <Text style={[styles.rank, { fontSize, color: suitColor }]}>
            {card.rank}
          </Text>
          <Text style={[styles.suit, { fontSize: fontSize * 0.6, color: suitColor }]}>
            {suitSymbols[card.suit]}
          </Text>
        </View>

        {/* Center */}
        <Text style={[styles.suitCenter, { fontSize: fontSize * 1.5, color: suitColor }]}>
          {suitSymbols[card.suit]}
        </Text>

        {/* Bottom right */}
        <View style={styles.cornerBottom}>
          <Text style={[styles.rank, { fontSize, color: suitColor }]}>
            {card.rank}
          </Text>
          <Text style={[styles.suit, { fontSize: fontSize * 0.6, color: suitColor }]}>
            {suitSymbols[card.suit]}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBack: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackPattern: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cornerTop: {
    alignItems: 'flex-start',
  },
  cornerBottom: {
    alignItems: 'flex-end',
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontWeight: 'bold',
  },
  suit: {
    marginTop: -4,
  },
  suitCenter: {
    textAlign: 'center',
    alignSelf: 'center',
  },
});
