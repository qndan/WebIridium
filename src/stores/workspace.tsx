/**
 * manages stuff about the current workspace. stuff like:
 *  - editor content
 *  - simulation state
 *  - simulation data
 */

import { atom } from "jotai";
import defaultAntimonyModel from "/models/default.ant?raw";
import type { SimResult } from "@/third_party/copasi";

// Atoms

export const editorContentAtom = atom(defaultAntimonyModel);
export const isSimulatingAtom = atom(false);
export const simulationResultAtom = atom<SimResult | null>(null);

/**
 * List of all atoms for the workspace, meant to be used with <ScopeProvider> from "jotai-scope"
 * so you can you scope the workspace.
 */
export const allWorkspaceAtoms = [
  editorContentAtom, isSimulatingAtom, simulationResultAtom];
