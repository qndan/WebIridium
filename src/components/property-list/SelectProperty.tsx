import clsx from "clsx";
import { Select as RadixSelect } from "radix-ui";
import styles from "./PropertyList.module.css";
import ChevronDownIcon from "@/icons/ChevronDownIcon";
import CheckIcon from "@/icons/CheckIcon";

export type SelectPropertyPropsBase = {
  name: string;
  value: string;
  onChange: (newValue: string) => void;
};

export type SelectPropertyBasicProps = SelectPropertyPropsBase & {
  options: string[];
};

export type SelectPropertyGroupedProps = SelectPropertyPropsBase & {
  groups: Record<string, string[]>;
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
          className={clsx(styles.propertyInput, styles.selectTrigger)}
        >
          <RadixSelect.Value placeholder={name} />
          <RadixSelect.Icon className={styles.selectTriggerIcon}>
            {/* TODO: flip this upside down so it points up */}
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.selectContent}>
            <RadixSelect.ScrollUpButton className={styles.selectScrollButton}>
              <ChevronDownIcon />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport>
              {"options" in props &&
                props.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}

              {"groups" in props &&
                /* this is horrible :( */
                Object.entries(props.groups).map(([group, options]) => (
                  <RadixSelect.Group key={group}>
                    <RadixSelect.Label className={styles.selectLabel}>
                      {group}
                    </RadixSelect.Label>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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
