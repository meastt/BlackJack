'use client';

import { useState, useCallback } from 'react';
import { Shoe, Card, Rank } from '@card-counter-ai/shared';

interface SimulatorConfig {
  deckCount: number;
  speed: number;
}

interface Checkpoint {
  cardIndex: number;
  userCount: number;
  actualCount: number;
  isCorrect: boolean;
}

interface SimulatorState {
  shoe: Shoe | null;
  currentCard: Card | null;
  dealtCards: Card[];
  runningCount: number;
  trueCount: number;
  userRunningCount: number;
  isActive: boolean;
  isPaused: boolean;
  checkpoints: Checkpoint[];
  config: SimulatorConfig;
}

export function useSimulatorState() {
  const [state, setState] = useState<SimulatorState>({
    shoe: null,
    currentCard: null,
    dealtCards: [],
    runningCount: 0,
    trueCount: 0,
    userRunningCount: 0,
    isActive: false,
    isPaused: false,
    checkpoints: [],
    config: { deckCount: 1, speed: 2 },
  });

  const initializeShoe = useCallback((deckCount: number) => {
    const newShoe = new Shoe(deckCount);
    setState(prev => ({
      ...prev,
      shoe: newShoe,
      dealtCards: [],
      runningCount: 0,
      trueCount: 0,
      userRunningCount: 0,
      checkpoints: [],
      config: { ...prev.config, deckCount },
    }));
  }, []);

  const dealCard = useCallback(() => {
    setState(prev => {
      if (!prev.shoe) return prev;

      const card = prev.shoe.pop();
      if (!card) return prev;

      const newRunningCount = prev.shoe.getRunningCount();
      const remainingDecks = prev.shoe.getCardsRemaining() / 52;
      const newTrueCount = remainingDecks > 0 ? Math.round(prev.shoe.getTrueCount(remainingDecks)) : 0;

      return {
        ...prev,
        currentCard: card,
        dealtCards: [...prev.dealtCards, card],
        runningCount: newRunningCount,
        trueCount: newTrueCount,
      };
    });
  }, []);

  const submitUserCount = useCallback((userCount: number) => {
    setState(prev => {
      const checkpoint: Checkpoint = {
        cardIndex: prev.dealtCards.length,
        userCount,
        actualCount: prev.runningCount,
        isCorrect: userCount === prev.runningCount,
      };

      return {
        ...prev,
        userRunningCount: userCount,
        checkpoints: [...prev.checkpoints, checkpoint],
      };
    });
  }, []);

  const setActive = useCallback((isActive: boolean) => {
    setState(prev => ({ ...prev, isActive }));
  }, []);

  const setPaused = useCallback((isPaused: boolean) => {
    setState(prev => ({ ...prev, isPaused }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, speed },
    }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      shoe: null,
      currentCard: null,
      dealtCards: [],
      runningCount: 0,
      trueCount: 0,
      userRunningCount: 0,
      isActive: false,
      isPaused: false,
      checkpoints: [],
    }));
  }, []);

  return {
    state,
    initializeShoe,
    dealCard,
    submitUserCount,
    setActive,
    setPaused,
    setSpeed,
    reset,
  };
}
