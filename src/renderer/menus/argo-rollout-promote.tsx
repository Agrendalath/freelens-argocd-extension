import { Common, Renderer } from "@freelensapp/extensions";
import { requestRolloutPromotion } from "../endpoints/argo-rollout-endpoints";
import {
  type ArgoRollout,
  canShowPromoteAction,
  canShowPromoteFullAction,
  canShowPromoteSkipAllStepsAction,
  canShowPromoteSkipCurrentStepAction,
  getArgoRolloutStore,
} from "../k8s/rollouts";
import { runGuardedArgoMutation } from "../mutations";

const {
  Component: { Icon, MenuItem },
} = Renderer;

export interface ArgoRolloutPromoteMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoRollout> {
  extension: Renderer.LensExtension;
}

export interface ArgoRolloutPromoteFullMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoRollout> {
  extension: Renderer.LensExtension;
}

export interface ArgoRolloutPromoteSkipCurrentMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoRollout> {
  extension: Renderer.LensExtension;
}

export interface ArgoRolloutPromoteSkipAllMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoRollout> {
  extension: Renderer.LensExtension;
}

const rolloutName = (object: ArgoRollout) => object.getName?.() ?? object.metadata?.name ?? "rollout";

export const ArgoRolloutPromoteMenuItem = (props: ArgoRolloutPromoteMenuItemProps) => {
  const { object, toolbar } = props;

  if (!object || !canShowPromoteAction(object)) {
    return <></>;
  }

  const rolloutStore = getArgoRolloutStore();

  const onPromote = async () => {
    await runGuardedArgoMutation({
      risk: "low",
      actionLabel: "Promote",
      resourceName: rolloutName(object),
      run: () => requestRolloutPromotion(rolloutStore, object, {}),
      successMessage: `Promote requested for ${rolloutName(object)}`,
      failureFallback: "Failed to promote rollout.",
    });
  };

  return (
    <MenuItem onClick={onPromote}>
      <Icon material="trending_up" interactive={toolbar} title="Promote" />
      <span className="title">Promote</span>
    </MenuItem>
  );
};

export const ArgoRolloutPromoteFullMenuItem = (props: ArgoRolloutPromoteFullMenuItemProps) => {
  const { object, toolbar } = props;

  if (!object || !canShowPromoteFullAction(object)) {
    return <></>;
  }

  const rolloutStore = getArgoRolloutStore();

  const onPromoteFull = async () => {
    await runGuardedArgoMutation({
      risk: "low",
      actionLabel: "Promote Full",
      resourceName: rolloutName(object),
      run: () => requestRolloutPromotion(rolloutStore, object, { full: true }),
      successMessage: `Full promote requested for ${rolloutName(object)}`,
      failureFallback: "Failed to fully promote rollout.",
    });
  };

  return (
    <MenuItem onClick={onPromoteFull}>
      <Icon material="flash_on" interactive={toolbar} title="Promote full" />
      <span className="title">Promote full</span>
    </MenuItem>
  );
};

export const ArgoRolloutPromoteSkipCurrentMenuItem = (props: ArgoRolloutPromoteSkipCurrentMenuItemProps) => {
  const { object, toolbar } = props;

  if (!object || !canShowPromoteSkipCurrentStepAction(object)) {
    return <></>;
  }

  const rolloutStore = getArgoRolloutStore();

  const onSkipCurrent = async () => {
    await runGuardedArgoMutation({
      risk: "low",
      actionLabel: "Skip Current Step",
      resourceName: rolloutName(object),
      run: () => requestRolloutPromotion(rolloutStore, object, { skipCurrentStep: true }),
      successMessage: `Skip current step requested for ${rolloutName(object)}`,
      failureFallback: "Failed to skip current step.",
    });
  };

  return (
    <MenuItem onClick={onSkipCurrent}>
      <Icon material="navigate_next" interactive={toolbar} title="Promote skip current step" />
      <span className="title">Promote (skip current step)</span>
    </MenuItem>
  );
};

export const ArgoRolloutPromoteSkipAllMenuItem = (props: ArgoRolloutPromoteSkipAllMenuItemProps) => {
  const { object, toolbar } = props;

  if (!object || !canShowPromoteSkipAllStepsAction(object)) {
    return <></>;
  }

  const rolloutStore = getArgoRolloutStore();

  const onSkipAll = async () => {
    await runGuardedArgoMutation({
      risk: "low",
      actionLabel: "Skip All Steps",
      resourceName: rolloutName(object),
      run: () => requestRolloutPromotion(rolloutStore, object, { skipAllSteps: true }),
      successMessage: `Skip all steps requested for ${rolloutName(object)}`,
      failureFallback: "Failed to skip all steps.",
    });
  };

  return (
    <MenuItem onClick={onSkipAll}>
      <Icon material="last_page" interactive={toolbar} title="Promote skip all steps" />
      <span className="title">Promote (skip all steps)</span>
    </MenuItem>
  );
};
