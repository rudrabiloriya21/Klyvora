/**
 * Converts Firebase error codes into human-readable, professional user messages.
 * Prevents exposing raw error codes or leaking sensitive system internals.
 */
export function getFriendlyAuthErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';

  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account was found matching this email. Please sign up or check for typos.';
    case 'auth/wrong-password':
      return 'The email or password you entered is incorrect.';
    case 'auth/invalid-credential':
      return 'The email or password you entered is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 8 characters with numbers and symbols.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access temporarily locked for security. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been deactivated. Please reach out to Xeorvia support.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in your Firebase project. Please enable it in the Firebase Console under Authentication > Sign-in method.';
    case 'auth/network-request-failed':
      return 'Unable to connect to the network. Please check your internet connection and try again.';
    case 'auth/requires-recent-login':
      return 'For your security, please sign in again before performing this sensitive operation.';
    case 'auth/popup-closed-by-user':
      return 'Google authentication window was closed before completion.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by the browser. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Authentication request was superseded by a newer request.';
    case 'auth/expired-action-code':
      return 'The verification or reset link has expired. Please request a new one.';
    case 'auth/invalid-action-code':
      return 'The verification or reset link is invalid. It may have already been used.';
    default:
      if (error.message && error.message.includes('API key')) {
        return 'Firebase configuration error: Invalid API key. Please check your environment variables.';
      }
      return error.message || 'An unexpected authentication error occurred. Please try again.';
  }
}
