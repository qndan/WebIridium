import { simulateTimeCourse } from "@/features/simulation";
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

  const simulateTimeCourseCallback = async (abortSignal?: AbortSignal) => {
    if (!isSimulating) {
      setIsSimulating(true);

      try {
        const result = await simulateTimeCourse(editorContent, abortSignal);
        setSimulationResult(result);
      } catch (err) {
        // TODO: implement error handling
      }

      setIsSimulating(false);
    }
  };

  return {
    isSimulating,
    simulateTimeCourse: simulateTimeCourseCallback,
  };
};

export default useSimulate;
