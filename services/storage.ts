
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { UserData } from "../types";

// Persist to Firestore when Firebase env vars are present; otherwise fall back to localStorage.
// Env keys expected (add to .env.local):
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

const STORAGE_KEY = 'gympal_data_v3';
const FIRESTORE_COLLECTION = 'gympal';
const FIRESTORE_DOC = 'user';
const FIRESTORE_DB_ID = import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

const getDb = () => {
  if (!hasFirebaseConfig) {
    return null;
  }
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app, FIRESTORE_DB_ID);
    return db;
  } catch (err) {
    return null;
  }
};

const readLocal = (): UserData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Storage read error", e);
    return null;
  }
};

const writeLocal = (data: Partial<UserData>) => {
  try {
    const current = readLocal() || {};
    const merged = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error("Storage write error", e);
  }
};

export const storageService = {
  getUserData: (): UserData | null => {
    // Return the cached local data immediately; Firestore will sync via subscribe.
    return readLocal();
  },

  saveUserData: async (data: Partial<UserData>): Promise<void> => {
    writeLocal(data);

    const db = getDb();
    if (!db) return Promise.resolve();
    try {
      const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
      await setDoc(ref, data, { merge: true });
    } catch (e) {
      console.error("Firestore write error", e);
    }
  },

  subscribe: (callback: (data: UserData | null) => void) => {
    // Initial emit from cache
    callback(readLocal());

    const db = getDb();
    if (!db) {
      // Local fallback with cross-tab sync
      const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
          callback(e.newValue ? JSON.parse(e.newValue) : null);
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }

    // Firestore realtime listener
    const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);

    // Also fetch once to hydrate local cache if it exists
    getDoc(ref).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        writeLocal(data);
        callback(data);
      }
    }).catch(err => console.error("Firestore initial read error", err));

    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        writeLocal(data);
        callback(data);
      } else {
        callback(null);
      }
    }, (error) => console.error("Firestore subscribe error", error));

    return unsub;
  }
};
