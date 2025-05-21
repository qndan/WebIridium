import { useState, useEffect, useRef } from "react";
import styles from "./PropertyList.module.css";

export interface NumericPropertyProps {
  name: string;
  value: number;
  onChange: (newValue: number) => void;
}

const NumericProperty = ({ name, value, onChange }: NumericPropertyProps) => {
  const [workingValue, setWorkingValue] = useState(value);
  const lastValueRef = useRef(value);

  useEffect(() => {
    lastValueRef.current = value;
  }, [lastValueRef, value]);

  const handleChange = (e: React.ChangeEvent) => {
    setWorkingValue(e);
  };

  return (
    <div className={styles.property}>
      <label>
        <span className={styles.propertyName}>{name}</span>
        <input type="number" value={workingValue} onChange={handleChange} />
      </label>
    </div>
  );
};

export default NumericProperty;
