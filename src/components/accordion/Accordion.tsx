import styles from "./Accordion.module.css";

export interface AccordionProps {
  children: React.ReactNode;
}

const Accordion = ({ children }: AccordionProps) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Accordion;
