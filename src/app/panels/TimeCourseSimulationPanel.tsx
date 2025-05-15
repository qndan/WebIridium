import { useState } from "react";
import styles from "./TimeCourseSimulationPanel.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";

export const TimeCourseSimulationPanel = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.timeCoursePanel}>
      <Button
        icon={<PlayIcon />}
        isLoading={isLoading}
        onClick={() => setIsLoading(!isLoading)}
        canCancel={isLoading}
      >
        Simulate
      </Button>
    </div>
  );
};

export default TimeCourseSimulationPanel;
