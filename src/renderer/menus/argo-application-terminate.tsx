import { Common, Renderer } from "@freelensapp/extensions";
import { terminateApplicationOperation } from "../endpoints/argo-application-endpoints";
import { ArgoApplication, getArgoApplicationStore } from "../k8s/argocd";
import { runGuardedArgoMutation } from "../mutations";

const {
  Component: { Icon, MenuItem },
} = Renderer;

const terminalPhases = new Set(["Succeeded", "Failed", "Error"]);

export interface ArgoTerminateMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoApplication> {
  extension: Renderer.LensExtension;
}

export const ArgoTerminateMenuItem = (props: ArgoTerminateMenuItemProps) => {
  const { object, toolbar } = props;

  if (!object) return <></>;

  const phase = object.status?.operationState?.phase;
  const hasInProgressOperation = !!phase && !terminalPhases.has(phase);

  if (!hasInProgressOperation) return <></>;

  const store = getArgoApplicationStore();

  const terminateOperation = async () => {
    const appName = object.getName?.() ?? object.metadata?.name ?? "application";
    await runGuardedArgoMutation({
      risk: "low",
      actionLabel: "Terminate",
      resourceName: appName,
      run: () => terminateApplicationOperation(store, object),
      successMessage: `Terminate requested for ${appName}`,
      failureFallback: "Failed to terminate operation.",
    });
  };

  return (
    <MenuItem onClick={terminateOperation}>
      <Icon material="stop_circle" interactive={toolbar} title="Terminate Operation" />
      <span className="title">Terminate Operation</span>
    </MenuItem>
  );
};
