import styles from "./VariableList.module.css";
import EyeIcon from "@/assets/icons/EyeIcon.svg?react";
import { type VariableOptions } from "@/stores/workspace";

export interface VariableItemProps {
  variable: VariableOptions;
}

const VariableItem = ({ variable }: VariableItemProps) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemActionList}>
        <button className={styles.itemAction}>
          {/* TODO: add aria stuff to this */}
          <EyeIcon height="14" width="14" />
        </button>
      </div>

      <span className={styles.itemName}>{variable.name}</span>
    </div>
  );
};

export default VariableItem;
