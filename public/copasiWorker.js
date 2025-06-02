importScripts("libantimony.js", "antimony_wrap.js", "copasijs.js", "copasi.js");

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

  // Update loaded model if it changed
  const antimonyCode = action.internalState;
  if (antimonyCode) {
    const sbmlConversion = antimony.convertAntimonyToSBML(antimonyCode);
    // TODO: notify user about these warnings
    if (sbmlConversion.getWarnings()) {
      console.warn(sbmlConversion.getWarnings());
    }
    if (!sbmlConversion.isSuccess()) {
      throw new Error(sbmlConversion.getResult());
    }

    copasi.loadModel(sbmlConversion.getResult());
  }

  switch (action.type) {
    case "timeCourse":
      const { parameters, varyingParameter, varyingParameterValue } =
        action.payload;

      copasi.resetAll();

      // for parameter scan
      if (varyingParameter) {
        copasi.setValue(varyingParameter, varyingParameterValue);
      }

      const result = copasi.simulateEx(
        parameters.startTime,
        parameters.endTime,
        parameters.numberOfPoints,
      );

      self.postMessage({
        type: "timeCourse",
        id: action.id,
        data: result,
      });
      break;

    case "loadModel":
      self.postMessage({
        type: "loadModel",
        id: action.id,
        data: copasi.modelInfo,
      });
      break;

    default:
      throw new Error(`invalid action type: ${action.type}`);
  }
};
