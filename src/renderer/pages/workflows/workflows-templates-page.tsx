import { Common, Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { ArgoWorkflowTemplate, type ArgoWorkflowTemplateApi, getArgoWorkflowTemplateStore } from "../../k8s/workflows";

const {
  Component: { KubeObjectAge, KubeObjectListLayout, MaybeLink, WithTooltip },
  K8sApi: { namespacesApi },
  Navigation: { getDetailsUrl },
} = Renderer;

const {
  Util: { stopPropagation },
} = Common;

const sortingCallbacks = {
  name: (object: ArgoWorkflowTemplate) => object.getName(),
  namespace: (object: ArgoWorkflowTemplate) => object.getNs(),
  entrypoint: (object: ArgoWorkflowTemplate) => object.spec?.entrypoint ?? "",
  serviceAccountName: (object: ArgoWorkflowTemplate) => object.spec?.serviceAccountName ?? "",
  age: (object: ArgoWorkflowTemplate) => object.getCreationTimestamp(),
};

const renderTableHeader: { id: string; title: string; sortBy: keyof typeof sortingCallbacks }[] = [
  { id: "name", title: "Name", sortBy: "name" },
  { id: "namespace", title: "Namespace", sortBy: "namespace" },
  { id: "entrypoint", title: "Entrypoint", sortBy: "entrypoint" },
  { id: "serviceAccountName", title: "Service Account", sortBy: "serviceAccountName" },
  { id: "age", title: "Age", sortBy: "age" },
];

export const ArgoWorkflowsTemplatesTabContent = observer(() => {
  const workflowTemplateStore = getArgoWorkflowTemplateStore();

  const getWorkflowTemplateDetailsUrl = (object: ArgoWorkflowTemplate) =>
    getDetailsUrl(
      workflowTemplateStore.api.formatUrlForNotListing({
        namespace: object.getNs(),
        name: object.getName(),
      }),
    );

  return (
    <KubeObjectListLayout<ArgoWorkflowTemplate, ArgoWorkflowTemplateApi>
      tableId={`${ArgoWorkflowTemplate.crd.plural}Table`}
      isConfigurable
      className=""
      store={workflowTemplateStore}
      sortingCallbacks={sortingCallbacks}
      searchFilters={[(object: ArgoWorkflowTemplate) => object.getSearchFields()]}
      renderHeaderTitle={ArgoWorkflowTemplate.crd.title}
      renderTableHeader={renderTableHeader}
      renderTableContents={(object: ArgoWorkflowTemplate) => [
        <MaybeLink key="name-link" to={getWorkflowTemplateDetailsUrl(object)} onClick={stopPropagation}>
          <WithTooltip>{object.getName()}</WithTooltip>
        </MaybeLink>,
        <MaybeLink
          key="namespace-link"
          to={getDetailsUrl(namespacesApi.formatUrlForNotListing({ name: object.getNs() }))}
          onClick={stopPropagation}
        >
          <WithTooltip>{object.getNs()}</WithTooltip>
        </MaybeLink>,
        <WithTooltip>{object.spec?.entrypoint ?? "N/A"}</WithTooltip>,
        <WithTooltip>{object.spec?.serviceAccountName ?? "N/A"}</WithTooltip>,
        <KubeObjectAge object={object} key="age" />,
      ]}
    />
  );
});

export interface ArgoWorkflowsTemplatesPageProps {
  extension: Renderer.LensExtension;
}

export const ArgoWorkflowsTemplatesPage = observer((props: ArgoWorkflowsTemplatesPageProps) => {
  return <ArgoWorkflowsTemplatesTabContent />;
});
