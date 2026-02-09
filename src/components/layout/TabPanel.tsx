import { useAppContext } from '../../context/AppContext';
import CalculusPanel from '../calculus/CalculusPanel';
import GraphPanel from '../graphing/GraphPanel';
import MatrixPanel from '../matrix/MatrixPanel';
import ScientificPanel from '../scientific/ScientificPanel';
import ErrorBoundary from '../shared/ErrorBoundary';
import StatisticsPanel from '../statistics/StatisticsPanel';

export default function TabPanel() {
  const { state } = useAppContext();

  return (
    <div className="flex-1 overflow-hidden">
      <ErrorBoundary tabName={state.activeTab}>
        {state.activeTab === 'scientific' && <ScientificPanel />}
        {state.activeTab === 'graphing' && <GraphPanel />}
        {state.activeTab === 'calculus' && <CalculusPanel />}
        {state.activeTab === 'matrix' && <MatrixPanel />}
        {state.activeTab === 'statistics' && <StatisticsPanel />}
      </ErrorBoundary>
    </div>
  );
}
