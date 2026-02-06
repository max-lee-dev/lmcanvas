# Package Map

## Goal

Define a TanStack-style package layout: small free core, optional adapters, optional hosted cloud.

## Proposed Packages

- `lmcanvas`
  - Core graph model + store + renderer primitives.
  - No required backend.
  - Works in memory by default.
- `@lmcanvas/react`
  - React bindings/components (`LMCanvas`, providers, hooks).
  - Depends on `lmcanvas` core.
- `@lmcanvas/adapter-ai-sdk`
  - Convenience adapter for AI SDK style message/send APIs.
  - Optional. Host app can always write its own adapter.
- `@lmcanvas/persist-localstorage`
  - Lightweight persistence for view state only.
  - Stores positions/camera/selection, not full message history.
- `@lmcanvas/persist-indexeddb`
  - Larger local persistence option for heavy sessions.
  - Still optional.
- `@lmcanvas/cloud` (paid)
  - Hosted sync for view state and optional shared snapshots.
  - Cross-device/team features.

## Data Ownership

- Host app owns canonical chat messages and transport.
- `lmcanvas` owns derived graph/view state.
- Persisted local state should prioritize view metadata:
  - `x`, `y`, `width`, `height`
  - camera viewport
  - active/focused node
  - collapsed/pinned flags

## Integration Contract (v1)

- Required:
  - `getMessages(nodeRef): Message[]`
  - `sendMessage({ nodeRef, message }): Promise<void> | AsyncIterable<Message>`
- Optional:
  - `getStatus(nodeRef)`
  - `onError(error, nodeRef)`
  - `onStateChange(snapshot)`

`nodeRef` can be an internal node ID or host message ID mapping key.

## Zero-Config Defaults

- If no persistence adapter is provided:
  - Use in-memory store only.
  - Auto-layout when positions are missing.
- If host passes linear messages only:
  - Build a default single-chain graph.
  - Branch metadata is created internally when branching starts.

## Monetization Boundary

- Free:
  - core + react + local memory behavior.
- Pro:
  - cloud sync, share links, snapshots/history.
- Enterprise:
  - optional, contract-only features (SSO/compliance/SLA).
