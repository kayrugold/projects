import { isDemo } from './lib/runtime';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PenTool, LayoutGrid, Grid, Minus, Eraser, Move, Undo2, Redo2, Layers, Ruler, Magnet, Plus, Eye, EyeOff, Lock, Unlock, Trash2, Settings2, ChevronUp, ChevronDown, Compass, Crosshair, FolderOpen, Save, LogIn, LogOut, MousePointerSquareDashed, Maximize, Minimize, Copy, ClipboardPaste, Scissors, X, Upload, Download as DownloadIcon, Hash, Square, Check, Hand, Focus, Cloud, Smartphone, Info, ShieldCheck, Pencil, Sun, Moon } from 'lucide-react';
import { ColorPickerWheel } from './components/ColorPickerWheel';
import { CanvasWorkspace, CanvasWorkspaceRef } from './components/CanvasWorkspace';
import { AboutModal } from './components/AboutModal';
import { Layer, Tool, Stroke, Camera } from './types';
import { cn } from './lib/utils';
import { auth, testConnection } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  DrawingSession, 
  saveSession, 
  loadSessions, 
  deleteSession, 
  saveLocalSession, 
  loadLocalSessions, 
  deleteLocalSession, 
  saveActiveState, 
  loadActiveState, 
  deserializeSessionData, 
  deserializeLayers,
  renameSessionTitle
} from './lib/session';
import { PWAInstallButton } from './components/PWAInstallButton';

interface ToolButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
}

function ToolButton({ icon, active, disabled, onClick, title }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-lg flex items-center justify-center transition-colors duration-200",
        active ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
      )}
    >
      {icon}
    </button>
  );
}

export default function App({ embedded = false }: { embedded?: boolean }) {
  const [layers, setLayers] = useState<Layer[]>([{ id: '1', name: 'Layer 1', visible: true, locked: false, strokes: [] }]);
  const [activeLayerId, setActiveLayerId] = useState<string>('1');
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>(isDemo ? 'Demo · not saved' : 'Untitled Draft');
  const [currentSessionIsCloud, setCurrentSessionIsCloud] = useState<boolean>(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>('#1e293b');
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [angleGuidesEnabled, setAngleGuidesEnabled] = useState(false);
  const [protractorEnabled, setProtractorEnabled] = useState(false);
  const [rulerEnabled, setRulerEnabled] = useState(false);
  const [inputMode, setInputMode] = useState<'touch' | 'pen-only'>(() => {
    try {
      const saved = isDemo ? null : localStorage.getItem('infinite_drafting_input_mode');
      return saved === 'pen-only' ? 'pen-only' : 'touch';
    } catch {
      return 'touch';
    }
  });
  const [boxGridStartNumber, setBoxGridStartNumber] = useState<number | string>(1);
  const [boxGridShape, setBoxGridShape] = useState<'square' | 'line'>('square');
  const [boxGridNumbered, setBoxGridNumbered] = useState<boolean>(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<DrawingSession | null>(null);
  
  const [history, setHistory] = useState<Layer[][]>([]);
  const [redoStack, setRedoStack] = useState<Layer[][]>([]);
  
  const [showLayers, setShowLayers] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(true);

  // Session & Auth state
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<DrawingSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [aboutDefaultTab, setAboutDefaultTab] = useState<'about' | 'privacy' | 'terms' | 'deletion'>('about');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = isDemo ? null : localStorage.getItem('infinite_drafting_theme');
      if (saved) return saved === 'dark';
      return false; // Starts in bright mode unless user explicitly toggled it
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        if (!isDemo) localStorage.setItem('infinite_drafting_theme', next ? 'dark' : 'light');
      } catch {}
      if (next && (color === '#1e293b' || color === '#000000')) {
        setColor('#f8fafc');
      } else if (!next && (color === '#f8fafc' || color === '#ffffff')) {
        setColor('#1e293b');
      }
      showToast(next ? 'Dark Drafting Theme active' : 'Light Studio Theme active', 'info');
      return next;
    });
  };
  
  const openAbout = (tab: 'about' | 'privacy' | 'terms' | 'deletion' = 'about') => {
    setAboutDefaultTab(tab);
    setShowAbout(true);
  };
  const [libraryTab, setLibraryTab] = useState<'device' | 'cloud'>('device');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>('');
  const [isEditingTopBarTitle, setIsEditingTopBarTitle] = useState<boolean>(false);
  const [topBarTitleText, setTopBarTitleText] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [clipboardStrokes, setClipboardStrokes] = useState<Stroke[]>([]);
  const canvasRef = useRef<CanvasWorkspaceRef>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const handleStartRename = (e: React.MouseEvent, session: DrawingSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitleText(session.title);
  };

  const handleSaveRename = async (e: React.FormEvent | React.MouseEvent, session: DrawingSession) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = editingTitleText.trim();
    if (!trimmed) {
      setEditingSessionId(null);
      return;
    }

    try {
      const updated = await renameSessionTitle(session, trimmed);
      setSessions(prev => prev.map(s => (s.id === session.id && s.isLocal === session.isLocal) ? updated : s));
      
      if (currentSessionId === session.id) {
        setCurrentSessionTitle(updated.title);
      }

      showToast(`Renamed draft to "${updated.title}"`, 'success');
    } catch (err) {
      showToast('Failed to rename draft', 'error');
    } finally {
      setEditingSessionId(null);
    }
  };

  const handleSaveTopBarTitle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = topBarTitleText.trim();
    if (!trimmed) {
      setIsEditingTopBarTitle(false);
      return;
    }

    setCurrentSessionTitle(trimmed);
    setIsEditingTopBarTitle(false);

    if (currentSessionId) {
      const activeSession = sessions.find(s => s.id === currentSessionId);
      if (activeSession) {
        try {
          const updated = await renameSessionTitle(activeSession, trimmed);
          setSessions(prev => prev.map(s => (s.id === activeSession.id && s.isLocal === activeSession.isLocal) ? updated : s));
        } catch (err) {
          console.error('Failed to update active draft title:', err);
        }
      }
    }

    if (!isDemo) await saveActiveState(layers, camera, {
      id: currentSessionId,
      title: trimmed,
      isCloud: currentSessionIsCloud
    });

    showToast(`Draft title updated to "${trimmed}"`, 'success');
  };

  useEffect(() => {
    document.title = "Infinite Drafting";
    if (isDemo) return;
    testConnection();

    const initAppData = async () => {
      try {
        // 1. Check last active state (preserves exact layers and camera viewport)
        const activeState = await loadActiveState();
        if (activeState && activeState.layers && activeState.layers.length > 0) {
          setLayers(activeState.layers);
          setActiveLayerId(activeState.layers[0]?.id || '1');
          if (activeState.camera) {
            setCamera(activeState.camera);
            canvasRef.current?.setCamera(activeState.camera);
          }
          if (activeState.sessionId) {
            setCurrentSessionId(activeState.sessionId);
            setCurrentSessionTitle(activeState.sessionTitle || 'Untitled Draft');
            setCurrentSessionIsCloud(activeState.isCloud);
          }
        } else {
          // If no active state in IndexedDB, check saved local sessions
          const localSessions = await loadLocalSessions();
          if (localSessions.length > 0) {
            const latest = localSessions[0];
            const { layers: parsedLayers, camera: parsedCamera } = await deserializeSessionData(latest.layersData);
            if (parsedLayers && parsedLayers.length > 0) {
              setLayers(parsedLayers);
              setActiveLayerId(parsedLayers[0]?.id || '1');
              setCurrentSessionId(latest.id);
              setCurrentSessionTitle(latest.title);
              setCurrentSessionIsCloud(false);
              if (parsedCamera) {
                setCamera(parsedCamera);
                canvasRef.current?.setCamera(parsedCamera);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to restore active state:', err);
      } finally {
        loadAllSessions(auth.currentUser);
      }
    };

    initAppData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await loadAllSessions(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Debounced autosave to IndexedDB with camera and session metadata
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isDemo && layers.length > 0) {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        const curCam = canvasRef.current?.getCamera() || camera;
        saveActiveState(layers, curCam, {
          id: currentSessionId,
          title: currentSessionTitle,
          isCloud: currentSessionIsCloud
        }).catch(err => console.warn('Autosave notice:', err));
      }, 500);
    }
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [layers, camera, currentSessionId, currentSessionTitle, currentSessionIsCloud]);

  const loadAllSessions = async (currentUser: User | null) => {
    const localSessions = await loadLocalSessions();
    let cloudSessions: DrawingSession[] = [];
    if (currentUser) {
      try {
        cloudSessions = await loadSessions();
      } catch (e) {
        console.error('Failed to load cloud sessions', e);
      }
    }
    // Combine local & cloud sessions, sort by newest
    const combined = [...localSessions, ...cloudSessions].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
    setSessions(combined);
  };

  const handleLogin = async () => {
    if (isDemo) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('Signed in successfully! ☁️', 'success');
    } catch (e: any) {
      console.error('Login failed', e);
      if (e.code !== 'auth/popup-closed-by-user') {
        showToast('Sign in failed: ' + (e.message || 'Unknown error'), 'error');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    loadAllSessions(null);
    showToast('Signed out', 'info');
  };

  const handleSave = async (saveToCloud: boolean = false) => {
    if (isDemo) return;
    setIsSaving(true);
    try {
      const currentCam = canvasRef.current?.getCamera() || camera;
      if (saveToCloud) {
        if (!user) {
          showToast("Please sign in to save to Cloud Sync.", "info");
          setIsSaving(false);
          return;
        }

        // Determine if current session corresponds to an existing cloud session
        const existingCloud = sessions.find(s => s.id === currentSessionId && !s.isLocal);
        const targetId = existingCloud ? existingCloud.id : (currentSessionId || Math.random().toString(36).substring(2, 9));
        const titleToUse = existingCloud?.title || (currentSessionTitle !== 'Untitled Draft' ? currentSessionTitle : `Cloud Draft ${targetId.substring(0, 4)}`);

        await saveSession(targetId, titleToUse, layers, currentCam);
        setCurrentSessionId(targetId);
        setCurrentSessionTitle(titleToUse);
        setCurrentSessionIsCloud(true);
        showToast('Saved to Cloud Sync! View & strokes saved ☁️', 'success');
      } else {
        // Save Locally to device
        const existingLocal = sessions.find(s => s.id === currentSessionId && s.isLocal);
        const idToUse = existingLocal ? existingLocal.id : (currentSessionId || Math.random().toString(36).substring(2, 9));
        const titleToUse = existingLocal?.title || (currentSessionTitle !== 'Untitled Draft' ? currentSessionTitle : `Local Draft ${idToUse.substring(0, 4)}`);
        
        await saveLocalSession(idToUse, titleToUse, layers, currentCam);
        setCurrentSessionId(idToUse);
        setCurrentSessionTitle(titleToUse);
        setCurrentSessionIsCloud(false);
        showToast('Saved to Device! View & strokes saved 💾', 'success');
      }
      await loadAllSessions(user);
      
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    } catch (e: any) {
      console.error('Save failed', e);
      let errorMsg = 'Failed to save draft.';
      try {
        const parsed = JSON.parse(e.message);
        if (parsed.error?.includes('permission') || parsed.error?.includes('Missing or insufficient permissions')) {
          errorMsg = 'Cloud permission issue. Try signing in again.';
        } else if (parsed.error?.includes('too large') || parsed.error?.includes('exceeds')) {
          errorMsg = 'Draft is very large. Saved to device is recommended.';
        } else if (parsed.error?.includes('offline') || parsed.error?.includes('network')) {
          errorMsg = 'Network offline. Saved to device instead.';
        } else if (parsed.error) {
          errorMsg = `Cloud: ${parsed.error}`;
        }
      } catch {
        if (e.message) errorMsg = e.message;
      }
      showToast(errorMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSession = (session: DrawingSession) => {
    setIsLoadingSession(true);
    setTimeout(async () => {
      try {
        const { layers: parsedLayers, camera: parsedCamera } = await deserializeSessionData(session.layersData);
        setLayers(parsedLayers);
        setActiveLayerId(parsedLayers[0]?.id || '1');
        setCurrentSessionId(session.id);
        setCurrentSessionTitle(session.title);
        setCurrentSessionIsCloud(!session.isLocal);
        setHistory([]);
        setRedoStack([]);
        setShowLibrary(false);

        if (parsedCamera) {
          setCamera(parsedCamera);
          canvasRef.current?.setCamera(parsedCamera);
        } else {
          canvasRef.current?.fitContent();
        }

        const camToSave = parsedCamera || canvasRef.current?.getCamera() || camera;
        if (!isDemo) await saveActiveState(parsedLayers, camToSave, {
          id: session.id,
          title: session.title,
          isCloud: !session.isLocal
        });

        showToast(`Loaded ${session.title}`, 'info');
      } catch (e) {
        console.error('Failed to parse session data', e);
        showToast("This save file appears to be corrupted.", "error");
      } finally {
        setIsLoadingSession(false);
      }
    }, 50);
  };

  const handleDeleteSession = (e: React.MouseEvent, session: DrawingSession) => {
    e.stopPropagation();
    setSessionToDelete(session);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      if (sessionToDelete.isLocal) {
        await deleteLocalSession(sessionToDelete.id);
      } else {
        await deleteSession(sessionToDelete.id);
      }
      if (currentSessionId === sessionToDelete.id) {
        setCurrentSessionId(null);
        setCurrentSessionTitle('Untitled Draft');
      }
      await loadAllSessions(user);
      showToast(`Deleted ${sessionToDelete.title}`, 'info');
    } catch (e) {
      console.error('Failed to delete', e);
      showToast('Failed to delete draft', 'error');
    } finally {
      setSessionToDelete(null);
    }
  };

  const handleExportFile = () => {
    try {
      const curCam = canvasRef.current?.getCamera() || camera;
      const exportData = {
        title: currentSessionTitle,
        camera: curCam,
        layers
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `infinite-draft-${currentSessionTitle.toLowerCase().replace(/\s+/g, '-') || 'export'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported file successfully!', 'success');
    } catch (e) {
      console.error('Export failed', e);
      showToast('Failed to export file', 'error');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const { layers: importedLayers, camera: importedCamera } = await deserializeSessionData(content);
        const newId = Math.random().toString(36).substring(2, 9);
        const titleToUse = `Imported Draft ${newId.substring(0,4)}`;
        const curCam = importedCamera || { x: 0, y: 0, zoom: 1 };
        await saveLocalSession(newId, titleToUse, importedLayers, curCam);
        
        setCurrentSessionId(newId);
        setCurrentSessionTitle(titleToUse);
        setCurrentSessionIsCloud(false);
        setLayers(importedLayers);
        setActiveLayerId(importedLayers[0]?.id || '1');
        if (importedCamera) {
          setCamera(importedCamera);
          canvasRef.current?.setCamera(importedCamera);
        } else {
          canvasRef.current?.fitContent();
        }
        await loadAllSessions(user);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        showToast('Draft imported successfully!', 'success');
      } catch (err) {
        console.error('Import failed', err);
        showToast('Failed to import file. It might be corrupted.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleNewDraft = async () => {
    const blankLayers: Layer[] = [{ id: '1', name: 'Layer 1', visible: true, locked: false, strokes: [] }];
    setLayers(blankLayers);
    setActiveLayerId('1');
    setCurrentSessionId(null);
    setCurrentSessionTitle('Untitled Draft');
    setCurrentSessionIsCloud(false);
    setHistory([]);
    setRedoStack([]);
    setShowLibrary(false);
    canvasRef.current?.resetView();
    setCamera({ x: 0, y: 0, zoom: 1 });
    if (!isDemo) await saveActiveState(blankLayers, { x: 0, y: 0, zoom: 1 }, {
      id: null,
      title: 'Untitled Draft',
      isCloud: false
    });
    showToast('New draft started', 'info');
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Attempt auto-fullscreen on first interaction if not in standalone/fullscreen mode
    const handleFirstInteraction = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches;
      if (!isStandalone && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      document.removeEventListener('pointerdown', handleFirstInteraction);
    };
    if (!embedded) document.addEventListener('pointerdown', handleFirstInteraction);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('pointerdown', handleFirstInteraction);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error(`Error attempting to enable fullscreen: ${err}`);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  
  const handleLayersChange = (newLayers: Layer[]) => {
    setHistory(prev => [...prev, layers]);
    setRedoStack([]);
    setLayers(newLayers);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setRedoStack(prevStack => [...prevStack, layers]);
    setLayers(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setHistory(prev => [...prev, layers]);
    setLayers(next);
  };

  const handleCopy = () => {
    if (canvasRef.current && canvasRef.current.hasSelection()) {
      setClipboardStrokes(canvasRef.current.copySelection());
    }
  };

  const handleCut = () => {
    if (canvasRef.current && canvasRef.current.hasSelection()) {
      setClipboardStrokes(canvasRef.current.copySelection());
      canvasRef.current.deleteSelection();
    }
  };

  const handlePaste = () => {
    if (canvasRef.current && clipboardStrokes.length > 0) {
      canvasRef.current.pasteStrokes(clipboardStrokes);
    }
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Math.random().toString(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      strokes: []
    };
    handleLayersChange([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    handleLayersChange(layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLayer = (id: string) => {
    if (layers.length <= 1) return;
    const newLayers = layers.filter(l => l.id !== id);
    handleLayersChange(newLayers);
    if (activeLayerId === id) {
      setActiveLayerId(newLayers[0].id);
    }
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const newLayers = [...layers];
    if (direction === 'up' && index > 0) {
      [newLayers[index-1], newLayers[index]] = [newLayers[index], newLayers[index-1]];
      handleLayersChange(newLayers);
    } else if (direction === 'down' && index < layers.length - 1) {
      [newLayers[index+1], newLayers[index]] = [newLayers[index], newLayers[index+1]];
      handleLayersChange(newLayers);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-50 touch-none select-none">
      {sessionToDelete && (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-5 flex flex-col gap-4">
            <h3 className="font-bold text-lg text-slate-800">Delete Draft?</h3>
            <p className="text-slate-600 text-sm">
              Are you sure you want to delete &quot;<strong>{sessionToDelete.title}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end mt-2">
              <button 
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoadingSession && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-200">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold text-slate-700">Loading draft...</span>
          </div>
        </div>
      )}
      <CanvasWorkspace 
        ref={canvasRef}
        layers={layers}
        activeLayerId={activeLayerId}
        tool={tool}
        color={color}
        snapEnabled={snapEnabled}
        angleGuidesEnabled={angleGuidesEnabled}
        protractorEnabled={protractorEnabled}
        rulerEnabled={rulerEnabled}
        inputMode={inputMode}
        boxGridStartNumber={typeof boxGridStartNumber === 'number' ? boxGridStartNumber : 1}
        boxGridShape={boxGridShape}
        boxGridNumbered={boxGridNumbered}
        initialCamera={camera}
        isDarkMode={isDarkMode}
        onCameraChange={setCamera}
        onLayersChange={handleLayersChange}
      />

      {/* In-app Toast feedback */}
      {toast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className={cn(
            "pointer-events-auto px-4 py-2 rounded-xl shadow-lg backdrop-blur-md text-xs sm:text-sm font-medium border flex items-center gap-2",
            toast.type === 'success' && "bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-500/10",
            toast.type === 'error' && "bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-500/10",
            toast.type === 'info' && "bg-slate-900/90 border-slate-700 text-white shadow-slate-900/20"
          )}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 pointer-events-none z-30 flex gap-2 items-center">
        {/* Active Draft Status Pill */}
        {isEditingTopBarTitle ? (
          <form 
            onSubmit={handleSaveTopBarTitle}
            className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md border border-blue-400 px-2 py-0.5 rounded-full shadow-md"
          >
            <input
              type="text"
              value={topBarTitleText}
              onChange={(e) => setTopBarTitleText(e.target.value)}
              className="px-1.5 py-0.5 text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-900 w-28 sm:w-36"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsEditingTopBarTitle(false);
              }}
            />
            <button
              type="submit"
              className="p-0.5 text-emerald-600 hover:text-emerald-700 rounded"
              title="Save title"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingTopBarTitle(false)}
              className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
              title="Cancel"
            >
              <X size={13} />
            </button>
          </form>
        ) : (
          <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md border border-slate-200 hover:border-blue-400 rounded-full shadow-sm pl-2.5 pr-1.5 py-1 gap-1 max-w-[170px] sm:max-w-[240px] group transition-colors">
            <button
              onClick={() => isDemo ? showToast("The full app includes device saves, file export and Google cloud sync.") : setShowLibrary(true)}
              className="flex items-center gap-1.5 min-w-0 flex-1 text-xs font-semibold text-slate-700 hover:text-blue-600 text-left truncate"
              title={isDemo ? "Temporary demo · nothing is saved" : `Active Draft: ${currentSessionTitle} (${currentSessionIsCloud ? 'Cloud' : 'Device'}). Tap to open Library.`}
            >
              {currentSessionIsCloud ? (
                <Cloud size={13} className="text-blue-600 shrink-0" />
              ) : (
                <Smartphone size={13} className="text-emerald-600 shrink-0" />
              )}
              <span className="truncate">{currentSessionTitle}</span>
            </button>
            <button
              onClick={() => {
                setTopBarTitleText(currentSessionTitle);
                setIsEditingTopBarTitle(true);
              }}
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              title="Rename active draft"
            >
              <Pencil size={12} />
            </button>
          </div>
        )}

        {!embedded && <PWAInstallButton />}
      </div>

          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2 sm:gap-4 pointer-events-none items-start z-30 max-h-[calc(100vh-1.5rem)]">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md shadow-lg border border-slate-200/80 rounded-2xl p-1.5 sm:p-2 flex flex-col gap-1.5 max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar touch-auto">
          <ToolButton icon={<Settings2 size={20} />} active={toolbarOpen} onClick={() => setToolbarOpen(!toolbarOpen)} title="Toggle Toolbar" />
          
          {toolbarOpen && (
            <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-200">
              <ToolButton icon={<PenTool size={20}/>} active={tool === 'pen'} onClick={() => setTool('pen')} title="Pen" />
              <ToolButton icon={<Minus size={20}/>} active={tool === 'line'} onClick={() => setTool('line')} title="Line" />
              <ToolButton icon={<Eraser size={20}/>} active={tool === 'erase'} onClick={() => setTool('erase')} title="Erase" />
              <ToolButton 
                icon={<div className="relative flex"><LayoutGrid size={20}/><div className="absolute -bottom-1.5 -right-1.5 text-[8px] font-black bg-blue-100 text-blue-700 rounded-[3px] px-0.5 leading-none border border-blue-200/50">12</div></div>} 
                active={tool === 'box-grid' && boxGridNumbered} 
                onClick={() => { setTool('box-grid'); setBoxGridNumbered(true); }} 
                title="Numbered Grid" 
              />
              <ToolButton 
                icon={<Grid size={20}/>} 
                active={tool === 'box-grid' && !boxGridNumbered} 
                onClick={() => { setTool('box-grid'); setBoxGridNumbered(false); }} 
                title="Blank Grid" 
              />
              {tool === 'box-grid' && (
                <div className="flex flex-col items-center gap-2 mb-1 pt-1 pointer-events-auto">
                  <div className="flex flex-col gap-0.5 bg-slate-100 p-0.5 rounded-md border border-slate-200 w-full">
                    <button 
                      onClick={() => setBoxGridShape('square')}
                      className={cn("p-1.5 rounded-sm flex items-center justify-center transition-colors", boxGridShape === 'square' ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-blue-600" : "text-slate-500 hover:text-slate-700")}
                      title="2D Square Grid"
                    >
                      <Square size={14} />
                    </button>
                    <button 
                      onClick={() => setBoxGridShape('line')}
                      className={cn("p-1.5 rounded-sm flex items-center justify-center transition-colors", boxGridShape === 'line' ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-blue-600" : "text-slate-500 hover:text-slate-700")}
                      title="1D Line Grid"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                  
                  {boxGridNumbered && (
                    <div className="flex flex-col items-center pb-1">
                      <span className="text-[8px] font-bold text-slate-500 mb-0.5 text-center leading-none">START #</span>
                      <input 
                        type="number" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={boxGridStartNumber} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '') {
                            setBoxGridStartNumber('');
                          } else {
                            const parsed = parseInt(val, 10);
                            if (!isNaN(parsed)) setBoxGridStartNumber(parsed);
                          }
                        }}
                        onPointerDown={e => {
                          e.stopPropagation();
                          e.currentTarget.focus();
                        }}
                        onPointerUp={e => e.stopPropagation()}
                        onClick={e => {
                          e.stopPropagation();
                          e.currentTarget.focus();
                        }}
                        className="w-8 h-6 text-center text-xs border border-slate-200 rounded pointer-events-auto bg-white shadow-sm"
                        title="Start Number"
                      />
                    </div>
                  )}
                </div>
              )}
              <ToolButton icon={<Move size={20}/>} active={tool === 'move'} onClick={() => setTool('move')} title="Move" />
              <ToolButton icon={<MousePointerSquareDashed size={20}/>} active={tool === 'select'} onClick={() => setTool('select')} title="Select Box" />
              <div 
                className={cn("relative flex items-center justify-center p-1 mt-1 rounded-lg cursor-pointer transition-colors", showColorWheel ? "bg-slate-200" : "hover:bg-slate-100")} 
                title="Stroke Color"
                onClick={() => setShowColorWheel(!showColorWheel)}
              >
                <div className="w-6 h-6 rounded-full border border-slate-300 shadow-sm overflow-hidden" style={{ backgroundColor: color }} />
              </div>
              <div className="w-full h-px bg-slate-200 my-1" />
              <ToolButton icon={<Magnet size={20}/>} active={snapEnabled} onClick={() => setSnapEnabled(!snapEnabled)} title="Snap to Grid" />
              <ToolButton icon={<Crosshair size={20}/>} active={angleGuidesEnabled} onClick={() => setAngleGuidesEnabled(!angleGuidesEnabled)} title="Angle Guides (15°)" />
              <ToolButton icon={<Compass size={20}/>} active={protractorEnabled} onClick={() => setProtractorEnabled(!protractorEnabled)} title="Protractor Guide" />
              <ToolButton 
                icon={<Ruler size={20}/>} 
                active={rulerEnabled} 
                onClick={() => {
                  const next = !rulerEnabled;
                  setRulerEnabled(next);
                  if (next) showToast('Ruler Guide active: Draw straight lines from anywhere along the ruler angle, or along the ruler edge', 'info');
                }} 
                title="Point-to-Point Ruler Guide" 
              />
              {rulerEnabled && (
                <div className="flex flex-col items-center bg-blue-50/80 p-1 rounded-lg border border-blue-200/80 gap-1 my-0.5 pointer-events-auto">
                  <span className="text-[8px] font-black text-blue-700 uppercase tracking-tight">Ruler Line</span>
                  <button
                    onClick={() => {
                      canvasRef.current?.strokeRulerLine();
                      showToast('Drawn line between Point A and B', 'success');
                    }}
                    className="w-full py-1 px-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded text-[10px] font-bold shadow-sm flex items-center justify-center gap-1 transition-colors"
                    title="Draw straight line between Point A and Point B"
                  >
                    <Minus size={12} strokeWidth={3} />
                    <span>Stroke</span>
                  </button>
                </div>
              )}
              <div className="w-full h-px bg-slate-200 my-1" />
              <ToolButton 
                icon={inputMode === 'pen-only' ? (
                  <div className="relative flex items-center justify-center">
                    <PenTool size={20} className="text-amber-600" />
                    <span className="absolute -bottom-1.5 -right-1.5 text-[7px] font-black bg-amber-500 text-white px-0.5 rounded leading-none">PEN</span>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center">
                    <Hand size={20} className="text-blue-600" />
                    <span className="absolute -bottom-1.5 -right-1.5 text-[7px] font-black bg-blue-600 text-white px-0.5 rounded leading-none">TOUCH</span>
                  </div>
                )} 
                active={inputMode === 'pen-only'} 
                onClick={() => {
                  const next = inputMode === 'touch' ? 'pen-only' : 'touch';
                  setInputMode(next);
                  try {
                    if (!isDemo) localStorage.setItem('infinite_drafting_input_mode', next);
                  } catch {}
                  showToast(
                    next === 'pen-only' 
                      ? 'Pen Only Mode: Stylus/pen draws. 2 fingers pan & zoom. Finger drawing disabled (Palm rejection active).' 
                      : 'Touch Mode: Single finger draws like a pen. 2 fingers pan & zoom.',
                    'info'
                  );
                }} 
                title={inputMode === 'pen-only' ? "Mode: Pen Only (Stylus draws, 2 fingers pan/zoom) - Tap for Touch Mode" : "Mode: Touch Mode (Finger works like pen, 2 fingers pan/zoom) - Tap for Pen Only"} 
              />
              <div className="w-full h-px bg-slate-200 my-1" />
              <ToolButton icon={<Undo2 size={20}/>} active={false} onClick={handleUndo} disabled={history.length === 0} title="Undo" />
              <ToolButton icon={<Redo2 size={20}/>} active={false} onClick={handleRedo} disabled={redoStack.length === 0} title="Redo" />
              <div className="w-full h-px bg-slate-200 my-1" />
              <ToolButton icon={<Scissors size={20}/>} active={false} onClick={handleCut} disabled={tool !== 'select'} title="Cut" />
              <ToolButton icon={<Copy size={20}/>} active={false} onClick={handleCopy} disabled={tool !== 'select'} title="Copy" />
              <ToolButton icon={<ClipboardPaste size={20}/>} active={false} onClick={handlePaste} disabled={clipboardStrokes.length === 0} title="Paste" />
              <div className="w-full h-px bg-slate-200 my-1" />
              <ToolButton icon={<Layers size={20}/>} active={showLayers} onClick={() => setShowLayers(!showLayers)} title="Layers" />
              <ToolButton icon={<FolderOpen size={20}/>} active={showLibrary} onClick={() => isDemo ? showToast("The full app includes a draft library and cloud sync.") : setShowLibrary(!showLibrary)} title={isDemo ? "Library (full app feature)" : "Library"} />
              <ToolButton icon={<Save size={20}/>} active={false} onClick={() => handleSave(false)} disabled={isSaving || isDemo} title={isDemo ? "Saving is available in the full app" : "Save Draft (Device)"} />
              <ToolButton 
                icon={<Focus size={20}/>} 
                active={false} 
                onClick={() => { 
                  canvasRef.current?.fitContent(); 
                  showToast('View centered on drawing', 'info'); 
                }} 
                title="Fit to Screen / Center View" 
              />
              <ToolButton 
                icon={<Info size={20}/>} 
                active={showAbout} 
                onClick={() => openAbout('about')} 
                title="About, Privacy Policy & Legal Info" 
              />
              <div className="w-full h-px bg-slate-200 my-1" />
              <ToolButton icon={isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>} onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} />
            </div>
          )}
        </div>
        
        {!isDemo && showLibrary && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 rounded-2xl p-3 sm:p-4 w-[calc(100vw-4.25rem)] sm:w-80 max-w-[340px] flex flex-col gap-2.5 sm:gap-3 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Draft Library</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Local & Cloud saved files</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => openAbout('about')} 
                  className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors" 
                  title="About Infinite Drafting & Policies"
                >
                  <Info size={15} />
                </button>
                {user ? (
                  <button onClick={handleLogout} className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors">
                    <LogOut size={12} /> Sign out
                  </button>
                ) : (
                  <button onClick={handleLogin} className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors">
                    <LogIn size={12} /> Cloud Sign In
                  </button>
                )}
                <button onClick={() => setShowLibrary(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors ml-1" title="Close Library">
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setLibraryTab('device')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
                  libraryTab === 'device' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                📱 Device
              </button>
              <button
                onClick={() => setLibraryTab('cloud')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
                  libraryTab === 'cloud' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                ☁️ Cloud
              </button>
            </div>
            
            <div className="flex gap-1.5">
              <button 
                onClick={handleNewDraft}
                className="flex-1 py-1.5 px-2 text-xs font-semibold text-blue-600 border border-blue-200 border-dashed rounded-xl hover:bg-blue-50 transition-colors text-center"
              >
                + New Draft
              </button>
              {libraryTab === 'cloud' ? (
                <button 
                  onClick={() => {
                    if (!user) {
                      handleLogin();
                    } else {
                      handleSave(true);
                    }
                  }}
                  disabled={isSaving && !!user}
                  className="flex-1 py-1.5 px-2.5 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 relative"
                  title={user ? "Save to Cloud Sync" : "Sign in to save"}
                >
                  {user ? '☁️ Save to Cloud' : '☁️ Sign In'}
                  {savedIndicator && user && <span className="absolute -top-2 -right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
                </button>
              ) : (
                <button 
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="flex-1 py-1.5 px-2.5 text-xs font-medium text-slate-700 bg-slate-200 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50 relative"
                  title="Save locally on this device"
                >
                  💾 Save to Device
                  {savedIndicator && <span className="absolute -top-2 -right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
                </button>
              )}
            </div>

            {libraryTab === 'device' && (
              <div className="flex gap-2 pb-1 border-b border-slate-100">
                <button 
                  onClick={handleExportFile}
                  className="flex-1 py-1 px-2 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                  title="Save project file to your device storage"
                >
                  <DownloadIcon size={12} /> Export File
                </button>
                <label 
                  className="flex-1 py-1 px-2 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Load project file from your device storage"
                >
                  <Upload size={12} /> Import File
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={handleImportFile}
                    ref={fileInputRef} 
                  />
                </label>
              </div>
            )}
            
            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {sessions.filter(s => libraryTab === 'device' ? s.isLocal : !s.isLocal).length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  {libraryTab === 'device' ? (
                    <>No local drafts yet.<br />Tap <strong>Save to Device</strong> above!</>
                  ) : (
                    <>No cloud drafts yet.<br />{user ? 'Tap Save to Cloud above!' : 'Sign in to save to the cloud!'}</>
                  )}
                </div>
              )}
              {sessions.filter(s => libraryTab === 'device' ? s.isLocal : !s.isLocal).map((session, index) => (
                <div 
                  key={`${session.id}-${session.isLocal ? 'local' : 'cloud'}-${index}`}
                  className={cn(
                    "flex flex-col gap-1.5 p-2.5 border rounded-xl transition-all",
                    currentSessionId === session.id 
                      ? "border-blue-400 bg-blue-50/40 shadow-xs" 
                      : "border-slate-200 hover:border-blue-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    {editingSessionId === session.id ? (
                      <form 
                        onSubmit={(e) => handleSaveRename(e, session)} 
                        className="flex-1 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingTitleText}
                          onChange={(e) => setEditingTitleText(e.target.value)}
                          className="w-full px-2 py-0.5 text-xs font-semibold bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-900"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditingSessionId(null);
                          }}
                        />
                        <button
                          type="submit"
                          className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded shrink-0"
                          title="Save Name"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSessionId(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded shrink-0"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleLoadSession(session)} 
                          className="flex-1 text-left text-sm font-semibold text-slate-800 hover:text-blue-600 truncate flex items-center gap-1.5 min-w-0"
                        >
                          <span className="truncate">{session.title}</span>
                          {currentSessionId === session.id && (
                            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-blue-600 text-white tracking-wider shrink-0 leading-none">Active</span>
                          )}
                        </button>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={(e) => handleStartRename(e, session)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                            title="Rename Draft"
                          >
                            <Pencil size={13} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteSession(e, session)} 
                            className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition-colors"
                            title="Delete Draft"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                      session.isLocal ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-blue-50 text-blue-700 border border-blue-200/60"
                    )}>
                      {session.isLocal ? '📱 On Device' : '☁️ Cloud Sync'}
                    </span>
                    <span className="text-slate-400 text-[10px]">{session.updatedAt.toLocaleDateString()} {session.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <button
                onClick={() => openAbout('privacy')}
                className="text-slate-600 hover:text-blue-600 underline font-medium flex items-center gap-1 transition-colors"
              >
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Privacy Policy</span>
              </button>
              <button
                onClick={() => openAbout('deletion')}
                className="text-slate-600 hover:text-amber-700 underline font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} className="text-amber-600" />
                <span>Account Deletion</span>
              </button>
            </div>
          </div>
        )}

        {showLayers && !showLibrary && !showColorWheel && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 rounded-2xl p-3 sm:p-4 w-[calc(100vw-4.25rem)] sm:w-72 max-w-[320px] flex flex-col gap-3 max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Layers</h3>
              <div className="flex items-center gap-1">
                <button onClick={addLayer} className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="Add Layer">
                  <Plus size={16} />
                </button>
                <button onClick={() => setShowLayers(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors ml-1" title="Close Layers">
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {[...layers].reverse().map((layer) => {
                const index = layers.findIndex(l => l.id === layer.id);
                return (
                  <div 
                    key={layer.id} 
                    className={cn(
                      "flex flex-col gap-2 p-2 rounded-lg border transition-colors",
                      activeLayerId === layer.id ? "border-blue-300 bg-blue-50/50" : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <button 
                        className="flex-1 text-left text-sm font-medium text-slate-700 truncate outline-none"
                        onClick={() => setActiveLayerId(layer.id)}
                      >
                        {layer.name}
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateLayer(layer.id, { visible: !layer.visible })} className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100" title="Visibility">
                          {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={() => updateLayer(layer.id, { locked: !layer.locked })} className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100" title="Lock Layer">
                          {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <button onClick={() => deleteLayer(layer.id)} disabled={layers.length === 1} className="p-1 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 disabled:opacity-30" title="Delete Layer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                        {layer.strokes.length} strokes
                      </span>
                      <div className="flex items-center">
                        <button onClick={() => moveLayer(index, 'up')} disabled={index === 0} className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100" title="Move Down">
                          <ChevronDown size={14} />
                        </button>
                        <button onClick={() => moveLayer(index, 'down')} disabled={index === layers.length - 1} className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100" title="Move Up">
                          <ChevronUp size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showColorWheel && !showLibrary && !showLayers && (
          <ColorPickerWheel 
            color={color} 
            onChange={setColor} 
            onClose={() => setShowColorWheel(false)} 
          />
        )}
      </div>

      <AboutModal 
        key={aboutDefaultTab}
        isOpen={showAbout} 
        defaultTab={aboutDefaultTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onClose={() => setShowAbout(false)} 
      />
    </div>
  );
}
