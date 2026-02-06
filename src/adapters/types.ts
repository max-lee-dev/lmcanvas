import type { Message } from "@/types/message";

export type NodeRef = string;

export type SendMessageInput = {
  nodeRef: NodeRef;
  message: Message;
  parentNodeRef?: NodeRef;
  metadata?: Record<string, unknown>;
};

export type ChatStatus = "idle" | "loading" | "completed" | "error";

export type MessageAdapter = {
  getMessages?: (nodeRef: NodeRef) => Message[];
  sendMessage: (
    input: SendMessageInput,
  ) => Promise<void> | AsyncIterable<Message> | void;
  getStatus?: (nodeRef: NodeRef) => ChatStatus | undefined;
  onError?: (error: unknown, nodeRef: NodeRef) => void;
};
