import { observer } from "mobx-react";
import { Link } from "../navigation";
import { ArgoRoutes } from "../routes/argo-routes";
import styles from "./argo-landing-page.module.scss";

/**
 * Top-level Argo hub: links into product areas (ArgoCD, Workflows, Rollouts).
 */
export const ArgoLandingPage = observer(() => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Argo</h1>
      <p className={styles.lead}>Choose a product area to open its cluster pages.</p>
      <ul className={styles.list}>
        <li>
          <Link to={ArgoRoutes.argocd.root}>ArgoCD</Link>
          <span className={styles.hint}> — Applications, AppProjects, config, overview</span>
        </li>
        <li>
          <Link to={ArgoRoutes.workflows.workflows}>Argo Workflows</Link>
          <span className={styles.hint}> — Workflows, CronWorkflows, and templates</span>
        </li>
        <li>
          <Link to={ArgoRoutes.rollouts.overview}>Argo Rollouts</Link>
          <span className={styles.hint}>
            {" "}
            — Rollouts overview, Rollouts, AnalysisRuns, AnalysisTemplates, ClusterAnalysisTemplates, and Experiments
          </span>
        </li>
      </ul>
    </div>
  );
});
