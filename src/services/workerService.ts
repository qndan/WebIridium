/**
 * Use this to make workers.
 * Mostly meant to be mocked.
 */

export const createWorker = (type: "simulation"): Worker => {
  switch (type) {
    case "simulation":
      return new Worker("/simulationWorker.js");
  }
};
