import type { ModelInfo, SimResult } from "@/third-party/copasi";
import type { TimeCourseParameters } from "@/stores/workspace";

export type ParameterScanOptions = {
  varyingParameter: string;
  varyingParameterValue: number;
};

export abstract class Simulator {
  abstract simulateTimeCourse(
    antimonyCode: string,
    parameters:
      | TimeCourseParameters
      | (TimeCourseParameters & ParameterScanOptions),
    abortSignal?: AbortSignal,
  ): Promise<SimResult>;

  abstract getModelInfo(
    antimonyCode: string,
    abortSignal?: AbortSignal,
  ): Promise<ModelInfo>;
}
