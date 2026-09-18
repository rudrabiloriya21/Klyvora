import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
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
  Dices,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/useAuth';
import { groqService } from '../../services/ai/groqService';

const PRESET_PROMPTS = [
  {
    label: 'Artisan Bakery',
    category: 'Bakery',
    style: 'warm',
    prompt:
      'A warm, neighborhood artisan sourdough bakery and cafe with daily fresh bread drops, pastry viennoiserie, customer reviews, opening hours, and direct WhatsApp ordering.',
  },
  {
    label: 'Omakase Sushi',
    category: 'Restaurant',
    style: 'cinematic',
    prompt:
      'An intimate Tokyo-style sushi omakase lounge featuring seasonal Toyosu fish flights, sommelier sake pairings, chef counter booking, and Michelin-inspired storytelling.',
  },
  {
    label: 'Cloud AI SaaS',
    category: 'SaaS Startup',
    style: 'cinematic',
    prompt:
      'A high-performance autonomous edge telemetry and AI workflow platform for software engineers with live pricing tiers, API benchmarks, and documentation.',
  },
  {
    label: 'Athletic Sanctuary',
    category: 'Gym & Fitness',
    style: 'cyber',
    prompt:
      'A modern athletic performance club with small-group conditioning, contrast therapy cold plunge bays, infrared saunas, and trial membership passes.',
  },
  {
    label: 'Design Agency',
    category: 'Creative Agency',
    style: 'minimal',
    prompt:
      'An avant-garde brand identity and digital product design studio showcasing signature client case studies, design philosophy, and inquiry contact form.',
  },
  {
    label: 'Luxury Portfolio',
    category: 'Portfolio',
    style: 'cinematic',
    prompt:
      'A cinematic architectural photographer portfolio with full-bleed project galleries, published press credentials, client testimonials, and commission inquiries.',
  },
];

const CATEGORIES = [
  { id: 'Bakery', label: 'Bakery & Cafe', icon: <Coffee size={17} /> },
  { id: 'Restaurant', label: 'Fine Dining', icon: <Coffee size={17} /> },
  { id: 'SaaS Startup', label: 'Tech & SaaS', icon: <Laptop size={17} /> },
  { id: 'Creative Agency', label: 'Agency & Studio', icon: <Briefcase size={17} /> },
  { id: 'Gym & Fitness', label: 'Fitness & Health', icon: <Dumbbell size={17} /> },
  { id: 'Portfolio', label: 'Portfolio', icon: <Layers size={17} /> },
  { id: 'Online Store', label: 'E-commerce', icon: <Store size={17} /> },
  { id: 'Salon & Spa', label: 'Salon & Spa', icon: <Scissors size={17} /> },
  { id: 'Clothing Shop', label: 'Fashion Boutique', icon: <ShoppingBag size={17} /> },
  { id: 'Personal Brand', label: 'Personal Brand', icon: <User size={17} /> },
];

const STYLES = [
  {
    id: 'cinematic',
    name: 'Cinematic Obsidian',
    desc: 'Deep blacks, neon cyan glow & ultraviolet accents',
    gradient: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
  },
  {
    id: 'warm',
    name: 'Artisan Warmth',
    desc: 'Golden hearth amber, espresso & toasted terracotta',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    id: 'minimal',
    name: 'Pure Minimalist',
    desc: 'Stark platinum, airy whitespace & architectural slate',
    gradient: 'linear-gradient(135deg, #e2e8f0, #38bdf8)',
  },
  {
    id: 'cyber',
    name: 'Cyber Emerald',
    desc: 'Obsidian carbon, electric emerald & mint highlights',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
];

export default function NewProjectWizard({ onProjectCreated, onCancel }) {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState(
    'A warm, neighborhood artisan sourdough bakery and cafe with daily fresh bread drops, pastry viennoiserie, customer reviews, opening hours, and direct WhatsApp ordering.'
  );
  const [selectedCategory, setSelectedCategory] = useState('Bakery');
  const [selectedStyle, setSelectedStyle] = useState('warm');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [modules, setModules] = useState({
    enableWhatsApp: true,
    enableMenu: true,
    enableReviews: true,
    enablePricing: true,
    enableFAQ: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');

  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
    setSelectedCategory(preset.category);
    setSelectedStyle(preset.style);
  };

  const handleRandomPreset = () => {
    const random = PRESET_PROMPTS[Math.floor(Math.random() * PRESET_PROMPTS.length)];
    handleSelectPreset(random);
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    // If prompt is empty or default, suggest tailored prompt for this category
    const matchingPreset = PRESET_PROMPTS.find((p) => p.category === catId);
    if (matchingPreset && (!prompt || prompt.trim().length < 20)) {
      setPrompt(matchingPreset.prompt);
      setSelectedStyle(matchingPreset.style);
    }
  };

  const executeGeneration = async () => {
    const rawPrompt = (prompt || '').trim();
    const finalPrompt =
      rawPrompt ||
      `A premier, modern website for a ${selectedCategory} with responsive layout, engaging storytelling, customer reviews, and direct contact.`;

    setIsGenerating(true);

    const stages = [
      'Analyzing business concept & brand identity from your prompt...',
      'Synthesizing bespoke copywriting, taglines & hero headlines...',
      'Configuring chromatic palette & harmonious typography...',
      'Architecting responsive sections (Hero, Showcase, Pricing, FAQ, Contact)...',
      'Assembling interactive components & WhatsApp routing...',
      'Launching Klyvora Studio visual workspace...',
    ];

    let currentStage = 0;
    setGenerationStage(stages[0]);

    const stageInterval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setGenerationStage(stages[currentStage]);
      }
    }, 550);

    const enrichedPrompt = `${finalPrompt}. Category: ${selectedCategory}. Aesthetic Style: ${selectedStyle}. Modules: ${[
      modules.enableWhatsApp ? 'WhatsApp Ordering/Inquiry' : null,
      modules.enableMenu ? 'Showcase / Catalog' : null,
      modules.enableReviews ? 'Customer Reviews' : null,
      modules.enablePricing ? 'Pricing & Plans' : null,
      modules.enableFAQ ? 'FAQ Section' : null,
    ]
      .filter(Boolean)
      .join(', ')}.`;

    try {
      const proj = await groqService.generateWebsiteFromPrompt(enrichedPrompt, currentUser?.uid);
      clearInterval(stageInterval);
      setGenerationStage('Launching interactive workspace...');
      setTimeout(() => {
        setIsGenerating(false);
        onProjectCreated(proj.id);
      }, 350);
    } catch (err) {
      clearInterval(stageInterval);
      console.warn('[Klyvora Wizard] Remote generation fallback to local synthesis:', err);
      try {
        const fallbackData = groqService.synthesizeFallbackProjectData(finalPrompt);
        const fallbackProj = groqService.constructProjectFromData(fallbackData, finalPrompt, currentUser?.uid);
        setIsGenerating(false);
        onProjectCreated(fallbackProj.id);
      } catch (fErr) {
        console.error('[Klyvora Wizard] Fallback project construction failed:', fErr);
        setIsGenerating(false);
        alert('Could not generate website. Please try again with a descriptive prompt.');
      }
    }
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
                POWERED BY SYSTEM ARCHITECT // NATURAL LANGUAGE GENERATION
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

        {/* GENERATING SCREEN */}
        {isGenerating ? (
          <div className="wizard-generating-screen">
            <div className="generating-visual">
              <div className="generating-pulse-ring" />
              <Wand2 size={38} className="text-cyan generating-wand-icon" />
            </div>
            <h3 className="generating-title font-display">Architecting Digital Experience</h3>
            <p className="generating-stage-text font-mono">{generationStage}</p>
          </div>
        ) : (
          <div className="wizard-body-content">
            <div className="wizard-step-panel">
              {/* Natural Language Prompt Area */}
              <div className="wizard-prompt-hero glass-card">
                <div className="prompt-hero-top font-mono">
                  <div className="prompt-hero-badge">
                    <Sparkles size={14} className="text-cyan" />
                    <span>DESCRIBE YOUR WEBSITE IN PLAIN ENGLISH</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomPreset}
                    className="btn-random-idea font-mono"
                    title="Load a random inspiration prompt"
                  >
                    <Dices size={14} />
                    <span>Inspire Me</span>
                  </button>
                </div>

                <div className="prompt-textarea-wrapper">
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        executeGeneration();
                      }
                    }}
                    placeholder="Describe the business or website you want to build in detail (e.g. A boutique Japanese sushi omakase lounge in Tokyo with seasonal multi-course menu, sake pairings, counter reservation booking, and a dark minimalist aesthetic)..."
                    className="prompt-hero-textarea"
                  />
                </div>

                {/* Inspiration Chips */}
                <div className="preset-quick-chips">
                  <span className="font-mono text-muted" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    INSPIRATION PRESETS:
                  </span>
                  {PRESET_PROMPTS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`preset-chip font-mono ${
                        prompt === preset.prompt ? 'active-chip' : ''
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selector */}
              <div className="wizard-section-block">
                <div className="section-block-header font-mono">
                  <span>BUSINESS CATEGORY INSPIRATION</span>
                </div>
                <div className="wizard-categories-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`wizard-category-card glass-card ${
                        selectedCategory === cat.id ? 'active' : ''
                      }`}
                    >
                      <div className="cat-icon-wrap">{cat.icon}</div>
                      <span className="cat-label">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Personality & Style */}
              <div className="wizard-section-block">
                <div className="section-block-header font-mono">
                  <span>AESTHETIC VIBE & PALETTE</span>
                </div>
                <div className="style-cards-row">
                  {STYLES.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStyle(st.id)}
                      className={`style-card glass-card ${
                        selectedStyle === st.id ? 'active' : ''
                      }`}
                    >
                      <div className="style-card-header">
                        <strong className="style-name font-display">{st.name}</strong>
                        {selectedStyle === st.id && (
                          <span className="style-check-badge">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <p className="style-desc">{st.desc}</p>
                      <div
                        className="style-indicator-bar"
                        style={{ background: st.gradient }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Modules Accordion Toggle */}
              <div className="wizard-advanced-toggle-area">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="btn-toggle-advanced font-mono"
                >
                  <SlidersHorizontal size={14} />
                  <span>
                    {showAdvanced
                      ? 'Hide Functional Modules Configuration'
                      : 'Customize Included Modules & Features (Optional)'}
                  </span>
                </button>

                {showAdvanced && (
                  <div className="features-checkbox-grid advanced-modules-box glass-card">
                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={modules.enableWhatsApp}
                        onChange={(e) =>
                          setModules({ ...modules, enableWhatsApp: e.target.checked })
                        }
                      />
                      <span>WhatsApp Direct Ordering & Contact</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={modules.enableMenu}
                        onChange={(e) =>
                          setModules({ ...modules, enableMenu: e.target.checked })
                        }
                      />
                      <span>Menu / Offerings Showcase Catalog</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={modules.enableReviews}
                        onChange={(e) =>
                          setModules({ ...modules, enableReviews: e.target.checked })
                        }
                      />
                      <span>Customer Reviews & Testimonials</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={modules.enablePricing}
                        onChange={(e) =>
                          setModules({ ...modules, enablePricing: e.target.checked })
                        }
                      />
                      <span>Pricing & Plans Comparison</span>
                    </label>

                    <label className="checkbox-item glass-card">
                      <input
                        type="checkbox"
                        checked={modules.enableFAQ}
                        onChange={(e) =>
                          setModules({ ...modules, enableFAQ: e.target.checked })
                        }
                      />
                      <span>Interactive FAQ Accordion</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="wizard-footer-actions">
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-secondary font-mono"
                >
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={executeGeneration}
                  className="btn btn-primary font-mono wizard-generate-btn"
                >
                  <Sparkles size={16} />
                  <span>Generate Full Website with AI</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
