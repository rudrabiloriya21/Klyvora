import React, { useState } from 'react';
import {
  ShoppingBag,
  GraduationCap,
  Rocket,
  Activity,
  Lock,
  MessageCircle,
  IndianRupee,
  MapPin,
  Star,
  CheckCircle,
  ExternalLink,
  Phone,
} from 'lucide-react';

const SHOWCASE_PREVIEWS = {
  shops: {
    tab: 'shops',
    label: 'Retail & Saree Shops',
    icon: <ShoppingBag size={16} />,
    title: 'Kavya Handloom & Sarees',
    location: 'Johari Bazaar, Jaipur, Rajasthan',
    tagline: 'Pure Banarasi, Chanderi & Bandhani Weaves Direct from Artisans',
    phone: '+91 00000 00000',
    headline: 'Handcrafted Heritage Sarees for Every Royal Celebration',
    subheading: 'Browse our festive collection with 1-tap WhatsApp video shopping, nationwide express delivery, and cash on delivery.',
    badge: '✦ FESTIVE WEDDING COLLECTION 2026',
    primaryCta: 'Order via WhatsApp',
    items: [
      { name: 'Pure Katan Banarasi Silk', price: '₹7,499', tag: 'Bestseller', desc: 'Handwoven pure silk with authentic gold zari floral jaal.' },
      { name: 'Chanderi Zari Tissue Saree', price: '₹4,250', tag: 'Festive', desc: 'Featherlight Chanderi weave with regal scalloped borders.' },
      { name: 'Royal Rajputi Poshak', price: '₹14,999', tag: 'Bridal', desc: 'Heavy handcrafted zardozi and gota patti embroidery.' },
    ],
    review: {
      quote: 'Ordered our wedding trousseau sarees via WhatsApp video call. The fabric quality and real gold zari exceeded expectations!',
      author: 'Pooja Agarwal',
      city: 'Jaipur',
    },
  },
  institutes: {
    tab: 'institutes',
    label: 'Coaching & Institutes',
    icon: <GraduationCap size={16} />,
    title: 'Apex IIT-JEE & NEET Academy',
    location: 'Vigyan Nagar, Kota, Rajasthan',
    tagline: 'Kota’s Trusted Legacy for Engineering & Medical Excellence',
    phone: '+91 00000 00000',
    headline: 'Produce Your Dream All India Rank with Kota’s Top Faculty',
    subheading: 'Dedicated classroom batches, daily practice problem (DPP) sessions, and comprehensive test series with AI rank analytics.',
    badge: '✦ ADMISSIONS OPEN FOR 2026–27 BATCHES',
    primaryCta: 'WhatsApp Admission Helpline',
    items: [
      { name: 'Target IIT-JEE (Class 11 & 12)', price: '₹75,000/yr', tag: 'Most Popular', desc: 'Complete Physics, Chemistry & Math with 300+ Kota DPP tests.' },
      { name: 'NEET Conqueror (Medical)', price: '₹68,000/yr', tag: 'High Success', desc: 'NCERT line-by-line masterclasses & AIIMS doctor mentorship.' },
      { name: 'Foundation (Class 8–10)', price: '₹38,000/yr', tag: 'Olympiads', desc: 'Build strong analytical problem-solving foundation early.' },
    ],
    review: {
      quote: 'Apex Kota provided the rigorous test environment and faculty mentorship my son needed to secure AIR 142 in JEE Advanced.',
      author: 'Dr. Ramesh Sharma',
      city: 'Delhi',
    },
  },
  startups: {
    tab: 'startups',
    label: 'Tech Startups & SaaS',
    icon: <Rocket size={16} />,
    title: 'VyaparAI Cloud Platform',
    location: 'Indiranagar, Bengaluru, Karnataka',
    tagline: 'Next-Gen B2B Billing, GST E-Invoicing & Supply Chain SaaS',
    phone: '+91 00000 00000',
    headline: 'Automate Indian Invoicing & GST Compliance at Lightning Speed',
    subheading: 'Engineered specifically for Indian MSMEs and tech startups with UPI autopay, E-way bill generation, and instant WhatsApp receipts.',
    badge: '✦ TRUSTED BY 5,000+ INDIAN ENTERPRISES',
    primaryCta: 'Start 14-Day Free Trial',
    items: [
      { name: 'Startup Tier', price: '₹499/mo', tag: 'Essential', desc: 'Up to 500 GST invoices/mo, UPI QR generation, and email support.' },
      { name: 'Growth Business', price: '₹1,499/mo', tag: 'Recommended', desc: 'Unlimited invoices, WhatsApp automation, multi-user access & Tally sync.' },
      { name: 'Enterprise Pro', price: '₹4,999/mo', tag: 'High Volume', desc: 'Custom API access, dedicated account lead & 99.95% SLA guarantee.' },
    ],
    review: {
      quote: 'VyaparAI saved our startup over 20 hours a week on GST reconciliation and customer follow-ups through WhatsApp.',
      author: 'Aditya Mehta',
      city: 'Bengaluru',
    },
  },
  clinics: {
    tab: 'clinics',
    label: 'Clinics & Healthcare',
    icon: <Activity size={16} />,
    title: 'Sanjeevani Dental & Wellness',
    location: 'Bandra West, Mumbai, Maharashtra',
    tagline: 'Advanced Painless Laser Dentistry & Holistic Family Care',
    phone: '+91 00000 00000',
    headline: 'State-of-the-Art Painless Dental Care for the Whole Family',
    subheading: 'Book confirmed OPD appointments via WhatsApp, view doctor credentials, and get instant Google Maps driving directions.',
    badge: '✦ NABH ACCREDITED CLINIC // MUMBAI',
    primaryCta: 'Book WhatsApp Appointment',
    items: [
      { name: 'Microscopic Root Canal', price: '₹4,500', tag: 'Painless', desc: 'Single-sitting laser treatment with imported biocompatible seals.' },
      { name: 'Invisible Clear Aligners', price: '₹34,999', tag: 'Cosmetic', desc: 'Custom 3D-scanned invisible teeth straightening trays.' },
      { name: 'Comprehensive Dental Checkup', price: '₹499', tag: 'First Visit', desc: 'Digital dental OPG X-ray, scaling, and consultation.' },
    ],
    review: {
      quote: 'Exceptional hygiene, empathetic doctors, and booking an appointment was as simple as sending a WhatsApp message!',
      author: 'Sunita Deshmukh',
      city: 'Mumbai',
    },
  },
};

export default function Showcase() {
  const [activeTab, setActiveTab] = useState('shops');
  const current = SHOWCASE_PREVIEWS[activeTab] || SHOWCASE_PREVIEWS.shops;

  return (
    <section id="showcase" className="section-space showcase-section" aria-labelledby="showcase-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">MADE FOR BHARAT</span>
          <h2 id="showcase-heading" className="section-title">
            Tailored Websites for Every Indian Business.
          </h2>
          <p className="section-desc">
            Explore live, interactive mockups built for retail stores, coaching centers, tech startups, and clinics—equipped with native ₹ pricing and 1-tap WhatsApp business ordering.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="showcase-tab-bar" role="tablist" aria-label="Showcase Modes">
          {Object.values(SHOWCASE_PREVIEWS).map((p) => (
            <button
              key={p.tab}
              role="tab"
              aria-selected={activeTab === p.tab}
              onClick={() => setActiveTab(p.tab)}
              className={`showcase-tab-btn ${activeTab === p.tab ? 'active' : ''}`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
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
                https://{activeTab}.klyvora.in/
              </span>
            </div>

            <div className="browser-status font-mono">
              <span className="browser-status-dot" />
              <span className="browser-status-text">UPI & WHATSAPP ACTIVE</span>
            </div>
          </div>

          {/* Browser Viewport Area */}
          <div className="browser-viewport p-4">
            <div className="indian-showcase-card glass-card" style={{ padding: '24px 28px' }}>
              {/* Top Banner with Location and WhatsApp Callout */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                    {current.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#94a3b8' }}>
                    <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} />
                    <span>{current.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '999px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '12px', fontWeight: 600 }}>
                    <MessageCircle size={14} />
                    <span>WhatsApp Direct Active</span>
                  </div>
                </div>
              </div>

              {/* Hero Showcase Block */}
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '10.5px', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>
                  {current.badge}
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.25, color: '#ffffff', marginBottom: '10px' }}>
                  {current.headline}
                </h2>
                <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '680px', lineHeight: 1.6, marginBottom: '18px' }}>
                  {current.subheading}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-primary" style={{ background: '#22c55e', borderColor: '#22c55e', color: '#050608', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}>
                    <MessageCircle size={16} />
                    <span>{current.primaryCta}</span>
                  </button>
                  <button type="button" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}>
                    <Phone size={15} />
                    <span>Call: {current.phone}</span>
                  </button>
                </div>
              </div>

              {/* Items & Offerings Grid */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700, marginBottom: '12px' }}>
                  FEATURED OFFERINGS & ₹ PRICING
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  {current.items.map((item, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '9.5px', background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.tag}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#facc15' }}>
                          {item.price}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Indian Customer Review */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', color: '#e2e8f0', fontStyle: 'italic' }}>
                    "{current.review.quote}"
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                  — {current.review.author}, {current.review.city}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
