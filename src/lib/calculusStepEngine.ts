import { ConstantNode, derivative, FunctionNode, type MathNode, OperatorNode, parse, SymbolNode } from 'mathjs';

import type { StepItem } from '../components/shared/StepViewer';
import { derivativeTex, integralTex, limitTex, safeToTex } from './texHelpers';

function identifyDerivativeRule(node: MathNode, variable: string): { rule: string; formula: string } | null {
  if (node instanceof ConstantNode) {
    return { rule: 'Constant Rule', formula: `\\frac{d}{d${variable}}[c] = 0` };
  }

  if (node instanceof SymbolNode) {
    if (node.name === variable) {
      return { rule: 'Identity Rule', formula: `\\frac{d}{d${variable}}[${variable}] = 1` };
    }
    return { rule: 'Constant Rule', formula: `\\frac{d}{d${variable}}[c] = 0` };
  }

  if (node instanceof OperatorNode) {
    switch (node.op) {
      case '+':
      case '-':
        return { rule: 'Sum/Difference Rule', formula: `\\frac{d}{d${variable}}[f \\pm g] = f' \\pm g'` };
      case '*':
        return { rule: 'Product Rule', formula: `\\frac{d}{d${variable}}[f \\cdot g] = f' \\cdot g + f \\cdot g'` };
      case '/':
        return {
          rule: 'Quotient Rule',
          formula: `\\frac{d}{d${variable}}\\left[\\frac{f}{g}\\right] = \\frac{f' g - f g'}{g^2}`,
        };
      case '^': {
        const exp = node.args[1];
        if (exp instanceof ConstantNode) {
          const n = exp.value;
          return {
            rule: 'Power Rule',
            formula: `\\frac{d}{d${variable}}[${variable}^{${n}}] = ${n}${variable}^{${Number(n) - 1}}`,
          };
        }
        return { rule: 'Exponential Rule', formula: `\\frac{d}{d${variable}}[f^g]` };
      }
    }
  }

  if (node instanceof FunctionNode) {
    const fnRules: Record<string, string> = {
      sin: `\\frac{d}{d${variable}}[\\sin(u)] = \\cos(u) \\cdot u'`,
      cos: `\\frac{d}{d${variable}}[\\cos(u)] = -\\sin(u) \\cdot u'`,
      tan: `\\frac{d}{d${variable}}[\\tan(u)] = \\sec^2(u) \\cdot u'`,
      log: `\\frac{d}{d${variable}}[\\ln(u)] = \\frac{u'}{u}`,
      sqrt: `\\frac{d}{d${variable}}[\\sqrt{u}] = \\frac{u'}{2\\sqrt{u}}`,
      exp: `\\frac{d}{d${variable}}[e^u] = e^u \\cdot u'`,
    };
    const formula = fnRules[node.fn.name];
    if (formula) {
      const argIsSimple = node.args[0] instanceof SymbolNode && node.args[0].name === variable;
      const ruleName = argIsSimple
        ? `${capitalize(node.fn.name)} Rule`
        : `${capitalize(node.fn.name)} Rule + Chain Rule`;
      return { rule: ruleName, formula };
    }
  }

  return null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function walkDerivativeSteps(node: MathNode, variable: string, steps: StepItem[]): void {
  const rule = identifyDerivativeRule(node, variable);
  if (!rule) return;

  const exprTex = safeToTex(node);
  steps.push({
    label: rule.rule,
    contentTex: `${rule.formula}`,
    explanation: `Apply to: ${exprTex}`,
  });

  if (node instanceof OperatorNode || node instanceof FunctionNode) {
    for (const arg of node.args) {
      if (!(arg instanceof ConstantNode) && !(arg instanceof SymbolNode && arg.name !== variable)) {
        walkDerivativeSteps(arg, variable, steps);
      }
    }
  }
}

export function generateDerivativeSteps(expr: string, variable: string = 'x'): StepItem[] {
  const steps: StepItem[] = [];

  let ast: MathNode;
  try {
    ast = parse(expr);
  } catch {
    return [];
  }

  const exprTex = safeToTex(ast);

  steps.push({
    label: 'Setup',
    contentTex: derivativeTex(exprTex, variable),
    explanation: `Find the derivative of ${expr} with respect to ${variable}`,
  });

  walkDerivativeSteps(ast, variable, steps);

  let resultTex: string;
  try {
    const result = derivative(ast, variable);
    resultTex = safeToTex(result);
  } catch {
    resultTex = '\\text{Could not compute}';
  }

  steps.push({
    label: 'Final result',
    contentTex: `${derivativeTex(exprTex, variable)} = ${resultTex}`,
    explanation: 'Combining all terms',
  });

  return steps;
}

export function generateIntegralSteps(expr: string, lower: string, upper: string, result: string): StepItem[] {
  const steps: StepItem[] = [];

  let exprTex: string;
  try {
    exprTex = safeToTex(parse(expr));
  } catch {
    exprTex = expr;
  }

  steps.push({
    label: 'Setup',
    contentTex: integralTex(exprTex, lower, upper),
    explanation: `Evaluate the definite integral of ${expr} from ${lower} to ${upper}`,
  });

  steps.push({
    label: "Simpson's Rule",
    contentTex: `\\int_{a}^{b} f(x) \\, dx \\approx \\frac{h}{3} \\left[ f(a) + 4f(x_1) + 2f(x_2) + \\cdots + f(b) \\right]`,
    explanation: "Using numerical integration with Simpson's 1/3 rule",
  });

  const a = Number.parseFloat(lower);
  const b = Number.parseFloat(upper);
  const h = (b - a) / 1000;

  steps.push({
    label: 'Parameters',
    contentTex: `h = \\frac{${upper} - ${lower}}{1000} = ${h.toFixed(6)}`,
    explanation: `Step size h with n = 1000 subintervals`,
  });

  const compiled = parse(expr).compile();
  const fa = safeEval(compiled, a);
  const fb = safeEval(compiled, b);
  const mid = (a + b) / 2;
  const fmid = safeEval(compiled, mid);

  steps.push({
    label: 'Sample evaluations',
    contentTex: `f(${lower}) = ${fa.toFixed(6)}, \\quad f(${mid.toFixed(2)}) = ${fmid.toFixed(6)}, \\quad f(${upper}) = ${fb.toFixed(6)}`,
    explanation: 'Evaluating the function at key points',
  });

  steps.push({
    label: 'Result',
    contentTex: `${integralTex(exprTex, lower, upper)} \\approx ${result}`,
    explanation: 'Final numerical result',
  });

  return steps;
}

function safeEval(compiled: { evaluate: (scope: Record<string, number>) => number }, x: number): number {
  try {
    const result = compiled.evaluate({ x });
    return typeof result === 'number' && Number.isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

export function generateLimitSteps(expr: string, point: string, result: string): StepItem[] {
  const steps: StepItem[] = [];

  let exprTex: string;
  try {
    exprTex = safeToTex(parse(expr));
  } catch {
    exprTex = expr;
  }

  const c = Number.parseFloat(point);

  steps.push({
    label: 'Setup',
    contentTex: limitTex(exprTex, 'x', point),
    explanation: `Evaluate the limit of ${expr} as x approaches ${point}`,
  });

  const compiled = parse(expr).compile();
  const offsets = [0.1, 0.01, 0.001];

  const leftRows = offsets.map((h) => {
    const x = c - h;
    const val = safeEval(compiled, x);
    return `${x.toFixed(4)} & ${val.toFixed(6)}`;
  });

  steps.push({
    label: 'Left-hand approach',
    contentTex: `\\begin{array}{c|c} x & f(x) \\\\ \\hline ${leftRows.join(' \\\\ ')} \\end{array}`,
    explanation: `Values as x approaches ${point} from the left`,
  });

  const rightRows = offsets.map((h) => {
    const x = c + h;
    const val = safeEval(compiled, x);
    return `${x.toFixed(4)} & ${val.toFixed(6)}`;
  });

  steps.push({
    label: 'Right-hand approach',
    contentTex: `\\begin{array}{c|c} x & f(x) \\\\ \\hline ${rightRows.join(' \\\\ ')} \\end{array}`,
    explanation: `Values as x approaches ${point} from the right`,
  });

  steps.push({
    label: 'Conclusion',
    contentTex: `${limitTex(exprTex, 'x', point)} = ${result}`,
    explanation: 'Both sides converge to the same value',
  });

  return steps;
}
