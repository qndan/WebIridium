/**
 * manages state of the current workspace. stuff like:
 *  - editor content
 *  - simulation stuff
 */

import { atom } from "jotai";
import defaultAntimonyModel from "/models/default.ant?raw";
import type { SimResult } from "@/third-party/copasi";

export interface TimeCourseParameters {
  startTime: number;
  endTime: number;
  numberOfPoints: number;
}

export interface GraphSettings {
  backgroundColor: string;
  drawingAreaColor: string;

  includeTitle: boolean;
  title: string;

  includeBorder: boolean;
  borderColor: string;
  borderThickness: number;

  isAutoscaledX: boolean;
  minX: number;
  maxX: number;

  isAutoscaledY: boolean;
  minY: number;
  maxY: number;

  margin: number;
}

// Atoms

export const editorContentAtom = atom(defaultAntimonyModel);
export const isSimulatingAtom = atom(false);
export const simulationResultAtom = atom<SimResult | null>(null);

export const timeCourseParametersAtom = atom<TimeCourseParameters>({
  startTime: 0,
  endTime: 20,
  numberOfPoints: 200,
});

export const graphSettingsAtom = atom<GraphSettings>({
  backgroundColor: "#ffffff",
  drawingAreaColor: "#e1d5ed",

  includeTitle: true,
  title: "Transition of substances in chemical reaction",

  includeBorder: true,
  borderColor: "#000000",
  borderThickness: 0.5,

  isAutoscaledX: true,
  minX: 0,
  maxX: 10,

  isAutoscaledY: true,
  minY: 0,
  maxY: 10,

  margin: 70,
});

/**
 * List of all atoms for the workspace, meant to be used with <ScopeProvider> from "jotai-scope"
 * so you can you scope the workspace.
 */
export const allWorkspaceAtoms = [
  editorContentAtom,
  isSimulatingAtom,
  simulationResultAtom,
  timeCourseParametersAtom,
  graphSettingsAtom,
];
