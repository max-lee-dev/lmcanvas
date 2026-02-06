import { useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type ReactFlowInstance,
} from "reactflow";
import MessageNode from "@/components/MessageNode";
import { CanvasStoreProvider, useCanvasStore } from "@/store/store-context";
import type { CanvasStore } from "@/store/canvasStore";
import { createCanvasStore } from "@/store/canvasStore";
import { DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from "@/constants";

export type LMCanvasProps = {
  className?: string;
  store?: CanvasStore;
  focusNodeId?: string | null;
  fitView?: boolean;
};

const nodeTypes = {
  message: MessageNode,
};

const LMCanvasInner = ({ focusNodeId, fitView }: Pick<LMCanvasProps, "focusNodeId" | "fitView">) => {
  const nodes = useCanvasStore((state) => Object.values(state.nodesById));
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange = useCanvasStore((state) => state.onNodesChange);
  const onEdgesChange = useCanvasStore((state) => state.onEdgesChange);
  const getNode = useCanvasStore((state) => state.getNode);

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (!focusNodeId) return;
    const node = getNode(focusNodeId);
    if (!node || !reactFlowRef.current) return;

    const width = node.data?.width ?? DEFAULT_NODE_WIDTH;
    const height = node.data?.height ?? DEFAULT_NODE_HEIGHT;
    const centerX = node.position.x + width / 2;
    const centerY = node.position.y + height / 2;

    reactFlowRef.current.setCenter(centerX, centerY, {
      zoom: 1.05,
      duration: 200,
    });
  }, [focusNodeId, getNode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView={fitView}
      onInit={(instance) => {
        reactFlowRef.current = instance;
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
    </ReactFlow>
  );
};

const LMCanvas = ({ className, store, focusNodeId, fitView = true }: LMCanvasProps) => {
  const defaultStore = useMemo(() => createCanvasStore(), []);
  const activeStore = store ?? defaultStore;

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <CanvasStoreProvider value={activeStore}>
        <LMCanvasInner focusNodeId={focusNodeId ?? null} fitView={fitView} />
      </CanvasStoreProvider>
    </div>
  );
};

export default LMCanvas;
