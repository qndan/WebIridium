/**
 * Use this to make workers.
 * Mostly meant to be mocked.
 */

export type WorkerType = "copasi";

export const createWorker = (type: WorkerType): Worker => {
  switch (type) {
    case "copasi":
      return new Worker(import.meta.env.BASE_URL + "/copasiWorker.js");
  }
};
