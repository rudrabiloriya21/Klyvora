import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building,
  Coffee,
  ShoppingBag,
  Scissors,
  Dumbbell,
  Laptop,
  Briefcase,
  Layers,
  Store,
  User,
  Wand2,
  X,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { createProject, createSection } from '../../models/projectSchema';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/useAuth';
import { groqService } from '../../services/ai/groqService';

export default function NewProjectWizard({ onProjectCreated, onCancel }) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [fastPrompt, setFastPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');

  const [formData, setFormData] = useState({
    name: 'Aura Artisan Bakery',
    category: 'Bakery',
    description: 'Artisan sourdough bakery serving naturally leavened bread and pastries in San Francisco.',
    location: 'San Francisco, CA',
    audience: 'Local food lovers and morning commuters',
    style: 'cinematic', // 'cinematic', 'minimal', 'warm', 'vibrant'
    phone: '+1 (555) 234-8901',
    email: 'hello@aurabakery.com',
    whatsapp: '+15552348901',
    hours: 'Tue–Sun: 7 AM – 2 PM',
    enableWhatsApp: true,
    enableMenu: true,
    enableReviews: true,
    enablePricing: true,
    enableFAQ: true,
  });

  const categories = [
    { id: 'Bakery', label: 'Bakery', icon: <Coffee size={20} /> },
    { id: 'Restaurant', label: 'Restaurant', icon: <Coffee size={20} /> },
    { id: 'Clothing Shop', label: 'Clothing Shop', icon: <ShoppingBag size={20} /> },
    { id: 'Salon & Spa', label: 'Salon & Spa', icon: <Scissors size={20} /> },
    { id: 'Gym & Fitness', label: 'Gym & Fitness', icon: <Dumbbell size={20} /> },
    { id: 'Freelancer', label: 'Freelancer', icon: <User size={20} /> },
    { id: 'Creative Agency', label: 'Agency', icon: <Briefcase size={20} /> },
    { id: 'Portfolio', label: 'Portfolio', icon: <Layers size={20} /> },
    { id: 'SaaS Startup', label: 'SaaS Startup', icon: <Laptop size={20} /> },
    { id: 'Local Service', label: 'Local Service', icon: <Building size={20} /> },
    { id: 'Online Store', label: 'Online Store', icon: <Store size={20} /> },
    { id: 'Personal Brand', label: 'Personal Brand', icon: <Sparkles size={20} /> },
  ];

  const handleApplyFastPrompt = (promptText) => {
    setFastPrompt(promptText);
    const p = promptText.toLowerCase();

    if (p.includes('bakery') || p.includes('bread')) {
      setFormData({
        name: 'Aura Artisan Bakery',
        category: 'Bakery',
        description: 'Naturally leavened sourdough bread, flaky croissants, and daily pastries with local grains.',
        location: 'San Francisco, CA',
        audience: 'Local community and sourdough enthusiasts',
        style: 'warm',
        phone: '+1 (555) 234-8901',
        email: 'hello@aurabakery.com',
        whatsapp: '+15552348901',
        hours: 'Tue–Sun: 7:00 AM – 2:00 PM',
        enableWhatsApp: true,
        enableMenu: true,
        enableReviews: true,
        enablePricing: true,
        enableFAQ: true,
      });
    } else if (p.includes('restaurant') || p.includes('bistro')) {
      setFormData({
        name: 'L’Onyx Bistro',
        category: 'Restaurant',
        description: 'Modern French dining with farm-to-table seasonal tasting menus and curated natural wines.',
        location: 'Downtown Seattle, WA',
        audience: 'Fine dining guests and celebration diners',
        style: 'cinematic',
        phone: '+1 (555) 890-1234',
        email: 'reservations@lonyxbistro.com',
        whatsapp: '+15558901234',
        hours: 'Wed–Sun: 5:00 PM – 10:30 PM',
        enableWhatsApp: true,
        enableMenu: true,
        enableReviews: true,
        enablePricing: false,
        enableFAQ: true,
      });
    } else if (p.includes('saas') || p.includes('tech')) {
      setFormData({
        name: 'Veloce Data Engine',
        category: 'SaaS Startup',
        description: 'Real-time edge event streaming and distributed telemetry platform for cloud engineers.',
        location: 'Global / Remote First',
        audience: 'DevOps architects and software engineering leaders',
        style: 'cinematic',
        phone: '',
        email: 'team@veloce.dev',
        whatsapp: '',
        hours: '24/7 Availability',
        enableWhatsApp: false,
        enableMenu: false,
        enableReviews: true,
        enablePricing: true,
        enableFAQ: true,
      });
    }
  };

  const executeGeneration = async () => {
    setIsGenerating(true);

    if (fastPrompt && fastPrompt.trim()) {
      setGenerationStage('Generating complete architecture via System Architect 1.2 Neo...');
      try {
        const proj = await groqService.generateWebsiteFromPrompt(fastPrompt.trim(), currentUser?.uid);
        setTimeout(() => {
          setIsGenerating(false);
          onProjectCreated(proj.id);
        }, 500);
        return;
      } catch (err) {
        console.warn('Groq wizard generation fallback:', err);
      }
    }

    const stages = [
      'Analyzing business category & target demographic...',
      'Synthesizing responsive section topology...',
      'Configuring chromatic palette & typography pairs...',
      'Assembling interactive forms & WhatsApp routing...',
      'Initializing Klyvora Studio visual workspace...',
    ];

    let current = 0;
    setGenerationStage(stages[0]);

    const interval = setInterval(() => {
      current++;
      if (current < stages.length) {
        setGenerationStage(stages[current]);
      } else {
        clearInterval(interval);

        // Build customized project
        const sections = [
          createSection('navigation', {
            logoText: formData.name,
            ctaText: formData.enableWhatsApp ? 'WhatsApp Order' : 'Contact Us',
            ctaUrl: '#contact',
          }),
          createSection('hero', {
            heading: `${formData.name} — Handcrafted with Purpose.`,
            subheading: formData.description,
            primaryBtnText: formData.enableMenu ? 'Explore Menu' : 'Learn More',
            primaryBtnUrl: formData.enableMenu ? '#products' : '#about',
            secondaryBtnText: formData.enableWhatsApp ? 'WhatsApp Inquiry' : 'Get in Touch',
            secondaryBtnUrl: '#contact',
          }),
          createSection('about', {
            heading: `The ${formData.name} Perspective`,
            paragraph1: formData.description,
          }),
        ];

        if (formData.enableMenu) {
          sections.push(createSection('products'));
        }

        sections.push(createSection('features'));

        if (formData.enableReviews) {
          sections.push(createSection('testimonials'));
        }

        if (formData.enablePricing) {
          sections.push(createSection('pricing'));
        }

        if (formData.enableFAQ) {
          sections.push(createSection('faq'));
        }

        sections.push(
          createSection('contact', {
            subheading: `Located in ${formData.location}. We welcome your message or order.`,
          })
        );

        sections.push(
          createSection('footer', {
            businessName: formData.name,
            tagline: formData.description.slice(0, 70),
          })
        );

        const projectTheme =
          formData.style === 'warm'
            ? { primaryColor: '#f59e0b', secondaryColor: '#d97706', bgColor: '#080706' }
            : formData.style === 'minimal'
            ? { primaryColor: '#e2e8f0', secondaryColor: '#38bdf8', bgColor: '#090a0f' }
            : { primaryColor: '#8b5cf6', secondaryColor: '#06b6d4', bgColor: '#07080c' };

        const newProj = createProject({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          theme: projectTheme,
          sections,
          brand: {
            businessName: formData.name,
            category: formData.category,
            description: formData.description,
            location: formData.location,
            contact: {
              email: formData.email,
              phone: formData.phone,
              whatsapp: formData.whatsapp,
              address: formData.location,
              openingHours: formData.hours,
            },
          },
        });

        storageService.saveProject(newProj, currentUser?.uid);
        setIsGenerating(false);
        onProjectCreated(newProj.id);
      }
    }, 450);
  };

  return (
    <div className="wizard-page-wrapper">
      <div className="wizard-container glass-card glass-card-elevated">
        {/* Top Header */}
        <div className="wizard-header">
          <div className="wizard-brand">
            <BrandLogo size="default" isStudio={true} showParent={false} />
            <div className="wizard-title-col">
              <span className="wizard-title font-display">Create New Digital Experience</span>
              <span className="wizard-subtitle font-mono">
                POWERED BY XEORVIA SYSTEM ARCHITECT
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="wizard-cancel-btn"
            title="Cancel"
            aria-label="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="wizard-progress-track">
          <div
            className="wizard-progress-bar"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* GENERATING SCREEN */}
        {isGenerating ? (
          <div className="wizard-generating-screen">
            <div className="generating-visual">
              <div className="generating-pulse-ring" />
              <Wand2 size={36} className="text-cyan generating-wand-icon" />
            </div>
            <h3 className="generating-title font-display">Architecting Digital Experience</h3>
            <p className="generating-stage-text font-mono">{generationStage}</p>
          </div>
        ) : (
          <div className="wizard-body-content">
            {/* STEP 1: Fast Prompt & Category Preset */}
            {step === 1 && (
              <div className="wizard-step-panel">
                {/* Fast Prompt Bar */}
                <div className="wizard-fast-prompt-box glass-card">
                  <div className="fast-prompt-header font-mono">
                    <Sparkles size={14} className="text-cyan" />
                    <span>NATURAL LANGUAGE PROMPT GENERATOR</span>
                  </div>
                  <div className="fast-prompt-input-row">
                    <input
                      type="text"
                      value={fastPrompt}
                      onChange={(e) => setFastPrompt(e.target.value)}
                      placeholder="e.g. Create a modern website for a local bakery with WhatsApp orders, reviews, and hours..."
                      className="fast-prompt-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyFastPrompt(fastPrompt)}
                      className="btn btn-primary fast-prompt-btn font-mono"
                    >
                      <span>Analyze</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="preset-quick-chips">
                    <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                      PRESETS:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFastPrompt(
                          'Create a modern website for a local artisan sourdough bakery with daily menu, WhatsApp orders, customer reviews, location, and opening hours.'
                        )
                      }
                      className="preset-chip font-mono"
                    >
                      Artisan Bakery
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFastPrompt(
                          'Create a high-performance website for a real-time cloud telemetry SaaS startup with pricing, features, and developer docs.'
                        )
                      }
                      className="preset-chip font-mono"
                    >
                      Cloud SaaS
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFastPrompt(
                          'Create an elegant fine dining restaurant website with seasonal menu, reservation booking, and wine list.'
                        )
                      }
                      className="preset-chip font-mono"
                    >
                      Bistro Restaurant
                    </button>
                  </div>
                </div>

                {/* Category Grid */}
                <span className="wizard-section-heading font-mono">
                  SELECT BUSINESS CATEGORY
                </span>
                <div className="wizard-categories-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`wizard-category-card glass-card ${
                        formData.category === cat.id ? 'active' : ''
                      }`}
                    >
                      <div className="cat-icon-wrap">{cat.icon}</div>
                      <span className="cat-label">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Business Profile */}
            {step === 2 && (
              <div className="wizard-step-panel">
                <span className="wizard-section-heading font-mono">
                  STEP 2 // BUSINESS IDENTITY & DETAILS
                </span>

                <div className="wizard-form-grid">
                  <div className="form-group">
                    <label className="form-label font-mono">BUSINESS / BRAND NAME *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Aura Artisan Bakery"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label font-mono">LOCATION / SERVICE AREA</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 124 Heritage Lane, San Francisco, CA"
                    />
                  </div>

                  <div className="form-group form-col-full">
                    <label className="form-label font-mono">BUSINESS DESCRIPTION & PURPOSE</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-input"
                      placeholder="What makes your business unique? What do you offer?"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label font-mono">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label font-mono">WHATSAPP / PHONE NUMBER</label>
                    <input
                      type="text"
                      value={formData.whatsapp || formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whatsapp: e.target.value,
                          phone: e.target.value,
                        })
                      }
                      className="form-input"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="form-group form-col-full">
                    <label className="form-label font-mono">OPENING HOURS / CADENCE</label>
                    <input
                      type="text"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Tue–Sun: 7:00 AM – 2:00 PM"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Features & Aesthetic Style */}
            {step === 3 && (
              <div className="wizard-step-panel">
                <span className="wizard-section-heading font-mono">
                  STEP 3 // AESTHETIC PALETTE & REQUIRED SECTIONS
                </span>

                {/* Style Selector */}
                <div className="wizard-style-selector">
                  <label className="form-label font-mono">DESIGN PERSONALITY</label>
                  <div className="style-cards-row">
                    {[
                      { id: 'cinematic', name: 'Cinematic Obsidian', desc: 'Nebula violet, cyan glow, deep blacks' },
                      { id: 'warm', name: 'Artisan Warmth', desc: 'Golden hearth amber, toasted bronze, dark espresso' },
                      { id: 'minimal', name: 'Pure Minimalist', desc: 'Crisp platinum, clean white, slate accents' },
                    ].map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setFormData({ ...formData, style: st.id })}
                        className={`style-card glass-card ${formData.style === st.id ? 'active' : ''}`}
                      >
                        <strong className="style-name font-display">{st.name}</strong>
                        <p className="style-desc">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggle features */}
                <div className="wizard-features-toggles">
                  <label className="form-label font-mono" style={{ marginTop: '20px' }}>
                    KEY FUNCTIONALITY MODULES
                  </label>
                  <div className="features-checkbox-grid">
                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={formData.enableWhatsApp}
                        onChange={(e) =>
                          setFormData({ ...formData, enableWhatsApp: e.target.checked })
                        }
                      />
                      <span>WhatsApp Direct Ordering</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={formData.enableMenu}
                        onChange={(e) => setFormData({ ...formData, enableMenu: e.target.checked })}
                      />
                      <span>Menu / Offerings Catalog</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={formData.enableReviews}
                        onChange={(e) =>
                          setFormData({ ...formData, enableReviews: e.target.checked })
                        }
                      />
                      <span>Customer Reviews / Testimonials</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={formData.enablePricing}
                        onChange={(e) =>
                          setFormData({ ...formData, enablePricing: e.target.checked })
                        }
                      />
                      <span>Pricing & Plans Table</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={formData.enableFAQ}
                        onChange={(e) => setFormData({ ...formData, enableFAQ: e.target.checked })}
                      />
                      <span>Interactive FAQ Accordion</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="wizard-footer-actions">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn btn-secondary font-mono"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn btn-primary font-mono"
                  style={{ marginLeft: 'auto' }}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={executeGeneration}
                  className="btn btn-primary font-mono wizard-generate-btn"
                  style={{ marginLeft: 'auto' }}
                >
                  <Sparkles size={16} />
                  <span>Generate Website with AI</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
