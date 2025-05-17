import type { SimResult } from "@/third_party/copasi";

importScripts(
  "/libantimony.js",
  "/antimony_wrap.js",
  "/copasijs.js",
  "/copasi.js",
);

export type SimulateAction = {
  type: "timeCourse";
  id: number;
  payload: string;
};

export type SimulateResult = {
  type: "timeCourse";
  id: number;
  data: SimResult;
};

export type Action = SimulateAction;
export type Result = SimulateResult;

// Global variables declared from importing the above scripts.
// We do this to make TypeScript happy.
const globalInjected = globalThis as unknown as {
  createCpsModule: () => Promise<object>; // from copasijs.js
  COPASI: new (module: object) => object; // constructor from copasi.js
  libantimony: () => Promise<object>; // from libantimony
  AntimonyWrapper: new (module: object) => object; // from anitmony_wrap
};

// Class declarations not added to globalThis automatically. We have to do it manually.
//@ts-ignore-next
globalInjected.COPASI = COPASI;
//@ts-ignore-next
globalInjected.AntimonyWrapper = AntimonyWrapper;

let copasi: any;
let antimony: any;

let loadedPromise: Promise<unknown>;
const loadLibraries = () => {
  if (loadedPromise) {
    return loadedPromise;
  }

  loadedPromise = Promise.all([
    globalInjected
      .createCpsModule()
      .then((module) => (copasi = new globalInjected.COPASI(module))),
    globalInjected
      .libantimony()
      .then(
        (module) => (antimony = new globalInjected.AntimonyWrapper(module)),
      ),
  ]);

  return loadedPromise;
};

self.onmessage = async (e: MessageEvent<Action>) => {
  await loadLibraries();

  const action = e.data;
  switch (action.type) {
    case "timeCourse":
      const sbmlConversion = antimony.convertAntimonyToSBML(action.payload);
      // TODO: notify user about these warnings
      if (sbmlConversion.getWarnings()) {
        console.warn(sbmlConversion.getWarnings());
      }
      if (!sbmlConversion.isSuccess())
        throw new Error(sbmlConversion.getResult());

      copasi.loadModel(sbmlConversion.getResult());

      const result = copasi.simulateEx(0, 20, 200);
      self.postMessage({
        type: "timeCourse",
        id: action.id,
        data: result,
      });
      break;

    default:
      throw new Error(`invalid action type: ${action.type}`);
  }
};
