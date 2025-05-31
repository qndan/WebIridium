import type { SimResult } from "@/third-party/copasi";
import type { TimeCourseParameters } from "@/stores/workspace";

export type TimeCourseAction = {
  type: "timeCourse";
  id: number;
  payload: {
    parameters:
      | TimeCourseParameters
      | (TimeCourseParameters & ParameterScanOptions);
  };
};

export type TimeCourseResult = {
  type: "timeCourse";
  id: number;
  data: SimResult;
};

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
  ): Promise<TimeCourseResult["data"]>;
}
