'use client';

import { useEffect, useState } from 'react';

interface DrillFeedbackProps {
  isCorrect: boolean;
  userCount: number;
  actualCount: number;
  onClose: () => void;
}

export default function DrillFeedback({ isCorrect, userCount, actualCount, onClose }: DrillFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className={`
          card p-8 max-w-md mx-4 text-center
          animate-scale-in
          ${isCorrect
            ? 'border-2 border-accent-green shadow-[0_0_30px_rgba(0,255,136,0.6)]'
            : 'border-2 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.6)]'
          }
        `}
      >
        <div className={`text-6xl mb-4 ${isCorrect ? 'text-accent-green' : 'text-red-500'}`}>
          {isCorrect ? '✓' : '✗'}
        </div>

        <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-accent-green' : 'text-red-500'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>

        <div className="text-lg mb-4">
          <div className="flex justify-center gap-8 mt-4">
            <div>
              <div className="text-sm text-secondary">Your Count</div>
              <div className={`text-3xl font-bold ${isCorrect ? 'text-accent-green' : 'text-red-500'}`}>
                {userCount}
              </div>
            </div>
            <div>
              <div className="text-sm text-secondary">Actual Count</div>
              <div className="text-3xl font-bold text-primary">
                {actualCount}
              </div>
            </div>
          </div>
        </div>

        {!isCorrect && (
          <p className="text-secondary text-sm">
            The running count was {actualCount}. Keep practicing!
          </p>
        )}
      </div>
    </div>
  );
}
