import styles from "./TimeCourseSimulationPanel.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";
import useSimulate from "@/hooks/useSimulate";

export const TimeCourseSimulationPanel = () => {
  const { isSimulating, simulateTimeCourse } = useSimulate();

  const onSimulateClick = () => {
    void simulateTimeCourse();
  };

  return (
    <div className={styles.timeCoursePanel}>
      <Button
        icon={<PlayIcon />}
        isLoading={isSimulating}
        onClick={onSimulateClick}
        canCancel={isSimulating}
      >
        Simulate
      </Button>
    </div>
  );
};

export default TimeCourseSimulationPanel;
