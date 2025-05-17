import { simulateTimeCourse } from "@/services/simulationService";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import {
  editorContentAtom,
  isSimulatingAtom,
  simulationResultAtom,
} from "@/stores/workspace";

const useSimulate = () => {
  const editorContent = useAtomValue(editorContentAtom);
  const setSimulationResult = useSetAtom(simulationResultAtom);
  const [isSimulating, setIsSimulating] = useAtom(isSimulatingAtom);

  const simulateTimeCourseCallback = async () => {
    if (!isSimulating) {
      setIsSimulating(true);

      const result = await simulateTimeCourse(editorContent);

      setSimulationResult(result);
      setIsSimulating(false);
    }
  };

  return {
    isSimulating,
    simulateTimeCourse: simulateTimeCourseCallback,
  };
};

export default useSimulate;
