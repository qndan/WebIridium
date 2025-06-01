import { useRef } from "react";
import { useAtom } from "jotai";

import styles from "./simulation.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";
import PropertyAccordion from "@/components/property-accordion/PropertyAccordion";
import PropertyAccordionItem from "@/components/property-accordion/PropertyAccordionItem";
import PropertyList from "@/components/property-list/PropertyList";
import { timeCourseParametersAtom } from "@/stores/workspace";
import { useSimulate } from "@/features/simulation/useSimulate";
import PropertyGenerator, {
  type Properties,
} from "@/components/property-list/PropertyGenerator";

export const TimeCourseSimulationPanel = () => {
  const { isSimulating, simulateTimeCourse } = useSimulate();
  const [timeCourseParameters, setTimeCourseParameters] = useAtom(
    timeCourseParametersAtom,
  );
  const abortSimulationRef = useRef<AbortController | null>(null);

  const handleSimulateClick = () => {
    if (abortSimulationRef.current) {
      abortSimulationRef.current.abort();
    }

    abortSimulationRef.current = new AbortController();

    void simulateTimeCourse(abortSimulationRef.current.signal);
  };

  const handleCancelClick = () => {
    if (abortSimulationRef.current) {
      abortSimulationRef.current.abort();
      abortSimulationRef.current = null;
    }
  };

  return (
    <div className={styles.simulationPanel}>
      <h1 className={styles.panelTitle}>Time Course Simulation</h1>
      <Button
        icon={<PlayIcon />}
        isLoading={isSimulating}
        onClick={handleSimulateClick}
        canCancel={isSimulating}
        onCancel={handleCancelClick}
      >
        Simulate
      </Button>

      <PropertyAccordion defaultValue={["sim-params"]}>
        <PropertyAccordionItem title="Simulation Parameters" value="sim-params">
          <PropertyList>
            <PropertyGenerator
              properties={timeCourseParameters as unknown as Properties}
              setProperty={(parameter, newValue) =>
                setTimeCourseParameters({
                  ...timeCourseParameters,
                  [parameter]: newValue,
                })
              }
              names={{
                startTime: "Start Time",
                endTime: "End Time",
                numberOfPoints: "Number of Points",
              }}
              restrictions={[
                {
                  restriction: "range",
                  minProperty: "startTime",
                  maxProperty: "endTime",
                },
                {
                  restriction: "bounds",
                  properties: ["startTime", "endTime", "numberOfPoints"],
                  min: 0,
                  max: 1_000_000,
                },
                { restriction: "integer", property: "numberOfPoints" },
              ]}
            />
          </PropertyList>
        </PropertyAccordionItem>
      </PropertyAccordion>
    </div>
  );
};

export default TimeCourseSimulationPanel;
