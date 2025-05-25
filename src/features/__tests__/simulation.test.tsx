import { describe, it, expect, afterEach } from "vitest";
import { simulateTimeCourse } from "../simulation";
import { WorkerTermination } from "../workerPool";
import { resetWorkerResponseDelay, setWorkerResponseDelay } from "@/testing-utils/mockWorker";

const simulateTimeCourseGeneric = async (abortSignal?: AbortSignal) => {
  return await simulateTimeCourse("blah", {
    startTime: 0,
    endTime: 10,
    numberOfPoints: 200,
  }, abortSignal);
};

afterEach(() => {
  resetWorkerResponseDelay();
});

describe("TimeCourse", () => {
  it("should return a simulation result", async () => {
    const result = await simulateTimeCourseGeneric();

    expect(result).toHaveProperty("titles");
    expect(result).toHaveProperty("columns");
  });

  it("should be abortable", async () => {
    setWorkerResponseDelay(1);
    const abortController = new AbortController();
    const expectPromise = expect(simulateTimeCourseGeneric(abortController.signal)).rejects.toThrowError(new WorkerTermination());
    abortController.abort();
    await expectPromise;
  });
});
