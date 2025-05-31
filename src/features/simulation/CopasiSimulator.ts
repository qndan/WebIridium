import type { TimeCourseParameters } from "@/stores/workspace.ts";
import {
  Simulator,
  type TimeCourseAction,
  type TimeCourseResult,
  type ParameterScanOptions,
} from "./Simulator";
import { WorkerPool } from "@/features/workerPool.ts";
import { createWorker } from "@/features/workers.ts";

export class CopasiSimulator extends Simulator {
  #workerPool: WorkerPool;

  constructor() {
    super();
    this.#workerPool = new WorkerPool(() => createWorker("copasi"), {
      maxWorkers: 3,
    });
  }

  async simulateTimeCourse(
    antimonyCode: string,
    parameters:
      | TimeCourseParameters
      | (TimeCourseParameters & ParameterScanOptions),
    abortSignal?: AbortSignal,
  ): Promise<TimeCourseResult["data"]> {
    const result = await this.#workerPool.queueTask(
      "timeCourse",
      {
        parameters,
      } satisfies TimeCourseAction["payload"],
      antimonyCode,
      abortSignal,
    );

    return result as TimeCourseResult["data"];
  }
}
