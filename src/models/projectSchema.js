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
    businessName: 'Royal Sweets & Artisan Bakes',
    tagline: 'Authentic Indian Mithai, Fresh Bakes & Savories',
    category: 'Sweets & Confectionery',
    description: 'A beloved neighborhood confectionery and artisan bakery serving handcrafted Indian sweets, fresh baked goods, and savory morning delicacies.',
    logoUrl: '',
    location: '12 Linking Road, Bandra West, Mumbai',
    contact: {
      email: 'orders@royalsweets.in',
      phone: '+91 98200 12345',
      whatsapp: '+919820012345',
      address: '12 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
      openingHours: 'Mon–Sun: 8:00 AM – 10:30 PM',
    },
    social: {
      instagram: 'https://instagram.com/royalsweets',
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
      text: '✨ Festive Season Special: 15% Off On Sweets & Gift Hampers — Order on WhatsApp!',
      badge: 'FESTIVAL OFFER',
      linkText: 'View Hampers',
      linkUrl: '#products',
      dismissible: true,
    },
    navigation: {
      logoText: 'Royal Sweets & Bakes',
      showLogoIcon: true,
      links: [
        { label: 'Home', url: '#home' },
        { label: 'About', url: '#about' },
        { label: 'Menu', url: '#products' },
        { label: 'Reviews', url: '#testimonials' },
        { label: 'Contact', url: '#contact' },
      ],
      ctaText: 'WhatsApp Order',
      ctaUrl: '#contact',
      sticky: true,
    },
    hero: {
      badge: 'FRESH DAILY & PURE GHEE',
      heading: 'Handcrafted Mithai & Fresh Bakes, Made with Love.',
      subheading: 'Pure Desi Ghee sweets, artisanal tea-time delicacies, and freshly baked delights prepared fresh every morning in Mumbai.',
      primaryBtnText: 'View Menu & Prices',
      primaryBtnUrl: '#products',
      secondaryBtnText: 'WhatsApp Order (+91)',
      secondaryBtnUrl: '#contact',
      imageUrl: '',
      alignment: 'center', // 'left', 'center', 'split'
    },
    about: {
      badge: 'OUR HERITAGE',
      heading: 'A Legacy of Purity, Taste, and Authentic Recipes.',
      paragraph1: 'For over three decades, we have crafted authentic Indian delicacies using time-honored recipes, pure A2 desi ghee, and handpicked dry fruits.',
      paragraph2: 'Every sweet, savory snack, and baked provision is prepared in small artisanal batches with zero chemical preservatives.',
      highlights: [
        { title: '100% Pure Desi Ghee', desc: 'Crafted without compromises or artificial flavors' },
        { title: 'Handmade Daily at Dawn', desc: 'Fresh batches ready every morning by 8:00 AM' },
        { title: 'Safe Hygienic Packaging', desc: 'Tamper-proof gift boxes for weddings and celebrations' },
      ],
    },
    services: {
      badge: 'WHAT WE OFFER',
      heading: 'Artisan Catering & Celebration Hampers',
      subheading: 'From festive gift packaging to corporate and wedding bulk orders.',
      items: [
        { title: 'Counter Walk-In Service', desc: 'Fresh sweets, warm samosas, and tea bakes available all day.', icon: 'Coffee' },
        { title: 'Festive & Wedding Hampers', desc: 'Custom dry fruit and premium mithai boxes with your custom branding.', icon: 'Package' },
        { title: 'Corporate & Bulk Gifting', desc: 'Pan-India shipping for corporate festive celebration packages.', icon: 'Truck' },
      ],
    },
    products: {
      badge: 'SPECIALTY MENU',
      heading: 'Featured Delicacies & Provisions',
      subheading: 'Prepared in limited batches daily to preserve authentic taste.',
      items: [
        { name: 'Kaju Katli Gift Box (500g)', price: '₹550', desc: 'Pure silver varq cashew fudge made with 100% Goan cashews.', tag: 'Bestseller' },
        { name: 'Motichoor Pure Ghee Ladoo (500g)', price: '₹380', desc: 'Melt-in-mouth saffron infused gram pearls roasted in desi ghee.', tag: 'Popular' },
        { name: 'Artisan Cardamom Rusk & Khari Box', price: '₹220', desc: 'Flaky tea-time puff pastries baked fresh with golden butter.', tag: 'Tea Special' },
        { name: 'Royal Pista Malai Peda (400g)', price: '₹460', desc: 'Slow-cooked milk mawa infused with green cardamom and Iranian pistachios.', tag: 'Signature' },
      ],
    },
    features: {
      badge: 'OUR PROMISE',
      heading: 'Why Generations of Families Choose Us',
      items: [
        { title: 'Zero Artificial Additives', desc: 'Only pure milk mawa, real saffron, and authentic natural spices.' },
        { title: 'Same-Day Fresh Preparation', desc: 'Every batch is prepared fresh daily for unforgettable taste.' },
        { title: 'Instant WhatsApp Booking', desc: 'Quick 1-tap ordering with instant order confirmation.' },
        { title: 'UPI & Cash on Delivery', desc: 'Easy digital payments via Google Pay, PhonePe, and Paytm.' },
      ],
    },
    testimonials: {
      badge: 'PATRON REVIEWS',
      heading: 'Loved by Families, Foodies & Festive Shoppers',
      items: [
        { quote: 'The Kaju Katli and Motichoor Ladoos for our daughter’s wedding were sublime. Every guest praised the authentic taste.', author: 'Sunil & Renu Agarwal', role: 'Bandra West, Mumbai' },
        { quote: 'Ordered 50 corporate Diwali boxes via WhatsApp. Delivered on time in pristine packaging with personalized notes!', author: 'Pooja Verma', role: 'Operations Lead, TechCorp India' },
      ],
    },
    gallery: {
      badge: 'FROM OUR WORKSHOP',
      heading: 'The Art of Confectionery',
      subheading: 'Capturing moments from our live kitchen and packaging studio.',
      images: [
        { title: 'Golden Desi Ghee Roasting', caption: 'Slow-cooking gram flour to rich golden perfection' },
        { title: 'Hand-Cut Kaju Katli', caption: 'Precision diamond cuts dressed in pure silver leaf' },
        { title: 'Festive Gift Hampers', caption: 'Silk-lined celebration packaging ready for delivery' },
      ],
    },
    pricing: {
      badge: 'CELEBRATION PACKAGES',
      heading: 'Curated Gift Boxes & Bulk Bundles',
      subheading: 'Pre-book your festive and party orders for priority preparation.',
      plans: [
        { name: 'Family Celebration Box', price: '₹1,299', period: '/box', desc: '1kg Assorted Mithai + 250g Roasted Dry Fruits', features: ['Premium festive box', 'WhatsApp priority dispatch', 'Personalized greeting card'] },
        { name: 'Royal Grand Hamper', price: '₹2,499', period: '/hamper', desc: '1.5kg Special Sweets + 500g Premium Cashews & Almonds', features: ['Handcrafted wooden keepsake box', 'Same-day Mumbai delivery', 'Complimentary tea bakery tin'] },
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
      badge: 'FESTIVE UPDATES',
      heading: 'Join the Celebration Club',
      subheading: 'Receive seasonal mithai discounts, festive hamper previews, and VIP tasting invitations.',
      btnText: 'Join on WhatsApp',
    },
    footer: {
      businessName: 'Royal Sweets & Artisan Bakes',
      tagline: 'Handcrafted with pure desi ghee and authentic tradition.',
      builtBy: 'Built with Klyvora Studio',
      copyright: `© ${new Date().getFullYear()} Royal Sweets & Artisan Bakes. All rights reserved.`,
      links: [
        { label: 'Home', url: '#home' },
        { label: 'Menu & Prices', url: '#products' },
        { label: 'Our Heritage', url: '#about' },
        { label: 'WhatsApp Order', url: '#contact' },
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
