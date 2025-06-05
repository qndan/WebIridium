import clsx from "clsx";
import { Select as RadixSelect } from "radix-ui";
import styles from "./PropertyList.module.css";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon.svg?react";
import CheckIcon from "@/assets/icons/CheckIcon.svg?react";

export type SelectPropertyPropsBase = {
  name: string;
  value: string;
  onChange: (newValue: string) => void;
};

export type SelectPropertyBasicProps = SelectPropertyPropsBase & {
  options: { [name: string]: string };
};

export type SelectPropertyGroupedProps = SelectPropertyPropsBase & {
  groups: { [group: string]: { [name: string]: string } };
};

export type SelectPropertyProps =
  | SelectPropertyBasicProps
  | SelectPropertyGroupedProps;

const SelectItem = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <RadixSelect.Item value={value} className={styles.selectItem}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className={styles.selectItemIndicator}>
        <CheckIcon />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
};

const SelectProperty = (props: SelectPropertyProps) => {
  const { name, value, onChange } = props;

  return (
    <div className={styles.property}>
      <label htmlFor={name} className={styles.propertyName}>
        {name}
      </label>

      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          id={name}
          className={clsx(styles.propertyInput, styles.selectTrigger)}
        >
          <RadixSelect.Value placeholder={name} />
          <RadixSelect.Icon className={styles.selectTriggerIcon}>
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.selectContent}>
            <RadixSelect.ScrollUpButton
              className={styles.selectScrollButton}
              style={{ transform: "rotate(180deg)" }}
            >
              <ChevronDownIcon />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport>
              {"options" in props &&
                Object.entries(props.options).map(([name, value]) => (
                  <SelectItem key={value} value={value}>
                    {name}
                  </SelectItem>
                ))}

              {"groups" in props &&
                /* this is horrible :( */
                Object.entries(props.groups).map(([group, options]) => (
                  <RadixSelect.Group key={group}>
                    <RadixSelect.Label className={styles.selectLabel}>
                      {group}
                    </RadixSelect.Label>
                    {Object.entries(options).map(([name, value]) => (
                      <SelectItem key={value} value={value}>
                        {name}
                      </SelectItem>
                    ))}
                  </RadixSelect.Group>
                ))}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className={styles.selectScrollButton}>
              <ChevronDownIcon />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
};

export default SelectProperty;
