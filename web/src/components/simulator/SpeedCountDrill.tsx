'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSimulatorState } from '@/hooks/useSimulatorState';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import PlayingCard from './PlayingCard';
import PerformanceMetrics from './PerformanceMetrics';
import DrillFeedback from './DrillFeedback';

export default function SpeedCountDrill() {
  const {
    state,
    initializeShoe,
    dealCard,
    submitUserCount,
    setActive,
    reset: resetSimulator,
  } = useSimulatorState();

  const {
    metrics,
    startTracking,
    stopTracking,
    recordCard,
    recordAnswer,
    reset: resetMetrics,
  } = usePerformanceMetrics();

  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<{
    isCorrect: boolean;
    userCount: number;
    actualCount: number;
  } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startDrill = useCallback(() => {
    resetSimulator();
    resetMetrics();
    setUserInput('');
    setShowFeedback(false);
    setCurrentCheckpoint(null);
    setIsComplete(false);
    initializeShoe(state.config.deckCount);
    setActive(true);
    startTracking();
  }, [state.config.deckCount, initializeShoe, setActive, startTracking, resetSimulator, resetMetrics]);

  useEffect(() => {
    if (!state.isActive || !state.shoe) return;

    if (state.shoe.getCardsRemaining() === 0) {
      setActive(false);
      stopTracking();
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      dealCard();
      recordCard();
    }, state.config.speed * 1000);

    return () => clearTimeout(timer);
  }, [state.isActive, state.shoe, state.dealtCards.length, state.config.speed, dealCard, recordCard, setActive, stopTracking]);

  const handleSubmitCount = useCallback(() => {
    const userCount = parseInt(userInput, 10);
    if (isNaN(userCount)) return;

    submitUserCount(userCount);
    const isCorrect = userCount === state.runningCount;
    recordAnswer(isCorrect);

    setCurrentCheckpoint({
      isCorrect,
      userCount,
      actualCount: state.runningCount,
    });
    setShowFeedback(true);
    setUserInput('');
  }, [userInput, state.runningCount, submitUserCount, recordAnswer]);

  const shouldPromptCount = state.dealtCards.length > 0 && state.dealtCards.length % 10 === 0 && state.checkpoints.length * 10 < state.dealtCards.length;

  return (
    <div className="space-y-8">
      {!state.isActive && !isComplete && (
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Speed Count Drill</h2>
            <p className="text-secondary">
              Cards will flash one at a time. Keep a running count in your head and submit your answer every 10 cards.
            </p>
          </div>

          <div className="card p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Decks</label>
                <select
                  className="w-full px-4 py-2 rounded bg-surface border border-white/20 focus:border-primary outline-none"
                  value={state.config.deckCount}
                  onChange={(e) => initializeShoe(parseInt(e.target.value, 10))}
                >
                  {[1, 2, 4, 6, 8].map(count => (
                    <option key={count} value={count}>{count} {count === 1 ? 'Deck' : 'Decks'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Card Speed (seconds)</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.5"
                  value={state.config.speed}
                  onChange={(e) => {
                    const newSpeed = parseFloat(e.target.value);
                    resetSimulator();
                    initializeShoe(state.config.deckCount);
                    state.config.speed = newSpeed;
                  }}
                  className="w-full"
                />
                <div className="text-center text-sm text-secondary mt-1">
                  {state.config.speed}s per card
                </div>
              </div>
            </div>
          </div>

          <button onClick={startDrill} className="btn btn-primary text-lg px-8 py-3">
            Start Drill
          </button>
        </div>
      )}

      {state.isActive && (
        <div className="space-y-6">
          <PerformanceMetrics {...metrics} />

          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
            {state.currentCard && (
              <div className="animate-fade-in">
                <PlayingCard card={state.currentCard} size="large" />
              </div>
            )}

            <div className="text-center">
              <div className="text-sm text-secondary mb-1">Cards Dealt</div>
              <div className="text-4xl font-bold text-primary">
                {state.dealtCards.length} / {state.shoe ? state.config.deckCount * 52 : 0}
              </div>
            </div>

            {shouldPromptCount && (
              <div className="card p-6 w-full max-w-md animate-scale-in">
                <h3 className="text-xl font-bold mb-4 text-center">What's the running count?</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitCount()}
                    placeholder="Enter count"
                    className="flex-1 px-4 py-3 rounded bg-surface border border-white/20 focus:border-primary outline-none text-center text-2xl"
                    autoFocus
                  />
                  <button
                    onClick={handleSubmitCount}
                    disabled={!userInput}
                    className="btn btn-primary px-6"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="text-center space-y-6">
          <div className="card p-8 max-w-2xl mx-auto border-2 border-accent-green shadow-[0_0_30px_rgba(0,255,136,0.4)]">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Drill Complete!</h2>
            <p className="text-secondary mb-6">
              You've completed the {state.config.deckCount}-deck speed count drill.
            </p>

            <PerformanceMetrics {...metrics} />

            <div className="mt-8 flex gap-4 justify-center">
              <button onClick={startDrill} className="btn btn-primary">
                Try Again
              </button>
              <button
                onClick={() => {
                  resetSimulator();
                  resetMetrics();
                  setIsComplete(false);
                }}
                className="btn"
              >
                Change Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedback && currentCheckpoint && (
        <DrillFeedback
          isCorrect={currentCheckpoint.isCorrect}
          userCount={currentCheckpoint.userCount}
          actualCount={currentCheckpoint.actualCount}
          onClose={() => {
            setShowFeedback(false);
            setCurrentCheckpoint(null);
          }}
        />
      )}
    </div>
  );
}
