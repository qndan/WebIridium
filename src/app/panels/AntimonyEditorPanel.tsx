import styles from "./AntimonyEditorPanel.module.css";

// TEMPORARY
import defaultModel from "/models/default.ant?raw";

export const AntimonyEditorPanel = () => {
  return (
    <div className={styles.antimonyEditorPanel}>
      <textarea name="anitmony-test" style={{ width: "100%", height: "500px" }}>
        {defaultModel}
      </textarea>
    </div>
  );
};

export default AntimonyEditorPanel;
