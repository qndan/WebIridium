import Button from "@/components/Button";
import styles from "./Simulation.module.css";
import PlayIcon from "@/icons/PlayIcon";

const ParameterScanPanel = () => {
  return (
    <div className={styles.simulationPanel}>
      <Button icon={<PlayIcon />}>Scan</Button>
    </div>
  );
};

export default ParameterScanPanel;
