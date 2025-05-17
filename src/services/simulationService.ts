import type { SimResult } from "@/third_party/copasi";
import { createWorker } from "./workerService.ts";

export const simulateTimeCourse = (
  antimonyCode: string,
): Promise<SimResult> => {
  return new Promise((resolve) => {
    queueTask("timeCourse", resolve, antimonyCode);
  }).then((result) => (result as TimeCourseResult).data);
};

//// Implementation:

// Types for the worker
type TimeCourseAction = {
  type: "timeCourse";
  id: number;
  payload: string;
};

type TimeCourseResult = {
  type: "timeCourse";
  id: number;
  data: SimResult;
};

export type Action = TimeCourseAction;
export type Result = TimeCourseResult;
// picked arbitrarily
const MAX_WORKERS = 3;

type Task = {
  id: number;
  /** A task that is "waiting" needs a worker to start it. */
  state: "waiting" | "working" | "done";
  type: Result["type"];
  payload: unknown;
  /** Resolves the promise for the task. */
  resolve: (res: Result) => void;
  /** Worker info of worker currently working on this task. */
  workerInfo?: WorkerInfo;
};

type WorkerInfo = {
  worker: Worker;
  state: "busy" | "idle";
};

const workerPool: WorkerInfo[] = [];
const taskQueue: Task[] = [];

let globalTaskIdCounter = 0;

/**
 * Adds a task to the queue.
 * @returns id of the task that was queued.
 */
const queueTask = (
  type: Result["type"],
  resolve: (res: Result) => void,
  payload: unknown,
): number => {
  const id = globalTaskIdCounter++;

  const task = {
    id,
    type,
    resolve,
    payload,
    state: "waiting" as const,
  };

  taskQueue.push(task);

  const workerInfo = getAvailableWorker();
  if (workerInfo) {
    delegateTask(workerInfo, task);
  }

  return id;
};

const delegateTask = (workerInfo: WorkerInfo, task: Task) => {
  workerInfo.state = "busy";
  task.state = "working";
  task.workerInfo = workerInfo;

  workerInfo.worker.postMessage({
    type: task.type,
    id: task.id,
    payload: task.payload,
  } as Action);
};

const getAvailableWorker = (): WorkerInfo | null => {
  const worker = workerPool.find((w) => w.state === "idle");
  if (worker) {
    return worker;
  } else if (workerPool.length > MAX_WORKERS) {
    return null;
  } else {
    const newWorker = createWorker("simulation");
    const newWorkerInfo: WorkerInfo = {
      state: "idle",
      worker: newWorker,
    };
    initializeWorker(newWorkerInfo);
    workerPool.push(newWorkerInfo);
    return newWorkerInfo;
  }
};

const initializeWorker = (workerInfo: WorkerInfo) => {
  workerInfo.worker.addEventListener("message", (e: MessageEvent<Result>) => {
    const taskIndex = taskQueue.findIndex((t) => t.id === e.data.id);
    if (taskIndex >= 0) {
      const task = taskQueue[taskIndex];
      taskQueue.splice(taskIndex, 1);
      task.state = "done";
      task.workerInfo = undefined;
      task.resolve(e.data);
    }

    const availableTask = taskQueue.find((t) => t.state === "waiting");
    if (availableTask) {
      delegateTask(workerInfo, availableTask);
    } else {
      workerInfo.state = "idle";
    }
  });
};
