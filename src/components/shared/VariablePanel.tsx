import { useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import { CloseIcon } from './Icons';

export default function VariablePanel() {
  const { state, dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value.trim()) return;
    const numVal = parseFloat(value);
    if (!Number.isFinite(numVal)) return;

    const existing = state.variables.find((v) => v.name === name.trim());
    if (existing) {
      dispatch({ type: 'UPDATE_VARIABLE', name: name.trim(), value: numVal });
    } else {
      dispatch({ type: 'ADD_VARIABLE', variable: { name: name.trim(), value: numVal } });
    }
    setName('');
    setValue('');
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-[var(--color-text-secondary)] text-xs">Variables</span>
      <form onSubmit={handleAdd} className="flex gap-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="a"
          aria-label="Variable name"
          className="w-12 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-[var(--color-text)] text-xs"
        />
        <span className="self-center text-[var(--color-text-secondary)] text-xs">=</span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
          aria-label="Variable value"
          className="w-16 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2 py-1 text-[var(--color-text)] text-xs"
        />
        <button
          type="submit"
          className="rounded bg-[var(--color-primary)] px-2 py-1 font-medium text-white text-xs hover:bg-[var(--color-primary-hover)]"
        >
          Set
        </button>
      </form>
      {state.variables.map((v) => (
        <div key={v.name} className="flex items-center gap-1 text-xs">
          <span className="font-mono text-[var(--color-text)]">
            {v.name} = {v.value}
          </span>
          <button
            type="button"
            aria-label={`Remove variable ${v.name}`}
            onClick={() => dispatch({ type: 'REMOVE_VARIABLE', name: v.name })}
            className="ml-auto text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
