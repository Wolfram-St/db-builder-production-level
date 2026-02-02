import { useEffect, useRef, useState } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useAssistantStore } from '../../store/assistantStore';
import { useDBStore } from '../../store/dbStore';
import type { DBTable, Relation } from '../../store/dbStore';
import Message from './Message';

const QUICK_PROMPTS = [
  'Generate a user authentication schema',
  'Explain this relationship',
  'Optimize my indexes',
  'Export as SQL',
];

// Mock AI response function (replace with actual AI integration later)
const getMockResponse = (userMessage: string, tables: DBTable[], relations: Relation[]): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your AI assistant for database design. I can help you generate tables, explain relationships, optimize schemas, and much more. What would you like to work on today?";
  }
  
  if (lowerMessage.includes('table') && tables.length > 0) {
    return `I can see you have ${tables.length} table${tables.length !== 1 ? 's' : ''} in your schema: ${tables.map((t) => t.name).join(', ')}. What would you like to know about them?`;
  }
  
  if (lowerMessage.includes('relationship') || lowerMessage.includes('relation')) {
    if (relations.length > 0) {
      return `Your schema has ${relations.length} relationship${relations.length !== 1 ? 's' : ''}. I can help you understand or optimize them. Would you like me to explain any specific relationship?`;
    }
    return "You don't have any relationships defined yet. Would you like me to help you create some based on your tables?";
  }
  
  if (lowerMessage.includes('generate') || lowerMessage.includes('create')) {
    return "I can help you generate various database schemas! Some popular options include:\n\n```sql\n-- User authentication schema\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  password_hash VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n```\n\nWould you like me to create a specific schema for you?";
  }
  
  if (lowerMessage.includes('optimize') || lowerMessage.includes('index')) {
    return "To optimize your database performance, consider:\n\n1. Add indexes on frequently queried columns\n2. Use foreign key constraints for data integrity\n3. Normalize your schema to reduce redundancy\n4. Consider denormalization for read-heavy workloads\n\nWould you like me to analyze your current schema and suggest specific optimizations?";
  }
  
  if (lowerMessage.includes('sql') || lowerMessage.includes('export')) {
    return "You can export your schema as SQL by clicking the 'Build SQL' button in the dock. I can also help you understand the generated SQL or suggest improvements!";
  }
  
  return "That's an interesting question! I can help you with:\n- Generating database schemas\n- Explaining table relationships\n- Optimizing queries and indexes\n- Best practices for database design\n\nCould you provide more details about what you'd like to accomplish?";
};

export default function AssistantPanel() {
  const isOpen = useAssistantStore((s) => s.isOpen);
  const setOpen = useAssistantStore((s) => s.setOpen);
  const messages = useAssistantStore((s) => s.messages);
  const addMessage = useAssistantStore((s) => s.addMessage);
  const isThinking = useAssistantStore((s) => s.isThinking);
  const setThinking = useAssistantStore((s) => s.setThinking);
  
  const tables = useDBStore((s) => s.tables);
  const relations = useDBStore((s) => s.relations);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage({
        role: 'system',
        content: 'Welcome to AI Assistant! 👋\n\nI can help you:\n• Generate database schemas\n• Explain table relationships\n• Optimize your design\n• Answer questions about SQL\n\nAsk me anything about your database schema!',
      });
    }
  }, [isOpen, messages.length, addMessage]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    // Show thinking state
    setThinking(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getMockResponse(userMessage, tables, relations);
      addMessage({
        role: 'assistant',
        content: response,
      });
      setThinking(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <aside
        className="absolute right-0 top-0 h-full w-[400px] bg-[#09090b] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
              <Sparkles size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-zinc-700">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          
          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-zinc-800/50 text-zinc-100">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-violet-400" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && !isThinking && (
          <div className="px-4 pb-3">
            <div className="text-xs text-zinc-500 mb-2 font-medium">Quick Actions</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-3 py-1.5 bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-white transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your database schema..."
              rows={1}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-violet-500/20 resize-none transition-all scrollbar-thin scrollbar-thumb-zinc-700"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
                height: 'auto',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-lg shadow-violet-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-[10px] text-zinc-600 mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </aside>
    </div>
  );
}
