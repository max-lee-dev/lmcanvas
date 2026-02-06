import type { CanvasStore } from "@/store/canvasStore";
import type { Message } from "@/types/message";
import type { ChatStatus, MessageAdapter, SendMessageInput } from "@/adapters/types";

export type RunMessageInteractionInput = SendMessageInput & {
  store: CanvasStore;
  adapter: MessageAdapter;
  optimistic?: boolean;
  syncOnComplete?: boolean;
};

export type RunMessageInteractionResult = {
  status: ChatStatus;
  messages: Message[];
};

const isAsyncIterable = <T,>(value: unknown): value is AsyncIterable<T> =>
  typeof value === "object" &&
  value !== null &&
  Symbol.asyncIterator in (value as Record<PropertyKey, unknown>);

const mergeMessage = (existing: Message, incoming: Message): Message => ({
  ...existing,
  ...incoming,
  parts: incoming.parts ?? existing.parts,
  content: incoming.content ?? existing.content,
});

const upsertMessage = (messages: Message[], next: Message): Message[] => {
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

const appendIfMissingById = (messages: Message[], next: Message): Message[] => {
  if (!next.id) return [...messages, next];
  if (messages.some((message) => message.id === next.id)) return messages;
  return [...messages, next];
};

const getNodeMessages = (store: CanvasStore, nodeRef: string): Message[] => {
  const node = store.getState().getNode(nodeRef);
  return node?.data?.messages ?? [];
};

export const runMessageInteraction = async (
  input: RunMessageInteractionInput,
): Promise<RunMessageInteractionResult> => {
  const {
    store,
    adapter,
    nodeRef,
    message,
    parentNodeRef,
    metadata,
    optimistic = true,
    syncOnComplete = true,
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
      metadata,
    });

    if (isAsyncIterable<Message>(response)) {
      for await (const streamedMessage of response) {
        const current = getNodeMessages(store, nodeRef);
        const nextMessages = upsertMessage(current, streamedMessage);
        store.getState().setNodeMessages(nodeRef, nextMessages);
      }
    } else {
      await response;
    }

    if (syncOnComplete && adapter.getMessages) {
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
    adapter.onError?.(error, nodeRef);
    throw error;
  }
};
