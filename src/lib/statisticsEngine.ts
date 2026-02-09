import type { RegressionResult, StatsResults } from '../types';

export function computeStats(data: number[]): StatsResults {
  const n = data.length;
  if (n === 0) throw new Error('No data provided');

  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const variance = data.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  // Median
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

  // Mode
  const freq = new Map<number, number>();
  for (const v of data) freq.set(v, (freq.get(v) || 0) + 1);
  const maxFreq = Math.max(...freq.values());
  const mode = maxFreq > 1 ? [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v) : [];

  // Quartiles
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);

  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    count: n,
    sum,
    q1,
    q3,
    iqr: q3 - q1,
  };
}

function percentile(sorted: number[], p: number): number {
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function linearRegression(points: { x: number; y: number }[]): RegressionResult {
  const n = points.length;
  if (n < 2) throw new Error('Need at least 2 data points');

  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x ** 2, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  const meanY = sumY / n;
  const ssRes = points.reduce((a, p) => a + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const ssTot = points.reduce((a, p) => a + (p.y - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  const xMin = Math.min(...points.map((p) => p.x));
  const xMax = Math.max(...points.map((p) => p.x));
  const predictions: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / 100 || 1;
  for (let x = xMin - step * 5; x <= xMax + step * 5; x += step) {
    predictions.push({ x, y: slope * x + intercept });
  }

  return {
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    coefficients: [slope, intercept],
    rSquared,
    predictions,
  };
}

export function polynomialRegression(points: { x: number; y: number }[], degree: number): RegressionResult {
  const n = points.length;
  if (n < degree + 1) throw new Error(`Need at least ${degree + 1} data points for degree ${degree}`);

  // Build normal equations
  const m = degree + 1;
  const A: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
  const b: number[] = Array(m).fill(0);

  for (const p of points) {
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        A[i][j] += p.x ** (i + j);
      }
      b[i] += p.y * p.x ** i;
    }
  }

  // Gaussian elimination
  const coefficients = solveLinearSystem(A, b);

  const meanY = points.reduce((a, p) => a + p.y, 0) / n;
  const ssRes = points.reduce((a, p) => {
    const pred = coefficients.reduce((sum, c, i) => sum + c * p.x ** i, 0);
    return a + (p.y - pred) ** 2;
  }, 0);
  const ssTot = points.reduce((a, p) => a + (p.y - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  const xMin = Math.min(...points.map((p) => p.x));
  const xMax = Math.max(...points.map((p) => p.x));
  const predictions: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / 100 || 1;
  for (let x = xMin - step * 5; x <= xMax + step * 5; x += step) {
    const y = coefficients.reduce((sum, c, i) => sum + c * x ** i, 0);
    predictions.push({ x, y });
  }

  const terms = coefficients
    .map((c, i) => {
      if (i === 0) return c.toFixed(4);
      if (i === 1) return `${c.toFixed(4)}x`;
      return `${c.toFixed(4)}x^${i}`;
    })
    .reverse()
    .join(' + ');

  return {
    equation: `y = ${terms}`,
    coefficients,
    rSquared,
    predictions,
  };
}

function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const aug = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-12) continue;

    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= aug[i][j] * x[j];
    }
    x[i] /= aug[i][i] || 1;
  }

  return x;
}
