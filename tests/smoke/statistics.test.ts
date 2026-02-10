import { computeStats, linearRegression, polynomialRegression } from '../../src/lib/statisticsEngine';
import { datasets, xyPoints } from '../helpers/fixtures';
import { applyActions, createTestState } from '../helpers/testReducer';

describe('QA Audit: Statistics - Smoke', () => {
  describe('computeStats', () => {
    it('computes correct stats for [1,2,3,4,5]', () => {
      const stats = computeStats(datasets.simple5);
      expect(stats.mean).toBe(3);
      expect(stats.median).toBe(3);
      expect(stats.count).toBe(5);
      expect(stats.sum).toBe(15);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(5);
      expect(stats.range).toBe(4);
    });

    it('computes correct stdDev and variance for [1,2,3,4,5]', () => {
      const stats = computeStats(datasets.simple5);
      expect(stats.variance).toBeCloseTo(2);
      expect(stats.stdDev).toBeCloseTo(Math.sqrt(2));
    });

    it('detects mode for [1,1,2,3]', () => {
      const stats = computeStats(datasets.withRepeats);
      expect(stats.mode).toEqual([1]);
    });
  });

  describe('linearRegression', () => {
    it('fits y=2x+1 data: slope≈2, intercept≈1, R²≈1', () => {
      const result = linearRegression(xyPoints.linear);
      expect(result.coefficients[0]).toBeCloseTo(2, 4);
      expect(result.coefficients[1]).toBeCloseTo(1, 4);
      expect(result.rSquared).toBeCloseTo(1, 4);
    });
  });

  describe('polynomialRegression', () => {
    it('fits y=x² data with R²≈1', () => {
      const result = polynomialRegression(xyPoints.quadratic, 2);
      expect(result.rSquared).toBeCloseTo(1, 2);
    });
  });

  describe('reducer: statistics actions', () => {
    it('SET_STATISTICS updates partial state', () => {
      const state = createTestState();
      const next = applyActions(state, [
        { type: 'SET_STATISTICS', updates: { data: [1, 2, 3], dataInput: '1, 2, 3' } },
      ]);
      expect(next.statistics.data).toEqual([1, 2, 3]);
      expect(next.statistics.dataInput).toBe('1, 2, 3');
    });

    it('CLEAR_STATISTICS resets to initial', () => {
      const state = createTestState({
        statistics: {
          data: [1, 2, 3],
          dataInput: '1, 2, 3',
          results: null,
          regressionType: 'polynomial',
          regressionDegree: 3,
          regressionResult: null,
          xyData: [],
        },
      });
      const next = applyActions(state, [{ type: 'CLEAR_STATISTICS' }]);
      expect(next.statistics.data).toEqual([]);
      expect(next.statistics.regressionType).toBe('linear');
      expect(next.statistics.regressionDegree).toBe(2);
    });
  });
});
