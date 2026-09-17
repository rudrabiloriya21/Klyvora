import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase/firebaseConfig';
import { getFriendlyAuthErrorMessage } from '../services/firebase/authErrors';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('klyvora_guest_mode') === 'true') {
        return {
          uid: 'guest_klyvora_user',
          displayName: 'Guest Creator',
          email: 'guest@klyvora.app',
          emailVerified: true,
          isAnonymous: true,
        };
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(() => Boolean(auth && isFirebaseConfigured));
  const [authError, setAuthError] = useState(null);

  // Subscribe to Firebase auth state changes with safety timeout
  useEffect(() => {
    const isGuest = typeof window !== 'undefined' && localStorage.getItem('klyvora_guest_mode') === 'true';

    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Safety timeout: loading will NEVER hang longer than 1500ms under any network conditions
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          clearTimeout(safetyTimer);
          if (user) {
            setCurrentUser(user);
            try {
              localStorage.removeItem('klyvora_guest_mode');
            } catch {}
          } else if (isGuest) {
            // Keep guest session active
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
          setAuthError(null);
        },
        (error) => {
          clearTimeout(safetyTimer);
          console.warn('[Klyvora Auth] State listener notice:', error);
          setAuthError(getFriendlyAuthErrorMessage(error));
          setLoading(false);
        }
      );
    } catch (err) {
      clearTimeout(safetyTimer);
      console.warn('[Klyvora Auth] Failed to attach auth listener:', err);
      setLoading(false);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const continueAsGuest = useCallback(() => {
    const guestUser = {
      uid: 'guest_klyvora_user',
      displayName: 'Guest Creator',
      email: 'guest@klyvora.app',
      emailVerified: true,
      isAnonymous: true,
    };
    setCurrentUser(guestUser);
    try {
      localStorage.setItem('klyvora_guest_mode', 'true');
    } catch {}
    return guestUser;
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  /**
   * Register a new user with Email, Password, and Full Name.
   * Immediately updates Firebase profile and sends verification email.
   */
  const signUp = useCallback(async (email, password, displayName) => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    setAuthError(null);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName && cred.user) {
        await updateProfile(cred.user, { displayName });
      }

      // Send verification email
      if (cred.user) {
        try {
          await sendEmailVerification(cred.user);
        } catch (verr) {
          console.warn('[Klyvora Auth] Verification email could not be sent automatically:', verr);
        }
      }

      setCurrentUser(auth.currentUser);
      return cred.user;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Sign in existing user with Email & Password with session persistence.
   */
  const signIn = useCallback(async (email, password, rememberMe = true) => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    setAuthError(null);

    try {
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      } catch (pErr) {
        console.warn('[Klyvora Auth] Could not set session persistence:', pErr);
      }
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(cred.user);
      return cred.user;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Fast Sign in / Sign up with Google OAuth Provider.
   */
  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    setAuthError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      setCurrentUser(cred.user);
      return cred.user;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Sign out current user and clear any local sessions.
   */
  const logOut = useCallback(async () => {
    try {
      localStorage.removeItem('klyvora_guest_mode');
    } catch {}
    if (!auth) {
      setCurrentUser(null);
      return;
    }
    setAuthError(null);

    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Send password reset email.
   */
  const resetPassword = useCallback(async (email) => {
    if (!auth) throw new Error('Firebase Authentication is not configured.');
    setAuthError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Resend email verification.
   */
  const resendVerification = useCallback(async () => {
    if (!auth || !auth.currentUser) throw new Error('No user is currently signed in.');
    setAuthError(null);

    try {
      await sendEmailVerification(auth.currentUser);
      return true;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Refresh the current user object to sync emailVerified status.
   */
  const reloadUser = useCallback(async () => {
    if (!auth || !auth.currentUser) return null;

    try {
      await auth.currentUser.reload();
      setCurrentUser({ ...auth.currentUser });
      return auth.currentUser;
    } catch (err) {
      console.warn('[Klyvora Auth] Failed to reload user state:', err);
      return auth.currentUser;
    }
  }, []);

  /**
   * Update current user's display name.
   */
  const updateUserProfile = useCallback(async (displayName) => {
    if (!auth || !auth.currentUser) throw new Error('No user is currently signed in.');
    setAuthError(null);

    try {
      await updateProfile(auth.currentUser, { displayName });
      setCurrentUser({ ...auth.currentUser });
      return true;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Change current password with re-authentication.
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!auth || !auth.currentUser || !auth.currentUser.email) {
      throw new Error('No active user to update.');
    }
    setAuthError(null);

    try {
      // Re-authenticate first
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPassword);
      return true;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  /**
   * Permanently delete user account with re-authentication.
   */
  const deleteUserAccount = useCallback(async (currentPassword) => {
    if (!auth || !auth.currentUser || !auth.currentUser.email) {
      throw new Error('No active user to delete.');
    }
    setAuthError(null);

    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await deleteUser(auth.currentUser);
      setCurrentUser(null);
      return true;
    } catch (err) {
      const friendly = getFriendlyAuthErrorMessage(err);
      setAuthError(friendly);
      throw new Error(friendly);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      authError,
      isConfigured: isFirebaseConfigured,
      signUp,
      signIn,
      signInWithGoogle,
      logOut,
      resetPassword,
      resendVerification,
      reloadUser,
      updateUserProfile,
      changePassword,
      deleteUserAccount,
      clearAuthError,
      continueAsGuest,
    }),
    [
      currentUser,
      loading,
      authError,
      signUp,
      signIn,
      signInWithGoogle,
      logOut,
      resetPassword,
      resendVerification,
      reloadUser,
      updateUserProfile,
      changePassword,
      deleteUserAccount,
      clearAuthError,
      continueAsGuest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
