import { Accordion as RadixAccordion } from "radix-ui";
import styles from "./PropertyAccordion.module.css";
import ChevronDownIcon from "@/icons/ChevronDownIcon";

export interface AccordionItemProps {
  title: React.ReactNode;
  value: string;
  children?: React.ReactNode;
}

const AccordionItem = ({ title, value, children }: AccordionItemProps) => {
  return (
    <RadixAccordion.Item value={value}>
      <RadixAccordion.Trigger className={styles.itemTrigger}>
        <ChevronDownIcon />
        {title}
      </RadixAccordion.Trigger>
      <RadixAccordion.Content className={styles.itemContent}>
        {children}
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
};

export default AccordionItem;
