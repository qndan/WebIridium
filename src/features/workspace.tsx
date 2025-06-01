import { createContext, useContext, useEffect, useMemo } from "react";
import { type Simulator } from "@/features/simulation/Simulator";
import { ScopeProvider } from "jotai-scope";
import {
  allWorkspaceAtoms,
  editorContentAtom,
  modelInfoAtom,
} from "@/stores/workspace";
import { CopasiSimulator } from "@/features/simulation/CopasiSimulator";
import { useSetAtom, useAtomValue } from "jotai";
import { WorkerTermination } from "./workerPool";

export interface Workspace {
  simulator: Simulator;
}

const WorkspaceContext = createContext<Workspace | null>(null);

/**
 * This component just exists to update the model info.
 * It has to be in a separate component so it has access to the context.
 * TODO: Find a better way to do this. Probably make a useSetEditorContent hook that
 *       does this intead of using an effect once Monaco is integrated.
 */
const ModelInfoUpdater = () => {
  const workspace = useWorkspace();
  const setModelInfo = useSetAtom(modelInfoAtom);
  const editorContent = useAtomValue(editorContentAtom);

  useEffect(() => {
    const abortController = new AbortController();

    void workspace.simulator
      .getModelInfo(editorContent, abortController.signal)
      .then((info) => {
        console.log(info);
        setModelInfo(info);
      })
      .catch((err) => {
        if (!(err instanceof WorkerTermination)) {
          console.error(err);
        }
      });

    return () => abortController.abort();
  }, [editorContent]);

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
export const useWorkspace = () => {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("must be inside a workspace!");
  }

  return workspace;
};
