// TODO: Add automatically killing unused workers.
//       This is low priority since there isn't any obvious way to get multiple workers at the moment.

export type Action = {
  type: string;
  id: number;
  payload: unknown;
};

export type Result = {
  type: string;
  id: number;
  data: unknown;
};

export type WorkerPoolOptions = {
  maxWorkers?: number;
};

type Task = {
  id: number;
  state: "waiting" | "working" | "done" | "terminated";
  type: Result["type"];
  payload: unknown;
  /** Resolves the promise for the task. */
  resolve: (res: Result) => void;
  reject: (reason: unknown) => void;
  /** Worker info of worker currently working on this task. */
  workerInfo?: WorkerInfo;
};

type WorkerInfo = {
  worker: Worker;
  state: "idle" | "busy" | "dead";
};

/**
 * give this worker pool tasks, it will find a worker to do the task
 * and return the result. Pass a `createWorker` function so the worker
 * can create workers to do its tasks.
 *
 * THIS DOES NOT ACCEPT ANY OLD WORKER. When you post a message to a worker created by
 * this worker pool, it must accept Action as the message's data. It must pass Result with the same id
 * back to the main thread.
 *
 * See `/public/simulationWorker.js` for an example of what a worker
 * used by this worker pool should look like.
 */
export class WorkerPool {
  readonly maxWorkers: number;

  #createWorker: () => Worker;
  #workers: WorkerInfo[];
  #tasks: Task[];
  #idCounter: number = 0;

  constructor(
    createWorker: () => Worker,
    { maxWorkers = 3 }: WorkerPoolOptions = {},
  ) {
    this.maxWorkers = maxWorkers;

    this.#createWorker = createWorker;
    this.#workers = [];
    this.#tasks = [];
  }

  queueTask(
    type: string,
    payload: unknown,
    abortSignal?: AbortSignal,
  ): Promise<unknown> {
    const id = this.#idCounter++;
    return new Promise((resolve, reject) => {
      const task: Task = {
        id,
        type,
        resolve,
        reject,
        payload,
        state: "waiting" as const,
      };

      this.#tasks.push(task);

      if (abortSignal) {
        abortSignal.onabort = () => {
          this.#terminateTask(task);
        };
      }

      const workerInfo = this.#getAvailableWorker();
      if (workerInfo) {
        this.#delegateTask(workerInfo, task);
      }

      return id;
    });
  }

  #delegateTask(workerInfo: WorkerInfo, task: Task) {
    if (task.state === "terminated") {
      throw new Error("cannot start terminated task");
    }

    workerInfo.state = "busy";
    task.state = "working";
    task.workerInfo = workerInfo;

    workerInfo.worker.postMessage({
      type: task.type,
      id: task.id,
      payload: task.payload,
    } as Action);
  }

  #terminateTask(task: Task) {
    if (task.state === "working") {
      const index = this.#tasks.indexOf(task);
      this.#tasks.splice(index, 1);

      task.state = "terminated";
      task.reject(new WorkerTermination());
      this.#removeWorker(task.workerInfo as WorkerInfo);
    }
  }

  #getAvailableWorker(): WorkerInfo | null {
    const worker = this.#workers.find((w) => w.state === "idle");
    if (worker) {
      return worker;
    } else if (this.#workers.length > this.maxWorkers) {
      return null;
    } else {
      const newWorker = this.#createWorker();
      const newWorkerInfo: WorkerInfo = {
        state: "idle",
        worker: newWorker,
      };
      this.#initializeWorker(newWorkerInfo);
      this.#workers.push(newWorkerInfo);
      return newWorkerInfo;
    }
  }

  #initializeWorker(workerInfo: WorkerInfo) {
    workerInfo.worker.addEventListener("message", (e: MessageEvent<Result>) => {
      const taskIndex = this.#tasks.findIndex((t) => t.id === e.data.id);
      if (taskIndex >= 0) {
        const task = this.#tasks[taskIndex];
        this.#tasks.splice(taskIndex, 1);
        task.state = "done";
        task.workerInfo = undefined;
        task.resolve(e.data);
      }

      const availableTask = this.#tasks.find((t) => t.state === "waiting");
      if (availableTask) {
        this.#delegateTask(workerInfo, availableTask);
      } else {
        workerInfo.state = "idle";
      }
    });
  }

  #removeWorker(workerInfo: WorkerInfo) {
    workerInfo.state = "dead";
    workerInfo.worker.terminate();

    const index = this.#workers.indexOf(workerInfo);
    this.#workers.splice(index, 1);
  }
}

export class WorkerTermination extends Error {}
