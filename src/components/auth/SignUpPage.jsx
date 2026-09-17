import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Check, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/useAuth';

export default function SignUpPage({ onNavigate }) {
  const { signUp, signInWithGoogle, isConfigured } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleGoogleSignUp = async () => {
    setFormError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      if (onNavigate) {
        onNavigate('#/dashboard');
      } else {
        window.location.hash = '#/dashboard';
      }
    } catch (err) {
      setFormError(err.message || 'Google sign-up could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // 4-tier Password Strength Calculation
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', activeBars: 0, color: 'transparent' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', activeBars: 1, color: '#ef4444' };
    if (score === 2) return { score: 50, label: 'Fair', activeBars: 2, color: '#f59e0b' };
    if (score === 3 || score === 4) return { score: 75, label: 'Strong', activeBars: 3, color: '#06b6d4' };
    return { score: 100, label: 'Excellent', activeBars: 4, color: '#10b981' };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must contain at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setFormError('Password must include uppercase, lowercase, and numbers.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify both fields.');
      return;
    }
    if (!acceptTerms) {
      setFormError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await signUp(trimmedEmail, password, trimmedName);
      if (onNavigate) {
        onNavigate('#/verify-email');
      } else {
        window.location.hash = '#/verify-email';
      }
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your Klyvora account"
      subtitle="Join the Xeorvia digital creation ecosystem and build intelligent websites."
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

      {/* Social Login Area */}
      <div className="auth-social-area">
        <button
          type="button"
          onClick={handleGoogleSignUp}
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

      {/* Divider */}
      <div className="auth-divider font-mono" aria-hidden="true">
        <span className="auth-divider-line" />
        <span className="auth-divider-label">OR CONTINUE WITH EMAIL</span>
        <span className="auth-divider-line" />
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Full Name */}
        <div className="auth-field-group">
          <label htmlFor="signup-name" className="auth-field-label font-mono">
            Full name
          </label>
          <div className="auth-input-container">
            <User size={18} className="auth-input-icon" aria-hidden="true" />
            <input
              id="signup-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="e.g. Elena Vance"
              required
              autoComplete="name"
              disabled={loading || googleLoading}
              className="auth-text-input"
            />
          </div>
        </div>

        {/* Email */}
        <div className="auth-field-group">
          <label htmlFor="signup-email" className="auth-field-label font-mono">
            Email address
          </label>
          <div className="auth-input-container">
            <Mail size={18} className="auth-input-icon" aria-hidden="true" />
            <input
              id="signup-email"
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

        {/* Password */}
        <div className="auth-field-group">
          <label htmlFor="signup-password" className="auth-field-label font-mono">
            Password
          </label>
          <div className="auth-input-container">
            <Lock size={18} className="auth-input-icon" aria-hidden="true" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
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

          {/* Polished 4-segment Password Strength Bar */}
          {password && (
            <div className="auth-strength-container">
              <div className="auth-strength-bars">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="auth-strength-segment"
                    style={{
                      backgroundColor: bar <= strength.activeBars ? strength.color : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
              <div className="auth-strength-label-row font-mono">
                <span>
                  Strength: <strong style={{ color: strength.color }}>{strength.label}</strong>
                </span>
                <span>Min 8 characters</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="auth-field-group">
          <label htmlFor="signup-confirm-password" className="auth-field-label font-mono">
            Confirm password
          </label>
          <div className="auth-input-container">
            <Lock size={18} className="auth-input-icon" aria-hidden="true" />
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
              disabled={loading || googleLoading}
              className="auth-text-input auth-password-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="auth-toggle-password-btn"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
              disabled={loading || googleLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword && password === confirmPassword && (
            <div className="auth-match-indicator font-mono">
              <Check size={13} className="text-cyan" />
              <span>Passwords match</span>
            </div>
          )}
        </div>

        {/* Custom Terms & Privacy Checkbox */}
        <div className="auth-checkbox-row">
          <label className="auth-custom-checkbox font-mono" htmlFor="signup-terms-checkbox">
            <input
              id="signup-terms-checkbox"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (formError) setFormError('');
              }}
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
            <span className="auth-checkbox-text">
              I agree to the{' '}
              <a
                href="#/terms"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Terms of Service: By using Klyvora Studio, you agree to build purposeful digital experiences with architectural integrity.');
                }}
                className="auth-link-highlight"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Privacy Policy: Klyvora does not sell personal data. Your workspace projects and credentials remain strictly yours.');
                }}
                className="auth-link-highlight"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-auth-primary font-mono"
        >
          {loading ? (
            <>
              <span className="auth-btn-spinner" aria-hidden="true" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={17} />
              <span>Create Studio Account</span>
              <ArrowRight size={17} className="auth-btn-arrow" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="auth-switch-row font-mono">
        <span>Already have a Klyvora account?</span>{' '}
        <a
          href="#/login"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('#/login');
            else window.location.hash = '#/login';
          }}
          className="auth-switch-link"
        >
          Sign in
        </a>
      </div>
    </AuthLayout>
  );
}
