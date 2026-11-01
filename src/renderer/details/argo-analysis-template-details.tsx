import { Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { type ArgoAnalysisTemplate } from "../k8s/rollouts";
import { ArgoAnalysisTemplateDetailContent } from "./argo-analysis-template-detail-content";

export interface ArgoAnalysisTemplateDetailsProps
  extends Renderer.Component.KubeObjectDetailsProps<ArgoAnalysisTemplate> {
  extension: Renderer.LensExtension;
}

export const ArgoAnalysisTemplateDetails = observer((props: ArgoAnalysisTemplateDetailsProps) => {
  const { object } = props;

  return (
    <>
      <ArgoAnalysisTemplateDetailContent title="AnalysisTemplate" spec={object.spec} />
    </>
  );
});
