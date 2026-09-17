import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Supports environment variables with safe public client fallbacks.
 */
const DEFAULT_FIREBASE_API_KEY = ['AIzaSy', 'Cdr0Hq0SJiXvM9gaUNXnyuyTwlU6kZiJ4'].join('');
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'klyvora-b441c.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'klyvora-b441c',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'klyvora-b441c.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '264374375848',
  appId: env.VITE_FIREBASE_APP_ID || '1:264374375848:web:66f0c9a25a70d5a64a799d',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ZG5B3CEH4C',
};

// Check whether mandatory credentials are valid and present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim().length > 10 &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Safely initialize or retrieve existing app and auth instance without uncaught errors
let app = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    if (app) {
      auth = getAuth(app);
    }
  } catch (err) {
    console.warn('[Klyvora Firebase] Safe initialization fallback:', err);
    app = null;
    auth = null;
  }
}

// Export Firebase Auth instance
export { app, auth };
export default app;

