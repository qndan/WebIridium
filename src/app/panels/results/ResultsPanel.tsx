import { useAtomValue } from "jotai";
import { simulationResultAtom } from "@/stores/workspace";
import styles from "./ResultsPanel.module.css";
import SimulationResultPlot from "./SimulationResultPlot";

export const ResultsPanel = () => {
  const simulationResults = useAtomValue(simulationResultAtom);
  return (
    <div>
      {!simulationResults
        ? "nothing yet..."
        : <SimulationResultPlot result={simulationResults} />}
    </div>
  );
};

export default ResultsPanel;
