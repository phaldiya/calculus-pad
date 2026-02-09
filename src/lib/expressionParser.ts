import { evaluate, type MathNode, parse } from 'mathjs';

import type { Variable } from '../types';

export function parseExpression(expr: string): MathNode {
  return parse(expr);
}

export function evaluateExpression(expr: string, scope: Record<string, number> = {}): number {
  return evaluate(expr, scope) as number;
}

export function evaluateOverRange(
  expr: string,
  xMin: number,
  xMax: number,
  numPoints: number = 500,
  variables: Variable[] = [],
): { x: number[]; y: number[] } {
  const xs: number[] = [];
  const ys: number[] = [];
  const step = (xMax - xMin) / (numPoints - 1);
  const compiled = parse(expr).compile();

  const scope: Record<string, number> = {};
  for (const v of variables) {
    scope[v.name] = v.value;
  }

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    try {
      scope.x = x;
      const y = compiled.evaluate(scope) as number;
      if (typeof y === 'number' && Number.isFinite(y)) {
        xs.push(x);
        ys.push(y);
      } else {
        xs.push(x);
        ys.push(NaN);
      }
    } catch {
      xs.push(x);
      ys.push(NaN);
    }
  }

  return { x: xs, y: ys };
}

export function validateExpression(expr: string): { valid: boolean; error?: string } {
  try {
    parse(expr);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
