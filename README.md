# lmcanvas

Lightweight branching chat canvas for React (ReactFlow-based). Designed to be mounted as a sibling/overlay so you can open a branching view from any chat UI without nesting ReactFlow.

## Install

```bash
npm install lmcanvas reactflow zustand
```

## Usage

```tsx
import "reactflow/dist/style.css";
import { LMCanvas, createCanvasStore } from "lmcanvas";

const store = createCanvasStore();

// Create an initial root node
store.getState().createRootNode({
  position: { x: 0, y: 0 },
  messages: [
    { role: "user", content: "Start here" },
  ],
});

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LMCanvas store={store} />
    </div>
  );
}
```

## Branching

Each node has a built-in **Branch** button that creates a child node with the parent’s messages. You can also branch programmatically:

```ts
const { branchNode } = store.getState();
branchNode(parentId);
```

## Focus a node

```tsx
<LMCanvas store={store} focusNodeId={"node-id"} />
```

## Message parts helpers (AI SDK compatible)

```ts
import { getMessageText, getMessageImages, getMessageToolCalls } from "lmcanvas";
```

`Message` supports both `content` and `parts` (e.g. `type: "text" | "image" | "tool-call"`).

## Notes

- Use an external store (`createCanvasStore`) to keep canvas state across unmount/remount.
- Avoid nesting ReactFlow inside ReactFlow. Mount LMCanvas in an overlay/sibling container.

