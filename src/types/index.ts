export type TabId = 'scientific' | 'graphing' | 'calculus' | 'matrix' | 'statistics';

export interface Equation {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

export interface PointData {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  visible: boolean;
  label: string;
  mode: 'markers' | 'lines' | 'lines+markers';
}

export interface CalculusState {
  derivativeExpr: string;
  derivativeResult: string;
  integralExpr: string;
  integralLower: string;
  integralUpper: string;
  integralResult: string;
  limitExpr: string;
  limitPoint: string;
  limitResult: string;
}

export interface MatrixState {
  matrixA: number[][];
  matrixB: number[][];
  operation: MatrixOperation;
  result: number[][] | number | string | null;
  error: string | null;
}

export type MatrixOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'determinant'
  | 'inverse'
  | 'transpose'
  | 'scalar_multiply';

export interface StatisticsState {
  data: number[];
  dataInput: string;
  results: StatsResults | null;
  regressionType: 'linear' | 'polynomial';
  regressionDegree: number;
  regressionResult: RegressionResult | null;
  xyData: { x: number; y: number }[];
}

export interface StatsResults {
  mean: number;
  median: number;
  mode: number[];
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  count: number;
  sum: number;
  q1: number;
  q3: number;
  iqr: number;
}

export interface RegressionResult {
  equation: string;
  coefficients: number[];
  rSquared: number;
  predictions: { x: number; y: number }[];
}

export interface HistoryEntry {
  id: string;
  tab: TabId;
  expression: string;
  result: string;
  timestamp: number;
  expressionTex?: string;
  resultTex?: string;
}

export interface Variable {
  name: string;
  value: number;
}

export interface AppState {
  activeTab: TabId;
  equations: Equation[];
  pointDataSets: PointData[];
  calculus: CalculusState;
  matrix: MatrixState;
  statistics: StatisticsState;
  history: HistoryEntry[];
  variables: Variable[];
  darkMode: boolean;
}

export type AppAction =
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'ADD_EQUATION'; equation: Equation }
  | { type: 'UPDATE_EQUATION'; id: string; expression: string }
  | { type: 'TOGGLE_EQUATION'; id: string }
  | { type: 'REMOVE_EQUATION'; id: string }
  | { type: 'ADD_POINT_DATA'; pointData: PointData }
  | { type: 'UPDATE_POINT_DATA'; id: string; updates: Partial<PointData> }
  | { type: 'REMOVE_POINT_DATA'; id: string }
  | { type: 'SET_CALCULUS'; updates: Partial<CalculusState> }
  | { type: 'SET_MATRIX'; updates: Partial<MatrixState> }
  | { type: 'SET_STATISTICS'; updates: Partial<StatisticsState> }
  | { type: 'ADD_HISTORY'; entry: HistoryEntry }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'ADD_VARIABLE'; variable: Variable }
  | { type: 'UPDATE_VARIABLE'; name: string; value: number }
  | { type: 'REMOVE_VARIABLE'; name: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };
