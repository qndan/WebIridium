import { describe, it, expect, afterEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithinWorkspace } from "@/testing-utils/render.tsx";
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

    renderWithinWorkspace(<TimeCoursePanel />);

    const button = screen.getByText("Simulate");
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("should cause a plot to display in the plot panel", async () => {
    renderWithinWorkspace(
      <div>
        <TimeCoursePanel />
        <PlotPanel />
      </div>,
    );

    const button = screen.getByText("Simulate");
    await userEvent.click(button);
    expect(screen.getByTestId("results-plot")).toBeInTheDocument();
  });

  it("should be cancellable", async () => {
    setWorkerResponseDelay(100);

    renderWithinWorkspace(
      <div>
        <TimeCoursePanel />
        <PlotPanel />
      </div>,
    );

    const button = screen.getByText("Simulate");
    await userEvent.click(button);
    const cancel = screen.getByLabelText("Cancel");
    await userEvent.click(cancel);
    expect(button).toBeEnabled();
    expect(cancel).not.toBeInTheDocument();
    expect(screen.queryByTestId("results-plot")).not.toBeInTheDocument();
  });
});
