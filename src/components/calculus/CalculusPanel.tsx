import CalculusPlot from './CalculusPlot';
import DerivativeInput from './DerivativeInput';
import IntegralInput from './IntegralInput';
import LimitInput from './LimitInput';

export default function CalculusPanel() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <div
        role="region"
        aria-label="Calculus inputs"
        className="flex max-h-[40vh] w-full flex-col gap-4 overflow-y-auto border-[var(--color-border)] border-b p-4 md:max-h-none md:w-80 md:border-r md:border-b-0"
      >
        <DerivativeInput />
        <IntegralInput />
        <LimitInput />
      </div>
      <div role="img" aria-label="Calculus plot" className="min-h-[300px] flex-1">
        <CalculusPlot />
      </div>
    </div>
  );
}
