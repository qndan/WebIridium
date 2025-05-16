import type { SimResult } from "@/third_party/copasi";
import Plot from "react-plotly.js";

const palette = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

export interface SimulationResultsPlotProps {
  result: SimResult,
}

const SimulationResultPlot = ({ result }: SimulationResultsPlotProps) => {
  const plotData = [];

  console.log(result);

  // First column always time
  const timeColumn = result.columns[0];

  for (let i = 1; i < result.columns.length; i++) {
    const column = result.columns[i];
    const title = result.titles[i];
    plotData.push({
      x: timeColumn,
      y: column,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: palette[i % palette.length] },
      name: title,
    });
  }

  return (
    <Plot
      data={plotData as any}
      layout={{width: 400, height: 400, title: "test" as any}}
    />
  );
};

export default SimulationResultPlot;
