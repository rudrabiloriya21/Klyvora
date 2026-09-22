import React from 'react';
import { Lightbulb, Cpu, Compass, Layers, Orbit } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: <Lightbulb size={22} className="about-pillar-icon" />,
      title: 'Zero Code Required',
      description:
        'Just type what your business does in simple English or Hinglish. Klyvora designs, writes copy, and builds your live website in seconds.',
    },
    {
      icon: <Cpu size={22} className="about-pillar-icon" />,
      title: '1-Tap WhatsApp Commerce',
      description:
        'Built around how Indians buy. Visitors can order products, inquire about courses, or book consultations directly through WhatsApp.',
    },
    {
      icon: <Layers size={22} className="about-pillar-icon" />,
      title: 'Local Google Maps & Footfall',
      description:
        'Help customers in your city find your exact store or clinic location with integrated Google Maps, address cards, and calling buttons.',
    },
    {
      icon: <Compass size={22} className="about-pillar-icon" />,
      title: 'Natively in Indian Rupees (₹)',
      description:
        'No confusing dollar conversions. Clear ₹ pricing, course fee structures, and UPI-ready payment options built right in.',
    },
    {
      icon: <Orbit size={22} className="about-pillar-icon" />,
      title: 'Fast & Lightweight on Mobile',
      description:
        'Optimized for mobile devices across India on Jio and Airtel 4G/5G, ensuring your customers never wait for a page to load.',
    },
  ];

  return (
    <section id="about" className="section-space about-section" aria-labelledby="about-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">OUR MISSION FOR BHARAT</span>
          <h2 id="about-heading" className="section-title">
            Bringing 60 Million Indian Businesses <br />
            <span className="gradient-text">Into the Digital Economy.</span>
          </h2>
          <p className="section-desc">
            India is home to incredible artisans, bustling neighborhood shops, premier coaching teachers, and ambitious founders. Klyvora eliminates the technical and financial hurdles so any Indian business can launch a world-class website in 30 seconds.
          </p>
        </div>

        {/* Narrative Feature Layout */}
        <div className="about-grid">
          {/* Main Manifesto Glass Card */}
          <div className="about-manifesto-card glass-card glass-card-elevated">
            <div className="about-manifesto-top">
              <span className="badge-pill font-mono">
                <span className="badge-dot badge-dot-violet" />
                THE KLYVORA MISSION
              </span>
              <span className="manifesto-mark font-mono">01 // BHARAT</span>
            </div>

            <h3 className="about-manifesto-heading font-display">
              A digital storefront for every Indian entrepreneur.
            </h3>

            <p className="about-manifesto-text">
              For decades, getting a custom website required paying ₹30,000–₹50,000 to expensive agencies or struggling with complicated Western builders that charge in US dollars and lack WhatsApp integration.
            </p>

            <p className="about-manifesto-text">
              Klyvora changes the game completely. We built an AI website architect that understands how Indian commerce actually operates—from bridal saree boutiques in Jaipur and IIT-JEE coaching centers in Kota to high-growth tech startups in Bengaluru.
            </p>

            <div className="about-manifesto-footer">
              <div className="manifesto-creator">
                <span className="creator-label font-mono">POWERED BY</span>
                <span className="creator-name">KLYVORA AI LABS</span>
              </div>
              <div className="manifesto-tag font-mono">MADE IN INDIA</div>
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
