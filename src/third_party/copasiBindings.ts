/* eslint-disable */

/**
 * Wraps over the copasi.js module to avoid having to keep track of the module object.
 * IMPORTANT: accessing any bindings will error if the module has not yet loaded.
 */

import COPASI from "./copasi";

// Proxy object that errors when you try to access it, in place of the COPASI module while it is still loading.
// Pretty ugly, but hopefully keeps external code simpler.
const notLoadedObject = {};
const notLoadedProxy = new Proxy(notLoadedObject, {
  get() {
    throw new Error("COPASI not yet loaded.");
  }
});

// Put the bindings in a container so we can export it while still being able to mutate.
const copasi = {
  bindings: notLoadedProxy as unknown as InstanceType<typeof COPASI>,
};

//@ts-ignore - createCpsModule is loaded in index.html
createCpsModule().then((module) => {
  copasi.bindings = new COPASI(module);
});

export default copasi;
