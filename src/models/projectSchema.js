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

export function createDefaultBrand(overrides = {}) {
  return {
    businessName: 'Aura Artisan Bakery',
    tagline: 'Handcrafted Organic Sourdough & Viennoiserie',
    category: 'Bakery',
    description: 'A neighborhood artisan bakery dedicated to natural sourdough fermentation, pure stoneground grains, and exquisite morning pastries.',
    logoUrl: '',
    location: '124 Heritage Lane, San Francisco, CA',
    contact: {
      email: 'hello@aurabakery.com',
      phone: '+1 (555) 234-8901',
      whatsapp: '+15552348901',
      address: '124 Heritage Lane, San Francisco, CA',
      openingHours: 'Tue–Sun: 7:00 AM – 3:00 PM (Closed Mondays)',
    },
    social: {
      instagram: 'https://instagram.com/aurabakery',
      twitter: '',
      facebook: '',
      linkedin: '',
    },
    ctaText: 'Order via WhatsApp',
    ctaLink: '#contact',
    ...overrides,
  };
}

/**
 * Standard Section Templates Factory
 */
export function createSection(type, props = {}, overrides = {}) {
  const id = generateId(`sec_${type}`);

  const defaultPropsByType = {
    announcement: {
      text: '✨ Grand Opening Specials Available This Week — Order Early!',
      badge: 'NOTICE',
      linkText: 'View Specials',
      linkUrl: '#products',
      dismissible: true,
    },
    navigation: {
      logoText: 'Aura Bakery',
      showLogoIcon: true,
      links: [
        { label: 'Home', url: '#home' },
        { label: 'About', url: '#about' },
        { label: 'Menu', url: '#products' },
        { label: 'Reviews', url: '#testimonials' },
        { label: 'Contact', url: '#contact' },
      ],
      ctaText: 'Order Now',
      ctaUrl: '#contact',
      sticky: true,
    },
    hero: {
      badge: 'FRESHLY BAKED DAILY',
      heading: 'Artisan Sourdough & Pure Grains, Crafted with Purpose.',
      subheading: 'Naturally leavened sourdough bread, flaky butter croissants, and seasonal pastries baked fresh every morning in San Francisco.',
      primaryBtnText: 'Explore Daily Menu',
      primaryBtnUrl: '#products',
      secondaryBtnText: 'WhatsApp Order',
      secondaryBtnUrl: '#contact',
      imageUrl: '',
      alignment: 'center', // 'left', 'center', 'split'
    },
    about: {
      badge: 'OUR STORY',
      heading: 'A Dedication to Time, Patience, and Honest Grains.',
      paragraph1: 'We believe exceptional bread cannot be rushed. Our sourdough loaves undergo a slow 36-hour wild fermentation, developing a crackling caramelized crust and rich, aromatic crumb.',
      paragraph2: 'Partnering directly with regenerative grain millers, every flour variety we select honors soil health and timeless baking traditions.',
      highlights: [
        { title: '100% Wild Fermentation', desc: 'No commercial yeast or artificial additives' },
        { title: 'Stoneground Heritage Flour', desc: 'Sourced directly from local sustainable farms' },
        { title: 'Baked Fresh Every Dawn', desc: 'Warm loaves ready as the morning sun rises' },
      ],
    },
    services: {
      badge: 'WHAT WE OFFER',
      heading: 'Artisan Baking & Curated Offerings',
      subheading: 'From morning coffee pairings to wholesale cafe partnerships.',
      items: [
        { title: 'Daily Counter Service', desc: 'Fresh sourdough loaves, baguettes, and laminated pastries ready at 7 AM.', icon: 'Coffee' },
        { title: 'Pre-Order & Pickup', desc: 'Reserve weekend specialty loaves and pastry boxes via WhatsApp.', icon: 'Package' },
        { title: 'Cafe Wholesale', desc: 'Supplying premier restaurants and cafes with daily fresh bread delivery.', icon: 'Truck' },
      ],
    },
    products: {
      badge: 'DAILY MENU',
      heading: 'Featured Bakes & Provisions',
      subheading: 'Handcrafted in limited batches daily until sold out.',
      items: [
        { name: 'Country Sourdough Loaf', price: '$11.00', desc: 'Whole grain blend, crisp crust, custardy open crumb.', tag: 'Bestseller' },
        { name: 'Cardamom Morning Bun', price: '$5.50', desc: 'Flaky laminated brioche tossed in cardamom sugar.', tag: 'Popular' },
        { name: 'Seeded Rye Boule', price: '$12.50', desc: 'Organic rye coated in toasted flax, sesame, and sunflower seeds.', tag: 'Specialty' },
        { name: 'Valrhona Chocolate Croissant', price: '$6.00', desc: 'Double batons of dark French chocolate in butter puff pastry.', tag: 'Signature' },
      ],
    },
    features: {
      badge: 'OUR STANDARDS',
      heading: 'Why Our Community Chooses Aura',
      items: [
        { title: 'Regenerative Agriculture', desc: 'Grown with organic farming practices that replenish the soil.' },
        { title: 'Ancient Grain Varieties', desc: 'Nutrient-rich heritage wheats milled fresh weekly.' },
        { title: 'Tactile Craftsmanship', desc: 'Every loaf is shaped by hand with meticulous care.' },
        { title: 'Community Centered', desc: 'Proudly feeding our neighbors and local culinary community.' },
      ],
    },
    testimonials: {
      badge: 'COMMUNITY VOICES',
      heading: 'Loved by Bread Lovers & Food Critics',
      items: [
        { quote: 'Hands down the most flavorful sourdough in the Bay Area. The crumb texture is pure perfection.', author: 'Elena Rostova', role: 'Local Food Critic' },
        { quote: 'The morning buns and country loaf are our family weekend ritual. Incredible quality every single time.', author: 'Marcus Vance', role: 'Neighborhood Regular' },
      ],
    },
    gallery: {
      badge: 'INSIDE THE BAKEHOUSE',
      heading: 'The Beauty of the Craft',
      subheading: 'Moments captured at the ovens at dawn.',
      images: [
        { title: 'Morning Loaves', caption: 'Fresh country boules resting on cooling racks' },
        { title: 'Scoring The Dough', caption: 'Precision blade work before entering the steam oven' },
        { title: 'Laminated Layers', caption: 'Butter folds creating paper-thin crispy layers' },
      ],
    },
    pricing: {
      badge: 'SUBSCRIPTIONS & BOXES',
      heading: 'Bread & Pastry Subscriptions',
      subheading: 'Weekly bread club delivery or priority pickup.',
      plans: [
        { name: 'Weekend Bag', price: '$22', period: '/week', desc: '1 Sourdough Loaf + 2 Morning Pastries', features: ['Priority Saturday pickup', 'Freshly baked at 7 AM', 'Free recipe pairing card'] },
        { name: 'Family Hearth', price: '$38', period: '/week', desc: '2 Sourdough Loaves + 4 Pastries + Jam', features: ['Home delivery within 5 miles', 'Weekly seasonal pastry surprise', '10% counter discount'] },
      ],
    },
    faq: {
      badge: 'QUESTIONS & ANSWERS',
      heading: 'Frequently Asked Questions',
      items: [
        { q: 'How do I best store sourdough bread?', a: 'Keep cut-side down on a wooden cutting board for 2 days, or in a linen bread bag. Do not refrigerate, as cold accelerates starch retrogradation.' },
        { q: 'Can I place pre-orders for large gatherings?', a: 'Yes! Please submit pre-orders via WhatsApp or our contact form at least 48 hours in advance.' },
        { q: 'Are your breads vegan-friendly?', a: 'All our sourdough hearth breads (Country, Rye, Baguette) contain only flour, water, and sea salt. Pastries contain organic butter and eggs.' },
      ],
    },
    booking: {
      badge: 'RESERVATIONS & EVENTS',
      heading: 'Reserve Weekend Pastry Boxes',
      subheading: 'Secure your favorites before we sell out for the day.',
      fields: ['Name', 'Email', 'Phone', 'Date', 'Pickup Time', 'Items Selection'],
    },
    contact: {
      badge: 'GET IN TOUCH',
      heading: 'Visit the Bakery or Send a Message',
      subheading: 'We are here to help with special orders, catering, and questions.',
      showMapPlaceholder: true,
      channels: {
        whatsapp: true,
        email: true,
        phone: true,
      },
    },
    newsletter: {
      badge: 'STAY CONNECTED',
      heading: 'Join The Baker’s Dispatch',
      subheading: 'Receive weekly updates on seasonal bakes, weekend specials, and sourdough baking tips.',
      btnText: 'Subscribe',
    },
    footer: {
      businessName: 'Aura Artisan Bakery',
      tagline: 'Where good grain meets honest fire.',
      builtBy: 'Built with Klyvora Studio by Xeorvia',
      copyright: `© ${new Date().getFullYear()} Aura Artisan Bakery. All rights reserved.`,
      links: [
        { label: 'Home', url: '#home' },
        { label: 'Menu', url: '#products' },
        { label: 'Our Story', url: '#about' },
        { label: 'Contact', url: '#contact' },
        { label: 'Privacy Policy', url: '#privacy' },
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
