import { Shoe } from '../engines/ShoeEngine';
import { Rank } from '../types';

interface SimulationResult {
  probabilityOfRuin: number; // 0-1
  expectedValue: number;
  variance: number;
  handsPlayed: number;
  bankrollEnd: number;
}

/**
 * Runs a background simulation to estimate Risk of Ruin based on user performance.
 * 
 * @param bankroll Initial bankroll in Units
 * @param unitBet Size of 1 unit in $ (or just 1 if bankroll is in units)
 * @param handsCount Number of hands to simulate (default 10,000)
 * @param errorRate User's error rate (0-1). e.g. 0.05 = 5% of hands played sub-optimally.
 * @param perfectEdge The edge a perfect counter has (approx 0.01 or 1%).
 * @param perfectVariance The variance of blackjack (approx 1.33).
 */
export const runShadowSession = (
  bankroll: number,
  unitBet: number,
  handsCount: number = 10000,
  errorRate: number = 0,
  perfectEdge: number = 0.01,
  perfectVariance: number = 1.33
): SimulationResult => {
  // Monte Carlo Simulation of ONE long session to determine realized params?
  // Actually, to get RoR, we need the "Risk of Ruin Formula" inputs: Edge and Variance.
  // We can simulate the EFFECT of errors on Edge/Variance.

  // Assumption: Each error costs ~0.5% EV (common heuristic).
  // So Realized Edge = Perfect Edge - (Error Rate * Cost Per Error)
  const costPerError = 0.005;
  const realizedEdge = perfectEdge - (errorRate * costPerError);

  // If edge is negative, RoR is effectively 100% over infinite time, 
  // but for a fixed session, we can simulate.

  // However, the standard RoR formula (Kelly) is:
  // RoR = e ^ ( (-2 * Bankroll * Edge) / Variance )
  // This is for "Infinite Horizon" Risk of Ruin with fixed fractional betting?
  // Or fixed betting? Kelly implies proportional.
  // If proportional (Kelly), RoR is technically 0 (you never bet 0), but practically you hit min bet.

  // Let's implement the formula for Fixed Betting as a baseline or proportional if implied.
  // The prompt asks to "simulate... using ShoeEngine".
  // Let's try to actually SIMULATE the outcomes to verify the variance/edge.

  // We will run a simplified loop mimicking the distribution of outcomes
  // because running full Shoe logic 10,000 times in JS might be slow.
  // BUT prompt says "using ShoeEngine".
  // We will trust the engine is fast enough for 10k iterations if we don't render.

  const shoe = new Shoe(6);
  let currentBankroll = bankroll;
  let totalWinLoss = 0;
  let sumSquaredDiffs = 0; // For variance calc

  // We need to track actual outcomes to calculate realized variance
  const outcomes: number[] = [];

  for (let i = 0; i < handsCount; i++) {
    // 1. Check if shoe needs shuffle
    if (shoe.getCardsRemaining() < 15) {
      shoe.reset();
    }

    // 2. Deal dummy hand (Player vs Dealer)
    // To properly simulate using ShoeEngine, we need to pop cards.
    // We won't play full logic (Hit/Stand) as that requires a Strategy Engine we don't strictly have fully automated yet.
    // We will approximation:
    // - Pop cards to simulate flow.
    // - Assign a random outcome based on True Count advantage.

    // Simulate flow to advance state
    const c1 = shoe.pop();
    const c2 = shoe.pop();
    const d1 = shoe.pop();
    const d2 = shoe.pop(); // Hole card

    // Calculate True Count for this hand
    const rc = shoe.getRunningCount();
    const decks = shoe.getCardsRemaining() / 52;
    const tc = shoe.getTrueCount(decks);

    // Determine Outcome based on Math
    // Base win rate ~42%, Push ~8%, Loss ~50%.
    // Advantage adds to Win Rate.
    // TC +1 => +0.5% Advantage.
    const advantage = (tc * 0.005);
    const effectiveEdge = realizedEdge + advantage; // Baseline edge adjusted by TC? 
    // Actually, PerfectEdge usually implies Average Edge. 
    // Let's assume baseline game is -0.5%.
    // Realized Edge (User) = -0.005 + (TC * 0.005) - (Errors).

    const userRoundEdge = -0.005 + (tc * 0.005) - (Math.random() < errorRate ? costPerError : 0);

    // Simulate Win/Loss/Push based on Edge
    // We can shift the probability distribution.
    // P(Win) = 0.422 + (Edge / 2)? Rough approx.
    // Better: outcome = random + edge.
    // Standard deviation of 1 hand = 1.15.

    // Result in Units
    // Noise + Signal
    const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 2 * 1.15; // Rough Gaussian approx
    // Or just simple discrete outcome:
    const rand = Math.random();
    let result = 0;

    // Simple Blackjack Distribution:
    // BJ (4.8%): +1.5
    // Win (43%): +1
    // Push (9%): 0
    // Loss (48%): -1
    // Adjusted by edge.

    const pWin = 0.43 + (userRoundEdge * 0.5);
    const pPush = 0.09;
    const pLoss = 1 - pWin - pPush;

    if (rand < pWin) result = 1; // Simplify BJ to win for speed or adding bias
    else if (rand < pWin + pPush) result = 0;
    else result = -1;

    // Bet Sizing (Kelly or Flat?)
    // Sim should probably assume Flat for "Unit Bet" param, OR Kelly if implied.
    // "unitBet" param implies flat betting of X units? Or 1 unit = $X.
    // Let's assume Bet = 1 Unit * Spread.
    // Spread based on TC.
    let bet = 1;
    if (tc >= 1) bet = Math.min(8, Math.pow(2, Math.floor(tc))); // 1-8 spread

    const handPnL = result * bet * unitBet;
    currentBankroll += handPnL;
    outcomes.push(handPnL);
    totalWinLoss += handPnL;

    if (currentBankroll <= 0) {
      // Ruin reached in this specific trajectory
      // But this function returns a generic Probability?
      // If we run ONE session, we return 0 or 1.
      // To return a Probability, we assume this function calculates the METRICS (Edge/Var)
      // and returns the Formula-based RoR.
      break;
    }
  }

  // Calculate stats from the simulation
  const n = outcomes.length;
  const meanPerHand = totalWinLoss / n; // Realized EV per hand (in $)

  // Variance
  const mean = totalWinLoss / n;
  const variance = outcomes.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;

  // Edge ratio (Expected Return / StdDev?)
  // RoR Formula (Infinite):
  // e ^ (-2 * Bankroll * Mean / Variance)
  // Ensure we use consistent units (Dollars or Units).

  // If Mean is negative, RoR is 100%
  let ror = 0;
  if (meanPerHand <= 0) {
    ror = 1;
  } else {
    // RoR = exp( -2 * B * mu / sigma^2 )
    // B = Starting Bankroll
    // mu = Mean win per hand
    // sigma^2 = Variance per hand
    ror = Math.exp((-2 * bankroll * meanPerHand) / variance);
  }

  // Clamp
  ror = Math.min(1, Math.max(0, ror));

  return {
    probabilityOfRuin: ror,
    expectedValue: totalWinLoss,
    variance: variance,
    handsPlayed: n,
    bankrollEnd: currentBankroll
  };
};
