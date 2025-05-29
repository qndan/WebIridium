import { describe, it, expect, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWrappedStores } from "@/testing-utils/render.tsx";
import { userEvent } from "@testing-library/user-event";
import TimeCoursePanel from "../simulation/TimeCoursePanel.tsx";
import {
  resetWorkerResponseDelay,
  setWorkerResponseDelay,
} from "@/testing-utils/mockWorker.ts";
import PlotPanel from "../results/PlotPanel.tsx";

vi.mock("@/features/workers.ts");
vi.mock("@/app/panels/results/ResultsPlot.tsx");

afterEach(() => {
  resetWorkerResponseDelay();
});

describe("simulation button", () => {
  it("should disable when starting a simulation", async () => {
    // need to have some delay otherwise the button will instantly simulate and undisable itself
    setWorkerResponseDelay(100);

    renderWrappedStores(<TimeCoursePanel />);

    const button = screen.getByText("Simulate");
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("should cause a plot to display in the plot panel", async () => {
    renderWrappedStores(
      <div>
        <TimeCoursePanel />
        <PlotPanel />
      </div>,
    );

    const button = screen.getByText("Simulate");
    await userEvent.click(button);
    expect(screen.getByTestId("results-plot")).toBeInTheDocument();
  });
});
