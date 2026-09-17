import { createProject, createSection } from './projectSchema.js';

export function getSeedTemplates() {
  // 1. Luma & Bean Café
  const lumaAndBean = createProject({
    name: 'Luma & Bean Café',
    category: 'Cafe',
    description: 'Boutique single-origin coffee bar and artisan micro-roastery serving seasonal pour-overs, morning pastries, and botanical teas.',
    theme: {
      primaryColor: '#e07a5f',    // Roasted Terracotta
      secondaryColor: '#3d405b',
      accentColor: '#81b29a',
      bgColor: '#0c0a09',
      surfaceColor: '#171412',
      textColor: '#fafaf9',
      fontHeading: 'Syne',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '14px',
    },
    brand: {
      businessName: 'Luma & Bean Café',
      tagline: 'Artisan Micro-Roasts & Botanical Tea Bar',
      category: 'Cafe',
      description: 'Slow-crafted pour-overs, cold ferments, and flaky viennoiserie baked daily at dawn.',
      location: '482 Hayes Street, San Francisco, CA',
      contact: {
        email: 'hello@lumaandbean.com',
        phone: '+1 (555) 382-9011',
        whatsapp: '+15553829011',
        address: '482 Hayes Street, San Francisco, CA 94102',
        openingHours: 'Mon–Sun: 6:30 AM – 5:00 PM',
      },
      social: {
        instagram: 'https://instagram.com/lumaandbean',
        twitter: '',
        facebook: '',
        linkedin: '',
      },
      ctaText: 'WhatsApp Order',
      ctaLink: '#whatsapp',
    },
    sections: [
      createSection('announcement', {
        text: '☕ Spring Single-Origin Geisha & Cardamom Morning Buns Now Available!',
        badge: 'NEW ROAST',
        linkText: 'Explore Menu',
        linkUrl: '#menu',
      }),
      createSection('navigation', {
        logoText: 'Luma & Bean',
        links: [
          { label: 'Home', url: '#home' },
          { label: 'About', url: '#about' },
          { label: 'Menu', url: '#menu' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'WhatsApp Order',
        ctaUrl: '#whatsapp',
      }),
      createSection('hero', {
        badge: '✦ ETHICALLY SOURCED MICRO-ROASTS',
        heading: 'Slow Coffee & Morning Pastries Crafted with Purpose.',
        subheading: 'Single-origin beans roasted weekly in San Francisco. Pair with our naturally fermented sourdough treats and signature matcha lattes.',
        primaryBtnText: 'Explore the Menu',
        primaryBtnUrl: '#menu',
        secondaryBtnText: 'Visit Luma & Bean',
        secondaryBtnUrl: '#contact',
      }),
      createSection('about', {
        badge: 'OUR PHILOSOPHY',
        heading: 'From Seed to Cup, Without Compromise.',
        paragraph1: 'Luma & Bean was founded on a simple belief: coffee should be transparent, seasonal, and rooted in relationships with regenerative family farms.',
        paragraph2: 'Every cup is calibrated to highlight nuanced fruit profiles, florals, and balanced sweetness—served in our luminous neighborhood space.',
      }),
      createSection('products', {
        badge: 'CAFE MENU',
        heading: 'Artisan Brews & Provisions',
        subheading: 'Prepared to order by our dedicated barista and bakery team.',
        items: [
          { name: 'Onyx Reserve Espresso', price: '$4.50', desc: 'Notes of dark cacao, dried plum, and wild orange zest.', tag: 'Signature' },
          { name: 'Kyoto Slow Drip Cold Brew', price: '$6.00', desc: '12-hour tower extraction with hints of molasses and bourbon vanilla.', tag: 'Bestseller' },
          { name: 'Ceremonial Uji Matcha Latte', price: '$6.50', desc: 'Stoneground first-harvest green tea with creamy oat emulsion.', tag: 'Botanical' },
          { name: 'Cardamom Pistachio Morning Knot', price: '$5.75', desc: 'Flaky laminated pastry infused with crushed cardamom pods.', tag: 'Baked Daily' },
        ],
      }),
      createSection('testimonials', {
        badge: 'COMMUNITY REVIEWS',
        heading: 'Words from Regulars & Coffee Critics',
        items: [
          { quote: 'The Kyoto Cold Brew is unmatched. Best atmosphere in Hayes Valley to read or catch up.', author: 'Elena Rostova', role: 'Architect & Regular' },
          { quote: 'Ordering our weekly office beans via WhatsApp is lightning fast and always freshly roasted.', author: 'Marcus Chen', role: 'Design Lead' },
        ],
      }),
      createSection('contact', {
        badge: 'FIND US',
        heading: 'Visit Luma & Bean Café',
        subheading: 'Stop by for morning espresso or pre-order on WhatsApp for pickup.',
      }),
      createSection('footer', {
        businessName: 'Luma & Bean Café',
        tagline: 'Artisan Micro-Roastery & Neighborhood Haven',
        links: [
          { label: 'Home', url: '#home' },
          { label: 'About', url: '#about' },
          { label: 'Menu', url: '#menu' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Contact', url: '#contact' },
        ],
      }),
    ],
  });

  // 2. Aura Artisan Bakery
  const bakery = createProject({
    name: 'Aura Artisan Bakery',
    category: 'Bakery',
    description: 'Neighborhood artisan sourdough bakery with stoneground grains and morning viennoiserie in San Francisco.',
    theme: {
      primaryColor: '#f59e0b',    // Warm Amber Hearth
      secondaryColor: '#d97706',
      accentColor: '#fbbf24',
      bgColor: '#080706',
      surfaceColor: '#120f0c',
      textColor: '#fdfbf7',
      fontHeading: 'Syne',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '12px',
    },
    brand: {
      businessName: 'Aura Artisan Bakery',
      tagline: 'Pure Sourdough Fermentation & Heritage Wheats',
      category: 'Bakery',
      description: 'Handcrafted sourdough loaves, morning buns, and seasonal fruit tarts baked at dawn.',
      location: '124 Heritage Lane, San Francisco, CA',
      contact: {
        email: 'hello@aurabakery.com',
        phone: '+1 (555) 234-8901',
        whatsapp: '+15552348901',
        address: '124 Heritage Lane, San Francisco, CA 94103',
        openingHours: 'Tue–Sun: 7:00 AM – 2:00 PM (Closed Mondays)',
      },
      social: {
        instagram: 'https://instagram.com/aurabakery',
        twitter: '',
        facebook: '',
        linkedin: '',
      },
      ctaText: 'Order via WhatsApp',
      ctaLink: '#contact',
    },
    sections: [
      createSection('announcement', {
        text: '🥐 Weekend Almond Croissant & Wild Spelt Loaves Pre-orders are Open!',
        badge: 'FRESH BATCH',
        linkText: 'Order Now',
        linkUrl: '#contact',
      }),
      createSection('navigation', {
        logoText: 'Aura Bakery',
        links: [
          { label: 'Story', url: '#about' },
          { label: 'Daily Menu', url: '#products' },
          { label: 'Subscriptions', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'WhatsApp Order',
        ctaUrl: '#contact',
      }),
      createSection('hero', {
        badge: '✦ 36-HOUR WILD FERMENTATION',
        heading: 'Handcrafted Bread & Pastries with Pure Heritage Grains.',
        subheading: 'Baked fresh daily at dawn in San Francisco. Pure sourdough fermentation, organic flours, and zero additives.',
        primaryBtnText: 'View Daily Menu',
        primaryBtnUrl: '#products',
        secondaryBtnText: 'Order on WhatsApp',
        secondaryBtnUrl: '#contact',
      }),
      createSection('about', {
        badge: 'OUR PHILOSOPHY',
        heading: 'Slow Fermentation. Honest Grain.',
        paragraph1: 'Every loaf at Aura begins with our 8-year-old wild sourdough starter, pure filtered spring water, and regional organic flour.',
        paragraph2: 'We give the dough the time it needs—36 hours of cold fermentation—to develop complex aroma, digestibility, and blistered caramelized crust.',
      }),
      createSection('products', {
        badge: 'DAILY SELECTION',
        heading: 'Freshly Baked Provisions',
        subheading: 'Available at the counter from 7 AM until sold out.',
        items: [
          { name: 'Heritage Country Loaf', price: '$11.00', desc: 'Stoneground whole wheat blend, custardy open crumb, blistered crust.', tag: 'Signature' },
          { name: 'Cardamom Orange Morning Bun', price: '$5.50', desc: 'Flaky laminated pastry rolled with Ceylon cardamom and orange zest.', tag: 'Bestseller' },
          { name: 'Danish Dark Seeded Rye', price: '$12.50', desc: '100% whole rye packed with sprouted pumpkin seeds and malted barley.', tag: 'Nutrient Rich' },
          { name: 'Pain au Chocolat', price: '$6.00', desc: 'Double bars of bittersweet Valrhona 64% dark chocolate.', tag: 'Classic' },
        ],
      }),
      createSection('features', {
        badge: 'WHAT SETS US APART',
        heading: 'The Aura Standard',
        items: [
          { title: 'Zero Commercial Yeast', desc: '100% leavened with our thriving wild sourdough culture.' },
          { title: 'Regenerative Flours', desc: 'Grown by regional farmers committed to living, biodiverse soil.' },
          { title: 'Hand-Shaped Daily', desc: 'Every loaf and pastry shaped individually by artisan hands.' },
          { title: 'Community First', desc: 'Remaining bread donated nightly to local neighborhood shelters.' },
        ],
      }),
      createSection('testimonials', {
        badge: 'CUSTOMER REVIEWS',
        heading: 'Words from Our Neighborhood',
        items: [
          { quote: 'The crust on their Country Loaf is sensational. Truly the gold standard for sourdough.', author: 'Sophie Laurent', role: 'Local Chef & Food Writer' },
          { quote: 'Ordered pastry boxes for our studio team via WhatsApp. Seamless, warm, and utterly delicious.', author: 'David Kim', role: 'Architect & Regular' },
        ],
      }),
      createSection('pricing', {
        badge: 'WEEKLY BREAD CLUB',
        heading: 'Subscribe & Never Miss a Loaf',
        subheading: 'Fresh bread delivered weekly or reserved at the counter.',
        plans: [
          { name: 'Hearth Subscriber', price: '$22', period: '/wk', desc: '2 Fresh Country Loaves Weekly', features: ['Guaranteed priority pickup', 'Warm from 7:30 AM', 'Free seasonal pastry sample'] },
          { name: 'Pastry & Bread Box', price: '$38', period: '/wk', desc: '2 Loaves + 4 Assorted Morning Bakes', features: ['Weekend morning delivery option', 'Recipe pairing notes', '10% in-store discount'] },
        ],
      }),
      createSection('faq', {
        badge: 'FAQ',
        heading: 'Frequently Asked Questions',
        items: [
          { q: 'How early should I arrive before items sell out?', a: 'On weekends, popular pastries like our Cardamom Buns sell out by 10:30 AM. Hearth breads are typically available through 1:00 PM.' },
          { q: 'Can I place custom catering or pastry orders?', a: 'Yes! We happily accommodate office breakfasts and celebrations with 48 hours notice via WhatsApp or email.' },
          { q: 'How long does your sourdough stay fresh?', a: 'Thanks to the natural acidity of wild fermentation, our loaves remain delicious on the counter for 4–5 days.' },
        ],
      }),
      createSection('contact', {
        badge: 'LOCATION & ORDERS',
        heading: 'Visit Us or Message Directly',
        subheading: 'Drop by our warm bakery counter or message us on WhatsApp for orders.',
        showMapPlaceholder: true,
      }),
      createSection('footer', {
        businessName: 'Aura Artisan Bakery',
        tagline: 'Handcrafted Organic Sourdough & Morning Viennoiserie',
      }),
    ],
  });

  // 2. Veloce Cloud Platform
  const saas = createProject({
    name: 'Veloce Cloud Platform',
    category: 'SaaS Startup',
    description: 'High-performance real-time telemetry and edge computation engine for modern developer teams.',
    theme: {
      primaryColor: '#06b6d4',    // Bioluminescent Cyan
      secondaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      bgColor: '#06080d',
      surfaceColor: '#0c101a',
      textColor: '#f8fafc',
      fontHeading: 'Space Grotesk',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '10px',
    },
    brand: {
      businessName: 'Veloce Cloud',
      tagline: 'Sub-millisecond Edge Telemetry & Event Streaming',
      category: 'Technology',
      description: 'Engineered for engineering teams who demand real-time observability at scale.',
      contact: {
        email: 'support@veloce.dev',
        phone: '+1 (800) 555-0199',
        whatsapp: '',
        address: '500 Howard Street, San Francisco, CA',
        openingHours: '24/7 Global Infrastructure',
      },
      ctaText: 'Start Free Trial',
      ctaLink: '#pricing',
    },
    sections: [
      createSection('navigation', {
        logoText: 'Veloce',
        links: [
          { label: 'Capabilities', url: '#features' },
          { label: 'Architecture', url: '#about' },
          { label: 'Pricing', url: '#pricing' },
          { label: 'Docs', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'Deploy Now',
        ctaUrl: '#pricing',
      }),
      createSection('hero', {
        badge: '✦ VELOCE 3.0 RUNTIME NOW LIVE',
        heading: 'Real-Time Edge Telemetry with Zero Pipeline Latency.',
        subheading: 'Stream millions of distributed events per second with instant SQL analytics, sub-millisecond querying, and unified multi-cloud pipelines.',
        primaryBtnText: 'Deploy Cluster',
        primaryBtnUrl: '#pricing',
        secondaryBtnText: 'Inspect API Docs',
        secondaryBtnUrl: '#faq',
      }),
      createSection('features', {
        badge: 'ENGINE SPECIFICATIONS',
        heading: 'Engineered for Unforgiving Workloads',
        items: [
          { title: 'Sub-1ms Query Engine', desc: 'Columnar memory format delivering queries at hardware speed.' },
          { title: 'Global Edge Mesh', desc: 'Over 140 points of presence routing event ingestion securely.' },
          { title: 'Automatic Schema Detection', desc: 'No manual migrations. Ingest unstructured JSON with instant typed indexing.' },
          { title: 'Enterprise Encryption', desc: 'SOC2 Type II certified with end-to-end envelope encryption.' },
        ],
      }),
      createSection('pricing', {
        badge: 'TRANSPARENT PLANS',
        heading: 'Scale as Your Data Grows',
        subheading: 'No surprise surge fees. Predictable pricing for high-throughput teams.',
        plans: [
          { name: 'Developer', price: '$0', period: '/mo', desc: 'For prototypes and independent builders', features: ['10M Events / month', '3 Retention Days', 'Community Discord Support'] },
          { name: 'Team Production', price: '$149', period: '/mo', desc: 'For growing cloud architectures', features: ['100M Events / month', '30 Retention Days', 'SLA 99.95% Guarantee', 'Dedicated Slack Channel'] },
          { name: 'Enterprise Dedicated', price: '$599', period: '/mo', desc: 'For mission-critical global scale', features: ['Unlimited Ingestion', 'Custom Retention', 'Private VPC Peering', 'Dedicated Solutions Architect'] },
        ],
      }),
      createSection('faq', {
        badge: 'TECHNICAL FAQ',
        heading: 'Developer Questions Answered',
        items: [
          { q: 'How does Veloce integrate with existing Kubernetes clusters?', a: 'We provide a lightweight native DaemonSet that streams container logs and metrics directly into your Veloce pipeline with under 1% CPU overhead.' },
          { q: 'Can we run queries using standard SQL?', a: 'Yes. Veloce fully complies with ANSI SQL-92, including window functions, joins, and real-time aggregations.' },
        ],
      }),
      createSection('contact', {
        badge: 'ENTERPRISE INQUIRIES',
        heading: 'Connect with a Solutions Architect',
        subheading: 'Need custom throughput benchmarks or private VPC peering? Reach our core team.',
      }),
      createSection('footer', {
        businessName: 'Veloce Cloud Platform',
        tagline: 'High-velocity telemetry and real-time data streaming.',
      }),
    ],
  });

  // 3. Lumina Creative Studio
  const agency = createProject({
    name: 'Lumina Creative Studio',
    category: 'Agency',
    description: 'Boutique digital brand design and creative technology studio crafting memorable interactive experiences.',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899',
      accentColor: '#06b6d4',
      bgColor: '#07080c',
      surfaceColor: '#0e111a',
      textColor: '#f8fafc',
      fontHeading: 'Syne',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '16px',
    },
    brand: {
      businessName: 'Lumina Creative Studio',
      tagline: 'Cinematic Branding & Creative Technology',
      category: 'Design Studio',
      description: 'We partner with visionary founders to build identities and web platforms that define industries.',
      contact: {
        email: 'hello@luminastudio.design',
        phone: '+1 (555) 890-4321',
        whatsapp: '+15558904321',
        address: 'SoHo, New York, NY',
        openingHours: 'Mon–Fri: 9:00 AM – 6:00 PM EST',
      },
      ctaText: 'Start a Project',
      ctaLink: '#contact',
    },
    sections: [
      createSection('navigation', {
        logoText: 'Lumina Studio',
        links: [
          { label: 'Work', url: '#gallery' },
          { label: 'Disciplines', url: '#services' },
          { label: 'Approach', url: '#about' },
          { label: 'Client Voices', url: '#testimonials' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'Start a Project',
        ctaUrl: '#contact',
      }),
      createSection('hero', {
        badge: '✦ INDEPENDENT DESIGN COLLECTIVE',
        heading: 'We Sculpt Digital Brands That Command the Future.',
        subheading: 'Bridging high-concept brand strategy, cinematic design, and high-performance interactive engineering for ambitious founders.',
        primaryBtnText: 'View Selected Works',
        primaryBtnUrl: '#gallery',
        secondaryBtnText: 'Studio Inquiry',
        secondaryBtnUrl: '#contact',
      }),
      createSection('services', {
        badge: 'CAPABILITIES',
        heading: 'End-to-End Creative Direction',
        subheading: 'From foundational brand identity to spatial interactive systems.',
        items: [
          { title: 'Brand Identity Systems', desc: 'Logomarks, design systems, typographic scale, and brand voice guidelines.', icon: 'Palette' },
          { title: 'Digital Experiences', desc: 'Fluid 60fps web applications, e-commerce flagship platforms, and bespoke web platforms.', icon: 'Monitor' },
          { title: 'Motion & Spatial Direction', desc: 'Cinematic 3D animation, interactive shader systems, and brand film narratives.', icon: 'Sparkles' },
        ],
      }),
      createSection('gallery', {
        badge: 'PORTFOLIO',
        heading: 'Selected Recent Commissions',
        subheading: 'A curated glimpse into projects crafted with our partners.',
        images: [
          { title: 'Aetheria Soundscape', caption: 'Interactive 3D audio synthesizer and brand identity' },
          { title: 'Vanguard Aerospace', caption: 'Orbital mission control telemetry interface' },
          { title: 'Solstice Botanical', caption: 'Luxury e-commerce and packaging design system' },
        ],
      }),
      createSection('testimonials', {
        badge: 'PARTNERSHIPS',
        heading: 'What Founders Say',
        items: [
          { quote: 'Lumina transformed our brand from a standard tech startup into a category-defining cultural force.', author: 'Julian Vance', role: 'Founder & CEO, Aetheria' },
          { quote: 'Their aesthetic rigor and technical execution are unmatched. Truly world-class partners.', author: 'Mira Chen', role: 'VP Design, Vanguard' },
        ],
      }),
      createSection('contact', {
        badge: 'NEW COLLABORATIONS',
        heading: 'Let’s Create Something Exceptional',
        subheading: 'We take on a limited number of commissions each quarter to ensure obsessive focus.',
      }),
      createSection('footer', {
        businessName: 'Lumina Creative Studio',
        tagline: 'Cinematic Branding & Creative Technology Studio',
      }),
    ],
  });

  return [lumaAndBean, bakery, saas, agency];
}
