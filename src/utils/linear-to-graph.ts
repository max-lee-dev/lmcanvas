import type { Edge, Node } from "reactflow";
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  SOURCE_HANDLE_ID,
  TARGET_HANDLE_ID,
  VERTICAL_GAP,
} from "@/constants";
import type { Message } from "@/types/message";
import type { CanvasNodeData } from "@/types/node";

export type BuildLinearGraphOptions = {
  startX?: number;
  startY?: number;
  verticalGap?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  idPrefix?: string;
};

export type LinearGraph = {
  nodes: Node<CanvasNodeData>[];
  edges: Edge[];
  rootNodeId: string;
  lastNodeId: string;
};

const toTurns = (messages: Message[]): Message[][] => {
  if (!messages.length) return [[]];

  const turns: Message[][] = [];
  const running: Message[] = [];

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

const buildUniqueNodeId = (
  desired: string,
  existing: Set<string>,
): string => {
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

export const buildLinearGraphFromMessages = (
  messages: Message[],
  options?: BuildLinearGraphOptions,
): LinearGraph => {
  const nodeWidth = options?.nodeWidth ?? DEFAULT_NODE_WIDTH;
  const nodeHeight = options?.nodeHeight ?? DEFAULT_NODE_HEIGHT;
  const startX = options?.startX ?? 0;
  const startY = options?.startY ?? 0;
  const verticalGap = options?.verticalGap ?? VERTICAL_GAP;
  const idPrefix = options?.idPrefix ?? "linear-node";

  const turns = toTurns(messages);
  const nodes: Node<CanvasNodeData>[] = [];
  const edges: Edge[] = [];
  const usedIds = new Set<string>();

  for (let index = 0; index < turns.length; index += 1) {
    const turnMessages = turns[index];
    const lastMessage = turnMessages[turnMessages.length - 1];
    const seedId = lastMessage?.id
      ? `${idPrefix}-${lastMessage.id}`
      : `${idPrefix}-${index}`;
    const nodeId = buildUniqueNodeId(seedId, usedIds);

    const parentNodeId = nodes[index - 1]?.id;

    nodes.push({
      id: nodeId,
      type: "message",
      position: {
        x: startX,
        y: startY + index * (nodeHeight + verticalGap),
      },
      data: {
        status: "idle",
        messages: turnMessages,
        width: nodeWidth,
        height: nodeHeight,
        parentIds: parentNodeId ? [parentNodeId] : [],
        childIds: [],
        createdAt: new Date().toISOString(),
      },
    });

    if (parentNodeId) {
      edges.push({
        id: `e-${parentNodeId}-${nodeId}`,
        source: parentNodeId,
        target: nodeId,
        sourceHandle: SOURCE_HANDLE_ID,
        targetHandle: TARGET_HANDLE_ID,
        type: "default",
      });

      const previousNode = nodes[index - 1];
      previousNode.data = {
        ...previousNode.data,
        childIds: [nodeId],
      };
    }
  }

  const rootNodeId = nodes[0]?.id ?? "";
  const lastNodeId = nodes[nodes.length - 1]?.id ?? "";

  return {
    nodes,
    edges,
    rootNodeId,
    lastNodeId,
  };
};
