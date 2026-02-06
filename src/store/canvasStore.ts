import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "reactflow";
import type { CanvasNodeData } from "@/types/node";
import type { Message } from "@/types/message";
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  HORIZONTAL_GAP,
  SOURCE_HANDLE_ID,
  TARGET_HANDLE_ID,
  VERTICAL_GAP,
} from "@/constants";

export type CanvasState = {
  nodesById: Record<string, Node<CanvasNodeData>>;
  edges: Edge[];
  getNode: (id: string) => Node<CanvasNodeData> | undefined;
  setNodes: (nodes: Node<CanvasNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  upsertNode: (node: Node<CanvasNodeData>) => void;
  patchNodeData: (id: string, patch: Partial<CanvasNodeData>) => void;
  setNodeMessages: (id: string, messages: Message[]) => void;
  createRootNode: (options?: {
    id?: string;
    position?: { x: number; y: number };
    messages?: Message[];
  }) => string;
  branchNode: (
    parentId: string,
    options?: {
      messages?: Message[];
      position?: { x: number; y: number };
    },
  ) => string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
};

export type CanvasStore = StoreApi<CanvasState>;

const toNodeMap = (nodes: Node<CanvasNodeData>[]) =>
  nodes.reduce<Record<string, Node<CanvasNodeData>>>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

const createNodeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `node-${Math.floor(Math.random() * 1e9)}`;
};

export const createCanvasStore = (initial?: {
  nodes?: Node<CanvasNodeData>[];
  edges?: Edge[];
}): CanvasStore =>
  createStore<CanvasState>((set, get) => ({
    nodesById: toNodeMap(initial?.nodes ?? []),
    edges: initial?.edges ?? [],
    getNode: (id) => get().nodesById[id],
    setNodes: (nodes) => set({ nodesById: toNodeMap(nodes) }),
    setEdges: (edges) => set({ edges }),
    upsertNode: (node) =>
      set((state) => ({
        nodesById: {
          ...state.nodesById,
          [node.id]: node,
        },
      })),
    patchNodeData: (id, patch) =>
      set((state) => {
        const existing = state.nodesById[id];
        if (!existing) return state;
        return {
          nodesById: {
            ...state.nodesById,
            [id]: {
              ...existing,
              data: {
                ...existing.data,
                ...patch,
              },
            },
          },
        };
      }),
    setNodeMessages: (id, messages) =>
      set((state) => {
        const existing = state.nodesById[id];
        if (!existing) return state;
        return {
          nodesById: {
            ...state.nodesById,
            [id]: {
              ...existing,
              data: {
                ...existing.data,
                messages,
              },
            },
          },
        };
      }),
    createRootNode: (options) => {
      const id = options?.id ?? createNodeId();
      const position = options?.position ?? { x: 0, y: 0 };
      const node: Node<CanvasNodeData> = {
        id,
        type: "message",
        position,
        data: {
          status: "idle",
          messages: options?.messages ?? [],
          width: DEFAULT_NODE_WIDTH,
          height: DEFAULT_NODE_HEIGHT,
          parentIds: [],
          childIds: [],
          createdAt: new Date().toISOString(),
        },
      };

      set((state) => ({
        nodesById: {
          ...state.nodesById,
          [id]: node,
        },
      }));

      return id;
    },
    branchNode: (parentId, options) => {
      const parent = get().nodesById[parentId];
      if (!parent) return null;

      const childId = createNodeId();
      const existingChildren = parent.data?.childIds ?? [];
      const childIndex = existingChildren.length;

      const baseX = parent.position.x;
      const baseY = parent.position.y + (parent.data?.height ?? DEFAULT_NODE_HEIGHT);

      const targetPosition = options?.position ?? {
        x: baseX + childIndex * (DEFAULT_NODE_WIDTH + HORIZONTAL_GAP),
        y: baseY + VERTICAL_GAP,
      };

      const childNode: Node<CanvasNodeData> = {
        id: childId,
        type: "message",
        position: targetPosition,
        data: {
          status: "idle",
          messages: options?.messages ?? parent.data?.messages ?? [],
          width: DEFAULT_NODE_WIDTH,
          height: DEFAULT_NODE_HEIGHT,
          parentIds: [parentId],
          childIds: [],
          createdAt: new Date().toISOString(),
        },
      };

      const edge: Edge = {
        id: `e-${parentId}-${childId}`,
        source: parentId,
        target: childId,
        sourceHandle: SOURCE_HANDLE_ID,
        targetHandle: TARGET_HANDLE_ID,
        type: "default",
      };

      set((state) => ({
        nodesById: {
          ...state.nodesById,
          [childId]: childNode,
          [parentId]: {
            ...parent,
            data: {
              ...parent.data,
              childIds: [...existingChildren, childId],
            },
          },
        },
        edges: [...state.edges, edge],
      }));

      return childId;
    },
    onNodesChange: (changes) =>
      set((state) => {
        if (!changes.length) return state;
        const nodes = Object.values(state.nodesById);
        const nextNodes = applyNodeChanges(changes, nodes);
        return { nodesById: toNodeMap(nextNodes) };
      }),
    onEdgesChange: (changes) =>
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges),
      })),
  }));
