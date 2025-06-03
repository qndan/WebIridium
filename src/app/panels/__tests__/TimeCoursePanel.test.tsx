import { describe, vi } from "vitest";
import { renderWithinWorkspace } from "@/testing-utils/render.tsx";
import TimeCoursePanel from "../simulation/TimeCoursePanel.tsx";
import PlotPanel from "../results/PlotPanel.tsx";
import { testSimulationButton } from "./testButton.tsx";

vi.mock("@/features/workers.ts");
vi.mock("react-plotly.js");
vi.mock("plotly.js");

describe("simulation button", () => {
  testSimulationButton("Simulate", () => {
    renderWithinWorkspace(
      <div>
        <TimeCoursePanel />
        <PlotPanel />
      </div>,
    );
  });

  // TODO: need tests to see if the plot display is correct.
  // TODO: need test to see if simple setting updates are working correctly
});
