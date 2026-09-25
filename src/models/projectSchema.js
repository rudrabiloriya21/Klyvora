/**
 * Klyvora Studio — Project Schema & Factory Definitions
 * Standardized data model powering AI generation, live preview, and code export.
 */

export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
}

export function createDefaultTheme(overrides = {}) {
  return {
    primaryColor: '#8b5cf6',      // Nebula Violet
    secondaryColor: '#06b6d4',    // Bioluminescent Cyan
    accentColor: '#ec4899',       // Electric Rose
    bgColor: '#07080c',           // Deep Obsidian
    textColor: '#f8fafc',         // Crisp Platinum
    surfaceColor: '#0c0e15',      // Elevated Glass Surface
    fontHeading: 'Plus Jakarta Sans',  // Options: 'Plus Jakarta Sans', 'Outfit', 'Inter', 'Space Grotesk', 'Syne'
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '14px',         // Options: '4px', '8px', '14px', '22px', '9999px'
    shadowDepth: 'medium',        // Options: 'none', 'subtle', 'medium', 'deep'
    glassmorphism: true,
    containerWidth: '1200px',
    ...overrides,
  };
}

export function createDefaultSEO(businessName = 'My Business', description = '') {
  return {
    title: `${businessName} — Official Website`,
    description: description || `Welcome to ${businessName}. Discover our services, products, and story.`,
    keywords: 'business, modern website, official, services',
    ogTitle: `${businessName} — Official Website`,
    ogDescription: description || `Experience the best with ${businessName}.`,
    ogImage: '',
    canonicalUrl: '',
    favicon: '/favicon.svg',
    robots: 'index, follow',
  };
}

export function generateSectionId(type, index = 1) {
  return `${type}-${String(index).padStart(3, '0')}`;
}

export function createDefaultBrand(overrides = {}) {
  return {
    businessName: 'Venture Studio',
    tagline: 'Modern High-Impact Digital Solutions & Products',
    category: 'Technology & Services',
    description: 'Empowering ambitious businesses with scalable architecture, human-centric design, and reliable performance.',
    logoUrl: '',
    location: 'Cyber Hub, Gurugram, India',
    contact: {
      email: 'contact@venturestudio.in',
      phone: '+91 00000 00000',
      whatsapp: '+910000000000',
      address: 'Floor 8, Tower B, Cyber Hub, Gurugram, Haryana 122002',
      openingHours: 'Mon–Fri: 9:00 AM – 7:00 PM IST',
    },
    social: {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: 'https://linkedin.com/company/venturestudio',
    },
    ctaText: 'Get Started',
    ctaLink: '#contact',
    ...overrides,
  };
}

/**
 * Standard Section Templates Factory
 */
export function createSection(type, props = {}, overrides = {}) {
  const id = overrides.id || generateSectionId(type, 1);

  const defaultPropsByType = {
    announcement: {
      text: '✨ Discover our newest platform capabilities — faster workflows, elevated reliability, and direct support.',
      badge: 'NEW UPDATE',
      linkText: 'Learn More',
      linkUrl: '#features',
      dismissible: true,
    },
    navigation: {
      logoText: 'Venture Studio',
      showLogoIcon: true,
      links: [
        { label: 'Home', url: '#home' },
        { label: 'Features', url: '#features' },
        { label: 'Capabilities', url: '#products' },
        { label: 'Pricing', url: '#pricing' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact', url: '#contact' },
      ],
      ctaText: 'Get in Touch',
      ctaUrl: '#contact',
      sticky: true,
    },
    hero: {
      badge: '✦ INTENTIONAL DIGITAL ARCHITECTURE',
      heading: 'Engineered for Performance, Designed for Modern Impact.',
      subheading: 'We build resilient systems and intuitive digital products that elevate your brand and accelerate operational velocity.',
      primaryBtnText: 'Explore Platform',
      primaryBtnUrl: '#features',
      secondaryBtnText: 'Schedule Consultation',
      secondaryBtnUrl: '#contact',
      imageUrl: '',
      alignment: 'center', // 'left', 'center', 'split'
    },
    about: {
      badge: 'OUR PHILOSOPHY',
      heading: 'A Dedication to Engineering Excellence and Craftsmanship.',
      paragraph1: 'We believe exceptional software is born from clear principles: uncompromising reliability, elegant simplicity, and deep empathy for the end user.',
      paragraph2: 'Every component, workflow, and interface is engineered with precision to ensure your business moves faster with absolute confidence.',
      highlights: [
        { title: 'Sub-Millisecond Speed', desc: 'Optimized performance across every single user touchpoint.' },
        { title: 'Enterprise-Grade Security', desc: 'Zero-trust architecture with end-to-end data encryption.' },
        { title: 'Seamless Integration', desc: 'Direct compatibility with your existing stack and workflows.' },
      ],
    },
    services: {
      badge: 'CORE CAPABILITIES',
      heading: 'End-to-End Solutions Tailored for Sustainable Growth',
      subheading: 'Modular architecture designed to solve complex operational challenges with ease.',
      items: [
        { title: 'High-Concurrency Architecture', desc: 'Scalable cloud infrastructure designed for 99.99% availability and resilience.', icon: 'Cpu' },
        { title: 'Intuitive Product Interfaces', desc: 'Clean, accessible frontend design systems that simplify complex user interactions.', icon: 'Layout' },
        { title: 'Continuous Integration & Reliability', desc: 'Automated testing and observability pipelines ensuring smooth releases.', icon: 'Shield' },
      ],
    },
    products: {
      badge: 'FEATURED SOLUTIONS',
      heading: 'Modular Platform Capabilities & Tooling',
      subheading: 'Engineered to integrate seamlessly with your operations.',
      items: [
        { name: 'Core Platform Engine', price: '₹4,999/mo', desc: 'Essential automation workflows and unified reporting dashboard.', tag: 'Popular' },
        { name: 'Enterprise Cluster Tier', price: 'Custom', desc: 'Dedicated VPC hosting, private SLAs, and tailored architectural support.', tag: 'Enterprise' },
      ],
    },
    features: {
      badge: 'PLATFORM ADVANTAGES',
      heading: 'Why Industry Leaders Trust Our Framework',
      items: [
        { title: 'Sub-Second Latency', desc: 'Optimized performance across every user touchpoint.' },
        { title: 'Enterprise Security', desc: 'Built-in privacy safeguards and compliance standards.' },
        { title: 'Seamless Integrations', desc: 'Connects directly with your existing tools and workflows.' },
        { title: 'Dedicated Support', desc: '24/7 technical guidance whenever your team needs assistance.' },
      ],
    },
    testimonials: {
      badge: 'CLIENT SUCCESS',
      heading: 'Trusted by High-Velocity Engineering & Product Teams',
      items: [
        { quote: 'Klyvora helped us streamline our customer touchpoints and cut operational turnaround time in half. Flawless execution.', author: 'Aarav Mehta', role: 'VP of Technology, FinScale' },
        { quote: 'The attention to detail, typography, and speed is extraordinary. It felt like having a top-tier design studio in-house.', author: 'Priya Sharma', role: 'Founder & CEO, NexaLabs' },
      ],
    },
    gallery: {
      badge: 'STUDIO SHOWCASE',
      heading: 'Crafting Next-Generation Digital Experiences',
      subheading: 'Visualizing systems, products, and interfaces built for scale.',
      images: [
        { title: 'Distributed Event Queue', caption: 'High-throughput real-time streaming pipeline' },
        { title: 'Design Token System', caption: 'Modular typography and atomic component scales' },
        { title: 'Global Edge Observability', caption: 'Live multi-region latency and health metrics' },
      ],
    },
    pricing: {
      badge: 'TRANSPARENT PRICING',
      heading: 'Predictable Tiers Built for Teams of All Sizes',
      subheading: 'Choose the plan that fits your growth. Upgrade or cancel anytime.',
      plans: [
        { name: 'Professional Starter', price: '₹2,499', period: '/month', desc: 'Ideal for emerging businesses and independent product teams.', features: ['Up to 50,000 monthly events', 'Standard API access', 'Community & email support', 'Automated daily backups'] },
        { name: 'Scale Tier', price: '₹7,999', period: '/month', desc: 'Comprehensive capabilities for rapidly expanding organizations.', features: ['Unlimited event throughput', 'Custom webhook endpoints', '24/7 priority SLA support', 'Dedicated account manager'] },
      ],
    },
    faq: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      heading: 'Everything You Need to Know',
      items: [
        { q: 'How quickly can our team get started?', a: 'You can launch in minutes with our streamlined setup process, intuitive dashboard, and comprehensive documentation.' },
        { q: 'Do you offer custom integrations and APIs?', a: 'Yes, our platform provides open REST and GraphQL APIs, along with flexible webhook listeners for custom workflows.' },
        { q: 'What security standards and SLAs are supported?', a: 'We enforce end-to-end encryption in transit and at rest, maintaining a 99.9% uptime SLA across all production tiers.' },
      ],
    },
    booking: {
      badge: 'SCHEDULE A SESSION',
      heading: 'Book an Architecture Consultation',
      subheading: 'Speak with our engineering leads to design the optimal setup for your team.',
      fields: ['Full Name', 'Work Email', 'Phone Number', 'Preferred Date', 'Notes'],
    },
    contact: {
      badge: 'GET IN TOUCH',
      heading: 'Start the Conversation Today',
      subheading: 'Have questions, need a tailored enterprise plan, or want a live demo? Reach out.',
      showMapPlaceholder: true,
      channels: {
        whatsapp: true,
        email: true,
        phone: true,
      },
    },
    stats: {
      badge: 'PROVEN SCALE & VELOCITY',
      heading: 'Engineered for Substantial Real-World Impact',
      subheading: 'Consistent performance and reliability validated by top engineering and leadership teams.',
      items: [
        { value: '99.99%', label: 'Guaranteed SLA Uptime' },
        { value: '10x', label: 'Faster Time to Deploy' },
        { value: '2,500+', label: 'Active Teams & Clients' },
        { value: '₹150Cr+', label: 'Processed Volume' },
      ],
    },
    cta: {
      badge: 'ACCELERATE YOUR JOURNEY',
      heading: 'Ready to Transform Your Workflow?',
      subheading: 'Experience modern craftsmanship, lightning-fast deployment, and dedicated architectural guidance today.',
      primaryBtnText: 'Get Started Now',
      primaryBtnUrl: '#contact',
      secondaryBtnText: 'Schedule Live Demo',
      secondaryBtnUrl: '#contact',
    },
    cta_banner: {
      badge: 'ACCELERATE YOUR JOURNEY',
      heading: 'Ready to Transform Your Workflow?',
      subheading: 'Experience modern craftsmanship, lightning-fast deployment, and dedicated architectural guidance today.',
      primaryBtnText: 'Get Started Now',
      primaryBtnUrl: '#contact',
      secondaryBtnText: 'Schedule Live Demo',
      secondaryBtnUrl: '#contact',
    },
    newsletter: {
      badge: 'PRODUCT INSIGHTS',
      heading: 'Stay Informed with Engineering Updates',
      subheading: 'Join forward-thinking builders receiving our monthly technology brief and product roadmap.',
      btnText: 'Subscribe Now',
    },
    footer: {
      businessName: 'Venture Studio',
      tagline: 'Modern High-Impact Digital Solutions & Products.',
      builtBy: 'Built with Klyvora Studio',
      copyright: `© ${new Date().getFullYear()} Venture Studio. All rights reserved.`,
      links: [
        { label: 'Home', url: '#home' },
        { label: 'Features', url: '#features' },
        { label: 'Capabilities', url: '#products' },
        { label: 'Pricing', url: '#pricing' },
        { label: 'Contact', url: '#contact' },
      ],
    },
  };

  return {
    id,
    type,
    name: overrides.name || type.charAt(0).toUpperCase() + type.slice(1),
    hidden: false,
    props: {
      ...(defaultPropsByType[type] || {}),
      ...props,
    },
    ...overrides,
  };
}

/**
 * Creates a complete blank or template project
 */
export function createProject(options = {}) {
  const id = generateId('proj');
  const now = new Date().toISOString();
  const name = options.name || 'Untitled Digital Experience';
  const category = options.category || 'General';

  const brand = createDefaultBrand({
    businessName: name,
    category,
    description: options.description || '',
    ...options.brand,
  });

  const theme = createDefaultTheme(options.theme || {});
  const seo = createDefaultSEO(name, options.description || '');

  // Default Home Page with essential sections
  const homePage = {
    id: generateId('page_home'),
    title: 'Home',
    slug: 'home',
    isHome: true,
    sections: options.sections || [
      createSection('navigation', { logoText: name }),
      createSection('hero', {
        heading: options.heroHeading || `Welcome to ${name}`,
        subheading: options.description || 'Designed with purpose, built for what comes next.',
      }),
      createSection('about'),
      createSection('features'),
      createSection('products'),
      createSection('testimonials'),
      createSection('faq'),
      createSection('contact'),
      createSection('footer', { businessName: name }),
    ],
  };

  return {
    id,
    metadata: {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: options.description || '',
      category,
      createdAt: now,
      updatedAt: now,
      status: 'draft', // 'draft' | 'published'
      favorite: false,
      archived: false,
      thumbnail: options.thumbnail || null,
      selectedModel: 'System Architect 1.2 Neo',
      backendProvider: 'Local Intelligent Engine',
    },
    brand,
    theme,
    seo,
    analytics: {
      googleAnalyticsId: '',
      metaPixelId: '',
    },
    pages: [homePage],
    forms: [], // captured preview submissions: { id, formType, timestamp, data }
    versionHistory: [
      {
        id: generateId('ver'),
        timestamp: now,
        label: 'Initial Project Generation',
        snapshotSummary: 'Project created via Klyvora Studio',
      },
    ],
  };
}
