import { derivative, evaluate, parse } from 'mathjs';

export function computeDerivative(expr: string, variable: string = 'x'): string {
  try {
    const node = parse(expr);
    const deriv = derivative(node, variable);
    return deriv.toString();
  } catch (e) {
    throw new Error(`Failed to compute derivative: ${(e as Error).message}`);
  }
}

export function computeDefiniteIntegral(expr: string, lower: number, upper: number, n: number = 1000): number {
  // Simpson's rule
  if (n % 2 !== 0) n++;
  const h = (upper - lower) / n;
  const compiled = parse(expr).compile();

  let sum = evaluateAt(compiled, lower) + evaluateAt(compiled, upper);

  for (let i = 1; i < n; i++) {
    const x = lower + i * h;
    const coeff = i % 2 === 0 ? 2 : 4;
    sum += coeff * evaluateAt(compiled, x);
  }

  return (h / 3) * sum;
}

function evaluateAt(compiled: { evaluate: (scope: Record<string, number>) => number }, x: number): number {
  try {
    const result = compiled.evaluate({ x });
    return typeof result === 'number' && Number.isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

export function computeLimit(expr: string, point: number, precision: number = 1e-10): number {
  const compiled = parse(expr).compile();

  // Try direct evaluation first
  try {
    const direct = compiled.evaluate({ x: point }) as number;
    if (typeof direct === 'number' && Number.isFinite(direct)) {
      return direct;
    }
  } catch {
    // Fall through to numerical approach
  }

  // Numerical approach from both sides
  const steps = [1e-1, 1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];
  let leftVal = NaN;
  let rightVal = NaN;

  for (const h of steps) {
    try {
      const left = compiled.evaluate({ x: point - h }) as number;
      const right = compiled.evaluate({ x: point + h }) as number;

      if (typeof left === 'number' && Number.isFinite(left)) leftVal = left;
      if (typeof right === 'number' && Number.isFinite(right)) rightVal = right;
    } catch {}
  }

  if (Number.isFinite(leftVal) && Number.isFinite(rightVal)) {
    if (Math.abs(leftVal - rightVal) < precision * 1000) {
      return (leftVal + rightVal) / 2;
    }
  }

  if (Number.isFinite(leftVal)) return leftVal;
  if (Number.isFinite(rightVal)) return rightVal;

  throw new Error('Limit does not exist or could not be computed');
}

export function evaluateExpressionAtPoint(expr: string, x: number): number {
  return evaluate(expr, { x }) as number;
}
