'use client';

import { useState, useCallback, useEffect } from 'react';

interface PerformanceMetrics {
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  cardsDealt: number;
  timeElapsed: number;
  cardsPerMinute: number;
  currentStreak: number;
  bestStreak: number;
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    correctAnswers: 0,
    totalAnswers: 0,
    accuracy: 0,
    cardsDealt: 0,
    timeElapsed: 0,
    cardsPerMinute: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isTracking || !startTime) return;

    const interval = setInterval(() => {
      setMetrics(prev => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const cpm = elapsed > 0 ? Math.round((prev.cardsDealt / elapsed) * 60) : 0;
        return {
          ...prev,
          timeElapsed: elapsed,
          cardsPerMinute: cpm,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startTracking = useCallback(() => {
    setStartTime(Date.now());
    setIsTracking(true);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  const recordCard = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      cardsDealt: prev.cardsDealt + 1,
    }));
  }, []);

  const recordAnswer = useCallback((isCorrect: boolean) => {
    setMetrics(prev => {
      const newCorrect = prev.correctAnswers + (isCorrect ? 1 : 0);
      const newTotal = prev.totalAnswers + 1;
      const newAccuracy = (newCorrect / newTotal) * 100;
      const newCurrentStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

      return {
        ...prev,
        correctAnswers: newCorrect,
        totalAnswers: newTotal,
        accuracy: Math.round(newAccuracy),
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setMetrics({
      correctAnswers: 0,
      totalAnswers: 0,
      accuracy: 0,
      cardsDealt: 0,
      timeElapsed: 0,
      cardsPerMinute: 0,
      currentStreak: 0,
      bestStreak: 0,
    });
    setStartTime(null);
    setIsTracking(false);
  }, []);

  return {
    metrics,
    startTracking,
    stopTracking,
    recordCard,
    recordAnswer,
    reset,
  };
}
