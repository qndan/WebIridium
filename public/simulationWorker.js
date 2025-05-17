importScripts(
  "/libantimony.js",
  "/antimony_wrap.js",
  "/copasijs.js",
  "/copasi.js",
);

let copasi = null;
let antimony = null;

let loadedPromise = null;
const loadLibraries = () => {
  if (loadedPromise) {
    return loadedPromise;
  }

  loadedPromise = Promise.all([
    createCpsModule().then((module) => (copasi = new COPASI(module))),
    libantimony().then((module) => (antimony = new AntimonyWrapper(module))),
  ]);

  return loadedPromise;
};

self.onmessage = async (e) => {
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
