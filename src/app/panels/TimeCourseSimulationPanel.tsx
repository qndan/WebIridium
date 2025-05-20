import { useRef } from "react";
import styles from "./TimeCourseSimulationPanel.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";
import Accordion from "@/components/accordion/Accordion";
import AccordionItem from "@/components/accordion/AccordionItem";
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

      <Accordion>
        <AccordionItem title="Simulation Parameters">
          <form>
            <div>
              <label>
                <span>Start Time</span>
                <input type="number" />
              </label>
            </div>
            <div>
              <label>
                <span>End Time</span>
                <input type="number" />
              </label>
            </div>
          </form>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TimeCourseSimulationPanel;
