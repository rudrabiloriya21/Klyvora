import React, { useState } from 'react';
import { Palette, Activity, Gauge, Zap, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 'modern-design',
      icon: <Palette size={26} />,
      tag: 'AESTHETIC',
      title: 'Modern Design',
      description:
        'Sculpted with cinematic dark tones, refined geometry, and nuanced typography. An interface that commands attention through elegance rather than excess.',
      highlights: ['Deep Obsidian Contrast', 'Balanced Glassmorphism', 'Typographic Hierarchy'],
      color: 'var(--accent-violet)',
      glowColor: 'rgba(139, 92, 246, 0.25)',
    },
    {
      id: 'smooth-ux',
      icon: <Activity size={26} />,
      tag: 'INTERACTION',
      title: 'Smooth User Experience',
      description:
        'Tactile micro-animations, effortless spatial transitions, and zero visual friction. Every motion is purposeful, measured, and satisfying.',
      highlights: ['Fluid 60fps Transitions', 'Spatial Micro-feedback', 'Reduced Motion Mode'],
      color: 'var(--accent-cyan)',
      glowColor: 'rgba(6, 182, 212, 0.25)',
    },
    {
      id: 'responsive-perf',
      icon: <Gauge size={26} />,
      tag: 'ARCHITECTURE',
      title: 'Responsive Performance',
      description:
        'Engineered for rapid response and flawless adaptation across ultra-wide monitors, tablets, and handheld devices without sacrificing visual richness.',
      highlights: ['Sub-second Response', 'Fluid Grid Hierarchy', 'Zero Layout Shifts'],
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.25)',
    },
    {
      id: 'future-tech',
      icon: <Zap size={26} />,
      tag: 'INNOVATION',
      title: 'Future-Focused Technology',
      description:
        'Built with clean, modern standards designed to scale effortlessly into tomorrow’s digital landscape. Crafted under Xeorvia’s engineering principles.',
      highlights: ['Modern Web Standards', 'Resilient Foundation', 'Scalable Ecosystem'],
      color: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.25)',
    },
  ];

  return (
    <section id="features" className="section-space features-section" aria-labelledby="features-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">SYSTEM CAPABILITIES</span>
          <h2 id="features-heading" className="section-title">
            Distinction in Every Dimension.
          </h2>
          <p className="section-desc">
            Four foundational pillars that define the Klyvora digital experience.
            Conceived by Xeorvia to combine cinematic aesthetics with uncompromising usability.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feature, idx) => {
            const isHovered = hoveredCard === feature.id;

            return (
              <div
                key={feature.id}
                className="feature-card glass-card"
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  '--card-glow': feature.glowColor,
                  '--card-accent': feature.color,
                }}
              >
                {/* Radial Hover Spotlight */}
                <div className="feature-card-spotlight" aria-hidden="true" />

                {/* Top Bar: Icon + Category Tag */}
                <div className="feature-card-header">
                  <div
                    className="feature-icon-box"
                    style={{ color: feature.color, borderColor: isHovered ? feature.color : 'var(--border-subtle)' }}
                  >
                    {feature.icon}
                  </div>
                  <span className="feature-tag font-mono">{feature.tag}</span>
                </div>

                {/* Card Content */}
                <h3 className="feature-title font-display">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>

                {/* Highlights List */}
                <ul className="feature-highlights" aria-label={`Highlights of ${feature.title}`}>
                  {feature.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="highlight-item">
                      <CheckCircle2 size={15} className="highlight-check" style={{ color: feature.color }} />
                      <span className="highlight-text">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Footer Accent */}
                <div className="feature-card-footer">
                  <span className="font-mono feature-card-index">0{idx + 1} // CAPABILITY</span>
                  <div
                    className="feature-accent-line"
                    style={{
                      background: `linear-gradient(90deg, ${feature.color} 0%, transparent 100%)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
