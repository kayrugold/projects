import { isDemo } from './runtime';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Layer, Camera } from '../types';
import { serializeSessionData, deserializeSessionData, serializeLayers, deserializeLayers } from './compression';
import { 
  idbSaveSession, 
  idbGetAllSessions, 
  idbDeleteSession, 
  idbSaveActiveState, 
  idbLoadActiveState,
  migrateLegacyLocalStorage,
  ActiveAppState
} from './storage';

export interface DrawingSession {
  id: string;
  userId: string;
  title: string;
  layersData: string; // JSON or compressed base64 (gz:...)
  createdAt: Date;
  updatedAt: Date;
  isLocal?: boolean;
  camera?: Camera;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Run legacy local storage migration on import
if (!isDemo && typeof window !== 'undefined') {
  migrateLegacyLocalStorage().catch(() => {});
}

/**
 * Saves a session locally to IndexedDB with full compression and camera support
 */
export async function saveLocalSession(
  id: string, 
  title: string, 
  layers: Layer[], 
  camera?: Camera
): Promise<DrawingSession> {
  const existingList = await idbGetAllSessions();
  const existing = existingList.find(s => s.id === id);
  const now = new Date();

  const layersData = await serializeSessionData(layers, camera);
  const sessionObj: DrawingSession = {
    id,
    userId: 'local_device',
    title,
    layersData,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
    isLocal: true,
    camera
  };

  await idbSaveSession(sessionObj);

  // Also update active state pointer
  await idbSaveActiveState({
    sessionId: id,
    sessionTitle: title,
    isCloud: false,
    layers,
    camera: camera || { x: 0, y: 0, zoom: 1 },
    updatedAt: Date.now()
  });

  return sessionObj;
}

/**
 * Loads all locally saved sessions from IndexedDB
 */
export async function loadLocalSessions(): Promise<DrawingSession[]> {
  return await idbGetAllSessions();
}

/**
 * Deletes a locally saved session from IndexedDB
 */
export async function deleteLocalSession(id: string): Promise<void> {
  await idbDeleteSession(id);
}

/**
 * Saves active canvas state including layers, camera viewport, and active draft info
 */
export async function saveActiveState(
  layers: Layer[], 
  camera: Camera, 
  sessionInfo?: { id: string | null; title: string; isCloud: boolean }
): Promise<void> {
  await idbSaveActiveState({
    sessionId: sessionInfo?.id || null,
    sessionTitle: sessionInfo?.title || 'Untitled Draft',
    isCloud: !!sessionInfo?.isCloud,
    layers,
    camera,
    updatedAt: Date.now()
  });
}

/**
 * Backwards compatible helper for autosaving layers
 */
export async function saveAutoSave(
  layers: Layer[], 
  camera?: Camera, 
  sessionInfo?: { id: string | null; title: string; isCloud: boolean }
): Promise<void> {
  return saveActiveState(layers, camera || { x: 0, y: 0, zoom: 1 }, sessionInfo);
}

/**
 * Loads the active canvas state including camera and active session info
 */
export async function loadActiveState(): Promise<ActiveAppState | null> {
  return await idbLoadActiveState();
}

/**
 * Backwards compatible helper for loading autosaved layers
 */
export async function loadAutoSave(): Promise<Layer[] | null> {
  const state = await idbLoadActiveState();
  return state?.layers || null;
}

function parseFirestoreDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) return val;
  if (typeof val === 'number') return new Date(val);
  return new Date(String(val));
}

/**
 * Saves or updates a session in Cloud Firestore.
 * Automatically compresses large vector drawings to stay well within
 * Firestore's 1MB document limit.
 * Stores camera inside layersData payload for complete viewport preservation.
 */
export async function saveSession(
  id: string, 
  title: string, 
  layers: Layer[], 
  camera?: Camera
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const path = `users/${user.uid}/sessions/${id}`;
  const sessionRef = doc(db, 'users', user.uid, 'sessions', id);

  try {
    const layersData = await serializeSessionData(layers, camera);
    
    // Check if the document already exists in Firestore
    let exists = false;
    try {
      const existingSnap = await getDoc(sessionRef);
      exists = existingSnap.exists();
    } catch {
      exists = false;
    }

    if (exists) {
      await updateDoc(sessionRef, {
        title,
        layersData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(sessionRef, {
        userId: user.uid,
        title,
        layersData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Also update active state so refresh loads this cloud draft
    await idbSaveActiveState({
      sessionId: id,
      sessionTitle: title,
      isCloud: true,
      layers,
      camera: camera || { x: 0, y: 0, zoom: 1 },
      updatedAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Renames a local IndexedDB session or Cloud Firestore session
 */
export async function renameSessionTitle(
  session: DrawingSession, 
  newTitle: string
): Promise<DrawingSession> {
  const trimmedTitle = newTitle.trim() || 'Untitled Draft';
  const now = new Date();

  if (session.isLocal) {
    const existingList = await idbGetAllSessions();
    const existing = existingList.find(s => s.id === session.id);
    const updatedObj: DrawingSession = {
      ...(existing || session),
      title: trimmedTitle,
      updatedAt: now,
      isLocal: true,
    };
    await idbSaveSession(updatedObj);

    // Update active state if active
    const activeState = await idbLoadActiveState();
    if (activeState && activeState.sessionId === session.id) {
      await idbSaveActiveState({
        ...activeState,
        sessionTitle: trimmedTitle,
        updatedAt: Date.now()
      });
    }

    return updatedObj;
  } else {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const path = `users/${user.uid}/sessions/${session.id}`;
    const sessionRef = doc(db, 'users', user.uid, 'sessions', session.id);

    try {
      await updateDoc(sessionRef, {
        title: trimmedTitle,
        updatedAt: serverTimestamp()
      });

      const activeState = await idbLoadActiveState();
      if (activeState && activeState.sessionId === session.id) {
        await idbSaveActiveState({
          ...activeState,
          sessionTitle: trimmedTitle,
          updatedAt: Date.now()
        });
      }

      return {
        ...session,
        title: trimmedTitle,
        updatedAt: now,
        isLocal: false,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}

export async function updateSession(
  id: string, 
  title: string, 
  layers: Layer[], 
  camera?: Camera
): Promise<void> {
  return saveSession(id, title, layers, camera);
}

export async function loadSessions(): Promise<DrawingSession[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = `users/${user.uid}/sessions`;
  try {
    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId || user.uid,
        title: data.title || 'Untitled Draft',
        layersData: data.layersData || '[]',
        createdAt: parseFirestoreDate(data.createdAt),
        updatedAt: parseFirestoreDate(data.updatedAt),
        isLocal: false
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteSession(id: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const path = `users/${user.uid}/sessions/${id}`;
  try {
    const sessionRef = doc(db, 'users', user.uid, 'sessions', id);
    await deleteDoc(sessionRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export { deserializeSessionData, deserializeLayers, serializeSessionData, serializeLayers };
