import React from 'react';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

export default function Hero({ onExploreClick, onDiscoverXeorviaClick }) {
  return (
    <section id="home" className="hero-section" aria-labelledby="hero-heading">
      {/* Background Canvas & Ambient Lighting */}
      <HeroCanvas />

      <div className="hero-glow-overlay" aria-hidden="true">
        <div className="hero-radial-glow" />
        <div className="hero-grid-pattern" />
      </div>

      <div className="container hero-container">
        {/* Brand Origin Pill */}
        <div className="hero-pill-badge-wrap">
          <div className="badge-pill hero-badge">
            <span className="badge-dot" />
            <span>A digital experience by Xeorvia</span>
          </div>
        </div>

        {/* Main Cinematic Headline */}
        <h1 id="hero-heading" className="hero-title font-display">
          Where Ideas Become <span className="gradient-text">Digital Experiences.</span>
        </h1>

        {/* Supporting Description */}
        <p className="hero-description">
          Klyvora is a modern digital experience created by Xeorvia—designed with purpose,
          built for what comes next.
        </p>

        {/* CTAs */}
        <div className="hero-actions">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            className="btn btn-primary hero-btn-primary"
            id="hero-explore-cta"
          >
            <span>Explore Klyvora</span>
            <ArrowRight size={18} />
          </a>

          <a
            href="#xeorvia"
            onClick={(e) => {
              e.preventDefault();
              onDiscoverXeorviaClick();
            }}
            className="btn btn-secondary hero-btn-secondary"
            id="hero-discover-cta"
          >
            <span>Discover Xeorvia</span>
            <Compass size={17} />
          </a>
        </div>

        {/* Futuristic System Telemetry Strip */}
        <div className="hero-telemetry-strip" aria-label="System Specifications">
          <div className="telemetry-item">
            <span className="telemetry-dot" />
            <span className="telemetry-label">ORIGIN</span>
            <span className="telemetry-value">XEORVIA LABS</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">/</div>
          <div className="telemetry-item">
            <span className="telemetry-label">EXPERIENCE</span>
            <span className="telemetry-value">CINEMATIC DIGITAL</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">/</div>
          <div className="telemetry-item">
            <span className="telemetry-label">SYSTEM</span>
            <span className="telemetry-value">REACTIVE & FLUID</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">/</div>
          <div className="telemetry-item">
            <span className="telemetry-label">STATUS</span>
            <span className="telemetry-value telemetry-status">ONLINE</span>
          </div>
        </div>

        {/* Scroll Prompt */}
        <a
          href="#about"
          className="hero-scroll-prompt"
          aria-label="Scroll down to About section"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="scroll-prompt-text font-mono">SCROLL TO DISCOVER</span>
          <ChevronDown size={18} className="scroll-chevron" />
        </a>
      </div>
    </section>
  );
}
