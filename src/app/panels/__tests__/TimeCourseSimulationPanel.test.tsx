import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import TimeCourseSimulationPanel from "../TimeCourseSimulationPanel.tsx";
import { resetWorkerResponseDelay, setWorkerResponseDelay } from "@/testing-utils/mockWorker.ts";

afterEach(() => {
  resetWorkerResponseDelay();
});

describe("simulation button", () => {
  it("should disable when starting a simulation", async () => {
    // need to have some delay otherwise the button will instantly simulate and undisable itself
    setWorkerResponseDelay(100);

    render(<TimeCourseSimulationPanel />);

    const button = screen.getByText("Simulate");
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });
});
