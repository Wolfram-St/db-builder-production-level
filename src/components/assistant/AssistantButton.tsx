import { MessageSquare, Sparkles } from 'lucide-react';
import { useAssistantStore } from '../../store/assistantStore';

export default function AssistantButton() {
  const isOpen = useAssistantStore((s) => s.isOpen);
  const toggleOpen = useAssistantStore((s) => s.toggleOpen);
  const isThinking = useAssistantStore((s) => s.isThinking);
  const messages = useAssistantStore((s) => s.messages);

  // Count unread messages (simple implementation - could be enhanced)
  const hasNewMessages = messages.length > 0 && !isOpen;

  return (
    <button
      onClick={toggleOpen}
      className={`
        group fixed bottom-8 right-8 z-40
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-violet-600 hover:bg-violet-500
        text-white
        shadow-2xl shadow-violet-900/30
        transition-all duration-300
        active:scale-95
        ${isThinking ? 'animate-pulse' : ''}
      `}
      title="AI Assistant (Ctrl/Cmd+K)"
    >
      {/* Badge for new messages */}
      {hasNewMessages && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#09090b] flex items-center justify-center text-xs font-bold animate-pulse">
          {messages.filter(m => m.role === 'assistant').length}
        </span>
      )}

      {/* Icon */}
      <div className="relative">
        {isThinking ? (
          <Sparkles size={24} className="animate-spin" />
        ) : (
          <MessageSquare size={24} />
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full mb-2 right-0 px-3 py-1.5 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        AI Assistant <span className="opacity-50">(Ctrl+K)</span>
      </div>
    </button>
  );
}
