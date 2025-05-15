import PanelLayout from "./panels/PanelLayout";
import TimeCourseSimulationPanel from "./panels/TimeCourseSimulationPanel";
import AntimonyEditorPanel from "./panels/AntimonyEditorPanel";
import ResultsPanel from "./panels/ResultsPanel";

const App = () => {
  return (
    <div id="app">
      <PanelLayout>
        <TimeCourseSimulationPanel />
        <AntimonyEditorPanel />
        <ResultsPanel />
      </PanelLayout>
    </div>
  );
};

export default App;
