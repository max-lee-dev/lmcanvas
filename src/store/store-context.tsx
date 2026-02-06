import { createContext, useContext } from "react";
import { useStore } from "zustand";
import type { CanvasState, CanvasStore } from "@/store/canvasStore";

const CanvasStoreContext = createContext<CanvasStore | null>(null);

export const CanvasStoreProvider = CanvasStoreContext.Provider;

export const useCanvasStore = <T,>(
  selector: (state: CanvasState) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T => {
  const store = useContext(CanvasStoreContext);
  if (!store) {
    throw new Error("useCanvasStore must be used within a CanvasStoreProvider");
  }
  return useStore(store, selector, equalityFn);
};

export const useCanvasStoreApi = (): CanvasStore => {
  const store = useContext(CanvasStoreContext);
  if (!store) {
    throw new Error("useCanvasStoreApi must be used within a CanvasStoreProvider");
  }
  return store;
};
