import type { SimResult } from "@/third-party/copasi.js";
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
              data: {
                species: [
                  {
                    compartment: "default_compartment",
                    concentration: 10,
                    id: "A",
                    initial_concentration: 10,
                    initial_particle_number: 6.02214179e24,
                    name: "A",
                    particle_number: 6.02214179e24,
                    type: "reactions",
                  },
                  {
                    compartment: "default_compartment",
                    concentration: 0,
                    id: "B",
                    initial_concentration: 0,
                    initial_particle_number: 0,
                    name: "B",
                    particle_number: 0,
                    type: "reactions",
                  },
                  {
                    compartment: "default_compartment",
                    concentration: 0,
                    id: "C",
                    initial_concentration: 0,
                    initial_particle_number: 0,
                    name: "C",
                    particle_number: 0,
                    type: "reactions",
                  },
                ],
                compartments: [
                  {
                    id: "default_compartment",
                    name: "default_compartment",
                    size: 1,
                    type: "fixed",
                  },
                ],
                reactions: [
                  {
                    id: "_J0",
                    local_parameters: [],
                    name: "_J0",
                    reversible: true,
                    scheme: "A = B",
                  },
                  {
                    id: "_J1",
                    local_parameters: [],
                    name: "_J1",
                    reversible: true,
                    scheme: "B = C",
                  },
                ],
                global_parameters: [
                  {
                    id: "k1",
                    initial_value: 0.35,
                    name: "k1",
                    type: "fixed",
                    value: 0.35,
                  },
                  {
                    id: "k2",
                    initial_value: 0.2,
                    name: "k2",
                    type: "fixed",
                    value: 0.2,
                  },
                ],
                time: 0,
                model: {
                  name: "NoName",
                  notes: "",
                },
                status: "success",
                messages:
                  ">WARNING 2025-06-02T02:24:26<\n  SBML (92): The default extent unit has not been set in the model or differs from the substance default units. COPASI will assume that the extent units are the same as the substance units.\n",
              },
            } as Result);
            break;
        }
      });
      break;
    }
  }

  return worker;
};
