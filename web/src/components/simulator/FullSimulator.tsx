'use client';

import { useEffect, useState } from 'react';
import { useBlackjackGame } from '@/hooks/useBlackjackGame';
import { GamePhase } from '@/lib/simulator/blackjack';
import GameSettingsPanel from './GameSettings';
import BettingInterface from './BettingInterface';
import GameTable from './GameTable';
import CountIndicators from './CountIndicators';
import FeltTable from './FeltTable';
import { ChipStack } from './ChipDisplay';

const MIN_BET = 10;

export default function FullSimulator() {
  const { state, actions } = useBlackjackGame();
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      actions.initializeGame();
      setIsInitialized(true);
    }
  }, [isInitialized, actions]);

  useEffect(() => {
    if (state.phase === GamePhase.DEALER_TURN) {
      const timer = setTimeout(() => {
        actions.playDealerHand();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, actions]);

  useEffect(() => {
    if (state.phase === GamePhase.ROUND_COMPLETE && state.playerHands.length > 0) {
      const timer = setTimeout(() => {
        actions.settleRound();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.playerHands.length, actions]);

  const handleDeal = () => {
    actions.dealInitialCards();
  };

  const handleNewRound = () => {
    actions.startNewRound();
  };

  const handleResetGame = () => {
    const shouldReset = confirm('Reset game and start with fresh $10,000 bankroll?');
    if (shouldReset) {
      actions.initializeGame(state.settings);
      setIsInitialized(true);
    }
  };

  const getRecommendedBet = (): number | undefined => {
    if (!state.countingEngine || !state.settings.showBettingRecommendation) {
      return undefined;
    }

    const multiplier = state.countingEngine.getBetMultiplier();
    return MIN_BET * multiplier;
  };

  const runningCount = state.countingEngine?.getRunningCount() ?? 0;
  const trueCount = state.countingEngine?.getTrueCount() ?? 0;
  const decksRemaining = state.countingEngine?.getDecksRemaining() ?? 0;

  if (!isInitialized || !state.shoe) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-pink mx-auto mb-4"></div>
          <p className="text-zinc-400">Initializing game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col">
      {/* Header */}
      <header className="w-full bg-zinc-950 p-2 md:p-2.5 border-b border-zinc-800 flex justify-between items-center z-10 shadow-[0_0_15px_rgba(0,0,0,1)] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-1.5 rounded-lg border border-neon-blue/20 shadow-[0_0_10px_rgba(1,213,255,0.1)]">
            <svg className="w-5 h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="font-bold text-base text-white leading-none tracking-tight">
            <span className="text-neon-pink text-glow-pink">Protocol</span>{' '}
            <span className="text-neon-blue text-glow-blue">21</span>
            <span className="text-zinc-500 text-[10px] ml-2 uppercase tracking-wider font-normal">• Freeplay</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Bankroll Display */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide font-bold">Bankroll</span>
            <div className={`flex items-center font-mono font-bold text-base ${
              state.bankroll > 10000 ? 'text-neon-green text-glow-green' :
              state.bankroll < 5000 ? 'text-neon-pink text-glow-pink' :
              'text-white'
            }`}>
              ${state.bankroll.toLocaleString()}
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors border border-transparent hover:border-zinc-700"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute top-16 right-4 w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-[0_0_30px_rgba(0,0,0,1)] z-50 backdrop-blur-md max-h-[calc(100vh-100px)] overflow-y-auto">
          <GameSettingsPanel
            settings={state.settings}
            onSettingsChange={actions.updateSettings}
            disabled={state.phase !== GamePhase.BETTING}
          />
          <div className="p-4 border-t border-zinc-800">
            <button
              onClick={handleResetGame}
              className="w-full bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink border border-neon-pink/30 px-4 py-2 rounded-lg font-bold transition-all"
            >
              Reset Game
            </button>
          </div>
        </div>
      )}

      {/* Count Indicators - HUD Style */}
      {(state.settings.showRunningCount || state.settings.showTrueCount || state.settings.showDecksRemaining) && (
        <div className="w-full bg-zinc-950/80 border-b border-zinc-800 p-3 z-10 backdrop-blur-md">
          <div className="flex gap-4 justify-center">
            {state.settings.showRunningCount && (
              <div className="bg-black/60 px-3 py-1.5 rounded border border-neon-green/30 backdrop-blur-md">
                <span className="text-xs text-zinc-400 mr-2">RC:</span>
                <span className={`font-mono font-bold ${
                  runningCount > 0 ? 'text-neon-green text-glow-green' :
                  runningCount < 0 ? 'text-neon-pink text-glow-pink' :
                  'text-zinc-400'
                }`}>
                  {runningCount > 0 ? '+' : ''}{runningCount}
                </span>
              </div>
            )}
            {state.settings.showTrueCount && (
              <div className="bg-black/60 px-3 py-1.5 rounded border border-neon-blue/30 backdrop-blur-md">
                <span className="text-xs text-zinc-400 mr-2">TC:</span>
                <span className={`font-mono font-bold ${
                  trueCount > 0 ? 'text-neon-green text-glow-green' :
                  trueCount < 0 ? 'text-neon-pink text-glow-pink' :
                  'text-zinc-400'
                }`}>
                  {trueCount > 0 ? '+' : ''}{trueCount}
                </span>
              </div>
            )}
            {state.settings.showDecksRemaining && (
              <div className="bg-black/60 px-3 py-1.5 rounded border border-zinc-700 backdrop-blur-md">
                <span className="text-xs text-zinc-400 mr-2">Decks:</span>
                <span className="font-mono font-bold text-white">
                  {decksRemaining.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Table Surface */}
      <main className="flex-1 relative overflow-hidden min-h-0">
        {state.phase === GamePhase.BETTING ? (
          <div className="h-full w-full">
            <FeltTable>
              <div className="h-full flex flex-col items-center justify-center">
                {/* Betting Area */}
                <div className="flex flex-col items-center justify-center gap-4">
                  {state.currentBet > 0 ? (
                    <>
                      <div className="text-zinc-500 text-xs uppercase tracking-widest">Your Bet</div>
                      <ChipStack amount={state.currentBet} />
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-neon-pink/40 text-sm uppercase tracking-widest mb-2 animate-pulse">
                        Place Your Bet
                      </div>
                      <div className="text-zinc-600 text-xs">
                        Select chips below to begin
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FeltTable>
          </div>
        ) : (
          <div className="h-full">
            <GameTable
              dealerHand={state.dealerHand}
              playerHands={state.playerHands}
              currentHandIndex={state.currentHandIndex}
              phase={state.phase}
              currentBet={state.currentBet}
              showCountValues={state.settings.showCountValues}
              showBasicStrategy={state.settings.showBasicStrategy}
              onHit={actions.hit}
              onStand={actions.stand}
              onDouble={actions.doubleDown}
              onSplit={actions.split}
              onSurrender={actions.surrender}
            />
          </div>
        )}

        {/* Round Result Overlay */}
        {state.phase === GamePhase.ROUND_COMPLETE && state.playerHands[0]?.result && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="bg-zinc-950/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] transform animate-in zoom-in duration-300 pointer-events-auto max-w-xs w-full mx-4">
              <div className="text-center">
                {state.playerHands.map((hand, i) => {
                  if (!hand.result) return null;
                  return (
                    <div key={i} className="mb-4">
                      <div className={`text-3xl font-bold mb-2 uppercase tracking-wider ${
                        hand.result === 'win' || hand.result === 'blackjack'
                          ? 'text-neon-green text-glow-green'
                          : hand.result === 'lose'
                            ? 'text-neon-pink text-glow-pink'
                            : 'text-neon-blue text-glow-blue'
                      }`}>
                        {hand.result === 'blackjack' ? 'Blackjack!' : hand.result}
                      </div>
                      <div className={`font-mono text-2xl font-bold ${
                        (hand.payout ?? 0) > hand.bet ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {(hand.payout ?? 0) > hand.bet ? `+$${(hand.payout ?? 0) - hand.bet}` : `-$${hand.bet}`}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={handleNewRound}
                  className="w-full bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green hover:to-neon-green text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(0,250,154,0.4)] transition-all cursor-pointer text-lg transform hover:scale-[1.02] mt-4"
                >
                  Next Hand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bankrupt Notice */}
        {state.bankroll < MIN_BET && state.phase === GamePhase.BETTING && (
          <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-neon-pink/30 shadow-[0_0_50px_rgba(235,42,115,0.2)] max-w-sm w-full text-center animate-in zoom-in duration-300">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-2xl font-bold text-neon-pink text-glow-pink mb-4">Bankroll Depleted!</h3>
              <p className="text-zinc-400 mb-6">
                You don't have enough to place the minimum bet of ${MIN_BET}.
              </p>
              <button
                onClick={handleResetGame}
                className="w-full bg-gradient-to-r from-neon-green to-emerald-600 text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(0,250,154,0.4)] transition-all transform hover:scale-[1.02]"
              >
                Reset Game
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Control Panel / Betting Interface */}
      <div className="w-full bg-zinc-950 p-3 md:p-4 border-t border-zinc-800 relative z-20 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        <div className="max-w-2xl mx-auto">
          {state.phase === GamePhase.BETTING && (
            <BettingInterface
              bankroll={state.bankroll}
              currentBet={state.currentBet}
              minBet={MIN_BET}
              onBetChange={actions.placeBet}
              onDeal={handleDeal}
              recommendedBet={getRecommendedBet()}
              showRecommendation={state.settings.showBettingRecommendation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
