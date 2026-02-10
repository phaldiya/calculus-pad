import { det, matrix as mMatrix, multiply as mMultiply } from 'mathjs';

import { performMatrixOperation } from '../../src/lib/matrixEngine';
import { generateMatrixSteps } from '../../src/lib/matrixStepEngine';
import { matrixToTex } from '../../src/lib/texHelpers';
import { matrices } from '../helpers/fixtures';

describe('QA Audit: Matrix - Deep', () => {
  describe('3x3 operations', () => {
    const b3x3 = [
      [10, 11, 12],
      [13, 14, 15],
      [16, 17, 18],
    ];

    it('3x3 addition', () => {
      const result = performMatrixOperation('add', matrices.a3x3, b3x3) as number[][];
      expect(result[0][0]).toBe(11);
      expect(result[2][2]).toBe(28);
    });

    it('3x3 determinant (non-singular)', () => {
      // det of a3x3: [[1,2,3],[4,5,6],[7,8,10]] = -3
      const result = performMatrixOperation('determinant', matrices.a3x3, matrices.a3x3);
      expect(result).toBeCloseTo(-3);
    });

    it('3x3 inverse: A * A^-1 ≈ I', () => {
      const inverse = performMatrixOperation('inverse', matrices.a3x3, matrices.a3x3) as number[][];
      const product = (
        mMultiply(mMatrix(matrices.a3x3), mMatrix(inverse)) as unknown as { toArray(): number[][] }
      ).toArray();
      // Check diagonal ≈ 1, off-diagonal ≈ 0
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(product[i][j]).toBeCloseTo(i === j ? 1 : 0, 8);
        }
      }
    });
  });

  describe('non-square transpose', () => {
    it('2x3 → 3x2', () => {
      const result = performMatrixOperation('transpose', matrices.rect2x3, [[0]]) as number[][];
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveLength(2);
      expect(result[0][0]).toBe(1);
      expect(result[0][1]).toBe(4);
    });
  });

  describe('error cases', () => {
    it('singular matrix inverse returns huge values (near-singular in float)', () => {
      // mathjs does not throw for numerically near-singular matrices;
      // it returns an inverse with very large entries due to float precision
      const result = performMatrixOperation('inverse', matrices.singular3x3, matrices.singular3x3) as number[][];
      expect(Array.isArray(result)).toBe(true);
      const maxVal = Math.max(...result.flat().map(Math.abs));
      expect(maxVal).toBeGreaterThan(1e10);
    });

    it('dimension mismatch add throws', () => {
      expect(() => performMatrixOperation('add', matrices.a2x2, matrices.a3x3)).toThrow();
    });

    it('dimension mismatch multiply throws', () => {
      // 2x2 * 3x3 is invalid
      expect(() => performMatrixOperation('multiply', matrices.a2x2, matrices.a3x3)).toThrow();
    });

    it('unknown operation throws', () => {
      expect(() => performMatrixOperation('unknown' as never, matrices.a2x2, matrices.b2x2)).toThrow(
        'Unknown operation',
      );
    });
  });

  describe('special matrices', () => {
    it('identity determinant = 1', () => {
      expect(performMatrixOperation('determinant', matrices.identity2x2, matrices.identity2x2)).toBe(1);
    });

    it('zero matrix determinant = 0', () => {
      expect(performMatrixOperation('determinant', matrices.zero2x2, matrices.zero2x2)).toBe(0);
    });
  });

  describe('edge values', () => {
    it('large values', () => {
      const large = [
        [1e10, 2e10],
        [3e10, 4e10],
      ];
      const result = performMatrixOperation('determinant', large, large);
      expect(typeof result).toBe('number');
    });

    it('negative values', () => {
      const neg = [
        [-1, -2],
        [-3, -4],
      ];
      const result = performMatrixOperation('determinant', neg, neg);
      expect(result).toBeCloseTo(-2);
    });

    it('floats', () => {
      const floats = [
        [1.5, 2.5],
        [3.5, 4.5],
      ];
      const result = performMatrixOperation('determinant', floats, floats);
      expect(result).toBeCloseTo(1.5 * 4.5 - 2.5 * 3.5);
    });
  });

  describe('scalar_multiply edge cases', () => {
    it('scalar 0 zeroes the matrix', () => {
      const result = performMatrixOperation('scalar_multiply', matrices.a2x2, matrices.b2x2, 0) as number[][];
      expect(result).toEqual([
        [0, 0],
        [0, 0],
      ]);
    });

    it('default scalar is 1 (identity)', () => {
      const result = performMatrixOperation('scalar_multiply', matrices.a2x2, matrices.b2x2) as number[][];
      expect(result).toEqual(matrices.a2x2);
    });
  });

  describe('1x1 matrix ops', () => {
    it('1x1 determinant', () => {
      expect(performMatrixOperation('determinant', [[5]], [[5]])).toBe(5);
    });

    it('1x1 addition', () => {
      const result = performMatrixOperation('add', [[2]], [[3]]);
      expect(result).toEqual([[5]]);
    });
  });

  describe('4x4 determinant', () => {
    it('computes a 4x4 determinant', () => {
      const result = performMatrixOperation('determinant', matrices.a4x4, matrices.a4x4);
      expect(typeof result).toBe('number');
      // Verify with mathjs directly
      const expected = det(matrices.a4x4);
      expect(result).toBeCloseTo(expected);
    });
  });

  describe('matrixToTex', () => {
    it('produces bmatrix format', () => {
      const tex = matrixToTex([
        [1, 2],
        [3, 4],
      ]);
      expect(tex).toContain('\\begin{bmatrix}');
      expect(tex).toContain('\\end{bmatrix}');
      expect(tex).toContain('1 & 2');
      expect(tex).toContain('3 & 4');
    });
  });

  describe('generateMatrixSteps', () => {
    it('generates add steps', () => {
      const result = [
        [6, 8],
        [10, 12],
      ];
      const steps = generateMatrixSteps('add', matrices.a2x2, matrices.b2x2, result);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].label).toBe('Matrix Addition');
    });

    it('generates multiply steps', () => {
      const result = [
        [19, 22],
        [43, 50],
      ];
      const steps = generateMatrixSteps('multiply', matrices.a2x2, matrices.b2x2, result);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].label).toBe('Matrix Multiplication');
    });

    it('generates 2x2 determinant steps', () => {
      const steps = generateMatrixSteps('determinant', matrices.a2x2, matrices.b2x2, -2);
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Determinant');
      expect(labels).toContain('2x2 Formula');
    });

    it('generates 3x3 determinant steps', () => {
      const steps = generateMatrixSteps('determinant', matrices.a3x3, matrices.a3x3, -3);
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Determinant');
      expect(labels).toContain('Cofactor expansion (row 1)');
    });

    it('generates inverse steps', () => {
      const inverse = performMatrixOperation('inverse', matrices.a2x2, matrices.b2x2) as number[][];
      const steps = generateMatrixSteps('inverse', matrices.a2x2, matrices.b2x2, inverse);
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Matrix Inverse');
      expect(labels).toContain('Result');
    });

    it('generates transpose steps', () => {
      const result = [
        [1, 3],
        [2, 4],
      ];
      const steps = generateMatrixSteps('transpose', matrices.a2x2, matrices.b2x2, result);
      expect(steps.length).toBe(2);
      expect(steps[0].label).toBe('Transpose');
    });

    it('returns empty for null result', () => {
      expect(generateMatrixSteps('add', matrices.a2x2, matrices.b2x2, null)).toEqual([]);
    });
  });
});
