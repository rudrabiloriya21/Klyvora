import React from 'react';
import { Compass, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';

export default function XeorviaStory({ onOpenXeorviaModal }) {
  return (
    <section id="xeorvia" className="section-space xeorvia-section" aria-labelledby="xeorvia-heading">
      <div className="container">
        <div className="xeorvia-card glass-card glass-card-elevated">
          {/* Subtle Ambient Radial Lighting */}
          <div className="xeorvia-ambient-glow" aria-hidden="true" />

          <div className="xeorvia-content-grid">
            {/* Left Narrative Column */}
            <div className="xeorvia-narrative">
              <div className="badge-pill font-mono">
                <span className="badge-dot badge-dot-violet" />
                PARENT BRAND & CREATIVE ORIGIN
              </div>

              <h2 id="xeorvia-heading" className="xeorvia-title font-display">
                The Xeorvia <br />
                <span className="gradient-text">Foundation.</span>
              </h2>

              <p className="xeorvia-lead-quote">
                “Klyvora is part of the Xeorvia journey—where technology, creativity, and ambitious
                ideas come together.”
              </p>

              <p className="xeorvia-body-text">
                Xeorvia is the creative and technological studio behind Klyvora. Driven by a passion
                for digital refinement and forward-looking interfaces, Xeorvia conceives digital
                brands that break away from repetitive templates and elevate how technology feels.
              </p>

              <div className="xeorvia-actions">
                <button
                  type="button"
                  onClick={onOpenXeorviaModal}
                  className="btn btn-secondary xeorvia-btn"
                  id="xeorvia-manifesto-btn"
                >
                  <Compass size={17} />
                  <span>Discover the Xeorvia Vision</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Pillars Showcase */}
            <div className="xeorvia-pillars-wrap">
              <div className="xeorvia-pillar-item glass-card">
                <div className="pillar-header-row">
                  <div className="pillar-icon-box">
                    <Sparkles size={20} className="text-cyan" />
                  </div>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                    01 // PHILOSOPHY
                  </span>
                </div>
                <h3 className="pillar-heading font-display">Uncompromising Craft</h3>
                <p className="pillar-sub">
                  Every pixel, curve, and transition is designed with deliberate restraint,
                  ensuring a balanced aesthetic that endures.
                </p>
              </div>

              <div className="xeorvia-pillar-item glass-card">
                <div className="pillar-header-row">
                  <div className="pillar-icon-box">
                    <Zap size={20} className="text-violet" />
                  </div>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                    02 // EXECUTION
                  </span>
                </div>
                <h3 className="pillar-heading font-display">Fluid Technology</h3>
                <p className="pillar-sub">
                  Engineering modern, lightweight web foundations that perform with instantaneous
                  responsiveness on any platform.
                </p>
              </div>

              <div className="xeorvia-pillar-item glass-card">
                <div className="pillar-header-row">
                  <div className="pillar-icon-box">
                    <Shield size={20} className="text-cyan" />
                  </div>
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                    03 // INTEGRITY
                  </span>
                </div>
                <h3 className="pillar-heading font-display">Purposeful Creation</h3>
                <p className="pillar-sub">
                  No empty claims or superficial gimmicks. Xeorvia builds with honesty, precision,
                  and authentic digital value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
