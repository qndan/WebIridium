import { useAtom } from "jotai";
import styles from "./AntimonyEditorPanel.module.css";

import { editorContentAtom } from "@/stores/workspace";

import defaultModel from "/models/default.ant?raw";
import chickenModel from "/models/chicken.ant?raw";

const models: Record<string, string> = {
  default: defaultModel,
  chicken: chickenModel,
};

export const AntimonyEditorPanel = () => {
  const [editorContent, setEditorContent] = useAtom(editorContentAtom);

  return (
    <div className={styles.antimonyEditorPanel}>
      <select
        onChange={e => setEditorContent(models[e.target.value])}
      >
        <option value="default">Default</option>
        <option value="chicken">Chicken</option>
      </select>
      <textarea
        name="anitmony-test"
        value={editorContent}
        style={{ width: "100%", height: "500px" }}
        onChange={e => setEditorContent(e.target.value)}/>
    </div>
  );
};

export default AntimonyEditorPanel;
