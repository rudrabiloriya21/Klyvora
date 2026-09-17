import JSZip from 'jszip';

/**
 * Generates standalone production HTML, CSS, and JS for any Klyvora Studio project.
 */
export function generateProjectHtml(project) {
  const brand = project.brand || {};
  const seo = project.seo || {};
  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
  const sections = (homePage?.sections || []).filter((s) => !s.hidden);

  const sectionsHtml = sections
    .map((section) => {
      const p = section.props || {};
      switch (section.type) {
        case 'announcement':
          return `
    <div class="announcement-bar">
      <div class="container announcement-content">
        <span class="announcement-badge">${escapeHtml(p.badge || 'UPDATE')}</span>
        <span>${escapeHtml(p.text || '')}</span>
        ${p.linkText ? `<a href="${escapeHtml(p.linkUrl || '#')}" class="announcement-link">${escapeHtml(p.linkText)} &rarr;</a>` : ''}
      </div>
    </div>`;

        case 'navigation':
          return `
    <header class="site-header ${p.sticky ? 'sticky-header' : ''}">
      <div class="container nav-container">
        <a href="#home" class="brand-logo">
          <span class="logo-mark">✦</span>
          <span class="logo-text">${escapeHtml(p.logoText || brand.businessName || 'Brand')}</span>
        </a>
        <nav class="desktop-nav" aria-label="Main Navigation">
          ${(p.links || [])
            .map((link) => `<a href="${escapeHtml(link.url || '#')}" class="nav-link">${escapeHtml(link.label)}</a>`)
            .join('\n          ')}
        </nav>
        ${p.ctaText ? `<a href="${escapeHtml(p.ctaUrl || '#contact')}" class="btn btn-primary nav-cta">${escapeHtml(p.ctaText)}</a>` : ''}
        <button class="mobile-toggle" aria-label="Toggle Navigation Menu">&#9776;</button>
      </div>
      <div class="mobile-menu" aria-hidden="true">
        ${(p.links || [])
          .map((link) => `<a href="${escapeHtml(link.url || '#')}" class="mobile-nav-link">${escapeHtml(link.label)}</a>`)
          .join('\n        ')}
        ${p.ctaText ? `<a href="${escapeHtml(p.ctaUrl || '#contact')}" class="btn btn-primary" style="margin-top:16px;">${escapeHtml(p.ctaText)}</a>` : ''}
      </div>
    </header>`;

        case 'hero':
          return `
    <section id="home" class="section hero-section ${p.alignment || 'center'}">
      <div class="container hero-container">
        ${p.badge ? `<div class="pill-badge"><span class="dot"></span><span>${escapeHtml(p.badge)}</span></div>` : ''}
        <h1 class="hero-title">${escapeHtml(p.heading || 'Welcome')}</h1>
        <p class="hero-subheading">${escapeHtml(p.subheading || '')}</p>
        <div class="hero-actions">
          ${p.primaryBtnText ? `<a href="${escapeHtml(p.primaryBtnUrl || '#')}" class="btn btn-primary">${escapeHtml(p.primaryBtnText)} &rarr;</a>` : ''}
          ${p.secondaryBtnText ? `<a href="${escapeHtml(p.secondaryBtnUrl || '#')}" class="btn btn-secondary">${escapeHtml(p.secondaryBtnText)}</a>` : ''}
        </div>
      </div>
    </section>`;

        case 'about':
          return `
    <section id="about" class="section about-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Our Story')}</h2>
        </div>
        <div class="about-grid">
          <div class="about-card glass-panel">
            <p class="lead-p">${escapeHtml(p.paragraph1 || '')}</p>
            <p>${escapeHtml(p.paragraph2 || '')}</p>
          </div>
          ${p.highlights?.length ? `
          <div class="highlights-list">
            ${p.highlights
              .map(
                (h) => `
            <div class="highlight-card glass-panel">
              <h4 class="highlight-title">${escapeHtml(h.title)}</h4>
              <p class="highlight-desc">${escapeHtml(h.desc)}</p>
            </div>`
              )
              .join('\n            ')}
          </div>` : ''}
        </div>
      </div>
    </section>`;

        case 'products':
          return `
    <section id="products" class="section products-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Menu & Offerings')}</h2>
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ''}
        </div>
        <div class="products-grid">
          ${(p.items || [])
            .map(
              (item) => `
          <div class="product-card glass-panel">
            <div class="product-top">
              <h3 class="product-name">${escapeHtml(item.name)}</h3>
              <span class="product-price">${escapeHtml(item.price)}</span>
            </div>
            ${item.tag ? `<span class="product-tag">${escapeHtml(item.tag)}</span>` : ''}
            <p class="product-desc">${escapeHtml(item.desc)}</p>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;

        case 'services':
          return `
    <section id="services" class="section services-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Our Services')}</h2>
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ''}
        </div>
        <div class="services-grid">
          ${(p.items || [])
            .map(
              (s, idx) => `
          <div class="service-card glass-panel">
            <span class="service-num">0${idx + 1}</span>
            <h3 class="service-title">${escapeHtml(s.title)}</h3>
            <p class="service-desc">${escapeHtml(s.desc)}</p>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;

        case 'features':
          return `
    <section id="features" class="section features-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Key Features')}</h2>
        </div>
        <div class="features-grid">
          ${(p.items || [])
            .map(
              (item) => `
          <div class="feature-card glass-panel">
            <h3 class="feature-title">${escapeHtml(item.title)}</h3>
            <p class="feature-desc">${escapeHtml(item.desc)}</p>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;

        case 'testimonials':
          return `
    <section id="testimonials" class="section testimonials-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Client Reviews')}</h2>
        </div>
        <div class="testimonials-grid">
          ${(p.items || [])
            .map(
              (item) => `
          <div class="testimonial-card glass-panel">
            <p class="testimonial-quote">&ldquo;${escapeHtml(item.quote)}&rdquo;</p>
            <div class="testimonial-author">
              <strong>${escapeHtml(item.author)}</strong>
              ${item.role ? `<span>${escapeHtml(item.role)}</span>` : ''}
            </div>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;

        case 'pricing':
          return `
    <section id="pricing" class="section pricing-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Pricing Plans')}</h2>
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ''}
        </div>
        <div class="pricing-grid">
          ${(p.plans || [])
            .map(
              (plan) => `
          <div class="pricing-card glass-panel">
            <h3 class="plan-name">${escapeHtml(plan.name)}</h3>
            <div class="plan-price-wrap">
              <span class="plan-price">${escapeHtml(plan.price)}</span>
              ${plan.period ? `<span class="plan-period">${escapeHtml(plan.period)}</span>` : ''}
            </div>
            <p class="plan-desc">${escapeHtml(plan.desc || '')}</p>
            <ul class="plan-features">
              ${(plan.features || []).map((f) => `<li>&#10003; ${escapeHtml(f)}</li>`).join('\n              ')}
            </ul>
            <a href="#contact" class="btn btn-primary plan-cta">Select Plan</a>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;

        case 'faq':
          return `
    <section id="faq" class="section faq-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'FAQ')}</h2>
        </div>
        <div class="faq-list">
          ${(p.items || [])
            .map(
              (item, i) => `
          <details class="faq-item glass-panel" ${i === 0 ? 'open' : ''}>
            <summary class="faq-question">${escapeHtml(item.q)}</summary>
            <div class="faq-answer"><p>${escapeHtml(item.a)}</p></div>
          </details>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>`;

        case 'contact':
          return `
    <section id="contact" class="section contact-section">
      <div class="container">
        <div class="section-header">
          ${p.badge ? `<span class="section-badge">${escapeHtml(p.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(p.heading || 'Get in Touch')}</h2>
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ''}
        </div>
        <div class="contact-grid">
          <div class="contact-info glass-panel">
            <h3>Direct Channels</h3>
            ${brand.contact?.email ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(brand.contact.email)}">${escapeHtml(brand.contact.email)}</a></p>` : ''}
            ${brand.contact?.phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(brand.contact.phone)}">${escapeHtml(brand.contact.phone)}</a></p>` : ''}
            ${brand.contact?.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${escapeHtml(brand.contact.whatsapp.replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener" class="whatsapp-badge">Message on WhatsApp &rarr;</a></p>` : ''}
            ${brand.contact?.address ? `<p><strong>Address:</strong> ${escapeHtml(brand.contact.address)}</p>` : ''}
            ${brand.contact?.openingHours ? `<p><strong>Hours:</strong> ${escapeHtml(brand.contact.openingHours)}</p>` : ''}
          </div>
          <form class="contact-form glass-panel" id="main-contact-form">
            <div class="form-group">
              <label for="name">Your Name *</label>
              <input type="text" id="name" name="name" required placeholder="Enter your full name" />
            </div>
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" required placeholder="name@domain.com" />
            </div>
            <div class="form-group">
              <label for="message">Message *</label>
              <textarea id="message" name="message" rows="4" required placeholder="How can we assist you?"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
            <div class="form-feedback" id="form-feedback"></div>
          </form>
        </div>
      </div>
    </section>`;

        case 'footer':
          return `
    <footer class="site-footer">
      <div class="container footer-container">
        <div class="footer-brand">
          <h3 class="footer-logo">${escapeHtml(p.businessName || brand.businessName || 'Brand')}</h3>
          <p class="footer-tagline">${escapeHtml(p.tagline || brand.tagline || '')}</p>
        </div>
        <div class="footer-nav">
          ${(p.links || [])
            .map((link) => `<a href="${escapeHtml(link.url || '#')}" class="footer-link">${escapeHtml(link.label)}</a>`)
            .join('\n          ')}
        </div>
      </div>
      <div class="container footer-bottom">
        <p>${escapeHtml(p.copyright || `© ${new Date().getFullYear()} ${brand.businessName}. All rights reserved.`)}</p>
        <p class="built-by">${escapeHtml(p.builtBy || 'Built with Klyvora Studio by Xeorvia')}</p>
      </div>
    </footer>`;

        default:
          return `<!-- Section type: ${escapeHtml(section.type)} -->`;
      }
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(seo.title || brand.businessName || 'Website')}</title>
    <meta name="description" content="${escapeHtml(seo.description || brand.description || '')}" />
    <meta name="keywords" content="${escapeHtml(seo.keywords || '')}" />
    <link rel="icon" type="image/svg+xml" href="${escapeHtml(seo.favicon || '/favicon.svg')}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(seo.ogTitle || seo.title || '')}" />
    <meta property="og:description" content="${escapeHtml(seo.ogDescription || seo.description || '')}" />
    <meta property="og:type" content="website" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    ${sectionsHtml}
    <script src="app.js"></script>
  </body>
</html>`;
}

export function generateProjectCss(project) {
  const theme = project.theme || {};
  return `/* ==============================================================================
   Generated by Klyvora Studio — Presented by Xeorvia
   ============================================================================== */

:root {
  --primary: ${theme.primaryColor || '#8b5cf6'};
  --secondary: ${theme.secondaryColor || '#06b6d4'};
  --accent: ${theme.accentColor || '#ec4899'};
  --bg: ${theme.bgColor || '#07080c'};
  --surface: ${theme.surfaceColor || '#0c0e15'};
  --text: ${theme.textColor || '#f8fafc'};
  --text-muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.2);
  --font-heading: '${theme.fontHeading || 'Syne'}', sans-serif;
  --font-body: '${theme.fontBody || 'Plus Jakarta Sans'}', sans-serif;
  --radius: ${theme.borderRadius || '14px'};
  --container-max: ${theme.containerWidth || '1200px'};
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  color-scheme: dark;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.65;
  font-size: 16px;
  overflow-x: hidden;
}

.container {
  width: 100%;
  max-width: var(--container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Glass Panel Component */
.glass-panel {
  background: rgba(18, 22, 33, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.glass-panel:hover {
  border-color: var(--border-active);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border);
  color: var(--text);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Badges & Section Headers */
.pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  font-size: 12px;
  font-family: monospace;
  margin-bottom: 20px;
}

.pill-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--secondary);
}

.section {
  padding: 90px 0;
}

.section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 48px auto;
}

.section-badge {
  font-family: monospace;
  font-size: 12px;
  letter-spacing: 0.15em;
  color: var(--secondary);
  text-transform: uppercase;
  margin-bottom: 12px;
  display: inline-block;
}

.section-title {
  font-size: clamp(2rem, 3.8vw, 3rem);
  margin-bottom: 12px;
}

.section-sub {
  color: var(--text-muted);
  font-size: 16px;
}

/* Header & Nav */
.site-header {
  position: relative;
  z-index: 50;
  height: 72px;
  border-bottom: 1px solid var(--border);
}

.sticky-header {
  position: sticky;
  top: 0;
  background: rgba(7, 8, 12, 0.85);
  backdrop-filter: blur(16px);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
}

.logo-mark {
  color: var(--secondary);
}

.desktop-nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  font-size: 14.5px;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 20px 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

@media (max-width: 768px) {
  .desktop-nav, .nav-cta { display: none; }
  .mobile-toggle { display: block; }
  .mobile-menu.open { display: flex; }
  .mobile-nav-link { padding: 12px 0; border-bottom: 1px solid var(--border); }
}

/* Hero */
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  text-align: center;
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 860px;
}

.hero-title {
  font-size: clamp(2.4rem, 5.5vw, 4.4rem);
  margin-bottom: 20px;
  line-height: 1.1;
}

.hero-subheading {
  font-size: clamp(1.1rem, 1.6vw, 1.3rem);
  color: var(--text-muted);
  margin-bottom: 36px;
  max-width: 680px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Grids (Products, Services, Features) */
.products-grid, .services-grid, .features-grid, .testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.product-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.product-price {
  font-weight: 700;
  color: var(--secondary);
}

.product-tag {
  display: inline-block;
  font-size: 11px;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.product-desc, .service-desc, .feature-desc {
  color: var(--text-muted);
  font-size: 14.5px;
}

.service-num {
  font-family: monospace;
  font-size: 12px;
  color: var(--secondary);
  display: block;
  margin-bottom: 8px;
}

/* Pricing */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.plan-price-wrap {
  margin: 16px 0 8px 0;
}

.plan-price {
  font-size: 2.8rem;
  font-weight: 800;
  font-family: var(--font-heading);
}

.plan-period {
  color: var(--text-muted);
  font-size: 14px;
}

.plan-features {
  list-style: none;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
}

.plan-cta {
  width: 100%;
  justify-content: center;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 780px;
  margin: 0 auto;
}

.faq-question {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

.faq-answer {
  margin-top: 14px;
  color: var(--text-muted);
  font-size: 15px;
}

/* Contact Form */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 800px) {
  .contact-grid {
    grid-template-columns: 1fr 1.3fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 12.5px;
  font-family: monospace;
  color: var(--text-muted);
}

.form-group input, .form-group textarea {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-family: var(--font-body);
  outline: none;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--primary);
}

.whatsapp-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #25d366;
  font-weight: 600;
}

.form-feedback {
  margin-top: 14px;
  font-size: 14px;
  display: none;
}

.form-feedback.success {
  display: block;
  color: #10b981;
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 60px 0 30px 0;
  background: rgba(5, 6, 9, 0.9);
}

.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 40px;
}

.footer-nav {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 12px;
}
`;
}

export function generateProjectJs() {
  return `/**
 * Standalone Client Script for Klyvora Exported Website
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Menu
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Smooth Link Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (menu && menu.classList.contains('open')) {
            menu.classList.remove('open');
          }
        }
      }
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('main-contact-form');
  const feedback = document.getElementById('form-feedback');
  if (contactForm && feedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.className = 'form-feedback success';
      feedback.textContent = '✓ Message received! We will respond shortly.';
      contactForm.reset();
    });
  }
});
`;
}

export async function createProjectZipBundle(project) {
  const zip = new JSZip();
  const html = generateProjectHtml(project);
  const css = generateProjectCss(project);
  const js = generateProjectJs();
  const json = JSON.stringify(project, null, 2);

  zip.file('index.html', html);
  zip.file('styles.css', css);
  zip.file('app.js', js);
  zip.file('klyvora-project.json', json);
  zip.file(
    'README.md',
    `# ${project.metadata?.name || 'Klyvora Project'}

Generated with **Klyvora Studio**, developed by **Xeorvia**.

## Contents
- \`index.html\`: Standalone production website HTML
- \`styles.css\`: Customized responsive styles & CSS tokens
- \`app.js\`: Navigation, accordions, and form interactions
- \`klyvora-project.json\`: Full project schema for re-importing into Klyvora Studio

## How to Deploy
1. Open \`index.html\` directly in any browser.
2. Or drag-and-drop this unzipped folder into Netlify Drop, Vercel, or GitHub Pages.
`
  );

  return zip.generateAsync({ type: 'blob' });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
