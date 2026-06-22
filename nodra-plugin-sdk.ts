// Nodra plugin SDK — public type contract. Generated/vendored; do not edit by hand.

import type { Node, Edge, NodeTypes, FitViewOptions } from '@xyflow/react';
import type { ComponentType } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
 * Core diagram data contracts (from src/types.ts)
 *
 * NOTE: these MUST be `type` aliases (not `interface`) so they satisfy
 * @xyflow/react's `Record<string, unknown>` generic constraint.
 * ──────────────────────────────────────────────────────────────────────────── */

export type IconSource = 'iconify' | 'svg';

/** A node that renders a single provider/service/brand icon. */
export type IconNodeData = {
  label: string;
  /** iconify icon id (e.g. "logos:aws-lambda") OR a url / data-url for svg source */
  iconRef: string;
  iconSource: IconSource;
  /** plugin-defined provider category, purely informative */
  provider?: string;
  /** small secondary line under the label (e.g. an account id) */
  sublabel?: string;
  /** accent / label color, any CSS color */
  accent?: string;
  /** free-form labels (e.g. 'production', 'critical', 'deprecated') */
  tags?: string[];
  /** arbitrary key/value metadata (owner, environment, cost-center…) */
  metadata?: Record<string, string>;
  /** source IaC address when imported (e.g. Terraform 'module.x.aws_instance.web') */
  tfAddr?: string;
  /** true for a user-uploaded picture — rendered filling a resizable frame
   *  (vs. a small AWS/GCP glyph). */
  isImage?: boolean;
  /** show a card background/frame behind an image block (default: none). */
  imageFramed?: boolean;
};

/** A resizable container that visually groups child nodes (AWS account, VPC, "Cloud"...). */
export type GroupNodeData = {
  label: string;
  /** border / header accent color */
  color?: string;
  /** optional header icon (iconify ref, e.g. "lucide:server") */
  icon?: string;
  variant?: 'cloud' | 'account' | 'plain';
  /** set when this group is an instance of a reusable component */
  componentId?: string;
  componentVersion?: number;
};

export type ErKeyKind = 'PK' | 'FK' | null;
export type ErColumn = { name: string; type: string; key?: ErKeyKind };

/** A database/entity table for ER (BDD) diagrams. */
export type ErTableNodeData = {
  label: string;
  columns: ErColumn[];
  accent?: string;
};

/** A free-text sticky note (resizable, multi-line). */
export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'gray';
export type NoteNodeData = { text: string; color?: NoteColor };

/** A discussion comment (speech-bubble card with an author line). */
export type CommentNodeData = { text: string; author?: string };

/** Plain free text on the canvas (no background). */
export type TextNodeData = { text: string; fontSize?: number };

export type AppNodeData =
  | IconNodeData
  | GroupNodeData
  | ErTableNodeData
  | NoteNodeData
  | CommentNodeData
  | TextNodeData;

export type IconNodeType = Node<IconNodeData, 'icon'>;
export type GroupNodeType = Node<GroupNodeData, 'group'>;
export type ErTableNodeType = Node<ErTableNodeData, 'erTable'>;
export type NoteNodeType = Node<NoteNodeData, 'note'>;
export type CommentNodeType = Node<CommentNodeData, 'comment'>;
export type TextNodeType = Node<TextNodeData, 'text'>;
export type AppNode =
  | IconNodeType
  | GroupNodeType
  | ErTableNodeType
  | NoteNodeType
  | CommentNodeType
  | TextNodeType;

export type EdgePathType = 'smooth' | 'bezier' | 'straight';
/** Semantic relationship a connection represents — drives its colour/dash. */
export type EdgeKind = 'sync' | 'async' | 'event' | 'error' | 'data';
export type Waypoint = { x: number; y: number };
export type LabeledEdgeData = {
  label?: string;
  /** optional dashed style for "async"/secondary flows */
  dashed?: boolean;
  /** path shape: 'smooth' (rounded steps), 'bezier' (curve), 'straight' */
  pathType?: EdgePathType;
  /** semantic kind — distinct colour/dash (sync/async/event/error/data) */
  edgeKind?: EdgeKind;
  /** manual routing points (flow coords); when present the edge runs through them */
  waypoints?: Waypoint[];
};
export type AppEdge = Edge<LabeledEdgeData>;

/** A plugin a diagram depends on (its nodes/icons came from it). */
export type DiagramPluginDep = { id: string; name?: string; version?: string };

/** On-disk / exported diagram document. */
export type DiagramFile = {
  version: 1;
  name: string;
  nodes: AppNode[];
  edges: AppEdge[];
  viewport?: { x: number; y: number; zoom: number };
  /**
   * Plugins this diagram uses, derived at save time (see derivePlugins). On
   * open, missing ones are offered for install; until then the data renders
   * non-destructively (UnknownNode / icon placeholder), never lost.
   */
  plugins?: DiagramPluginDep[];
};

/**
 * A reusable component: a saved sub-graph (nodes + internal edges) that can be
 * dropped onto the canvas as one block. Node ids inside `nodes` act as stable
 * "slot" ids; an instance gives each child the id `${instanceId}:${slotId}` so
 * external edges survive component updates.
 */
export type ComponentDef = {
  id: string;
  name: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  width: number;
  height: number;
  nodes: AppNode[];
  edges: AppEdge[];
};

/* ────────────────────────────────────────────────────────────────────────────
 * Icon catalog (from src/icons/catalog.ts)
 * ──────────────────────────────────────────────────────────────────────────── */

export type IconEntry = {
  /** stable unique id, e.g. "bi:aws-lambda" (builtin) or "aws:Lambda" (generated) */
  id: string;
  name: string;
  /** 'aws' | 'gcp' | 'azure' | 'brand' | 'general' | 'network' | 'security' | ... */
  provider: string;
  category: string;
  source: IconSource;
  /** iconify icon id (source 'iconify') OR public path to an svg (source 'svg') */
  ref: string;
  keywords?: string[];
};

/* ────────────────────────────────────────────────────────────────────────────
 * Plugin host SDK (from src/plugins/types.ts)
 * ──────────────────────────────────────────────────────────────────────────── */

export type Permission =
  | 'blocks'
  | 'node-types'
  | 'importers'
  | 'exporters'
  | 'panels'
  | 'commands'
  | 'flow-read'
  | 'flow-write';

export type PluginManifest = {
  id: string; // reverse-domain, e.g. com.nodra.aws-icons
  name: string;
  version: string; // semver
  api_version: string; // semver, MAJOR checked against API_VERSION
  permissions: Permission[];
  main: string; // entry ES module exporting register(host)
  description?: string;
  author?: string;
  category?: string;
  keywords?: string[];
};

export type NodeComponent = NodeTypes[string];

export type ImportResult = {
  diagram: DiagramFile;
  /** Toast shown on success (e.g. "Import Terraform : 12 ressources"). */
  note?: string;
  /** true = replace the current document; otherwise import into a new one. */
  replace?: boolean;
};

export type ImporterDef = {
  id: string;
  label: string;
  /** File extensions (without the dot) this importer claims, e.g. ['tfstate']. */
  extensions?: string[];
  /** Content sniff when the extension is ambiguous (.json, .xml…). */
  detect?(text: string): boolean;
  /** May be async (e.g. draw.io inflates a compressed payload). */
  parse(text: string): ImportResult | Promise<ImportResult>;
};

export type ExporterDef = {
  id: string;
  label: string;
  ext: string;
  /** mdi glyph for the export menu (falls back to a generic icon). */
  icon?: string;
  serialize(doc: DiagramFile): string | Blob;
};

export type PanelDef = {
  id: string;
  side: 'right';
  component: ComponentType;
  /** Dock toggle button. */
  title?: string;
  icon?: string;
};

export type CommandDef = {
  id: string;
  label: string;
  icon?: string;
  run(): void;
};

/**
 * Read/write access to the live diagram, for panels and features. Backed by the
 * core flow store + the mounted ReactFlow instance. Reads need 'flow-read',
 * writes need 'flow-write'; a missing permission makes the call a no-op (reads
 * return empty) and warns.
 */
export type HostFlow = {
  getNodes(): AppNode[];
  getEdges(): AppEdge[];
  getSelection(): { nodeId: string | null; edgeId: string | null };
  setNodes(nodes: AppNode[]): void;
  setEdges(edges: AppEdge[]): void;
  loadDiagram(file: DiagramFile): void;
  toDiagram(): DiagramFile;
  selectEdge(id: string | null): void;
  fitView(options?: FitViewOptions<AppNode>): void;
  /** Fires on any flow change; returns an unsubscribe fn (auto-disposed). */
  subscribe(listener: () => void): () => void;
};

/** Chrome a plugin may drive: right-side panels and toasts. Not gated. */
export type HostUi = {
  openPanel(id: string): void;
  closePanel(): void;
  showToast(message: string): void;
};

/** Small helpers a self-contained plugin would otherwise re-implement. */
export type HostUtils = {
  /** Stable short unique id — the same generator the core uses for nodes. */
  newId(): string;
};

/** What a plugin receives in `register(host)`. Each method is capability-gated. */
export type Host = {
  api_version: string;
  manifest: PluginManifest;
  blocks: {
    register(pack: IconEntry[]): void;
    /** Read access to the icon catalog (for importers resolving icons by name). */
    search(query: string, provider?: string): IconEntry[];
    all(): IconEntry[];
  };
  nodeTypes: { register(type: string, component: NodeComponent): void };
  importers: { register(def: ImporterDef): void };
  exporters: { register(def: ExporterDef): void };
  panels: { register(def: PanelDef): void };
  commands: { register(def: CommandDef): void };
  flow: HostFlow;
  ui: HostUi;
  utils: HostUtils;
  /**
   * Resolve a plugin-relative asset path to a fetchable URL.
   *
   * Installed plugins are served from disk under `/api/plugins/<id>/<rel>`, so
   * this returns that path synchronously (a `string`).
   *
   * A plugin loaded from the developer's dev folder (desktop) is read in place
   * with no copy into `<app-data>/plugins`, so it has no HTTP endpoint — its
   * bytes are read over Tauri IPC and turned into an object URL, which is async.
   * In that case this returns a `Promise<string>`. Always `await` the result to
   * support both kinds of plugin:
   *   `const url = await host.assetUrl('icons/foo.svg');`
   */
  assetUrl(rel: string): string | Promise<string>;
  log(...args: unknown[]): void;
  /** Remove every contribution this host registered (plugin uninstall). */
  dispose(): void;
};

export type PluginModule = { register(host: Host): void };
