// src/components/AIChatSidebar.tsx
import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Split,
} from "lucide-react";
import { useAIChatStore } from "../store/aiChatStore";
import { useDBStore } from "../store/dbStore";
import { AIService, AIAction } from "../lib/aiService";
import { toast } from "sonner";
import { getLayoutedElements } from "../../utils/layout";
import { importProject } from "../../lib/projectIO";
import { ProjectCompiler } from "../../lib/compiler";

export default function AIChatSidebar() {
  const [inputMessage, setInputMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isTyping,
    isChatOpen,
    isSplitView,
    addMessage,
    setIsTyping,
    toggleChat,
    toggleSplitView,
    clearMessages,
  } = useAIChatStore();

  const dbStore = useDBStore();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus();
    }
  }, [isChatOpen]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage && attachments.length === 0) return;

    // Convert attachments to base64
    const attachmentPromises = attachments.map(async (file) => {
      return new Promise<{ type: "image" | "file"; name: string; data: string }>(
        (resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              type: file.type.startsWith("image/") ? "image" : "file",
              name: file.name,
              data: e.target?.result as string,
            });
          };
          reader.readAsDataURL(file);
        }
      );
    });

    const processedAttachments = await Promise.all(attachmentPromises);

    // Add user message
    addMessage({
      role: "user",
      content: trimmedMessage || "[Attachment sent]",
      attachments: processedAttachments.map((att) => ({
        id: crypto.randomUUID(),
        type: att.type,
        name: att.name,
        url: att.data,
        data: att.data,
      })),
    });

    // Clear input
    setInputMessage("");
    setAttachments([]);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Prepare context for AI
      const context = {
        tables: dbStore.tables,
        relations: dbStore.relations,
        viewport: dbStore.viewport,
        selectedTables: dbStore.selected,
      };

      // Prepare messages for AI
      const aiMessages = messages
        .concat([
          {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: trimmedMessage,
            timestamp: Date.now(),
          },
        ])
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
          images: msg.attachments
            ?.filter((att) => att.type === "image")
            .map((att) => att.data || ""),
        }));

      // Call AI service
      const response = await AIService.chat(aiMessages, context);

      // Execute any actions returned by AI
      if (response.actions && response.actions.length > 0) {
        await executeAIActions(response.actions);
      }

      // Add AI response
      addMessage({
        role: "assistant",
        content: response.message,
      });
    } catch (error) {
      console.error("AI Chat Error:", error);
      addMessage({
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
      });
      const errorMessage = error instanceof Error ? error.message : "Failed to communicate with AI";
      toast.error(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const executeAIActions = async (actions: AIAction[]) => {
    for (const action of actions) {
      try {
        switch (action.type) {
          case "create_table": {
            // Create table with optional columns
            dbStore.addTable();
            const tables = dbStore.tables;
            const lastTable = tables[tables.length - 1];
            
            if (lastTable) {
              // Rename if name provided
              if (action.data?.name) {
                dbStore.renameTable(lastTable.id, action.data.name as string);
              }
              
              // Add columns if provided
              if (action.data?.columns && Array.isArray(action.data.columns)) {
                const columns = action.data.columns as Array<{
                  name: string;
                  type: string;
                  isPrimary?: boolean;
                  isUnique?: boolean;
                  isNullable?: boolean;
                }>;
                
                columns.forEach((col) => {
                  dbStore.addColumn(lastTable.id);
                  const currentTable = dbStore.tables.find((t) => t.id === lastTable.id);
                  const lastCol = currentTable?.columns[currentTable.columns.length - 1];
                  
                  if (lastCol) {
                    dbStore.updateColumn(lastTable.id, lastCol.id, "name", col.name);
                    dbStore.updateColumn(lastTable.id, lastCol.id, "type", col.type);
                    
                    if (col.isPrimary) {
                      dbStore.toggleColumnFlag(lastTable.id, lastCol.id, "isPrimary");
                    }
                    if (col.isUnique) {
                      dbStore.toggleColumnFlag(lastTable.id, lastCol.id, "isUnique");
                    }
                    if (col.isNullable !== undefined && !col.isNullable) {
                      dbStore.toggleColumnFlag(lastTable.id, lastCol.id, "isNullable");
                    }
                  }
                });
              }
              
              // Set position if provided
              if (action.data?.x !== undefined && action.data?.y !== undefined) {
                dbStore.updateTablePosition(
                  lastTable.id,
                  action.data.x as number,
                  action.data.y as number
                );
              }
            }
            
            toast.success(`Table "${action.data?.name || 'new_table'}" created on canvas`);
            break;
          }
          
          case "update_table": {
            const tableId = action.data?.tableId as string;
            if (tableId) {
              if (action.data?.name) {
                dbStore.renameTable(tableId, action.data.name as string);
              }
              if (action.data?.x !== undefined && action.data?.y !== undefined) {
                dbStore.updateTablePosition(
                  tableId,
                  action.data.x as number,
                  action.data.y as number
                );
              }
              toast.success("Table updated on canvas");
            }
            break;
          }
          
          case "delete_table": {
            const tableId = action.data?.tableId as string;
            if (tableId) {
              dbStore.removeTable(tableId);
              toast.success("Table removed from canvas");
            } else if (action.data?.tableName) {
              // Find table by name
              const table = dbStore.tables.find(
                (t) => t.name === action.data?.tableName
              );
              if (table) {
                dbStore.removeTable(table.id);
                toast.success(`Table "${action.data.tableName}" removed from canvas`);
              }
            }
            break;
          }
          
          case "create_relation": {
            const { fromTableId, fromColumnId, toTableId, toColumnId } = action.data as {
              fromTableId?: string;
              fromColumnId?: string;
              toTableId?: string;
              toColumnId?: string;
            };
            
            if (fromTableId && fromColumnId && toTableId && toColumnId) {
              dbStore.startRelation(fromTableId, fromColumnId);
              dbStore.commitRelation(toTableId, toColumnId);
              toast.success("Relationship created on canvas");
            }
            break;
          }
          
          case "update_relation": {
            const relationId = action.data?.relationId as string;
            const cardinality = action.data?.cardinality as "one-to-one" | "one-to-many" | "many-to-many";
            
            if (relationId && cardinality) {
              dbStore.updateRelationCardinality(relationId, cardinality);
              toast.success("Relationship updated");
            }
            break;
          }
          
          case "delete_relation": {
            const relationId = action.data?.relationId as string;
            if (relationId) {
              dbStore.deleteRelation(relationId);
              toast.success("Relationship removed from canvas");
            }
            break;
          }
          
          case "layout": {
            // Apply auto-layout to organize tables
            const { nodes: layoutedNodes } = await getLayoutedElements(
              dbStore.tables,
              dbStore.relations
            );
            layoutedNodes.forEach((node: { id: string; position: { x: number; y: number } }) => {
              dbStore.updateTablePosition(node.id, node.position.x, node.position.y);
            });
            toast.success("Tables organized on canvas");
            break;
          }
          
          case "import_schema": {
            // Import a complete schema (tables + relations)
            if (action.data?.schema) {
              const schema = action.data.schema as { tables?: unknown[]; relations?: unknown[] };
              
              // Use the compiler to validate and fix the schema
              const result = ProjectCompiler.compile(schema);
              
              if (result.patchedData.tables && result.patchedData.tables.length > 0) {
                // Merge with existing data
                const existingTableIds = new Set(dbStore.tables.map((t) => t.id));
                const newUniqueTables = result.patchedData.tables.filter(
                  (t: { id: string }) => !existingTableIds.has(t.id)
                );
                
                const existingRelIds = new Set(dbStore.relations.map((r) => r.id));
                const newUniqueRelations = (result.patchedData.relations || []).filter(
                  (r: { id: string }) => !existingRelIds.has(r.id)
                );
                
                // Import via file mechanism
                const mergedProject = {
                  viewport: dbStore.viewport,
                  tables: [...dbStore.tables, ...newUniqueTables],
                  relations: [...dbStore.relations, ...newUniqueRelations],
                };
                
                const file = new File(
                  [JSON.stringify(mergedProject)],
                  "ai-generated-schema.json",
                  { type: "application/json" }
                );
                
                await importProject(file);
                
                // Apply layout if needed
                if (result.requiresLayout && newUniqueTables.length > 0) {
                  const { nodes: layoutedNodes } = await getLayoutedElements(
                    dbStore.tables,
                    dbStore.relations
                  );
                  layoutedNodes.forEach((node: { id: string; position: { x: number; y: number } }) => {
                    dbStore.updateTablePosition(node.id, node.position.x, node.position.y);
                  });
                }
                
                toast.success(`${newUniqueTables.length} tables imported to canvas`);
              } else {
                toast.error("Invalid schema data");
              }
            }
            break;
          }
          
          default:
            console.log("Unknown action:", action.type);
            toast.info(`Action "${action.type}" not yet implemented`);
        }
      } catch (error) {
        console.error(`Error executing action ${action.type}:`, error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to execute ${action.type}: ${errorMsg}`);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-lg shadow-violet-500/20">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
            <p className="text-xs text-zinc-500">Ask me anything about your database</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSplitView}
            title={isSplitView ? "Close split view" : "Open split view"}
            className={`p-2 rounded-lg transition-all ${
              isSplitView
                ? "bg-violet-500/20 text-violet-300"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Split size={16} />
          </button>
          <button
            onClick={clearMessages}
            title="Clear chat"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={toggleChat}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
              <Bot size={32} className="text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">
              Welcome to AI Assistant
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              I can help you design, modify, and understand your database schema.
              Try asking me to:
            </p>
            <ul className="text-xs text-zinc-400 space-y-2 text-left">
              <li>• Create a table for users</li>
              <li>• Add a relationship between tables</li>
              <li>• Organize the layout</li>
              <li>• Generate SQL from a description</li>
            </ul>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                message.role === "user"
                  ? "bg-violet-500"
                  : "bg-zinc-800"
              }`}
            >
              {message.role === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-violet-400" />
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 max-w-[80%]">
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-violet-500/20 border border-violet-500/30 text-white"
                    : "bg-zinc-800/80 border border-white/5 text-zinc-100"
                }`}
              >
                <p className="text-xs whitespace-pre-wrap">{message.content}</p>
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2 bg-black/20 rounded border border-white/5"
                      >
                        {att.type === "image" ? (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="max-w-full rounded"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-xs">
                            <Paperclip size={12} />
                            <span>{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mt-1 ml-1">
                  <button
                    onClick={() => handleCopyMessage(message.id, message.content)}
                    className="text-zinc-500 hover:text-white transition-colors"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <Check size={12} />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800">
              <Bot size={16} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <div className="p-3 rounded-lg bg-zinc-800/80 border border-white/5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                  <span
                    className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-zinc-900/50">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2 py-1 bg-zinc-800 rounded text-xs border border-white/5"
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon size={12} />
                ) : (
                  <Paperclip size={12} />
                )}
                <span className="max-w-[100px] truncate">{file.name}</span>
                <button
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-zinc-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Attach file"
          >
            <Paperclip size={18} />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.json,.sql"
              className="hidden"
              onChange={handleFileSelect}
            />
          </button>

          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none max-h-32"
            style={{
              minHeight: "40px",
              height: "auto",
            }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() && attachments.length === 0}
            className="p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-all disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="text-[10px] text-zinc-600 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
