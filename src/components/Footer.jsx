import React from 'react';
import BrandLogo from './BrandLogo';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenXeorvia }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root" role="contentinfo">
      <div className="container footer-container">
        {/* Top Tier: Logo, Mission, Back-to-top */}
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <BrandLogo size="large" />
            <p className="footer-tagline">
              A modern digital experience created by Xeorvia—designed with purpose,
              built for what comes next.
            </p>
            <div className="built-by-pill">
              <span className="font-mono built-by-label">PRESENTED BY</span>
              <button
                type="button"
                onClick={onOpenXeorvia}
                className="built-by-btn font-mono"
                aria-label="Discover Xeorvia"
              >
                XEORVIA
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title font-mono">NAVIGATION</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About Klyvora</a>
              </li>
              <li>
                <a href="#features">Capabilities</a>
              </li>
              <li>
                <a href="#showcase">Showcase</a>
              </li>
              <li>
                <a href="#xeorvia">The Xeorvia Story</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          {/* System & Ethos Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title font-mono">ARCHITECTURE</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-static-item">Obsidian Design System</span>
              </li>
              <li>
                <span className="footer-static-item">Vanilla CSS Tokens</span>
              </li>
              <li>
                <span className="footer-static-item">Reactive Ambient Mesh</span>
              </li>
              <li>
                <span className="footer-static-item">Responsive Framework</span>
              </li>
            </ul>
          </div>

          {/* Back to top button */}
          <div className="footer-top-action-col">
            <button
              onClick={scrollToTop}
              className="btn btn-secondary back-to-top-btn"
              aria-label="Return to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Legal Modal Triggers */}
        <div className="footer-bottom-bar">
          <div className="copyright-text font-mono">
            © {new Date().getFullYear()} Klyvora. Developed and presented by Xeorvia. All rights reserved.
          </div>

          <div className="legal-links font-mono">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="legal-link-btn"
            >
              Privacy Policy
            </button>
            <span className="legal-sep">·</span>
            <button
              type="button"
              onClick={onOpenTerms}
              className="legal-link-btn"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
