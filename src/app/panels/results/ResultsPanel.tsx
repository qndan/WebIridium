import { useRef } from "react";
import { useAtomValue } from "jotai";
import { simulationResultAtom } from "@/stores/workspace";
import styles from "./ResultsPanel.module.css";
import SimulationResultPlot from "./SimulationResultPlot";

export const ResultsPanel = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const simulationResults = useAtomValue(simulationResultAtom);
  return (
    <div className={styles.resultsPanel} ref={panelRef}>
      {!simulationResults ? (
        "nothing yet..."
      ) : (
        <SimulationResultPlot
          containerRef={panelRef}
          result={simulationResults}
        />
      )}
    </div>
  );
};

export default ResultsPanel;
