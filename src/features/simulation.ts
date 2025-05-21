import type { SimResult } from "@/third_party/copasi";
import type { TimeCourseParameters } from "@/stores/workspace.tsx";
import { WorkerPool } from "./workerPool.ts";
import { createWorker } from "./workers.ts";

const simulationWorkerPool = new WorkerPool(() => createWorker("simulation"), {
  maxWorkers: 3,
});

export const simulateTimeCourse = async (
  antimonyCode: string,
  parameters: TimeCourseParameters,
  abortSignal?: AbortSignal,
): Promise<SimResult> => {
  const result = await simulationWorkerPool.queueTask(
    "timeCourse",
    {
      antimonyCode,
      parameters,
    } as TimeCourseAction["payload"],
    abortSignal,
  );
  return (result as TimeCourseResult).data;
};

//// Implementation:

// Types for the worker
export type TimeCourseAction = {
  type: "timeCourse";
  id: number;
  payload: {
    antimonyCode: string;
    parameters: TimeCourseParameters;
  };
};

export type TimeCourseResult = {
  type: "timeCourse";
  id: number;
  data: SimResult;
};
