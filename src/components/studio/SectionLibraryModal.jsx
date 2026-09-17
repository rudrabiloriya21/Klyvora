import React from 'react';
import {
  X,
  Layers,
  Sparkles,
  Layout,
  MessageSquare,
  DollarSign,
  HelpCircle,
  Mail,
  Calendar,
  Grid,
  Tag,
  Plus,
} from 'lucide-react';
import { createSection } from '../../models/projectSchema';

export default function SectionLibraryModal({ isOpen, onClose, onAddSection }) {
  if (!isOpen) return null;

  const sectionTemplates = [
    {
      type: 'hero',
      title: 'Hero Showcase',
      description: 'Fullscreen cinematic introduction with badge, headline, and dual CTAs.',
      icon: <Sparkles size={20} className="text-cyan" />,
    },
    {
      type: 'about',
      title: 'Story & Ethos',
      description: 'Narrative company background with three core pillar callouts.',
      icon: <Layout size={20} className="text-violet" />,
    },
    {
      type: 'services',
      title: 'Services Grid',
      description: 'Three-column capability cards with capability index and descriptions.',
      icon: <Grid size={20} className="text-cyan" />,
    },
    {
      type: 'products',
      title: 'Products / Daily Menu',
      description: 'Catalog items with pricing badges, tags, and item details.',
      icon: <Tag size={20} className="text-amber" />,
    },
    {
      type: 'features',
      title: 'Feature Standards',
      description: 'Four capability cards highlighting performance, design, and standards.',
      icon: <Layers size={20} className="text-violet" />,
    },
    {
      type: 'testimonials',
      title: 'Reviews & Social Proof',
      description: 'Customer quote cards with author attribution and role tags.',
      icon: <MessageSquare size={20} className="text-cyan" />,
    },
    {
      type: 'pricing',
      title: 'Pricing & Tiers',
      description: 'Multi-column plan comparison cards with feature checkmarks and CTAs.',
      icon: <DollarSign size={20} className="text-amber" />,
    },
    {
      type: 'faq',
      title: 'FAQ Accordions',
      description: 'Interactive expanding question & answer list for customer support.',
      icon: <HelpCircle size={20} className="text-violet" />,
    },
    {
      type: 'contact',
      title: 'Contact & Channels',
      description: 'Inquiry form paired with direct WhatsApp, email, and phone channels.',
      icon: <Mail size={20} className="text-cyan" />,
    },
    {
      type: 'booking',
      title: 'Reservations & Booking',
      description: 'Reservation date and guest booking request form block.',
      icon: <Calendar size={20} className="text-violet" />,
    },
    {
      type: 'announcement',
      title: 'Announcement Header',
      description: 'Slim top banner for notifications, seasonal sales, or alerts.',
      icon: <Tag size={20} className="text-amber" />,
    },
  ];

  const handleSelectTemplate = (type) => {
    const newSection = createSection(type);
    onAddSection(newSection);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content modal-content-wide glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Layers size={20} className="text-cyan" />
            <h3 className="modal-title font-display">Section Archetypes Library</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-lead-text">
            Choose a responsive section archetype to inject into your website layout.
          </p>

          <div className="section-archetypes-grid">
            {sectionTemplates.map((template) => (
              <div
                key={template.type}
                onClick={() => handleSelectTemplate(template.type)}
                className="section-template-card glass-card"
              >
                <div className="template-card-top">
                  <div className="template-icon-wrap">{template.icon}</div>
                  <span className="template-type-badge font-mono">{template.type}</span>
                </div>
                <h4 className="template-card-title font-display">{template.title}</h4>
                <p className="template-card-desc">{template.description}</p>
                <div className="template-card-hover-action font-mono">
                  <Plus size={14} />
                  <span>Insert Section</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
