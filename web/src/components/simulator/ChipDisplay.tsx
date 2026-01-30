'use client';

interface ChipProps {
  value: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const CHIP_COLORS: Record<number, { from: string; to: string; border: string }> = {
  1: { from: 'from-white', to: 'to-gray-300', border: 'border-gray-400' },
  5: { from: 'from-red-500', to: 'to-red-700', border: 'border-red-800' },
  10: { from: 'from-blue-500', to: 'to-blue-700', border: 'border-blue-800' },
  25: { from: 'from-green-500', to: 'to-green-700', border: 'border-green-800' },
  50: { from: 'from-orange-500', to: 'to-orange-700', border: 'border-orange-800' },
  100: { from: 'from-black', to: 'to-gray-800', border: 'border-gray-600' },
  500: { from: 'from-purple-500', to: 'to-purple-700', border: 'border-purple-800' },
  1000: { from: 'from-yellow-500', to: 'to-yellow-700', border: 'border-yellow-800' },
};

export default function Chip({ value, onClick, disabled = false, className = '' }: ChipProps) {
  const colors = CHIP_COLORS[value] || CHIP_COLORS[1];

  return (
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`
        relative w-12 h-12 md:w-14 md:h-14 rounded-full
        bg-gradient-to-br ${colors.from} ${colors.to}
        border-4 ${colors.border}
        shadow-lg
        flex items-center justify-center
        font-bold text-white text-sm md:text-base
        transition-all duration-200
        ${!disabled && onClick ? 'hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95 cursor-pointer' : 'cursor-default'}
        ${disabled && onClick ? 'opacity-50' : ''}
        ${!disabled && onClick ? 'hover:brightness-125' : ''}
        ${className}
      `}
    >
      {/* Chip Inner Circle */}
      <div className="absolute inset-2 rounded-full border-2 border-white/20"></div>

      {/* Value */}
      <span className="relative z-10 drop-shadow-md">${value}</span>

      {/* Click feedback ring */}
      {!disabled && onClick && (
        <div className="absolute inset-0 rounded-full ring-2 ring-white/0 hover:ring-white/30 transition-all"></div>
      )}
    </button>
  );
}

interface ChipStackProps {
  amount: number;
}

export function ChipStack({ amount }: ChipStackProps) {
  const getChipsFromAmount = (amt: number): number[] => {
    const chips: number[] = [];
    const values = [1000, 500, 100, 50, 25, 10, 5, 1];
    let remaining = amt;

    values.forEach(v => {
      while (remaining >= v) {
        chips.push(v);
        remaining -= v;
      }
    });
    return chips.reverse(); // Largest first (bottom of stack)
  };

  const chips = getChipsFromAmount(amount);

  if (chips.length === 0) return null;

  return (
    <div className="relative flex flex-col items-center animate-in zoom-in duration-300">
      {/* Chip Stack */}
      <div className="relative h-12 w-12 md:h-14 md:w-14">
        {chips.map((val, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{ transform: `translateY(-${i * 4}px)` }}
          >
            <Chip value={val} disabled />
          </div>
        ))}
      </div>

      {/* Amount Display */}
      <div className="mt-4 bg-zinc-900/90 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-mono text-neon-green font-bold border border-neon-green/30 shadow-[0_0_10px_rgba(0,250,154,0.2)] z-20">
        ${amount}
      </div>
    </div>
  );
}
