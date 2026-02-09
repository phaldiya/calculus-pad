interface Props {
  label: string;
  matrix: number[][];
  onChange: (matrix: number[][]) => void;
}

export default function MatrixInput({ label, matrix, onChange }: Props) {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  const updateCell = (r: number, c: number, value: string) => {
    const updated = matrix.map((row) => [...row]);
    updated[r][c] = parseFloat(value) || 0;
    onChange(updated);
  };

  const resizeMatrix = (newRows: number, newCols: number) => {
    const updated: number[][] = [];
    for (let r = 0; r < newRows; r++) {
      const row: number[] = [];
      for (let c = 0; c < newCols; c++) {
        row.push(matrix[r]?.[c] ?? 0);
      }
      updated.push(row);
    }
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[var(--color-text)] text-sm">{label}</span>
        <div className="flex items-center gap-1 text-xs">
          <select
            value={rows}
            onChange={(e) => resizeMatrix(parseInt(e.target.value, 10), cols)}
            aria-label={`${label} rows`}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-1 py-0.5 text-[var(--color-text)]"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-[var(--color-text-secondary)]">x</span>
          <select
            value={cols}
            onChange={(e) => resizeMatrix(rows, parseInt(e.target.value, 10))}
            aria-label={`${label} columns`}
            className="rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-1 py-0.5 text-[var(--color-text)]"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="inline-flex flex-col gap-0.5 rounded-lg bg-[var(--color-surface-alt)] p-2">
        {matrix.map((row, r) => (
          <div key={r} className="flex gap-0.5">
            {row.map((val, c) => (
              <input
                key={`${r}-${c}`}
                type="number"
                value={val}
                onChange={(e) => updateCell(r, c, e.target.value)}
                aria-label={`${label} row ${r + 1} column ${c + 1}`}
                className="w-14 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1 py-1 text-center text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
