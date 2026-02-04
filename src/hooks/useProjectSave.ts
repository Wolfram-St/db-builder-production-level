import { useEffect, useRef, useCallback } from 'react';
import { useDBStore } from '../store/dbStore';

const AUTOSAVE_INTERVAL = 10 * 60 * 1000; 

export const useProjectSave = (projectId: string) => {
  const { tables, relations, setSaveStatus } = useDBStore();
  
  // Refs to hold the latest data
  const stateRef = useRef({ tables, relations });
  const projectIdRef = useRef(projectId);
  const isDirty = useRef(false);

  // Update refs whenever data changes
  useEffect(() => {
    stateRef.current = { tables, relations };
    projectIdRef.current = projectId;
    
    // Mark as dirty if it's not the initial load
    if (tables.length > 0 || relations.length > 0) { 
       isDirty.current = true;
       setSaveStatus('unsaved');
    }
  }, [tables, relations, projectId, setSaveStatus]);


  // The Save Function - now saves locally only
  const saveProject = useCallback(async () => {
    const currentProjectId = projectIdRef.current;
    const currentData = stateRef.current;

    console.log("---- SAVE ATTEMPT (Local Mode) ----");
    console.log("Tables:", currentData.tables.length);
    
    // In local mode, we just mark as saved since changes are in memory
    // User can manually export using the download button
    setSaveStatus('saved');
    isDirty.current = false;
    console.log("✅ Changes tracked (use Export to save to file)");
    
  }, [setSaveStatus]);

  // Global Keyboard Listener for Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        console.log("⌨️ Ctrl+S Detected (Local Mode)");
        saveProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveProject]);


  // Auto-Save Interval (just marks as saved in local mode)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isDirty.current) {
        console.log("⏰ Auto-Save Timer (Local Mode)");
        saveProject();
      }
    }, AUTOSAVE_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [saveProject]);
};