"use client"

import React, { useState } from 'react';
import Link from 'next/link';

export function TrueCountConverter() {
    const [runningCount, setRunningCount] = useState<number>(0);
    const [decksRemaining, setDecksRemaining] = useState<number>(6);

    // Math.round is used as standard casino practice for True Count conversion
    const trueCount = decksRemaining > 0 ? Math.round(runningCount / decksRemaining) : 0;

    const handleRunningCountChange = (amount: number) => {
        setRunningCount((prev) => prev + amount);
    };

    const handleDecksChange = (amount: number) => {
        setDecksRemaining((prev) => Math.max(0.5, prev + amount));
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-[#111] border border-white/10 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Interactive True Count Calculator</h3>
                <p className="text-text-secondary text-sm">
                    Adjust the variables below to see how the Running Count converts to the True Count in real time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Running Count Controls */}
                <div className="flex flex-col items-center p-6 bg-white/5 rounded-xl border border-white/5">
                    <label className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-4">
                        Running Count
                    </label>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => handleRunningCountChange(-1)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xl font-bold transition-colors"
                        >
                            -
                        </button>
                        <span className="text-4xl font-mono font-bold w-16 text-center">
                            {runningCount > 0 ? `+${runningCount}` : runningCount}
                        </span>
                        <button
                            onClick={() => handleRunningCountChange(1)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xl font-bold transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Decks Remaining Controls */}
                <div className="flex flex-col items-center p-6 bg-white/5 rounded-xl border border-white/5">
                    <label className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-4">
                        Decks Remaining
                    </label>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => handleDecksChange(-0.5)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xl font-bold transition-colors"
                        >
                            -
                        </button>
                        <span className="text-4xl font-mono font-bold w-16 text-center">
                            {decksRemaining}
                        </span>
                        <button
                            onClick={() => handleDecksChange(0.5)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xl font-bold transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Display */}
            <div className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-xl border border-primary/30 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-2 relative z-10">
                    Calculated True Count
                </span>
                <span className="text-6xl font-black font-mono relative z-10">
                    {trueCount > 0 ? `+${trueCount}` : trueCount}
                </span>
                <div className="mt-4 text-xs text-text-secondary relative z-10">
                    (Running Count ÷ Decks Remaining)
                </div>
            </div>

            {/* App Store Conversion CTA */}
            <div className="text-center pt-8 border-t border-white/10">
                <h4 className="text-lg font-bold mb-4">Want to train your brain to do this instantly?</h4>
                <p className="text-sm text-text-secondary mb-6 max-w-lg mx-auto">
                    Protocol 21 is the ultimate iOS & Android app built to train your True Count conversion speed. No ads. No scammy chips. Just pure, casino-grade drills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/download/ios" className="btn btn-primary px-8 py-3 text-sm font-bold uppercase tracking-wide">
                        Get Protocol 21 for iOS
                    </Link>
                    <Link href="/download/android" className="btn btn-outline px-8 py-3 text-sm font-bold uppercase tracking-wide">
                        Get Protocol 21 for Android
                    </Link>
                </div>
            </div>
        </div>
    );
}
