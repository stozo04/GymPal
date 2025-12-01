
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { UserData } from "../types";

// Firestore only (no localStorage fallback)
// Env keys expected (add to .env.local):
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

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
    throw new Error('Firebase config missing');
  }
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app, FIRESTORE_DB_ID);
    return db;
  } catch (err) {
    throw err;
  }
};

export const storageService = {
  getUserData: (): UserData | null => {
    return null;
  },

  saveUserData: async (data: Partial<UserData>): Promise<void> => {
    const db = getDb();
    try {
      const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);
      await setDoc(ref, data, { merge: true });
    } catch (e) {
      console.error("Firestore write error", e);
      throw e;
    }
  },

  subscribe: (callback: (data: UserData | null) => void) => {
    const db = getDb();

    // Firestore realtime listener
    const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC);

    // Also fetch once to hydrate local cache if it exists
    getDoc(ref).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        callback(data);
      }
    }).catch(err => console.error("Firestore initial read error", err));

    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        callback(data);
      } else {
        callback(null);
      }
    }, (error) => console.error("Firestore subscribe error", error));

    return unsub;
  }
};
