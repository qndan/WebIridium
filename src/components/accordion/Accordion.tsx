import styles from "./Accordion.module.css";

export interface AccordionProps {
  children: React.ReactNode;
}

const Accordion = ({ children }: AccordionProps) => {
  return <div className={styles.accordion}>{children}</div>;
};

export default Accordion;
