import React from 'react';

export default function BrandLogo({ size = 'default', showParent = true, isStudio = false, iconOnly = false, className = '' }) {
  const isLarge = size === 'large';
  const iconSize = isLarge ? 36 : 28;

  return (
    <div className={`brand-logo-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      {/* Futuristic Geometric Nexus SVG Mark */}
      <div
        className="brand-logo-icon"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))' }}
        >
          <defs>
            <linearGradient id="brandG1" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="brandG2" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
          </defs>
          <polygon
            points="32,4 58,19 58,45 32,60 6,45 6,19"
            fill="#0c0e15"
            stroke="url(#brandG1)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M22 18 V46" stroke="url(#brandG2)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M42 20 L27 33 L43 45" stroke="url(#brandG1)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="font-display"
              style={{
                fontSize: isLarge ? '26px' : '20px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              Klyvora
            </span>
            {isStudio && (
              <span
                className="font-mono"
                style={{
                  fontSize: isLarge ? '12px' : '11px',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  background: 'rgba(6, 182, 212, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              >
                STUDIO
              </span>
            )}
          </div>
          {showParent && (
            <span
              className="font-mono"
              style={{
                fontSize: isLarge ? '11px' : '9.5px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: '3px',
              }}
            >
              by Xeorvia
            </span>
          )}
        </div>
      )}
    </div>
  );
}
