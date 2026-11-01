import { Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { type ArgoClusterAnalysisTemplate } from "../k8s/rollouts";
import { ArgoAnalysisTemplateDetailContent } from "./argo-analysis-template-detail-content";

export interface ArgoClusterAnalysisTemplateDetailsProps
  extends Renderer.Component.KubeObjectDetailsProps<ArgoClusterAnalysisTemplate> {
  extension: Renderer.LensExtension;
}

export const ArgoClusterAnalysisTemplateDetails = observer((props: ArgoClusterAnalysisTemplateDetailsProps) => {
  const { object } = props;

  return (
    <>
      <ArgoAnalysisTemplateDetailContent title="ClusterAnalysisTemplate" spec={object.spec} />
    </>
  );
});
