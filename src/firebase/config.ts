/**
 * DAYFLOW — Firebase Configuration & Storage Architecture
 * 
 * Supports production Firebase Auth, Firestore, and Storage.
 * If Firebase environment variables are not supplied, DAYFLOW operates
 * seamlessly via its reactive local-persistence DataService layer.
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

if (!isFirebaseConfigured) {
  // In development and demo mode, graceful fallback ensures the app runs 100% reliably
  // without external network dependencies.
}
