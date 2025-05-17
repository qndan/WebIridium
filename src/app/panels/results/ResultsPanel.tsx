import { useAtomValue } from "jotai";
import { simulationResultAtom } from "@/stores/workspace";
import SimulationResultPlot from "./SimulationResultPlot";

export const ResultsPanel = () => {
  const simulationResults = useAtomValue(simulationResultAtom);
  return (
    <div>
      {!simulationResults ? (
        "nothing yet..."
      ) : (
        <SimulationResultPlot result={simulationResults} />
      )}
    </div>
  );
};

export default ResultsPanel;
