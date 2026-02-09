import type { Data, Layout } from 'plotly.js-dist-min';
import { useMemo } from 'react';

import { useAppContext } from '../../context/AppContext';
import PlotlyWrapper from '../../lib/PlotlyWrapper';

export default function StatisticsPlot() {
  const { state } = useAppContext();
  const { data, xyData, regressionResult } = state.statistics;

  const plotData = useMemo(() => {
    const traces: Data[] = [];

    // Histogram of single-value data
    if (data.length > 0) {
      traces.push({
        x: data,
        type: 'histogram',
        name: 'Distribution',
        marker: { color: 'rgba(99, 102, 241, 0.6)' },
      });
    }

    // Scatter of XY data
    if (xyData.length > 0) {
      traces.push({
        x: xyData.map((p) => p.x),
        y: xyData.map((p) => p.y),
        type: 'scatter',
        mode: 'markers',
        name: 'Data Points',
        marker: { color: '#6366f1', size: 8 },
      });
    }

    // Regression line/curve
    if (regressionResult) {
      traces.push({
        x: regressionResult.predictions.map((p) => p.x),
        y: regressionResult.predictions.map((p) => p.y),
        type: 'scatter',
        mode: 'lines',
        name: regressionResult.equation,
        line: { color: '#ef4444', width: 2 },
      });
    }

    return traces;
  }, [data, xyData, regressionResult]);

  const layout = useMemo<Partial<Layout>>(
    () => ({
      autosize: true,
      margin: { l: 50, r: 20, t: 20, b: 40 },
      xaxis: {
        zeroline: true,
        gridcolor: state.darkMode ? '#334155' : '#e2e8f0',
        color: state.darkMode ? '#94a3b8' : '#64748b',
      },
      yaxis: {
        zeroline: true,
        gridcolor: state.darkMode ? '#334155' : '#e2e8f0',
        color: state.darkMode ? '#94a3b8' : '#64748b',
      },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      showlegend: true,
      legend: {
        x: 0,
        y: 1,
        bgcolor: 'transparent',
        font: { color: state.darkMode ? '#e2e8f0' : '#1e293b', size: 11 },
      },
      barmode: 'overlay',
    }),
    [state.darkMode],
  );

  if (plotData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--color-text-secondary)] text-sm">
        Enter data to see visualization
      </div>
    );
  }

  return <PlotlyWrapper data={plotData} layout={layout} style={{ width: '100%', height: '100%' }} />;
}
