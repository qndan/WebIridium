import PanelLayout from "@/components/PanelLayout";
import TimeCourseSimulationPanel from "./panels/TimeCourseSimulationPanel";
import AntimonyEditorPanel from "./panels/AntimonyEditorPanel";
import PlotResultsPanel from "./panels/results/PlotResultsPanel";

const App = () => {
  return (
    <div id="app">
      <PanelLayout>
        <TimeCourseSimulationPanel />
        <AntimonyEditorPanel />
        <PlotResultsPanel />
      </PanelLayout>
    </div>
  );
};

export default App;
