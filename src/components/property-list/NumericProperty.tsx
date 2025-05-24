import { useState, useEffect, useRef } from "react";
import styles from "./PropertyList.module.css";

export interface NumericPropertyProps {
  name: string;
  value: number;
  onChange: (newValue: number) => void;
  /** checks for if the value the user is inputted is correct */
  validator?: (value: number) => void;
}

const NumericProperty = ({
  name,
  value,
  onChange,
  validator,
}: NumericPropertyProps) => {
  // user has a working value, once they end the input, check if its a valid number
  // restore to original value if not
  const [workingValue, setWorkingValue] = useState(value.toString());
  const lastValueRef = useRef(value.toString());

  useEffect(() => {
    setWorkingValue(value.toString());
  }, [value]);

  const handleFocus = () => {
    lastValueRef.current = workingValue;
  };

  const handleWorkingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkingValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = +value;
    if (
      !Number.isNaN(numericValue) &&
      (!validator || validator(numericValue))
    ) {
      onChange(numericValue);
    } else {
      setWorkingValue(lastValueRef.current);
    }
  };

  return (
    <div className={styles.property}>
      <label htmlFor={name} className={styles.propertyName}>
        {name}
      </label>

      <input
        id={name}
        className={styles.propertyInput}
        type="number"
        onFocus={handleFocus}
        value={workingValue}
        onChange={handleWorkingChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default NumericProperty;
