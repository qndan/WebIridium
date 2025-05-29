import styles from "./App.module.css";
import PanelLayout from "@/components/PanelLayout";
import Sidebar, { type SidebarTab } from "./Sidebar";
import TimeCoursePanel from "./panels/simulation/TimeCoursePanel";
import ParameterScanPanel from "./panels/simulation/ParamterScanPanel";
import AntimonyEditorPanel from "./panels/AntimonyEditorPanel";
import PlotPanel from "./panels/results/PlotPanel";
import { useState } from "react";

const App = () => {
  const [tab, setTab] = useState<SidebarTab>("TimeCourse");
  return (
    <div className={styles.app}>
      <Sidebar
        tabs={["TimeCourse", "ParameterScan"]}
        currentTab={tab}
        onTabChange={setTab}
      />
      <PanelLayout>
        {tab === "TimeCourse" ? <TimeCoursePanel /> : <ParameterScanPanel />}
        <AntimonyEditorPanel />
        <PlotPanel />
      </PanelLayout>
    </div>
  );
};

export default App;
