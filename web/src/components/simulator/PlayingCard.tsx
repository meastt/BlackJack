'use client';

import { Card, Rank } from '@card-counter-ai/shared';

interface PlayingCardProps {
  card: Card;
  size?: 'small' | 'medium' | 'large';
  showCountValue?: boolean;
  className?: string;
}

const suitSymbols: Record<string, string> = {
  'spades': '♠',
  'hearts': '♥',
  'diamonds': '♦',
  'clubs': '♣',
};

const getCountValue = (rank: Rank): number => {
  const rankValue = rank.toString();
  if (rankValue === 'A' || rankValue === '10' || rankValue === 'J' || rankValue === 'Q' || rankValue === 'K') return -1;
  if (rankValue >= '2' && rankValue <= '6') return 1;
  return 0;
};

const getSuitColor = (suit: string): string => {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black';
};

export default function PlayingCard({ card, size = 'large', showCountValue = false, className = '' }: PlayingCardProps) {
  const suitSymbol = suitSymbols[card.suit];
  const rankText = card.rank.toString();
  const suitColor = getSuitColor(card.suit);
  const countValue = getCountValue(card.rank);

  const sizeClasses = {
    small: 'w-[52px] h-[73px] text-xs',
    medium: 'w-[70px] h-[98px] text-sm',
    large: 'w-[75px] h-[105px] md:w-[85px] md:h-[119px] text-base',
  };

  return (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size]}
          bg-white rounded-lg shadow-xl
          flex flex-col
          p-1.5 md:p-2
          transition-all duration-200
          hover:scale-105 hover:shadow-[0_0_20px_rgba(255,45,124,0.4)]
          border-2 border-gray-200
          ${className}
          overflow-hidden
        `}
      >
        {/* Top left corner */}
        <div className={`flex flex-col items-center leading-tight ${suitColor} text-xs`}>
          <span className="font-bold">{rankText}</span>
          <span className="text-[10px]">{suitSymbol}</span>
        </div>

        {/* Center suit symbol */}
        <div className="flex-1 flex items-center justify-center">
          <span className={`${size === 'large' ? 'text-4xl md:text-5xl' : size === 'medium' ? 'text-3xl' : 'text-xl'} ${suitColor}`}>
            {suitSymbol}
          </span>
        </div>

        {/* Bottom right corner (rotated) */}
        <div className={`flex flex-col items-center leading-tight ${suitColor} rotate-180 self-end text-xs`}>
          <span className="font-bold">{rankText}</span>
          <span className="text-[10px]">{suitSymbol}</span>
        </div>
      </div>

      {/* Count value overlay */}
      {showCountValue && (
        <div
          className={`
            absolute -bottom-6 left-1/2 transform -translate-x-1/2
            px-3 py-1 rounded-full text-sm font-bold
            ${countValue === 1 ? 'bg-green-500' : countValue === -1 ? 'bg-red-500' : 'bg-gray-500'}
            text-white shadow-lg
          `}
        >
          {countValue > 0 ? '+' : ''}{countValue}
        </div>
      )}
    </div>
  );
}
