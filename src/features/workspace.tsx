import { createContext, useContext, useEffect, useMemo } from "react";
import type { ModelInfo } from "@/third-party/copasi";
import { type Simulator } from "@/features/simulation/Simulator";
import { ScopeProvider } from "jotai-scope";
import {
  allWorkspaceAtoms,
  parameterScanParametersAtom,
  editorContentAtom,
  modelInfoAtom,
} from "@/stores/workspace";
import { CopasiSimulator } from "@/features/simulation/CopasiSimulator";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { WorkerTermination } from "./workerPool";

export interface Workspace {
  simulator: Simulator;
}

const WorkspaceContext = createContext<Workspace | null>(null);

const hasParameter = (
  simulator: Simulator,
  modelInfo: ModelInfo,
  name: string | null,
): boolean => {
  return Boolean(
    modelInfo.global_parameters.find((param) => param.name === name) ||
      modelInfo.species.find(
        (specie) => simulator.getParameterFromSpecies(specie.name) === name,
      ),
  );
};

/**
 * This component just exists to update the model info.
 * It has to be in a separate component so it has access to the context.
 * TODO: Find a better way to do this. Probably make a useSetEditorContent hook that
 *       does this intead of using an effect once Monaco is integrated.
 */
const ModelInfoUpdater = () => {
  const simulator = useSimulator();
  const setModelInfo = useSetAtom(modelInfoAtom);
  const editorContent = useAtomValue(editorContentAtom);
  const [parameterScanParameters, setParameterScanParameters] = useAtom(
    parameterScanParametersAtom,
  );

  useEffect(() => {
    const abortController = new AbortController();

    void simulator
      .getModelInfo(editorContent, abortController.signal)
      .then((info) => {
        if (
          !hasParameter(
            simulator,
            info,
            parameterScanParameters.varyingParameter,
          )
        ) {
          setParameterScanParameters({
            ...parameterScanParameters,
            varyingParameter: info.global_parameters[0]?.name,
          });
        }

        console.log(info);
        setModelInfo(info);
      })
      .catch((err) => {
        if (!(err instanceof WorkerTermination)) {
          console.error(err);
        }
      });

    return () => abortController.abort();
  }, [
    editorContent,
    parameterScanParameters,
    setModelInfo,
    setParameterScanParameters,
    simulator,
  ]);

  return <></>;
};

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const workspace = useMemo(() => {
    return Object.freeze({
      simulator: new CopasiSimulator(),
    });
  }, []);

  return (
    <ScopeProvider atoms={allWorkspaceAtoms}>
      <WorkspaceContext value={workspace}>
        <ModelInfoUpdater />
        {children}
      </WorkspaceContext>
    </ScopeProvider>
  );
};

// eslint-disable-next-line
export const useSimulator = () => {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("must be inside a workspace!");
  }

  return workspace.simulator;
};
