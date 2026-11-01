/**
 * Cluster page and sidebar menu registration for the Argo umbrella (ArgoCD + future products).
 *
 * Freelens v2 builds the URL of an extension page from its `id`
 * (`/extension/<extension-id>/<page-id>`); there is no `routePath` anymore.
 * Parameters of a page are query parameters, declared in the registration's
 * `params` and read by the page through `Common.Types.PageComponentProps`.
 *
 * Adding a new Argo product: add k8s types under `k8s/<product>/`, add
 * pages/details/menus, then append entries here and in `index.tsx`.
 */

import { Renderer } from "@freelensapp/extensions";
import { ArgoPlainLogoIcon } from "../icons";
import { ArgoApplication, ArgoApplicationSet, ArgoAppProject } from "../k8s/argocd";
import {
  ArgoAnalysisRun,
  ArgoAnalysisTemplate,
  ArgoClusterAnalysisTemplate,
  ArgoExperiment,
  ArgoRollout,
} from "../k8s/rollouts";
import {
  ArgoApiApplicationDetailsPage,
  ArgoApplicationSetsPage,
  ArgoApplicationsPage,
  ArgoAppProjectsPage,
  ArgoConfigPage,
  ArgoLandingPage,
  ArgoOverviewPage,
  ArgoRolloutsAnalysisRunsPage,
  ArgoRolloutsAnalysisTemplatesPage,
  ArgoRolloutsClusterAnalysisTemplatesPage,
  ArgoRolloutsExperimentsPage,
  ArgoRolloutsOverviewPage,
  ArgoRolloutsRolloutsPage,
  ArgoWorkflowsClusterTemplatesPage,
  ArgoWorkflowsCronWorkflowsPage,
  ArgoWorkflowsTemplatesPage,
  ArgoWorkflowsWorkflowsPage,
} from "../pages";
import { ArgoPageIds } from "../routes/argo-page-ids";

export { ArgoPageIds };

const argoRolloutsOverviewPageId = ArgoPageIds.rolloutsOverview;

export function buildClusterPages(extension: Renderer.LensExtension): Renderer.LensExtension["clusterPages"] {
  return [
    {
      id: ArgoPageIds.landing,
      components: {
        Page: () => <ArgoLandingPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.argocdRoot,
      components: {
        Page: () => <ArgoOverviewPage />,
      },
    },
    {
      id: ArgoPageIds.argocdOverview,
      components: {
        Page: () => <ArgoOverviewPage />,
      },
    },
    {
      id: ArgoApplication.crd.plural,
      components: {
        Page: () => <ArgoApplicationsPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.argocdApplicationApiDetails,
      params: { namespace: "", name: "" },
      components: {
        Page: (props) => <ArgoApiApplicationDetailsPage {...props} extension={extension} />,
      },
    },
    {
      id: ArgoApplicationSet.crd.plural,
      components: {
        Page: () => <ArgoApplicationSetsPage extension={extension} />,
      },
    },
    {
      id: ArgoAppProject.crd.plural,
      components: {
        Page: () => <ArgoAppProjectsPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.argocdConfig,
      components: {
        Page: () => <ArgoConfigPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.workflowsRoot,
      components: {
        Page: () => <ArgoWorkflowsWorkflowsPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.workflowsCron,
      components: {
        Page: () => <ArgoWorkflowsCronWorkflowsPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.workflowsTemplates,
      components: {
        Page: () => <ArgoWorkflowsTemplatesPage extension={extension} />,
      },
    },
    {
      id: ArgoPageIds.workflowsClusterTemplates,
      components: {
        Page: () => <ArgoWorkflowsClusterTemplatesPage extension={extension} />,
      },
    },
    {
      id: argoRolloutsOverviewPageId,
      components: {
        Page: () => <ArgoRolloutsOverviewPage extension={extension} />,
      },
    },
    {
      id: ArgoRollout.crd.plural,
      components: {
        Page: () => <ArgoRolloutsRolloutsPage extension={extension} />,
      },
    },
    {
      id: ArgoAnalysisRun.crd.plural,
      components: {
        Page: () => <ArgoRolloutsAnalysisRunsPage extension={extension} />,
      },
    },
    {
      id: ArgoExperiment.crd.plural,
      components: {
        Page: () => <ArgoRolloutsExperimentsPage extension={extension} />,
      },
    },
    {
      id: ArgoAnalysisTemplate.crd.plural,
      components: {
        Page: () => <ArgoRolloutsAnalysisTemplatesPage extension={extension} />,
      },
    },
    {
      id: ArgoClusterAnalysisTemplate.crd.plural,
      components: {
        Page: () => <ArgoRolloutsClusterAnalysisTemplatesPage extension={extension} />,
      },
    },
  ];
}

export function buildClusterPageMenus(): Renderer.LensExtension["clusterPageMenus"] {
  return [
    {
      id: "argo",
      title: "Argo",
      target: { pageId: ArgoPageIds.landing },
      components: {
        Icon: ArgoPlainLogoIcon,
      },
    },
    {
      id: "argo-argocd",
      parentId: "argo",
      title: "ArgoCD",
      target: { pageId: ArgoPageIds.argocdOverview },
      components: {},
    },
    {
      id: "argocd-overview-menu",
      parentId: "argo-argocd",
      title: "Overview",
      target: { pageId: ArgoPageIds.argocdOverview },
      components: {},
    },
    {
      id: ArgoApplication.crd.plural,
      parentId: "argo-argocd",
      title: ArgoApplication.crd.title,
      target: { pageId: ArgoApplication.crd.plural },
      components: {},
    },
    {
      id: ArgoApplicationSet.crd.plural,
      parentId: "argo-argocd",
      title: ArgoApplicationSet.crd.title,
      target: { pageId: ArgoApplicationSet.crd.plural },
      components: {},
    },
    {
      id: ArgoAppProject.crd.plural,
      parentId: "argo-argocd",
      title: ArgoAppProject.crd.title,
      target: { pageId: ArgoAppProject.crd.plural },
      components: {},
    },
    {
      id: "argocd-config-menu",
      parentId: "argo-argocd",
      title: "Config",
      target: { pageId: ArgoPageIds.argocdConfig },
      components: {},
    },
    {
      id: "argo-workflows",
      parentId: "argo",
      title: "Argo Workflows",
      target: { pageId: ArgoPageIds.workflowsRoot },
      components: {},
    },
    {
      id: "argo-workflows-workflows-menu",
      parentId: "argo-workflows",
      title: "Workflows",
      target: { pageId: ArgoPageIds.workflowsRoot },
      components: {},
    },
    {
      id: "argo-workflows-cron-menu",
      parentId: "argo-workflows",
      title: "CronWorkflows",
      target: { pageId: ArgoPageIds.workflowsCron },
      components: {},
    },
    {
      id: "argo-workflows-templates-menu",
      parentId: "argo-workflows",
      title: "WorkflowTemplates",
      target: { pageId: ArgoPageIds.workflowsTemplates },
      components: {},
    },
    {
      id: "argo-workflows-cluster-templates-menu",
      parentId: "argo-workflows",
      title: "ClusterWorkflowTemplates",
      target: { pageId: ArgoPageIds.workflowsClusterTemplates },
      components: {},
    },
    {
      id: "argo-rollouts",
      parentId: "argo",
      title: "Argo Rollouts",
      target: { pageId: argoRolloutsOverviewPageId },
      components: {},
    },
    {
      id: "argo-rollouts-overview-menu",
      parentId: "argo-rollouts",
      title: "Overview",
      target: { pageId: argoRolloutsOverviewPageId },
      components: {},
    },
    {
      id: "argo-rollouts-rollouts-menu",
      parentId: "argo-rollouts",
      title: "Rollouts",
      target: { pageId: ArgoRollout.crd.plural },
      components: {},
    },
    {
      id: "argo-rollouts-analysis-runs-menu",
      parentId: "argo-rollouts",
      title: "AnalysisRuns",
      target: { pageId: ArgoAnalysisRun.crd.plural },
      components: {},
    },
    {
      id: "argo-rollouts-experiments-menu",
      parentId: "argo-rollouts",
      title: "Experiments",
      target: { pageId: ArgoExperiment.crd.plural },
      components: {},
    },
    {
      id: "argo-rollouts-analysis-templates-menu",
      parentId: "argo-rollouts",
      title: "AnalysisTemplates",
      target: { pageId: ArgoAnalysisTemplate.crd.plural },
      components: {},
    },
    {
      id: "argo-rollouts-cluster-analysis-templates-menu",
      parentId: "argo-rollouts",
      title: "ClusterAnalysisTemplates",
      target: { pageId: ArgoClusterAnalysisTemplate.crd.plural },
      components: {},
    },
  ];
}
