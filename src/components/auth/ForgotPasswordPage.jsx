import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/useAuth';

export default function ForgotPasswordPage({ onNavigate }) {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

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

    setLoading(true);
    try {
      await resetPassword(trimmedEmail);
      setSubmitted(true);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('network')) {
        setFormError(err.message);
      } else {
        // Privacy-safe fallback so external observers cannot probe for valid emails
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send a secure password reset link to your inbox."
    >
      {!isConfigured && (
        <div className="auth-config-warning font-mono" role="alert">
          <AlertCircle size={15} className="text-amber" />
          <span>Notice: Firebase environment variables are not fully set. Check your .env configuration.</span>
        </div>
      )}

      {submitted ? (
        <div className="auth-feedback-card">
          <div className="auth-feedback-icon-wrap">
            <CheckCircle2 size={38} className="text-cyan" />
          </div>
          <h2 className="auth-feedback-title font-display">Check your inbox</h2>
          <p className="auth-feedback-text">
            If an account exists matching <strong className="text-white">{email}</strong>, a secure password reset link has
            been dispatched. Please inspect your inbox and spam folders.
          </p>
          <div className="auth-btn-row">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('#/login');
                else window.location.hash = '#/login';
              }}
              className="btn-auth-primary font-mono"
            >
              <ArrowLeft size={16} />
              <span>Return to Sign In</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {formError && (
            <div className="auth-error-banner font-mono" role="alert">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field-group">
              <label htmlFor="reset-email" className="auth-field-label font-mono">
                Account email
              </label>
              <div className="auth-input-container">
                <Mail size={18} className="auth-input-icon" aria-hidden="true" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="auth-text-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-auth-primary font-mono"
            >
              {loading ? (
                <>
                  <span className="auth-btn-spinner" aria-hidden="true" />
                  <span>Transmitting Reset Link...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-switch-row font-mono">
            <a
              href="#/login"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('#/login');
                else window.location.hash = '#/login';
              }}
              className="auth-switch-link"
            >
              <ArrowLeft size={14} className="inline-icon" /> Return to sign in
            </a>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
