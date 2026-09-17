import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RotateCw, LogOut, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/useAuth';

export default function EmailVerificationPage({ onNavigate }) {
  const { currentUser, resendVerification, reloadUser, logOut } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const isVerified = Boolean(currentUser?.emailVerified);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Periodic check if tab remains active
  useEffect(() => {
    if (isVerified) return;
    const interval = setInterval(async () => {
      await reloadUser();
    }, 5000);
    return () => clearInterval(interval);
  }, [isVerified, reloadUser]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setFeedback({ type: '', text: '' });

    try {
      await resendVerification();
      setFeedback({ type: 'success', text: 'New verification email transmitted. Please check your inbox.' });
      setCooldown(60);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to dispatch verification email.' });
    } finally {
      setIsResending(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    setFeedback({ type: '', text: '' });
    try {
      const refreshed = await reloadUser();
      if (refreshed?.emailVerified) {
        setFeedback({ type: 'success', text: 'Email verified successfully! You may now enter Studio.' });
      } else {
        setFeedback({ type: 'info', text: 'Verification not detected yet. Please click the link in your email.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Could not refresh verification status. Please check your connection.' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContinue = () => {
    if (onNavigate) {
      onNavigate('#/dashboard');
    } else {
      window.location.hash = '#/dashboard';
    }
  };

  const handleLogout = async () => {
    await logOut();
    if (onNavigate) {
      onNavigate('#/login');
    } else {
      window.location.hash = '#/login';
    }
  };

  return (
    <AuthLayout
      title={isVerified ? 'Email verified' : 'Verify your email'}
      subtitle={
        isVerified
          ? 'Your identity has been confirmed. Welcome to Klyvora Studio.'
          : 'A verification link was dispatched to your email address.'
      }
    >
      <div className="verification-card-inner">
        <div className="verification-icon-box">
          {isVerified ? (
            <CheckCircle2 size={40} className="text-cyan" />
          ) : (
            <Mail size={40} className="text-violet" />
          )}
        </div>

        <div className="verification-email-chip font-mono">
          <span>{currentUser?.email || 'user@example.com'}</span>
        </div>

        {feedback.text && (
          <div
            className={`auth-alert-banner font-mono ${
              feedback.type === 'success'
                ? 'alert-success'
                : feedback.type === 'error'
                ? 'alert-error'
                : 'alert-info'
            }`}
            role="alert"
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : feedback.type === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <ShieldAlert size={16} />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {isVerified ? (
          <div className="verified-success-actions">
            <p className="verified-note">
              Your account is in good standing. You now have full access to website generation, live
              canvas editing, and deployment features.
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="btn-auth-primary font-mono"
            >
              <span>Enter Klyvora Studio</span>
              <ArrowRight size={17} className="auth-btn-arrow" />
            </button>
          </div>
        ) : (
          <div className="unverified-guidance">
            <p className="verification-instruction-text">
              Please inspect your inbox and click the confirmation link. If you do not see it
              within a few moments, check your spam or promotional folders.
            </p>

            <div className="verification-buttons-grid">
              <button
                type="button"
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
                className="btn-auth-primary font-mono"
              >
                <RotateCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
                <span>{isRefreshing ? 'Checking Status...' : 'I’ve Verified It'}</span>
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="btn-auth-secondary font-mono"
              >
                <Mail size={15} />
                <span>
                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : isResending
                    ? 'Transmitting...'
                    : 'Resend Email'}
                </span>
              </button>
            </div>

            <div className="verification-sub-actions">
              <button
                type="button"
                onClick={handleContinue}
                className="verify-continue-anyway-btn font-mono"
              >
                <span>Continue to Dashboard (Preview Mode) &rarr;</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout-link font-mono"
              >
                <LogOut size={13} />
                <span>Sign in with different account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
