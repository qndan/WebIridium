/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { SimResult } from "@/third_party/copasi";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

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
  /** Used for sizing the plot. */
  containerRef: React.RefObject<HTMLElement | null>;
  result: SimResult;
}

const SimulationResultPlot = ({
  containerRef,
  result,
}: SimulationResultsPlotProps) => {
  const [width, setWidth] = useState(100);
  const plotWidth = Math.min(2048, width - 16);

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

  useEffect(() => {
    const onResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Plot
      data={plotData as any}
      layout={{ width: plotWidth, height: plotWidth, title: "test" as any }}
    />
  );
};

export default SimulationResultPlot;
