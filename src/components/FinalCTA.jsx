import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function FinalCTA({ onEnterExperience }) {
  const [isEntering, setIsEntering] = useState(false);
  const [entered, setEntered] = useState(false);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      setIsEntering(false);
      setEntered(true);
      if (onEnterExperience) {
        onEnterExperience();
      }
    }, 1200);
  };

  return (
    <section className="final-cta-section" aria-labelledby="cta-heading">
      {/* Horizon Line Glow Effect */}
      <div className="horizon-glow-wrap" aria-hidden="true">
        <div className="horizon-line" />
        <div className="horizon-radiance" />
      </div>

      <div className="container final-cta-container">
        <div className="badge-pill font-mono final-cta-badge">
          <span className="badge-dot" />
          <span>🇮🇳 LAUNCH YOUR BUSINESS ONLINE</span>
        </div>

        <h2 id="cta-heading" className="final-cta-title font-display">
          Ready to build your <span className="gradient-text">dream website?</span>
        </h2>

        <p className="final-cta-desc">
          Join thousands of Indian shop owners, coaching teachers, doctors, and startup founders who launched their website in under 60 seconds. Free to start, no credit card required.
        </p>

        <div className="final-cta-action">
          <button
            type="button"
            onClick={handleEnter}
            disabled={isEntering}
            className={`btn btn-primary final-cta-btn ${isEntering ? 'btn-launching' : ''} ${
              entered ? 'btn-launched' : ''
            }`}
            id="enter-klyvora-btn"
          >
            {isEntering ? (
              <>
                <span className="spinner-launch" />
                <span>Synchronizing Environment...</span>
              </>
            ) : entered ? (
              <>
                <Check size={18} />
                <span>Experience Initialized</span>
              </>
            ) : (
              <>
                <span>Enter Klyvora</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <div className="final-cta-meta font-mono">
          <span>KLYVORA // XEORVIA COLLABORATION</span>
          <span className="meta-sep">·</span>
          <span>ALL SYSTEMS NOMINAL</span>
          <span className="meta-sep">·</span>
          <span>VERSION 2.4</span>
        </div>
      </div>
    </section>
  );
}
