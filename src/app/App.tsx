import PanelLayout from "@/components/PanelLayout";
import TimeCourseSimulationPanel from "./panels/TimeCourseSimulationPanel";
import AntimonyEditorPanel from "./panels/AntimonyEditorPanel";
import PlotPanel from "./panels/results/PlotPanel";

const App = () => {
  return (
    <div id="app">
      <PanelLayout>
        <TimeCourseSimulationPanel />
        <AntimonyEditorPanel />
        <PlotPanel />
      </PanelLayout>
    </div>
  );
};

export default App;
