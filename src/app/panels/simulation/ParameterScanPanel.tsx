import { useRef } from "react";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import styles from "./simulation.module.css";
import { useSimulate } from "@/features/simulation/useSimulate";
import PlayIcon from "@/icons/PlayIcon";
import PropertyAccordion from "@/components/property-accordion/PropertyAccordion";
import PropertyAccordionItem from "@/components/property-accordion/PropertyAccordionItem";
import { parameterScanParametersAtom } from "@/stores/workspace";
import PropertyList from "@/components/property-list/PropertyList";
import BooleanProperty from "@/components/property-list/BooleanProperty";
import PropertyGenerator, {
  type Properties,
} from "@/components/property-list/PropertyGenerator";

const ParameterScanPanel = () => {
  const [parameterScanParameters, setParameterScanParameters] = useAtom(
    parameterScanParametersAtom,
  );
  const { isSimulating, runParameterScan } = useSimulate();
  const abortSimulationRef = useRef<AbortController | null>(null);

  const handleSimulateClick = () => {
    if (abortSimulationRef.current) {
      abortSimulationRef.current.abort();
    }

    abortSimulationRef.current = new AbortController();

    void runParameterScan(abortSimulationRef.current.signal);
  };

  const handleCancelClick = () => {
    if (abortSimulationRef.current) {
      abortSimulationRef.current.abort();
      abortSimulationRef.current = null;
    }
  };

  const setProperty = (name: string, value: unknown) => {
    setParameterScanParameters({
      ...parameterScanParameters,
      [name]: value,
    });
  };

  return (
    <div className={styles.simulationPanel}>
      <h1 className={styles.panelTitle}>Parameter Scan</h1>
      <Button
        icon={<PlayIcon />}
        isLoading={isSimulating}
        onClick={handleSimulateClick}
        canCancel={isSimulating}
        onCancel={handleCancelClick}
      >
        Run
      </Button>

      <PropertyAccordion defaultValue={["first-parameter"]}>
        <PropertyAccordionItem title="First Parameter" value="first-parameter">
          <PropertyList>
            <PropertyGenerator
              properties={parameterScanParameters as unknown as Properties}
              setProperty={setProperty}
              names={{
                min: "Min",
                max: "Max",
                numberOfValues: "Number of Values",
              }}
              restrictions={[
                {
                  restriction: "range",
                  minProperty: "startTime",
                  maxProperty: "endTime",
                },
                {
                  restriction: "bounds",
                  properties: ["min", "max"],
                  min: 0,
                  max: 1_000_000,
                },
                {
                  restriction: "bounds",
                  property: "numberOfValues",
                  min: 2,
                  max: 1_000_000,
                },
                {
                  restriction: "integer",
                  properties: ["min", "max", "numberOfValues"],
                },
              ]}
            />
            <BooleanProperty
              asideMode
              name="Use logarithmic distribution"
              value={parameterScanParameters.useLogarithmicDistribution}
              onChange={(value) =>
                setProperty("useLogarithmicDistribution", value)
              }
            />
          </PropertyList>
        </PropertyAccordionItem>
      </PropertyAccordion>
    </div>
  );
};

export default ParameterScanPanel;
