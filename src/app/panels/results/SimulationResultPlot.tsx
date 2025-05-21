import { useAtomValue } from "jotai";
import type { SimResult } from "@/third_party/copasi";
import { graphSettingsAtom } from "@/stores/workspace";
import Plot from "react-plotly.js";
import type { Data } from "plotly.js";

const palette = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export interface SimulationResultsPlotProps {
  result: SimResult;
}

const SimulationResultPlot = ({ result }: SimulationResultsPlotProps) => {
  const {
    backgroundColor,
    drawingAreaColor,
    includeTitle,
    title,
    includeBorder,
    borderColor,
    borderThickness,
    margin,
  } = useAtomValue(graphSettingsAtom);
  const plotData = [];

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
      data={plotData as unknown as Data[]}
      layout={{
        width: 360,
        height: 360,
        title: !includeTitle
          ? undefined
          : {
              text: title,
            },
        showlegend: false,
        paper_bgcolor: backgroundColor,
        plot_bgcolor: drawingAreaColor,
        yaxis: {
          title: { text: "Concentrations" },
        },
        xaxis: {
          title: { text: "Time" },
        },
        margin: {
          l: margin,
          r: margin,
          b: margin,
          t: margin,
        },
        shapes: !includeBorder
          ? undefined
          : [
              {
                type: "rect",
                xref: "paper",
                yref: "paper",
                x0: 0,
                y0: 0,
                x1: 1,
                y1: 1,
                line: {
                  color: borderColor,
                  width: borderThickness,
                },
              },
            ],
      }}
      config={{ responsive: true, displayModeBar: false }}
    />
  );
};

export default SimulationResultPlot;
