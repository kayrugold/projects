import { isDemo } from './runtime';
/**
 * High-capacity IndexedDB storage engine for local drafting sessions and active canvas state.
 * Solves browser localStorage 5MB quota exhaustion and reliably preserves canvas state,
 * active draft ID, viewport camera (pan/zoom), and stroke data across reloads.
 */

import { Layer, Camera } from '../types';

export interface SavedDraft {
  id: string;
  userId: string;
  title: string;
  layersData: string; // JSON or compressed base64 (gz:...)
  createdAt: Date;
  updatedAt: Date;
  isLocal?: boolean;
  camera?: Camera;
}

export interface ActiveAppState {
  sessionId: string | null;
  sessionTitle: string;
  isCloud: boolean;
  layers: Layer[];
  camera: Camera;
  updatedAt: number;
}

const DB_NAME = 'InfiniteDraftingDB';
const DB_VERSION = 1;
const SESSIONS_STORE = 'sessions';
const STATE_STORE = 'app_state';
const ACTIVE_STATE_KEY = 'active_canvas_state';

// Synchronous fallback keys in localStorage (fallback only if IndexedDB unavailable)
const LS_FALLBACK_ACTIVE = 'infinite_draft_active_state_v2';
const LS_FALLBACK_SESSIONS = 'infinite_draft_local_sessions_v2';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        db.createObjectStore(SESSIONS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STATE_STORE)) {
        db.createObjectStore(STATE_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a local draft session into IndexedDB
 */
export async function idbSaveSession(session: SavedDraft): Promise<void> {
  if (isDemo) return;
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SESSIONS_STORE, 'readwrite');
      const store = tx.objectStore(SESSIONS_STORE);
      
      const record = {
        ...session,
        createdAt: session.createdAt instanceof Date ? session.createdAt.toISOString() : session.createdAt,
        updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : session.updatedAt
      };
      
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save session failed, falling back to localStorage:', err);
    try {
      const existing = idbGetFallbackSessions();
      const idx = existing.findIndex(s => s.id === session.id);
      if (idx >= 0) existing[idx] = session;
      else existing.unshift(session);
      localStorage.setItem(LS_FALLBACK_SESSIONS, JSON.stringify(existing));
    } catch (lsErr) {
      console.error('All storage attempts failed:', lsErr);
    }
  }
}

/**
 * Retrieves all saved local sessions from IndexedDB
 */
export async function idbGetAllSessions(): Promise<SavedDraft[]> {
  if (isDemo) return [];
  try {
    const db = await openDatabase();
    return await new Promise<SavedDraft[]>((resolve, reject) => {
      const tx = db.transaction(SESSIONS_STORE, 'readonly');
      const store = tx.objectStore(SESSIONS_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        const raw = req.result || [];
        const mapped = raw.map((item: any) => ({
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          isLocal: true,
        }));
        // Sort newest first
        mapped.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        resolve(mapped);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB get sessions failed, reading fallback:', err);
    return idbGetFallbackSessions();
  }
}

/**
 * Deletes a saved session from IndexedDB
 */
export async function idbDeleteSession(id: string): Promise<void> {
  if (isDemo) return;
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SESSIONS_STORE, 'readwrite');
      const store = tx.objectStore(SESSIONS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete failed:', err);
  }
  
  // Also clean from fallback
  try {
    const existing = idbGetFallbackSessions().filter(s => s.id !== id);
    localStorage.setItem(LS_FALLBACK_SESSIONS, JSON.stringify(existing));
  } catch {}
}

/**
 * Saves the active working state (layers, camera viewport, active session info)
 * so on app reload the user resumes EXACTLY where they left off.
 */
export async function idbSaveActiveState(state: ActiveAppState): Promise<void> {
  if (isDemo) return;
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STATE_STORE, 'readwrite');
      const store = tx.objectStore(STATE_STORE);
      const req = store.put({ key: ACTIVE_STATE_KEY, ...state });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save active state failed, saving fallback:', err);
  }

  // Also save lightweight metadata to localStorage so immediate synchronous boot can know session ID
  try {
    localStorage.setItem(LS_FALLBACK_ACTIVE, JSON.stringify({
      sessionId: state.sessionId,
      sessionTitle: state.sessionTitle,
      isCloud: state.isCloud,
      camera: state.camera,
      updatedAt: state.updatedAt
    }));
  } catch {}
}

/**
 * Loads the active working state from IndexedDB
 */
export async function idbLoadActiveState(): Promise<ActiveAppState | null> {
  if (isDemo) return null;
  try {
    const db = await openDatabase();
    return await new Promise<ActiveAppState | null>((resolve, reject) => {
      const tx = db.transaction(STATE_STORE, 'readonly');
      const store = tx.objectStore(STATE_STORE);
      const req = store.get(ACTIVE_STATE_KEY);

      req.onsuccess = () => {
        if (req.result) {
          const { key, ...rest } = req.result;
          resolve(rest as ActiveAppState);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB load active state failed:', err);
    return null;
  }
}

function idbGetFallbackSessions(): SavedDraft[] {
  try {
    const raw = localStorage.getItem(LS_FALLBACK_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((item: any) => ({
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      isLocal: true,
    }));
  } catch {
    return [];
  }
}

/**
 * One-time migration: migrates any legacy localStorage drafts/autosaves to IndexedDB
 * and removes obsolete storage keys to free up localStorage.
 */
export async function migrateLegacyLocalStorage(): Promise<void> {
  if (isDemo) return;
  try {
    // 1. Check legacy local sessions
    const legacySessionsRaw = localStorage.getItem('infinite_drafts_local_sessions_v1');
    if (legacySessionsRaw) {
      const sessions = JSON.parse(legacySessionsRaw);
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          await idbSaveSession({
            id: s.id || Math.random().toString(36).substring(2, 9),
            userId: 'local_device',
            title: s.title || 'Recovered Draft',
            layersData: s.layersData || '[]',
            createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
            updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
            isLocal: true,
          });
        }
      }
      localStorage.removeItem('infinite_drafts_local_sessions_v1');
    }

    // 2. Check legacy autosave
    const legacyAutoSave = localStorage.getItem('infinite_drafts_autosave_v1');
    if (legacyAutoSave) {
      try {
        const layers = JSON.parse(legacyAutoSave);
        if (Array.isArray(layers) && layers.length > 0) {
          const currentState = await idbLoadActiveState();
          if (!currentState) {
            await idbSaveActiveState({
              sessionId: null,
              sessionTitle: 'Untitled Draft',
              isCloud: false,
              layers,
              camera: { x: 0, y: 0, zoom: 1 },
              updatedAt: Date.now()
            });
          }
        }
      } catch {}
      // Clean up the large legacy key
      localStorage.removeItem('infinite_drafts_autosave_v1');
    }
  } catch (e) {
    console.warn('Legacy migration notice:', e);
  }
}
