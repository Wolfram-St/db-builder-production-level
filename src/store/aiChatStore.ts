// src/store/aiChatStore.ts
import { create } from "zustand";
import { DBTable, Relation } from "./dbStore";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  type: "image" | "file";
  name: string;
  url: string;
  data?: string; // base64 data for images
}

export interface ShadowWorkspace {
  tables: DBTable[];
  relations: Relation[];
  viewport: {
    x: number;
    y: number;
    scale: number;
  };
}

interface AIChatState {
  // Chat state
  messages: ChatMessage[];
  isTyping: boolean;
  isChatOpen: boolean;
  
  // Workspace state
  isSplitView: boolean;
  shadowWorkspace: ShadowWorkspace | null;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;
  setIsTyping: (typing: boolean) => void;
  toggleChat: () => void;
  setIsChatOpen: (open: boolean) => void;
  
  // Workspace actions
  toggleSplitView: () => void;
  updateShadowWorkspace: (workspace: Partial<ShadowWorkspace>) => void;
  applyShadowWorkspace: () => void;
  resetShadowWorkspace: () => void;
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  // Initial state
  messages: [],
  isTyping: false,
  isChatOpen: false,
  isSplitView: false,
  shadowWorkspace: null,

  // Chat actions
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => set({ messages: [] }),

  setIsTyping: (typing) => set({ isTyping: typing }),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  setIsChatOpen: (open) => set({ isChatOpen: open }),

  // Workspace actions
  toggleSplitView: () => {
    const state = get();
    if (!state.isSplitView && !state.shadowWorkspace) {
      // Initialize shadow workspace from main workspace
      const { useDBStore } = require("./dbStore");
      const mainStore = useDBStore.getState();
      
      set({
        isSplitView: true,
        shadowWorkspace: {
          tables: JSON.parse(JSON.stringify(mainStore.tables)),
          relations: JSON.parse(JSON.stringify(mainStore.relations)),
          viewport: { ...mainStore.viewport },
        },
      });
    } else {
      set((state) => ({ isSplitView: !state.isSplitView }));
    }
  },

  updateShadowWorkspace: (workspace) => {
    set((state) => ({
      shadowWorkspace: state.shadowWorkspace
        ? { ...state.shadowWorkspace, ...workspace }
        : null,
    }));
  },

  applyShadowWorkspace: () => {
    const state = get();
    if (state.shadowWorkspace) {
      const { useDBStore } = require("./dbStore");
      const mainStore = useDBStore.getState();
      
      mainStore.loadState({
        tables: state.shadowWorkspace.tables,
        relations: state.shadowWorkspace.relations,
        viewport: state.shadowWorkspace.viewport,
      });
      
      set({ shadowWorkspace: null, isSplitView: false });
    }
  },

  resetShadowWorkspace: () => {
    set({ shadowWorkspace: null, isSplitView: false });
  },
}));
