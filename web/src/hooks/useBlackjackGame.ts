'use client';

import { useState, useCallback } from 'react';
import { Shoe, Card, CardCountingEngine, CountingSystem } from '@card-counter-ai/shared';
import {
  Hand,
  HandStatus,
  GamePhase,
  calculateHandValue,
  isBlackjack,
  shouldDealerHit,
  determineHandResult,
  canDoubleDown,
  canSplit,
  canSurrender,
} from '@/lib/simulator/blackjack';

export interface GameSettings {
  deckCount: number;
  showCountValues: boolean;
  showRunningCount: boolean;
  showTrueCount: boolean;
  showDecksRemaining: boolean;
  showBettingRecommendation: boolean;
  showBasicStrategy: boolean;
  countingSystem: CountingSystem;
  penetration: number; // Percentage of shoe to deal (0.75 = 75%)
}

interface GameState {
  shoe: Shoe | null;
  countingEngine: CardCountingEngine | null;
  playerHands: Hand[];
  dealerHand: Card[];
  currentHandIndex: number;
  phase: GamePhase;
  bankroll: number;
  currentBet: number;
  settings: GameSettings;
  roundCount: number;
  cutCardReached: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  deckCount: 6,
  showCountValues: false,
  showRunningCount: false,
  showTrueCount: false,
  showDecksRemaining: false,
  showBettingRecommendation: false,
  showBasicStrategy: false,
  countingSystem: CountingSystem.HI_LO,
  penetration: 0.75,
};

const INITIAL_BANKROLL = 10000;
const MIN_BET = 0;

export function useBlackjackGame() {
  const [state, setState] = useState<GameState>({
    shoe: null,
    countingEngine: null,
    playerHands: [],
    dealerHand: [],
    currentHandIndex: 0,
    phase: GamePhase.BETTING,
    bankroll: INITIAL_BANKROLL,
    currentBet: 0,
    settings: DEFAULT_SETTINGS,
    roundCount: 0,
    cutCardReached: false,
  });

  const initializeGame = useCallback((settings?: Partial<GameSettings>) => {
    const newSettings = { ...DEFAULT_SETTINGS, ...settings };
    const newShoe = new Shoe(newSettings.deckCount);
    const newCountingEngine = new CardCountingEngine(
      newSettings.countingSystem,
      newSettings.deckCount
    );

    setState({
      shoe: newShoe,
      countingEngine: newCountingEngine,
      playerHands: [],
      dealerHand: [],
      currentHandIndex: 0,
      phase: GamePhase.BETTING,
      bankroll: INITIAL_BANKROLL,
      currentBet: 0,
      settings: newSettings,
      roundCount: 0,
      cutCardReached: false,
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const placeBet = useCallback((amount: number) => {
    setState(prev => {
      if (amount > prev.bankroll) return prev;
      if (amount < 0) return prev;
      if (prev.phase !== GamePhase.BETTING) return prev;

      return {
        ...prev,
        currentBet: amount,
      };
    });
  }, []);

  const dealInitialCards = useCallback(() => {
    setState(prev => {
      if (!prev.shoe || !prev.countingEngine) return prev;
      if (prev.phase !== GamePhase.BETTING) return prev;
      if (prev.currentBet > prev.bankroll) return prev;

      // Check if we need to shuffle
      const totalCards = prev.settings.deckCount * 52;
      const cutCardPosition = totalCards * prev.settings.penetration;
      const shouldShuffle = prev.shoe.getCardsRemaining() < (totalCards - cutCardPosition);

      let shoe = prev.shoe;
      let countingEngine = prev.countingEngine;

      if (shouldShuffle) {
        shoe = new Shoe(prev.settings.deckCount);
        countingEngine = new CardCountingEngine(
          prev.settings.countingSystem,
          prev.settings.deckCount
        );
      }

      // Deal cards: Player, Dealer, Player, Dealer
      const card1 = shoe.pop();
      const card2 = shoe.pop();
      const card3 = shoe.pop();
      const card4 = shoe.pop();

      if (!card1 || !card2 || !card3 || !card4) return prev;

      // Update counting engine
      countingEngine.countCard(card1);
      countingEngine.countCard(card2);
      countingEngine.countCard(card3);
      // Don't count dealer hole card yet (card4)

      const playerHand: Hand = {
        cards: [card1, card3],
        bet: prev.currentBet,
        status: HandStatus.ACTIVE,
      };

      const dealerHand = [card2, card4];

      // Check for blackjack
      if (isBlackjack(playerHand.cards)) {
        playerHand.status = HandStatus.BLACKJACK;
      }

      return {
        ...prev,
        shoe,
        countingEngine,
        playerHands: [playerHand],
        dealerHand,
        currentHandIndex: 0,
        phase: playerHand.status === HandStatus.BLACKJACK ? GamePhase.DEALER_TURN : GamePhase.PLAYER_TURN,
        bankroll: prev.bankroll - prev.currentBet,
        roundCount: prev.roundCount + 1,
      };
    });
  }, []);

  const hit = useCallback(() => {
    setState(prev => {
      if (!prev.shoe || !prev.countingEngine) return prev;
      if (prev.phase !== GamePhase.PLAYER_TURN) return prev;

      const currentHand = prev.playerHands[prev.currentHandIndex];
      if (!currentHand || currentHand.status !== HandStatus.ACTIVE) return prev;

      const card = prev.shoe.pop();
      if (!card) return prev;

      prev.countingEngine.countCard(card);

      const newCards = [...currentHand.cards, card];
      const { value } = calculateHandValue(newCards);

      const newHand: Hand = {
        ...currentHand,
        cards: newCards,
        status: value > 21 ? HandStatus.BUST : HandStatus.ACTIVE,
      };

      const newPlayerHands = [...prev.playerHands];
      newPlayerHands[prev.currentHandIndex] = newHand;

      // Check if hand is complete
      const handComplete = newHand.status === HandStatus.BUST || newHand.status === HandStatus.STAND;

      // Move to next hand or dealer turn
      let newHandIndex = prev.currentHandIndex;
      let newPhase: GamePhase = prev.phase;

      if (handComplete) {
        if (prev.currentHandIndex < prev.playerHands.length - 1) {
          newHandIndex = prev.currentHandIndex + 1;
        } else {
          newPhase = GamePhase.DEALER_TURN;
        }
      }

      return {
        ...prev,
        playerHands: newPlayerHands,
        currentHandIndex: newHandIndex,
        phase: newPhase,
      };
    });
  }, []);

  const stand = useCallback(() => {
    setState(prev => {
      if (prev.phase !== GamePhase.PLAYER_TURN) return prev;

      const currentHand = prev.playerHands[prev.currentHandIndex];
      if (!currentHand || currentHand.status !== HandStatus.ACTIVE) return prev;

      const newHand: Hand = {
        ...currentHand,
        status: HandStatus.STAND,
      };

      const newPlayerHands = [...prev.playerHands];
      newPlayerHands[prev.currentHandIndex] = newHand;

      // Move to next hand or dealer turn
      const isLastHand = prev.currentHandIndex >= prev.playerHands.length - 1;

      return {
        ...prev,
        playerHands: newPlayerHands,
        currentHandIndex: isLastHand ? prev.currentHandIndex : prev.currentHandIndex + 1,
        phase: isLastHand ? GamePhase.DEALER_TURN : GamePhase.PLAYER_TURN,
      };
    });
  }, []);

  const doubleDown = useCallback(() => {
    setState(prev => {
      if (!prev.shoe || !prev.countingEngine) return prev;
      if (prev.phase !== GamePhase.PLAYER_TURN) return prev;

      const currentHand = prev.playerHands[prev.currentHandIndex];
      if (!currentHand || !canDoubleDown(currentHand)) return prev;
      if (currentHand.bet > prev.bankroll) return prev;

      const card = prev.shoe.pop();
      if (!card) return prev;

      prev.countingEngine.countCard(card);

      const newCards = [...currentHand.cards, card];
      const { value } = calculateHandValue(newCards);

      const newHand: Hand = {
        ...currentHand,
        cards: newCards,
        bet: currentHand.bet * 2,
        status: value > 21 ? HandStatus.BUST : HandStatus.STAND,
      };

      const newPlayerHands = [...prev.playerHands];
      newPlayerHands[prev.currentHandIndex] = newHand;

      const isLastHand = prev.currentHandIndex >= prev.playerHands.length - 1;

      return {
        ...prev,
        playerHands: newPlayerHands,
        bankroll: prev.bankroll - currentHand.bet,
        currentHandIndex: isLastHand ? prev.currentHandIndex : prev.currentHandIndex + 1,
        phase: isLastHand ? GamePhase.DEALER_TURN : GamePhase.PLAYER_TURN,
      };
    });
  }, []);

  const split = useCallback(() => {
    setState(prev => {
      if (!prev.shoe || !prev.countingEngine) return prev;
      if (prev.phase !== GamePhase.PLAYER_TURN) return prev;

      const currentHand = prev.playerHands[prev.currentHandIndex];
      if (!currentHand || !canSplit(currentHand, prev.playerHands)) return prev;
      if (currentHand.bet > prev.bankroll) return prev;

      const card1 = prev.shoe.pop();
      const card2 = prev.shoe.pop();
      if (!card1 || !card2) return prev;

      prev.countingEngine.countCard(card1);
      prev.countingEngine.countCard(card2);

      const hand1: Hand = {
        cards: [currentHand.cards[0], card1],
        bet: currentHand.bet,
        status: HandStatus.ACTIVE,
        isSplit: true,
      };

      const hand2: Hand = {
        cards: [currentHand.cards[1], card2],
        bet: currentHand.bet,
        status: HandStatus.ACTIVE,
        isSplit: true,
      };

      const newPlayerHands = [...prev.playerHands];
      newPlayerHands[prev.currentHandIndex] = hand1;
      newPlayerHands.splice(prev.currentHandIndex + 1, 0, hand2);

      return {
        ...prev,
        playerHands: newPlayerHands,
        bankroll: prev.bankroll - currentHand.bet,
      };
    });
  }, []);

  const surrender = useCallback(() => {
    setState(prev => {
      if (prev.phase !== GamePhase.PLAYER_TURN) return prev;

      const currentHand = prev.playerHands[prev.currentHandIndex];
      if (!currentHand || !canSurrender(currentHand)) return prev;

      const newHand: Hand = {
        ...currentHand,
        status: HandStatus.SURRENDER,
      };

      const newPlayerHands = [...prev.playerHands];
      newPlayerHands[prev.currentHandIndex] = newHand;

      const isLastHand = prev.currentHandIndex >= prev.playerHands.length - 1;

      return {
        ...prev,
        playerHands: newPlayerHands,
        currentHandIndex: isLastHand ? prev.currentHandIndex : prev.currentHandIndex + 1,
        phase: isLastHand ? GamePhase.DEALER_TURN : GamePhase.PLAYER_TURN,
      };
    });
  }, []);

  const playDealerHand = useCallback(() => {
    setState(prev => {
      if (!prev.shoe || !prev.countingEngine) return prev;
      if (prev.phase !== GamePhase.DEALER_TURN) return prev;

      // Count the hole card now
      prev.countingEngine.countCard(prev.dealerHand[1]);

      // Check if all player hands are bust or surrendered
      const allPlayerHandsBustOrSurrender = prev.playerHands.every(
        hand => hand.status === HandStatus.BUST || hand.status === HandStatus.SURRENDER
      );

      if (allPlayerHandsBustOrSurrender) {
        // Dealer doesn't need to play
        return {
          ...prev,
          phase: GamePhase.ROUND_COMPLETE,
        };
      }

      let dealerHand = [...prev.dealerHand];

      while (shouldDealerHit(dealerHand)) {
        const card = prev.shoe.pop();
        if (!card) break;

        prev.countingEngine.countCard(card);
        dealerHand.push(card);
      }

      return {
        ...prev,
        dealerHand,
        phase: GamePhase.ROUND_COMPLETE,
      };
    });
  }, []);

  const settleRound = useCallback(() => {
    setState(prev => {
      if (prev.phase !== GamePhase.ROUND_COMPLETE) return prev;

      let totalPayout = 0;

      const settledHands = prev.playerHands.map(hand => {
        const { result, payout } = determineHandResult(hand, prev.dealerHand);
        totalPayout += payout;

        return {
          ...hand,
          result,
          payout,
        };
      });

      return {
        ...prev,
        playerHands: settledHands,
        bankroll: prev.bankroll + totalPayout,
      };
    });
  }, []);

  const startNewRound = useCallback(() => {
    setState(prev => ({
      ...prev,
      playerHands: [],
      dealerHand: [],
      currentHandIndex: 0,
      phase: GamePhase.BETTING,
      currentBet: 0,
    }));
  }, []);

  return {
    state,
    actions: {
      initializeGame,
      updateSettings,
      placeBet,
      dealInitialCards,
      hit,
      stand,
      doubleDown,
      split,
      surrender,
      playDealerHand,
      settleRound,
      startNewRound,
    },
  };
}
