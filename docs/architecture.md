# Architecture

## Overview

`lmcanvas` is a React component library with state managed by a vanilla Zustand store and rendered via ReactFlow. The package is intentionally host-app agnostic: host apps own chat transport, persistence, and app-level routing/UI.

For package layering and monetization boundaries, see `docs/package-map.md`.

## Main Components

- `LMCanvas` (`src/components/LMCanvas.tsx`)
  - Mounts ReactFlow with `message` node type.
  - Accepts optional external `store` and `focusNodeId`.
  - Centers viewport on focused node when provided.
- `MessageNode` (`src/components/MessageNode.tsx`)
  - Renders node messages and branch action.
  - Uses message helpers to render text, images, and tool calls.
- `Canvas Store` (`src/store/canvasStore.ts`)
  - Source of truth for nodes/edges.
  - Provides mutation APIs (`createRootNode`, `branchNode`, `setNodeMessages`, etc.).
  - Tracks view state (`camera`, `activeNodeId`).
  - Exposes view snapshot APIs (`exportViewSnapshot`, `importViewSnapshot`).
  - Handles ReactFlow change events (`onNodesChange`, `onEdgesChange`).
- `Store Context` (`src/store/store-context.tsx`)
  - Injects a store instance into React component tree.
  - Enables external store injection for persistent behavior.

## Data Model

- `Message` (`src/types/message.ts`)
  - `role`, optional `content`, optional `parts`.
  - `parts` supports `text`, `image`, `tool-call`, `tool-result`.
- `CanvasNodeData` (`src/types/node.ts`)
  - Node status, message list, parent/child references, dimensions, metadata.
- `CanvasViewSnapshot` (`src/persistence/types.ts`)
  - Lightweight persisted view metadata (positions, dimensions, camera, active node).

## Flow

1. Host app creates or reuses a `CanvasStore` instance.
2. Host app mounts `LMCanvas` with that store.
3. User branches from a node, creating child node + edge in store.
4. Host app updates node messages via store APIs as chat state evolves.
5. Host app can reopen canvas later using same store instance and optional `focusNodeId`.

## Integration Boundary

`lmcanvas` owns:
- Canvas rendering
- Branching node graph state
- Message display helpers

Host app owns:
- API requests / streaming transport
- Mapping between host chat IDs and canvas node IDs
- Persistence to server/local storage
- Overlay/sheet/modal mounting UX

Optional integration helpers:
- `buildLinearGraphFromMessages` for bootstrapping a graph from linear chat history.
- `createLocalStoragePersistenceAdapter` for lightweight local view persistence.
- `runMessageInteraction` for a standardized send lifecycle on top of host `sendMessage`.

## Architectural Principles

- Do not nest ReactFlow inside ReactFlow.
- Favor explicit external state injection over hidden global state.
- Keep package interfaces narrow and composable.
- Preserve compatibility with common chat message schemas.
