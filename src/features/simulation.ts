import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type { SimResult } from "@/third-party/copasi";
import type { TimeCourseParameters } from "@/stores/workspace.tsx";
import { WorkerPool } from "./workerPool.ts";
import { createWorker } from "./workers.ts";

import {
  editorContentAtom,
  isSimulatingAtom,
  simulationResultAtom,
  timeCourseParametersAtom,
  parameterScanParametersAtom,
} from "@/stores/workspace";
import { useWorkspace } from "./workspace.tsx";

export type SimulationResult =
  | { type: "success" }
  | { type: "failure"; message: string };

/**
 * Hook for simulation capabilities. Handles all the required state
 * management for running simulations.
 *
 * @returns object with:
 * - `isSimulating` - whether a simulation is currently running
 * - `simulateTimeCourse` - start a time course simulation. Accepts an abort signal.
 */
export const useSimulate = () => {
  const workspace = useWorkspace();
  const editorContent = useAtomValue(editorContentAtom);
  const setSimulationResult = useSetAtom(simulationResultAtom);
  const timeCourseParameters = useAtomValue(timeCourseParametersAtom);
  const parameterScanParameters = useAtomValue(parameterScanParametersAtom);
  const [isSimulating, setIsSimulating] = useAtom(isSimulatingAtom);

  const simulateTimeCourse = async (abortSignal?: AbortSignal) => {
    if (!isSimulating) {
      setIsSimulating(true);

      try {
        const result = await workspace.simulationManager.simulateTimeCourse(
          editorContent,
          timeCourseParameters,
          abortSignal,
        );
        setSimulationResult({
          type: "timeCourse",
          titles: result.titles,
          columns: result.columns,
        });
        return { type: "success" };
      } catch (err) {
        // TODO: implement error handling
        return {
          type: "failure",
          message: "Unexpected error while simulating.",
        };
      } finally {
        setIsSimulating(false);
      }
    }
  };

  const HARDCODED_CHANGE_LATER_parameterName = "k1";
  const runParameterScan = async (abortSignal?: AbortSignal) => {
    if (!isSimulating) {
      setIsSimulating(true);

      try {
        const resultPromises = [];
        for (let i = 0; i < parameterScanParameters.numberOfValues; i++) {
          const percentage = i / parameterScanParameters.numberOfValues;
          resultPromises.push(
            workspace.simulationManager.simulateTimeCourse(
              editorContent,
              {
                ...timeCourseParameters,
                varyingParameter: HARDCODED_CHANGE_LATER_parameterName,
                varyingParameterValue:
                  parameterScanParameters.min +
                  percentage *
                    (parameterScanParameters.max - parameterScanParameters.min),
              },
              abortSignal,
            ),
          );
        }

        const results = await Promise.all(resultPromises);

        setSimulationResult({
          type: "parameterScan",
          scans: results,
        });
        return { type: "success" };
      } catch (err) {
        // TODO: implement error handling
        return {
          type: "failure",
          message: "Unexpected error while simulating.",
        };
      } finally {
        setIsSimulating(false);
      }
    }
  };

  return {
    isSimulating,
    simulateTimeCourse,
    runParameterScan,
  };
};

type TimeCourseAction = {
  type: "timeCourse";
  id: number;
  payload: {
    parameters: TimeCourseParameters;
  };
};

type TimeCourseResult = {
  type: "timeCourse";
  id: number;
  data: SimResult;
};

export class SimulationManager {
  #workerPool: WorkerPool;

  constructor() {
    this.#workerPool = new WorkerPool(() => createWorker("simulation"), {
      maxWorkers: 3, // right now only using one worker since it is difficult to manage multiple
    });
  }

  async simulateTimeCourse(
    antimonyCode: string,
    parameters: TimeCourseParameters & {
      varyingParameter?: string;
      varyingParameterValue?: number;
    },
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
