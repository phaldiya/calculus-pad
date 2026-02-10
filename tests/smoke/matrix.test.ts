import { createMatrix, formatMatrixResult, performMatrixOperation } from '../../src/lib/matrixEngine';
import { generateMatrixSteps } from '../../src/lib/matrixStepEngine';
import { matrices } from '../helpers/fixtures';
import { applyActions, createTestState } from '../helpers/testReducer';

describe('QA Audit: Matrix - Smoke', () => {
  describe('performMatrixOperation', () => {
    it('adds two 2x2 matrices', () => {
      const result = performMatrixOperation('add', matrices.a2x2, matrices.b2x2);
      expect(result).toEqual([
        [6, 8],
        [10, 12],
      ]);
    });

    it('subtracts two 2x2 matrices', () => {
      const result = performMatrixOperation('subtract', matrices.a2x2, matrices.b2x2);
      expect(result).toEqual([
        [-4, -4],
        [-4, -4],
      ]);
    });

    it('multiplies two 2x2 matrices', () => {
      const result = performMatrixOperation('multiply', matrices.a2x2, matrices.b2x2);
      expect(result).toEqual([
        [19, 22],
        [43, 50],
      ]);
    });

    it('computes determinant of 2x2', () => {
      const result = performMatrixOperation('determinant', matrices.a2x2, matrices.b2x2);
      expect(result).toBe(-2);
    });

    it('transposes a 2x2 matrix', () => {
      const result = performMatrixOperation('transpose', matrices.a2x2, matrices.b2x2);
      expect(result).toEqual([
        [1, 3],
        [2, 4],
      ]);
    });

    it('inverts a 2x2 matrix', () => {
      const result = performMatrixOperation('inverse', matrices.a2x2, matrices.b2x2);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('scalar_multiply: 3 * matrix', () => {
      const result = performMatrixOperation('scalar_multiply', matrices.a2x2, matrices.b2x2, 3);
      expect(result).toEqual([
        [3, 6],
        [9, 12],
      ]);
    });
  });

  describe('createMatrix', () => {
    it('creates a 2x3 zero matrix', () => {
      const m = createMatrix(2, 3);
      expect(m).toHaveLength(2);
      expect(m[0]).toHaveLength(3);
      expect(m[0][0]).toBe(0);
    });
  });

  describe('formatMatrixResult', () => {
    it('formats a number', () => {
      expect(formatMatrixResult(-2)).toBe('-2.0000');
    });

    it('formats a 2D array', () => {
      const result = formatMatrixResult([
        [1, 2],
        [3, 4],
      ]);
      expect(result).toContain('1.0000');
      expect(result).toContain('\t');
      expect(result).toContain('\n');
    });
  });

  describe('generateMatrixSteps', () => {
    it('returns empty for null result', () => {
      expect(generateMatrixSteps('add', matrices.a2x2, matrices.b2x2, null)).toEqual([]);
    });
  });

  describe('reducer: matrix actions', () => {
    it('SET_MATRIX updates partial state', () => {
      const state = createTestState();
      const next = applyActions(state, [{ type: 'SET_MATRIX', updates: { operation: 'determinant' } }]);
      expect(next.matrix.operation).toBe('determinant');
    });

    it('CLEAR_MATRIX resets to initial', () => {
      const state = createTestState({
        matrix: {
          matrixA: matrices.a2x2,
          matrixB: matrices.b2x2,
          operation: 'multiply',
          result: [
            [19, 22],
            [43, 50],
          ],
          error: null,
        },
      });
      const next = applyActions(state, [{ type: 'CLEAR_MATRIX' }]);
      expect(next.matrix.operation).toBe('add');
      expect(next.matrix.result).toBeNull();
    });
  });
});
