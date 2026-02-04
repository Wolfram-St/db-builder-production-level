// src/components/ShadowWorkspace.tsx
import { useEffect, useRef } from "react";
import { useAIChatStore } from "../store/aiChatStore";
import { useDBStore } from "../store/dbStore";
import { Check, X, GitCompare } from "lucide-react";
import { toast } from "sonner";

export default function ShadowWorkspace() {
  const { isSplitView, shadowWorkspace, applyShadowWorkspace, resetShadowWorkspace } =
    useAIChatStore();
  const mainWorkspace = useDBStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isSplitView || !shadowWorkspace) return null;

  const handleApply = () => {
    applyShadowWorkspace();
    toast.success("Changes applied to main workspace");
  };

  const handleDiscard = () => {
    resetShadowWorkspace();
    toast.info("Shadow workspace discarded");
  };

  // Render a simplified version of the workspace
  const renderShadowCanvas = () => {
    return (
      <div className="relative w-full h-full bg-[#09090b] overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Tables */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${shadowWorkspace.viewport.x}px, ${shadowWorkspace.viewport.y}px) scale(${shadowWorkspace.viewport.scale})`,
            transformOrigin: "0 0",
          }}
        >
          {shadowWorkspace.tables.map((table) => (
            <div
              key={table.id}
              className="absolute bg-zinc-800/80 border-2 border-violet-500/50 rounded-lg p-3 shadow-lg"
              style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
                minWidth: "200px",
              }}
            >
              <div className="font-semibold text-sm text-white mb-2 flex items-center gap-2">
                <GitCompare size={14} className="text-violet-400" />
                {table.name}
              </div>
              <div className="space-y-1">
                {table.columns.map((col) => (
                  <div
                    key={col.id}
                    className="text-xs text-zinc-300 flex items-center gap-2"
                  >
                    <span className="font-mono">{col.name}</span>
                    <span className="text-zinc-500 text-[10px]">{col.type}</span>
                    {col.isPrimary && (
                      <span className="text-amber-400 text-[10px]">PK</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Relations */}
          {shadowWorkspace.relations.map((rel) => {
            const fromTable = shadowWorkspace.tables.find(
              (t) => t.id === rel.from.tableId
            );
            const toTable = shadowWorkspace.tables.find((t) => t.id === rel.to.tableId);

            if (!fromTable || !toTable) return null;

            const fromX = fromTable.x + 100;
            const fromY = fromTable.y + 20;
            const toX = toTable.x + 100;
            const toY = toTable.y + 20;

            return (
              <svg
                key={rel.id}
                className="absolute inset-0 pointer-events-none"
                style={{ overflow: "visible" }}
              >
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="rgba(139, 92, 246, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            );
          })}
        </div>

        {/* Overlay label */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded-lg text-xs font-semibold text-violet-300 backdrop-blur-sm">
          Shadow Workspace (AI Preview)
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {renderShadowCanvas()}

      {/* Action Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
        <button
          onClick={handleApply}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-all"
        >
          <Check size={16} />
          Apply Changes
        </button>
        <button
          onClick={handleDiscard}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all"
        >
          <X size={16} />
          Discard
        </button>
      </div>
    </div>
  );
}
