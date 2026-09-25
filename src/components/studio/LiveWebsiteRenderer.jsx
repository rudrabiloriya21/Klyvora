import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  CheckCircle,
  MessageCircle,
  Send,
  Plus,
  Sparkles,
  Star,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export default function LiveWebsiteRenderer({
  project,
  device = 'desktop',
  selectedSectionId,
  onSelectSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onDeleteSection,
  onAddSectionClick,
  isInteractiveMode = false, // When true, no selection borders appear (pure presentation preview)
  workspaceMode = 'ai',
  activePageSlug = 'home',
  onNavigatePage,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const theme = project.theme || {};
  const brand = project.brand || {};
  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
  const allHomeSections = (homePage?.sections || []).filter((s) => !s.hidden);

  // -------------------------------------------------------------
  // Dynamic Page Resolution (Home, About, Menu, Contact, or 404)
  // -------------------------------------------------------------
  const resolvePageSections = () => {
    const slug = (activePageSlug || 'home').toLowerCase().trim();

    // 1. Check if an explicit page matches in project.pages
    const explicitPage = (project.pages || []).find(
      (p) => p.slug?.toLowerCase() === slug || (slug === 'home' && p.isHome)
    );
    if (explicitPage && explicitPage.sections?.length > 0) {
      return {
        sections: explicitPage.sections.filter((s) => !s.hidden),
        isNotFound: false,
        pageTitle: explicitPage.title || slug,
      };
    }

    // 2. Default Home page
    if (slug === 'home' || slug === '') {
      return { sections: allHomeSections, isNotFound: false, pageTitle: 'Home' };
    }

    // 3. Virtual "About" page
    if (slug === 'about' || slug === 'story' || slug === 'our-story') {
      const navSec = allHomeSections.find((s) => s.type === 'navigation');
      const aboutSec = allHomeSections.find((s) => s.type === 'about');
      const featSec = allHomeSections.find((s) => s.type === 'features');
      const testSec = allHomeSections.find((s) => s.type === 'testimonials');
      const footSec = allHomeSections.find((s) => s.type === 'footer');

      const aboutBanner = {
        id: 'virt_about_banner',
        type: 'hero',
        name: 'About Page Banner',
        props: {
          badge: 'OUR STORY & HERITAGE',
          heading: `About ${brand.businessName || 'Our Business'}`,
          subheading:
            brand.description ||
            'Dedicated to authentic quality, honest service, and genuine customer relationships.',
          alignment: 'center',
          primaryBtnText: 'Explore Offerings',
          primaryBtnUrl: '#products',
          secondaryBtnText: 'Visit Our Location',
          secondaryBtnUrl: '#contact',
        },
      };

      const resolved = [navSec, aboutBanner, aboutSec, featSec, testSec, footSec].filter(Boolean);
      return { sections: resolved, isNotFound: false, pageTitle: 'About Us' };
    }

    // 4. Virtual "Menu" page
    if (slug === 'menu' || slug === 'products' || slug === 'daily-menu') {
      const navSec = allHomeSections.find((s) => s.type === 'navigation');
      const prodSec = allHomeSections.find((s) => s.type === 'products' || s.type === 'services');
      const pricingSec = allHomeSections.find((s) => s.type === 'pricing');
      const faqSec = allHomeSections.find((s) => s.type === 'faq');
      const footSec = allHomeSections.find((s) => s.type === 'footer');

      const menuBanner = {
        id: 'virt_menu_banner',
        type: 'hero',
        name: 'Menu Page Banner',
        props: {
          badge: 'CURATED OFFERINGS',
          heading: `Catalog & Offerings`,
          subheading:
            'Handpicked and prepared with care. Available for instant purchase or pre-order via WhatsApp.',
          alignment: 'center',
          primaryBtnText: 'Order via WhatsApp',
          primaryBtnUrl: '#whatsapp',
          secondaryBtnText: 'Visit Store',
          secondaryBtnUrl: '#contact',
        },
      };

      const resolved = [navSec, menuBanner, prodSec, pricingSec, faqSec, footSec].filter(Boolean);
      return { sections: resolved, isNotFound: false, pageTitle: 'Menu & Offerings' };
    }

    // 5. Virtual "Contact" page
    if (slug === 'contact') {
      const navSec = allHomeSections.find((s) => s.type === 'navigation');
      const contactSec = allHomeSections.find((s) => s.type === 'contact');
      const faqSec = allHomeSections.find((s) => s.type === 'faq');
      const footSec = allHomeSections.find((s) => s.type === 'footer');

      const contactBanner = {
        id: 'virt_contact_banner',
        type: 'hero',
        name: 'Contact Page Banner',
        props: {
          badge: 'VISIT & CONNECT',
          heading: `Connect with ${brand.businessName || 'Us'}`,
          subheading: `Located at ${
            brand.location || brand.contact?.address || 'our location'
          }. Reach out directly via WhatsApp or visit in person.`,
          alignment: 'center',
          primaryBtnText: 'Chat on WhatsApp',
          primaryBtnUrl: '#whatsapp',
        },
      };

      const resolved = [navSec, contactBanner, contactSec, faqSec, footSec].filter(Boolean);
      return { sections: resolved, isNotFound: false, pageTitle: 'Contact & Location' };
    }

    // 6. Page Not Created Yet (404)
    const navSec = allHomeSections.find((s) => s.type === 'navigation');
    const footSec = allHomeSections.find((s) => s.type === 'footer');
    return {
      sections: [navSec, footSec].filter(Boolean),
      isNotFound: true,
      pageTitle: 'Page Not Created Yet',
    };
  };

  const { sections, isNotFound, pageTitle } = resolvePageSections();

  // -------------------------------------------------------------
  // Universal Link and Action Dispatcher
  // -------------------------------------------------------------
  const navigateToPage = (slug) => {
    if (onNavigatePage) {
      onNavigatePage(slug);
    }
  };

  const scrollToTargetSection = (targetId) => {
    if (!targetId) return;
    const clean = targetId.replace(/^#/, '').toLowerCase().trim();

    let el =
      document.getElementById(clean) ||
      document.querySelector(`[data-section-type="${clean}"]`);

    if (!el && (clean === 'reviews' || clean === 'testimonials')) {
      el =
        document.querySelector('[data-section-type="testimonials"]') ||
        document.querySelector('.testimonials-area');
    }
    if (!el && (clean === 'menu' || clean === 'products')) {
      el =
        document.querySelector('[data-section-type="products"]') ||
        document.querySelector('.products-area');
    }
    if (!el && (clean === 'contact' || clean === 'location' || clean === 'visit')) {
      el =
        document.querySelector('[data-section-type="contact"]') ||
        document.querySelector('.contact-area');
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isSafeInteractivePhoneNumber = (phoneStr) => {
    if (!phoneStr || typeof phoneStr !== 'string') return false;
    const clean = phoneStr.replace(/[^0-9]/g, '');
    if (clean.length < 10) return false;
    if (
      clean.includes('9876543210') ||
      clean.includes('9820012345') ||
      clean.includes('9829012345') ||
      clean.includes('7442456789') ||
      clean.includes('9987054321') ||
      clean.includes('9820054321') ||
      clean.includes('8041239999') ||
      clean.includes('0000000000') ||
      clean.endsWith('0000000000') ||
      /^0+$/.test(clean) ||
      /^(\d)\1{7,}$/.test(clean)
    ) {
      return false;
    }
    return true;
  };

  const handleLinkAction = (e, { url = '', label = '', actionType = '' }) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    const normLabel = (label || '').toLowerCase().trim();
    const normUrl = (url || '').trim();

    // 1. WhatsApp Order / WhatsApp links
    if (
      normLabel.includes('whatsapp') ||
      normUrl.includes('wa.me') ||
      normUrl.includes('whatsapp') ||
      normUrl === '#whatsapp' ||
      actionType === 'whatsapp'
    ) {
      const waCandidate = brand.contact?.whatsapp || brand.contact?.phone || '';
      if (!isSafeInteractivePhoneNumber(waCandidate)) {
        alert('This website is currently using a placeholder phone number (+91 00000 00000). Please update your verified business phone number in the Studio Brand Settings to activate WhatsApp ordering.');
        return;
      }
      const rawDigits = waCandidate.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${rawDigits}?text=${encodeURIComponent(
        `Hello ${brand.businessName || 'Team'}! I would like to place an order / make an enquiry.`
      )}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Phone Call (tel:)
    if (normUrl.startsWith('tel:') || actionType === 'tel' || normLabel.includes('call')) {
      const phoneCandidate = normUrl.startsWith('tel:')
        ? normUrl.replace(/^tel:/, '')
        : (brand.contact?.phone || '');
      if (!isSafeInteractivePhoneNumber(phoneCandidate)) {
        alert('This website is currently using a placeholder phone number (+91 00000 00000). Please update your verified business phone number in the Studio Brand Settings to activate direct calling.');
        return;
      }
      const tel = `tel:${phoneCandidate.trim()}`;
      window.open(tel, '_self');
      return;
    }

    // 3. Email (mailto:)
    if (normUrl.startsWith('mailto:') || actionType === 'mailto' || normLabel.includes('email')) {
      const mailto = normUrl.startsWith('mailto:')
        ? normUrl
        : `mailto:${brand.contact?.email || 'contact@business.in'}`;
      window.open(mailto, '_self');
      return;
    }

    // 4. External Absolute Web Links (https:// or http://)
    if (normUrl.startsWith('http://') || normUrl.startsWith('https://')) {
      window.open(normUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 5. Explicit "Visit Luma & Bean" / Location Scroll
    if (
      normLabel.includes('visit') ||
      normLabel.includes('location') ||
      normLabel.includes('find us')
    ) {
      if (activePageSlug === 'home') {
        scrollToTargetSection('contact');
      } else {
        navigateToPage('home');
        setTimeout(() => scrollToTargetSection('contact'), 200);
      }
      return;
    }

    // 6. Explicit "Reviews" / "Testimonials"
    if (
      normLabel.includes('review') ||
      normLabel.includes('testimonial') ||
      normUrl === '#reviews' ||
      normUrl === '#testimonials'
    ) {
      if (activePageSlug === 'home') {
        scrollToTargetSection('testimonials');
      } else {
        navigateToPage('home');
        setTimeout(() => scrollToTargetSection('testimonials'), 200);
      }
      return;
    }

    // 7. "Explore the Menu" / "Menu"
    if (
      normLabel.includes('explore the menu') ||
      normLabel.includes('explore menu') ||
      normLabel.includes('view daily menu') ||
      normLabel === 'menu' ||
      normLabel === 'daily menu' ||
      normUrl === '#menu' ||
      normUrl === '/menu' ||
      normUrl === 'menu' ||
      normUrl === '#products'
    ) {
      navigateToPage('menu');
      return;
    }

    // 8. "About" / "Story"
    if (
      normLabel === 'about' ||
      normLabel === 'story' ||
      normLabel === 'our story' ||
      normLabel.includes('about us') ||
      normUrl === '#about' ||
      normUrl === '/about' ||
      normUrl === 'about'
    ) {
      navigateToPage('about');
      return;
    }

    // 9. "Contact"
    if (
      normLabel === 'contact' ||
      normLabel === 'contact us' ||
      normLabel === 'get in touch' ||
      normUrl === '#contact' ||
      normUrl === '/contact' ||
      normUrl === 'contact'
    ) {
      navigateToPage('contact');
      return;
    }

    // 10. "Home"
    if (
      normLabel === 'home' ||
      normUrl === '#home' ||
      normUrl === '/' ||
      normUrl === '/home' ||
      normUrl === 'home' ||
      normUrl === '#/' ||
      normUrl === '' ||
      normUrl === '#'
    ) {
      navigateToPage('home');
      const scrollRoot = document.querySelector('.canvas-scroll-container') || window;
      scrollRoot.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 11. In-page anchor link (e.g. #faq, #pricing, #features)
    if (normUrl.startsWith('#')) {
      const targetSec = normUrl.slice(1);
      if (targetSec) {
        scrollToTargetSection(targetSec);
        return;
      }
    }

    // 12. Explicit page slug requested: e.g. /custom-page
    const cleanSlug = normUrl.replace(/^[/#!]+/, '').trim();
    if (cleanSlug) {
      navigateToPage(cleanSlug);
      return;
    }

    // Default fallback: navigate to home safely
    navigateToPage('home');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;

    // Record submission into project inquiry inbox
    storageService.addFormSubmission(project.id, {
      formType: 'Contact Inquiry',
      data: { ...contactForm },
    });

    setFormSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div
      className={`rendered-site-root ${
        device === 'mobile'
          ? 'is-device-mobile'
          : device === 'tablet'
          ? 'is-device-tablet'
          : 'is-device-desktop'
      }`}
      style={{
        '--site-primary': theme.primaryColor || '#8b5cf6',
        '--site-secondary': theme.secondaryColor || '#06b6d4',
        '--site-accent': theme.accentColor || '#ec4899',
        '--site-bg': theme.bgColor || '#07080c',
        '--site-surface': theme.surfaceColor || '#0c0e15',
        '--site-text': theme.textColor || '#f8fafc',
        '--site-radius': theme.borderRadius || '14px',
        '--site-font-heading': `'${theme.fontHeading || 'Syne'}', sans-serif`,
        '--site-font-body': `'${theme.fontBody || 'Plus Jakarta Sans'}', sans-serif`,
        '--site-max-width': theme.containerWidth || '1200px',
        backgroundColor: 'var(--site-bg)',
        color: 'var(--site-text)',
        fontFamily: 'var(--site-font-body)',
        minHeight: '100%',
        position: 'relative',
      }}
    >
      {/* Sub-page Breadcrumb Indicator */}
      {activePageSlug !== 'home' && (
        <div
          className="preview-page-breadcrumb font-mono"
          style={{
            background: 'rgba(6, 182, 212, 0.12)',
            borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
            padding: '8px 20px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#38bdf8',
            position: 'sticky',
            top: 0,
            zIndex: 60,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>
            PAGE: <strong>{pageTitle.toUpperCase()}</strong> (/{activePageSlug})
          </span>
          <button
            type="button"
            onClick={() => navigateToPage('home')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '11px',
            }}
          >
            &larr; Switch to Home
          </button>
        </div>
      )}

      {/* Render sections or Page Not Created Yet */}
      {sections.map((section, index) => {
        const isSelected = selectedSectionId === section.id;
        const p = section.props || {};

        return (
          <div
            key={section.id}
            id={
              section.type === 'contact'
                ? 'contact'
                : section.type === 'testimonials'
                ? 'testimonials'
                : section.type === 'products'
                ? 'products'
                : section.type === 'faq'
                ? 'faq'
                : section.type === 'pricing'
                ? 'pricing'
                : section.type === 'about'
                ? 'about'
                : section.id
            }
            data-section-type={section.type}
            onClick={(e) => {
              if (!isInteractiveMode) {
                e.stopPropagation();
                onSelectSection(section.id);
              }
            }}
            className={`rendered-section-wrapper ${
              !isInteractiveMode
                ? workspaceMode === 'ai'
                  ? 'canvas-ai-section'
                  : 'canvas-inspectable-section'
                : ''
            } ${isSelected ? 'section-active-selection' : ''}`}
          >
            {/* Floating quick section controls on hover or selection */}
            {!isInteractiveMode && (
              <div
                className={`section-ai-hover-badge font-sans ${isSelected ? 'is-selected-badge' : ''}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="section-ai-badge-label"
                  onClick={() => onSelectSection(isSelected ? null : section.id)}
                  title="Click to focus editing on this section"
                >
                  <Sparkles size={12} className="text-cyan" />
                  <span>{section.name || (section.type ? section.type.charAt(0).toUpperCase() + section.type.slice(1) : 'Section')}</span>
                </div>

                {isSelected && (
                  <div className="section-ai-quick-btns">
                    {onMoveSectionUp && (
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveSectionUp(section.id)}
                        className="section-ai-mini-btn"
                        title="Move Section Up"
                      >
                        <ChevronUp size={13} />
                      </button>
                    )}
                    {onMoveSectionDown && (
                      <button
                        type="button"
                        disabled={index === sections.length - 1}
                        onClick={() => onMoveSectionDown(section.id)}
                        className="section-ai-mini-btn"
                        title="Move Section Down"
                      >
                        <ChevronDown size={13} />
                      </button>
                    )}
                    {onDeleteSection && (
                      <button
                        type="button"
                        onClick={() => onDeleteSection(section.id)}
                        className="section-ai-mini-btn delete"
                        title="Delete Section"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* In Manual Tools mode: Full manual movement & duplication toolbar */}
            {!isInteractiveMode && workspaceMode === 'manual' && (
              <div className="section-floating-toolbar" onClick={(e) => e.stopPropagation()}>
                <span className="section-pill-tag font-mono">
                  {section.name || section.type}
                </span>

                <div className="section-toolbar-btn-group">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveSectionUp(section.id)}
                    className="toolbar-action-btn"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === sections.length - 1}
                    onClick={() => onMoveSectionDown(section.id)}
                    className="toolbar-action-btn"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateSection(section.id)}
                    className="toolbar-action-btn"
                    title="Duplicate Section"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSection(section.id)}
                    className="toolbar-action-btn toolbar-delete-btn"
                    title="Delete Section"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION RENDERERS */}

            {/* 1. Announcement Bar */}
            {section.type === 'announcement' && (
              <div className="preview-announcement-bar">
                <div className="preview-container announcement-inner">
                  <span className="announcement-pill font-mono">{p.badge || 'NOTICE'}</span>
                  <span className="announcement-text">{p.text}</span>
                  {p.linkText && (
                    <a
                      href={p.linkUrl || '#'}
                      className="announcement-link"
                      onClick={(e) =>
                        handleLinkAction(e, { url: p.linkUrl, label: p.linkText })
                      }
                    >
                      {p.linkText} &rarr;
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 2. Navigation */}
            {section.type === 'navigation' && (
              <header className={`preview-navbar ${p.sticky ? 'is-sticky' : ''} ${device === 'mobile' ? 'is-mobile-nav' : ''}`}>
                <div className="preview-container nav-inner">
                  <a
                    href="#home"
                    className="nav-brand-title"
                    onClick={(e) => handleLinkAction(e, { url: '#home', label: 'Home' })}
                  >
                    <span className="brand-dot" />
                    <span>{p.logoText || brand.businessName || 'Brand'}</span>
                  </a>

                  {/* Desktop Links (Hidden on Mobile Device Frame) */}
                  {device !== 'mobile' && (
                    <nav className="desktop-links" aria-label="Main navigation">
                      {(p.links || []).map((link, i) => {
                        const isActiveLink =
                          (link.label?.toLowerCase() === activePageSlug) ||
                          (link.label?.toLowerCase() === 'home' && activePageSlug === 'home');
                        return (
                          <a
                            key={i}
                            href={link.url || '#'}
                            className={`nav-item-link ${isActiveLink ? 'is-active-link' : ''}`}
                            style={
                              isActiveLink
                                ? { color: 'var(--site-primary)', fontWeight: 600 }
                                : {}
                            }
                            onClick={(e) =>
                              handleLinkAction(e, { url: link.url, label: link.label })
                            }
                          >
                            {link.label}
                          </a>
                        );
                      })}
                    </nav>
                  )}

                  {/* Desktop Nav CTA Button */}
                  {device !== 'mobile' && p.ctaText && (
                    <a
                      href={p.ctaUrl || '#contact'}
                      className="preview-btn btn-brand nav-cta-btn"
                      onClick={(e) =>
                        handleLinkAction(e, { url: p.ctaUrl, label: p.ctaText })
                      }
                    >
                      {p.ctaText}
                    </a>
                  )}

                  {/* Mobile View Controls */}
                  {device === 'mobile' && (
                    <div className="mobile-nav-controls">
                      {p.ctaText && (
                        <a
                          href={p.ctaUrl || '#contact'}
                          className="preview-btn btn-brand mobile-nav-compact-cta"
                          onClick={(e) =>
                            handleLinkAction(e, { url: p.ctaUrl, label: p.ctaText })
                          }
                        >
                          {p.ctaText}
                        </a>
                      )}
                      <button
                        type="button"
                        className="mobile-hamburger-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                      >
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                      </button>
                    </div>
                  )}

                  {/* Responsive Hamburger fallback */}
                  {device !== 'mobile' && (
                    <button
                      type="button"
                      className="mobile-hamburger"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      aria-label="Toggle Menu"
                    >
                      {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  )}
                </div>

                {mobileMenuOpen && (
                  <div className="preview-mobile-menu">
                    {(p.links || []).map((link, i) => (
                      <a
                        key={i}
                        href={link.url || '#'}
                        className="mobile-link"
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          handleLinkAction(e, { url: link.url, label: link.label });
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                    {p.ctaText && (
                      <a
                        href={p.ctaUrl || '#contact'}
                        className="preview-btn btn-brand"
                        style={{ marginTop: '12px', textAlign: 'center', width: '100%', justifyContent: 'center' }}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          handleLinkAction(e, { url: p.ctaUrl, label: p.ctaText });
                        }}
                      >
                        {p.ctaText}
                      </a>
                    )}
                  </div>
                )}
              </header>
            )}

            {/* 3. Hero */}
            {section.type === 'hero' && (
              <section className={`preview-hero-section ${p.alignment || 'center'} ${p.imageUrl ? 'has-hero-image' : ''}`}>
                <div className="preview-hero-ambient-glow" />
                <div className="preview-container hero-inner">
                  <div className={`hero-split-grid ${p.imageUrl ? 'with-visual' : 'solo'}`}>
                    <div className="hero-text-content">
                      {p.badge && (
                        <div className="preview-pill-badge">
                          <span className="dot-pulse" />
                          <span>{p.badge}</span>
                        </div>
                      )}

                      <h1 className="preview-hero-heading">{p.heading}</h1>
                      <p className="preview-hero-sub">{p.subheading}</p>

                      <div className="preview-hero-actions">
                        {p.primaryBtnText && (
                          <a
                            href={p.primaryBtnUrl || '#'}
                            className="preview-btn btn-brand"
                            onClick={(e) =>
                              handleLinkAction(e, {
                                url: p.primaryBtnUrl,
                                label: p.primaryBtnText,
                              })
                            }
                          >
                            {p.primaryBtnText} &rarr;
                          </a>
                        )}
                        {p.secondaryBtnText && (
                          <a
                            href={p.secondaryBtnUrl || '#'}
                            className="preview-btn btn-glass"
                            onClick={(e) =>
                              handleLinkAction(e, {
                                url: p.secondaryBtnUrl,
                                label: p.secondaryBtnText,
                              })
                            }
                          >
                            {p.secondaryBtnText}
                          </a>
                        )}
                      </div>

                      <div className="hero-trust-bar">
                        <div className="hero-trust-stars">
                          <div className="stars-cluster">
                            {[...Array(5)].map((_, sIdx) => (
                              <Star key={sIdx} size={13} fill="#f59e0b" color="#f59e0b" />
                            ))}
                          </div>
                          <span className="trust-score font-mono">{p.trustScore || '4.9 / 5.0'}</span>
                        </div>
                        <div className="hero-trust-divider" />
                        <div className="hero-trust-badge">
                          <ShieldCheck size={14} className="text-emerald" />
                          <span>{p.trustBadge || (brand.category === 'saas' ? 'Enterprise Verified • 99.9% Uptime' : brand.category === 'restaurant' ? 'Artisan Sourced & Patron Approved' : brand.category === 'salon' ? 'Certified Master Stylists' : 'Verified Quality Standard')}</span>
                        </div>
                      </div>

                      {/* Hero Metrics Strip */}
                      {Array.isArray(p.stats) && p.stats.length > 0 && (
                        <div className="hero-metrics-strip">
                          {p.stats.map((st, sIdx) => (
                            <div key={sIdx} className="hero-metric-item">
                              <span className="hero-metric-val font-mono">{st.value || st.number}</span>
                              <span className="hero-metric-lbl">{st.label || st.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {p.imageUrl && (
                      <div className="hero-visual-col">
                        <div className="hero-image-card">
                          <img
                            src={p.imageUrl}
                            alt={p.heading || 'Hero'}
                            className="hero-main-img"
                            loading="eager"
                          />
                          <div className="hero-img-overlay" />
                          <div className="hero-floating-chip">
                            <span className="chip-indicator" />
                            <span className="chip-text font-mono">
                              {p.chipText || (brand.category === 'saas' ? '✦ LIVE CLOUD PLATFORM' : brand.category === 'restaurant' ? '✦ CHEF RESERVE' : brand.category === 'salon' ? '✦ SIGNATURE RITUAL' : '✦ PREMIER SELECTION')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Standalone Stats & Metrics Section */}
            {section.type === 'stats' && (
              <section className="preview-section stats-area" id={section.id || 'stats'}>
                <div className="preview-container">
                  {p.heading && (
                    <div className="preview-section-header" style={{ marginBottom: '36px' }}>
                      {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                      <h2 className="preview-section-title">{p.heading}</h2>
                      {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}
                    </div>
                  )}
                  <div className="stats-metric-grid">
                    {(p.items || p.stats || []).map((st, i) => (
                      <div key={i} className="preview-glass-card stat-metric-box">
                        <div className="stat-metric-number font-mono">{st.value || st.number || st.stat}</div>
                        <div className="stat-metric-label">{st.label || st.title || st.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 4. About */}
            {section.type === 'about' && (
              <section className="preview-section about-area">
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                  </div>

                  <div className="preview-about-grid">
                    <div className="preview-glass-card about-card-main">
                      <p className="lead-paragraph">{p.paragraph1}</p>
                      <p className="secondary-paragraph">{p.paragraph2}</p>
                    </div>

                    {p.highlights?.length > 0 && (
                      <div className="preview-highlights-list">
                        {p.highlights.map((h, i) => (
                          <div key={i} className="preview-glass-card highlight-box">
                            <div className="highlight-title-row">
                              <span className="dot-check font-mono">0{i + 1}</span>
                              <h3 className="highlight-title">{h.title}</h3>
                            </div>
                            <p className="highlight-desc">{h.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* 5. Services */}
            {section.type === 'services' && (
              <section className="preview-section services-area">
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                    {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}
                  </div>

                  <div className="preview-cards-grid">
                    {(p.items || []).map((s, idx) => (
                      <div key={idx} className="preview-glass-card service-box">
                        <span className="service-idx font-mono">0{idx + 1} // CAPABILITY</span>
                        <h3 className="service-name">{s.title}</h3>
                        <p className="service-text">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 6. Products / Menu */}
            {section.type === 'products' && (() => {
              const allItems = p.items || [];
              const rawTags = allItems.map((it) => it.tag).filter(Boolean);
              const uniqueTags = ['ALL', ...Array.from(new Set(rawTags))];
              const showFilter = uniqueTags.length > 2;
              const displayedItems = activeCategoryFilter === 'ALL'
                ? allItems
                : allItems.filter((it) => it.tag?.toUpperCase() === activeCategoryFilter.toUpperCase());

              return (
                <section className="preview-section products-area">
                  <div className="preview-container">
                    <div className="preview-section-header">
                      {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                      <h2 className="preview-section-title">{p.heading}</h2>
                      {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}

                      {showFilter && (
                        <div
                          className="preview-category-filters"
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginTop: '16px',
                          }}
                        >
                          {uniqueTags.map((tag) => {
                            const isCurrent = activeCategoryFilter.toUpperCase() === tag.toUpperCase();
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => setActiveCategoryFilter(tag)}
                                style={{
                                  padding: '5px 14px',
                                  borderRadius: '20px',
                                  fontSize: '11px',
                                  fontFamily: 'monospace',
                                  letterSpacing: '0.04em',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: '1px solid',
                                  borderColor: isCurrent ? 'var(--site-primary)' : 'rgba(255, 255, 255, 0.12)',
                                  background: isCurrent ? 'var(--site-primary)' : 'rgba(255, 255, 255, 0.04)',
                                  color: isCurrent ? '#000' : 'var(--site-text)',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="preview-cards-grid products-grid">
                      {displayedItems.map((item, i) => (
                        <div key={i} className="preview-glass-card product-box group">
                          {item.imageUrl && (
                            <div className="product-image-container">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="product-img"
                                loading="lazy"
                              />
                              {item.tag && (
                                <span className="product-image-tag font-mono">{item.tag}</span>
                              )}
                            </div>
                          )}
                          <div className="product-box-body">
                            <div className="product-head">
                              <h3 className="product-title">{item.name}</h3>
                              <span className="product-cost font-mono">{item.price}</span>
                            </div>
                            {!item.imageUrl && item.tag && (
                              <span className="product-pill font-mono">{item.tag}</span>
                            )}
                            <p className="product-caption">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* 7. Features */}
            {section.type === 'features' && (
              <section className="preview-section features-area" id={section.id || 'features'}>
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                    {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}
                  </div>

                  <div className="preview-cards-grid features-grid">
                    {(p.items || []).map((f, i) => (
                      <div key={i} className="preview-glass-card feature-box">
                        <div className="feature-header-row">
                          <div className="feature-check-icon">
                            <CheckCircle size={18} />
                          </div>
                          <span className="feature-idx font-mono">{f.tag || `0${i + 1} // CAPABILITY`}</span>
                        </div>
                        <h3 className="feature-head">{f.title}</h3>
                        <p className="feature-caption">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 8. Testimonials */}
            {section.type === 'testimonials' && (
              <section className="preview-section testimonials-area" id={section.id || 'testimonials'}>
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                    {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}
                  </div>

                  <div className="preview-cards-grid testimonials-grid">
                    {(p.items || []).map((t, i) => {
                      const initials = (t.author || 'P')
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <div key={i} className="preview-glass-card testimonial-box">
                          <div className="testimonial-rating-row">
                            <div className="stars-cluster">
                              {[...Array(5)].map((_, sIdx) => (
                                <Star key={sIdx} size={13} fill="#f59e0b" color="#f59e0b" />
                              ))}
                            </div>
                            <span className="testimonial-verified font-mono">
                              <ShieldCheck size={12} /> VERIFIED
                            </span>
                          </div>
                          <p className="testimonial-body">&ldquo;{t.quote}&rdquo;</p>
                          <div className="testimonial-footer">
                            <div className="testimonial-avatar font-mono">{initials}</div>
                            <div className="testimonial-author-meta">
                              <strong className="testimonial-author">{t.author}</strong>
                              {t.role && (
                                <span className="testimonial-role font-mono">{t.role}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* 9. Pricing */}
            {section.type === 'pricing' && (
              <section className="preview-section pricing-area" id={section.id || 'pricing'}>
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                    {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}
                    
                    {/* Interactive Monthly / Annual Billing Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0 12px 0' }}>
                      <div style={{
                        display: 'inline-flex',
                        padding: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '100px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('monthly')}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '100px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            background: billingCycle === 'monthly' ? 'var(--site-primary, #6366f1)' : 'transparent',
                            color: billingCycle === 'monthly' ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                          }}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('annual')}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '100px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            background: billingCycle === 'annual' ? 'var(--site-primary, #6366f1)' : 'transparent',
                            color: billingCycle === 'annual' ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          Annual <span style={{ fontSize: '10px', background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>Save 20%</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="preview-cards-grid pricing-grid">
                    {(p.plans || []).map((plan, i) => {
                      const isPopular = plan.popular || i === 1;
                      
                      // Calculate interactive discounted price if annual
                      let displayPrice = plan.price;
                      let displayPeriod = plan.period || '/mo';
                      if (billingCycle === 'annual' && plan.price) {
                        const match = plan.price.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
                        if (match) {
                          const prefix = match[1];
                          const num = parseFloat(match[2].replace(/,/g, ''));
                          const suffix = match[3];
                          if (!isNaN(num) && num > 0) {
                            displayPrice = `${prefix}${Math.round(num * 0.8).toLocaleString()}${suffix}`;
                            displayPeriod = '/mo (billed annually)';
                          }
                        }
                      }

                      return (
                        <div
                          key={i}
                          className={`preview-glass-card plan-box ${isPopular ? 'plan-box-popular' : ''}`}
                        >
                          {isPopular && (
                            <div className="plan-popular-pill font-mono">
                              ✦ MOST POPULAR
                            </div>
                          )}
                          <h3 className="plan-name">{plan.name}</h3>
                          <div className="plan-amount-row">
                            <span className="plan-number">{displayPrice}</span>
                            {displayPeriod && <span className="plan-interval">{displayPeriod}</span>}
                          </div>
                          <p className="plan-description">{plan.desc}</p>
                          <ul className="plan-bullets">
                            {(plan.features || []).map((feat, idx) => (
                              <li key={idx}>
                                <CheckCircle size={14} className="check-bullet" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                          <a
                            href="#contact"
                            className={`preview-btn ${isPopular ? 'btn-brand' : 'btn-glass'} plan-submit-btn`}
                            onClick={(e) =>
                              handleLinkAction(e, {
                                url: '#contact',
                                label: `Select ${plan.name} Plan`,
                              })
                            }
                          >
                            Select Plan
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* 10. FAQ */}
            {section.type === 'faq' && (
              <section className="preview-section faq-area">
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                  </div>

                  <div className="preview-faq-stack">
                    {(p.items || []).map((item, i) => (
                      <details
                        key={i}
                        className="preview-glass-card faq-card-details"
                        open={i === 0}
                      >
                        <summary className="faq-query">{item.q}</summary>
                        <div className="faq-reply">
                          <p>{item.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 11. Contact */}
            {section.type === 'contact' && (
              <section className="preview-section contact-area">
                <div className="preview-container">
                  <div className="preview-section-header">
                    {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                    <h2 className="preview-section-title">{p.heading}</h2>
                    {p.subheading && <p className="preview-section-desc">{p.subheading}</p>}
                  </div>

                  <div className="preview-contact-layout">
                    {/* Left Channels */}
                    <div className="preview-glass-card contact-card-left">
                      <h3 className="channel-title">Direct Communication</h3>
                      <p className="channel-desc">
                        Reach out directly via our official channels or submit the inquiry form.
                      </p>

                      <div className="channel-items-list">
                        {brand.contact?.email && (
                          <div className="channel-row">
                            <span className="channel-lbl font-mono">EMAIL</span>
                            <a
                              href={`mailto:${brand.contact.email}`}
                              className="channel-val font-mono"
                              onClick={(e) =>
                                handleLinkAction(e, {
                                  url: `mailto:${brand.contact.email}`,
                                  label: 'Email',
                                  actionType: 'mailto',
                                })
                              }
                            >
                              {brand.contact.email}
                            </a>
                          </div>
                        )}
                        {brand.contact?.phone && (
                          <div className="channel-row">
                            <span className="channel-lbl font-mono">PHONE</span>
                            <a
                              href={`tel:${brand.contact.phone}`}
                              className="channel-val font-mono"
                              onClick={(e) =>
                                handleLinkAction(e, {
                                  url: `tel:${brand.contact.phone}`,
                                  label: 'Phone',
                                  actionType: 'tel',
                                })
                              }
                            >
                              {brand.contact.phone}
                            </a>
                          </div>
                        )}
                        {brand.contact?.whatsapp && (
                          <div className="channel-row">
                            <span className="channel-lbl font-mono">WHATSAPP</span>
                            <a
                              href={`https://wa.me/${brand.contact.whatsapp.replace(
                                /[^0-9]/g,
                                ''
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="whatsapp-active-link"
                              onClick={(e) =>
                                handleLinkAction(e, {
                                  label: 'WhatsApp Order',
                                  actionType: 'whatsapp',
                                })
                              }
                            >
                              <MessageCircle size={15} />
                              <span>Chat on WhatsApp</span>
                            </a>
                          </div>
                        )}
                        {brand.contact?.address && (
                          <div className="channel-row">
                            <span className="channel-lbl font-mono">LOCATION</span>
                            <span className="channel-val">{brand.contact.address}</span>
                          </div>
                        )}
                        {brand.contact?.openingHours && (
                          <div className="channel-row">
                            <span className="channel-lbl font-mono">HOURS</span>
                            <span className="channel-val">{brand.contact.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Form */}
                    <div className="preview-glass-card contact-card-right">
                      {formSuccess ? (
                        <div className="preview-form-success">
                          <CheckCircle size={36} className="success-check-icon" />
                          <h4 className="success-headline">Inquiry Dispatched</h4>
                          <p className="success-text">
                            Thank you! Your message has been safely logged in the Studio inquiry
                            inbox for {brand.businessName}.
                          </p>
                          <button
                            type="button"
                            onClick={() => setFormSuccess(false)}
                            className="preview-btn btn-glass"
                            style={{ marginTop: '14px' }}
                          >
                            Submit Another Test Message
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="preview-contact-form">
                          <div className="preview-field">
                            <label className="field-label font-mono">NAME *</label>
                            <input
                              type="text"
                              required
                              placeholder="Your full name"
                              value={contactForm.name}
                              onChange={(e) =>
                                setContactForm({ ...contactForm, name: e.target.value })
                              }
                              className="field-input"
                            />
                          </div>

                          <div className="preview-field">
                            <label className="field-label font-mono">EMAIL ADDRESS *</label>
                            <input
                              type="email"
                              required
                              placeholder="you@domain.com"
                              value={contactForm.email}
                              onChange={(e) =>
                                setContactForm({ ...contactForm, email: e.target.value })
                              }
                              className="field-input"
                            />
                          </div>

                          <div className="preview-field">
                            <label className="field-label font-mono">MESSAGE *</label>
                            <textarea
                              required
                              rows="3"
                              placeholder="How can we assist you?"
                              value={contactForm.message}
                              onChange={(e) =>
                                setContactForm({ ...contactForm, message: e.target.value })
                              }
                              className="field-textarea"
                            />
                          </div>

                          <button
                            type="submit"
                            className="preview-btn btn-brand submit-contact-btn"
                          >
                            <span>Send Message</span>
                            <Send size={15} />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 11. CTA Banner Section */}
            {(section.type === 'cta' || section.type === 'cta_banner') && (
              <section className="preview-section cta-banner-area" id={section.id || 'cta'}>
                <div className="preview-container">
                  <div className="preview-glass-card cta-banner-card">
                    <div className="cta-banner-content">
                      {p.badge && <span className="preview-subtag font-mono">{p.badge}</span>}
                      <h2 className="cta-banner-heading">{p.heading || 'Ready to Elevate Your Experience?'}</h2>
                      {p.subheading && <p className="cta-banner-subheading">{p.subheading}</p>}
                      <div className="cta-banner-actions">
                        {p.primaryBtnText && (
                          <a
                            href={p.primaryBtnUrl || '#contact'}
                            className="preview-btn btn-brand"
                            onClick={(e) => handleLinkAction(e, { url: p.primaryBtnUrl, label: p.primaryBtnText })}
                          >
                            {p.primaryBtnText} &rarr;
                          </a>
                        )}
                        {p.secondaryBtnText && (
                          <a
                            href={p.secondaryBtnUrl || '#'}
                            className="preview-btn btn-glass"
                            onClick={(e) => handleLinkAction(e, { url: p.secondaryBtnUrl, label: p.secondaryBtnText })}
                          >
                            {p.secondaryBtnText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 12. Footer */}
            {section.type === 'footer' && (
              <footer className="preview-site-footer">
                <div className="preview-container footer-top-row">
                  <div className="footer-identity">
                    <h3 className="footer-title">{p.businessName || brand.businessName}</h3>
                    <p className="footer-slogan">{p.tagline || brand.tagline}</p>
                  </div>
                  <div className="footer-links-wrap">
                    {(p.links || []).map((link, i) => (
                      <a
                        key={i}
                        href={link.url || '#'}
                        className="footer-link-anchor"
                        onClick={(e) =>
                          handleLinkAction(e, { url: link.url, label: link.label })
                        }
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="preview-container footer-bottom-row">
                  <span className="copyright-line">
                    {p.copyright ||
                      `© ${new Date().getFullYear()} ${brand.businessName}. All rights reserved.`}
                  </span>
                  <span className="presented-line font-mono">
                    {p.builtBy || 'Built with Klyvora Studio by Xeorvia'}
                  </span>
                </div>
              </footer>
            )}
          </div>
        );
      })}

      {/* Page Not Created Yet (404) Custom Screen */}
      {isNotFound && (
        <section
          className="preview-section"
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
          }}
        >
          <div className="preview-container" style={{ textAlign: 'center', width: '100%' }}>
            <div
              className="preview-glass-card"
              style={{
                maxWidth: '620px',
                margin: '0 auto',
                padding: '50px 32px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(12, 14, 21, 0.75)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div
                className="font-mono"
                style={{
                  color: 'var(--site-primary, #06b6d4)',
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}
              >
                PAGE STATUS · 404
              </div>
              <h2
                style={{
                  fontFamily: 'var(--site-font-heading, Syne)',
                  fontSize: '30px',
                  marginBottom: '14px',
                  color: 'var(--site-text, #f8fafc)',
                  fontWeight: 700,
                }}
              >
                Page Not Created Yet
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  marginBottom: '30px',
                  fontSize: '15px',
                }}
              >
                The page <code style={{ color: '#38bdf8' }}>/{activePageSlug}</code> has not been
                created or published for {brand.businessName || 'this website'} yet.
              </p>
              <button
                type="button"
                onClick={() => navigateToPage('home')}
                className="preview-btn btn-brand"
                style={{
                  cursor: 'pointer',
                  padding: '12px 28px',
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                &larr; Return to Home Page
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State / Add Section Prompt at bottom of canvas */}
      {!isInteractiveMode && !isNotFound && (
        <div className="canvas-add-section-zone">
          <button
            type="button"
            onClick={onAddSectionClick}
            className="canvas-add-section-btn font-mono"
          >
            <Plus size={16} />
            <span>ADD NEW SECTION FROM LIBRARY</span>
          </button>
        </div>
      )}
    </div>
  );
}
