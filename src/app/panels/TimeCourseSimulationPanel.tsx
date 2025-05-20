import { useRef } from "react";
import styles from "./TimeCourseSimulationPanel.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";
import useSimulate from "@/hooks/useSimulate";

export const TimeCourseSimulationPanel = () => {
  const { isSimulating, simulateTimeCourse } = useSimulate();
  const abortSimulationRef = useRef<AbortController | null>(null);

  const onSimulateClick = () => {
    if (abortSimulationRef.current) {
      abortSimulationRef.current.abort();
    }

    abortSimulationRef.current = new AbortController();

    void simulateTimeCourse(abortSimulationRef.current.signal);
  };

  const onCancelClick = () => {
    if (abortSimulationRef.current) {
      abortSimulationRef.current.abort();
      abortSimulationRef.current = null;
    }
  };

  return (
    <div className={styles.timeCoursePanel}>
      <Button
        icon={<PlayIcon />}
        isLoading={isSimulating}
        onClick={onSimulateClick}
        canCancel={isSimulating}
        onCancel={onCancelClick}
      >
        Simulate
      </Button>
    </div>
  );
};

export default TimeCourseSimulationPanel;
