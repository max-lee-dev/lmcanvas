# Decisions

This file records architecture-significant choices for `lmcanvas`.

## D-001: Use Overlay/Sibling Mounting Instead of Nested ReactFlow

- Date: 2026-02-06
- Status: Accepted
- Context: Host apps may already use ReactFlow. Nesting ReactFlow can cause pointer/event conflicts and unstable interaction behavior.
- Decision: `lmcanvas` should be mounted as an overlay/sibling surface, not embedded as a ReactFlow child graph.
- Consequences:
  - More reliable interaction model.
  - Host app must provide overlay/sheet/modal orchestration.

## D-002: Support External Persistent Store

- Date: 2026-02-06
- Status: Accepted
- Context: Canvas should preserve state across mount/unmount when opened from chat UI.
- Decision: `LMCanvas` accepts optional `store`; `createCanvasStore` is exposed for host-owned lifecycle.
- Consequences:
  - Host app can keep long-lived store instances.
  - Library remains stateless by default when no store is provided.

## D-003: Support AI SDK-Compatible Message Parts

- Date: 2026-02-06
- Status: Accepted
- Context: Host chat systems may deliver structured message parts (text/image/tool calls) instead of flat content.
- Decision: `Message` supports optional `content` and optional `parts`. Utility helpers extract text/images/tool calls for rendering.
- Consequences:
  - Better compatibility with modern chat payloads.
  - Rendering logic remains simple and schema-aware.

## D-004: Keep Transport/Streaming Responsibility in Host App

- Date: 2026-02-06
- Status: Accepted
- Context: Transport implementations vary widely by host app and backend.
- Decision: `lmcanvas` does not implement chat transport; host app bridges API calls and writes resulting messages into store.
- Consequences:
  - Clean package boundary.
  - Streaming support can be added in host app now, with optional library abstractions later if needed.

## D-005: Use Core + Optional Adapter Package Strategy

- Date: 2026-02-06
- Status: Accepted
- Context: The library should remain easy to adopt without requiring host apps to create new database tables or change existing chat architecture.
- Decision: Keep a minimal core package and add optional packages for integration and persistence concerns (`adapter-ai-sdk`, local persistence adapters, cloud adapter).
- Consequences:
  - Zero-config usage remains possible (memory only).
  - Advanced persistence and hosted sync can be added without bloating core APIs.
  - Monetization can focus on optional cloud features instead of locking core usage.
