import styles from "./VariableList.module.css";
import { type VariableOptions } from "@/stores/workspace";
import VariableItem from "./VariableItem";
import SearchIcon from "@/assets/icons/SearchIcon.svg?react";
import { useState } from "react";

export interface VariableListProps {
  variables: VariableOptions[];
}

const VariableList = ({ variables }: VariableListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredVariables = variables.filter((variable) =>
    variable.name.includes(searchTerm),
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchIcon className={styles.searchIcon} height="14" width="14" />
        <input
          className={styles.searchInput}
          type="search"
          name="variable-search"
          placeholder="Variable name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredVariables.length > 0 ? (
        <div className={styles.list}>
          {filteredVariables.map((variable) => (
            <VariableItem key={variable.name} variable={variable} />
          ))}
        </div>
      ) : (
        <div className={styles.nothingFound}>No variables found</div>
      )}
    </div>
  );
};

export default VariableList;
