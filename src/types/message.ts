export type MessageRole = "system" | "user" | "assistant" | "tool";

export type MessagePartText = {
  type: "text";
  text: string;
};

export type MessagePartImage = {
  type: "image";
  image: string;
  mimeType?: string;
  alt?: string;
};

export type MessagePartToolCall = {
  type: "tool-call";
  toolName: string;
  args?: unknown;
  id?: string;
};

export type MessagePartToolResult = {
  type: "tool-result";
  toolName: string;
  result?: unknown;
  id?: string;
};

export type MessagePart =
  | MessagePartText
  | MessagePartImage
  | MessagePartToolCall
  | MessagePartToolResult;

export type Message = {
  id?: string;
  role: MessageRole;
  content?: string;
  parts?: MessagePart[];
  createdAt?: string;
};
