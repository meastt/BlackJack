import { Card, Rank } from '@card-counter-ai/shared';

export enum HandStatus {
  ACTIVE = 'active',
  STAND = 'stand',
  BUST = 'bust',
  BLACKJACK = 'blackjack',
  SURRENDER = 'surrender',
}

export enum GamePhase {
  BETTING = 'betting',
  DEALING = 'dealing',
  PLAYER_TURN = 'player_turn',
  DEALER_TURN = 'dealer_turn',
  ROUND_COMPLETE = 'round_complete',
}

export enum HandResult {
  WIN = 'win',
  LOSE = 'lose',
  PUSH = 'push',
  BLACKJACK = 'blackjack',
  SURRENDER = 'surrender',
}

export interface Hand {
  cards: Card[];
  bet: number;
  status: HandStatus;
  result?: HandResult;
  payout?: number;
  isSplit?: boolean;
}

export function getCardNumericValue(rank: Rank): number {
  const rankStr = rank.toString();
  if (rankStr === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rankStr)) return 10;
  return parseInt(rankStr, 10);
}

export function calculateHandValue(cards: Card[]): { value: number; isSoft: boolean } {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    const cardValue = getCardNumericValue(card.rank);
    if (cardValue === 11) {
      aces++;
    }
    value += cardValue;
  }

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  const isSoft = aces > 0;
  return { value, isSoft };
}

export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const { value } = calculateHandValue(cards);
  return value === 21;
}

export function canDoubleDown(hand: Hand): boolean {
  return hand.cards.length === 2 && hand.status === HandStatus.ACTIVE;
}

export function canSplit(hand: Hand, playerHands: Hand[]): boolean {
  if (hand.cards.length !== 2) return false;
  if (hand.status !== HandStatus.ACTIVE) return false;
  if (playerHands.length >= 4) return false; // Max 4 hands

  const rank1 = hand.cards[0].rank.toString();
  const rank2 = hand.cards[1].rank.toString();

  // Can split if same rank OR both are 10-value cards
  if (rank1 === rank2) return true;

  const val1 = getCardNumericValue(hand.cards[0].rank);
  const val2 = getCardNumericValue(hand.cards[1].rank);

  return val1 === 10 && val2 === 10;
}

export function canSurrender(hand: Hand): boolean {
  return hand.cards.length === 2 && hand.status === HandStatus.ACTIVE;
}

export function shouldDealerHit(dealerHand: Card[]): boolean {
  const { value, isSoft } = calculateHandValue(dealerHand);

  // Dealer hits on soft 17
  if (isSoft && value === 17) return true;

  // Dealer hits on anything below 17
  return value < 17;
}

export function determineHandResult(playerHand: Hand, dealerHand: Card[]): {
  result: HandResult;
  payout: number;
} {
  const playerValue = calculateHandValue(playerHand.cards).value;
  const dealerValue = calculateHandValue(dealerHand).value;

  // Check surrender
  if (playerHand.status === HandStatus.SURRENDER) {
    return {
      result: HandResult.SURRENDER,
      payout: playerHand.bet * 0.5,
    };
  }

  // Player bust
  if (playerValue > 21) {
    return {
      result: HandResult.LOSE,
      payout: 0,
    };
  }

  // Player blackjack
  if (isBlackjack(playerHand.cards) && !isBlackjack(dealerHand)) {
    return {
      result: HandResult.BLACKJACK,
      payout: playerHand.bet * 2.5, // 3:2 payout
    };
  }

  // Dealer bust
  if (dealerValue > 21) {
    return {
      result: HandResult.WIN,
      payout: playerHand.bet * 2,
    };
  }

  // Compare values
  if (playerValue > dealerValue) {
    return {
      result: HandResult.WIN,
      payout: playerHand.bet * 2,
    };
  } else if (playerValue < dealerValue) {
    return {
      result: HandResult.LOSE,
      payout: 0,
    };
  } else {
    return {
      result: HandResult.PUSH,
      payout: playerHand.bet, // Return original bet
    };
  }
}

export function getBasicStrategyAction(
  playerHand: Hand,
  dealerUpCard: Card,
  canSplitHand: boolean,
  canDoubleHand: boolean
): string {
  const playerValue = calculateHandValue(playerHand.cards).value;
  const dealerValue = getCardNumericValue(dealerUpCard.rank);
  const { isSoft } = calculateHandValue(playerHand.cards);

  // Check for pair
  if (canSplitHand && playerHand.cards.length === 2) {
    const rank = playerHand.cards[0].rank.toString();

    // Always split Aces and 8s
    if (rank === 'A' || rank === '8') return 'Split';

    // Never split 10s, 5s, 4s
    if (['10', 'J', 'Q', 'K', '5', '4'].some(r => rank === r)) return 'Stand';

    // Split 9s except against 7, 10, A
    if (rank === '9' && ![7, 10, 11].includes(dealerValue)) return 'Split';

    // Split 2s, 3s, 6s, 7s against dealer 2-7
    if (['2', '3', '6', '7'].includes(rank) && dealerValue >= 2 && dealerValue <= 7) {
      return 'Split';
    }
  }

  // Soft hands
  if (isSoft) {
    if (playerValue >= 19) return 'Stand';
    if (playerValue === 18) {
      if (dealerValue >= 9) return 'Hit';
      if (canDoubleHand && dealerValue >= 2 && dealerValue <= 6) return 'Double';
      return 'Stand';
    }
    if (canDoubleHand && playerValue >= 13 && playerValue <= 17 && dealerValue >= 4 && dealerValue <= 6) {
      return 'Double';
    }
    return 'Hit';
  }

  // Hard hands
  if (playerValue >= 17) return 'Stand';
  if (playerValue >= 13 && playerValue <= 16) {
    return dealerValue >= 2 && dealerValue <= 6 ? 'Stand' : 'Hit';
  }
  if (playerValue === 12) {
    return dealerValue >= 4 && dealerValue <= 6 ? 'Stand' : 'Hit';
  }
  if (playerValue === 11) {
    return canDoubleHand ? 'Double' : 'Hit';
  }
  if (playerValue === 10) {
    return canDoubleHand && dealerValue <= 9 ? 'Double' : 'Hit';
  }
  if (playerValue === 9) {
    return canDoubleHand && dealerValue >= 3 && dealerValue <= 6 ? 'Double' : 'Hit';
  }

  return 'Hit';
}
