import React from 'react';
import { Lightbulb, Cpu, Compass, Layers, Orbit } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: <Lightbulb size={22} className="about-pillar-icon" />,
      title: 'Digital Innovation',
      description:
        'Transforming visionary concepts into living, responsive environments through uncompromising technical precision and artistic restraint.',
    },
    {
      icon: <Cpu size={22} className="about-pillar-icon" />,
      title: 'Creative Technology',
      description:
        'Harnessing state-of-the-art web architectures to engineer high-velocity interactions that feel seamless, tangible, and natural.',
    },
    {
      icon: <Layers size={22} className="about-pillar-icon" />,
      title: 'Thoughtful Design',
      description:
        'Prioritizing clarity, spatial harmony, and deep visual contrast over fleeting trends, ensuring every element serves an intentional purpose.',
    },
    {
      icon: <Compass size={22} className="about-pillar-icon" />,
      title: 'Meaningful User Experiences',
      description:
        'Crafting digital journeys that resonate emotionally and perform flawlessly across devices, screen dimensions, and interaction models.',
    },
    {
      icon: <Orbit size={22} className="about-pillar-icon" />,
      title: 'Building for the Future',
      description:
        'Conceived and engineered by Xeorvia as an enduring digital benchmark—designed to evolve, adapt, and define modern standards.',
    },
  ];

  return (
    <section id="about" className="section-space about-section" aria-labelledby="about-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">PURPOSE & ETHOS</span>
          <h2 id="about-heading" className="section-title">
            Engineered with Purpose. <br />
            <span className="gradient-text">Built for What Comes Next.</span>
          </h2>
          <p className="section-desc">
            Klyvora represents a deliberate departure from ordinary digital templates.
            Presented by Xeorvia, it stands at the intersection of cinematic elegance and
            uncompromising digital execution.
          </p>
        </div>

        {/* Narrative Feature Layout */}
        <div className="about-grid">
          {/* Main Manifesto Glass Card */}
          <div className="about-manifesto-card glass-card glass-card-elevated">
            <div className="about-manifesto-top">
              <span className="badge-pill font-mono">
                <span className="badge-dot badge-dot-violet" />
                THE KLYVORA PERSPECTIVE
              </span>
              <span className="manifesto-mark font-mono">01 // ETHOS</span>
            </div>

            <h3 className="about-manifesto-heading font-display">
              A commitment to modern digital craftsmanship.
            </h3>

            <p className="about-manifesto-text">
              The modern web is crowded with template-like structures and ephemeral novelty.
              Klyvora was conceived by Xeorvia to demonstrate what happens when creative technology
              is guided by discipline, deliberate restraint, and architectural integrity.
            </p>

            <p className="about-manifesto-text">
              Every detail—from typography scale and micro-interactions to dark-mode luminance
              and ambient visual depth—is tuned to deliver an experience that feels confident,
              mysterious, and distinctly premium.
            </p>

            <div className="about-manifesto-footer">
              <div className="manifesto-creator">
                <span className="creator-label font-mono">CURATED BY</span>
                <span className="creator-name">XEORVIA DIGITAL LAB</span>
              </div>
              <div className="manifesto-tag font-mono">EST. 2026</div>
            </div>
          </div>

          {/* Pillars List Column */}
          <div className="about-pillars-column">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="about-pillar-card glass-card">
                <div className="about-pillar-header">
                  <div className="pillar-icon-wrapper">{pillar.icon}</div>
                  <span className="pillar-index font-mono">0{idx + 1}</span>
                </div>
                <h4 className="about-pillar-title font-display">{pillar.title}</h4>
                <p className="about-pillar-desc">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
