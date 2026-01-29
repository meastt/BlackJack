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
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-white';
};

export default function PlayingCard({ card, size = 'large', showCountValue = false, className = '' }: PlayingCardProps) {
  const suitSymbol = suitSymbols[card.suit];
  const rankText = card.rank.toString();
  const suitColor = getSuitColor(card.suit);
  const countValue = getCountValue(card.rank);

  const sizeClasses = {
    small: 'w-[52px] h-[73px] text-xs',
    medium: 'w-[82px] h-[115px] text-sm',
    large: 'w-[90px] h-[126px] md:w-[112px] md:h-[157px] text-base md:text-lg',
  };

  return (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size]}
          bg-white rounded-lg shadow-xl
          flex flex-col
          p-2 md:p-2.5
          transition-all duration-200
          hover:scale-105 hover:shadow-[0_0_20px_rgba(255,45,124,0.4)]
          border-2 border-gray-200
          ${className}
        `}
      >
        {/* Top left corner */}
        <div className={`flex flex-col items-center leading-none ${suitColor}`}>
          <span className="font-bold">{rankText}</span>
          <span>{suitSymbol}</span>
        </div>

        {/* Center suit symbol */}
        <div className="flex-1 flex items-center justify-center">
          <span className={`${size === 'large' ? 'text-6xl' : size === 'medium' ? 'text-4xl' : 'text-2xl'} ${suitColor}`}>
            {suitSymbol}
          </span>
        </div>

        {/* Bottom right corner (rotated) */}
        <div className={`flex flex-col items-center leading-none ${suitColor} rotate-180 self-end`}>
          <span className="font-bold">{rankText}</span>
          <span>{suitSymbol}</span>
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
