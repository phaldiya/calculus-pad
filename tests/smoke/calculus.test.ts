import { computeDefiniteIntegral, computeDerivative, computeLimit } from '../../src/lib/calculusEngine';
import { generateDerivativeSteps, generateIntegralSteps, generateLimitSteps } from '../../src/lib/calculusStepEngine';
import { applyActions, createTestState } from '../helpers/testReducer';

describe('QA Audit: Calculus - Smoke', () => {
  describe('computeDerivative', () => {
    it('d/dx(x^2) contains 2 * x', () => {
      const result = computeDerivative('x^2');
      expect(result).toContain('2');
      expect(result).toContain('x');
    });

    it('d/dx(sin(x)) contains cos(x)', () => {
      const result = computeDerivative('sin(x)');
      expect(result).toContain('cos');
    });

    it('d/dx(5) = 0', () => {
      expect(computeDerivative('5')).toBe('0');
    });
  });

  describe('computeDefiniteIntegral', () => {
    it('integral of x^2 from 0 to 1 ≈ 0.3333', () => {
      const result = computeDefiniteIntegral('x^2', 0, 1);
      expect(result).toBeCloseTo(1 / 3, 4);
    });

    it('integral of 1 from 0 to 5 ≈ 5', () => {
      const result = computeDefiniteIntegral('1', 0, 5);
      expect(result).toBeCloseTo(5, 4);
    });
  });

  describe('computeLimit', () => {
    it('limit of sin(x)/x as x→0 ≈ 1', () => {
      const result = computeLimit('sin(x)/x', 0);
      expect(result).toBeCloseTo(1, 4);
    });

    it('limit of x^2 as x→3 = 9', () => {
      const result = computeLimit('x^2', 3);
      expect(result).toBeCloseTo(9);
    });
  });

  describe('generateDerivativeSteps', () => {
    it('has Setup and Final result steps for x^2', () => {
      const steps = generateDerivativeSteps('x^2');
      expect(steps.length).toBeGreaterThanOrEqual(2);
      expect(steps[0].label).toBe('Setup');
      expect(steps[steps.length - 1].label).toBe('Final result');
    });
  });

  describe('generateIntegralSteps', () => {
    it('has Setup and Result steps', () => {
      const steps = generateIntegralSteps('x^2', '0', '1', '0.3333');
      expect(steps.length).toBeGreaterThanOrEqual(2);
      expect(steps[0].label).toBe('Setup');
      expect(steps[steps.length - 1].label).toBe('Result');
    });
  });

  describe('generateLimitSteps', () => {
    it('has Setup, Left-hand, Right-hand, and Conclusion', () => {
      const steps = generateLimitSteps('sin(x)/x', '0', '1');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Setup');
      expect(labels).toContain('Left-hand approach');
      expect(labels).toContain('Right-hand approach');
      expect(labels).toContain('Conclusion');
    });
  });

  describe('reducer: calculus actions', () => {
    it('SET_CALCULUS updates partial state', () => {
      const state = createTestState();
      const next = applyActions(state, [
        { type: 'SET_CALCULUS', updates: { derivativeExpr: 'x^2', derivativeResult: '2*x' } },
      ]);
      expect(next.calculus.derivativeExpr).toBe('x^2');
      expect(next.calculus.derivativeResult).toBe('2*x');
      expect(next.calculus.integralExpr).toBe('');
    });

    it('CLEAR_CALCULUS resets to initial state', () => {
      const state = createTestState({
        calculus: {
          derivativeExpr: 'x^2',
          derivativeResult: '2*x',
          integralExpr: 'x',
          integralLower: '0',
          integralUpper: '1',
          integralResult: '0.5',
          limitExpr: 'x',
          limitPoint: '0',
          limitResult: '0',
        },
      });
      const next = applyActions(state, [{ type: 'CLEAR_CALCULUS' }]);
      expect(next.calculus.derivativeExpr).toBe('');
      expect(next.calculus.integralExpr).toBe('');
      expect(next.calculus.limitExpr).toBe('');
    });
  });
});
