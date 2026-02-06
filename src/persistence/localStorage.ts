import type { CanvasViewSnapshot, PersistenceAdapter } from "@/persistence/types";

type LocalStoragePersistenceOptions = {
  keyPrefix?: string;
  storage?: Storage;
};

const DEFAULT_PREFIX = "lmcanvas:view:";

const safeParse = (raw: string | null): CanvasViewSnapshot | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CanvasViewSnapshot;
    if (!parsed || parsed.version !== 1 || typeof parsed.nodes !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const resolveStorage = (explicitStorage?: Storage): Storage | null => {
  if (explicitStorage) return explicitStorage;
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const createLocalStoragePersistenceAdapter = (
  options?: LocalStoragePersistenceOptions,
): PersistenceAdapter => {
  const prefix = options?.keyPrefix ?? DEFAULT_PREFIX;

  return {
    load: (key) => {
      const storage = resolveStorage(options?.storage);
      if (!storage) return null;
      return safeParse(storage.getItem(`${prefix}${key}`));
    },
    save: (key, snapshot) => {
      const storage = resolveStorage(options?.storage);
      if (!storage) return;
      storage.setItem(`${prefix}${key}`, JSON.stringify(snapshot));
    },
    clear: (key) => {
      const storage = resolveStorage(options?.storage);
      if (!storage) return;
      storage.removeItem(`${prefix}${key}`);
    },
  };
};
