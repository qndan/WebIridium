import type { SimResult } from "@/third_party/copasi";
import { WorkerPool } from "./workerPool.ts";
import { createWorker } from "./workers.ts";

const simulationWorkerPool = new WorkerPool(() => createWorker("simulation"), {
  maxWorkers: 3,
});

export const simulateTimeCourse = async (
  antimonyCode: string,
  abortSignal?: AbortSignal,
): Promise<SimResult> => {
  const result = await simulationWorkerPool.queueTask(
    "timeCourse",
    antimonyCode,
    abortSignal,
  );
  return (result as TimeCourseResult).data;
};

//// Implementation:

// Types for the worker
export type TimeCourseAction = {
  type: "timeCourse";
  id: number;
  payload: string;
};

export type TimeCourseResult = {
  type: "timeCourse";
  id: number;
  data: SimResult;
};
