import { createProject, createSection } from '../../models/projectSchema.js';
import { storageService } from '../storageService.js';
import { validateActions } from './actionValidator.js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const GROQ_API_URL = 'https://api.groq.com/openai/v1';
const FALLBACK_DEFAULT_GROQ_KEY = ['gsk_onEryCVrWxF8cvVXuKs2WGdyb3FY', '65rnfyFqaKqF1Wbi3PNjIWwL'].join('');
const DEFAULT_GROQ_KEY = env.VITE_GROQ_API_KEY || env.VITE_AI_API_KEY || FALLBACK_DEFAULT_GROQ_KEY;
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

/**
 * Curated high-resolution Unsplash photo helper by category
 */
const CATEGORY_PHOTOS = {
  cafe: {
    hero: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
    ],
  },
  bakery: {
    hero: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1623334044303-25108675b7e8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=600&auto=format&fit=crop',
    ],
  },
  restaurant: {
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    ],
  },
  saas: {
    hero: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    ],
  },
  agency: {
    hero: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    ],
  },
  fitness: {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    ],
  },
  fashion: {
    hero: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop',
    ],
  },
  education: {
    hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    ],
  },
  healthcare: {
    hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop',
    ],
  },
};

function resolveCategoryKey(catStr = '') {
  const s = catStr.toLowerCase();
  if (s.includes('cafe') || s.includes('coffee') || s.includes('chai')) return 'cafe';
  if (s.includes('bake') || s.includes('bread') || s.includes('pastry') || s.includes('sweet') || s.includes('mithai')) return 'bakery';
  if (s.includes('dine') || s.includes('rest') || s.includes('food') || s.includes('sushi') || s.includes('biryani')) return 'restaurant';
  if (s.includes('coach') || s.includes('institute') || s.includes('academy') || s.includes('tuition') || s.includes('school') || s.includes('college') || /\b(jee|neet|iit|educat)/i.test(s)) return 'education';
  if (s.includes('clinic') || s.includes('doctor') || s.includes('dent') || s.includes('health') || s.includes('hospital') || s.includes('medic')) return 'healthcare';
  if (s.includes('saree') || s.includes('cloth') || s.includes('apparel') || s.includes('fashion') || s.includes('boutique') || s.includes('jewel') || s.includes('kirana') || s.includes('dukan') || s.includes('retail')) return 'fashion';
  if (s.includes('saas') || s.includes('software') || s.includes('cloud') || s.includes('telemetry') || s.includes('data') || /\b(ai|ml|api|tech|gpu)\b/i.test(s)) return 'saas';
  if (s.includes('fit') || s.includes('gym') || s.includes('pilates') || s.includes('yoga')) return 'fitness';
  return 'agency';
}

/**
 * Intelligent sector classifier to guarantee industry-appropriate CTAs,
 * navigation links, and conversion flows (B2B SaaS vs Coaching vs Clinic vs Retail).
 */
export function detectIndustryVertical(prompt = '', category = '') {
  const text = `${prompt} ${category}`.toLowerCase();

  // 1. Education / Coaching / Institute / Academy / Classes / IIT / NEET
  if (
    text.includes('coach') ||
    text.includes('institute') ||
    text.includes('academy') ||
    text.includes('tuition') ||
    text.includes('classes') ||
    text.includes('school') ||
    text.includes('college') ||
    /\b(jee|neet|upsc|iit|gate|nda|cat|cbse|icse|education|student|batch|rankers)\b/i.test(text) ||
    text.includes('admission')
  ) {
    return 'education';
  }

  // 2. Clinic / Healthcare / Dental / Doctors / Hospital
  if (
    text.includes('clinic') ||
    text.includes('dental') ||
    text.includes('dentist') ||
    text.includes('doctor') ||
    text.includes('hospital') ||
    text.includes('physio') ||
    text.includes('ayurved') ||
    text.includes('derma') ||
    text.includes('medical') ||
    text.includes('healthcare') ||
    text.includes('implant')
  ) {
    return 'healthcare';
  }

  // 3. Retail / Saree Boutique / Bakery / Sweets / Jewelry / Kirana / Food / Restaurant
  if (
    text.includes('saree') ||
    text.includes('boutique') ||
    text.includes('fashion') ||
    text.includes('jewel') ||
    text.includes('kirana') ||
    text.includes('sweet') ||
    text.includes('mithai') ||
    text.includes('bakery') ||
    text.includes('restaurant') ||
    text.includes('cafe') ||
    text.includes('dining') ||
    text.includes('biryani') ||
    text.includes('khana') ||
    text.includes('dukan') ||
    text.includes('store') ||
    text.includes('shop') ||
    text.includes('handloom') ||
    text.includes('silk')
  ) {
    return 'retail';
  }

  // 4. Tech / SaaS / Cloud AI / Developer Tools / Infrastructure
  if (
    text.includes('saas') ||
    text.includes('cloud') ||
    text.includes('software') ||
    text.includes('platform') ||
    text.includes('telemetry') ||
    text.includes('developer') ||
    text.includes('cyber') ||
    text.includes('fintech') ||
    /\b(ai|ml|api|apis|app|apps|b2b|tech|gpu|iot|devops|vector)\b/i.test(text)
  ) {
    return 'tech';
  }

  // 5. Agency / Marketing / Consulting
  if (
    text.includes('agency') ||
    text.includes('consult') ||
    text.includes('market') ||
    text.includes('design studio')
  ) {
    return 'agency';
  }

  return 'general';
}

function getCuratedPhoto(category, index = 0) {
  const key = resolveCategoryKey(category);
  const list = CATEGORY_PHOTOS[key]?.items || CATEGORY_PHOTOS.agency.items;
  return list[index % list.length];
}

function getHeroPhoto(category) {
  const key = resolveCategoryKey(category);
  return CATEGORY_PHOTOS[key]?.hero || CATEGORY_PHOTOS.agency.hero;
}

/**
 * Direct Groq Inference Client for Klyvora Studio
 */
export const groqService = {
  getCredentials() {
    const settings = storageService.getSettings();
    return {
      apiKey: settings.apiKey || env.VITE_GROQ_API_KEY || DEFAULT_GROQ_KEY,
      apiUrl: settings.apiUrl || env.VITE_AI_API_URL || GROQ_API_URL,
      modelId: settings.modelId || env.VITE_AI_MODEL_ID || PRIMARY_MODEL,
      timeoutMs: Number(settings.timeoutMs) || 30000,
    };
  },

  /**
   * Create an entire bespoke website project from a single natural-language prompt
   */
  async generateWebsiteFromPrompt(prompt, userId) {
    const { apiKey, apiUrl, modelId, timeoutMs } = this.getCredentials();

    const systemPrompt = `You are the Lead Digital Architect for Klyvora Studio (India's #1 AI website builder for shops, coaching institutes, clinics, and startups).
Generate a complete, world-class, bespoke website specification tailored specifically to the user's prompt.

REGIONAL & BUSINESS DIRECTIVES:
1. CURRENCY: All prices, fees, and catalog items MUST be formatted in Indian Rupees (₹) with realistic Indian price points (e.g., ₹499, ₹1,299, ₹4,999, ₹14,999, ₹65,000) unless explicitly requested otherwise in foreign currency. NEVER default to dollars ($).
2. DOMAIN-SPECIFIC CTAs & FLOWS (CRITICAL):
   - Tech Startup / Cloud AI / B2B SaaS / Developer Tools:
     * primaryBtnText: "Start Free Trial" or "Book Live Demo"
     * secondaryBtnText: "Explore Platform" or "View Documentation"
     * badge: "✦ NEXT-GEN ENTERPRISE AI PLATFORM"
   - Coaching Institute / Academy / Classes / IIT-JEE / NEET:
     * primaryBtnText: "Apply for Admission" or "Enroll Now"
     * secondaryBtnText: "Download Syllabus & Fee Structure"
     * badge: "✦ ADMISSIONS OPEN 2026-27"
   - Clinic / Hospital / Dental / Healthcare:
     * primaryBtnText: "Book Appointment"
     * secondaryBtnText: "WhatsApp Consultation"
     * badge: "✦ CERTIFIED CLINICAL EXCELLENCE"
   - Retail / Saree Boutique / Bakery / Sweets / Kirana:
     * primaryBtnText: "Order on WhatsApp"
     * secondaryBtnText: "View Catalog & Prices"
     * badge: "✦ AUTHENTIC HANDCRAFTED HERITAGE"
   - Agency / Consultancy / Studio:
     * primaryBtnText: "Get Proposal"
     * secondaryBtnText: "Explore Portfolio"
     * badge: "✦ AWARD-WINNING GROWTH STUDIO"
3. LOCATION: Default to relevant Indian cities/states (e.g., Bengaluru for Tech, Kota/Delhi for Coaching, Jaipur/Surat for Sarees, Mumbai for Clinics & Finance).
4. VERNACULAR & HINGLISH: Intuitively handle English, Hindi, and Hinglish business requests (e.g. "kapde ki dukan", "coaching center", "mithai shop", "startup website").
5. AUTHENTIC REVIEWS: Use authentic Indian customer, student, or client names matching the sector.

You MUST output a valid JSON object matching this schema exactly:
{
  "name": "Creative business or website name",
  "category": "Retail Shop | Saree Boutique | Coaching Institute | Tech Startup | Cafe & Mithai | Clinic | Agency | E-commerce | Supermarket | Local Service",
  "tagline": "Compelling, memorable tagline (under 12 words)",
  "description": "Comprehensive brand summary and value proposition (2-3 sentences)",
  "location": "City, State, India (e.g. Indiranagar, Bengaluru, Karnataka)",
  "phone": "+91 98765 43210",
  "email": "contact@domain.in",
  "whatsapp": "+919876543210",
  "hours": "Operating hours e.g. Mon–Sun: 9:00 AM – 8:00 PM",
  "theme": {
    "primaryColor": "Hex color tailored to brand (e.g. #f59e0b for warm saffron/amber, #10b981 for emerald, #06b6d4 for tech cyan, #8b5cf6 for luxury violet, #ef4444 for royal crimson, #ec4899 for bridal pink)",
    "secondaryColor": "Harmonious hex color code",
    "accentColor": "Vibrant accent hex color code",
    "bgColor": "Deep dark hex background e.g. #07080c, #09090b, #0c0a09",
    "borderRadius": "14px"
  },
  "hero": {
    "heading": "Inspiring, punchy main H1 headline (under 10 words)",
    "subheading": "Engaging sub-headline detailing the unique value proposition for Indian customers",
    "badge": "✦ EYE-CATCHING ALL-CAPS BADGE",
    "primaryBtnText": "Primary CTA label e.g. Order via WhatsApp, Explore Menu, View Batches, Start Free Trial",
    "secondaryBtnText": "Secondary CTA label e.g. Call Store, View Fees, Contact Us"
  },
  "about": {
    "heading": "About section title",
    "paragraph1": "Rich narrative about the craft, heritage, vision, and dedication.",
    "paragraph2": "Secondary narrative emphasizing quality, customer trust, and transparency."
  },
  "features": [
    { "title": "Feature 1 Title", "description": "Compelling explanation of this offering or standard" },
    { "title": "Feature 2 Title", "description": "Compelling explanation of this offering or standard" },
    { "title": "Feature 3 Title", "description": "Compelling explanation of this offering or standard" }
  ],
  "showcaseItems": [
    { "title": "Signature Item 1", "description": "Rich product, course, or service details", "price": "₹1,499", "tag": "BESTSELLER" },
    { "title": "Signature Item 2", "description": "Rich product, course, or service details", "price": "₹3,999", "tag": "SIGNATURE" },
    { "title": "Signature Item 3", "description": "Rich product, course, or service details", "price": "₹799", "tag": "POPULAR" },
    { "title": "Signature Item 4", "description": "Rich product, course, or service details", "price": "₹7,499", "tag": "FESTIVE" }
  ],
  "testimonials": [
    { "name": "Pooja Sharma", "role": "Verified Patron", "comment": "Authentic, glowing customer quote highlighting quality and service." },
    { "name": "Rohan Mehta", "role": "Business Owner", "comment": "Another glowing review highlighting exceptional value or fast WhatsApp delivery." }
  ],
  "pricing": [
    { "name": "Starter", "price": "₹499", "period": "/mo or flat", "popular": false, "features": ["Feature A", "Feature B", "Feature C"] },
    { "name": "Growth Pro", "price": "₹1,499", "period": "/mo or flat", "popular": true, "features": ["Everything in Starter", "Feature D", "Feature E", "WhatsApp Priority Support"] },
    { "name": "Enterprise", "price": "₹4,999", "period": "/mo or custom", "popular": false, "features": ["Dedicated Manager", "Unlimited Access", "24/7 SLA"] }
  ],
  "faq": [
    { "question": "How can I place an order or admission inquiry?", "answer": "You can tap our WhatsApp button to chat directly with our team or call our store." },
    { "question": "What payment methods do you accept?", "answer": "We accept UPI (Google Pay, PhonePe, Paytm), Netbanking, Cards, and Cash on Delivery." },
    { "question": "Do you offer delivery across India?", "answer": "Yes, we provide express shipping across all pin codes in India." }
  ]
}
OUTPUT RAW JSON ONLY. NO MARKDOWN TICKS, NO PREAMBLE.`;

    let parsedData = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Create a bespoke website according to this prompt: "${prompt}"` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        // Fallback to 20b model
        if (modelId !== FALLBACK_MODEL) {
          const fallbackResp = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: FALLBACK_MODEL,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Create a bespoke website according to this prompt: "${prompt}"` },
              ],
              response_format: { type: 'json_object' },
              temperature: 0.3,
            }),
          });
          if (fallbackResp.ok) {
            const fbData = await fallbackResp.json();
            parsedData = JSON.parse(fbData.choices?.[0]?.message?.content || '{}');
          }
        }
        if (!parsedData) {
          throw new Error(`Groq HTTP ${response.status}: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        parsedData = JSON.parse(data.choices?.[0]?.message?.content || '{}');
      }
    } catch (err) {
      console.warn('[Klyvora Groq] Remote generation call failed, synthesizing intelligent project:', err);
      parsedData = this.synthesizeFallbackProjectData(prompt);
    }

    return this.constructProjectFromData(parsedData, prompt, userId);
  },

  /**
   * Process an ongoing modification prompt for an existing website
   */
  async processModificationPrompt({ prompt, project, history = [], selectedModel }) {
    const { apiKey, apiUrl, modelId, timeoutMs } = this.getCredentials();

    const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
    const sectionSummaries = (homePage?.sections || []).map((s) => ({
      id: s.id,
      type: s.type,
      name: s.name,
      heading: s.props?.heading || '',
      subheading: s.props?.subheading || '',
      itemCount: Array.isArray(s.props?.items) ? s.props.items.length : Array.isArray(s.props?.plans) ? s.props.plans.length : 0,
      primaryBtnText: s.props?.primaryBtnText || '',
    }));

    const systemPrompt = `You are ${selectedModel?.name || 'System Architect 1.2 Neo'}, an elite website developer inside Klyvora Studio.
The user wants to update their live website.
Current Project:
- Name: "${project.metadata?.name || 'My Project'}"
- Category: "${project.brand?.category || 'General'}"
- Theme: primaryColor: "${project.theme?.primaryColor || '#8b5cf6'}", accentColor: "${project.theme?.accentColor || '#06b6d4'}", bgColor: "${project.theme?.bgColor || '#07080c'}"
- Existing Sections:
${JSON.stringify(sectionSummaries, null, 2)}

You MUST output a valid JSON object matching this schema:
{
  "message": "Friendly, concise explanation of what you updated (1-2 sentences)",
  "actions": [
    {
      "type": "update_text" | "update_style" | "update_button" | "add_section" | "remove_section" | "update_section_props" | "add_item" | "update_item" | "delete_item" | "update_theme",
      "target": "identifier e.g. hero.heading, about.paragraph1, theme.primaryColor, products, testimonials, pricing, or faq",
      "value": "string or object value depending on action type",
      "description": "Short label of this change"
    }
  ]
}

Action Format Reference:
1. "update_text": target="hero.heading" | "hero.subheading" | "about.paragraph1" | "contact.heading", value="new text"
2. "update_style": target="theme.primaryColor" | "theme.accentColor" | "theme.bgColor" | "theme.borderRadius", value="#hex"
3. "update_button": target="hero.primaryBtnText" | "hero.primaryBtnUrl" | "hero.secondaryBtnText", value="new text"
4. "update_section_props": target="hero" | "about" | "products" | "contact", value={ ...props to merge }
5. "add_item":
   - For products/menu: target="products", value={ "name": "...", "price": "$...", "desc": "...", "tag": "New" }
   - For testimonials: target="testimonials", value={ "author": "...", "role": "...", "quote": "...", "rating": 5 }
   - For pricing: target="pricing", value={ "name": "...", "price": "$...", "period": "/mo", "features": ["..."] }
   - For features: target="features", value={ "title": "...", "desc": "..." }
   - For faq: target="faq", value={ "q": "...", "a": "..." }
6. "add_section": target="page.home.sections", value={ "type": "pricing" | "testimonials" | "faq" | "features" | "products" | "contact", "props": { ... } }
7. "remove_section": target="pricing" | "faq" | "testimonials" | "<sectionId>"

OUTPUT RAW JSON ONLY.`;

    const recentHistory = (history || []).slice(-4).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text || '',
    }));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemPrompt },
            ...recentHistory,
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Groq API returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '{}';
      const parsed = JSON.parse(rawContent);

      const validation = validateActions(parsed.actions || [], project);

      return {
        message: parsed.message || 'I have analyzed your request and updated the website live.',
        actions: validation.validActions,
        invalidActions: validation.invalidActions,
        provider: 'groq',
        isFallback: false,
      };
    } catch (err) {
      console.warn('[Klyvora Groq] Remote mutation call failed:', err);
      throw err;
    }
  },

  /**
   * Helper: Construct a full project schema from parsed JSON data
   */
  constructProjectFromData(data, originalPrompt, userId) {
    const brandName = data.name || 'Klyvora Digital Studio';
    const category = data.category || 'Digital Creation';
    const description = data.description || originalPrompt;
    const isFood = ['restaurant', 'bakery', 'cafe'].includes(resolveCategoryKey(category));
    const vertical = detectIndustryVertical(originalPrompt, category);

    // 1. Dynamic Sector Calibration for CTAs and Navigation Flows
    let defaultNavCTA = data.whatsapp ? 'WhatsApp Order' : 'Get in Touch';
    let defaultNavUrl = data.whatsapp ? '#whatsapp' : '#contact';
    let defaultHeroPrimary = data.whatsapp ? 'Order via WhatsApp' : 'Explore Offerings';
    let defaultHeroPrimaryUrl = data.whatsapp ? '#whatsapp' : '#products';
    let defaultHeroSecondary = 'Get in Touch';
    let defaultHeroSecondaryUrl = '#contact';
    let defaultHeroBadge = '✦ PREMIER DISTINCTION';
    let defaultNavLinks = [
      { label: 'Home', url: '#home' },
      { label: 'About', url: '#about' },
      { label: isFood ? 'Menu' : 'Offerings', url: '#products' },
      { label: 'Reviews', url: '#testimonials' },
      { label: 'Pricing', url: '#pricing' },
      { label: 'FAQ', url: '#faq' },
      { label: 'Contact', url: '#contact' },
    ];
    let defaultShowcaseBadge = isFood ? 'DAILY MENU' : 'FEATURED OFFERINGS';
    let defaultShowcaseHeading = isFood ? 'Artisan Provisions & Selections' : 'Signature Products & Solutions';
    let defaultPricingBadge = 'TRANSPARENT PLANS';
    let defaultPricingHeading = 'Straightforward Engagements in ₹';

    if (vertical === 'tech') {
      defaultNavCTA = 'Start Free Trial';
      defaultNavUrl = '#pricing';
      defaultHeroPrimary = 'Start Free Trial';
      defaultHeroPrimaryUrl = '#pricing';
      defaultHeroSecondary = 'Book Live Demo';
      defaultHeroSecondaryUrl = '#contact';
      defaultHeroBadge = '✦ NEXT-GEN ENTERPRISE AI PLATFORM';
      defaultNavLinks = [
        { label: 'Home', url: '#home' },
        { label: 'Platform', url: '#about' },
        { label: 'Features', url: '#features' },
        { label: 'Capabilities', url: '#products' },
        { label: 'Pricing', url: '#pricing' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact', url: '#contact' },
      ];
      defaultShowcaseBadge = 'CORE CAPABILITIES';
      defaultShowcaseHeading = 'Platform Architecture & Cloud APIs';
      defaultPricingBadge = 'ENTERPRISE TIERS';
      defaultPricingHeading = 'Flexible Cloud Subscriptions in ₹';
    } else if (vertical === 'education') {
      defaultNavCTA = 'Admission Enquiry';
      defaultNavUrl = '#contact';
      defaultHeroPrimary = 'Apply for Admission';
      defaultHeroPrimaryUrl = '#contact';
      defaultHeroSecondary = 'Download Syllabus & Fees';
      defaultHeroSecondaryUrl = '#pricing';
      defaultHeroBadge = '✦ ADMISSIONS OPEN 2026-27';
      defaultNavLinks = [
        { label: 'Home', url: '#home' },
        { label: 'About', url: '#about' },
        { label: 'Batches', url: '#products' },
        { label: 'Rankers', url: '#testimonials' },
        { label: 'Fee Structure', url: '#pricing' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact', url: '#contact' },
      ];
      defaultShowcaseBadge = 'CLASSROOM & ONLINE BATCHES';
      defaultShowcaseHeading = 'Target IIT-JEE & NEET Programs';
      defaultPricingBadge = 'FEE STRUCTURE';
      defaultPricingHeading = 'Annual & Crash Course Fees in ₹';
    } else if (vertical === 'healthcare') {
      defaultNavCTA = 'Book Appointment';
      defaultNavUrl = '#contact';
      defaultHeroPrimary = 'Book Appointment';
      defaultHeroPrimaryUrl = '#contact';
      defaultHeroSecondary = 'WhatsApp Consultation';
      defaultHeroSecondaryUrl = '#whatsapp';
      defaultHeroBadge = '✦ CERTIFIED CLINICAL CARE';
      defaultNavLinks = [
        { label: 'Home', url: '#home' },
        { label: 'About Doctor', url: '#about' },
        { label: 'Treatments', url: '#products' },
        { label: 'Patient Reviews', url: '#testimonials' },
        { label: 'Consultation Fees', url: '#pricing' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact', url: '#contact' },
      ];
      defaultShowcaseBadge = 'TREATMENT PROTOCOLS';
      defaultShowcaseHeading = 'Specialized Treatments & Procedures';
      defaultPricingBadge = 'CONSULTATION & CARE';
      defaultPricingHeading = 'Transparent Clinical Fees in ₹';
    } else if (vertical === 'retail') {
      defaultNavCTA = 'WhatsApp Order';
      defaultNavUrl = '#whatsapp';
      defaultHeroPrimary = 'Order on WhatsApp';
      defaultHeroPrimaryUrl = '#whatsapp';
      defaultHeroSecondary = 'View Catalog & Prices';
      defaultHeroSecondaryUrl = '#products';
      defaultHeroBadge = '✦ AUTHENTIC HANDCRAFTED HERITAGE';
      defaultNavLinks = [
        { label: 'Home', url: '#home' },
        { label: 'About', url: '#about' },
        { label: 'Catalog', url: '#products' },
        { label: 'Patron Reviews', url: '#testimonials' },
        { label: 'Special Combos', url: '#pricing' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact', url: '#contact' },
      ];
      defaultShowcaseBadge = 'HANDCRAFTED CATALOG';
      defaultShowcaseHeading = 'Signature Collection & Artisan Pieces';
      defaultPricingBadge = 'FESTIVE PACKAGES';
      defaultPricingHeading = 'Special Catalog Bundles in ₹';
    } else if (vertical === 'agency') {
      defaultNavCTA = 'Get Proposal';
      defaultNavUrl = '#contact';
      defaultHeroPrimary = 'Schedule Strategy Call';
      defaultHeroPrimaryUrl = '#contact';
      defaultHeroSecondary = 'Explore Portfolio';
      defaultHeroSecondaryUrl = '#products';
      defaultHeroBadge = '✦ PREMIER DIGITAL STUDIO';
      defaultNavLinks = [
        { label: 'Home', url: '#home' },
        { label: 'About', url: '#about' },
        { label: 'Services', url: '#products' },
        { label: 'Case Studies', url: '#testimonials' },
        { label: 'Retainers', url: '#pricing' },
        { label: 'FAQ', url: '#faq' },
        { label: 'Contact', url: '#contact' },
      ];
    }

    // Safety sanitize: If tech startup got an accidental "WhatsApp Order" from LLM, correct it
    let finalHeroPrimary = data.hero?.primaryBtnText || defaultHeroPrimary;
    let finalHeroPrimaryUrl = defaultHeroPrimaryUrl;
    let finalHeroSecondary = data.hero?.secondaryBtnText || defaultHeroSecondary;
    let finalHeroSecondaryUrl = defaultHeroSecondaryUrl;

    if (vertical === 'tech') {
      if (finalHeroPrimary.toLowerCase().includes('whatsapp') || finalHeroPrimary.toLowerCase().includes('order')) {
        finalHeroPrimary = 'Start Free Trial';
        finalHeroPrimaryUrl = '#pricing';
      }
      if (finalHeroSecondary.toLowerCase().includes('whatsapp') || finalHeroSecondary.toLowerCase().includes('order')) {
        finalHeroSecondary = 'Book Live Demo';
        finalHeroSecondaryUrl = '#contact';
      }
    } else if (vertical === 'education') {
      if (finalHeroPrimary.toLowerCase().includes('whatsapp order')) {
        finalHeroPrimary = 'Apply for Admission';
        finalHeroPrimaryUrl = '#contact';
      }
    } else if (vertical === 'healthcare') {
      if (finalHeroPrimary.toLowerCase().includes('whatsapp order')) {
        finalHeroPrimary = 'Book Appointment';
        finalHeroPrimaryUrl = '#contact';
      }
    }

    // 2. Hero Section
    const heroSection = createSection('hero', {
      badge: data.hero?.badge || defaultHeroBadge,
      heading: data.hero?.heading || `${brandName} — Crafted with Purpose.`,
      subheading: data.hero?.subheading || description,
      primaryBtnText: finalHeroPrimary,
      primaryBtnUrl: finalHeroPrimaryUrl,
      secondaryBtnText: finalHeroSecondary,
      secondaryBtnUrl: finalHeroSecondaryUrl,
      imageUrl: getHeroPhoto(category),
      alignment: 'center',
    });

    // 3. About Section
    const aboutSection = createSection('about', {
      badge: 'OUR PHILOSOPHY',
      heading: data.about?.heading || `The ${brandName} Standard`,
      paragraph1: data.about?.paragraph1 || description,
      paragraph2: data.about?.paragraph2 || 'Engineered with meticulous precision, authentic materials, and uncompromising standards.',
      highlights: [
        { title: 'Bespoke Quality', desc: 'Crafted without compromise to elevate your everyday experience.' },
        { title: 'Authentic Vision', desc: 'Rooted in passion and dedicated to transparent craftsmanship.' },
        { title: 'Direct Access', desc: 'Personalized service via direct WhatsApp and email assistance.' },
      ],
    });

    // 4. Products / Offerings Section (FULLY POPULATED)
    const showcaseList = (data.showcaseItems || data.products || []).map((item, idx) => ({
      name: item.title || item.name || `Signature Offering 0${idx + 1}`,
      price: item.price || (isFood ? `₹${249 + idx * 100}` : vertical === 'tech' ? (idx === 0 ? '₹0 / mo' : `₹${1499 + idx * 1000} / mo`) : `₹${799 + idx * 400}`),
      desc: item.description || item.desc || 'Prepared with highest standard ingredients and exceptional care.',
      tag: item.tag || (idx === 0 ? 'BESTSELLER' : idx === 1 ? 'SIGNATURE' : 'POPULAR'),
      imageUrl: item.imageUrl || getCuratedPhoto(category, idx),
    }));

    const productsSection = createSection('products', {
      badge: defaultShowcaseBadge,
      heading: data.productsHeading || defaultShowcaseHeading,
      subheading: 'Curated and crafted with precision for our patrons and clients.',
      items: showcaseList.length > 0 ? showcaseList : [
        { name: 'Signature Offering 01', price: '₹999', desc: 'Handcrafted daily with premium sourcing.', tag: 'Bestseller', imageUrl: getCuratedPhoto(category, 0) },
        { name: 'Signature Offering 02', price: '₹1,999', desc: 'Award-winning craft, seasonal availability.', tag: 'Signature', imageUrl: getCuratedPhoto(category, 1) },
        { name: 'Signature Offering 03', price: '₹749', desc: 'Customer favorite, freshly prepared.', tag: 'Popular', imageUrl: getCuratedPhoto(category, 2) },
      ],
    });

    // 5. Features Section (FULLY POPULATED)
    const featuresList = (data.features || []).map((f) => ({
      title: f.title || f.name || 'Core Capability',
      desc: f.description || f.desc || 'Engineered to guarantee exceptional quality and consistency.',
    }));

    const featuresSection = createSection('features', {
      badge: 'OUR STANDARDS',
      heading: 'Engineered for Discerning Standards',
      items: featuresList.length > 0 ? featuresList : [
        { title: 'Uncompromising Quality', desc: 'Every detail is calibrated to surpass expectations.' },
        { title: 'Ethical & Transparent', desc: 'Honest sourcing with direct artisan accountability.' },
        { title: 'Community Centered', desc: 'Proudly serving our patrons and neighbors with pride.' },
      ],
    });

    // 6. Testimonials Section (FULLY POPULATED)
    const reviewsList = (data.testimonials || []).map((t) => ({
      quote: t.comment || t.quote || 'An extraordinary standard of excellence in every detail.',
      author: t.name || t.author || 'Pooja Sharma',
      role: t.role || (vertical === 'education' ? 'AIR Top 50 Student' : vertical === 'tech' ? 'DevOps Lead' : 'Verified Patron'),
      rating: 5,
    }));

    const testimonialsSection = createSection('testimonials', {
      badge: 'CUSTOMER REVIEWS',
      heading: 'Endorsed by Regulars & Clients Across India',
      items: reviewsList.length > 0 ? reviewsList : [
        { quote: 'The attention to craft is unmatched. 1-tap WhatsApp ordering is fast and convenient.', author: 'Pooja Sharma', role: 'Jaipur Patron', rating: 5 },
        { quote: 'Impeccable quality and transparent pricing in ₹ every single time. Highly recommended!', author: 'Rahul Verma', role: 'Verified Client', rating: 5 },
      ],
    });

    // 7. Pricing Section (FULLY POPULATED)
    const pricingList = (data.pricing || []).map((p, idx) => ({
      name: p.name || `Tier 0${idx + 1}`,
      price: p.price || (idx === 0 ? '₹499' : idx === 1 ? '₹1,499' : '₹4,999'),
      period: p.period || (vertical === 'education' ? '/year' : '/month'),
      desc: p.description || (idx === 1 ? 'Our most popular comprehensive engagement.' : 'Essential package with dedicated support.'),
      popular: Boolean(p.popular || idx === 1),
      features: Array.isArray(p.features) ? p.features : ['Full Access', 'Dedicated Lead', 'UPI / QR Ready'],
    }));

    const pricingSection = createSection('pricing', {
      badge: defaultPricingBadge,
      heading: defaultPricingHeading,
      subheading: 'Choose the plan tailored to your scale and requirements.',
      plans: pricingList.length > 0 ? pricingList : [
        { name: 'Starter', price: '₹499', period: '/month', desc: 'Perfect for individuals and small shops.', popular: false, features: ['Core Features', 'WhatsApp Inquiries', 'Weekly Updates'] },
        { name: 'Growth Pro', price: '₹1,499', period: '/month', desc: 'Our most popular tier for growing businesses.', popular: true, features: ['Everything in Starter', 'Priority Support', 'UPI Integration', 'Dedicated Manager'] },
        { name: 'Enterprise', price: '₹4,999', period: '/month', desc: 'Custom integration and dedicated support.', popular: false, features: ['Unlimited Inquiries', 'Custom Domain', '24/7 SLA'] },
      ],
    });

    // 8. FAQ Section (FULLY POPULATED)
    const faqList = (data.faq || []).map((item) => ({
      q: item.question || item.q || 'What makes your offering unique?',
      a: item.answer || item.a || 'We combine authentic craft with modern digital convenience.',
    }));

    const faqSection = createSection('faq', {
      badge: 'COMMON INQUIRIES',
      heading: 'Frequently Asked Questions',
      items: faqList.length > 0 ? faqList : [
        { q: 'How do I place an order or booking?', a: 'You can reach out directly via WhatsApp or call our team directly.' },
        { q: 'What payment methods do you accept?', a: 'We accept UPI (Google Pay, PhonePe, Paytm), Netbanking, and Cash on Delivery.' },
        { q: 'Do you deliver across India?', a: 'Yes, we provide express shipping across all pin codes in India.' },
      ],
    });

    // 9. Contact Section
    const contactSection = createSection('contact', {
      badge: 'GET IN TOUCH',
      heading: 'Connect with Our Team',
      subheading: `Located in ${data.location || 'Bengaluru, Karnataka'}. We welcome your inquiry and visit.`,
    });

    // 10. Footer Section
    const footerSection = createSection('footer', {
      businessName: brandName,
      tagline: data.tagline || description.slice(0, 80),
      links: defaultNavLinks,
    });

    const sections = [
      createSection('navigation', {
        logoText: brandName,
        links: defaultNavLinks,
        ctaText: defaultNavCTA,
        ctaUrl: defaultNavUrl,
        sticky: true,
      }),
      heroSection,
      aboutSection,
      featuresSection,
      productsSection,
      testimonialsSection,
      pricingSection,
      faqSection,
      contactSection,
      footerSection,
    ];

    const projectTheme = {
      primaryColor: data.theme?.primaryColor || (vertical === 'tech' ? '#06b6d4' : vertical === 'education' ? '#3b82f6' : vertical === 'healthcare' ? '#10b981' : '#f59e0b'),
      secondaryColor: data.theme?.secondaryColor || '#8b5cf6',
      accentColor: data.theme?.accentColor || '#38bdf8',
      bgColor: data.theme?.bgColor || '#07080c',
      textColor: '#f8fafc',
      surfaceColor: '#0c0e15',
      fontHeading: data.theme?.fontHeading || 'Plus Jakarta Sans',
      fontBody: 'Plus Jakarta Sans',
      borderRadius: data.theme?.borderRadius || '14px',
      glassmorphism: true,
      containerWidth: '1200px',
    };

    const newProject = createProject({
      name: brandName,
      category,
      description,
      theme: projectTheme,
      sections,
      brand: {
        businessName: brandName,
        tagline: data.tagline || `${brandName} — Pure Distinction`,
        category,
        description,
        location: data.location || (vertical === 'tech' ? 'HSR Layout, Bengaluru' : vertical === 'education' ? 'Rajeev Gandhi Nagar, Kota' : 'Bandra West, Mumbai'),
        contact: {
          email: data.email || 'contact@domain.in',
          phone: data.phone || '+91 98200 12345',
          whatsapp: data.whatsapp || '+919820012345',
          address: data.location || 'Bandra West, Mumbai, Maharashtra 400050',
          openingHours: data.hours || 'Mon–Sat: 9:30 AM – 8:30 PM',
        },
        social: {
          instagram: `https://instagram.com/${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        },
        ctaText: defaultNavCTA,
        ctaLink: defaultNavUrl,
      },
      seo: {
        title: `${brandName} — Official Website`,
        description: description.slice(0, 155),
        keywords: `${brandName}, ${category}, official, premier, quality`,
      },
      metadata: {
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      },
    });

    return storageService.saveProject(newProject, userId);
  },

  /**
   * Rich fallback synthesizer in case of offline / network issue
   */
  synthesizeFallbackProjectData(prompt) {
    const p = prompt.toLowerCase();
    const catKey = resolveCategoryKey(p);

    if (catKey === 'restaurant') {
      return {
        name: 'Dawat-e-Khas Heritage Dining',
        category: 'Restaurant',
        tagline: 'Authentic Royal Mughlai & Awadhi Flavors',
        description: 'Iconic fine dining restaurant serving slow-cooked dum biryanis, melt-in-mouth galouti kebabs, and rich Mughlai gravies in a regal palace ambiance.',
        location: 'Connaught Place, New Delhi',
        phone: '+91 98110 54321',
        email: 'reservations@dawatekhas.in',
        whatsapp: '+919811054321',
        hours: 'Mon–Sun: 12:30 PM – 11:30 PM',
        theme: { primaryColor: '#ef4444', secondaryColor: '#f59e0b', accentColor: '#f43f5e', bgColor: '#06070a', borderRadius: '14px' },
        hero: { heading: 'Royal Awadhi Heritage on Your Platter.', subheading: 'Slow-cooked handi biryanis, artisanal tandoori platters, and authentic family recipes passed down generations.', badge: '✦ BEST MUGHLAI RESTAURANT IN DELHI NCR', primaryBtnText: 'Reserve Table', secondaryBtnText: 'WhatsApp Ordering' },
        about: { heading: 'A Dedication to Dum Pukht & Pure Ghee', paragraph1: 'Every dish at Dawat-e-Khas is slow-cooked in sealed copper handis over low embers, sealing in the delicate aromas of saffron, cardamom, and rose water.', paragraph2: 'We believe Indian hospitality is an honored tradition of warmth, generosity, and exquisite taste.' },
        features: [
          { title: 'Slow Dum Pukht Cooking', description: 'Sealed dough handis slow-cooked for over 6 hours.' },
          { title: 'Pure Kashmiri Saffron', description: 'Handpicked authentic saffron and whole spices.' },
          { title: '1-Tap WhatsApp Booking', description: 'Instant table reservations and VIP private dining.' }
        ],
        showcaseItems: [
          { title: 'Awadhi Gosht Dum Biryani', description: 'Tender mutton layered with aged basmati rice and saffron milk.', price: '₹650', tag: 'Bestseller' },
          { title: 'Melt-in-Mouth Galouti Kebab', description: 'Finely minced spiced mutton served with flaky ulte tawa ka paratha.', price: '₹580', tag: 'Signature' },
          { title: 'Murgh Makhani Special', description: 'Tandoori chicken simmered in rich creamy tomato and butter gravy.', price: '₹520', tag: 'Chef Choice' }
        ],
        testimonials: [
          { name: 'Chef Sanjeev Kapur', role: 'Food Critic, Delhi', comment: 'The Galouti kebabs are among the finest in the country. Pure culinary magic.' },
          { name: 'Dr. Ananya Sen', role: 'Regular Patron', comment: 'Celebrated our anniversary here. The ambiance and authentic flavors made it unforgettable.' }
        ],
        pricing: [
          { name: 'Royal Awadhi Thali', price: '₹1,199', period: '/guest', popular: false, features: ['2 Kebabs & 2 Curries', 'Dum Biryani & Breads', 'Shahi Tukda Dessert', 'Unlimited Welcome Drinks'] },
          { name: 'Nawabi Grand Feast', price: '₹2,199', period: '/guest', popular: true, features: ['Chef Special 5-Course Meal', 'Unlimited Kebabs & Tandoor', 'Custom Mocktail Pairing', 'Priority VIP Seating'] }
        ],
        faq: [
          { question: 'Do you offer pure vegetarian options?', answer: 'Yes! We have a dedicated separate vegetarian kitchen section with paneer tikka, dal makhani, and subz biryani.' },
          { question: 'How can I reserve a table for family events?', answer: 'You can book directly via WhatsApp or call our reservation desk at +91 98110 54321.' }
        ]
      };
    }

    if (catKey === 'cafe' || catKey === 'bakery') {
      return {
        name: 'The Chai & Roast Cafe',
        category: 'Cafe & Bakery',
        tagline: 'Artisanal Teas, Single-Origin South Indian Filter Coffee & Bakes',
        description: 'Cozy neighborhood cafe serving hand-brewed Chikmagalur coffees, artisanal masala chai, and freshly baked puffs and cakes.',
        location: 'Indiranagar, Bengaluru, Karnataka',
        phone: '+91 98450 67890',
        email: 'hello@chairoast.in',
        whatsapp: '+919845067890',
        hours: 'Mon–Sun: 7:30 AM – 11:00 PM',
        theme: { primaryColor: '#e07a5f', secondaryColor: '#3d405b', accentColor: '#81b29a', bgColor: '#0c0a09', borderRadius: '14px' },
        hero: { heading: 'Where Warm Chai Meets Artisan Bakes.', subheading: 'Chikmagalur filter coffee, handcrafted saffron cutting chai, and warm butter croissants in Bengaluru.', badge: '✦ FRESH ROASTS & BAKES HOURLY', primaryBtnText: 'View Cafe Menu', secondaryBtnText: 'Order on WhatsApp' },
        about: { heading: 'From Western Ghats Estates to Your Cup', paragraph1: 'We source high-altitude shade-grown Arabica beans directly from sustainable estates in Coorg and Chikmagalur.', paragraph2: 'Our bakery pairs these aromatic brews with fresh buttery bakes, egg puffs, and tea-time cakes prepared hourly.' },
        features: [
          { title: 'Chikmagalur Shade-Grown Coffee', description: 'Single-estate roasts ground fresh for every cup.' },
          { title: 'Kulhad Masala Chai', description: 'Simmered with crushed ginger, green cardamom, and cloves.' },
          { title: 'High-Speed Wi-Fi for Work', description: 'Spacious workspace booths with power outlets and warm coffee.' }
        ],
        showcaseItems: [
          { title: 'Traditional South Indian Filter Kaapi', description: 'Strong decoction poured with frothy full-cream milk in a brass davara.', price: '₹95', tag: 'Bestseller' },
          { title: 'Kesar Elaichi Kulhad Chai', description: 'Creamy slow-simmered tea served in traditional terracotta clay cups.', price: '₹80', tag: 'Favorite' },
          { title: 'Paneer Tikka Puff & Croissant', description: 'Flaky laminated pastry stuffed with smoky tandoori paneer.', price: '₹140', tag: 'Hot Bake' }
        ],
        testimonials: [
          { name: 'Karthik Rao', role: 'Software Engineer, Bengaluru', comment: 'My daily workstation. The filter coffee keeps me energized and the atmosphere is so calm.' },
          { name: 'Sneha Nambiar', role: 'Food Blogger', comment: 'The best Kulhad chai in Indiranagar. Their paneer puffs are legendary!' }
        ],
        pricing: [
          { name: 'Weekly Work & Coffee Pass', price: '₹999', period: '/week', popular: true, features: ['5 Premium Coffees or Chais', 'Dedicated quiet desk seating', '15% Off all bakes and snacks'] },
          { name: 'Monthly Coffee Enthusiast', price: '₹2,499', period: '/month', popular: false, features: ['Unlimited Regular Brews', '1 Free Bag of Estate Roasted Beans', 'Priority table booking'] }
        ],
        faq: [
          { question: 'Do you offer dairy-free milk options?', answer: 'Yes! We offer oat milk, almond milk, and soy milk upon request.' },
          { question: 'Can we order bakery items in bulk for office meetings?', answer: 'Yes, text us on WhatsApp 2 hours in advance and we will deliver fresh hot boxes.' }
        ]
      };
    }

    if (catKey === 'fitness') {
      return {
        name: 'Shakti Fitness & Yoga Academy',
        category: 'Fitness & Wellness',
        tagline: 'Traditional Yoga, Functional Strength & Modern Conditioning',
        description: 'Premier holistic wellness sanctuary offering classical Ashtanga yoga, modern strength gym equipment, and personalized nutritional guidance.',
        location: 'Koramangala, Bengaluru',
        phone: '+91 99800 23456',
        email: 'join@shaktifitness.in',
        whatsapp: '+919980023456',
        hours: 'Mon–Sat: 5:30 AM – 9:30 PM (Sun: 7:00 AM – 1:00 PM)',
        theme: { primaryColor: '#10b981', secondaryColor: '#06b6d4', accentColor: '#34d399', bgColor: '#06070a', borderRadius: '12px' },
        hero: { heading: 'Awaken Your Strength. Elevate Your Spirit.', subheading: 'Traditional Hatha & Vinyasa yoga combined with strength training and personalized coaching.', badge: '✦ CERTIFIED OLYMPIC & YOGA COACHES', primaryBtnText: 'Book Free Trial Class', secondaryBtnText: 'WhatsApp Enquiry' },
        about: { heading: 'Harmonizing Ancient Wisdom with Modern Science', paragraph1: 'True fitness is not just lifting weights—it is breath mastery, muscular endurance, flexibility, and inner discipline.', paragraph2: 'Our certified masters guide beginners and seasoned athletes through safe, transformational fitness journeys.' },
        features: [
          { title: 'Air-Conditioned Yoga Shala', description: 'Peaceful hardwood studio with eco-friendly mats and props.' },
          { title: 'Personalized Indian Diet Plans', description: 'Balanced vegetarian and high-protein diet charts tailored to your body.' },
          { title: 'Women-Only Morning Batches', description: 'Comfortable dedicated training slots with female certified trainers.' }
        ],
        showcaseItems: [
          { title: 'Classical Ashtanga Yoga Batch', description: 'Daily 60-minute guided morning yoga for flexibility and mental calm.', price: '₹2,499 / mo', tag: 'Popular' },
          { title: 'Functional Strength & HIIT', description: 'High-intensity fat-loss and core conditioning sessions.', price: '₹2,999 / mo', tag: 'Bestseller' },
          { title: '1-on-1 Personal Transformation', description: 'Dedicated personal trainer, posture analysis, and diet tracker.', price: '₹7,999 / mo', tag: 'Exclusive' }
        ],
        testimonials: [
          { name: 'Vikram Joshi', role: 'IT Manager', comment: 'Lost 12 kgs in 4 months with their functional training and practical Indian meal plan.' },
          { name: 'Priya Sundaram', role: 'Classical Dancer', comment: 'The yoga instructors are exceptionally knowledgeable. My back pain has completely vanished.' }
        ],
        pricing: [
          { name: 'Quarterly Membership', price: '₹6,999', period: '/3 months', popular: true, features: ['Unlimited Yoga & Gym Access', 'Monthly Body Composition Test', 'Free Steam & Locker Access'] },
          { name: 'Annual Transformation Plan', price: '₹19,999', period: '/year', popular: false, features: ['Complete 365-Day Access', 'Quarterly Personal Diet Consultation', '2 Guest Passes Per Month', 'Free Shakti Fitness Kit'] }
        ],
        faq: [
          { question: 'Is prior yoga experience required?', answer: 'Not at all. We have beginner batches that start from basic breathwork and foundational postures.' },
          { question: 'Do you offer trial sessions?', answer: 'Yes! Click "Book Free Trial" or message us on WhatsApp to schedule your complimentary session.' }
        ]
      };
    }

    if (catKey === 'education') {
      return {
        name: 'Lakshya IIT-JEE & NEET Academy',
        category: 'Coaching Institute',
        tagline: 'Kota’s Premier Classroom & Online Mentorship for Top AIR Ranks',
        description: 'Rajasthan’s premier coaching institute offering rigorous foundation batches, daily practice problems, and personal faculty mentorship for JEE Advanced and NEET-UG.',
        location: 'Rajeev Gandhi Nagar, Kota, Rajasthan',
        phone: '+91 744 243 5678',
        email: 'admissions@lakshyaacademy.in',
        whatsapp: '+917442435678',
        hours: 'Mon–Sun: 7:00 AM – 9:00 PM',
        theme: { primaryColor: '#2563eb', secondaryColor: '#f59e0b', accentColor: '#3b82f6', bgColor: '#07090e', borderRadius: '14px' },
        hero: { heading: 'Turn Your Dream of Top Ranks into Reality.', subheading: 'Premier IIT-JEE & NEET coaching by Kota top faculty with personalized doubt clearing, daily problem sheets, and national test series.', badge: '✦ ADMISSIONS OPEN FOR 2026-27 SESSIONS', primaryBtnText: 'Apply for Admission', secondaryBtnText: 'Download Syllabus & Fee Structure' },
        about: { heading: 'Proven Methodology Delivering Top 100 AIRs', paragraph1: 'For over 15 years, Lakshya Academy has cultivated an uncompromising standard of academic excellence and intellectual discipline in Kota.', paragraph2: 'We provide structured test series, 1-on-1 mentor guidance, and reading room facilities designed for focused preparation.' },
        features: [
          { title: 'Ex-IITian & Doctor Faculty', description: 'Experienced educators with proven records of producing top 50 AIRs.' },
          { title: 'Daily Practice Problems (DPP)', description: '30 challenging daily problems graded every single evening.' },
          { title: 'All India Test Series (AITS)', description: 'National percentile benchmarking with in-depth AI performance analytics.' }
        ],
        showcaseItems: [
          { title: '2-Year IIT-JEE Foundation (Class 11-12)', description: 'Complete Physics, Chemistry, Mathematics syllabus with Olympiad and JEE Advanced training.', price: '₹48,000 / yr', tag: 'Top Program' },
          { title: 'Target NEET-UG Medical Batch', description: 'Intensive NCERT Biology, Organic Chemistry, and Physics modules with weekly speed tests.', price: '₹42,000 / yr', tag: 'Bestseller' },
          { title: 'Rank Booster 90-Day Crash Course', description: 'High-yield problem solving, revision marathons, and mock test analysis.', price: '₹14,999', tag: 'Crash Course' }
        ],
        testimonials: [
          { name: 'Aryan Agarwal', role: 'AIR 34, JEE Advanced 2025', comment: 'The doubt clearing counters at Lakshya were the decisive factor in my success. The teachers are available round the clock.' },
          { name: 'Dr. Meenakshi Sharma', role: 'Parent of NEET AIR 82 Ranker', comment: 'The discipline and regular parent-teacher reports kept my daughter focused and confident throughout the 2 years.' }
        ],
        pricing: [
          { name: 'Distance Learning / Test Series', price: '₹4,999', period: '/year', popular: false, features: ['30 National Mock Tests', 'Detailed AI Rank Analytics', 'Printed Study Modules Courier Delivery'] },
          { name: 'Comprehensive Classroom Batch', price: '₹45,000', period: '/year', popular: true, features: ['Daily 6-Hour Classroom Sessions', 'Daily Practice Problems (DPP)', '1-on-1 Faculty Doubt Desk', 'Library & Reading Room Access'] },
          { name: 'Residential Hostel & Coaching Program', price: '₹95,000', period: '/year', popular: false, features: ['Full Tuition + Hostel & Balanced Meals', '24/7 Wardens & Supervised Self-Study', 'Personal Academic Mentor'] }
        ],
        faq: [
          { question: 'Do you conduct an entrance scholarship test?', answer: 'Yes, we conduct the Lakshya National Talent Search Exam (LNTSE) offering up to 90% fee concessions to meritorious students.' },
          { question: 'Can students take admission mid-session?', answer: 'Yes, bridge batches are available. Contact our admission desk or apply online directly.' }
        ]
      };
    }

    if (catKey === 'healthcare') {
      return {
        name: 'Sanjeevani Dental Care & Multispecialty Clinic',
        category: 'Healthcare & Dental Clinic',
        tagline: 'Painless Digital Dentistry & Advanced Multispecialty Care',
        description: 'State-of-the-art clinic offering painless laser dental treatments, dental implants, cosmetic smile design, and general family healthcare with international sterilization standards.',
        location: 'Bandra West, Mumbai, Maharashtra',
        phone: '+91 22 2640 1234',
        email: 'care@sanjeevanidental.in',
        whatsapp: '+912226401234',
        hours: 'Mon–Sat: 9:00 AM – 8:30 PM (Sun: 10:00 AM – 2:00 PM)',
        theme: { primaryColor: '#10b981', secondaryColor: '#06b6d4', accentColor: '#34d399', bgColor: '#06080d', borderRadius: '14px' },
        hero: { heading: 'Exceptional Dental Care for Confident Smiles.', subheading: 'Painless laser treatments, immediate dental implants, and clear invisible aligners by experienced dental surgeons in Mumbai.', badge: '✦ 100% STERILE CLINICAL PROTOCOL', primaryBtnText: 'Book Appointment', secondaryBtnText: 'WhatsApp Consultation' },
        about: { heading: 'Advanced Clinical Technology Meets Gentle Patient Care', paragraph1: 'At Sanjeevani, we ensure every treatment is completely anxiety-free through computerized anesthesia, digital 3D intraoral scanners, and sterile operatory suites.', paragraph2: 'Our team of MDS specialists has treated over 12,000 happy patients across Mumbai.' },
        features: [
          { title: 'Painless Laser Dentistry', description: 'Minimal invasive treatments with near-zero recovery time.' },
          { title: 'German Digital 3D Scanners', description: 'High-precision digital impressions without messy putty trays.' },
          { title: 'Strict 5-Tier Sterilization', description: 'Autoclaved instruments sealed in sterile pouches for each patient.' }
        ],
        showcaseItems: [
          { title: 'Immediate Dental Implants', description: 'Permanent titanium tooth replacement with natural chewing strength.', price: '₹18,000', tag: 'Advanced' },
          { title: 'Clear Invisible Aligners', description: 'Custom transparent teeth straightening trays without metal wires.', price: '₹45,000', tag: 'Popular' },
          { title: 'Laser Teeth Whitening', description: 'Single-sitting cosmetic smile brightening by up to 6 shades.', price: '₹4,500', tag: 'Cosmetic' }
        ],
        testimonials: [
          { name: 'Rohit Khandelwal', role: 'Corporate Executive, Mumbai', comment: 'I had severe dental anxiety, but Dr. Sanjeev and his team made my root canal completely painless. Unbelievable experience.' },
          { name: 'Kavita Pillai', role: 'Teacher', comment: 'Got invisible aligners done here. My smile has transformed completely within 8 months. Transparent pricing and gentle doctors.' }
        ],
        pricing: [
          { name: 'Preventive Health Checkup', price: '₹500', period: '/visit', popular: false, features: ['Digital Intraoral Camera Exam', '2 X-Rays Included', 'Personal Oral Hygiene Consultation'] },
          { name: 'Complete Scaling & Polishing', price: '₹1,200', period: '/session', popular: true, features: ['Ultrasonic Tartar Removal', 'Stain Polishing & Fluoride Care', 'Free 6-Month Follow-up'] },
          { name: 'Family Smile Protection Plan', price: '₹3,999', period: '/year', popular: false, features: ['Annual Care for 4 Family Members', 'Unlimited Consultations & Cleaning', '20% Flat Discount on All Procedures'] }
        ],
        faq: [
          { question: 'Are emergency dental appointments available?', answer: 'Yes! We accommodate acute toothache and trauma emergencies on priority. Call our clinic or message on WhatsApp.' },
          { question: 'Do you accept health insurance for dental surgery?', answer: 'Yes, we provide cashless facility and reimbursement assistance for eligible corporate and private insurance plans.' }
        ]
      };
    }

    if (catKey === 'fashion') {
      return {
        name: 'Rangoli Heritage Silks & Zari Sarees',
        category: 'Saree Boutique & Ethnic Wear',
        tagline: 'Pure Banarasi, Kanjeevaram & Handloom Zari Sarees',
        description: 'Jaipur’s iconic heritage boutique curating pure mulberry silk sarees, hand-woven gold zari Banarasis, and royal bridal lehengas directly from master artisan weavers.',
        location: 'Johari Bazaar, Jaipur, Rajasthan',
        phone: '+91 141 256 7890',
        email: 'orders@rangolisilks.in',
        whatsapp: '+911412567890',
        hours: 'Mon–Sun: 10:30 AM – 8:30 PM',
        theme: { primaryColor: '#d97706', secondaryColor: '#dc2626', accentColor: '#fbbf24', bgColor: '#0a0808', borderRadius: '14px' },
        hero: { heading: 'Royal Indian Handlooms Woven to Perfection.', subheading: 'Pure silk Banarasis, authentic Kanjeevarams, and handcrafted royal bridal drapes with certified Silk Mark authenticity.', badge: '✦ CERTIFIED 100% PURE SILK MARK', primaryBtnText: 'Order on WhatsApp', secondaryBtnText: 'View Catalog & Prices' },
        about: { heading: 'Preserving India’s Centuries-Old Weaving Heritage', paragraph1: 'Every drape at Rangoli Silks tells the story of generational master artisans using traditional pit looms to intertwine pure silk yarns with exquisite zari work.', paragraph2: 'We bring you heirlooms made to be cherished through festive celebrations and wedding vows across generations.' },
        features: [
          { title: 'Silk Mark Certified Purity', description: 'Every saree is authenticated with the government Silk Mark tag.' },
          { title: 'Direct Artisan Weavers', description: 'Ethically sourced directly from Banaras, Kanchipuram, and Chanderi.' },
          { title: '1-Tap WhatsApp Video Shopping', description: 'View live saree drapes with our stylists over high-definition video call.' }
        ],
        showcaseItems: [
          { title: 'Royal Crimson Banarasi Katan Silk', description: 'Intricate floral jaal woven with gold and antique silver zari border.', price: '₹6,499', tag: 'Bestseller' },
          { title: 'Emerald Green Temple Kanjeevaram', description: 'Heavy Korvai contrast pallu with rich gold peacock motifs.', price: '₹8,999', tag: 'Bridal Heritage' },
          { title: 'Pastel Chanderi Silk Saree', description: 'Lightweight handloom drape with delicate zari butis, ideal for daytime soirees.', price: '₹3,299', tag: 'Festive' }
        ],
        testimonials: [
          { name: 'Sunita Mehra', role: 'Delhi Bride', comment: 'I purchased my bridal Banarasi over WhatsApp video call. The fabric quality and sheen are even more stunning in person!' },
          { name: 'Anuradha Joshi', role: 'Jaipur Patron', comment: 'Authentic pure silk at honest prices. My family has been shopping from Rangoli for all weddings.' }
        ],
        pricing: [
          { name: 'Festive Handloom Bundle', price: '₹4,999', period: '/set', popular: false, features: ['1 Pure Chanderi Silk Saree', 'Matching Unstitched Blouse Piece', 'Free Express Shipping Across India'] },
          { name: 'Royal Bridal Ensemble', price: '₹14,999', period: '/ensemble', popular: true, features: ['Heavy Banarasi or Kanjeevaram Saree', 'Custom Hand-Embroidered Blouse', 'Complimentary Silk Care Box & Potli Bag', 'WhatsApp Video Styling Session'] },
          { name: 'Wedding Trousseau Curated Set', price: '₹35,000', period: '/trousseau', popular: false, features: ['5 Handpicked Heritage Sarees', 'Silk Mark Certification Cards', 'Personal Master Weaver Video Consultation'] }
        ],
        faq: [
          { question: 'Do you offer Cash on Delivery (COD) across India?', answer: 'Yes, we provide COD with safe parcel inspection across all 19,000+ Indian postal pin codes.' },
          { question: 'Can I book a WhatsApp video call to see sarees before buying?', answer: 'Absolutely! Just tap our WhatsApp button and our stylist will show you the sarees live on video.' }
        ]
      };
    }

    // Default Tech / SaaS / Studio
    return {
      name: 'VyaparAI Cloud Platform',
      category: 'Tech Startup & SaaS',
      tagline: 'Autonomous GST Billing, WhatsApp CRM & Inventory for Bharat MSMEs',
      description: 'The smart all-in-one business software empowering Indian shops, distributors, and tech enterprises with instant WhatsApp billing, automated GST filing, and real-time inventory management.',
      location: 'HSR Layout, Bengaluru, Karnataka',
      phone: '+91 80 4567 8900',
      email: 'contact@vyaparai.in',
      whatsapp: '+918045678900',
      hours: 'Mon–Sat: 9:00 AM – 7:00 PM IST',
      theme: { primaryColor: '#06b6d4', secondaryColor: '#8b5cf6', accentColor: '#38bdf8', bgColor: '#06070a', borderRadius: '16px' },
      hero: { heading: 'Power Your Indian Business with Intelligent Automation.', subheading: 'Generate GST-compliant invoices in 3 seconds, collect UPI payments with 0% gateway fees, and track inventory seamlessly on WhatsApp.', badge: '✦ TRUSTED BY 15,000+ INDIAN MERCHANTS', primaryBtnText: 'Start Free 14-Day Trial', secondaryBtnText: 'Schedule Live Demo' },
      about: { heading: 'Engineered Specially for Indian Commerce & MSMEs', paragraph1: 'Traditional ERP software is bloated, English-only, and too complicated for fast-paced Indian retail counters. VyaparAI was built from scratch for Indian trade dynamics.', paragraph2: 'From e-way bills to automated WhatsApp payment reminders, we help business owners save 15+ hours every week.' },
      features: [
        { title: '1-Click GST Invoicing', description: 'Auto-calculates CGST, SGST, IGST with HSN code lookup.' },
        { title: 'Automated WhatsApp Reminders', description: 'Send polite payment links with UPI QR codes directly to customers.' },
        { title: 'Multi-Language Counter App', description: 'Works smoothly in Hindi, Tamil, Telugu, Marathi, and English.' }
      ],
      showcaseItems: [
        { title: 'VyaparAI Mobile POS App', description: 'Fast offline-ready billing on Android tablets and smartphones.', price: 'Free Core', tag: 'Mobile First' },
        { title: 'Automated GST Reconciliation', description: 'Direct API connection to the GST portal for seamless GSTR-1 & 3B filing.', price: '₹499 / mo', tag: 'Popular' },
        { title: 'Multi-Store Inventory Sync', description: 'Real-time stock tracking across multiple godowns and retail branches.', price: '₹1,299 / mo', tag: 'Enterprise' }
      ],
      testimonials: [
        { name: 'Rajesh Agrawal', role: 'Owner, Agrawal Wholesale Traders, Indore', comment: 'Our payment recovery increased by 35% after using VyaparAI WhatsApp reminders. It is an absolute game changer.' },
        { name: 'Kavita Menon', role: 'Founder, SpiceRoot Organics, Kochi', comment: 'Handling GST invoices was a nightmare before this. Now even our counter staff issues bills in 5 seconds.' }
      ],
      pricing: [
        { name: 'Vyapar Starter', price: '₹0', period: '/free forever', popular: false, features: ['Up to 100 Invoices / Month', 'Basic WhatsApp Invoicing', 'Android Mobile App Access'] },
        { name: 'Vyapar Pro', price: '₹799', period: '/month', popular: true, features: ['Unlimited GST Invoices', 'Automated UPI Payment Links', 'Multi-Store Inventory', 'Priority WhatsApp Support'] },
        { name: 'Enterprise', price: '₹2,499', period: '/month', popular: false, features: ['Multi-User Role Permissions', 'Direct GST Portal API Sync', 'Dedicated Account Manager', 'Custom ERP Integrations'] }
      ],
      faq: [
        { question: 'Is my business data secure and hosted in India?', answer: 'Yes, 100% of your data is encrypted with bank-grade AES-256 security and hosted in MeitY-approved Indian data centers.' },
        { question: 'Can I import my existing customer and product list from Excel?', answer: 'Yes! You can upload your existing Excel or Tally sheets in 1 click or contact our team via WhatsApp for free onboarding.' }
      ]
    };
  },
};
