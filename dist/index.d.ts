import * as react_jsx_runtime from 'react/jsx-runtime';
import { StoreApi } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange } from 'reactflow';

type MessageRole = "system" | "user" | "assistant" | "tool";
type MessagePartText = {
    type: "text";
    text: string;
};
type MessagePartImage = {
    type: "image";
    image: string;
    mimeType?: string;
    alt?: string;
};
type MessagePartToolCall = {
    type: "tool-call";
    toolName: string;
    args?: unknown;
    id?: string;
};
type MessagePartToolResult = {
    type: "tool-result";
    toolName: string;
    result?: unknown;
    id?: string;
};
type MessagePart = MessagePartText | MessagePartImage | MessagePartToolCall | MessagePartToolResult;
type Message = {
    id?: string;
    role: MessageRole;
    content?: string;
    parts?: MessagePart[];
    createdAt?: string;
};

type NodeStatus = "idle" | "loading" | "completed" | "error";
type CanvasNodeData = {
    status?: NodeStatus;
    messages?: Message[];
    parentIds?: string[];
    childIds?: string[];
    width?: number;
    height?: number;
    createdAt?: string;
};

type CanvasCamera = {
    x: number;
    y: number;
    zoom: number;
};
type CanvasNodeViewState = {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
};
type CanvasViewSnapshot = {
    version: 1;
    savedAt: string;
    activeNodeId?: string | null;
    camera?: CanvasCamera | null;
    nodes: Record<string, CanvasNodeViewState>;
};
type PersistenceAdapter = {
    load: (key: string) => CanvasViewSnapshot | null | Promise<CanvasViewSnapshot | null>;
    save: (key: string, snapshot: CanvasViewSnapshot) => void | Promise<void>;
    clear?: (key: string) => void | Promise<void>;
};

type CanvasState = {
    nodesById: Record<string, Node<CanvasNodeData>>;
    edges: Edge[];
    activeNodeId: string | null;
    camera: CanvasCamera | null;
    getNode: (id: string) => Node<CanvasNodeData> | undefined;
    setNodes: (nodes: Node<CanvasNodeData>[]) => void;
    setEdges: (edges: Edge[]) => void;
    setActiveNodeId: (nodeId: string | null) => void;
    setCamera: (camera: CanvasCamera | null) => void;
    upsertNode: (node: Node<CanvasNodeData>) => void;
    patchNodeData: (id: string, patch: Partial<CanvasNodeData>) => void;
    setNodeMessages: (id: string, messages: Message[]) => void;
    createRootNode: (options?: {
        id?: string;
        position?: {
            x: number;
            y: number;
        };
        messages?: Message[];
    }) => string;
    branchNode: (parentId: string, options?: {
        messages?: Message[];
        position?: {
            x: number;
            y: number;
        };
    }) => string | null;
    exportViewSnapshot: (options?: {
        activeNodeId?: string | null;
        camera?: CanvasCamera | null;
    }) => CanvasViewSnapshot;
    importViewSnapshot: (snapshot: CanvasViewSnapshot, options?: {
        applyCamera?: boolean;
        applyActiveNode?: boolean;
    }) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
};
type CanvasStore = StoreApi<CanvasState>;
declare const createCanvasStore: (initial?: {
    nodes?: Node<CanvasNodeData>[];
    edges?: Edge[];
}) => CanvasStore;

type LMCanvasProps = {
    className?: string;
    store?: CanvasStore;
    focusNodeId?: string | null;
    fitView?: boolean;
};
declare const LMCanvas: ({ className, store, focusNodeId, fitView }: LMCanvasProps) => react_jsx_runtime.JSX.Element;

declare const useCanvasStore: <T>(selector: (state: CanvasState) => T, equalityFn?: (a: T, b: T) => boolean) => T;
declare const useCanvasStoreApi: () => CanvasStore;

type NodeRef = string;
type SendMessageInput = {
    nodeRef: NodeRef;
    message: Message;
    parentNodeRef?: NodeRef;
    metadata?: Record<string, unknown>;
};
type ChatStatus = "idle" | "loading" | "completed" | "error";
type MessageAdapter = {
    getMessages: (nodeRef: NodeRef) => Message[];
    sendMessage: (input: SendMessageInput) => Promise<void> | AsyncIterable<Message> | void;
    getStatus?: (nodeRef: NodeRef) => ChatStatus | undefined;
    onError?: (error: unknown, nodeRef: NodeRef) => void;
};

type RunMessageInteractionInput = SendMessageInput & {
    store: CanvasStore;
    adapter: MessageAdapter;
    optimistic?: boolean;
    syncOnComplete?: boolean;
};
type RunMessageInteractionResult = {
    status: ChatStatus;
    messages: Message[];
};
declare const runMessageInteraction: (input: RunMessageInteractionInput) => Promise<RunMessageInteractionResult>;

type LocalStoragePersistenceOptions = {
    keyPrefix?: string;
    storage?: Storage;
};
declare const createLocalStoragePersistenceAdapter: (options?: LocalStoragePersistenceOptions) => PersistenceAdapter;

type BuildLinearGraphOptions = {
    startX?: number;
    startY?: number;
    verticalGap?: number;
    nodeWidth?: number;
    nodeHeight?: number;
    idPrefix?: string;
};
type LinearGraph = {
    nodes: Node<CanvasNodeData>[];
    edges: Edge[];
    rootNodeId: string;
    lastNodeId: string;
};
declare const buildLinearGraphFromMessages: (messages: Message[], options?: BuildLinearGraphOptions) => LinearGraph;

declare function getMessageText(message: Message | null | undefined): string;
declare function getMessageImages(message: Message | null | undefined): MessagePartImage[];
declare function getMessageToolCalls(message: Message | null | undefined): MessagePartToolCall[];

export { type BuildLinearGraphOptions, type CanvasCamera, type CanvasNodeData, type CanvasNodeViewState, type CanvasState, type CanvasStore, type CanvasViewSnapshot, type ChatStatus, LMCanvas, type LMCanvasProps, type LinearGraph, type Message, type MessageAdapter, type MessagePart, type MessageRole, type NodeRef, type NodeStatus, type PersistenceAdapter, type RunMessageInteractionInput, type RunMessageInteractionResult, type SendMessageInput, buildLinearGraphFromMessages, createCanvasStore, createLocalStoragePersistenceAdapter, getMessageImages, getMessageText, getMessageToolCalls, runMessageInteraction, useCanvasStore, useCanvasStoreApi };
