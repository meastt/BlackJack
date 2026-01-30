'use client';

import { Card } from '@card-counter-ai/shared';
import { Hand, GamePhase, calculateHandValue, getBasicStrategyAction, canDoubleDown, canSplit, canSurrender } from '@/lib/simulator/blackjack';
import PlayingCard from './PlayingCard';
import { ChipStack } from './ChipDisplay';
import FeltTable from './FeltTable';

interface GameTableProps {
  dealerHand: Card[];
  playerHands: Hand[];
  currentHandIndex: number;
  phase: GamePhase;
  currentBet: number;
  showCountValues: boolean;
  showBasicStrategy: boolean;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  onSurrender: () => void;
}

export default function GameTable({
  dealerHand,
  playerHands,
  currentHandIndex,
  phase,
  currentBet,
  showCountValues,
  showBasicStrategy,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onSurrender,
}: GameTableProps) {
  const currentHand = playerHands[currentHandIndex];

  const canDouble = currentHand && canDoubleDown(currentHand);
  const canSplitHand = currentHand && canSplit(currentHand, playerHands);
  const canSurrenderHand = currentHand && canSurrender(currentHand);

  const basicStrategyHint = currentHand && dealerHand.length > 0 && showBasicStrategy
    ? getBasicStrategyAction(currentHand, dealerHand[0], canSplitHand, canDouble)
    : null;

  return (
    <FeltTable>
      {/* Vertical Game Layout */}
      <div className="flex flex-col h-full justify-between py-4 md:py-6">

        {/* Dealer Hand - Top */}
        <div className="flex flex-col items-center justify-end min-h-[140px] md:min-h-[180px] px-4 pt-18 md:pt-20">
          <div className="w-full max-w-3xl">
            <div className="relative w-full flex justify-center">
              {/* Dealer Label - Left Side */}
              {dealerHand.length > 0 && (
                <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2">
                  <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest bg-black/80 px-3 py-1 rounded-full backdrop-blur-sm border border-zinc-800 shadow-lg">
                    Dealer
                  </div>
                </div>
              )}

              {/* Cards */}
              <div className="flex justify-center -space-x-4 md:-space-x-6">
                {dealerHand.map((card, i) => (
                  <div
                    key={card.id}
                    className="transform transition-transform hover:-translate-y-2"
                    style={{ zIndex: i }}
                  >
                    {i === 1 && phase !== GamePhase.DEALER_TURN && phase !== GamePhase.ROUND_COMPLETE ? (
                      <div className="w-[75px] h-[105px] md:w-[85px] md:h-[119px] bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 rounded-lg border-2 border-neon-pink/30 flex items-center justify-center shadow-[0_0_20px_rgba(235,42,115,0.2)]">
                        <span className="text-2xl md:text-4xl opacity-50">🂠</span>
                      </div>
                    ) : (
                      <PlayingCard card={card} size="large" showCountValue={showCountValues} />
                    )}
                  </div>
                ))}
              </div>

              {/* Dealer Value - Right Side */}
              {dealerHand.length > 0 && (phase === GamePhase.DEALER_TURN || phase === GamePhase.ROUND_COMPLETE) && (
                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2">
                  <div className="text-neon-blue text-glow-blue text-lg font-bold font-mono">
                    {calculateHandValue(dealerHand).value}
                    {calculateHandValue(dealerHand).isSoft && <span className="text-xs ml-1">(soft)</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Betting Area */}
        <div className="flex-1 w-full flex items-center justify-center relative min-h-[100px] px-4">
          {currentBet > 0 && phase !== GamePhase.BETTING ? (
            <ChipStack amount={currentBet} />
          ) : phase === GamePhase.BETTING && (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-neon-pink/40 text-xs font-bold uppercase tracking-widest text-glow-pink">
                Place Bet
              </span>
            </div>
          )}
        </div>

        {/* Player Hand - Bottom */}
        <div className="flex flex-col items-center justify-start min-h-[120px] md:min-h-[160px] mb-20 px-4">
          <div className="space-y-3 w-full max-w-3xl">
            {playerHands.map((hand, handIndex) => {
              const isCurrentHand = handIndex === currentHandIndex && phase === GamePhase.PLAYER_TURN;
              const handValue = calculateHandValue(hand.cards);

              return (
                <div
                  key={handIndex}
                  className={`
                    p-3 rounded-xl transition-all
                    ${isCurrentHand
                      ? 'bg-neon-pink/5 border border-neon-pink/40 shadow-[0_0_10px_rgba(235,42,115,0.2)]'
                      : 'bg-transparent border border-transparent'}
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    {/* Cards with Labels on Sides */}
                    <div className="relative w-full flex justify-center">
                      {/* Player Label - Left Side */}
                      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2">
                        <div className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-zinc-800">
                          {playerHands.length > 1 ? `Hand ${handIndex + 1}` : 'Player'}
                        </div>
                      </div>

                      {/* Cards */}
                      <div className="flex justify-center -space-x-4 md:-space-x-6">
                        {hand.cards.map((card, i) => (
                          <div
                            key={card.id}
                            className="transform transition-transform hover:-translate-y-2"
                            style={{ zIndex: i }}
                          >
                            <PlayingCard card={card} size="large" showCountValue={showCountValues} />
                          </div>
                        ))}
                      </div>

                      {/* Player Value - Right Side */}
                      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2">
                        <div className="text-neon-green text-glow-green text-xl font-bold font-mono">
                          {handValue.value}
                          {handValue.isSoft && <span className="text-xs ml-1">(soft)</span>}
                        </div>
                      </div>
                    </div>

                    {/* Hand Info */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">

                      {hand.status === 'bust' && (
                        <span className="text-red-500 font-bold text-xs animate-pulse uppercase">BUST</span>
                      )}
                      {hand.status === 'blackjack' && (
                        <span className="text-neon-green text-glow-green font-bold text-xs animate-pulse uppercase">BLACKJACK!</span>
                      )}

                      {hand.result && (
                        <span className={`font-bold text-xs uppercase ${
                          hand.result === 'win' || hand.result === 'blackjack' ? 'text-neon-green text-glow-green' :
                          hand.result === 'lose' ? 'text-neon-pink text-glow-pink' :
                          'text-neon-blue text-glow-blue'
                        }`}>
                          {hand.result === 'win' && 'WIN'}
                          {hand.result === 'lose' && 'LOSE'}
                          {hand.result === 'push' && 'PUSH'}
                          {hand.result === 'blackjack' && 'BLACKJACK!'}
                          {hand.result === 'surrender' && 'SURRENDER'}
                        </span>
                      )}

                      {/* Payout */}
                      {hand.payout !== undefined && (
                        <div className={`font-mono text-lg font-bold ${
                          hand.payout > hand.bet ? 'text-neon-green text-glow-green' :
                          hand.payout < hand.bet ? 'text-neon-pink text-glow-pink' :
                          'text-neon-blue text-glow-blue'
                        }`}>
                          {hand.payout > hand.bet && '+'}${hand.payout - hand.bet}
                        </div>
                      )}
                    </div>

                    {/* Basic Strategy Hint */}
                    {isCurrentHand && basicStrategyHint && (
                      <div className="mt-1 p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-center w-full backdrop-blur-md">
                        <div className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wider font-bold">Basic Strategy</div>
                        <div className="text-base font-bold text-neon-blue text-glow-blue">
                          {basicStrategyHint}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons Overlay */}
      {phase === GamePhase.PLAYER_TURN && currentHand && (
        <div className="absolute bottom-6 left-0 right-0 z-20 px-4">
          <div className="max-w-2xl mx-auto bg-zinc-950/90 backdrop-blur-md rounded-xl p-3 border border-zinc-800 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button
                onClick={onHit}
                disabled={currentHand.status !== 'active'}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-neon-green px-4 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base shadow-[0_3px_0_rgb(20,20,20)] active:shadow-none active:translate-y-1 transition-all border border-zinc-600 ring-1 ring-inset ring-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Hit
              </button>
              <button
                onClick={onStand}
                disabled={currentHand.status !== 'active'}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-neon-pink px-4 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base shadow-[0_3px_0_rgb(20,20,20)] active:shadow-none active:translate-y-1 transition-all border border-zinc-600 ring-1 ring-inset ring-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Stand
              </button>
              <button
                onClick={onDouble}
                disabled={!canDouble}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-zinc-300 px-3 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-[0_3px_0_rgb(20,20,20)] active:shadow-none active:translate-y-1 transition-all border border-zinc-600 ring-1 ring-inset ring-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Double
              </button>
              <button
                onClick={onSplit}
                disabled={!canSplitHand}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-zinc-300 px-3 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-[0_3px_0_rgb(20,20,20)] active:shadow-none active:translate-y-1 transition-all border border-zinc-600 ring-1 ring-inset ring-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Split
              </button>
              <button
                onClick={onSurrender}
                disabled={!canSurrenderHand}
                className="bg-gradient-to-b from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-zinc-300 px-3 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-[0_3px_0_rgb(20,20,20)] active:shadow-none active:translate-y-1 transition-all border border-zinc-600 ring-1 ring-inset ring-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Surrender
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dealer Turn Indicator */}
      {phase === GamePhase.DEALER_TURN && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-xl border border-neon-blue/30 shadow-[0_0_30px_rgba(1,213,255,0.2)]">
            <div className="flex items-center gap-3 text-neon-blue text-glow-blue">
              <span className="animate-pulse">●</span>
              <span className="text-sm uppercase tracking-widest font-bold">Dealer's Turn</span>
              <span className="animate-pulse">●</span>
            </div>
          </div>
        </div>
      )}
    </FeltTable>
  );
}
