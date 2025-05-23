import { Accordion as RadixAccordion } from "radix-ui";
import styles from "./PropertyAccordion.module.css";

export interface AccordionProps {
  defaultValue: string[];
  children: React.ReactNode;
}

const Accordion = ({ defaultValue, children }: AccordionProps) => {
  // return <div className={styles.accordion}>{children}</div>;
  return (
    <RadixAccordion.Root
      className={styles.accordion}
      type="multiple"
      defaultValue={defaultValue}
    >
      {children}
    </RadixAccordion.Root>
  );
};

export default Accordion;
