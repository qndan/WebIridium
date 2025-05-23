import type { SimResult } from "@/third-party/copasi.js";
import type { Action, Result } from "../workerPool.ts";
import type { WorkerType } from "../workers.ts";
import { MockWorker } from "@/testing-utils/mockWorker.ts";

export const createWorker = (type: WorkerType) => {
  switch (type) {
    case "simulation": {
      const worker = new MockWorker();
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
        }
      });
      break;
    }
  }
};
