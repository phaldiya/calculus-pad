import { useEffect } from 'react';

import { useAppContext } from '../../context/AppContext';
import { computeStats } from '../../lib/statisticsEngine';
import DataInput from './DataInput';
import RegressionPanel from './RegressionPanel';
import StatisticsPlot from './StatisticsPlot';
import StatsResults from './StatsResults';

export default function StatisticsPanel() {
  const { state, dispatch } = useAppContext();

  // Auto-compute stats when data changes
  useEffect(() => {
    if (state.statistics.data.length > 0) {
      try {
        const results = computeStats(state.statistics.data);
        dispatch({ type: 'SET_STATISTICS', updates: { results } });
      } catch {
        dispatch({ type: 'SET_STATISTICS', updates: { results: null } });
      }
    } else {
      dispatch({ type: 'SET_STATISTICS', updates: { results: null } });
    }
  }, [state.statistics.data, dispatch]);

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div
        role="region"
        aria-label="Statistics inputs"
        className="flex max-h-[40vh] w-full flex-col gap-4 overflow-y-auto border-[var(--color-border)] border-b p-4 md:max-h-none md:w-80 md:border-r md:border-b-0"
      >
        <DataInput />
        <StatsResults results={state.statistics.results} />
        <div className="border-[var(--color-border)] border-t pt-3">
          <RegressionPanel />
        </div>
      </div>
      <div role="img" aria-label="Statistics chart" className="min-h-[300px] flex-1">
        <StatisticsPlot />
      </div>
    </div>
  );
}
