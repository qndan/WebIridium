import { MockWorker } from "./mockWorker";
import type { Action, Result } from "@/features/workerPool";

let internalCount = 0;

export const resetCountingWorkerCount = () => {
  internalCount = 0;
};

/**
 * Counting workers count up, globally, starting at 0.
 */
export const createCountingWorker = (): Worker => {
  const worker = new MockWorker();
  worker.port.addEventListener("message", (e) => {
    const action = (e as MessageEvent<Action>).data;
    switch (action.type) {
      case "count":
        worker.port.postMessage({
          type: "count",
          id: action.id,
          data: internalCount++,
        } as Result);
        break;
    }
  });
  return worker as unknown as Worker;
};
