import { useRef } from "react";
import { useAtom } from "jotai";

import styles from "./TimeCourseSimulationPanel.module.css";
import Button from "@/components/Button";
import PlayIcon from "@/icons/PlayIcon";
import Accordion from "@/components/accordion/Accordion";
import AccordionItem from "@/components/accordion/AccordionItem";
import PropertyList from "@/components/property-list/PropertyList";
import NumericProperty from "@/components/property-list/NumericProperty";
import {
  timeCourseParametersAtom,
  type TimeCourseParameters,
} from "@/stores/workspace";
import { useSimulate } from "@/features/simulation";

const MAX_PARAMETER_VALUE = 1_0000_000;

const isParameterInRange = (value: number) =>
  0 <= value && value <= MAX_PARAMETER_VALUE;

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

  const handleChangeFor = (parameter: keyof TimeCourseParameters) => {
    return (newValue: number) => {
      setTimeCourseParameters({
        ...timeCourseParameters,
        [parameter]: newValue,
      });
    };
  };

  return (
    <div className={styles.timeCoursePanel}>
      <Button
        icon={<PlayIcon />}
        isLoading={isSimulating}
        onClick={handleSimulateClick}
        canCancel={isSimulating}
        onCancel={handleCancelClick}
      >
        Simulate
      </Button>

      <Accordion>
        <AccordionItem title="Simulation Parameters">
          <PropertyList>
            <NumericProperty
              name="Start Time"
              value={timeCourseParameters.startTime}
              onChange={handleChangeFor("startTime")}
              validator={(value) =>
                isParameterInRange(value) &&
                value < timeCourseParameters.endTime
              }
            />
            <NumericProperty
              name="End Time"
              value={timeCourseParameters.endTime}
              onChange={handleChangeFor("endTime")}
              validator={(value) =>
                isParameterInRange(value) &&
                value > timeCourseParameters.startTime
              }
            />
            <NumericProperty
              name="Number of Points"
              value={timeCourseParameters.numberOfPoints}
              onChange={handleChangeFor("numberOfPoints")}
              validator={(value) =>
                isParameterInRange(value) && value === Math.floor(value)
              }
            />
          </PropertyList>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TimeCourseSimulationPanel;
