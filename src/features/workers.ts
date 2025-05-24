/**
 * Use this to make workers.
 * Mostly meant to be mocked.
 */

export type WorkerType = "simulation";

export const createWorker = (type: WorkerType): Worker => {
  switch (type) {
    case "simulation":
      return new Worker(new URL("/simulationWorker.js", import.meta.url));
  }
};
