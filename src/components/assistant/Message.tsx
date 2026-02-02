import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import { Copy, Check } from 'lucide-react';

export interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export default function Message({ role, content, timestamp }: MessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Parse content for code blocks
  const parseContent = (text: string) => {
    const parts: ReactElement[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${blockIndex}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const language = match[1] || 'text';
      const code = match[2].trim();
      const codeId = `code-${blockIndex}`;

      // Add code block
      parts.push(
        <div key={`code-${blockIndex}`} className="relative my-3 rounded-lg bg-[#121212] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5">
            <span className="text-[10px] uppercase text-zinc-500 font-bold">{language}</span>
            <button
              onClick={() => copyCode(code, codeId)}
              className="text-zinc-500 hover:text-white transition-colors p-1"
              title="Copy code"
            >
              {copiedCode === codeId ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <pre className="p-3 text-xs overflow-auto scrollbar-thin scrollbar-thumb-zinc-700">
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
      blockIndex++;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${blockIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : <span>{text}</span>;
  };

  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-violet-600 text-white'
            : isSystem
            ? 'bg-zinc-900/50 text-zinc-300 border border-white/10'
            : 'bg-zinc-800/50 text-zinc-100'
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {parseContent(content)}
        </div>
        {timestamp && (
          <div className={`text-[10px] mt-2 ${isUser ? 'text-violet-200' : 'text-zinc-500'}`}>
            {timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}
