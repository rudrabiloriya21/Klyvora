import React, { useEffect } from 'react';
import { X, Compass, ArrowRight } from 'lucide-react';

export default function XeorviaModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="xeorvia-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-content modal-content-wide glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Compass size={22} className="text-cyan" />
            <h3 id="xeorvia-modal-title" className="modal-title font-display">
              The Xeorvia Creative Manifesto
            </h3>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="xeorvia-manifesto-modal-body">
            <div className="badge-pill font-mono">
              <span className="badge-dot badge-dot-violet" />
              <span>PARENT BRAND MISSION</span>
            </div>

            <h2 className="xeorvia-modal-heading font-display">
              Where Technology, Creativity, and Ambitious Ideas Converge.
            </h2>

            <p className="xeorvia-modal-lead">
              Xeorvia was founded with a singular directive: to counter digital homogenization by
              crafting digital brands, interfaces, and technological architectures that feel
              purposeful, poetic, and uncompromisingly modern.
            </p>

            <div className="manifesto-principles-grid">
              <div className="principle-card glass-card">
                <span className="principle-num font-mono">01 // RESTRAINT</span>
                <h4 className="principle-title font-display">Deliberate Minimalism</h4>
                <p className="principle-text">
                  True luxury and future-focused design arise from clarity, spatial balance, and
                  confident typography—never from chaotic clutter or excessive neon.
                </p>
              </div>

              <div className="principle-card glass-card">
                <span className="principle-num font-mono">02 // SUBSTANCE</span>
                <h4 className="principle-title font-display">Authentic Engineering</h4>
                <p className="principle-text">
                  We build digital experiences grounded in solid web standards, fast load times,
                  and meaningful user journeys. Every claim is rooted in genuine capability.
                </p>
              </div>

              <div className="principle-card glass-card">
                <span className="principle-num font-mono">03 // EVOLUTION</span>
                <h4 className="principle-title font-display">Future-Ready Foundations</h4>
                <p className="principle-text">
                  Klyvora represents the leading edge of the Xeorvia roadmap—a platform built to
                  adapt as interaction paradigms evolve across devices and spatial mediums.
                </p>
              </div>
            </div>

            <div className="xeorvia-modal-quote-box glass-card">
              <p className="quote-text font-display">
                “Klyvora is more than an interface; it is an exploration of what digital experiences
                can feel like when executed with care and vision.”
              </p>
              <div className="quote-author font-mono">
                <span>— XEORVIA CORE ARCHITECTURE COLLECTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              onClose();
              document.querySelector('#showcase')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-primary"
            style={{ padding: '10px 24px' }}
          >
            <span>Explore Klyvora Systems</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
