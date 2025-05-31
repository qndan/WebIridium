import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type { SimulationResult } from "@/stores/workspace.tsx";

import {
  editorContentAtom,
  isSimulatingAtom,
  simulationResultAtom,
  timeCourseParametersAtom,
  parameterScanParametersAtom,
} from "@/stores/workspace";
import { useWorkspace } from "@/features/workspace.tsx";

export type SimulationOperationResult =
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

  const runSimulation = async (
    run: () => Promise<SimulationResult>,
  ): Promise<SimulationOperationResult> => {
    if (isSimulating) {
      return { type: "failure", message: "simulation already in progress" };
    } else {
      setIsSimulating(true);

      try {
        const result = await run();
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

  const simulateTimeCourse = async (
    abortSignal?: AbortSignal,
  ): Promise<SimulationOperationResult> => {
    return await runSimulation(async () => {
      const result = await workspace.simulator.simulateTimeCourse(
        editorContent,
        timeCourseParameters,
        abortSignal,
      );
      return {
        type: "timeCourse",
        titles: result.titles,
        columns: result.columns,
      };
    });
  };

  const HARDCODED_CHANGE_LATER_parameterName = "k1";
  const runParameterScan = async (abortSignal?: AbortSignal) => {
    return await runSimulation(async () => {
      const resultPromises = [];
      const scanValues = getParameterScanValues(
        parameterScanParameters.min,
        parameterScanParameters.max,
        parameterScanParameters.numberOfValues,
      );

      for (const value of scanValues) {
        resultPromises.push(
          workspace.simulator.simulateTimeCourse(
            editorContent,
            {
              ...timeCourseParameters,
              varyingParameter: HARDCODED_CHANGE_LATER_parameterName,
              varyingParameterValue: value,
            },
            abortSignal,
          ),
        );
      }

      const results = await Promise.all(resultPromises);
      const scans = [];
      for (const [i, result] of results.entries()) {
        scans.push({
          value: scanValues[i],
          titles: result.titles,
          columns: result.columns,
        });
      }

      return {
        type: "parameterScan",
        scans,
        parameter: HARDCODED_CHANGE_LATER_parameterName,
      };
    });
  };

  return {
    isSimulating,
    simulateTimeCourse,
    runParameterScan,
  };
};

/**
 * @returns values of a parameter for parameter scan.
 **/
const getParameterScanValues = (
  min: number,
  max: number,
  numberOfValues: number,
): number[] => {
  const list = [];
  const range = max - min;
  for (let i = 0; i < numberOfValues; i++) {
    const percentage = i / numberOfValues;
    list.push(min + percentage * range);
  }
  return list;
};
