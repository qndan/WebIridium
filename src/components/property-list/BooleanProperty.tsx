import { Checkbox as RadixCheckbox } from "radix-ui";
import styles from "./PropertyList.module.css";
import CheckIcon from "@/icons/CheckIcon";

export interface BooleanPropertyProps {
  name: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

const BooleanProperty = ({ name, value, onChange }: BooleanPropertyProps) => {
  return (
    <div className={styles.property}>
      <label htmlFor={name} className={styles.propertyName}>
        {name}
      </label>

      <RadixCheckbox.Root
        id={name}
        className={styles.checkboxRoot}
        checked={value}
        onCheckedChange={onChange}
      >
        <RadixCheckbox.Indicator className={styles.checkboxIndicator}>
          {value && <CheckIcon aria-hidden />}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    </div>
  );
};

export default BooleanProperty;
