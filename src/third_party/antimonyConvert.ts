/**
 * Functions for converting between formats.
 *
 * adapted from: https://github.com/sys-bio/libantimonyjs/blob/main/docs/demo/antimony_wrap.js
 */

import * as antimonyBindings from "./antimonyBindings";

export type ConvertResult =
  | { success: true; result: string; warnings: string }
  | { success: false; errorMessage: string; warnings: string };

/**
 * Converts antimony model to an SBML model.
 * @param antCode - the antimony model to be converted.
 * @returns instance of the model conversion to SBML
 */
export const convertAntimonyToSBML = (antCode: string): ConvertResult => {
  antimonyBindings.clearPreviousLoads();
  let newResult: ConvertResult;
  let sbmlResult: string;
  let warnings = "";
  const ptrAntCode = antimonyBindings.jsAllocateUTF8(antCode);
  const load_int = antimonyBindings.loadAntimonyString(ptrAntCode);
  warnings = antimonyBindings.getSBMLWarnings(null);
  //console.log("loadAntimonyString(): int returned: ", load_int);
  if (load_int > 0) {
    sbmlResult = antimonyBindings.getSBMLString();
    newResult = {
      success: true,
      result: sbmlResult,
      warnings: warnings,
    };
  } else {
    const errStr = antimonyBindings.getLastError();
    //console.log('error:', errStr);
    newResult = {
      success: false,
      errorMessage: errStr,
      warnings: warnings,
    };
  }
  //console.log('Warnings: ', warnings);
  antimonyBindings.jsFree(ptrAntCode);
  return newResult;
};

/**
 * Converts SBML model to an Antimony model.
 * @param sbmlCode - the SBML model to be converted.
 * @returns instance of the model conversion to Antimony
 */
export const convertSBMLToAntimony = (sbmlCode: string): ConvertResult => {
  antimonyBindings.clearPreviousLoads();
  let antResult: string;
  let warnings = "";
  let newResult: ConvertResult;
  const ptrSBMLCode = antimonyBindings.jsAllocateUTF8(sbmlCode);
  const load_int = antimonyBindings.loadSBMLString(ptrSBMLCode);
  warnings = antimonyBindings.getSBMLWarnings(null);
  //console.log("loadSBMLString: int returned: ", load_int);
  if (load_int > 0) {
    antResult = antimonyBindings.getAntimonyString();
    newResult = {
      success: true,
      result: antResult,
      warnings: warnings,
    };
  } else {
    const errStr = antimonyBindings.getLastError();
    //console.log('error:', errStr);
    newResult = {
      success: false,
      errorMessage: errStr,
      warnings: warnings,
    };
  }
  antimonyBindings.jsFree(ptrSBMLCode);
  return newResult;
};
