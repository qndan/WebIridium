import { Checkbox as RadixCheckbox } from "radix-ui";
import styles from "./PropertyList.module.css";
import CheckIcon from "@/icons/CheckIcon";

export interface BooleanPropertyProps {
  name: string;
  value: boolean;
  onChange: (newValue: boolean) => void;

  /**
   * By default it looks like this:
   *   property name    [x]
   * in aside mode it looks like this:
   *  [x] property name
   * I don't know what else to call it.
   */
  asideMode?: boolean;
}

const BooleanProperty = ({
  name,
  value,
  onChange,
  asideMode,
}: BooleanPropertyProps) => {
  return (
    <div className={asideMode ? styles.asideProperty : styles.property}>
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
