import { useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import { CloseIcon } from '../shared/Icons';

export default function DataInput() {
  const { state, dispatch } = useAppContext();
  const [xyMode, setXyMode] = useState(false);
  const [xyInput, setXyInput] = useState<{ x: string; y: string }[]>([{ x: '', y: '' }]);

  const handleDataInput = (value: string) => {
    dispatch({ type: 'SET_STATISTICS', updates: { dataInput: value } });
    const nums = value
      .split(/[,\s\n]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => Number.isFinite(n));
    dispatch({ type: 'SET_STATISTICS', updates: { data: nums } });
  };

  const addXyRow = () => setXyInput([...xyInput, { x: '', y: '' }]);

  const updateXy = (index: number, field: 'x' | 'y', value: string) => {
    const updated = [...xyInput];
    updated[index] = { ...updated[index], [field]: value };
    setXyInput(updated);

    const validPoints = updated
      .filter((p) => p.x.trim() !== '' && p.y.trim() !== '')
      .map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
    dispatch({ type: 'SET_STATISTICS', updates: { xyData: validPoints } });
  };

  const removeXyRow = (index: number) => {
    if (xyInput.length <= 1) return;
    const updated = xyInput.filter((_, i) => i !== index);
    setXyInput(updated);
    const validPoints = updated
      .filter((p) => p.x.trim() !== '' && p.y.trim() !== '')
      .map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
    dispatch({ type: 'SET_STATISTICS', updates: { xyData: validPoints } });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-text)] text-sm">Data Input</h3>
        <button
          type="button"
          aria-label={xyMode ? 'Switch to single values' : 'Switch to X,Y pairs'}
          onClick={() => setXyMode(!xyMode)}
          className="text-[var(--color-primary)] text-xs hover:text-[var(--color-primary-hover)]"
        >
          {xyMode ? 'Single values' : 'X,Y pairs'}
        </button>
      </div>

      {xyMode ? (
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-1 font-medium text-[var(--color-text-secondary)] text-xs">
            <span>X</span>
            <span>Y</span>
            <span className="w-6" />
          </div>
          {xyInput.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-1">
              <input
                type="number"
                value={p.x}
                onChange={(e) => updateXy(i, 'x', e.target.value)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-[var(--color-text)] text-sm"
              />
              <input
                type="number"
                value={p.y}
                onChange={(e) => updateXy(i, 'y', e.target.value)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-[var(--color-text)] text-sm"
              />
              <button
                type="button"
                aria-label="Remove row"
                onClick={() => removeXyRow(i)}
                className="flex h-6 w-6 items-center justify-center self-center text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addXyRow}
            className="text-left font-medium text-[var(--color-primary)] text-xs hover:text-[var(--color-primary-hover)]"
          >
            + Add Row
          </button>
        </div>
      ) : (
        <textarea
          value={state.statistics.dataInput}
          onChange={(e) => handleDataInput(e.target.value)}
          placeholder="Enter numbers separated by commas, spaces, or newlines"
          aria-label="Data values"
          rows={4}
          className="resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 font-mono text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      )}
      {!xyMode && state.statistics.data.length > 0 && (
        <p className="text-[var(--color-text-secondary)] text-xs">{state.statistics.data.length} values loaded</p>
      )}
    </div>
  );
}
