// Minimal stub of `@freelensapp/extensions` for unit tests.
//
// The published package is a shim that reads `Common`, `Main` and `Renderer`
// off `globalThis.FreelensExtensionApi`, which the Freelens host sets before it
// loads an extension. A Vitest process has no host, so importing the real
// package throws. `vitest.config.ts` aliases the import to this file instead.
// The package ships no mocks of its own to use in its place.
//
// Only the surface the tests exercise is stubbed here, and only at runtime: the
// tests are type-checked against the real declaration of the package. Extend it
// as the tests need more of the host API.
import React from "react";
import { vi } from "vitest";

type AnyRecord = Record<string, any>;

const noop = () => {};

// Component helpers
const passthrough =
  (name: string) =>
  ({ children }: AnyRecord) => <div data-testid={name}>{children}</div>;

const textComponent =
  (name: string) =>
  ({ children, title }: AnyRecord) => <span data-testid={name}>{children ?? title}</span>;

const KubeObjectListLayout = ({ store, items, renderTableContents }: AnyRecord) => {
  const rows = items ?? store?.items ?? [];

  return (
    <div data-testid="KubeObjectListLayout">
      {rows.map((row: AnyRecord, rowIndex: number) => (
        <div data-testid="KubeObjectListLayoutRow" key={`${row?.getName?.() ?? rowIndex}-${rowIndex}`}>
          {(renderTableContents?.(row) ?? []).map((cell: React.ReactNode, cellIndex: number) => (
            <div data-testid="KubeObjectListLayoutCell" key={`${rowIndex}-${cellIndex}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Callable components we want to introspect in tests if needed
export const PieChart = vi.fn(({ data }: AnyRecord) => (
  <div data-testid="PieChart" data-labels={JSON.stringify(data?.labels ?? [])}>
    PieChart
  </div>
));

export const Renderer = {
  LensExtension: class {},
  Component: {
    // charts
    PieChart,

    // overview page
    Events: passthrough("Events"),
    NamespaceSelectFilter: passthrough("NamespaceSelectFilter"),
    TabLayout: passthrough("TabLayout"),
    Tabs: ({ children, onChange }: AnyRecord) => (
      <div data-testid="Tabs">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { onSelect: onChange } as AnyRecord) : child,
        )}
      </div>
    ),
    Tab: ({ label, value, onSelect }: AnyRecord) => (
      <button type="button" data-testid="Tab" onClick={() => onSelect?.(value)}>
        {label}
      </button>
    ),

    // details page
    BadgeBoolean: ({ value }: { value: boolean }) => <span data-testid="BadgeBoolean">{value ? "true" : "false"}</span>,
    DrawerTitle: textComponent("DrawerTitle"),
    DrawerItem: ({ name, children }: { name: string; children: React.ReactNode }) => (
      <div data-testid="DrawerItem">
        <div data-testid="DrawerItemName">{name}</div>
        <div data-testid="DrawerItemContent">{children}</div>
      </div>
    ),
    Gutter: passthrough("Gutter"),
    Table: passthrough("Table"),
    TableHead: passthrough("TableHead"),
    TableRow: ({ children, id, className }: AnyRecord) => (
      <div data-testid="TableRow" id={id} className={className}>
        {children}
      </div>
    ),
    TableCell: passthrough("TableCell"),

    // list page
    KubeObjectAge: passthrough("KubeObjectAge"),
    KubeObjectListLayout,
    WithTooltip: ({ children, tooltip }: AnyRecord) => (
      <div data-testid="WithTooltip" data-tooltip={tooltip}>
        {children}
      </div>
    ),
    MaybeLink: ({ to, children, ...rest }: AnyRecord) => (
      <a data-testid="MaybeLink" href={typeof to === "string" ? to : (to?.pathname ?? "")} {...rest}>
        {children}
      </a>
    ),

    // dialog & inputs
    Dialog: ({ children }: AnyRecord) => <div data-testid="Dialog">{children}</div>,
    Input: ({ value, onChange, multiLine, rows: _rows, ...props }: AnyRecord) => {
      const shared = {
        "data-testid": "Input",
        value: value ?? "",
        onChange: (event: any) => onChange?.(event.target.value, event),
        ...props,
      };
      return multiLine ? <textarea {...shared} /> : <input {...shared} />;
    },
    Button: ({ onClick, children, disabled }: AnyRecord) => (
      <button type="button" data-testid="Button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
    Checkbox: ({ label, value, onChange }: AnyRecord) => (
      <label>
        <input
          type="checkbox"
          aria-label={label}
          checked={!!value}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        {label}
      </label>
    ),
    Notifications: {
      ok: vi.fn(),
      error: vi.fn(),
    },
    ConfirmDialog: {
      confirm: vi.fn(async () => true),
    },

    // menu
    MenuItem: ({ onClick, children }: AnyRecord) => (
      <button type="button" data-testid="MenuItem" onClick={onClick}>
        {children}
      </button>
    ),
    Icon: passthrough("Icon"),
  },

  // minimal K8sApi bits for pages using stores
  K8sApi: {
    namespaceStore: {
      items: [],
      loadAll: async () => {},
      subscribe: () => noop,
    },
    apiManager: {
      registerStore: noop,
    },
    namespacesApi: {
      formatUrlForNotListing: ({ name }: { name: string }) => `/api/v1/namespaces/${name}`,
    },
    configMapStore: {
      items: [],
      contextItems: [],
      loadAll: async () => {},
      subscribe: () => noop,
      create: vi.fn(),
      patch: vi.fn(),
      remove: vi.fn(),
    },
    secretsStore: {
      items: [],
      contextItems: [],
      loadAll: async () => {},
      subscribe: () => noop,
      create: vi.fn(),
      patch: vi.fn(),
      remove: vi.fn(),
    },
    KubeObjectMetadata: class {},
    LensExtensionKubeObject: class {},
    KubeApi: class {},
    KubeObjectStore: class {},
    Secret: class Secret {
      static readonly kind = "Secret";
      static readonly apiBase = "/api/v1/secrets";
    },
    ConfigMap: class ConfigMap {
      static readonly kind = "ConfigMap";
      static readonly apiBase = "/api/v1/configmaps";
    },
    // The host's helpers take `kind` from the class and `apiVersions` from its
    // `crd.apiVersions`, or the group and version of its `apiBase`, and nest
    // the component under `components`.
    detailsFor: (model: any, registration: AnyRecord) => {
      const { Details, ...rest } = registration;
      return {
        kind: model?.kind,
        apiVersions: model?.crd?.apiVersions ?? [model?.apiBase?.split("/")[2]].filter(Boolean),
        components: { Details },
        ...rest,
      };
    },
    menuItemFor: (model: any, registration: AnyRecord) => {
      const { MenuItem, ...rest } = registration;
      return {
        kind: model?.kind,
        apiVersions: model?.crd?.apiVersions ?? [model?.apiBase?.split("/")[2]].filter(Boolean),
        components: { MenuItem },
        ...rest,
      };
    },
  },

  Navigation: {
    getDetailsUrl: (url: string) => url,
    getMaybeDetailsUrl: (url?: string) => url ?? "",
  },

  Ipc: class {
    constructor(_extension: any) {}
    invoke = vi.fn(async () => ({ status: 200, bodyText: "{}" }));
    listen = vi.fn(() => noop);
    handle = vi.fn();
    broadcast = vi.fn();
  },
} as const;

export const Main = {
  LensExtension: class {},
  Ipc: class {
    constructor(_extension: any) {}
    invoke = vi.fn(async () => ({ status: 200, bodyText: "{}" }));
    listen = vi.fn(() => noop);
    handle = vi.fn();
    broadcast = vi.fn();
  },
} as const;

export const Common = {
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  Util: {
    stopPropagation: noop,
  },
  Store: {
    ExtensionStore: class {
      constructor(_opts?: any) {}

      static getInstanceOrCreate(this: any) {
        if (!this.__instance) {
          this.__instance = new this();
        }
        return this.__instance;
      }

      loadExtension() {}
    },
  },
} as const;
