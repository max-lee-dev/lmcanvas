import { createContext, memo, useContext, useMemo, useRef, useEffect } from 'react';
import ReactFlow, { Handle, Position, applyEdgeChanges, applyNodeChanges, Background, BackgroundVariant } from 'reactflow';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { jsxs, jsx } from 'react/jsx-runtime';
import { createStore } from 'zustand/vanilla';

// src/components/LMCanvas.tsx

// src/utils/message-utils.ts
function getMessageText(message) {
  var _a;
  if (!message) return "";
  const partsText = ((_a = message.parts) != null ? _a : []).filter((part) => part.type === "text").map((part) => part.text);
  const contentText = typeof message.content === "string" ? [message.content] : [];
  return [...contentText, ...partsText].filter(Boolean).join("\n").trim();
}
function getMessageImages(message) {
  var _a;
  if (!message) return [];
  return ((_a = message.parts) != null ? _a : []).filter(
    (part) => part.type === "image"
  );
}
function getMessageToolCalls(message) {
  var _a;
  if (!message) return [];
  return ((_a = message.parts) != null ? _a : []).filter(
    (part) => part.type === "tool-call"
  );
}

// src/constants.ts
var DEFAULT_NODE_WIDTH = 360;
var DEFAULT_NODE_HEIGHT = 200;
var VERTICAL_GAP = 140;
var HORIZONTAL_GAP = 80;
var SOURCE_HANDLE_ID = "source";
var TARGET_HANDLE_ID = "target";
var CanvasStoreContext = createContext(null);
var CanvasStoreProvider = CanvasStoreContext.Provider;
var useCanvasStore = (selector, equalityFn) => {
  const store = useContext(CanvasStoreContext);
  if (!store) {
    throw new Error("useCanvasStore must be used within a CanvasStoreProvider");
  }
  return useStoreWithEqualityFn(store, selector, equalityFn);
};
var useCanvasStoreApi = () => {
  const store = useContext(CanvasStoreContext);
  if (!store) {
    throw new Error("useCanvasStoreApi must be used within a CanvasStoreProvider");
  }
  return store;
};
var MessageNode = ({ id, data, selected }) => {
  var _a, _b, _c;
  const store = useCanvasStoreApi();
  const messages = (_a = data.messages) != null ? _a : [];
  const handleBranch = () => {
    store.getState().branchNode(id);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        width: (_b = data.width) != null ? _b : 360,
        minHeight: (_c = data.height) != null ? _c : 200,
        borderRadius: 16,
        border: selected ? "2px solid #1F6FEB" : "1px solid #1E293B",
        background: "#0B0F1A",
        color: "#E2E8F0",
        boxShadow: selected ? "0 10px 30px rgba(31, 111, 235, 0.35)" : "0 8px 24px rgba(15, 23, 42, 0.45)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12
      },
      children: [
        /* @__PURE__ */ jsx(
          Handle,
          {
            type: "target",
            position: Position.Top,
            id: TARGET_HANDLE_ID,
            style: { background: "#38BDF8", borderRadius: 999 }
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: messages.length === 0 ? /* @__PURE__ */ jsx("div", { style: { opacity: 0.6, fontSize: 13 }, children: "No messages yet." }) : messages.map((message, index) => {
          var _a2;
          const text = getMessageText(message);
          const images = getMessageImages(message);
          const toolCalls = getMessageToolCalls(message);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                borderRadius: 12,
                padding: 10,
                background: message.role === "assistant" ? "#111827" : "#0F172A",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: 8
              },
              children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 12, letterSpacing: 0.4, opacity: 0.7 }, children: message.role }),
                text ? /* @__PURE__ */ jsx("div", { style: { fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.5 }, children: text }) : null,
                images.length > 0 ? /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: images.map((imagePart, imgIndex) => {
                  var _a3;
                  return /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imagePart.image,
                      alt: (_a3 = imagePart.alt) != null ? _a3 : "image",
                      style: {
                        width: 120,
                        height: 120,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid rgba(148, 163, 184, 0.2)"
                      }
                    },
                    `${imagePart.image}-${imgIndex}`
                  );
                }) }) : null,
                toolCalls.length > 0 ? /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, opacity: 0.7 }, children: [
                  "Tool calls: ",
                  toolCalls.map((call) => call.toolName).join(", ")
                ] }) : null
              ]
            },
            (_a2 = message.id) != null ? _a2 : `${message.role}-${index}`
          );
        }) }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleBranch,
            style: {
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(15, 23, 42, 0.6)",
              color: "#E2E8F0",
              fontSize: 12,
              cursor: "pointer"
            },
            children: "Branch"
          }
        ) }),
        /* @__PURE__ */ jsx(
          Handle,
          {
            type: "source",
            position: Position.Bottom,
            id: SOURCE_HANDLE_ID,
            style: { background: "#38BDF8", borderRadius: 999 }
          }
        )
      ]
    }
  );
};
var MessageNode_default = memo(MessageNode);
var toNodeMap = (nodes) => nodes.reduce((acc, node) => {
  acc[node.id] = node;
  return acc;
}, {});
var createNodeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `node-${Math.floor(Math.random() * 1e9)}`;
};
var createCanvasStore = (initial) => createStore((set, get) => {
  var _a, _b;
  return {
    nodesById: toNodeMap((_a = initial == null ? void 0 : initial.nodes) != null ? _a : []),
    edges: (_b = initial == null ? void 0 : initial.edges) != null ? _b : [],
    activeNodeId: null,
    camera: null,
    getNode: (id) => get().nodesById[id],
    setNodes: (nodes) => set({ nodesById: toNodeMap(nodes) }),
    setEdges: (edges) => set({ edges }),
    setActiveNodeId: (nodeId) => set({ activeNodeId: nodeId }),
    setCamera: (camera) => set({ camera }),
    upsertNode: (node) => set((state) => ({
      nodesById: {
        ...state.nodesById,
        [node.id]: node
      }
    })),
    patchNodeData: (id, patch) => set((state) => {
      const existing = state.nodesById[id];
      if (!existing) return state;
      return {
        nodesById: {
          ...state.nodesById,
          [id]: {
            ...existing,
            data: {
              ...existing.data,
              ...patch
            }
          }
        }
      };
    }),
    setNodeMessages: (id, messages) => set((state) => {
      const existing = state.nodesById[id];
      if (!existing) return state;
      return {
        nodesById: {
          ...state.nodesById,
          [id]: {
            ...existing,
            data: {
              ...existing.data,
              messages
            }
          }
        }
      };
    }),
    createRootNode: (options) => {
      var _a2, _b2, _c;
      const id = (_a2 = options == null ? void 0 : options.id) != null ? _a2 : createNodeId();
      const position = (_b2 = options == null ? void 0 : options.position) != null ? _b2 : { x: 0, y: 0 };
      const node = {
        id,
        type: "message",
        position,
        data: {
          status: "idle",
          messages: (_c = options == null ? void 0 : options.messages) != null ? _c : [],
          width: DEFAULT_NODE_WIDTH,
          height: DEFAULT_NODE_HEIGHT,
          parentIds: [],
          childIds: [],
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      set((state) => ({
        nodesById: {
          ...state.nodesById,
          [id]: node
        }
      }));
      return id;
    },
    branchNode: (parentId, options) => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      const parent = get().nodesById[parentId];
      if (!parent) return null;
      const childId = createNodeId();
      const existingChildren = (_b2 = (_a2 = parent.data) == null ? void 0 : _a2.childIds) != null ? _b2 : [];
      const childIndex = existingChildren.length;
      const baseX = parent.position.x;
      const baseY = parent.position.y + ((_d = (_c = parent.data) == null ? void 0 : _c.height) != null ? _d : DEFAULT_NODE_HEIGHT);
      const targetPosition = (_e = options == null ? void 0 : options.position) != null ? _e : {
        x: baseX + childIndex * (DEFAULT_NODE_WIDTH + HORIZONTAL_GAP),
        y: baseY + VERTICAL_GAP
      };
      const childNode = {
        id: childId,
        type: "message",
        position: targetPosition,
        data: {
          status: "idle",
          messages: (_h = (_g = options == null ? void 0 : options.messages) != null ? _g : (_f = parent.data) == null ? void 0 : _f.messages) != null ? _h : [],
          width: DEFAULT_NODE_WIDTH,
          height: DEFAULT_NODE_HEIGHT,
          parentIds: [parentId],
          childIds: [],
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      const edge = {
        id: `e-${parentId}-${childId}`,
        source: parentId,
        target: childId,
        sourceHandle: SOURCE_HANDLE_ID,
        targetHandle: TARGET_HANDLE_ID,
        type: "default"
      };
      set((state) => ({
        nodesById: {
          ...state.nodesById,
          [childId]: childNode,
          [parentId]: {
            ...parent,
            data: {
              ...parent.data,
              childIds: [...existingChildren, childId]
            }
          }
        },
        edges: [...state.edges, edge]
      }));
      return childId;
    },
    exportViewSnapshot: (options) => {
      var _a2, _b2;
      const state = get();
      const nodes = Object.values(state.nodesById);
      const nodeViews = nodes.reduce((acc, node) => {
        var _a3, _b3;
        acc[node.id] = {
          id: node.id,
          x: node.position.x,
          y: node.position.y,
          width: (_a3 = node.data) == null ? void 0 : _a3.width,
          height: (_b3 = node.data) == null ? void 0 : _b3.height
        };
        return acc;
      }, {});
      return {
        version: 1,
        savedAt: (/* @__PURE__ */ new Date()).toISOString(),
        activeNodeId: (_a2 = options == null ? void 0 : options.activeNodeId) != null ? _a2 : state.activeNodeId,
        camera: (_b2 = options == null ? void 0 : options.camera) != null ? _b2 : state.camera,
        nodes: nodeViews
      };
    },
    importViewSnapshot: (snapshot, options) => set((state) => {
      var _a2, _b2;
      const nextNodesById = { ...state.nodesById };
      Object.entries(snapshot.nodes).forEach(([id, savedNode]) => {
        const existing = nextNodesById[id];
        if (!existing) return;
        nextNodesById[id] = {
          ...existing,
          position: {
            x: savedNode.x,
            y: savedNode.y
          },
          data: {
            ...existing.data,
            ...typeof savedNode.width === "number" ? { width: savedNode.width } : {},
            ...typeof savedNode.height === "number" ? { height: savedNode.height } : {}
          }
        };
      });
      return {
        nodesById: nextNodesById,
        ...(options == null ? void 0 : options.applyActiveNode) === false ? {} : { activeNodeId: (_a2 = snapshot.activeNodeId) != null ? _a2 : null },
        ...(options == null ? void 0 : options.applyCamera) === false ? {} : { camera: (_b2 = snapshot.camera) != null ? _b2 : null }
      };
    }),
    onNodesChange: (changes) => set((state) => {
      if (!changes.length) return state;
      const nodes = Object.values(state.nodesById);
      const nextNodes = applyNodeChanges(changes, nodes);
      return { nodesById: toNodeMap(nextNodes) };
    }),
    onEdgesChange: (changes) => set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }))
  };
});
var nodeTypes = {
  message: MessageNode_default
};
var LMCanvasInner = ({ focusNodeId, fitView }) => {
  const nodes = useCanvasStore((state) => Object.values(state.nodesById));
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange = useCanvasStore((state) => state.onNodesChange);
  const onEdgesChange = useCanvasStore((state) => state.onEdgesChange);
  const getNode = useCanvasStore((state) => state.getNode);
  const camera = useCanvasStore((state) => state.camera);
  const setCamera = useCanvasStore((state) => state.setCamera);
  const setActiveNodeId = useCanvasStore((state) => state.setActiveNodeId);
  const reactFlowRef = useRef(null);
  useEffect(() => {
    if (!camera || !reactFlowRef.current) return;
    const current = reactFlowRef.current.getViewport();
    const isSame = Math.abs(current.x - camera.x) < 0.5 && Math.abs(current.y - camera.y) < 0.5 && Math.abs(current.zoom - camera.zoom) < 1e-3;
    if (isSame) return;
    reactFlowRef.current.setViewport(
      { x: camera.x, y: camera.y, zoom: camera.zoom },
      { duration: 0 }
    );
  }, [camera]);
  useEffect(() => {
    var _a, _b, _c, _d;
    if (!focusNodeId) return;
    const node = getNode(focusNodeId);
    if (!node || !reactFlowRef.current) return;
    const width = (_b = (_a = node.data) == null ? void 0 : _a.width) != null ? _b : DEFAULT_NODE_WIDTH;
    const height = (_d = (_c = node.data) == null ? void 0 : _c.height) != null ? _d : DEFAULT_NODE_HEIGHT;
    const centerX = node.position.x + width / 2;
    const centerY = node.position.y + height / 2;
    reactFlowRef.current.setCenter(centerX, centerY, {
      zoom: 1.05,
      duration: 200
    });
  }, [focusNodeId, getNode]);
  return /* @__PURE__ */ jsx(
    ReactFlow,
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      nodeTypes,
      fitView,
      onInit: (instance) => {
        reactFlowRef.current = instance;
      },
      onMoveEnd: (_, viewport) => {
        setCamera({
          x: viewport.x,
          y: viewport.y,
          zoom: viewport.zoom
        });
      },
      onNodeClick: (_, node) => {
        setActiveNodeId(node.id);
      },
      children: /* @__PURE__ */ jsx(Background, { variant: BackgroundVariant.Dots, gap: 24, size: 1 })
    }
  );
};
var LMCanvas = ({ className, store, focusNodeId, fitView = true }) => {
  const defaultStore = useMemo(() => createCanvasStore(), []);
  const activeStore = store != null ? store : defaultStore;
  return /* @__PURE__ */ jsx("div", { className, style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsx(CanvasStoreProvider, { value: activeStore, children: /* @__PURE__ */ jsx(LMCanvasInner, { focusNodeId: focusNodeId != null ? focusNodeId : null, fitView }) }) });
};
var LMCanvas_default = LMCanvas;

// src/adapters/run-message-interaction.ts
var isAsyncIterable = (value) => typeof value === "object" && value !== null && Symbol.asyncIterator in value;
var mergeMessage = (existing, incoming) => {
  var _a, _b;
  return {
    ...existing,
    ...incoming,
    parts: (_a = incoming.parts) != null ? _a : existing.parts,
    content: (_b = incoming.content) != null ? _b : existing.content
  };
};
var upsertMessage = (messages, next) => {
  if (next.id) {
    const existingIndex = messages.findIndex((message) => message.id === next.id);
    if (existingIndex >= 0) {
      const copy = [...messages];
      copy[existingIndex] = mergeMessage(copy[existingIndex], next);
      return copy;
    }
  }
  return [...messages, next];
};
var appendIfMissingById = (messages, next) => {
  if (!next.id) return [...messages, next];
  if (messages.some((message) => message.id === next.id)) return messages;
  return [...messages, next];
};
var getNodeMessages = (store, nodeRef) => {
  var _a, _b;
  const node = store.getState().getNode(nodeRef);
  return (_b = (_a = node == null ? void 0 : node.data) == null ? void 0 : _a.messages) != null ? _b : [];
};
var runMessageInteraction = async (input) => {
  var _a;
  const {
    store,
    adapter,
    nodeRef,
    message,
    parentNodeRef,
    metadata,
    optimistic = true,
    syncOnComplete = true
  } = input;
  const existingNode = store.getState().getNode(nodeRef);
  if (!existingNode) {
    throw new Error(`runMessageInteraction: node "${nodeRef}" not found`);
  }
  try {
    store.getState().patchNodeData(nodeRef, { status: "loading" });
    if (optimistic) {
      const baseMessages = getNodeMessages(store, nodeRef);
      const nextMessages = appendIfMissingById(baseMessages, message);
      store.getState().setNodeMessages(nodeRef, nextMessages);
    }
    const response = adapter.sendMessage({
      nodeRef,
      message,
      parentNodeRef,
      metadata
    });
    if (isAsyncIterable(response)) {
      for await (const streamedMessage of response) {
        const current = getNodeMessages(store, nodeRef);
        const nextMessages = upsertMessage(current, streamedMessage);
        store.getState().setNodeMessages(nodeRef, nextMessages);
      }
    } else {
      await response;
    }
    if (syncOnComplete) {
      const canonicalMessages = adapter.getMessages(nodeRef);
      if (canonicalMessages.length > 0) {
        store.getState().setNodeMessages(nodeRef, canonicalMessages);
      }
    }
    store.getState().patchNodeData(nodeRef, { status: "completed" });
    const finalMessages = getNodeMessages(store, nodeRef);
    return { status: "completed", messages: finalMessages };
  } catch (error) {
    store.getState().patchNodeData(nodeRef, { status: "error" });
    (_a = adapter.onError) == null ? void 0 : _a.call(adapter, error, nodeRef);
    throw error;
  }
};

// src/persistence/localStorage.ts
var DEFAULT_PREFIX = "lmcanvas:view:";
var safeParse = (raw) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || typeof parsed.nodes !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};
var resolveStorage = (explicitStorage) => {
  if (explicitStorage) return explicitStorage;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};
var createLocalStoragePersistenceAdapter = (options) => {
  var _a;
  const prefix = (_a = options == null ? void 0 : options.keyPrefix) != null ? _a : DEFAULT_PREFIX;
  return {
    load: (key) => {
      const storage = resolveStorage(options == null ? void 0 : options.storage);
      if (!storage) return null;
      return safeParse(storage.getItem(`${prefix}${key}`));
    },
    save: (key, snapshot) => {
      const storage = resolveStorage(options == null ? void 0 : options.storage);
      if (!storage) return;
      storage.setItem(`${prefix}${key}`, JSON.stringify(snapshot));
    },
    clear: (key) => {
      const storage = resolveStorage(options == null ? void 0 : options.storage);
      if (!storage) return;
      storage.removeItem(`${prefix}${key}`);
    }
  };
};

// src/utils/linear-to-graph.ts
var toTurns = (messages) => {
  if (!messages.length) return [[]];
  const turns = [];
  const running = [];
  messages.forEach((message, index) => {
    running.push(message);
    const isAssistant = message.role === "assistant";
    const isLast = index === messages.length - 1;
    if (isAssistant || isLast) {
      turns.push([...running]);
    }
  });
  return turns;
};
var buildUniqueNodeId = (desired, existing) => {
  if (!existing.has(desired)) {
    existing.add(desired);
    return desired;
  }
  let suffix = 1;
  let next = `${desired}-${suffix}`;
  while (existing.has(next)) {
    suffix += 1;
    next = `${desired}-${suffix}`;
  }
  existing.add(next);
  return next;
};
var buildLinearGraphFromMessages = (messages, options) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const nodeWidth = (_a = options == null ? void 0 : options.nodeWidth) != null ? _a : DEFAULT_NODE_WIDTH;
  const nodeHeight = (_b = options == null ? void 0 : options.nodeHeight) != null ? _b : DEFAULT_NODE_HEIGHT;
  const startX = (_c = options == null ? void 0 : options.startX) != null ? _c : 0;
  const startY = (_d = options == null ? void 0 : options.startY) != null ? _d : 0;
  const verticalGap = (_e = options == null ? void 0 : options.verticalGap) != null ? _e : VERTICAL_GAP;
  const idPrefix = (_f = options == null ? void 0 : options.idPrefix) != null ? _f : "linear-node";
  const turns = toTurns(messages);
  const nodes = [];
  const edges = [];
  const usedIds = /* @__PURE__ */ new Set();
  for (let index = 0; index < turns.length; index += 1) {
    const turnMessages = turns[index];
    const lastMessage = turnMessages[turnMessages.length - 1];
    const seedId = (lastMessage == null ? void 0 : lastMessage.id) ? `${idPrefix}-${lastMessage.id}` : `${idPrefix}-${index}`;
    const nodeId = buildUniqueNodeId(seedId, usedIds);
    const parentNodeId = (_g = nodes[index - 1]) == null ? void 0 : _g.id;
    nodes.push({
      id: nodeId,
      type: "message",
      position: {
        x: startX,
        y: startY + index * (nodeHeight + verticalGap)
      },
      data: {
        status: "idle",
        messages: turnMessages,
        width: nodeWidth,
        height: nodeHeight,
        parentIds: parentNodeId ? [parentNodeId] : [],
        childIds: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    if (parentNodeId) {
      edges.push({
        id: `e-${parentNodeId}-${nodeId}`,
        source: parentNodeId,
        target: nodeId,
        sourceHandle: SOURCE_HANDLE_ID,
        targetHandle: TARGET_HANDLE_ID,
        type: "default"
      });
      const previousNode = nodes[index - 1];
      previousNode.data = {
        ...previousNode.data,
        childIds: [nodeId]
      };
    }
  }
  const rootNodeId = (_i = (_h = nodes[0]) == null ? void 0 : _h.id) != null ? _i : "";
  const lastNodeId = (_k = (_j = nodes[nodes.length - 1]) == null ? void 0 : _j.id) != null ? _k : "";
  return {
    nodes,
    edges,
    rootNodeId,
    lastNodeId
  };
};

export { LMCanvas_default as LMCanvas, buildLinearGraphFromMessages, createCanvasStore, createLocalStoragePersistenceAdapter, getMessageImages, getMessageText, getMessageToolCalls, runMessageInteraction, useCanvasStore, useCanvasStoreApi };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map