import type { StepItem } from '../components/shared/StepViewer';
import type { MatrixOperation } from '../types';
import { matrixToTex } from './texHelpers';

function fmt(v: number): string {
  return Number.isInteger(v) ? v.toString() : v.toFixed(4);
}

function generateAddSubtractSteps(
  op: 'add' | 'subtract',
  a: number[][],
  b: number[][],
  result: number[][],
): StepItem[] {
  const steps: StepItem[] = [];
  const symbol = op === 'add' ? '+' : '-';
  const label = op === 'add' ? 'Addition' : 'Subtraction';

  steps.push({
    label: `Matrix ${label}`,
    contentTex: `${matrixToTex(a)} ${symbol} ${matrixToTex(b)}`,
    explanation: `Element-wise ${op === 'add' ? 'addition' : 'subtraction'}: c_{ij} = a_{ij} ${symbol} b_{ij}`,
  });

  const rows = a.length;
  const cols = a[0].length;
  const exampleRow = Math.min(0, rows - 1);
  const exampleCol = Math.min(0, cols - 1);

  steps.push({
    label: 'Element-wise computation',
    contentTex: `c_{${exampleRow + 1}${exampleCol + 1}} = ${fmt(a[exampleRow][exampleCol])} ${symbol} ${fmt(b[exampleRow][exampleCol])} = ${fmt(result[exampleRow][exampleCol])}`,
    explanation: `Each element: c_{ij} = a_{ij} ${symbol} b_{ij}`,
  });

  steps.push({
    label: 'Result',
    contentTex: `= ${matrixToTex(result)}`,
  });

  return steps;
}

function generateMultiplySteps(a: number[][], b: number[][], result: number[][]): StepItem[] {
  const steps: StepItem[] = [];

  steps.push({
    label: 'Matrix Multiplication',
    contentTex: `${matrixToTex(a)} \\times ${matrixToTex(b)}`,
    explanation: 'Each element is a dot product of a row from A and a column from B',
  });

  steps.push({
    label: 'Dot product formula',
    contentTex: `c_{ij} = \\sum_{k} a_{ik} \\cdot b_{kj}`,
    explanation: 'Multiply corresponding elements and sum',
  });

  const dotTerms = a[0].map((_, k) => `${fmt(a[0][k])} \\cdot ${fmt(b[k][0])}`).join(' + ');
  steps.push({
    label: 'Example: c_{11}',
    contentTex: `c_{11} = ${dotTerms} = ${fmt(result[0][0])}`,
    explanation: 'Dot product of row 1 of A and column 1 of B',
  });

  steps.push({
    label: 'Result',
    contentTex: `= ${matrixToTex(result)}`,
  });

  return steps;
}

function generateDeterminantSteps(a: number[][], result: number): StepItem[] {
  const steps: StepItem[] = [];
  const n = a.length;

  steps.push({
    label: 'Determinant',
    contentTex: `\\det ${matrixToTex(a)}`,
    explanation: `Computing the determinant of a ${n}x${n} matrix`,
  });

  if (n === 2) {
    steps.push({
      label: '2x2 Formula',
      contentTex: `\\det = a_{11} \\cdot a_{22} - a_{12} \\cdot a_{21}`,
      explanation: 'det = ad - bc for a 2x2 matrix',
    });

    steps.push({
      label: 'Substitute values',
      contentTex: `= ${fmt(a[0][0])} \\cdot ${fmt(a[1][1])} - ${fmt(a[0][1])} \\cdot ${fmt(a[1][0])} = ${fmt(result)}`,
    });
  } else if (n === 3) {
    steps.push({
      label: 'Cofactor expansion (row 1)',
      contentTex: `\\det = a_{11} \\cdot C_{11} - a_{12} \\cdot C_{12} + a_{13} \\cdot C_{13}`,
      explanation: 'Expanding along the first row using cofactors',
    });

    const c11 = a[1][1] * a[2][2] - a[1][2] * a[2][1];
    const c12 = a[1][0] * a[2][2] - a[1][2] * a[2][0];
    const c13 = a[1][0] * a[2][1] - a[1][1] * a[2][0];

    steps.push({
      label: 'Compute cofactors',
      contentTex: `C_{11} = ${fmt(c11)}, \\quad C_{12} = ${fmt(c12)}, \\quad C_{13} = ${fmt(c13)}`,
      explanation: 'Each cofactor is the determinant of the 2x2 minor',
    });

    steps.push({
      label: 'Result',
      contentTex: `= ${fmt(a[0][0])} \\cdot ${fmt(c11)} - ${fmt(a[0][1])} \\cdot ${fmt(c12)} + ${fmt(a[0][2])} \\cdot ${fmt(c13)} = ${fmt(result)}`,
    });
  } else {
    steps.push({
      label: 'Result',
      contentTex: `\\det = ${fmt(result)}`,
      explanation: 'Computed via cofactor expansion',
    });
  }

  return steps;
}

function generateInverseSteps(a: number[][], result: number[][]): StepItem[] {
  const steps: StepItem[] = [];
  const n = a.length;

  steps.push({
    label: 'Matrix Inverse',
    contentTex: `${matrixToTex(a)}^{-1}`,
    explanation: `Find the inverse of the ${n}x${n} matrix`,
  });

  if (n === 2) {
    const det = a[0][0] * a[1][1] - a[0][1] * a[1][0];
    steps.push({
      label: '2x2 Inverse formula',
      contentTex: `A^{-1} = \\frac{1}{\\det(A)} \\begin{bmatrix} a_{22} & -a_{12} \\\\ -a_{21} & a_{11} \\end{bmatrix}`,
      explanation: 'Swap diagonal, negate off-diagonal, divide by determinant',
    });

    steps.push({
      label: 'Determinant',
      contentTex: `\\det(A) = ${fmt(a[0][0])} \\cdot ${fmt(a[1][1])} - ${fmt(a[0][1])} \\cdot ${fmt(a[1][0])} = ${fmt(det)}`,
    });

    steps.push({
      label: 'Adjugate / det',
      contentTex: `= \\frac{1}{${fmt(det)}} \\begin{bmatrix} ${fmt(a[1][1])} & ${fmt(-a[0][1])} \\\\ ${fmt(-a[1][0])} & ${fmt(a[0][0])} \\end{bmatrix}`,
    });
  } else {
    steps.push({
      label: 'Method',
      contentTex: `A^{-1} = \\frac{1}{\\det(A)} \\cdot \\text{adj}(A)`,
      explanation: 'Using the adjugate matrix method',
    });
  }

  steps.push({
    label: 'Result',
    contentTex: `= ${matrixToTex(result)}`,
  });

  return steps;
}

function generateTransposeSteps(a: number[][], result: number[][]): StepItem[] {
  return [
    {
      label: 'Transpose',
      contentTex: `${matrixToTex(a)}^T`,
      explanation: "Swap rows and columns: a'_{ij} = a_{ji}",
    },
    {
      label: 'Result',
      contentTex: `= ${matrixToTex(result)}`,
    },
  ];
}

export function generateMatrixSteps(
  operation: MatrixOperation,
  matrixA: number[][],
  matrixB: number[][],
  result: number[][] | number | string | null,
): StepItem[] {
  if (result === null) return [];

  switch (operation) {
    case 'add':
    case 'subtract':
      return generateAddSubtractSteps(operation, matrixA, matrixB, result as number[][]);
    case 'multiply':
      return generateMultiplySteps(matrixA, matrixB, result as number[][]);
    case 'determinant':
      return generateDeterminantSteps(matrixA, result as number);
    case 'inverse':
      return generateInverseSteps(matrixA, result as number[][]);
    case 'transpose':
      return generateTransposeSteps(matrixA, result as number[][]);
    default:
      return [];
  }
}
