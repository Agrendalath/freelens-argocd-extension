import { Common, Renderer } from "@freelensapp/extensions";
import { applicationSyncDialogStore } from "../components/application-sync";
import { ArgoApplication } from "../k8s/argocd";

const {
  Component: { MenuItem, Icon },
} = Renderer;

export interface ArgoSyncWithOptionsMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoApplication> {
  extension: Renderer.LensExtension;
}

export const ArgoSyncWithOptionsMenuItem = (props: ArgoSyncWithOptionsMenuItemProps) => {
  const { object, toolbar } = props;

  if (!object) return <></>;

  const openDialog = () => {
    applicationSyncDialogStore.open(object);
  };

  return (
    <MenuItem onClick={openDialog}>
      <Icon material="tune" interactive={toolbar} title="Sync with options" />
      <span className="title">Adv sync</span>
    </MenuItem>
  );
};
