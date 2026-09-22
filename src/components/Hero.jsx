import React from 'react';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

export default function Hero({ onExploreClick, onDiscoverXeorviaClick, onStartBuilding }) {
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
            <span>🇮🇳 India's #1 AI Website Builder for Bharat</span>
          </div>
        </div>

        {/* Main Cinematic Headline */}
        <h1 id="hero-heading" className="hero-title font-display">
          Build Your Shop, Coaching Institute, or Startup Website <span className="gradient-text">in 30 Seconds.</span>
        </h1>

        {/* Supporting Description */}
        <p className="hero-description">
          Over 60 million Indian businesses don't have a website yet. Klyvora creates stunning, mobile-first
          websites with 1-tap WhatsApp direct ordering, UPI pricing in ₹, and Google Maps footfall—ready in seconds with AI.
        </p>

        {/* CTAs */}
        <div className="hero-actions">
          <button
            type="button"
            onClick={onStartBuilding || onExploreClick}
            className="btn btn-primary hero-btn-primary"
            id="hero-create-cta"
          >
            <span>Start Building Free</span>
            <ArrowRight size={18} />
          </button>

          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              onExploreClick();
            }}
            className="btn btn-secondary hero-btn-secondary"
            id="hero-explore-cta"
          >
            <span>See Indian Demos</span>
            <Compass size={17} />
          </a>
        </div>

        {/* System Telemetry Strip Focused on Indian Businesses */}
        <div className="hero-telemetry-strip" aria-label="System Specifications">
          <div className="telemetry-item">
            <span className="telemetry-dot" />
            <span className="telemetry-label">FOR</span>
            <span className="telemetry-value">BHARAT BUSINESSES</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">/</div>
          <div className="telemetry-item">
            <span className="telemetry-label">COMMERCE</span>
            <span className="telemetry-value">WHATSAPP & UPI (₹)</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">/</div>
          <div className="telemetry-item">
            <span className="telemetry-label">SYSTEM</span>
            <span className="telemetry-value">MOBILE-FIRST 5G</span>
          </div>
          <div className="telemetry-separator" aria-hidden="true">/</div>
          <div className="telemetry-item">
            <span className="telemetry-label">AI SPEED</span>
            <span className="telemetry-value telemetry-status">&lt; 30 SECONDS</span>
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
