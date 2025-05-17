import type { Action, Result, SimulateResult } from "public/simulationWorker";
import type { SimResult } from "@/third_party/copasi";

let globalWorker: Worker | null = null;
const pendingResults: {
  type: Result["type"];
  resolve: (res: Result) => void;
}[] = [];

const initGlobalWorker = () => {
  if (globalWorker) globalWorker.terminate();
  globalWorker = new Worker(new URL("/simulationWorker.ts", import.meta.url));
  globalWorker.onmessage = (e: MessageEvent<Result>) => {
    const result = e.data;
    const index = pendingResults.findIndex((v) => v.type == result.type);
    if (index >= 0) {
      const pending = pendingResults[index];
      pendingResults.splice(index, 1);
      pending.resolve(result);
    }
  };
};

export const simulateTimeCourse = (
  antimonyCode: string,
): Promise<SimResult> => {
  if (!globalWorker) initGlobalWorker();
  globalWorker!.postMessage({
    type: "simulate",
    antCode: antimonyCode,
  } as Action);

  return new Promise((resolve) => {
    pendingResults.push({
      type: "simulate",
      resolve: resolve,
    });
  }).then((result) => (result as SimulateResult).data);
};
