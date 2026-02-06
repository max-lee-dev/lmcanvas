import type { Message, MessagePartImage, MessagePartToolCall } from "@/types/message";

export function getMessageText(message: Message | null | undefined): string {
  if (!message) return "";
  const partsText = (message.parts ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text);

  const contentText = typeof message.content === "string" ? [message.content] : [];

  return [...contentText, ...partsText].filter(Boolean).join("\n").trim();
}

export function getMessageImages(message: Message | null | undefined): MessagePartImage[] {
  if (!message) return [];
  return (message.parts ?? []).filter(
    (part): part is MessagePartImage => part.type === "image",
  );
}

export function getMessageToolCalls(message: Message | null | undefined): MessagePartToolCall[] {
  if (!message) return [];
  return (message.parts ?? []).filter(
    (part): part is MessagePartToolCall => part.type === "tool-call",
  );
}
