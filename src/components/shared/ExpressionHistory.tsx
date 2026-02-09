import { useEffect, useRef } from 'react';

import { useAppContext } from '../../context/AppContext';
import KaTeXRenderer from './KaTeXRenderer';

export default function ExpressionHistory() {
  const { state, dispatch } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const historyLength = state.history.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: historyLength triggers scroll-to-bottom on new entries
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [historyLength]);

  if (state.history.length === 0) {
    return <p className="p-2 text-[var(--color-text-secondary)] text-xs italic">No history yet</p>;
  }

  return (
    <div role="log" aria-label="Calculation history" className="flex min-h-0 flex-1 flex-col gap-1">
      <div className="flex shrink-0 items-center justify-between px-2">
        <span className="font-medium text-[var(--color-text-secondary)] text-xs">History</span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
          className="text-[var(--color-text-secondary)] text-xs hover:text-[var(--color-error)]"
        >
          Clear
        </button>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {state.history.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-wrap items-baseline gap-x-1 border-[var(--color-border)] border-b px-2 py-1.5 text-xs last:border-0"
          >
            {entry.expressionTex ? (
              <KaTeXRenderer
                tex={entry.expressionTex}
                ariaLabel={entry.expression}
                className="text-[var(--color-text-secondary)]"
              />
            ) : (
              <span className="font-mono text-[var(--color-text-secondary)]">{entry.expression}</span>
            )}
            <span className="text-[var(--color-text)]">=</span>
            {entry.resultTex ? (
              <KaTeXRenderer tex={entry.resultTex} ariaLabel={entry.result} className="text-[var(--color-text)]" />
            ) : (
              <span className="font-mono text-[var(--color-text)]">{entry.result}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
