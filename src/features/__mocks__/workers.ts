import type { SimResult } from "@/third_party/copasi.js";
import type { Action, Result } from "../workerPool.ts";
import type { WorkerType } from "../workers.ts";

class MockWorkerPort extends EventTarget {
  worker: MockWorker;

  constructor(worker: MockWorker) {
    super();
    this.worker = worker;
  }

  emitMessageEvent(data: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  postMessage(data: unknown) {
    this.worker.emitMessageEvent(data);
  }
}

class MockWorker extends EventTarget {
  port: MockWorkerPort;

  constructor() {
    super();
    this.port = new MockWorkerPort(this);
  }

  emitMessageEvent(data: unknown) {
    this.dispatchEvent(new MessageEvent("message", { data }));
  }

  postMessage(data: unknown) {
    this.port.emitMessageEvent(data);
  }
}

export const createWorker = (type: WorkerType) => {
  switch (type) {
    case "simulation": {
      const worker = new MockWorker();
      worker.addEventListener("message", (e) => {
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
