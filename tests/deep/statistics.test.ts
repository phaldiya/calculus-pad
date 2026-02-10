import { computeStats, linearRegression, polynomialRegression } from '../../src/lib/statisticsEngine';
import { datasets, xyPoints } from '../helpers/fixtures';

describe('QA Audit: Statistics - Deep', () => {
  describe('empty data', () => {
    it('throws "No data provided"', () => {
      expect(() => computeStats([])).toThrow('No data provided');
    });
  });

  describe('single element', () => {
    it('mean=42, variance=0, mode=[]', () => {
      const stats = computeStats(datasets.single);
      expect(stats.mean).toBe(42);
      expect(stats.variance).toBe(0);
      expect(stats.mode).toEqual([]);
    });
  });

  describe('all identical values', () => {
    it('variance=0, range=0', () => {
      const stats = computeStats(datasets.identical);
      expect(stats.variance).toBe(0);
      expect(stats.range).toBe(0);
      expect(stats.stdDev).toBe(0);
    });
  });

  describe('even count median', () => {
    it('median of [1,2,3,4,5,6] = 3.5', () => {
      const stats = computeStats(datasets.even);
      expect(stats.median).toBe(3.5);
    });
  });

  describe('multimodal', () => {
    it('[1,1,2,2,3] → mode=[1,2]', () => {
      const stats = computeStats(datasets.multimodal);
      expect(stats.mode.sort()).toEqual([1, 2]);
    });
  });

  describe('no mode (all unique)', () => {
    it('[1,2,3,4] → mode=[]', () => {
      const stats = computeStats(datasets.noMode);
      expect(stats.mode).toEqual([]);
    });
  });

  describe('negative values', () => {
    it('handles negative data correctly', () => {
      const stats = computeStats(datasets.negative);
      expect(stats.min).toBe(-3);
      expect(stats.max).toBe(4);
      expect(stats.mean).toBeCloseTo(0.4);
    });
  });

  describe('large dataset', () => {
    it('handles 10000 values', () => {
      const data = Array.from({ length: 10000 }, (_, i) => i);
      const stats = computeStats(data);
      expect(stats.count).toBe(10000);
      expect(stats.mean).toBeCloseTo(4999.5);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(9999);
    });
  });

  describe('quartiles', () => {
    it('[1..10] quartiles', () => {
      const stats = computeStats(datasets.ten);
      // percentile(sorted, 25) with index = 0.25 * 9 = 2.25
      // sorted[2] + (sorted[3] - sorted[2]) * 0.25 = 3 + (4-3)*0.25 = 3.25
      expect(stats.q1).toBeCloseTo(3.25);
      // percentile(sorted, 75) with index = 0.75 * 9 = 6.75
      // sorted[6] + (sorted[7] - sorted[6]) * 0.75 = 7 + (8-7)*0.75 = 7.75
      expect(stats.q3).toBeCloseTo(7.75);
    });
  });

  describe('population variance', () => {
    it('divides by n, not n-1', () => {
      // For [1,2,3,4,5]: mean=3, sum of (x-mean)^2 = 10
      // Population variance = 10/5 = 2
      const stats = computeStats(datasets.simple5);
      expect(stats.variance).toBeCloseTo(2);
    });
  });

  describe('linearRegression', () => {
    it('2 points (perfect fit)', () => {
      const result = linearRegression(xyPoints.twoPoints);
      expect(result.coefficients[0]).toBeCloseTo(2);
      expect(result.coefficients[1]).toBeCloseTo(1);
      expect(result.rSquared).toBeCloseTo(1);
    });

    it('1 point throws', () => {
      expect(() => linearRegression(xyPoints.singlePoint)).toThrow('Need at least 2 data points');
    });

    it('horizontal line: slope≈0, R²=1', () => {
      const result = linearRegression(xyPoints.horizontal);
      expect(result.coefficients[0]).toBeCloseTo(0);
      expect(result.rSquared).toBeCloseTo(1);
    });

    it('all same x: handles gracefully', () => {
      // With same x, denominator is 0 → slope is NaN/Infinity
      // Just verify it doesn't crash
      expect(() => linearRegression(xyPoints.sameX)).not.toThrow();
    });

    it('R² is between 0 and 1 for noisy data', () => {
      const noisy = [
        { x: 1, y: 2.1 },
        { x: 2, y: 3.9 },
        { x: 3, y: 6.2 },
        { x: 4, y: 7.8 },
        { x: 5, y: 10.1 },
      ];
      const result = linearRegression(noisy);
      expect(result.rSquared).toBeGreaterThanOrEqual(0);
      expect(result.rSquared).toBeLessThanOrEqual(1);
    });
  });

  describe('polynomialRegression', () => {
    it('insufficient points throws', () => {
      expect(() => polynomialRegression(xyPoints.twoPoints, 2)).toThrow('Need at least 3');
    });

    it('degree 3 fit', () => {
      const points = [
        { x: -2, y: -8 },
        { x: -1, y: -1 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 8 },
      ];
      const result = polynomialRegression(points, 3);
      expect(result.rSquared).toBeCloseTo(1, 2);
    });

    it('degree 4 fit', () => {
      const points = [
        { x: -2, y: 16 },
        { x: -1, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 16 },
      ];
      const result = polynomialRegression(points, 4);
      expect(result.rSquared).toBeCloseTo(1, 2);
    });

    it('equation string is well-formed', () => {
      const result = polynomialRegression(xyPoints.quadratic, 2);
      expect(result.equation).toContain('y = ');
      expect(result.equation).toContain('x');
    });

    it('ssTot=0 edge case returns R²=1', () => {
      // All y values are the same → ssTot=0
      const points = [
        { x: 1, y: 5 },
        { x: 2, y: 5 },
        { x: 3, y: 5 },
      ];
      const result = polynomialRegression(points, 1);
      expect(result.rSquared).toBe(1);
    });
  });
});
