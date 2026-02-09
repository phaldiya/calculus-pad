import type { MathNode } from 'mathjs';

export function matrixToTex(m: number[][]): string {
  const rows = m.map((row) => row.map((v) => (Number.isInteger(v) ? v.toString() : v.toFixed(4))).join(' & '));
  return `\\begin{bmatrix} ${rows.join(' \\\\ ')} \\end{bmatrix}`;
}

export function integralTex(expr: string, lower: string, upper: string): string {
  return `\\int_{${lower}}^{${upper}} ${expr} \\, dx`;
}

export function limitTex(expr: string, variable: string, point: string): string {
  return `\\lim_{${variable} \\to ${point}} ${expr}`;
}

export function derivativeTex(expr: string, variable: string = 'x'): string {
  return `\\frac{d}{d${variable}} \\left[ ${expr} \\right]`;
}

export function highlightTex(tex: string): string {
  return `\\boxed{${tex}}`;
}

export function safeToTex(node: MathNode): string {
  try {
    return node.toTex();
  } catch {
    return node.toString();
  }
}
