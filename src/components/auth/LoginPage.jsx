import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/useAuth';

export default function LoginPage({ onNavigate, redirectPath }) {
  const { signIn, signInWithGoogle, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleGoogleSignIn = async () => {
    setFormError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      const destination = redirectPath || '#/dashboard';
      if (onNavigate) {
        onNavigate(destination);
      } else {
        window.location.hash = destination;
      }
    } catch (err) {
      setFormError(err.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(trimmedEmail, password, rememberMe);
      const destination = redirectPath || '#/dashboard';
      if (onNavigate) {
        onNavigate(destination);
      } else {
        window.location.hash = destination;
      }
    } catch (err) {
      setFormError(err.message || 'The email or password is incorrect. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back to Klyvora"
      subtitle="Sign in to continue creating intelligent digital experiences with Klyvora Studio."
    >
      {!isConfigured && (
        <div className="auth-config-warning font-mono" role="alert">
          <AlertCircle size={15} className="text-amber" />
          <span>Notice: Firebase environment variables are not fully set. Check your .env configuration.</span>
        </div>
      )}

      {formError && (
        <div className="auth-error-banner font-mono" role="alert">
          <AlertCircle size={16} />
          <span>{formError}</span>
        </div>
      )}

      {/* Social Login Area: Continue with Google */}
      <div className="auth-social-area">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="btn-google-auth"
          aria-label="Continue with Google"
        >
          {googleLoading ? (
            <>
              <span className="auth-btn-spinner" aria-hidden="true" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Styled Horizontal Divider */}
      <div className="auth-divider font-mono" aria-hidden="true">
        <span className="auth-divider-line" />
        <span className="auth-divider-label">OR CONTINUE WITH EMAIL</span>
        <span className="auth-divider-line" />
      </div>

      {/* Authentication Form */}
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Email Field */}
        <div className="auth-field-group">
          <label htmlFor="login-email" className="auth-field-label font-mono">
            Email address
          </label>
          <div className="auth-input-container">
            <Mail size={18} className="auth-input-icon" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={loading || googleLoading}
              className="auth-text-input"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="auth-field-group">
          <div className="auth-field-header">
            <label htmlFor="login-password" className="auth-field-label font-mono">
              Password
            </label>
            <a
              href="#/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('#/forgot-password');
                else window.location.hash = '#/forgot-password';
              }}
              className="auth-forgot-link font-mono"
            >
              Forgot password?
            </a>
          </div>
          <div className="auth-input-container">
            <Lock size={18} className="auth-input-icon" aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={loading || googleLoading}
              className="auth-text-input auth-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-toggle-password-btn"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading || googleLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Custom Remember Me Checkbox Row */}
        <div className="auth-checkbox-row">
          <label className="auth-custom-checkbox font-mono" htmlFor="remember-me-checkbox">
            <input
              id="remember-me-checkbox"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading || googleLoading}
              className="auth-checkbox-input"
            />
            <span className="auth-checkbox-box" aria-hidden="true">
              <svg className="auth-check-icon" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7.5L5.5 10.5L11.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="auth-checkbox-text">Keep me signed in on this device</span>
          </label>
        </div>

        {/* Primary Login Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-auth-primary font-mono"
        >
          {loading ? (
            <>
              <span className="auth-btn-spinner" aria-hidden="true" />
              <span>Signing in to Studio...</span>
            </>
          ) : (
            <>
              <span>Sign in to Studio</span>
              <ArrowRight size={17} className="auth-btn-arrow" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign Up */}
      <div className="auth-switch-row font-mono">
        <span>Don’t have a Klyvora account?</span>{' '}
        <a
          href="#/signup"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('#/signup');
            else window.location.hash = '#/signup';
          }}
          className="auth-switch-link"
        >
          Create an account <Sparkles size={13} className="inline-icon text-cyan" />
        </a>
      </div>
    </AuthLayout>
  );
}
