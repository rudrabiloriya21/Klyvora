/**
 * Klyvora Studio — Business Context Engine
 * Converts natural-language user prompts into a structured, unified WebsiteContext.
 * Acts as the single source of truth across the entire generation & validation pipeline.
 */

export const INDUSTRY_TYPES = {
  SAAS: 'saas',
  RESTAURANT: 'restaurant',
  AGENCY: 'agency',
  RETAIL: 'retail',
  HEALTHCARE: 'healthcare',
  EDUCATION: 'education',
  FITNESS: 'fitness',
  PORTFOLIO: 'portfolio',
  SALON: 'salon',
  GENERAL: 'general',
};

/**
 * Words that are strictly prohibited for an industry to prevent cross-industry hallucination/drift.
 */
export const PROHIBITED_TERMS_BY_INDUSTRY = {
  [INDUSTRY_TYPES.SAAS]: [
    'saree', 'sourdough', 'mithai', 'bakery', 'dentist', 'dental', 'clinic', 'clinical', 'patient',
    'root canal', 'doctor', 'bread', 'ladoo', 'pastry', 'dum pukht', 'biryani', 'salon',
    'facial', 'hotel', 'spa', 'massage', 'yoga mat', 'haircut', 'thali', 'khana', 'dukan',
    'trousseau', 'silk mark', 'banarasi', 'kanjeevaram', 'zari', 'apparel', 'lehenga',
  ],
  [INDUSTRY_TYPES.RESTAURANT]: [
    'saas', 'software', 'cloud api', 'kubernetes', 'devops', 'pull request', 'microservices',
    'root canal', 'dentist', 'clinic', 'patient', 'saree', 'coaching institute', 'iit-jee',
    'neet test series', 'firmware', 'sdk', 'telemetry',
  ],
  [INDUSTRY_TYPES.AGENCY]: [
    'sourdough', 'dentist', 'root canal', 'patient', 'saree', 'biryani', 'ladoo',
    'dum pukht', 'mithai', 'bread', 'bakery', 'hospital', 'clinical care', 'pastry',
  ],
  [INDUSTRY_TYPES.HEALTHCARE]: [
    'sourdough', 'mithai', 'saree', 'biryani', 'ladoo', 'pastry', 'bakery', 'bread',
    'saas api', 'cloud infrastructure', 'b2b telemetry', 'lehenga', 'handloom',
  ],
  [INDUSTRY_TYPES.RETAIL]: [
    'root canal', 'dentist', 'patient', 'hospital', 'cloud telemetry', 'devops',
    'saas api', 'clinical care', 'doctor consultation', 'surgery',
  ],
  [INDUSTRY_TYPES.EDUCATION]: [
    'sourdough', 'dentist', 'root canal', 'patient', 'biryani', 'bakery', 'saree boutique',
    'dum pukht', 'cocktail', 'pub', 'bar',
  ],
  [INDUSTRY_TYPES.PORTFOLIO]: [
    'sourdough', 'dentist', 'root canal', 'patient', 'saree', 'biryani', 'bakery',
    'mithai', 'hospital', 'dum pukht',
  ],
  [INDUSTRY_TYPES.FITNESS]: [
    'root canal', 'dentist', 'patient', 'saree', 'biryani', 'mithai', 'sourdough',
    'software api', 'devops',
  ],
  [INDUSTRY_TYPES.SALON]: [
    'sourdough', 'dentist', 'root canal', 'saas api', 'cloud infrastructure', 'devops',
    'mithai', 'biryani', 'bakery', 'hospital', 'iit-jee', 'neet',
  ],
  [INDUSTRY_TYPES.GENERAL]: [],
};

/**
 * High-affinity vocabulary that belongs to each industry
 */
export const INDUSTRY_VOCABULARY = {
  [INDUSTRY_TYPES.SAAS]: [
    'automation', 'ai agents', 'workflows', 'cloud platform', 'api', 'analytics',
    'dashboard', 'integrations', 'security', 'scalability', 'enterprise', 'real-time',
    'developer tools', 'data pipelines', 'b2b', 'speed', 'efficiency',
  ],
  [INDUSTRY_TYPES.RESTAURANT]: [
    'culinary', 'tasting menu', 'artisan', 'fresh ingredients', 'chef', 'signature dishes',
    'dining', 'ambiance', 'table reservation', 'gourmet', 'flavors', 'slow-cooked',
    'farm-to-table', 'heritage recipes',
  ],
  [INDUSTRY_TYPES.AGENCY]: [
    'brand strategy', 'digital products', 'design systems', 'creative direction',
    'case studies', 'visual identity', 'development', 'client growth', 'sprint',
    'portfolio', 'user experience', 'campaigns',
  ],
  [INDUSTRY_TYPES.RETAIL]: [
    'handcrafted', 'heritage', 'collection', 'artisan', 'pure silk', 'certified purity',
    'festive wear', 'catalog', 'whatsapp order', 'express delivery', 'traditional craft',
    'gift hampers', 'patron favorites',
  ],
  [INDUSTRY_TYPES.HEALTHCARE]: [
    'clinical excellence', 'gentle care', 'specialized treatments', 'sterilization',
    'preventive care', 'digital intraoral scanner', 'painless procedures', 'expert doctors',
    'patient comfort', 'hygiene protocols', 'consultations',
  ],
  [INDUSTRY_TYPES.EDUCATION]: [
    'admissions', 'comprehensive batches', 'mentorship', 'study material',
    'practice problems', 'mock tests', 'doubt clearing', 'experienced faculty',
    'percentile', 'structured curriculum', 'rank booster',
  ],
  [INDUSTRY_TYPES.PORTFOLIO]: [
    'full-stack engineering', 'distributed systems', 'open source', 'system architecture',
    'web development', 'clean code', 'user interfaces', 'projects', 'tech stack',
    'experience', 'resume',
  ],
  [INDUSTRY_TYPES.SALON]: [
    'hairstyling', 'balayage', 'botanical hair care', 'aesthetic treatments', 'scalp therapy',
    'blowout', 'colorist', 'bridal styling', 'consultation', 'appointments', 'salon lounge',
  ],
  [INDUSTRY_TYPES.FITNESS]: [
    'strength & conditioning', 'yoga shala', 'breathwork', 'holistic wellness',
    'personal training', 'posture analysis', 'endurance', 'mind-body balance',
    'certified coaches', 'trial session',
  ],
  [INDUSTRY_TYPES.GENERAL]: [
    'quality', 'excellence', 'dedicated service', 'customer satisfaction', 'reliability',
  ],
};

/**
 * Extracts clean, authentic brand name from natural-language user prompt.
 * Handles patterns like "named X", "called X", "for X, an AI...", "X — ...", quotes, and CamelCase.
 */
export function extractBrandName(prompt, inferredIndustry = null) {
  if (!prompt || typeof prompt !== 'string') return 'Nova Digital Studio';

  const clean = prompt.trim();

  // 1. Quoted brand name: "OrbitPulse" or 'SmileCraft' or “Luxe Mane”
  const quoteMatch = clean.match(/["'“]([^"'”]{2,35})["'”]/);
  if (quoteMatch && quoteMatch[1]) {
    const candidate = quoteMatch[1].trim();
    const blacklist = ['modern', 'website', 'landing page', 'homepage', 'portfolio', 'clean', 'minimal'];
    if (!blacklist.includes(candidate.toLowerCase())) {
      return candidate;
    }
  }

  // 2. Explicit naming markers: "named X", "called X", "titled X", "brand named X", "name is X"
  const namedMatch = clean.match(/(?:named|called|titled|brand(?:ed)?\s+as|brand(?:ed)?\s+named?|name\s+is)\s+["'“]?([\p{L}\p{N}&'.-]+(?:\s+[\p{L}\p{N}&'.-]+){0,2})["'”]?(?:[.,\s]|$)/iu);
  if (namedMatch && namedMatch[1]) {
    const candidate = namedMatch[1].trim();
    if (candidate.length > 1 && !/^(a|an|the|my|our)$/i.test(candidate)) {
      return candidate;
    }
  }

  // 3. Prefix delimiter pattern: "NEXORA — AI automation platform" or "OrbitPulse: Next-gen..." or "Matsu | Omakase"
  const prefixMatch = clean.match(/^([\p{L}\p{N}&'.-]{2,30})\s*(?:[-:—|]\s+)/iu);
  if (prefixMatch && prefixMatch[1]) {
    const candidate = prefixMatch[1].trim();
    const commonVerbs = ['create', 'make', 'build', 'website', 'a', 'an', 'the', 'design', 'generate', 'develop'];
    if (!commonVerbs.includes(candidate.toLowerCase())) {
      return candidate;
    }
  }

  // 4. "Build a website for [Brand], a/an [industry]..." or "Website for [Brand]"
  const forMatch = clean.match(/(?:website|site|landing\s+page|platform)\s+for\s+([\p{L}\p{N}&'.-]+(?:\s+[\p{L}\p{N}&'.-]+){0,2})(?:,\s*(?:a|an|the|which|in)|[.,]|$)/iu);
  if (forMatch && forMatch[1]) {
    const candidate = forMatch[1].trim();
    const genericTerms = ['my business', 'a company', 'our team', 'local business', 'a startup', 'clients'];
    if (!genericTerms.includes(candidate.toLowerCase()) && candidate.length > 2) {
      return candidate;
    }
  }

  // 5. CamelCase / PascalCase company name anywhere in the prompt (e.g. OrbitPulse, CloudScale, LuxeAura, DevPulse)
  const camelMatch = clean.match(/\b([A-Z][a-z0-9]+[A-Z][A-Za-z0-9]+)\b/);
  if (camelMatch && camelMatch[1]) {
    return camelMatch[1].trim();
  }

  // 6. Action verb stripping heuristic:
  // e.g. "Create a website for Matsu Japanese Restaurant" -> "Matsu"
  const stripped = clean
    .replace(/^(?:please\s+)?(?:create|build|make|design|generate|develop)?\s*(?:(?:a|an)\s+)?(?:modern|new|premier|luxury|professional|clean|minimal|cutting-edge|bespoke|stunning)?\s*(?:website|landing\s+page|web\s+page|app|platform)?\s*(?:for|about)?\s*/i, '')
    .trim();

  if (stripped.length > 0) {
    const candidate = stripped.split(/\s*(?:[-:—|,]|\s+(?:is\s+a|for|with|offering|specializing|located)\s+)/i)[0].trim();
    let words = candidate.split(/\s+/).slice(0, 3);
    let result = words.join(' ');
    if (words.length >= 2) {
      result = result.replace(/\s+(?:developer|portfolio|engineer|architect|ai|saas|software|app|platform)$/i, '').trim();
    }
    const isTooGeneric = /^(restaurant|saas|software|agency|clinic|salon|shop|store|company|business|portfolio)$/i.test(result);
    if (!isTooGeneric && result.length >= 2 && result.length <= 30) {
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
  }

  // 7. Contextual fallback based on industry
  const ind = inferredIndustry || detectIndustry(prompt);
  switch (ind) {
    case INDUSTRY_TYPES.SAAS: return 'Nova Automation';
    case INDUSTRY_TYPES.RESTAURANT: return 'The Artisan Table';
    case INDUSTRY_TYPES.SALON: return 'Luxe Aura Studio';
    case INDUSTRY_TYPES.AGENCY: return 'Vanguard Creative Labs';
    case INDUSTRY_TYPES.PORTFOLIO: return 'Alex Rivera';
    case INDUSTRY_TYPES.HEALTHCARE: return 'AuraCare Health';
    case INDUSTRY_TYPES.RETAIL: return 'Heritage Collective';
    default: return 'Klyvora Digital Studio';
  }
}

/**
 * Determines exact industry type with strict regex boundary matching
 */
export function detectIndustry(prompt, category = '') {
  const text = `${prompt} ${category}`.toLowerCase();

  // 1. Personal Portfolio / Developer / Designer Portfolio / Resume (Checked first so tech portfolios don't misclassify as SaaS)
  if (
    /\b(portfolio|resume|cv|personal site|personal website|developer portfolio|designer portfolio|freelancer portfolio)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.PORTFOLIO;
  }

  // 2. SaaS / Cloud / Tech / AI platform / Developer tools
  if (
    /\b(ai|ml|saas|api|apis|cloud|software|platform|automation|telemetry|cyber|fintech|b2b|data engine|vector|agent|agents|devops|backend)\b/i.test(text) ||
    text.includes('automation platform') ||
    text.includes('ai platform') ||
    text.includes('developer tool')
  ) {
    return INDUSTRY_TYPES.SAAS;
  }

  // 2. Restaurant / Dining / Cafe / Bakery / Food
  if (
    /\b(restaurant|dining|cafe|coffee|sushi|bakes|bakery|dawat|biryani|kitchen|bar|pub|menu|dishes|chef|cuisine|eatery|culinary|food)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.RESTAURANT;
  }

  // 3. Clinic / Dental / Healthcare / Doctor / Medical
  if (
    /\b(clinic|dental|dentist|doctor|hospital|healthcare|physio|ayurved|derma|medical|implant|pediatric|ortho|teeth|smile care)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.HEALTHCARE;
  }

  // 4. Retail / Saree / Fashion / Boutique / Kirana / Jewelry / Sweets
  if (
    /\b(saree|boutique|fashion|clothing|apparel|jewel|jewelry|mithai|sweets|kirana|dukan|store|shop|handloom|silk|retail|drapes|handicraft)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.RETAIL;
  }

  // 5. Agency / Design Studio / Marketing / Consulting
  if (
    /\b(agency|consulting|marketing|design studio|creative agency|branding|growth agency|digital studio|production house)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.AGENCY;
  }

  // 6. Education / Coaching / Institute / Academy
  if (
    /\b(coaching|institute|academy|tuition|classes|school|college|iit|jee|neet|gate|upsc|student|curriculum|batches|rankers)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.EDUCATION;
  }

  // 7. Personal Portfolio / Developer / Designer Portfolio
  if (
    /\b(portfolio|resume|cv|personal site|developer portfolio|designer portfolio|freelancer portfolio)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.PORTFOLIO;
  }

  // 8. Fitness / Gym / Yoga / Wellness
  if (
    /\b(fitness|gym|yoga|pilates|crossfit|workout|trainer|wellness|shala)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.FITNESS;
  }

  // 9. Salon / Hair / Aesthetic / Beauty / Spa
  if (
    /\b(salon|hair|hairstyling|spa|beauty|barber|aesthetic|aesthetics|parlour|grooming|manicure|pedicure)\b/i.test(text)
  ) {
    return INDUSTRY_TYPES.SALON;
  }

  return INDUSTRY_TYPES.GENERAL;
}

/**
 * Builds the canonical WebsiteContext from user input.
 * Every section, design token, image selector, and validation rule relies on this.
 */
export function buildWebsiteContext(prompt, categoryOverride = null) {
  const brandName = extractBrandName(prompt);
  const industry = categoryOverride ? categoryOverride.toLowerCase() : detectIndustry(prompt);
  const cleanPrompt = (prompt || '').trim();

  // Determine sub-industry and specific focus
  let subIndustry = cleanPrompt;
  let targetAudience = ['Discerning customers', 'Quality-conscious patrons'];
  let businessGoals = ['Drive conversions and high-trust inquiries', 'Present world-class brand credibility'];
  let tone = ['Modern', 'Trustworthy', 'Authoritative'];
  let visualStyle = 'Modern Dark Obsidian';

  let callsToAction = {
    primary: { label: 'Explore Offerings', actionType: 'scroll', targetUrl: '#products' },
    secondary: { label: 'Get in Touch', actionType: 'scroll', targetUrl: '#contact' },
  };

  switch (industry) {
    case INDUSTRY_TYPES.SAAS:
      subIndustry = 'Autonomous AI & Cloud Automation Platform';
      targetAudience = ['Engineering Leads', 'CTOs', 'Operations Teams', 'Modern Businesses'];
      businessGoals = ['Convert high-value free trial signups', 'Book executive platform demos'];
      tone = ['Cutting-edge', 'High-performance', 'Authoritative', 'Reliable'];
      visualStyle = 'Cyber Modern Dark with Cyan & Indigo Glow';
      callsToAction = {
        primary: { label: 'Start Free Trial', actionType: 'navigate', targetUrl: '#pricing' },
        secondary: { label: 'Book Live Demo', actionType: 'scroll', targetUrl: '#contact' },
      };
      break;

    case INDUSTRY_TYPES.RESTAURANT:
      subIndustry = 'Artisanal Dining & Culinary Destination';
      targetAudience = ['Gourmet Diners', 'Families', 'Corporate Hosts', 'Food Lovers'];
      businessGoals = ['Secure table reservations', 'Showcase signature tasting menus'];
      tone = ['Warm', 'Artisanal', 'Refined', 'Sensory'];
      visualStyle = 'Warm Editorial Charcoal & Saffron Amber';
      callsToAction = {
        primary: { label: 'Reserve a Table', actionType: 'scroll', targetUrl: '#contact' },
        secondary: { label: 'View Tasting Menu', actionType: 'scroll', targetUrl: '#products' },
      };
      break;

    case INDUSTRY_TYPES.AGENCY:
      subIndustry = 'Full-Service Digital Product & Brand Studio';
      targetAudience = ['Venture-backed Founders', 'Marketing Executives', 'Enterprise Product Leads'];
      businessGoals = ['Sign client retainers', 'Showcase award-winning case studies'];
      tone = ['Bold', 'Visionary', 'Polished', 'Impactful'];
      visualStyle = 'Editorial Dark with Royal Violet & Neon Accents';
      callsToAction = {
        primary: { label: 'Schedule Strategy Call', actionType: 'scroll', targetUrl: '#contact' },
        secondary: { label: 'Explore Portfolio', actionType: 'scroll', targetUrl: '#products' },
      };
      break;

    case INDUSTRY_TYPES.RETAIL:
      subIndustry = 'Heritage Handcrafted Boutique & Retail Destination';
      targetAudience = ['Connoisseurs of Authentic Craft', 'Bridal & Festive Shoppers', 'Everyday Patrons'];
      businessGoals = ['Drive 1-tap WhatsApp orders', 'Display Silk Mark & artisan purity'];
      tone = ['Authentic', 'Opulent', 'Welcoming', 'Trusted'];
      visualStyle = 'Royal Crimson, Warm Gold & Deep Obsidian';
      callsToAction = {
        primary: { label: 'Order on WhatsApp', actionType: 'whatsapp', targetUrl: '#whatsapp' },
        secondary: { label: 'View Catalog & Prices', actionType: 'scroll', targetUrl: '#products' },
      };
      break;

    case INDUSTRY_TYPES.HEALTHCARE:
      subIndustry = 'Specialized Multispecialty Clinic & Care Practice';
      targetAudience = ['Patients seeking anxiety-free care', 'Families requiring routine health preservation'];
      businessGoals = ['Book doctor consultations', 'Reassure patient safety and sterilization protocols'];
      tone = ['Empathetic', 'Gentle', 'Clinically Rigorous', 'Reassuring'];
      visualStyle = 'Clinical Serenity with Deep Slate & Fresh Emerald';
      callsToAction = {
        primary: { label: 'Book Appointment', actionType: 'scroll', targetUrl: '#contact' },
        secondary: { label: 'WhatsApp Consultation', actionType: 'whatsapp', targetUrl: '#whatsapp' },
      };
      break;

    case INDUSTRY_TYPES.EDUCATION:
      subIndustry = 'Premier Competitive Coaching & Mentorship Academy';
      targetAudience = ['Aspiring Rankers', 'Conscientious Parents', 'Olympiad Candidates'];
      businessGoals = ['Enroll students into targeted batches', 'Distribute syllabus and fee structures'];
      tone = ['Disciplined', 'Inspirational', 'Results-oriented', 'Rigorous'];
      visualStyle = 'Academic Electric Blue & Golden Distinction';
      callsToAction = {
        primary: { label: 'Apply for Admission', actionType: 'scroll', targetUrl: '#contact' },
        secondary: { label: 'Download Fee Structure', actionType: 'scroll', targetUrl: '#pricing' },
      };
      break;

    case INDUSTRY_TYPES.PORTFOLIO:
      subIndustry = 'Personal Senior Systems Architect & Full-Stack Portfolio';
      targetAudience = ['Engineering Directors', 'Technical Recruiters', 'Collaborating Founders'];
      businessGoals = ['Attract senior engineering opportunities', 'Display open source & production apps'];
      tone = ['Analytical', 'Pragmatic', 'Passionate', 'Concise'];
      visualStyle = 'Minimalist Monokai Dark with Cyber Accents';
      callsToAction = {
        primary: { label: 'View Projects', actionType: 'scroll', targetUrl: '#products' },
        secondary: { label: 'Get in Touch', actionType: 'scroll', targetUrl: '#contact' },
      };
      break;

    case INDUSTRY_TYPES.FITNESS:
      subIndustry = 'Holistic Yoga Sanctuary & Functional Conditioning Gym';
      targetAudience = ['Beginners seeking transformation', 'Athletes aiming for peak conditioning'];
      businessGoals = ['Book free trial workouts', 'Sell monthly and annual fitness memberships'];
      tone = ['Energizing', 'Disciplined', 'Supportive', 'Transformative'];
      visualStyle = 'Vibrant Energy with Fresh Mint & Obsidian';
      callsToAction = {
        primary: { label: 'Book Free Trial Class', actionType: 'scroll', targetUrl: '#contact' },
        secondary: { label: 'Explore Membership Plans', actionType: 'scroll', targetUrl: '#pricing' },
      };
      break;

    case INDUSTRY_TYPES.SALON:
      subIndustry = 'Luxury Hair Salon & Aesthetic Lounge';
      targetAudience = ['Style-conscious clients', 'Bridal parties', 'Wellness seekers', 'Grooming connoisseurs'];
      businessGoals = ['Secure appointment bookings via WhatsApp or form', 'Showcase signature styling packages'];
      tone = ['Chic', 'Welcoming', 'Refined', 'Pampering'];
      visualStyle = 'Warm Rose Gold, Charcoal, and Soft Nude';
      callsToAction = {
        primary: { label: 'Book Appointment', actionType: 'scroll', targetUrl: '#contact' },
        secondary: { label: 'Explore Services', actionType: 'scroll', targetUrl: '#products' },
      };
      break;

    default:
      break;
  }

  const prohibitedTerms = PROHIBITED_TERMS_BY_INDUSTRY[industry] || [];
  const vocabulary = INDUSTRY_VOCABULARY[industry] || INDUSTRY_VOCABULARY[INDUSTRY_TYPES.GENERAL];

  return {
    brandName,
    industry,
    subIndustry,
    prompt: cleanPrompt,
    targetAudience,
    businessGoals,
    tone,
    visualStyle,
    callsToAction,
    prohibitedTerms,
    vocabulary,
    isLocalBusiness: [INDUSTRY_TYPES.RESTAURANT, INDUSTRY_TYPES.RETAIL, INDUSTRY_TYPES.HEALTHCARE, INDUSTRY_TYPES.FITNESS, INDUSTRY_TYPES.SALON].includes(industry),
  };
}

export const extractWebsiteContext = buildWebsiteContext;
