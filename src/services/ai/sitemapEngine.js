/**
 * Klyvora Studio — Information Architecture & Sitemap Engine
 * Creates intentional, industry-calibrated sitemaps and section sequences.
 * Prevents forced identical templates and ensures section selection matches business logic.
 */

import { INDUSTRY_TYPES } from './businessContextEngine.js';

/**
 * Returns the curated section sequence and navigation plan for a given WebsiteContext
 */
export function planWebsiteArchitecture(context) {
  const { industry, brandName, callsToAction } = context;

  switch (industry) {
    case INDUSTRY_TYPES.SAAS:
      return {
        navLinks: [
          { label: 'Platform', url: '#platform' },
          { label: 'Metrics', url: '#stats' },
          { label: 'Features', url: '#features' },
          { label: 'Architecture', url: '#services' },
          { label: 'Capabilities', url: '#products' },
          { label: 'Testimonials', url: '#testimonials' },
          { label: 'Pricing', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        navCTA: callsToAction.primary.label,
        navCTAUrl: callsToAction.primary.targetUrl,
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // Quantitative metrics & performance scale
          'features',       // Core capabilities & specs
          'services',       // Autonomous workflow architecture
          'products',       // Modular platform APIs & tools
          'about',          // Engineering standard & mission
          'testimonials',   // Enterprise tech leaders & CTOs
          'pricing',        // Cloud tiers with API limits
          'faq',            // Security, SOC2 & integration questions
          'cta_banner',     // Pre-footer high-impact conversion card
          'contact',        // Book live demo & enterprise sales
          'footer',
        ],
        heroBadge: '✦ NEXT-GEN AUTONOMOUS ENTERPRISE PLATFORM',
        heroHeading: `${brandName} — Autonomous AI Automation for High-Growth Teams.`,
        heroSubheading: `Deploy self-improving AI workflows that connect to your database, automate customer inquiries, and reduce operational bottlenecks in real time.`,
        trustBadge: '✦ SOC-2 TYPE II CERTIFIED & 99.99% UPTIME SLA',
        chipText: 'AUTONOMOUS WORKFLOWS',
        stats: [
          { value: '99.99%', label: 'Platform Availability' },
          { value: '<12ms', label: 'Average Pipeline Latency' },
          { value: '4.8x', label: 'Operational Speedup' },
          { value: '250K+', label: 'Automations Executed' },
        ],
        featuresBadge: 'CORE ARCHITECTURE',
        featuresHeading: 'Engineered for Mission-Critical Reliability & Low Latency',
        productsBadge: 'PLATFORM CAPABILITIES',
        productsHeading: 'Autonomous Agent Pipelines & Cloud APIs',
        pricingBadge: 'PREDICTABLE CLOUD TIERS',
        pricingHeading: 'Flexible Cloud Subscriptions in ₹',
        faqBadge: 'SECURITY & INTEGRATIONS',
        faqHeading: 'Frequently Asked Questions About Platform Architecture',
      };

    case INDUSTRY_TYPES.RESTAURANT:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Menu', url: '#products' },
          { label: 'Our Story', url: '#about' },
          { label: 'The Experience', url: '#features' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Tasting Courses', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Reservations', url: '#contact' },
        ],
        navCTA: 'Reserve Table',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // Sourcing & patron metrics
          'products',       // Signature dishes / tasting menu
          'about',          // Chef heritage & farm sourcing
          'features',       // Dining ambiance & hospitality standards
          'testimonials',   // Food critics & regulars
          'pricing',        // Tasting banquet packages
          'faq',            // Dietary options, dress code, reservations
          'cta_banner',     // Pre-footer reservation CTA
          'contact',        // Table booking, hours, valet
          'footer',
        ],
        heroBadge: '✦ ARTISANAL CULINARY EXCELLENCE',
        heroHeading: `Where Authentic Flavors Meet Uncompromising Craft.`,
        heroSubheading: `Indulge in seasonal master recipes, farm-to-table provisions, and slow-cooked culinary traditions curated by our master chefs.`,
        trustBadge: '✦ MICHELIN GUIDED HERITAGE 2026',
        chipText: 'ARTISANAL DINING',
        stats: [
          { value: '100%', label: 'Farm-Fresh Sourcing' },
          { value: '35+', label: 'Signature Heritage Recipes' },
          { value: '4.9★', label: 'Over 2,400 Verified Reviews' },
          { value: '18+', label: 'Years Culinary Provenance' },
        ],
        featuresBadge: 'THE EXPERIENCE',
        featuresHeading: 'Hospitality Refined to the Highest Standard',
        productsBadge: 'SIGNATURE MENU',
        productsHeading: 'Chef Curated Selections & Tasting Provisions',
        pricingBadge: 'TASTING COURSES',
        pricingHeading: 'Chef Banquet & Private Dining Packages in ₹',
        faqBadge: 'VISITOR INQUIRIES',
        faqHeading: 'Reservations, Dietary Options & Hours',
      };

    case INDUSTRY_TYPES.AGENCY:
      return {
        navLinks: [
          { label: 'Work', url: '#products' },
          { label: 'Metrics', url: '#stats' },
          { label: 'Capabilities', url: '#features' },
          { label: 'Philosophy', url: '#about' },
          { label: 'Results', url: '#testimonials' },
          { label: 'Retainers', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        navCTA: 'Get Proposal',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // Client funding & growth metrics
          'products',       // Selected case studies & work
          'services',       // Specialized studio capabilities & retainers
          'features',       // Studio disciplines (brand, UI, motion)
          'about',          // Studio manifesto & multidisciplinary craft
          'testimonials',   // Founder & CMO endorsements
          'pricing',        // Sprint retainers & project tiers
          'faq',            // Timelines, scope & deliverables
          'cta_banner',     // Proposal kickoff card
          'contact',        // Project brief submission form
          'footer',
        ],
        heroBadge: '✦ AWARD-WINNING BRAND & DIGITAL STUDIO',
        heroHeading: `We Design Transformative Digital Products That Dominate Markets.`,
        heroSubheading: `From high-conviction brand identities to scalable web applications, we partner with ambitious founders to build products people obsess over.`,
        trustBadge: '✦ RED DOT & AWWARDS RECOGNIZED',
        chipText: 'DIGITAL PRODUCT STUDIO',
        stats: [
          { value: '$120M+', label: 'Client Venture Capital Raised' },
          { value: '48+', label: 'Global Design Honors' },
          { value: '3.8x', label: 'Average User Retention Lift' },
          { value: '100%', label: 'On-Time Sprint Delivery' },
        ],
        featuresBadge: 'STUDIO DISCIPLINES',
        featuresHeading: 'Full-Spectrum Strategy, Design & Engineering',
        productsBadge: 'SELECTED WORK',
        productsHeading: 'Recent Product Launches & Brand Transformations',
        pricingBadge: 'ENGAGEMENT MODELS',
        pricingHeading: 'Transparent Design Sprints & Retainers in ₹',
        faqBadge: 'WORKING WITH US',
        faqHeading: 'Engagement Timelines & Collaboration Scope',
      };

    case INDUSTRY_TYPES.RETAIL:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Collection', url: '#products' },
          { label: 'Heritage', url: '#about' },
          { label: 'Why Us', url: '#features' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Festive Sets', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        navCTA: 'WhatsApp Order',
        navCTAUrl: '#whatsapp',
        sectionSequence: [
          'announcement',
          'navigation',
          'hero',
          'stats',          // Artisan weavers & patron metrics
          'products',       // Signature handloom collection
          'about',          // Generational master weavers & pure zari
          'features',       // Silk Mark purity & COD delivery
          'testimonials',   // Brides & families
          'pricing',        // Bridal & festive sets
          'faq',            // COD, shipping, video shopping
          'cta_banner',     // Instant order & video shopping banner
          'contact',        // Store address, hours, WhatsApp
          'footer',
        ],
        heroBadge: '✦ AUTHENTIC HANDCRAFTED HERITAGE',
        heroHeading: `Timeless Pure Silks & Handcrafted Zari Heirlooms.`,
        heroSubheading: `Direct from master weavers. Certified 100% pure silk drapes and heritage bridal ensembles crafted to be cherished across generations.`,
        trustBadge: '✦ 100% CERTIFIED SILK MARK PURITY',
        chipText: 'GENUINE HANDLOOM WEAVES',
        stats: [
          { value: '100%', label: 'Certified Pure Mulberry Silk' },
          { value: '450+', label: 'Generational Artisan Weavers' },
          { value: '35,000+', label: 'Delighted Brides & Families' },
          { value: 'Pan-India', label: 'Insured Doorstep Delivery' },
        ],
        featuresBadge: 'AUTHENTICITY GUARANTEED',
        featuresHeading: 'Honest Craftsmanship & Certified Quality',
        productsBadge: 'FEATURED CATALOG',
        productsHeading: 'Masterpiece Drapes & Festive Selections',
        pricingBadge: 'FESTIVE ENSEMBLES',
        pricingHeading: 'Curated Bridal & Festive Sets in ₹',
        faqBadge: 'SHOPPING ASSISTANCE',
        faqHeading: 'Orders, WhatsApp Video Shopping & Pan-India COD',
      };

    case INDUSTRY_TYPES.HEALTHCARE:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Treatments', url: '#services' },
          { label: 'About Doctor', url: '#about' },
          { label: 'Safety Protocols', url: '#features' },
          { label: 'Patient Reviews', url: '#testimonials' },
          { label: 'Care Fees', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        navCTA: 'Book Appointment',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // Smiles restored & patient ratings
          'services',       // Specialized treatments
          'about',          // Doctor credentials & gentle philosophy
          'features',       // 5-tier sterilization & German 3D tech
          'testimonials',   // Patient smile stories
          'pricing',        // Transparent care plans & checkups
          'faq',            // Insurance, emergency, painless care
          'cta_banner',     // Instant booking & consultation banner
          'contact',        // Clinic location, appointment form
          'footer',
        ],
        heroBadge: '✦ CERTIFIED CLINICAL EXCELLENCE',
        heroHeading: `Advanced Multispecialty Care for Confident, Painless Smiles.`,
        heroSubheading: `Computerized anesthesia, German 3D digital intraoral scanners, and compassionate specialists ensuring your treatment is completely comfortable.`,
        trustBadge: '✦ NABH ACCREDITED & GERMAN 3D TECH',
        chipText: 'PAINLESS CARE PROTOCOL',
        stats: [
          { value: '15,000+', label: 'Smiles Restored' },
          { value: '100%', label: 'Painless Gentle Guarantee' },
          { value: '5-Tier', label: 'Hospital Sterilization Standard' },
          { value: '4.95★', label: 'Google Patient Satisfaction' },
        ],
        featuresBadge: 'CLINICAL STANDARDS',
        featuresHeading: 'Strict 5-Tier Sterilization & Modern Digital Diagnostics',
        productsBadge: 'CLINICAL PROCEDURES',
        productsHeading: 'Specialized Treatments & Gentle Protocols',
        pricingBadge: 'TRANSPARENT CARE',
        pricingHeading: 'Preventive Care & Treatment Packages in ₹',
        faqBadge: 'PATIENT GUIDE',
        faqHeading: 'Insurance, Appointments & Pain-Free Care',
      };

    case INDUSTRY_TYPES.PORTFOLIO:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Projects', url: '#products' },
          { label: 'Tech Stack', url: '#features' },
          { label: 'About', url: '#about' },
          { label: 'Recommendations', url: '#testimonials' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        navCTA: 'Download CV',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // System throughput & OSS downloads
          'products',       // Selected open source & production apps
          'features',       // Technical competencies & systems
          'about',          // Engineering background & philosophy
          'testimonials',   // Peer & leadership recommendations
          'pricing',        // Advisory & consulting retainers
          'faq',            // Availability & advisory scope
          'cta_banner',     // Advisory kickoff banner
          'contact',        // Reach out directly
          'footer',
        ],
        heroBadge: '✦ SENIOR FULL-STACK SYSTEMS ARCHITECT',
        heroHeading: `Architecting Resilient Distributed Systems & High-Impact Interfaces.`,
        heroSubheading: `Specializing in high-throughput cloud backends, micro-frontends, and developer infrastructure with clean, maintainable code.`,
        trustBadge: '✦ FORMER LEAD ARCHITECT & OSS AUTHOR',
        chipText: '100K+ REQ/SEC SCALE',
        stats: [
          { value: '8+ Yrs', label: 'Full-Stack Systems Engineering' },
          { value: '100K+', label: 'Events/Sec Throughput' },
          { value: '15M+', label: 'Open-Source NPM Downloads' },
          { value: '99.99%', label: 'Production Uptime Track Record' },
        ],
        featuresBadge: 'TECHNICAL ARSENAL',
        featuresHeading: 'Core Competencies & Engineering Specializations',
        productsBadge: 'SELECTED SYSTEMS',
        productsHeading: 'Featured Open Source & Commercial Projects',
        pricingBadge: 'ADVISORY ENGAGEMENTS',
        pricingHeading: 'Technical Consulting & System Architecture Retainers in ₹',
        faqBadge: 'AVAILABILITY & ENGAGEMENT',
        faqHeading: 'Advisory Roles, Contract Engagements & Timelines',
      };

    case INDUSTRY_TYPES.EDUCATION:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Batches', url: '#products' },
          { label: 'Faculty', url: '#about' },
          { label: 'Methodology', url: '#features' },
          { label: 'Rankers', url: '#testimonials' },
          { label: 'Fee Structure', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Admission', url: '#contact' },
        ],
        navCTA: 'Apply for Admission',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // Rankers & percentile statistics
          'products',       // Batches & target programs
          'about',          // Proven methodology & Kota top faculty
          'features',       // Daily Practice Problems & AI Rank Analytics
          'testimonials',   // Top 100 AIR rankers & parents
          'pricing',        // Fee structure for classroom & residential
          'faq',            // Talent search exams, bridge courses
          'cta_banner',     // Scholarship & admission card
          'contact',        // Admission inquiry & campus visit
          'footer',
        ],
        heroBadge: '✦ ADMISSIONS OPEN FOR 2026-27 SESSIONS',
        heroHeading: `Turn Your Dream of Top 100 AIR Ranks into Tangible Reality.`,
        heroSubheading: `Intensive classroom coaching by veteran educators with 1-on-1 doubt clearing, daily problem sheets, and national benchmarking.`,
        trustBadge: '✦ 35+ AIR TOP 100 RANKS IN JEE/NEET',
        chipText: '1-ON-1 FACULTY MENTORSHIP',
        stats: [
          { value: '98.4%', label: 'Class Selection Rate' },
          { value: '35+', label: 'AIR Top 100 Rankers' },
          { value: '25+ Yrs', label: 'Faculty Teaching Experience' },
          { value: '1:12', label: 'Mentor-to-Student Ratio' },
        ],
        featuresBadge: 'ACADEMIC RIGOR',
        featuresHeading: 'Proven Methodology Delivering Top National Percentiles',
        productsBadge: 'TARGET PROGRAMS',
        productsHeading: 'Classroom, Online & Residential Batches',
        pricingBadge: 'FEE STRUCTURE',
        pricingHeading: 'Annual Tuition & Scholarship Tiers in ₹',
        faqBadge: 'ADMISSION GUIDELINES',
        faqHeading: 'Scholarship Tests, Batches & Hostel Facilities',
      };

    case INDUSTRY_TYPES.SALON:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Services', url: '#products' },
          { label: 'Experience', url: '#features' },
          { label: 'Our Stylists', url: '#about' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Packages', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Book Chair', url: '#contact' },
        ],
        navCTA: 'Book Appointment',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',          // Client transformations & organic products
          'products',       // Curated hair, color & aesthetic services
          'features',       // Clean botanicals, master stylists, private suites
          'about',          // The studio ethos & master colorist pedigree
          'testimonials',   // Verified clients & bridal experiences
          'pricing',        // Signature service tiers & bridal packages
          'faq',            // Consultations, patch tests, appointments
          'cta_banner',     // Instant booking & appointment card
          'contact',        // Booking inquiry & lounge location
          'footer',
        ],
        heroBadge: '✦ BESPOKE HAIR ARTISTRY & LUXURY AESTHETICS',
        heroHeading: `${brandName} — Transformational Hair & Skin Rituals.`,
        heroSubheading: `Indulge in personalized balayage, botanical scalp therapy, and master hair design crafted to elevate your natural radiance.`,
        trustBadge: '✦ L’ORÉAL PROFESSIONAL COLOR MASTERS',
        chipText: 'BOTANICAL BOND RESTORATION',
        stats: [
          { value: '12,000+', label: 'Client Makeovers Completed' },
          { value: '100%', label: 'Ammonia-Free Organic Formulas' },
          { value: '15+', label: 'European Trained Master Stylists' },
          { value: '4.95★', label: 'Verified Patron Satisfaction' },
        ],
        featuresBadge: 'THE SALON EXPERIENCE',
        featuresHeading: 'Crafted for Distinction, Comfort & Radiance',
        productsBadge: 'SIGNATURE SERVICES',
        productsHeading: 'Curated Hair, Skin & Wellness Rituals',
        pricingBadge: 'SERVICE PACKAGES',
        pricingHeading: 'Transparent Salon Tiers & Bridal Experiences in ₹',
        faqBadge: 'VISIT GUIDELINES',
        faqHeading: 'Frequently Asked Questions About Appointments',
      };

    default:
      return {
        navLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Offerings', url: '#products' },
          { label: 'About', url: '#about' },
          { label: 'Reviews', url: '#testimonials' },
          { label: 'Pricing', url: '#pricing' },
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        navCTA: 'Get in Touch',
        navCTAUrl: '#contact',
        sectionSequence: [
          'navigation',
          'hero',
          'stats',
          'about',
          'features',
          'products',
          'testimonials',
          'pricing',
          'faq',
          'cta_banner',
          'contact',
          'footer',
        ],
        heroBadge: '✦ PREMIER DISTINCTION',
        heroHeading: `${brandName} — Crafted with Purpose.`,
        heroSubheading: `Engineered with precision, authentic materials, and uncompromising standards to elevate your experience.`,
        trustBadge: '✦ VERIFIED BENCHMARK STANDARD',
        chipText: 'PREMIER EXCELLENCE',
        stats: [
          { value: '99.9%', label: 'Client Satisfaction' },
          { value: '10+', label: 'Years Experience' },
          { value: '5,000+', label: 'Satisfied Patrons' },
          { value: '24/7', label: 'Dedicated Support' },
        ],
        featuresBadge: 'OUR STANDARDS',
        featuresHeading: 'Engineered for Discerning Standards',
        productsBadge: 'SIGNATURE OFFERINGS',
        productsHeading: 'Curated Solutions for Our Patrons & Clients',
        pricingBadge: 'TRANSPARENT PLANS',
        pricingHeading: 'Straightforward Engagements in ₹',
        faqBadge: 'COMMON INQUIRIES',
        faqHeading: 'Frequently Asked Questions',
      };
  }
}

export const generateSiteArchitecture = planWebsiteArchitecture;
