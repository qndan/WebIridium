import { convertAntimonyToSBML } from "@/third_party/antimonyConvert";
import copasi from "@/third_party/copasiBindings";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { editorContentAtom, isSimulatingAtom, simulationResultAtom } from "@/stores/workspace";

import styles from "./TimeCourseSimulationPanel.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";
import type { SimResult } from "@/third_party/copasi";

export const TimeCourseSimulationPanel = () => {
  const editorContent = useAtomValue(editorContentAtom);
  const setSimulationResult = useSetAtom(simulationResultAtom);
  const [isSimulating, setIsSimulating] = useAtom(isSimulatingAtom);

  const simulate = () => {
    if (!isSimulating) {
      setIsSimulating(true);
      try {
        const sbmlConversion = convertAntimonyToSBML(editorContent);
        // TODO: notify user about these warnings
        if (sbmlConversion.warnings) {
          console.warn(sbmlConversion.warnings);
        }
        if (!sbmlConversion.success) throw new Error(sbmlConversion.errorMessage);

        copasi.bindings.loadModel(sbmlConversion.result);

        const result = copasi.bindings.simulateEx(0, 20, 10000);
        setSimulationResult(result as SimResult);
      } catch (err) {
        // TODO: notify user the simulation failed.
        console.warn(err);
      } finally {
        setIsSimulating(false);
      }
    }
  };

  return (
    <div className={styles.timeCoursePanel}>
      <Button
        icon={<PlayIcon />}
        isLoading={isSimulating}
        onClick={simulate}
        canCancel={isSimulating}
      >
        Simulate
      </Button>
    </div>
  );
};

export default TimeCourseSimulationPanel;
