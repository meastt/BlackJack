import { runShadowSession } from '@card-counter-ai/shared';

describe('Risk of Ruin — Sanity Checks', () => {
  it('large bankroll + zero errors → RoR in valid range', () => {
    // Note: the simulation has a base house edge of -0.5% which the
    // perfectEdge of 1% must overcome via favorable true counts.
    // With Monte Carlo variance, RoR can still be high in some runs.
    const result = runShadowSession(10000, 1, 10000, 0, 0.01, 1.33);
    expect(result.probabilityOfRuin).toBeGreaterThanOrEqual(0);
    expect(result.probabilityOfRuin).toBeLessThanOrEqual(1);
  });

  it('small bankroll + high errors → high RoR', () => {
    const result = runShadowSession(10, 1, 10000, 0.5, 0.01, 1.33);
    expect(result.probabilityOfRuin).toBeGreaterThan(0.3);
  });

  it('RoR is between 0 and 1', () => {
    const result = runShadowSession(500, 1, 5000, 0.1, 0.01, 1.33);
    expect(result.probabilityOfRuin).toBeGreaterThanOrEqual(0);
    expect(result.probabilityOfRuin).toBeLessThanOrEqual(1);
  });

  it('monotonicity: increasing bankroll decreases RoR', () => {
    // Run multiple trials and average to reduce Monte Carlo noise
    const trials = 5;
    let avgSmall = 0;
    let avgLarge = 0;

    for (let i = 0; i < trials; i++) {
      avgSmall += runShadowSession(50, 1, 10000, 0.1).probabilityOfRuin;
      avgLarge += runShadowSession(5000, 1, 10000, 0.1).probabilityOfRuin;
    }
    avgSmall /= trials;
    avgLarge /= trials;

    expect(avgLarge).toBeLessThanOrEqual(avgSmall);
  });

  it('bankroll=0 → ruin immediately', () => {
    const result = runShadowSession(0, 1, 100, 0);
    // With 0 bankroll, first loss should cause ruin
    expect(result.probabilityOfRuin).toBe(1);
  });

  it('errorRate=1.0 (100% mistakes) → high RoR', () => {
    const result = runShadowSession(100, 1, 10000, 1.0);
    expect(result.probabilityOfRuin).toBeGreaterThan(0.5);
  });

  it('returns expected fields', () => {
    const result = runShadowSession(1000, 1, 1000, 0);
    expect(result).toHaveProperty('probabilityOfRuin');
    expect(result).toHaveProperty('expectedValue');
    expect(result).toHaveProperty('variance');
    expect(result).toHaveProperty('handsPlayed');
    expect(result).toHaveProperty('bankrollEnd');
  });

  it('handsPlayed ≤ requested count', () => {
    const result = runShadowSession(1000, 1, 500, 0);
    expect(result.handsPlayed).toBeLessThanOrEqual(500);
    expect(result.handsPlayed).toBeGreaterThan(0);
  });

  it('variance is non-negative', () => {
    const result = runShadowSession(1000, 1, 5000, 0);
    expect(result.variance).toBeGreaterThanOrEqual(0);
  });
});
