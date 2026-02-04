import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "../index.css";
import { Toaster, toast } from "sonner";

// Icons
import {
  Plus,
  Trash2,
  Database,
  Camera,
  Save,
  FolderOpen,
  Undo2,
  Redo2,
  Share2,
  Sparkles,
  Wand2,
  Loader2,
  Bot,
  User,
  LogOut,
  Settings,
  FolderKanban
} from "lucide-react";

// Components
import Canvas from "./canvas/Canvas";
import MiniMap from "./Minimap";
import SQLDrawer from "./SQLDrawer";
import SnipOverlay from "./SnipOverlay";
import GenerateModal from "./GenerateModel";
import { NotFound } from "./NotFound"; // Import your 404 component
import AssistantPanel from "./assistant/AssistantPanel";
import AssistantButton from "./assistant/AssistantButton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

// Store & Libs
import { useDBStore } from "../store/dbStore";
import { useAssistantStore } from "../store/assistantStore";
import { useAIChatStore } from "../store/aiChatStore";
import { useAuthStore } from "../store/authStore";
import { saveProject as saveLocal, importProject } from "../lib/projectIO";
import { getLayoutedElements } from '../utils/layout';
import { ProjectCompiler } from "../lib/compiler";
import { SaveStatus } from "./SavedStatusBar";
import { useProjectSave } from "@/hooks/useProjectSave";

function WorkStation() {
  const { projectId } = useParams(); // Get Project ID from URL
  const navigate = useNavigate();
  
  // --- STORE STATE ---
  const addTable = useDBStore((s) => s.addTable);
  const viewport = useDBStore((s) => s.viewport);
  const deleteSelected = useDBStore((s) => s.deleteSelected);
  const selected = useDBStore((s) => s.selected);

  // Relations
  const relations = useDBStore((s) => s.relations);
  const selectedRelationId = useDBStore((s) => s.selectedRelationId);
  const selectedRelation = relations.find((r) => r.id === selectedRelationId);
  const updateRelationCardinality = useDBStore((s) => s.updateRelationCardinality);
  const deleteRelation = useDBStore((s) => s.deleteRelation);

  // Actions
  const undo = useDBStore((s) => s.undo);
  const redo = useDBStore((s) => s.redo);
  const setScale = useDBStore((s) => s.setScale);

  // --- AI CHAT STATE ---
  const { isChatOpen, isSplitView, toggleChat } = useAIChatStore();

  // --- AUTH STATE ---
  const { user, signOut } = useAuthStore();

  // --- LOCAL STATE ---
  const [snipOpen, setSnipOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  // --- SIMPLIFIED STATE (No cloud/auth) ---
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isSaving, setIsSaving] = useState(false);
  
  // Hook for auto-saving (now local only)
  useProjectSave(projectId || '');

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate('/login');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  }; 

  /* -------------------------------------------------------
      1. INITIALIZATION (No cloud loading)
     -------------------------------------------------------- */
useEffect(() => {
  // Always valid in local mode
  console.log("Workstation initialized in local mode");
}, [projectId]);

useEffect(() => {
    const element = mainRef.current;
    if (!element) return;

    const onNativeWheel = (e: WheelEvent) => {
      // Allow scrolling in sidebars/modals
      if ((e.target as HTMLElement).closest('.overflow-auto')) return;

      e.preventDefault(); // Stop browser page scroll

      const store = useDBStore.getState();
      const factor = 1 + (e.deltaY > 0 ? -1 : 1) * 0.05;
      const newScale = Math.min(4, Math.max(0.2, store.viewport.scale * factor));
      
      store.setScale(newScale, e.clientX, e.clientY);
    };

    // Attach with { passive: false }
    element.addEventListener('wheel', onNativeWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  /* -------------------------------------------------------
      2. SAVE HANDLER (Local Only)
     -------------------------------------------------------- */
  const handleSave = async () => {
    // LOCAL SAVE only
    saveLocal();
    toast.success("Project downloaded");
  };

  /* -------------------------------------------------------
      TIDY / AUTO-LAYOUT LOGIC
     -------------------------------------------------------- */
  const handleTidyUp = async () => {
    const store = useDBStore.getState();
    const { nodes: layoutedNodes } = await getLayoutedElements(
      store.tables,
      store.relations
    );
    layoutedNodes.forEach((node: any) => {
      store.updateTablePosition(node.id, node.position.x, node.position.y);
    });
    toast.success("Layout tidied up!");
  };

  /* -------------------------------------------------------
      KEYBOARD HANDLERS
     -------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      const store = useDBStore.getState();
      const assistantStore = useAssistantStore.getState();

      // --- CTRL/CMD + K: TOGGLE AI ASSISTANT ---
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        assistantStore.toggleOpen();
        return;
      }

      // --- ESCAPE HANDLER ---
      if (e.key === "Escape") {
        e.preventDefault();
        
        // 0. If assistant is open, close it first
        if (assistantStore.isOpen) {
            assistantStore.setOpen(false);
            return;
        }
        
        // 1. If drawing a line, cancel it
        if (store.activeLink) {
            store.cancelRelation();
            toast.info("Connection cancelled");
            return;
        }

        // 2. If a relation is selected (Inspector open), deselect it
        if (store.selectedRelationId) {
            store.selectRelation(null);
            return;
        }

        // 3. If tables are selected, clear selection
        if (store.selected.length > 0) {
            store.clearSelection();
            return;
        }
        
        // 4. Close any open UI panels (like Generate Modal)
        if (generateOpen) setGenerateOpen(false);
        if (snipOpen) setSnipOpen(false);
      }

      // --- EXISTING SHORTCUTS ---
      if (e.key === "Delete" || e.key === "Backspace") { 
        // Only delete if not editing text
        store.deleteSelected();
        if (store.selectedRelationId) {
           store.deleteRelation(store.selectedRelationId);
        }
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
           e.preventDefault(); 
           store.undo();
        }
        if (e.key === "y") {
           e.preventDefault(); 
           store.redo();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, undo, redo, generateOpen, snipOpen]);

  /* -------------------------------------------------------
      PAN & ZOOM
     -------------------------------------------------------- */
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

    const isMiddle = e.button === 1;
    const onTable = target.closest(".table-node") !== null;
    if (!isMiddle && onTable) return;

    const store = useDBStore.getState();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = store.viewport.x;
    const initialY = store.viewport.y;

    const move = (ev: PointerEvent) => {
      store.setViewport(initialX + (ev.clientX - startX), initialY + (ev.clientY - startY));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  /* -------------------------------------------------------
      SMART IMPORTER (With Auto-Merging)
     -------------------------------------------------------- */
  const handleSafeImport = async (file: File) => {
    try {
      const text = await file.text();
      let rawData;
      try {
        rawData = JSON.parse(text);
      } catch {
        toast.error("File is not valid JSON.");
        return;
      }

      // --- VALIDATION ---
      if (!rawData.tables || !Array.isArray(rawData.tables)) {
        toast.error("Invalid Schema: No tables found.");
        return;
      }

      // 1. Compile/Fix the NEW data
      const result = ProjectCompiler.compile(rawData);

      if (result.patchedData.tables.length === 0) {
        toast.error("AI could not find any tables.");
        return;
      }

      // 2. GET CURRENT STATE
      const store = useDBStore.getState();
      const existingTables = store.tables || [];
      const existingRelations = store.relations || [];

      // 3. MERGE TABLES
      const existingTableIds = new Set(existingTables.map((t: any) => t.id));
      const newUniqueTables = result.patchedData.tables.filter(
        (t: any) => !existingTableIds.has(t.id)
      );

      // 4. MERGE RELATIONS
      const existingRelIds = new Set(existingRelations.map((r: any) => r.id));
      const newUniqueRelations = result.patchedData.relations.filter(
        (r: any) => !existingRelIds.has(r.id)
      );

      // 5. CREATE MERGED PROJECT
      const mergedProject = {
        viewport: store.viewport,
        tables: [...existingTables, ...newUniqueTables],
        relations: [...existingRelations, ...newUniqueRelations],
      };

      // 6. IMPORT
      const safeFile = new File(
        [JSON.stringify(mergedProject)],
        file.name,
        { type: "application/json" }
      );

      await importProject(safeFile);

      if (newUniqueTables.length > 0 && result.requiresLayout) {
        await handleTidyUp();
      }

      toast.success(`Merged ${newUniqueTables.length} new tables!`);

    } catch (err) {
      console.error("Import failed:", err);
      toast.error("Failed to load project.");
    }
  };
  
  const handleAIResult = async (jsonData: any) => {
    const file = new File(
      [JSON.stringify(jsonData)],
      "generated-schema.json",
      { type: "application/json" }
    );
    await handleSafeImport(file);
  };

  // --- RENDER WORKSTATION (No loading/validation needed) ---
  return (
    <div className="w-full h-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans selection:bg-violet-500/30 relative flex flex-col bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">

      {/* Main Workspace Container - Adjusted for split view */}
      <div className={`absolute inset-0 ${isChatOpen ? 'right-96' : 'right-0'} transition-all duration-300`}>
        {/* Split View Layout */}
        {isSplitView ? (
          <div className="w-full h-full grid grid-cols-2 gap-1">
            {/* Main Workspace (Left) */}
            <main
              ref={mainRef}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing border-r border-white/10"
              onPointerDown={handlePointerDown}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleSafeImport(file);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
              <Canvas />
              {/* Label for main workspace */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-zinc-900/80 border border-white/10 rounded-lg text-xs font-semibold text-white backdrop-blur-sm">
                Main Workspace
              </div>
            </main>

            {/* Shadow Workspace (Right) */}
            <div className="relative overflow-hidden">
              <ShadowWorkspace />
            </div>
          </div>
        ) : (
          /* Normal Single Workspace View */
          <main
            ref={mainRef}
            className="absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleSafeImport(file);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <Canvas />
          </main>
        )}
      </div>

      {/* Top Left: Menu */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl select-none pointer-events-auto">
          <div className="h-6 w-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Database size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">{projectName}</span>
        </div>
        <SaveStatus />
        

        <div className="flex items-center gap-1 p-1 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl pointer-events-auto">
          <ControlButton 
            onClick={handleSave} 
            icon={<Save size={16}/>} 
            tooltip="Download File" 
          />
          <label className="cursor-pointer">
            <input type="file" accept=".dbb,.json" className="hidden" onChange={(e) => {
              if (e.target.files?.[0]) handleSafeImport(e.target.files[0]);
              e.target.value = '';
            }} />
            <div className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <FolderOpen size={16} />
            </div>
          </label>
          <ControlButton onClick={() => setSnipOpen(true)} icon={<Camera size={16} />} tooltip="Export Image" />
        </div>
      </div>

      {/* Top Right: Inspector */}
      <div className={`absolute top-4 z-50 flex flex-col gap-3 items-end pointer-events-none transition-all duration-300 ${isChatOpen ? 'right-[25rem]' : 'right-4'}`}>
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-zinc-900/80 backdrop-blur-md border border-white/10 hover:border-violet-500/50 rounded-xl shadow-xl transition-all">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-white font-medium hidden md:block">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-900/95 backdrop-blur-xl border-white/10">
            <DropdownMenuLabel className="text-zinc-400">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-white">
                  {user?.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-zinc-300 hover:text-white cursor-pointer">
              <FolderKanban className="mr-2 h-4 w-4" />
              <span>My Projects</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-zinc-300 hover:text-white cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 cursor-pointer"
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AI Chat Toggle Button */}
        <button
          onClick={toggleChat}
          className={`pointer-events-auto flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl shadow-xl transition-all ${
            isChatOpen
              ? 'bg-violet-600 border-violet-500 text-white'
              : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:text-white hover:border-violet-500/50'
          }`}
          title="Toggle AI Assistant"
        >
          <Bot size={16} />
          <span className="text-xs font-medium">AI Assistant</span>
        </button>

        {selectedRelationId && selectedRelation && (
          <div className="pointer-events-auto w-64 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-wider">Relationship</span>
              <button onClick={() => deleteRelation(selectedRelationId)} className="text-red-400 hover:text-red-300">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Cardinality</label>
                <div className="grid grid-cols-2 gap-2">
                  <CardinalityBtn label="1 — 1" active={selectedRelation.cardinality === "one-to-one"} onClick={() => updateRelationCardinality(selectedRelationId, "one-to-one", false)} />
                  <CardinalityBtn label="1 — N" active={selectedRelation.cardinality === "one-to-many" && !selectedRelation.isOneToManyReversed} onClick={() => updateRelationCardinality(selectedRelationId, "one-to-many", false)} />
                  <CardinalityBtn label="N — 1" active={selectedRelation.cardinality === "one-to-many" && selectedRelation.isOneToManyReversed} onClick={() => updateRelationCardinality(selectedRelationId, "one-to-many", true)} />
                  <CardinalityBtn label="N — N" active={selectedRelation.cardinality === "many-to-many"} onClick={() => updateRelationCardinality(selectedRelationId, "many-to-many", false)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Center: Dock */}
      {!snipOpen && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/50">
            <DockButton onClick={() => addTable()} icon={<Plus size={20} />} label="Add Table" hotkey="T" />
            <div className="w-px h-8 bg-white/10 mx-1"></div>
            <DockButton onClick={undo} icon={<Undo2 size={18} />} label="Undo" hotkey="Ctrl+Z" />
            <DockButton onClick={redo} icon={<Redo2 size={18} />} label="Redo" hotkey="Ctrl+Y" />
            <div className="w-px h-8 bg-white/10 mx-1"></div>
            <DockButton onClick={() => deleteSelected()} icon={<Trash2 size={18} />} label="Delete" disabled={selected.length === 0} danger />
            <div className="w-px h-8 bg-white/10 mx-1"></div>
            <button onClick={() => useDBStore.getState().setSQLDrawerOpen(true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-violet-900/20 flex items-center gap-2">
              <Share2 size={16} />
              <span>Build SQL</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Right: Tools */}
      {!snipOpen && (
        <div className="absolute bottom-8 right-8 z-40 flex flex-col items-end gap-4 pointer-events-none">

          {/* GENERATE BUTTON */}
          <button
            onClick={() => setGenerateOpen(true)}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 hover:border-violet-500/50 text-zinc-300 hover:text-white rounded-full shadow-lg shadow-black/50 transition-all active:scale-95 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500 blur-sm opacity-50 animate-pulse"></div>
              <Wand2 className="w-4 h-4 text-violet-300 relative z-10" />
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent">
              Generate
            </span>
          </button>

          {/* Tidy Up */}
          <button
            onClick={handleTidyUp}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 hover:border-violet-500/50 text-zinc-300 hover:text-white rounded-full shadow-lg shadow-black/50 transition-all active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
            <span className="text-sm font-medium">Tidy Up</span>
          </button>

          {/* Minimap */}
          <div className="pointer-events-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/90 w-80 h-56">
            <MiniMap />
          </div>

          {/* Zoom */}
          <div className="pointer-events-auto flex items-center gap-3 px-3 py-2 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
            <span className="text-xs font-mono text-zinc-400 w-12 text-center">{Math.round(viewport.scale * 100)}%</span>
            <input
              type="range"
              min="0.2"
              max="4"
              step="0.01"
              value={viewport.scale}
              onChange={(e) => {
                const rect = document.body.getBoundingClientRect();
                setScale(Number(e.target.value), rect.width / 2, rect.height / 2);
              }}
              className="w-24 accent-violet-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* OVERLAYS */}
      {snipOpen && <SnipOverlay onClose={() => setSnipOpen(false)} />}

      {generateOpen && (
        <GenerateModal
          onClose={() => setGenerateOpen(false)}
          onSuccess={handleAIResult}
        />
      )}

      <SQLDrawer />
      <AssistantButton />
      <AssistantPanel />
      <Toaster position="top-center" theme="dark" richColors />

    </div>
  );
}

// Sub-Components
const ControlButton = ({ onClick, icon, tooltip }: any) => (
  <button onClick={onClick} title={tooltip} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
    {icon}
  </button>
);
const DockButton = ({ onClick, icon, label, hotkey, disabled, danger }: any) => (
  <button onClick={onClick} disabled={disabled} className={`group relative flex items-center justify-center p-3 rounded-xl transition-all ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'} ${danger ? 'hover:text-red-400' : 'hover:text-violet-300'}`}>
    <div className={`text-zinc-400 ${!disabled && (danger ? 'group-hover:text-red-400' : 'group-hover:text-violet-300')}`}>{icon}</div>
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label} {hotkey && <span className="opacity-50 ml-1">({hotkey})</span>}
    </div>
  </button>
);
const CardinalityBtn = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${active ? 'bg-violet-500/20 border-violet-500 text-violet-200' : 'bg-zinc-800 border-transparent text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
    {label}
  </button>
);

export default WorkStation;