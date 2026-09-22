import React, { useState } from 'react';
import { MessageCircle, IndianRupee, MapPin, Smartphone, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 'whatsapp-commerce',
      icon: <MessageCircle size={26} />,
      tag: 'WHATSAPP COMMERCE',
      title: '1-Tap WhatsApp Orders & Enquiries',
      description:
        'Direct WhatsApp ordering and inquiry buttons on every section. Customers can tap once on their phone to order products, ask about admission batches, or book clinic appointments.',
      highlights: ['1-Tap Instant Ordering', 'Pre-filled Item Inquiries', 'Zero Commission Fees'],
      color: '#22c55e',
      glowColor: 'rgba(34, 197, 94, 0.25)',
    },
    {
      id: 'rupee-upi-pricing',
      icon: <IndianRupee size={26} />,
      tag: 'BHARAT PRICING',
      title: 'Indian Rupee (₹) & UPI-Ready Pricing',
      description:
        'All pricing tables, institute fee tiers, and product catalogs are natively displayed in Indian Rupees (₹) with UPI and Razorpay-ready payment callouts.',
      highlights: ['Native ₹ Rupee Formatting', 'UPI & QR Code Prompts', 'Flexible Fee & EMI Tiers'],
      color: 'var(--accent-cyan)',
      glowColor: 'rgba(6, 182, 212, 0.25)',
    },
    {
      id: 'local-discovery',
      icon: <MapPin size={26} />,
      tag: 'LOCAL DISCOVERY',
      title: 'Local Google Maps & Store Footfall',
      description:
        'Turn online visitors into walk-in customers. Full address cards, business hours, and interactive map directions for local retail shops, coaching centers, and clinics.',
      highlights: ['Google Maps Directions', 'Live Open/Closed Badge', 'Direct Call & Visit CTAs'],
      color: 'var(--accent-violet)',
      glowColor: 'rgba(139, 92, 246, 0.25)',
    },
    {
      id: 'mobile-5g-speed',
      icon: <Smartphone size={26} />,
      tag: 'LIGHTNING SPEED',
      title: 'Mobile-First for 5G & 4G Bharat',
      description:
        'Over 85% of Indian internet users browse on smartphones. Klyvora generates lightweight, high-performance websites that load instantly even on 4G networks.',
      highlights: ['Sub-second Mobile Loading', 'Zero Lag on Jio / Airtel', 'Touch-Optimized Layouts'],
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.25)',
    },
  ];

  return (
    <section id="features" className="section-space features-section" aria-labelledby="features-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">BUILT FOR INDIAN BUSINESSES</span>
          <h2 id="features-heading" className="section-title">
            Everything You Need to Win Online in India.
          </h2>
          <p className="section-desc">
            From local retail shops and saree boutiques to premier coaching institutes and high-growth startups—Klyvora is purpose-built for how Indian customers discover, message, and buy.
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
