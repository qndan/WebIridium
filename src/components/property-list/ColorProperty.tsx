import clsx from "clsx";
import { Popover as RadixPopover } from "radix-ui";
import { HexColorPicker } from "react-colorful";
import styles from "./PropertyList.module.css";

export interface ColorPropertyProps {
  name: string;
  value: string;
  onChange: (newValue: string) => void;
}

// TODO: handle invalid colors inputted from the string input
// TODO: fix the color box being slightly larger than the input box for numeric slider
const ColorProperty = ({ name, value, onChange }: ColorPropertyProps) => {
  return (
    <div className={styles.property}>
      <label htmlFor={name} className={styles.propertyName}>
        {name}
      </label>

      <RadixPopover.Root>
        <RadixPopover.Trigger asChild>
          <button
            className={clsx(styles.colorButton, styles.secondary)}
            style={{ backgroundColor: value }}
            aria-label="Open color picker"
          />
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content className={styles.colorPopup}>
            <HexColorPicker color={value} onChange={onChange} />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>

      <input
        id={name}
        className={styles.propertyInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ColorProperty;
