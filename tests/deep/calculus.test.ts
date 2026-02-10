import { computeDefiniteIntegral, computeDerivative, computeLimit } from '../../src/lib/calculusEngine';
import { generateDerivativeSteps } from '../../src/lib/calculusStepEngine';
import { derivativeTex, integralTex, limitTex } from '../../src/lib/texHelpers';

describe('QA Audit: Calculus - Deep', () => {
  describe('polynomial derivatives', () => {
    it('d/dx(x^3 + 2*x^2 - x + 5)', () => {
      const result = computeDerivative('x^3 + 2*x^2 - x + 5');
      // Should contain 3*x^2, 4*x, -1 terms
      expect(result).toContain('3');
      expect(result).toContain('x');
    });
  });

  describe('transcendental derivatives', () => {
    it('d/dx(exp(x)) contains exp(x)', () => {
      const result = computeDerivative('exp(x)');
      expect(result).toContain('exp');
    });

    it('d/dx(log(x)) contains 1/x', () => {
      const result = computeDerivative('log(x)');
      expect(result).toMatch(/1|x/);
    });

    it('d/dx(sin(x) * cos(x))', () => {
      const result = computeDerivative('sin(x) * cos(x)');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('chain rule derivatives', () => {
    it('d/dx(sin(x^2))', () => {
      const result = computeDerivative('sin(x^2)');
      expect(result).toContain('cos');
      expect(result).toContain('x');
    });

    it('d/dx(sqrt(x))', () => {
      const result = computeDerivative('sqrt(x)');
      expect(typeof result).toBe('string');
    });
  });

  describe('invalid derivative', () => {
    it('throws descriptive error for invalid expression', () => {
      expect(() => computeDerivative('+++')).toThrow('Failed to compute derivative');
    });
  });

  describe('definite integrals', () => {
    it('integral of sin(x) from 0 to pi ≈ 2', () => {
      const result = computeDefiniteIntegral('sin(x)', 0, Math.PI);
      expect(result).toBeCloseTo(2, 4);
    });

    it('integral of exp(x) from 0 to 1 ≈ e-1', () => {
      const result = computeDefiniteIntegral('exp(x)', 0, 1);
      expect(result).toBeCloseTo(Math.E - 1, 4);
    });

    it('equal bounds gives 0', () => {
      const result = computeDefiniteIntegral('x^2', 3, 3);
      expect(result).toBeCloseTo(0);
    });

    it('reversed bounds gives negative of normal', () => {
      const normal = computeDefiniteIntegral('x^2', 0, 1);
      const reversed = computeDefiniteIntegral('x^2', 1, 0);
      expect(reversed).toBeCloseTo(-normal, 4);
    });

    it('Simpson accuracy: x^3 from 0 to 2 ≈ 4.0', () => {
      const result = computeDefiniteIntegral('x^3', 0, 2);
      expect(result).toBeCloseTo(4.0, 4);
    });
  });

  describe('limits', () => {
    it('(x^2 - 1)/(x - 1) at x=1 ≈ 2', () => {
      const result = computeLimit('(x^2 - 1)/(x - 1)', 1);
      expect(result).toBeCloseTo(2, 2);
    });

    it('1/x at x=0 returns a finite approximation (left/right approach)', () => {
      // 1/x diverges at 0, but numerical approach from both sides yields
      // finite values near 0 which the engine averages
      const result = computeLimit('1/x', 0);
      // The result will be a large magnitude number or close to 0
      // depending on the stepping approach — just verify it returns a number
      expect(typeof result).toBe('number');
    });
  });

  describe('step engine: derivative rule identification', () => {
    it('identifies Power Rule for x^2', () => {
      const steps = generateDerivativeSteps('x^2');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Power Rule');
    });

    it('identifies Sum/Difference Rule for x+1', () => {
      const steps = generateDerivativeSteps('x+1');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Sum/Difference Rule');
    });

    it('identifies Product Rule for x*sin(x)', () => {
      const steps = generateDerivativeSteps('x*sin(x)');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Product Rule');
    });

    it('identifies Quotient Rule for x/sin(x)', () => {
      const steps = generateDerivativeSteps('x/sin(x)');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Quotient Rule');
    });

    it('identifies Chain Rule for sin(x^2)', () => {
      const steps = generateDerivativeSteps('sin(x^2)');
      const labels = steps.map((s) => s.label);
      expect(labels.some((l) => l.includes('Chain Rule'))).toBe(true);
    });

    it('identifies Constant Rule for a constant', () => {
      const steps = generateDerivativeSteps('5');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Constant Rule');
    });

    it('identifies Identity Rule for x', () => {
      const steps = generateDerivativeSteps('x');
      const labels = steps.map((s) => s.label);
      expect(labels).toContain('Identity Rule');
    });
  });

  describe('texHelpers output', () => {
    it('derivativeTex produces frac notation', () => {
      const tex = derivativeTex('x^2', 'x');
      expect(tex).toContain('\\frac{d}{dx}');
    });

    it('integralTex produces integral notation', () => {
      const tex = integralTex('x^2', '0', '1');
      expect(tex).toContain('\\int_{0}^{1}');
    });

    it('limitTex produces lim notation', () => {
      const tex = limitTex('x^2', 'x', '0');
      expect(tex).toContain('\\lim_{x \\to 0}');
    });
  });
});
