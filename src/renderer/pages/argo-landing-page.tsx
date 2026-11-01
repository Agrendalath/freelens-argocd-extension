import { observer } from "mobx-react";
import { ArgoPageIds } from "../routes/argo-page-ids";
import styles from "./argo-landing-page.module.scss";

import type { Renderer } from "@freelensapp/extensions";

export interface ArgoLandingPageProps {
  extension: Renderer.LensExtension;
}

/**
 * Top-level Argo hub: links into product areas (ArgoCD, Workflows, Rollouts).
 */
export const ArgoLandingPage = observer(({ extension }: ArgoLandingPageProps) => {
  const open = (pageId: string) => () => void extension.navigate(pageId);

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Argo</h1>
      <p className={styles.lead}>Choose a product area to open its cluster pages.</p>
      <ul className={styles.list}>
        <li>
          <button type="button" className={styles.link} onClick={open(ArgoPageIds.argocdOverview)}>
            ArgoCD
          </button>
          <span className={styles.hint}> — Applications, AppProjects, config, overview</span>
        </li>
        <li>
          <button type="button" className={styles.link} onClick={open(ArgoPageIds.workflowsRoot)}>
            Argo Workflows
          </button>
          <span className={styles.hint}> — Workflows, CronWorkflows, and templates</span>
        </li>
        <li>
          <button type="button" className={styles.link} onClick={open(ArgoPageIds.rolloutsOverview)}>
            Argo Rollouts
          </button>
          <span className={styles.hint}>
            {" "}
            — Rollouts overview, Rollouts, AnalysisRuns, AnalysisTemplates, ClusterAnalysisTemplates, and Experiments
          </span>
        </li>
      </ul>
    </div>
  );
});
