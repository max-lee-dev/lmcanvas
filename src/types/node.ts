import type { Message } from "@/types/message";

export type NodeStatus = "idle" | "loading" | "completed" | "error";

export type CanvasNodeData = {
  status?: NodeStatus;
  messages?: Message[];
  parentIds?: string[];
  childIds?: string[];
  width?: number;
  height?: number;
  createdAt?: string;
};
