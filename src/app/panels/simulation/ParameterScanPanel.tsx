import { useRef } from "react";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import styles from "./Simulation.module.css";
import { useSimulate } from "@/features/simulation/useSimulate";
import PlayIcon from "@/icons/PlayIcon";
import PropertyAccordion from "@/components/property-accordion/PropertyAccordion";
import PropertyAccordionItem from "@/components/property-accordion/PropertyAccordionItem";
import NumericProperty from "@/components/property-list/NumericProperty";
import { parameterScanParametersAtom } from "@/stores/workspace";
import PropertyList from "@/components/property-list/PropertyList";

const ParameterScanPanel = () => {
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

  const [parameterScanParameters, setParameterScanParameters] = useAtom(
    parameterScanParametersAtom,
  );

  const handleChangeFor = (property: string) => {
    return (newValue: unknown) => {
      setParameterScanParameters({
        ...parameterScanParameters,
        [property]: newValue,
      });
    };
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
            <NumericProperty
              name="Min"
              value={parameterScanParameters.min}
              onChange={handleChangeFor("min")}
            />
            <NumericProperty
              name="Max"
              value={parameterScanParameters.max}
              onChange={handleChangeFor("max")}
            />
            <NumericProperty
              name="Number of Values"
              value={parameterScanParameters.numberOfValues}
              onChange={handleChangeFor("numberOfValues")}
            />
          </PropertyList>
        </PropertyAccordionItem>
      </PropertyAccordion>
    </div>
  );
};

export default ParameterScanPanel;
