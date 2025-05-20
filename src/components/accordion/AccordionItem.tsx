import clsx from "clsx";
import { useState } from "react";
import styles from "./Accordion.module.css";
import ChevronDown from "@/icons/ChevronDown";
import ChevronUp from "@/icons/ChevronUp";

export interface AccordionItemProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [collapsed, setCollapsed] = useState(false);
  // collapsing makes the body `height: 0` via animation, we use this state to keep
  // track of when its closed so we can make it `display: none` as well.
  const [bodyVisible, setBodyVisible] = useState(!collapsed);
  // at the beginning, the opening animation will play which is not what we want
  const [shouldStartAnimating, setShouldStartAnimating] = useState(false);

  const onClick = () => {
    setShouldStartAnimating(true);
    if (collapsed) {
      setCollapsed(false);
      setBodyVisible(true);
    } else {
      setCollapsed(true);
    }
  };

  const onAnimationEnd = () => {
    setBodyVisible(!collapsed);
  }

  return (
    <div className={clsx(styles.accordionItem, collapsed && styles.collapsed)}>
      <h3 className={styles.accordionItemTitle}>
        <button
          className={styles.accordionItemTitleButton}
          aria-expanded={!collapsed}
          onClick={onClick}
        >
          {/* TODO: implement WAI-ARIA guidelines of having aria-controls of the button set to id of the body */}
          <div className={styles.accordionItemTitleIcon}>
            <ChevronDown />
          </div>
          {title}
        </button>
      </h3>

      <div
        className={clsx(styles.accordionItemBody,
                        shouldStartAnimating && styles.accordionItemBodyAnimated)}
        onAnimationEnd={onAnimationEnd}
        style={bodyVisible ? {} : {display: "none"}}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;
