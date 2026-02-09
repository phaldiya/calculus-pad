import { ConstantNode, FunctionNode, type MathNode, OperatorNode, ParenthesisNode, parse, SymbolNode } from 'mathjs';

import { highlightTex, safeToTex } from './texHelpers';

export interface CalculationStep {
  label: string;
  fullExpressionTex: string;
  subExpressionTex: string;
  resultTex: string;
}

const MAX_STEPS = 50;

function isLeafValue(node: MathNode): boolean {
  if (node instanceof ConstantNode) return true;
  if (node instanceof SymbolNode && (node.name === 'pi' || node.name === 'e')) return true;
  return false;
}

function isEvaluable(node: MathNode): boolean {
  if (node instanceof ConstantNode) return false;
  if (node instanceof SymbolNode && node.name !== 'pi' && node.name !== 'e') return false;
  if (node instanceof SymbolNode) return true;

  if (node instanceof ParenthesisNode) {
    return isEvaluable(node.content);
  }

  if (node instanceof OperatorNode) {
    return node.args.every((arg) => isLeafValue(arg) || (arg instanceof ParenthesisNode && isLeafValue(arg.content)));
  }

  if (node instanceof FunctionNode) {
    return node.args.every((arg) => isLeafValue(arg) || (arg instanceof ParenthesisNode && isLeafValue(arg.content)));
  }

  return false;
}

interface FoundNode {
  node: MathNode;
  depth: number;
}

function findDeepestEvaluable(node: MathNode, depth: number): FoundNode | null {
  let best: FoundNode | null = null;

  if (node instanceof ParenthesisNode) {
    const inner = findDeepestEvaluable(node.content, depth + 1);
    if (inner) best = inner;
  }

  if (node instanceof OperatorNode || node instanceof FunctionNode) {
    for (const arg of node.args) {
      const candidate = findDeepestEvaluable(arg, depth + 1);
      if (candidate && (!best || candidate.depth >= best.depth)) {
        best = candidate;
      }
    }
  }

  if (isEvaluable(node)) {
    if (!best || depth >= best.depth) {
      best = { node, depth };
    }
  }

  return best;
}

function describeOperation(node: MathNode): string {
  if (node instanceof SymbolNode) {
    if (node.name === 'pi') return 'Substitute pi';
    if (node.name === 'e') return 'Substitute e';
    return `Substitute ${node.name}`;
  }

  if (node instanceof OperatorNode) {
    const opMap: Record<string, string> = {
      '+': 'Add',
      '-': 'Subtract',
      '*': 'Multiply',
      '/': 'Divide',
      '^': 'Apply power',
    };
    return opMap[node.op] || `Evaluate ${node.op}`;
  }

  if (node instanceof FunctionNode) {
    return `Evaluate ${node.fn.name}`;
  }

  return 'Evaluate';
}

function evaluateNode(node: MathNode): number {
  return node.compile().evaluate() as number;
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return Number.parseFloat(n.toFixed(10)).toString();
}

export function generateSteps(expression: string): CalculationStep[] {
  let ast: MathNode;
  try {
    ast = parse(expression);
  } catch {
    return [];
  }

  const steps: CalculationStep[] = [];

  for (let i = 0; i < MAX_STEPS; i++) {
    if (ast instanceof ConstantNode) break;

    const found = findDeepestEvaluable(ast, 0);
    if (!found) break;

    const targetNode = found.node;
    let value: number;
    try {
      value = evaluateNode(targetNode);
    } catch {
      break;
    }

    const label = describeOperation(targetNode);
    const subTex = safeToTex(targetNode);
    const resultNum = formatNumber(value);

    const fullTex = safeToTex(ast).replace(subTex, highlightTex(subTex));

    steps.push({
      label,
      fullExpressionTex: fullTex,
      subExpressionTex: `${subTex} = ${resultNum}`,
      resultTex: resultNum,
    });

    const replacement = new ConstantNode(value);
    ast = ast.transform((n) => {
      if (n === targetNode) return replacement;
      return n;
    });
  }

  if (steps.length > 0 && ast instanceof ConstantNode) {
    steps.push({
      label: 'Final result',
      fullExpressionTex: safeToTex(ast),
      subExpressionTex: `= ${formatNumber(ast.value as number)}`,
      resultTex: formatNumber(ast.value as number),
    });
  }

  return steps;
}
