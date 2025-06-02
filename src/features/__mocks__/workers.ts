import type { ModelInfo, SimResult } from "@/third-party/copasi.js";
import type { Action, Result } from "../workerPool.ts";
import type { WorkerType } from "../workers.ts";
import { MockWorker } from "@/testing-utils/mockWorker.ts";

export const createWorker = (type: WorkerType) => {
  const worker = new MockWorker();

  switch (type) {
    case "copasi": {
      worker.port.addEventListener("message", (e) => {
        const action = (e as MessageEvent<Action>).data;
        switch (action.type) {
          case "timeCourse":
            worker.port.postMessage({
              type: "timeCourse",
              id: action.id,
              data: {
                num_variables: 2,
                recorded_steps: 10,
                titles: ["Time", "Mock"],
                columns: [
                  [1, 2, 3, 4, 5],
                  [0, 1, 2, 3, 4],
                ],
              } as SimResult,
            } as Result);
            break;

          case "loadModel":
            // TODO: mock this properly
            worker.port.postMessage({
              type: "loadModel",
              id: action.id,
              data: {} as ModelInfo,
            } as Result);
            break;
        }
      });
      break;
    }
  }

  return worker;
};
