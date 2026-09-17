import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Sliders,
  Sparkles,
  Lock,
  Layers,
  Cpu,
  Terminal,
} from 'lucide-react';

export default function Showcase() {
  const [activeTab, setActiveTab] = useState('spatial');
  const [density, setDensity] = useState(80);
  const [glowIntensity, setGlowIntensity] = useState(70);
  const [activeTheme, setActiveTheme] = useState('obsidian');

  return (
    <section id="showcase" className="section-space showcase-section" aria-labelledby="showcase-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">VISUAL SHOWCASE</span>
          <h2 id="showcase-heading" className="section-title">
            The Digital Environment.
          </h2>
          <p className="section-desc">
            Explore Klyvora’s interactive interface framework. A synthesis of tactile digital
            depth, fluid spatial hierarchy, and refined ambient luminance.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="showcase-tab-bar" role="tablist" aria-label="Showcase Modes">
          <button
            role="tab"
            aria-selected={activeTab === 'spatial'}
            onClick={() => setActiveTab('spatial')}
            className={`showcase-tab-btn ${activeTab === 'spatial' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Spatial Interface</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'telemetry'}
            onClick={() => setActiveTab('telemetry')}
            className={`showcase-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          >
            <Cpu size={16} />
            <span>Real-Time Engine</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'matrix'}
            onClick={() => setActiveTab('matrix')}
            className={`showcase-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          >
            <Monitor size={16} />
            <span>Adaptive System</span>
          </button>
        </div>

        {/* Main Browser Window Mockup */}
        <div className="showcase-browser-frame glass-card glass-card-elevated">
          {/* Browser Chrome Header */}
          <div className="browser-chrome">
            <div className="browser-window-dots">
              <span className="dot dot-close" />
              <span className="dot dot-minimize" />
              <span className="dot dot-expand" />
            </div>

            <div className="browser-address-bar">
              <Lock size={12} className="browser-lock-icon" />
              <span className="browser-url-text font-mono">
                https://klyvora.network/experience/
                <span className="url-highlight">{activeTab}</span>
              </span>
            </div>

            <div className="browser-status font-mono">
              <span className="browser-status-dot" />
              <span className="browser-status-text">LIVE 60FPS</span>
            </div>
          </div>

          {/* Browser Viewport Area */}
          <div className="browser-viewport">
            {/* VIEW 1: Spatial Interface */}
            {activeTab === 'spatial' && (
              <div className="showcase-view showcase-spatial-view">
                <div className="spatial-visual-grid">
                  {/* Left Column: Glass Control Deck */}
                  <div className="spatial-control-deck glass-card">
                    <div className="deck-header">
                      <span className="deck-title font-mono">INTERFACE PARAMETERS</span>
                      <Sliders size={15} className="deck-icon" />
                    </div>

                    <div className="deck-control-group">
                      <div className="deck-label-row font-mono">
                        <span>LUMINESCENCE INTENSITY</span>
                        <span>{glowIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={glowIntensity}
                        onChange={(e) => setGlowIntensity(Number(e.target.value))}
                        className="custom-range"
                        aria-label="Adjust Luminescence Intensity"
                      />
                    </div>

                    <div className="deck-control-group">
                      <div className="deck-label-row font-mono">
                        <span>SURFACE DENSITY</span>
                        <span>{density}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        value={density}
                        onChange={(e) => setDensity(Number(e.target.value))}
                        className="custom-range"
                        aria-label="Adjust Surface Density"
                      />
                    </div>

                    <div className="deck-theme-selector">
                      <span className="deck-label-row font-mono">CHROMATIC CORE</span>
                      <div className="theme-pills">
                        <button
                          type="button"
                          onClick={() => setActiveTheme('obsidian')}
                          className={`theme-pill ${activeTheme === 'obsidian' ? 'active' : ''}`}
                        >
                          Obsidian
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTheme('cyan')}
                          className={`theme-pill ${activeTheme === 'cyan' ? 'active' : ''}`}
                        >
                          Cyan Wave
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTheme('violet')}
                          className={`theme-pill ${activeTheme === 'violet' ? 'active' : ''}`}
                        >
                          Violet Nebula
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Area: Layered Spatial Cards */}
                  <div className="spatial-stage">
                    <div
                      className="spatial-main-card glass-card"
                      style={{
                        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 ${glowIntensity / 2}px ${
                          activeTheme === 'cyan'
                            ? 'rgba(6, 182, 212, 0.35)'
                            : activeTheme === 'violet'
                            ? 'rgba(139, 92, 246, 0.4)'
                            : 'rgba(255, 255, 255, 0.15)'
                        }`,
                        borderColor:
                          activeTheme === 'cyan'
                            ? 'rgba(6, 182, 212, 0.4)'
                            : activeTheme === 'violet'
                            ? 'rgba(139, 92, 246, 0.4)'
                            : 'rgba(255, 255, 255, 0.18)',
                      }}
                    >
                      <div className="spatial-card-header">
                        <div className="badge-pill font-mono">
                          <span className="badge-dot" />
                          <span>CORE LAYER // KLYVORA</span>
                        </div>
                        <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
                          RENDER LATENCY: 1.2MS
                        </span>
                      </div>

                      <div className="spatial-mock-hero">
                        <h4 className="spatial-hero-title font-display">
                          Precision in every layer.
                        </h4>
                        <p className="spatial-hero-desc">
                          Layered frosted glass with dynamic refraction, custom light reflection, and
                          spatial depth engineered specifically for the Xeorvia experience.
                        </p>
                      </div>

                      <div className="spatial-mock-widgets">
                        <div className="mock-widget">
                          <span className="widget-label font-mono">LIGHT REFLECTION</span>
                          <span className="widget-val gradient-text-cyan">{glowIntensity}% Peak</span>
                        </div>
                        <div className="mock-widget">
                          <span className="widget-label font-mono">DYNAMIC BLUR</span>
                          <span className="widget-val">{Math.round(density / 4)}px Gaussian</span>
                        </div>
                        <div className="mock-widget">
                          <span className="widget-label font-mono">CURATION</span>
                          <span className="widget-val font-mono">XEORVIA LAB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Real-Time Engine */}
            {activeTab === 'telemetry' && (
              <div className="showcase-view showcase-telemetry-view">
                <div className="telemetry-dashboard-grid">
                  <div className="telemetry-card glass-card">
                    <div className="telemetry-card-top">
                      <span className="font-mono card-sub">STREAM METRICS</span>
                      <Terminal size={15} />
                    </div>
                    <div className="telemetry-metric-large font-display">
                      99.98<span className="unit">%</span>
                    </div>
                    <p className="telemetry-subtext font-mono">EXECUTION FIDELITY</p>
                    <div className="metric-bar-wrap">
                      <div className="metric-bar-fill" style={{ width: '99.9%' }} />
                    </div>
                  </div>

                  <div className="telemetry-card glass-card">
                    <div className="telemetry-card-top">
                      <span className="font-mono card-sub">LAYOUT VELOCITY</span>
                      <Cpu size={15} />
                    </div>
                    <div className="telemetry-metric-large font-display gradient-text-cyan">
                      60<span className="unit">FPS</span>
                    </div>
                    <p className="telemetry-subtext font-mono">SUSTAINED FRAMERATE</p>
                    <div className="metric-bar-wrap">
                      <div className="metric-bar-fill fill-cyan" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div className="telemetry-card glass-card">
                    <div className="telemetry-card-top">
                      <span className="font-mono card-sub">LIGHT FOOTPRINT</span>
                      <Sparkles size={15} />
                    </div>
                    <div className="telemetry-metric-large font-display">
                      0<span className="unit">KB</span>
                    </div>
                    <p className="telemetry-subtext font-mono">EXTERNAL BLOAT</p>
                    <div className="metric-bar-wrap">
                      <div className="metric-bar-fill fill-violet" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>

                <div className="telemetry-terminal-box glass-card">
                  <div className="terminal-header font-mono">
                    <span>XEORVIA ENGINE DIAGNOSTIC LOG</span>
                    <span>SESSION ACTIVE</span>
                  </div>
                  <div className="terminal-body font-mono">
                    <div className="log-row">
                      <span className="log-time">[00:00:01]</span>
                      <span className="log-system">CORE_INIT:</span>
                      <span>Klyvora design tokens loaded into memory</span>
                    </div>
                    <div className="log-row">
                      <span className="log-time">[00:00:02]</span>
                      <span className="log-system">CANVAS_RENDER:</span>
                      <span>Interactive particle mesh initialized with 60fps raf loop</span>
                    </div>
                    <div className="log-row">
                      <span className="log-time">[00:00:03]</span>
                      <span className="log-system">ACCESSIBILITY:</span>
                      <span>prefers-reduced-motion listener active and compliant</span>
                    </div>
                    <div className="log-row log-highlight">
                      <span className="log-time">[00:00:04]</span>
                      <span className="log-system">STATUS:</span>
                      <span>System nominal. Ready for exploration.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: Adaptive System */}
            {activeTab === 'matrix' && (
              <div className="showcase-view showcase-matrix-view">
                <div className="matrix-devices-grid">
                  {/* Desktop Frame */}
                  <div className="device-preview-card glass-card">
                    <div className="device-header">
                      <Monitor size={18} />
                      <span className="font-mono">DESKTOP WORKSTATION</span>
                      <span className="font-mono text-muted" style={{ marginLeft: 'auto' }}>
                        1920 × 1080
                      </span>
                    </div>
                    <div className="device-canvas-preview">
                      <div className="mini-desktop-layout">
                        <div className="mini-nav" />
                        <div className="mini-hero-block" />
                        <div className="mini-cards-row">
                          <div className="mini-card" />
                          <div className="mini-card" />
                          <div className="mini-card" />
                        </div>
                      </div>
                    </div>
                    <p className="device-caption">
                      Full cinematic canvas with ambient mesh and multi-column architectural depth.
                    </p>
                  </div>

                  {/* Mobile Frame */}
                  <div className="device-preview-card glass-card">
                    <div className="device-header">
                      <Smartphone size={18} />
                      <span className="font-mono">HANDHELD MOBILE</span>
                      <span className="font-mono text-muted" style={{ marginLeft: 'auto' }}>
                        390 × 844
                      </span>
                    </div>
                    <div className="device-canvas-preview">
                      <div className="mini-phone-layout">
                        <div className="mini-phone-notch" />
                        <div className="mini-nav-mobile" />
                        <div className="mini-hero-mobile" />
                        <div className="mini-card-mobile" />
                        <div className="mini-card-mobile" />
                      </div>
                    </div>
                    <p className="device-caption">
                      Seamless vertical stacking, touch-optimized tap targets, and streamlined drawer.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
