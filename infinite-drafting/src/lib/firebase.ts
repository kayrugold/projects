import { isDemo } from './runtime';
import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

export const app = isDemo ? null : initializeApp(firebaseConfig);

// Initialize with long polling fallback which is more stable in sandboxed iframe environments
export const db = isDemo ? null : initializeFirestore(app!, {
  experimentalAutoDetectLongPolling: true
}, config.firestoreDatabaseId);

export const auth = isDemo ? null : getAuth(app!);

// Soft connection test (no longer forces a server fetch to prevent SDK console spam on slow networks)
export async function testConnection() {
  console.log('Firebase initialized. Network connection will be established dynamically.');
}
