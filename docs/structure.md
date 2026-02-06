# Structure

## Repository Layout

- `README.md`
  - Public package overview and usage.
- `docs/`
  - Project intent, architecture, conventions, and decisions.
  - `package-map.md` defines package layering and adapter boundaries.
  - `integration.md` provides quick-start integration patterns.
- `src/`
  - Source code for the `lmcanvas` library.
- `package.json`
  - Package metadata, scripts, dependencies, exports.
- `tsconfig.json`
  - TypeScript compiler settings and alias config.
- `tsup.config.ts`
  - Build configuration for ESM/CJS + type declarations.

## Source Layout

- `src/index.ts`
  - Public API exports only.
- `src/components/`
  - React components (`LMCanvas`, `MessageNode`).
- `src/store/`
  - Canvas state store and React context bindings.
- `src/types/`
  - Shared TypeScript domain types (`message`, `node`).
- `src/utils/`
  - Pure helper functions (message-part extraction).
- `src/constants.ts`
  - Shared layout and handle constants.

## Ownership Rules

- Public API changes should be made through `src/index.ts`.
- New domain types belong in `src/types/`.
- UI rendering logic belongs in `src/components/`.
- Stateful graph mutations belong in `src/store/canvasStore.ts`.
- Cross-cutting pure utilities belong in `src/utils/`.
