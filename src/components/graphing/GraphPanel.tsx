import EquationInput from './EquationInput';
import EquationList from './EquationList';
import GraphPlot from './GraphPlot';
import PointPlotInput from './PointPlotInput';

export default function GraphPanel() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <div
        role="region"
        aria-label="Equation controls"
        className="flex max-h-[40vh] w-full flex-col gap-4 overflow-y-auto border-[var(--color-border)] border-b p-4 md:max-h-none md:w-72 md:border-r md:border-b-0"
      >
        <div>
          <h2 className="mb-2 font-semibold text-[var(--color-text)] text-sm">Equations</h2>
          <EquationInput />
        </div>
        <EquationList />
        <div className="border-[var(--color-border)] border-t pt-3">
          <PointPlotInput />
        </div>
      </div>
      <div role="img" aria-label="Function graph" className="min-h-[300px] flex-1">
        <GraphPlot />
      </div>
    </div>
  );
}
