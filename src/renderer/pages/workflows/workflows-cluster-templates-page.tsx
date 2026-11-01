import { Common, Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import {
  ArgoClusterWorkflowTemplate,
  type ArgoClusterWorkflowTemplateApi,
  getArgoClusterWorkflowTemplateStore,
} from "../../k8s/workflows";

const {
  Component: { KubeObjectAge, KubeObjectListLayout, MaybeLink, WithTooltip },
  Navigation: { getDetailsUrl },
} = Renderer;

const {
  Util: { stopPropagation },
} = Common;

const sortingCallbacks = {
  name: (object: ArgoClusterWorkflowTemplate) => object.getName(),
  entrypoint: (object: ArgoClusterWorkflowTemplate) => object.spec?.entrypoint ?? "",
  serviceAccountName: (object: ArgoClusterWorkflowTemplate) => object.spec?.serviceAccountName ?? "",
  age: (object: ArgoClusterWorkflowTemplate) => object.getCreationTimestamp(),
};

const renderTableHeader: { id: string; title: string; sortBy: keyof typeof sortingCallbacks }[] = [
  { id: "name", title: "Name", sortBy: "name" },
  { id: "entrypoint", title: "Entrypoint", sortBy: "entrypoint" },
  { id: "serviceAccountName", title: "Service Account", sortBy: "serviceAccountName" },
  { id: "age", title: "Age", sortBy: "age" },
];

export const ArgoWorkflowsClusterTemplatesTabContent = observer(() => {
  const clusterTemplateStore = getArgoClusterWorkflowTemplateStore();

  const getClusterWorkflowTemplateDetailsUrl = (object: ArgoClusterWorkflowTemplate) =>
    getDetailsUrl(
      clusterTemplateStore.api.formatUrlForNotListing({
        name: object.getName(),
      }),
    );

  return (
    <KubeObjectListLayout<ArgoClusterWorkflowTemplate, ArgoClusterWorkflowTemplateApi>
      tableId={`${ArgoClusterWorkflowTemplate.crd.plural}Table`}
      isConfigurable
      className=""
      store={clusterTemplateStore}
      sortingCallbacks={sortingCallbacks}
      searchFilters={[(object: ArgoClusterWorkflowTemplate) => object.getSearchFields()]}
      renderHeaderTitle={ArgoClusterWorkflowTemplate.crd.title}
      renderTableHeader={renderTableHeader}
      renderTableContents={(object: ArgoClusterWorkflowTemplate) => [
        <MaybeLink key="name-link" to={getClusterWorkflowTemplateDetailsUrl(object)} onClick={stopPropagation}>
          <WithTooltip>{object.getName()}</WithTooltip>
        </MaybeLink>,
        <WithTooltip>{object.spec?.entrypoint ?? "N/A"}</WithTooltip>,
        <WithTooltip>{object.spec?.serviceAccountName ?? "N/A"}</WithTooltip>,
        <KubeObjectAge object={object} key="age" />,
      ]}
    />
  );
});

export interface ArgoWorkflowsClusterTemplatesPageProps {
  extension: Renderer.LensExtension;
}

export const ArgoWorkflowsClusterTemplatesPage = observer((props: ArgoWorkflowsClusterTemplatesPageProps) => {
  return <ArgoWorkflowsClusterTemplatesTabContent />;
});
