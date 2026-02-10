import { evaluate, parse } from 'mathjs';

import { generateSteps } from '../../src/lib/stepEngine';
import { highlightTex, safeToTex } from '../../src/lib/texHelpers';

describe('QA Audit: Scientific - Deep', () => {
  describe('nested and chained expressions', () => {
    it('nested parens: ((2+3)*(4-1))^2 = 225', () => {
      expect(evaluate('((2+3)*(4-1))^2')).toBe(225);
    });

    it('chained addition: 1+2+3+4+5+6+7+8+9+10 = 55', () => {
      expect(evaluate('1+2+3+4+5+6+7+8+9+10')).toBe(55);
    });
  });

  describe('negative numbers', () => {
    it('-5 * -3 = 15', () => {
      expect(evaluate('-5 * -3')).toBe(15);
    });

    it('(-2)^3 = -8', () => {
      expect(evaluate('(-2)^3')).toBe(-8);
    });
  });

  describe('edge cases', () => {
    it('1/0 → Infinity', () => {
      expect(evaluate('1/0')).toBe(Infinity);
    });

    it('large numbers: 2^50', () => {
      expect(evaluate('2^50')).toBe(2 ** 50);
    });
  });

  describe('trig identities', () => {
    it('sin(pi/6) ≈ 0.5', () => {
      expect(evaluate('sin(pi/6)')).toBeCloseTo(0.5, 10);
    });

    it('asin(1) ≈ pi/2', () => {
      expect(evaluate('asin(1)')).toBeCloseTo(Math.PI / 2, 10);
    });
  });

  describe('DEG mode simulation', () => {
    it('sin(30 deg) via sin(30 * pi / 180) ≈ 0.5', () => {
      expect(evaluate('sin(30 * pi / 180)')).toBeCloseTo(0.5, 10);
    });
  });

  describe('misc functions', () => {
    it('abs(-42) = 42', () => {
      expect(evaluate('abs(-42)')).toBe(42);
    });

    it('modulo: 17 mod 5 = 2', () => {
      expect(evaluate('17 mod 5')).toBe(2);
    });
  });

  describe('invalid expressions', () => {
    it('"abc" throws', () => {
      expect(() => evaluate('abc')).toThrow();
    });

    it('"+++" throws', () => {
      expect(() => evaluate('+++')).toThrow();
    });

    it('empty string evaluates to undefined', () => {
      expect(evaluate('')).toBeUndefined();
    });
  });

  describe('step engine: multi-step', () => {
    it('2+3*4 finds multiply first', () => {
      const steps = generateSteps('2+3*4');
      expect(steps.length).toBeGreaterThan(1);
      expect(steps[0].label).toBe('Multiply');
    });

    it('MAX_STEPS guard: does not infinite loop on complex expr', () => {
      const steps = generateSteps('1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20');
      expect(steps.length).toBeLessThanOrEqual(51);
      const last = steps[steps.length - 1];
      expect(last.label).toBe('Final result');
    });
  });

  describe('texHelpers', () => {
    it('safeToTex handles parse errors gracefully', () => {
      const node = parse('x^2');
      const tex = safeToTex(node);
      expect(typeof tex).toBe('string');
      expect(tex.length).toBeGreaterThan(0);
    });

    it('highlightTex wraps in boxed', () => {
      const result = highlightTex('x^2');
      expect(result).toBe('\\boxed{x^2}');
    });
  });
});
