# Conventions

## Language and Tooling

- TypeScript first, `strict` mode enabled.
- Build with `tsup` into ESM/CJS + declaration files.
- Use path alias `@/*` for internal imports from `src/*`.

## API Design

- Keep top-level exports explicit via `src/index.ts`.
- Prefer additive changes; avoid breaking exported types/functions without clear versioning intent.
- Keep core primitives small (`LMCanvas`, `createCanvasStore`, typed message helpers).

## State and Data

- Graph state lives in a `CanvasStore` (Zustand vanilla store).
- Prefer pure store mutations and deterministic updates.
- Use ISO timestamps (`new Date().toISOString()`) for created metadata.

## React and Rendering

- `LMCanvas` should accept externally managed store instances.
- Do not couple components to transport or backend concerns.
- Keep node rendering resilient to partial/optional message fields.

## Message Semantics

- `Message.content` is optional.
- `Message.parts` is optional and may include mixed part types.
- Consumers should use helper functions to extract display text/images/tool calls.

## Dependency Policy

- Do not add dependencies without explicit approval.
- Prefer existing stack: React, ReactFlow, Zustand.

## Documentation Policy

- Update `docs/architecture.md` when boundaries or flows change.
- Update `docs/structure.md` when directories/modules are reorganized.
- Add an entry in `docs/decisions.md` for architecture-significant decisions.
