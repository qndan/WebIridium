import clsx from "clsx";
import { useState } from "react";
import styles from "./Accordion.module.css";
import ChevronDownIcon from "@/icons/ChevronDownIcon";

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
  };

  return (
    <div className={clsx(styles.item, collapsed && styles.collapsed)}>
      <h3 className={styles.itemTitle}>
        <button
          className={styles.itemTitleButton}
          aria-expanded={!collapsed}
          onClick={onClick}
        >
          {/* TODO: implement WAI-ARIA guidelines of having aria-controls of the button set to id of the body */}
          <div className={styles.itemTitleIcon}>
            <ChevronDownIcon />
          </div>
          {title}
        </button>
      </h3>

      <div
        className={clsx(
          styles.itemBody,
          shouldStartAnimating && styles.itemBodyAnimated,
        )}
        onAnimationEnd={onAnimationEnd}
        style={bodyVisible ? {} : { display: "none" }}
        data-testid="accordionBody"
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;
