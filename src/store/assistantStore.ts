import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AssistantState {
  isOpen: boolean;
  messages: Message[];
  isThinking: boolean;
  
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setThinking: (thinking: boolean) => void;
  clearMessages: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  isOpen: false,
  messages: [],
  isThinking: false,
  
  setOpen: (open: boolean) => set({ isOpen: open }),
  
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => 
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          timestamp: new Date(),
        },
      ],
    })),
  
  setThinking: (thinking: boolean) => set({ isThinking: thinking }),
  
  clearMessages: () => set({ messages: [] }),
}));
