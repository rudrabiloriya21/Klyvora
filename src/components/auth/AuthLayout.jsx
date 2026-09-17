import React from 'react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-root-wrapper">
      {/* Background Subtle Grid Texture */}
      <div className="auth-grid-bg" aria-hidden="true" />

      {/* Ambient Lighting Orbs */}
      <div className="ambient-lighting" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      <div className="auth-container">
        {/* Centered Glass-style Authentication Card */}
        <main className="auth-card glass-card">
          {/* Brand Header */}
          <div className="auth-brand-header">
            <a href="#/" className="auth-brand-link" aria-label="Return to Klyvora Homepage">
              <div className="auth-logo-icon-wrap">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="auth-logo-svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="authBrandG1" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="authBrandG2" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#C4B5FD" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="32,4 58,19 58,45 32,60 6,45 6,19"
                    fill="#0c0e15"
                    stroke="url(#authBrandG1)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path d="M22 18 V46" stroke="url(#authBrandG2)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M42 20 L27 33 L43 45" stroke="url(#authBrandG1)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="auth-brand-title font-display">KLYVORA</span>
              <span className="auth-brand-sub font-mono">BY XEORVIA</span>
            </a>

            {/* Small Product Label */}
            <div className="auth-product-badge font-mono">
              <span className="auth-product-badge-dot" aria-hidden="true" />
              <span>Klyvora Studio</span>
            </div>
          </div>

          {/* Heading & Supporting Description */}
          <div className="auth-card-head">
            <h1 className="auth-card-title font-display">{title}</h1>
            {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
          </div>

          {/* Form / Auth Flow Content */}
          <div className="auth-card-body">
            {children}
          </div>
        </main>

        {/* Polished Footer */}
        <footer className="auth-footer font-mono">
          <div className="auth-security-badge">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="auth-shield-icon"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Protected by Xeorvia Security Architecture</span>
          </div>
          <div className="auth-footer-links">
            <a href="#/" className="auth-footer-link">Home</a>
            <span className="auth-sep" aria-hidden="true">&bull;</span>
            <a
              href="#/privacy"
              onClick={(e) => {
                e.preventDefault();
                alert('Privacy Policy: Klyvora does not sell personal data. Your workspace projects and credentials remain strictly yours.');
              }}
              className="auth-footer-link"
            >
              Privacy
            </a>
            <span className="auth-sep" aria-hidden="true">&bull;</span>
            <a
              href="#/terms"
              onClick={(e) => {
                e.preventDefault();
                alert('Terms of Service: By using Klyvora Studio, you agree to build purposeful digital experiences with architectural integrity.');
              }}
              className="auth-footer-link"
            >
              Terms
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
