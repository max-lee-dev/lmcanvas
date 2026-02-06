# Integration

## 2-Minute Setup

```tsx
import "reactflow/dist/style.css";
import { LMCanvas, createCanvasStore } from "lmcanvas";

const store = createCanvasStore();
store.getState().createRootNode({
  messages: [{ role: "user", content: "Start here" }],
});

export function CanvasScreen() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LMCanvas store={store} />
    </div>
  );
}
```

## Bootstrap from a Linear Chat

If your host app has a single linear message array, you can generate an initial chain graph.

```ts
import { buildLinearGraphFromMessages, createCanvasStore } from "lmcanvas";

const graph = buildLinearGraphFromMessages(messages);
const store = createCanvasStore({
  nodes: graph.nodes,
  edges: graph.edges,
});
```

## View Persistence (Local Storage)

Persist only canvas view metadata (`x/y/size/camera/active node`).

```ts
import { createLocalStoragePersistenceAdapter } from "lmcanvas";

const persist = createLocalStoragePersistenceAdapter();
const key = "chat-123";

// Restore
const snapshot = persist.load(key);
if (snapshot) {
  store.getState().importViewSnapshot(snapshot);
}

// Save
persist.save(key, store.getState().exportViewSnapshot());
```

## Adapter Shape

`lmcanvas` does not require a specific backend. A host app adapter can look like this:

```ts
import type { MessageAdapter } from "lmcanvas";

const adapter: MessageAdapter = {
  getMessages(nodeRef) {
    return getMessagesForNode(nodeRef);
  },
  async sendMessage({ nodeRef, message }) {
    await sendToApi({ nodeRef, message });
  },
};
```

## Run One Message Interaction

Use `runMessageInteraction` when you want `lmcanvas` to orchestrate common send-flow behavior:
- set node status to `loading`
- apply optimistic user message
- handle streamed assistant messages (if `sendMessage` returns `AsyncIterable`)
- sync final canonical messages from adapter
- set node status to `completed` or `error`

```ts
import { runMessageInteraction } from "lmcanvas";

await runMessageInteraction({
  store,
  adapter,
  nodeRef,
  message: { role: "user", content: "What if we branch this idea?" },
});
```

## Notes

- Keep canonical messages in host state/database.
- Keep layout/view metadata in `lmcanvas` store.
- Use hosted/cloud persistence as an optional upgrade, not a core requirement.
