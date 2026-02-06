export type CanvasCamera = {
  x: number;
  y: number;
  zoom: number;
};

export type CanvasNodeViewState = {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type CanvasViewSnapshot = {
  version: 1;
  savedAt: string;
  activeNodeId?: string | null;
  camera?: CanvasCamera | null;
  nodes: Record<string, CanvasNodeViewState>;
};

export type PersistenceAdapter = {
  load: (key: string) => CanvasViewSnapshot | null | Promise<CanvasViewSnapshot | null>;
  save: (key: string, snapshot: CanvasViewSnapshot) => void | Promise<void>;
  clear?: (key: string) => void | Promise<void>;
};
