import { createContext, useContext, useMemo } from "react";
import { SimulationManager } from "./simulation";
import { ScopeProvider } from "jotai-scope";
import { allWorkspaceAtoms } from "@/stores/workspace";

export interface Workspace {
  simulationManager: SimulationManager;
}

const WorkspaceContext = createContext<Workspace | null>(null);

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const workspace = useMemo(() => {
    return Object.freeze({
      simulationManager: new SimulationManager(),
    });
  }, []);

  return (
    <ScopeProvider atoms={allWorkspaceAtoms}>
      <WorkspaceContext value={workspace}>{children}</WorkspaceContext>
    </ScopeProvider>
  );
};

export const useWorkspace = () => {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("must be inside a workspace!");
  }

  return workspace;
};
