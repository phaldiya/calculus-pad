import { add, det, inv, matrix as mMatrix, multiply, subtract, transpose } from 'mathjs';

import type { MatrixOperation } from '../types';

export function performMatrixOperation(
  operation: MatrixOperation,
  matrixA: number[][],
  matrixB: number[][],
  scalar?: number,
): number[][] | number | string {
  switch (operation) {
    case 'add':
      return (add(mMatrix(matrixA), mMatrix(matrixB)) as unknown as { toArray(): number[][] }).toArray();
    case 'subtract':
      return (subtract(mMatrix(matrixA), mMatrix(matrixB)) as unknown as { toArray(): number[][] }).toArray();
    case 'multiply':
      return (multiply(mMatrix(matrixA), mMatrix(matrixB)) as unknown as { toArray(): number[][] }).toArray();
    case 'determinant':
      return det(matrixA) as number;
    case 'inverse':
      return inv(matrixA) as number[][];
    case 'transpose':
      return transpose(matrixA) as number[][];
    case 'scalar_multiply':
      return (multiply(scalar ?? 1, mMatrix(matrixA)) as unknown as { toArray(): number[][] }).toArray();
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

export function createMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

export function formatMatrixResult(result: number[][] | number | string): string {
  if (typeof result === 'number') return result.toFixed(4);
  if (typeof result === 'string') return result;
  return result.map((row) => row.map((v) => v.toFixed(4)).join('\t')).join('\n');
}
