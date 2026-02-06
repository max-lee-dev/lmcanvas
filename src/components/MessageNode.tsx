import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { CanvasNodeData } from "@/types/node";
import { getMessageImages, getMessageText, getMessageToolCalls } from "@/utils/message-utils";
import { SOURCE_HANDLE_ID, TARGET_HANDLE_ID } from "@/constants";
import { useCanvasStoreApi } from "@/store/store-context";

const MessageNode = ({ id, data, selected }: NodeProps<CanvasNodeData>) => {
  const store = useCanvasStoreApi();
  const messages = data.messages ?? [];

  const handleBranch = () => {
    store.getState().branchNode(id);
  };

  return (
    <div
      style={{
        width: data.width ?? 360,
        minHeight: data.height ?? 200,
        borderRadius: 16,
        border: selected ? "2px solid #1F6FEB" : "1px solid #1E293B",
        background: "#0B0F1A",
        color: "#E2E8F0",
        boxShadow: selected
          ? "0 10px 30px rgba(31, 111, 235, 0.35)"
          : "0 8px 24px rgba(15, 23, 42, 0.45)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id={TARGET_HANDLE_ID}
        style={{ background: "#38BDF8", borderRadius: 999 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 ? (
          <div style={{ opacity: 0.6, fontSize: 13 }}>No messages yet.</div>
        ) : (
          messages.map((message, index) => {
            const text = getMessageText(message);
            const images = getMessageImages(message);
            const toolCalls = getMessageToolCalls(message);

            return (
              <div
                key={message.id ?? `${message.role}-${index}`}
                style={{
                  borderRadius: 12,
                  padding: 10,
                  background: message.role === "assistant" ? "#111827" : "#0F172A",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 12, letterSpacing: 0.4, opacity: 0.7 }}>
                  {message.role}
                </div>
                {text ? (
                  <div style={{ fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                    {text}
                  </div>
                ) : null}
                {images.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {images.map((imagePart, imgIndex) => (
                      <img
                        key={`${imagePart.image}-${imgIndex}`}
                        src={imagePart.image}
                        alt={imagePart.alt ?? "image"}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                        }}
                      />
                    ))}
                  </div>
                ) : null}
                {toolCalls.length > 0 ? (
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    Tool calls: {toolCalls.map((call) => call.toolName).join(", ")}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={handleBranch}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid rgba(148, 163, 184, 0.3)",
            background: "rgba(15, 23, 42, 0.6)",
            color: "#E2E8F0",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Branch
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id={SOURCE_HANDLE_ID}
        style={{ background: "#38BDF8", borderRadius: 999 }}
      />
    </div>
  );
};

export default memo(MessageNode);
