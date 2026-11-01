/**
 * Copyright (c) Sebastian Prokesch. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { Renderer } from "@freelensapp/extensions";
import { computed } from "mobx";
import { ArgoPreferencesStore } from "../common/store";
import { registerArgoCdApiIpc } from "./argocd-api";
import { ApplicationSyncDialog } from "./components/application-sync";
import { ArgoApiApplicationDrawer, ArgoApiAppProjectDrawer } from "./components/argo-api-details";
import { ArgoConfigDialog } from "./components/argo-config";
import {
  withDetailsErrorBoundary,
  withMenuItemErrorBoundary,
  withPageErrorBoundary,
} from "./components/error-boundary";
import { ArgoAnalysisRunDetails } from "./details/argo-analysis-run-details";
import { ArgoAnalysisTemplateDetails } from "./details/argo-analysis-template-details";
import { ArgoApplicationDetails } from "./details/argo-application-details";
import { ArgoApplicationSetDetails } from "./details/argo-applicationset-details";
import { ArgoAppProjectDetails } from "./details/argo-appproject-details";
import { ArgoClusterAnalysisTemplateDetails } from "./details/argo-cluster-analysis-template-details";
import { ArgoClusterWorkflowTemplateDetails } from "./details/argo-cluster-workflow-template-details";
import { ArgoConfigDetails } from "./details/argo-config-details";
import { ArgoCronWorkflowDetails } from "./details/argo-cron-workflow-details";
import { ArgoExperimentDetails } from "./details/argo-experiment-details";
import { ArgoRolloutDetails } from "./details/argo-rollout-details";
import { ArgoWorkflowDetails } from "./details/argo-workflow-details";
import { ArgoWorkflowTemplateDetails } from "./details/argo-workflow-template-details";
import { setArgoExtension } from "./extension-ref";
import { ArgoApplication, ArgoApplicationSet, ArgoAppProject } from "./k8s/argocd";
import {
  ArgoAnalysisRun,
  ArgoAnalysisTemplate,
  ArgoClusterAnalysisTemplate,
  ArgoExperiment,
  ArgoRollout,
} from "./k8s/rollouts";
import { ArgoClusterWorkflowTemplate, ArgoCronWorkflow, ArgoWorkflow, ArgoWorkflowTemplate } from "./k8s/workflows";
import {
  ArgoConfigMenuItem,
  ArgoHardRefreshMenuItem,
  ArgoRefreshMenuItem,
  ArgoRolloutAbortMenuItem,
  ArgoRolloutPromoteFullMenuItem,
  ArgoRolloutPromoteMenuItem,
  ArgoRolloutPromoteSkipAllMenuItem,
  ArgoRolloutPromoteSkipCurrentMenuItem,
  ArgoRolloutRetryMenuItem,
  ArgoSyncMenuItem,
  ArgoSyncWithOptionsMenuItem,
  ArgoTerminateMenuItem,
} from "./menus";
import { ArgoPreferenceHint, ArgoPreferenceInput } from "./preferences";
import { buildClusterPageMenus, buildClusterPages } from "./registration/cluster-registration";

// Every page, details panel and menu item renders inside an error boundary, so that an error it throws stays in its
// place: the host has none around the details drawer or a menu item, and its boundary around the cluster frame would
// replace the whole cluster view. Each registration field is mapped through its wrapper, so an entry added to it is
// wrapped too.
export default class ArgoRenderer extends Renderer.LensExtension {
  clusterFrameComponents = [
    {
      id: "argocd-config-dialog",
      Component: ArgoConfigDialog,
      shouldRender: computed(() => true),
    },
    {
      id: "argocd-application-sync-dialog",
      Component: ApplicationSyncDialog,
      shouldRender: computed(() => true),
    },
    {
      id: "argocd-api-application-drawer",
      Component: ArgoApiApplicationDrawer,
      shouldRender: computed(() => true),
    },
    {
      id: "argocd-api-appproject-drawer",
      Component: ArgoApiAppProjectDrawer,
      shouldRender: computed(() => true),
    },
  ];

  async onActivate() {
    setArgoExtension(this);
    ArgoPreferencesStore.getInstanceOrCreate().loadExtension(this);
    registerArgoCdApiIpc(this);
  }

  appPreferences = [
    {
      title: "Argo CD Connection",
      components: {
        Input: () => <ArgoPreferenceInput />,
        Hint: () => <ArgoPreferenceHint />,
      },
    },
  ];

  kubeObjectDetailItems: Renderer.LensExtension["kubeObjectDetailItems"] = [
    Renderer.K8sApi.detailsFor(ArgoApplication, {
      priority: 10,
      Details: (props) => <ArgoApplicationDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoApplicationSet, {
      priority: 10,
      Details: (props) => <ArgoApplicationSetDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoAppProject, {
      priority: 10,
      Details: (props) => <ArgoAppProjectDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoRollout, {
      priority: 10,
      Details: (props) => <ArgoRolloutDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoAnalysisTemplate, {
      priority: 10,
      Details: (props) => <ArgoAnalysisTemplateDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoClusterAnalysisTemplate, {
      priority: 10,
      Details: (props) => <ArgoClusterAnalysisTemplateDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoAnalysisRun, {
      priority: 10,
      Details: (props) => <ArgoAnalysisRunDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoExperiment, {
      priority: 10,
      Details: (props) => <ArgoExperimentDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoWorkflow, {
      priority: 10,
      Details: (props) => <ArgoWorkflowDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoCronWorkflow, {
      priority: 10,
      Details: (props) => <ArgoCronWorkflowDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoWorkflowTemplate, {
      priority: 10,
      Details: (props) => <ArgoWorkflowTemplateDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(ArgoClusterWorkflowTemplate, {
      priority: 10,
      Details: (props) => <ArgoClusterWorkflowTemplateDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(Renderer.K8sApi.Secret, {
      priority: 50,
      Details: (props) => <ArgoConfigDetails {...props} extension={this} />,
    }),
    Renderer.K8sApi.detailsFor(Renderer.K8sApi.ConfigMap, {
      priority: 50,
      Details: (props) => <ArgoConfigDetails {...props} extension={this} />,
    }),
  ].map((registration) => withDetailsErrorBoundary(this, registration));

  clusterPages: Renderer.LensExtension["clusterPages"] = buildClusterPages(this).map((registration) =>
    withPageErrorBoundary(this, registration),
  );

  clusterPageMenus = buildClusterPageMenus();

  // The resources above present their own sidebar entries and pages, so the host leaves them out of the Custom
  // Resources tree while this extension is enabled. Secret and ConfigMap are only decorated, not listed.
  customResources = [
    ArgoApplication,
    ArgoApplicationSet,
    ArgoAppProject,
    ArgoRollout,
    ArgoAnalysisTemplate,
    ArgoClusterAnalysisTemplate,
    ArgoAnalysisRun,
    ArgoExperiment,
    ArgoWorkflow,
    ArgoCronWorkflow,
    ArgoWorkflowTemplate,
    ArgoClusterWorkflowTemplate,
  ];

  kubeObjectMenuItems: Renderer.LensExtension["kubeObjectMenuItems"] = [
    Renderer.K8sApi.menuItemFor(ArgoApplication, {
      MenuItem: (props) => <ArgoRefreshMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoApplication, {
      MenuItem: (props) => <ArgoHardRefreshMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoApplication, {
      MenuItem: (props) => <ArgoSyncMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoApplication, {
      MenuItem: (props) => <ArgoSyncWithOptionsMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoApplication, {
      MenuItem: (props) => <ArgoTerminateMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoRollout, {
      MenuItem: (props) => <ArgoRolloutPromoteMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoRollout, {
      MenuItem: (props) => <ArgoRolloutPromoteFullMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoRollout, {
      MenuItem: (props) => <ArgoRolloutPromoteSkipCurrentMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoRollout, {
      MenuItem: (props) => <ArgoRolloutPromoteSkipAllMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoRollout, {
      MenuItem: (props) => <ArgoRolloutAbortMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(ArgoRollout, {
      MenuItem: (props) => <ArgoRolloutRetryMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(Renderer.K8sApi.Secret, {
      MenuItem: (props) => <ArgoConfigMenuItem {...props} extension={this} />,
    }),
    Renderer.K8sApi.menuItemFor(Renderer.K8sApi.ConfigMap, {
      MenuItem: (props) => <ArgoConfigMenuItem {...props} extension={this} />,
    }),
  ].map((registration) => withMenuItemErrorBoundary(this, registration));
}
