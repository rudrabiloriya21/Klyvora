import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Supports environment variables with safe fallbacks.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'klyvora-b441c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'klyvora-b441c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'klyvora-b441c.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '264374375848',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:264374375848:web:66f0c9a25a70d5a64a799d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ZG5B3CEH4C',
};

// Check whether mandatory credentials are present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Initialize or retrieve existing app instance
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.error('[Klyvora Firebase] Initialization failed:', err);
}

// Export Firebase Auth instance
export const auth = app ? getAuth(app) : null;
export default app;
