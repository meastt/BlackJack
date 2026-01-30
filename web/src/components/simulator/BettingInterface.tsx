'use client';

import { useState } from 'react';
import Chip from './ChipDisplay';

interface BettingInterfaceProps {
  bankroll: number;
  currentBet: number;
  minBet: number;
  onBetChange: (amount: number) => void;
  onDeal: () => void;
  recommendedBet?: number;
  showRecommendation?: boolean;
}

const CHIP_VALUES = [1, 5, 10, 25, 50, 100, 500, 1000];

export default function BettingInterface({
  bankroll,
  currentBet,
  minBet,
  onBetChange,
  onDeal,
  recommendedBet,
  showRecommendation = false,
}: BettingInterfaceProps) {
  const [customAmount, setCustomAmount] = useState('');

  const handleChipClick = (value: number) => {
    const newBet = currentBet + value;
    if (newBet <= bankroll) {
      onBetChange(newBet);
    }
  };

  const handleClearBet = () => {
    onBetChange(0);
  };

  const handleCustomBet = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount >= minBet && amount <= bankroll) {
      onBetChange(amount);
      setCustomAmount('');
    }
  };

  const handleRecommendedBet = () => {
    if (recommendedBet && recommendedBet <= bankroll) {
      onBetChange(recommendedBet);
    }
  };

  return (
    <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      {/* Current Bet Display */}
      <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Current Bet</div>
          <div className={`text-2xl font-bold font-mono ${
            currentBet > 0 ? 'text-neon-green text-glow-green' : 'text-zinc-600'
          }`}>
            ${currentBet.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Bankroll</div>
          <div className="text-xl font-bold font-mono text-white">
            ${bankroll.toLocaleString()}
          </div>
        </div>
      </div>

      {showRecommendation && recommendedBet && (
        <div className="p-3 rounded-lg bg-neon-blue/10 border border-neon-blue/30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-bold">Recommended Bet</div>
              <div className="text-xl font-bold text-neon-blue text-glow-blue">
                ${recommendedBet.toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleRecommendedBet}
              className="bg-gradient-to-r from-neon-blue to-blue-600 hover:from-blue-400 hover:to-blue-600 text-black font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(1,213,255,0.4)] transition-all transform hover:scale-[1.02]"
            >
              Use
            </button>
          </div>
        </div>
      )}

      {/* Chip Selection */}
      <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-start md:justify-center px-1 no-scrollbar">
        {CHIP_VALUES.map(value => (
          <Chip
            key={value}
            value={value}
            onClick={() => handleChipClick(value)}
            disabled={currentBet + value > bankroll}
            className="shrink-0"
          />
        ))}
      </div>

      {/* Custom Amount Input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomBet()}
          placeholder="Custom amount"
          className="flex-1 px-4 py-2 rounded-lg bg-black border border-zinc-700 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(1,213,255,0.3)] outline-none text-white font-mono transition-all"
        />
        <button
          onClick={handleCustomBet}
          disabled={!customAmount}
          className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 rounded-lg transition-colors border border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Set
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleClearBet}
          disabled={currentBet === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-zinc-400 hover:text-neon-pink hover:border-neon-pink border border-zinc-700 px-4 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
        <button
          onClick={onDeal}
          disabled={currentBet === 0}
          className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-neon-green to-emerald-700 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black px-4 py-3 rounded-lg font-bold text-lg shadow-[0_0_15px_rgba(0,250,154,0.3)] transition-all active:scale-[0.98] disabled:shadow-none hover:brightness-110"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Deal Cards
        </button>
      </div>
    </div>
  );
}
