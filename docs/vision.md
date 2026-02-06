# Vision

## Product

`lmcanvas` is a lightweight branching chat canvas for React apps. It gives any chat interface a way to open a spatial, branchable view of a conversation without embedding ReactFlow inside another ReactFlow instance.

## Problem

Most chat UIs are linear. Users can fork ideas mentally, but not in the interface. Existing canvas-style solutions are often tightly coupled to one app, heavy to integrate, or architecturally fragile when nested inside another graph.

## North Star

From any chat UI, a developer can add an "Open in LMCanvas" action that opens a branching conversation canvas in minutes, with stable behavior and minimal integration code.

## Goals

- Make branching conversations easy to open from existing chat interfaces.
- Keep integration lightweight for host apps.
- Preserve canvas state across open/close cycles.
- Support AI SDK-style message structures (`content` and `parts`).
- Keep the library focused: canvas, node state, and branching primitives.

## Non-Goals

- Not a full chat backend or transport framework.
- Not a workflow engine for tool execution.
- Not opinionated about model providers or persistence backends.
- Not a replacement for host-app chat UI.

## Primary Users

- Product engineers adding exploratory/branching UX to existing chat apps.
- Teams that already use React + ReactFlow and need a reusable branching layer.

## Product Constraints

- No nested ReactFlow (overlay/sibling mounting pattern by default).
- External store support for persistence across unmount/remount.
- Small public API surface and predictable behavior.

## Success Signals

- Time-to-first-integration is low (single session setup, no architecture rewrite).
- Host apps can map any chat item to a focused canvas node.
- Canvas interactions remain reliable under repeated open/close cycles.
- Message rendering works with mixed text/image/tool-call parts.

## Current Scope (v0)

- Canvas rendering (`LMCanvas`)
- External store factory (`createCanvasStore`)
- Branching operations (`branchNode`, `createRootNode`)
- Message rendering helpers (`getMessageText`, `getMessageImages`, `getMessageToolCalls`)
- Focus-on-open behavior (`focusNodeId`)

## Open Questions (To Finalize Together)

- Persistence boundary: should long-term persistence remain fully host-owned, or should `lmcanvas` provide optional persistence adapters later?
- Streaming UX: should streaming primitives be built into `lmcanvas`, or stay entirely at host-app level?
- Node UX defaults: how much visual theming/configurability should be first-class in the library API?
- Interop target: should the package optimize specifically for AI SDK message semantics, or remain message-schema-agnostic with adapters?
