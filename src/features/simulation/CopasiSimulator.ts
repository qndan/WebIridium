import type { TimeCourseParameters } from "@/stores/workspace.ts";
import type { ModelInfo, SimResult } from "@/third-party/copasi";
import { Simulator, type ParameterScanOptions } from "./Simulator";
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
    {
      parameters,
      parameterScanOptions,
    }: {
      parameters: TimeCourseParameters;
      parameterScanOptions?: ParameterScanOptions;
    },
    abortSignal?: AbortSignal,
  ): Promise<SimResult> {
    const result = await this.#workerPool.queueTask(
      "timeCourse",
      {
        parameters,
        varyingParameter: parameterScanOptions?.varyingParameter,
        varyingParameterValue: parameterScanOptions?.varyingParameterValue,
      },
      antimonyCode,
      abortSignal,
    );

    return result as SimResult;
  }

  async getModelInfo(antimonyCode: string, abortSignal?: AbortSignal) {
    return (await this.#workerPool.queueTask(
      "loadModel",
      null,
      antimonyCode,
      abortSignal,
    )) as ModelInfo;
  }

  getParameterFromSpecies(species: string): string {
    return `[${species}]_0`;
  }
}
