import { createProject, createSection } from './projectSchema.js';

export function getSeedTemplates() {
  // 1. Kavya Handloom & Sarees (Jaipur)
  const sareeShop = createProject({
    name: 'Kavya Handloom & Sarees',
    category: 'Clothing Shop',
    description: 'Jaipur’s premier boutique for authentic Banarasi silk, Chanderi, and handcrafted bridal lehengas with direct WhatsApp video ordering.',
    theme: {
      primaryColor: '#f59e0b',    // Royal Saffron & Gold
      secondaryColor: '#d97706',
      accentColor: '#fbbf24',
      bgColor: '#080706',
      surfaceColor: '#14100c',
      textColor: '#fdfbf7',
      fontHeading: 'Syne',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '14px',
    },
    brand: {
      businessName: 'Kavya Handloom & Sarees',
      tagline: 'Pure Banarasi, Chanderi & Bandhani Weaves Direct from Artisans',
      category: 'Clothing Shop',
      description: 'Handcrafted heritage sarees, bridal lehengas, and festive silk weaves with 1-tap WhatsApp video shopping and all-India delivery.',
      location: 'Johari Bazaar, Jaipur, Rajasthan 302003',
      contact: {
        email: 'orders@kavyasarees.in',
        phone: '+91 00000 00000',
        whatsapp: '+910000000000',
        address: '142 Johari Bazaar, Pink City, Jaipur, Rajasthan 302003',
        openingHours: 'Mon–Sat: 10:30 AM – 8:30 PM (Sunday Closed)',
      },
      social: {
        instagram: 'https://instagram.com/kavyasarees',
        twitter: '',
        facebook: '',
        linkedin: '',
      },
      ctaText: 'Order on WhatsApp',
      ctaLink: '#whatsapp',
    },
    sections: [
      createSection('announcement', {
        text: '✨ Festive Wedding Season 2026 Collection is Now Live! Flat 15% Off on Bridal Lehengas.',
        badge: 'FESTIVE DROP',
        linkText: 'Shop on WhatsApp',
        linkUrl: '#contact',
      }),
      createSection('navigation', {
        logoText: 'Kavya Sarees',
        links: [
          { label: 'Collection', url: '#products' },
          { label: 'Heritage', url: '#about' },
          { label: 'Offers', url: '#features' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'WhatsApp Order',
        ctaUrl: '#contact',
      }),
      createSection('hero', {
        badge: '✦ HANDCRAFTED HERITAGE SILKS',
        heading: 'Handcrafted Heritage Sarees for Every Royal Celebration.',
        subheading: 'Direct from master weavers in Varanasi and Chanderi. Browse our festive catalog with 1-tap WhatsApp video shopping and cash on delivery across India.',
        primaryBtnText: 'View Festive Collection',
        primaryBtnUrl: '#products',
        secondaryBtnText: 'Order on WhatsApp',
        secondaryBtnUrl: '#contact',
      }),
      createSection('about', {
        badge: 'OUR HERITAGE',
        heading: 'Three Decades of Weaving Tradition',
        paragraph1: 'Founded in Jaipur’s historic Johari Bazaar, Kavya Handloom bridges time-honored artisanal craftsmanship with modern bridal elegance.',
        paragraph2: 'Every saree is meticulously woven over 20–45 days using pure zari, natural silks, and heritage handloom looms passed down through generations.',
      }),
      createSection('products', {
        badge: 'FEATURED CATALOG',
        heading: 'Royal Festive Weaves',
        subheading: 'Available for immediate store pickup or express insured delivery across India.',
        items: [
          { name: 'Pure Katan Banarasi Silk Saree', price: '₹7,499', desc: 'Handwoven pure silk with rich gold zari floral jaal and grand pallu.', tag: 'Bestseller' },
          { name: 'Chanderi Zari Tissue Saree', price: '₹4,250', desc: 'Featherlight Chanderi weave with regal scalloped border and contrast blouse.', tag: 'Festive' },
          { name: 'Bridal Rajputi Poshak Set', price: '₹14,999', desc: 'Heavy handcrafted zardozi, kundan, and gota patti embroidery on pure georgette.', tag: 'Bridal' },
          { name: 'Jaipuri Bandhani Silk Dupatta', price: '₹1,899', desc: 'Traditional tie-and-dye bandhej on pure chinon silk with gold gota lace.', tag: 'Handmade' },
        ],
      }),
      createSection('features', {
        badge: 'WHY SHOP WITH US',
        heading: 'The Kavya Promise',
        items: [
          { title: '100% Silk Mark Certified', desc: 'Guaranteed purity with official government Silk Mark certification.' },
          { title: 'WhatsApp Video Shopping', desc: 'Inspect colors, drape, and zari live on video call before ordering.' },
          { title: 'All-India Express Shipping', desc: 'Safe doorstep delivery within 3–5 days across 25,000+ pin codes.' },
          { title: 'Cash on Delivery Available', desc: 'Pay with complete peace of mind when your package arrives.' },
        ],
      }),
      createSection('testimonials', {
        badge: 'CUSTOMER VOICES',
        heading: 'Loved by Brides & Families Across India',
        items: [
          { quote: 'Ordered my bridal Banarasi saree via WhatsApp video call from Mumbai. The fabric quality and real gold zari were breathtaking!', author: 'Pooja Agarwal', role: 'Mumbai Bride' },
          { quote: 'The Chanderi saree was delivered in 3 days in beautiful packaging. Outstanding service and authentic Jaipur craftsmanship.', author: 'Sunita Mehta', role: 'Delhi Patron' },
        ],
      }),
      createSection('contact', {
        badge: 'VISIT OUR SHOWROOM',
        heading: 'Visit Us in Johari Bazaar or Message on WhatsApp',
        subheading: 'Experience our full bridal collection in person or chat with our styling team on WhatsApp.',
      }),
      createSection('footer', {
        businessName: 'Kavya Handloom & Sarees',
        tagline: 'Handcrafted Heritage Sarees & Bridal Lehengas // Jaipur',
      }),
    ],
  });

  // 2. Apex IIT-JEE & NEET Academy (Kota)
  const coachingAcademy = createProject({
    name: 'Apex IIT-JEE & NEET Academy',
    category: 'Coaching Institute',
    description: 'Premier competitive examination coaching institute in Kota producing top 100 All India Rankers with dedicated faculty and daily test series.',
    theme: {
      primaryColor: '#06b6d4',    // Apex Cyan
      secondaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      bgColor: '#06080e',
      surfaceColor: '#0c111c',
      textColor: '#f8fafc',
      fontHeading: 'Space Grotesk',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '12px',
    },
    brand: {
      businessName: 'Apex IIT-JEE & NEET Academy',
      tagline: 'Kota’s Trusted Legacy for Engineering & Medical Entrance Excellence',
      category: 'Coaching Institute',
      description: 'Systematic classroom training, Kota DPP methodology, and personalized AI performance analytics for JEE Advanced and NEET.',
      location: 'Vigyan Nagar, Kota, Rajasthan 324005',
      contact: {
        email: 'admissions@apexkota.edu.in',
        phone: '+91 00000 00000',
        whatsapp: '+910000000000',
        address: 'Plot 42, Knowledge Park, Vigyan Nagar, Kota, Rajasthan 324005',
        openingHours: 'Mon–Sun: 7:00 AM – 8:00 PM',
      },
      ctaText: 'WhatsApp Admission Desk',
      ctaLink: '#contact',
    },
    sections: [
      createSection('announcement', {
        text: '📢 Apex National Scholarship Cum Admission Test (ANSAT 2026) Registrations Open! Up to 90% Fee Waiver.',
        badge: 'SCHOLARSHIP TEST',
        linkText: 'Apply via WhatsApp',
        linkUrl: '#contact',
      }),
      createSection('navigation', {
        logoText: 'Apex Academy',
        links: [
          { label: 'Courses', url: '#pricing' },
          { label: 'Kota Method', url: '#features' },
          { label: 'Results', url: '#testimonials' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Admissions', url: '#contact' },
        ],
        ctaText: 'Admission Helpline',
        ctaUrl: '#contact',
      }),
      createSection('hero', {
        badge: '✦ PROVEN TOP 100 AIR RANKS YEAR AFTER YEAR',
        heading: 'Produce Your Dream All India Rank with Kota’s Top Faculty.',
        subheading: 'Intensive classroom batches, daily practice problem (DPP) sessions, and NCERT masterclasses engineered for JEE Advanced and NEET aspirants.',
        primaryBtnText: 'Explore Batch Fees',
        primaryBtnUrl: '#pricing',
        secondaryBtnText: 'WhatsApp Admission Desk',
        secondaryBtnUrl: '#contact',
      }),
      createSection('features', {
        badge: 'THE KOTA METHOD',
        heading: 'Why Serious Aspirants Choose Apex',
        items: [
          { title: 'Legendary Kota Faculty', desc: 'Mentorship by senior IIT alumni and medical doctors with 15+ years of teaching excellence.' },
          { title: 'Daily Practice Problems (DPP)', desc: 'Rigorous daily graded question sets with same-day doubt solving desks.' },
          { title: 'All-India Computer Based Tests', desc: 'Weekly simulated CBTs on exact NTA interface with detailed percentile analytics.' },
          { title: 'Personal Academic Mentor', desc: 'Dedicated mentor for every 20 students to monitor mental well-being and test scores.' },
        ],
      }),
      createSection('pricing', {
        badge: 'COURSE FEE STRUCTURE',
        heading: 'Academic Batches & Fee Tiers (₹)',
        subheading: 'Transparent fee structures with installment facilities and scholarship discounts.',
        plans: [
          { name: 'Foundation (Class 8–10)', price: '₹38,000', period: '/year', desc: 'Build rock-solid fundamentals for NTSE & Olympiads', popular: false, features: ['Maths & Science Foundations', 'Weekly Assessment Tests', 'Mental Ability Mastery', 'Study Material Kit'] },
          { name: 'Target IIT-JEE (Class 11 & 12)', price: '₹75,000', period: '/year', desc: 'Complete JEE Main & Advanced comprehensive coaching', popular: true, features: ['Full Physics, Chem & Maths', 'Daily 2-Hour Doubt Counters', '300+ Kota Mock Tests', 'Personal IITian Mentor'] },
          { name: 'NEET Conqueror (Medical)', price: '₹68,000', period: '/year', desc: 'Specialized medical entrance training', popular: false, features: ['Line-by-line NCERT Biology', 'AIIMS Doctor Masterclasses', 'High-Yield OMR Test Series', 'Hostel Assistance Available'] },
        ],
      }),
      createSection('testimonials', {
        badge: 'RANKER RESULTS',
        heading: 'Hear from Our Successful Students',
        items: [
          { quote: 'The daily DPPs and personalized doubt clearing at Apex Kota were the key reason I achieved AIR 142 in JEE Advanced.', author: 'Aarav Singhania', role: 'IIT Bombay Computer Science' },
          { quote: 'Teachers are available till 8 PM every day for doubt clearing. Apex gave me the confidence to score 695/720 in NEET.', author: 'Meera Nambiar', role: 'AIIMS New Delhi' },
        ],
      }),
      createSection('contact', {
        badge: 'ADMISSION HELPLINE',
        heading: 'Speak with Our Academic Counselors',
        subheading: 'Visit our campus in Vigyan Nagar, Kota or message us on WhatsApp for seat availability.',
      }),
      createSection('footer', {
        businessName: 'Apex IIT-JEE & NEET Academy',
        tagline: 'Kota’s Trusted Competitive Coaching Institute // Rajasthan',
      }),
    ],
  });

  // 3. Royal Saffron Chai & Mithai Cafe (Mumbai)
  const cafe = createProject({
    name: 'Royal Saffron Chai & Mithai',
    category: 'Cafe',
    description: 'Modern Indian artisanal chai, gourmet mithai, and handcrafted savory snacks with WhatsApp direct ordering.',
    theme: {
      primaryColor: '#e07a5f',    // Saffron Terracotta
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
      businessName: 'Royal Saffron Chai & Mithai',
      tagline: 'Artisanal Indian Tea Lounge & Gourmet Handcrafted Mithai',
      category: 'Cafe',
      description: 'Slow-brewed single-estate Assam and Nilgiri chais paired with pure ghee mithai and warm savory bites in Mumbai.',
      location: 'Pali Hill, Bandra West, Mumbai, Maharashtra 400050',
      contact: {
        email: 'hello@royalsaffron.in',
        phone: '+91 00000 00000',
        whatsapp: '+910000000000',
        address: 'Pali Hill, Bandra West, Mumbai, Maharashtra 400050',
        openingHours: 'Mon–Sun: 7:30 AM – 11:00 PM',
      },
      ctaText: 'WhatsApp Order',
      ctaLink: '#whatsapp',
    },
    sections: [
      createSection('announcement', {
        text: '🪔 Festive Sweets & Artisanal Tea Gift Boxes Open for Corporate & Family Pre-orders!',
        badge: 'FESTIVE HAMPERS',
        linkText: 'Order on WhatsApp',
        linkUrl: '#contact',
      }),
      createSection('navigation', {
        logoText: 'Royal Saffron',
        links: [
          { label: 'Menu', url: '#products' },
          { label: 'Our Story', url: '#about' },
          { label: 'Gift Boxes', url: '#pricing' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'WhatsApp Order',
        ctaUrl: '#contact',
      }),
      createSection('hero', {
        badge: '✦ SLOW-BREWED KASHMIRI KAHWA & DESI CHAI',
        heading: 'Authentic Indian Chai & Artisan Sweets Reimagined.',
        subheading: 'Single-estate garden teas brewed with fresh spices, paired with pure cow ghee mithai made fresh daily in Bandra.',
        primaryBtnText: 'Explore Menu in ₹',
        primaryBtnUrl: '#products',
        secondaryBtnText: 'Order via WhatsApp',
        secondaryBtnUrl: '#contact',
      }),
      createSection('products', {
        badge: 'DAILY MENU',
        heading: 'Signature Chais & Gourmet Sweets',
        subheading: 'Freshly prepared to order. Enjoy at our warm Bandra lounge or order directly on WhatsApp.',
        items: [
          { name: 'Kashmiri Saffron Kahwa', price: '₹180', desc: 'Slow-infused green tea with saffron strands, crushed almonds, and cardamom.', tag: 'Signature' },
          { name: 'Royal Kulhad Masala Chai', price: '₹120', desc: 'Strong Assam CTC boiled with freshly ground ginger, black pepper, and clove.', tag: 'Bestseller' },
          { name: 'Pistachio Anjeer Barfi Hamper', price: '₹650', desc: 'Pure organic figs, Iranian pistachios, zero refined sugar.', tag: 'Sugar-Free' },
          { name: 'Truffle Spiced Potato Samosa (2 pcs)', price: '₹160', desc: 'Flaky golden crust filled with spiced potatoes, served with tangy mint chutney.', tag: 'Hot Snack' },
        ],
      }),
      createSection('pricing', {
        badge: 'GIFT BOXES & CATERING',
        heading: 'Festive Hampers & Office Celebrations',
        subheading: 'Curated gift boxes packed in heritage velvet boxes.',
        plans: [
          { name: 'Family Celebration Box', price: '₹1,250', period: '/box', desc: 'Assorted 500g sweets + 1 tin signature chai blend', popular: true, features: ['12 pcs Gourmet Mithai', 'Assam Masala Chai Tin', 'Handwritten Greeting Card', 'Complimentary Delivery'] },
          { name: 'Executive Corporate Hamper', price: '₹2,800', period: '/box', desc: 'Premium dry fruit mithai + Kashmiri Kahwa', popular: false, features: ['1kg Kesar Dry Fruit Sweets', 'Brass Tea Strainer Included', 'Custom Brand Logo Ribbon', 'Bulk Corporate Rates Available'] },
        ],
      }),
      createSection('contact', {
        badge: 'FIND US IN BANDRA',
        heading: 'Visit Us or Place a Quick WhatsApp Order',
        subheading: 'Drop by for warm evening chai or get sweets delivered to your doorstep in minutes.',
      }),
      createSection('footer', {
        businessName: 'Royal Saffron Chai & Mithai',
        tagline: 'Artisanal Indian Tea Lounge & Handcrafted Sweets // Mumbai',
      }),
    ],
  });

  // 4. VyaparAI Cloud Platform (Bengaluru)
  const saas = createProject({
    name: 'VyaparAI Cloud Platform',
    category: 'Tech Startup',
    description: 'Autonomous GST e-invoicing, inventory sync, and UPI reconciliation engine for modern Indian businesses and tech startups.',
    theme: {
      primaryColor: '#8b5cf6',    // Deep Violet & Cyan
      secondaryColor: '#06b6d4',
      accentColor: '#ec4899',
      bgColor: '#07080d',
      surfaceColor: '#0f1320',
      textColor: '#f8fafc',
      fontHeading: 'Space Grotesk',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: '12px',
    },
    brand: {
      businessName: 'VyaparAI Cloud Platform',
      tagline: 'Next-Gen Automated GST Invoicing & Supply Chain SaaS for India',
      category: 'Tech Startup',
      description: 'Engineered specifically for Indian MSMEs, D2C brands, and tech startups with instant UPI autopay, E-way bill generation, and WhatsApp receipts.',
      location: '100ft Road, Indiranagar, Bengaluru, Karnataka 560038',
      contact: {
        email: 'sales@vyaparai.in',
        phone: '+91 00000 00000',
        whatsapp: '+910000000000',
        address: '742, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
        openingHours: '24/7 Cloud Engine // Mon–Fri Office Support',
      },
      ctaText: 'Start 14-Day Free Trial',
      ctaLink: '#pricing',
    },
    sections: [
      createSection('navigation', {
        logoText: 'VyaparAI',
        links: [
          { label: 'Capabilities', url: '#features' },
          { label: 'Pricing (₹)', url: '#pricing' },
          { label: 'Indian Businesses', url: '#testimonials' },
          { label: 'Docs & GST', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        ctaText: 'Start Free Trial',
        ctaUrl: '#pricing',
      }),
      createSection('hero', {
        badge: '✦ TRUSTED BY 5,000+ INDIAN ENTERPRISES & STARTUPS',
        heading: 'Automate Indian Invoicing & GST Compliance at Lightning Speed.',
        subheading: 'Generate IRN e-invoices in 200 milliseconds, auto-reconcile GSTR-2B, and send instant WhatsApp payment links with UPI QR codes.',
        primaryBtnText: 'Start 14-Day Free Trial',
        primaryBtnUrl: '#pricing',
        secondaryBtnText: 'Book Founder Demo',
        secondaryBtnUrl: '#contact',
      }),
      createSection('features', {
        badge: 'BUILT FOR INDIAN TAXATION',
        heading: 'Features Tailored for Indian Commerce',
        items: [
          { title: 'Sub-200ms E-Invoice & E-Way Bill', desc: 'Direct GSP API integration with NIC portal for instant IRN generation.' },
          { title: '1-Click WhatsApp Invoices', desc: 'Automatically dispatch PDF invoices and payment reminders via official WhatsApp Business API.' },
          { title: 'UPI & Payment Gateway Sync', desc: 'Reconcile Razorpay, Cashfree, and bank UPI accounts automatically with zero discrepancies.' },
          { title: 'Tally & Zoho Native Sync', desc: 'Two-way synchronization with Tally Prime and ERP systems without manual data entry.' },
        ],
      }),
      createSection('pricing', {
        badge: 'PREDICTABLE RUPEE PLANS',
        heading: 'Scale Your Business Without Hidden Fees',
        subheading: 'Clear monthly and annual plans in Indian Rupees with full GST credit.',
        plans: [
          { name: 'Startup Tier', price: '₹499', period: '/month', desc: 'For growing independent retailers and small businesses', popular: false, features: ['Up to 500 GST Invoices/mo', 'Instant UPI QR Code Generator', 'E-Way Bill Generation', 'Email & Chat Support'] },
          { name: 'Growth Business', price: '₹1,499', period: '/month', desc: 'For scaling wholesalers, D2C brands and manufacturers', popular: true, features: ['Unlimited GST Invoices', 'WhatsApp Automation Suite', 'Tally & Zoho Two-Way Sync', 'GSTR-2B Auto-Reconciliation', 'Multi-User Access (5 seats)'] },
          { name: 'Enterprise Pro', price: '₹4,999', period: '/month', desc: 'For multi-branch enterprises and high-volume startups', popular: false, features: ['Unlimited Invoices & Branches', 'Dedicated GST Account Lead', 'Custom REST Webhooks', '99.95% Uptime SLA', 'Priority WhatsApp Helpline'] },
        ],
      }),
      createSection('testimonials', {
        badge: 'FOUNDER STORIES',
        heading: 'What Indian Business Leaders Say',
        items: [
          { quote: 'VyaparAI reduced our monthly GST reconciliation time from 3 days to literally 10 minutes. The WhatsApp invoicing feature is a hit with our retail distributors.', author: 'Aditya Mehta', role: 'Founder, Zest D2C Logistics' },
          { quote: 'Best billing software built for Indian MSMEs. The UPI QR code on invoices boosted our on-time payment collections by 40%.', author: 'Vikram Joshi', role: 'Managing Director, Apex Steel Industries' },
        ],
      }),
      createSection('contact', {
        badge: 'ENTERPRISE SALES',
        heading: 'Talk to Our Bengaluru Solutions Team',
        subheading: 'Need custom ERP integration or high-volume API benchmarks? Chat with our engineers.',
      }),
      createSection('footer', {
        businessName: 'VyaparAI Cloud Platform',
        tagline: 'Autonomous GST E-Invoicing & Supply Chain SaaS // Bengaluru',
      }),
    ],
  });

  return [sareeShop, coachingAcademy, cafe, saas];
}

