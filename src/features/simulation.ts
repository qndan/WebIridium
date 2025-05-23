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
} from "@/stores/workspace";

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
  const editorContent = useAtomValue(editorContentAtom);
  const setSimulationResult = useSetAtom(simulationResultAtom);
  const timeCourseParameters = useAtomValue(timeCourseParametersAtom);
  const [isSimulating, setIsSimulating] = useAtom(isSimulatingAtom);

  const simulateTimeCourseCallback = async (abortSignal?: AbortSignal) => {
    if (!isSimulating) {
      setIsSimulating(true);

      try {
        const result = await simulateTimeCourse(
          editorContent,
          timeCourseParameters,
          abortSignal,
        );
        setSimulationResult(result);
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
    simulateTimeCourse: simulateTimeCourseCallback,
  };
};

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
    } satisfies TimeCourseAction["payload"],
    abortSignal,
  );
  return result as TimeCourseResult["data"];
};

//// Implementation:

const simulationWorkerPool = new WorkerPool(() => createWorker("simulation"), {
  maxWorkers: 3,
});

// Types for the worker:

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
