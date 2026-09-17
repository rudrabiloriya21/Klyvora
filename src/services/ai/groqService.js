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
    hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop',
    ],
  },
};

function resolveCategoryKey(catStr = '') {
  const s = catStr.toLowerCase();
  if (s.includes('cafe') || s.includes('coffee')) return 'cafe';
  if (s.includes('bake') || s.includes('bread') || s.includes('pastry')) return 'bakery';
  if (s.includes('dine') || s.includes('rest') || s.includes('food') || s.includes('sushi')) return 'restaurant';
  if (s.includes('saas') || s.includes('tech') || s.includes('software') || s.includes('ai')) return 'saas';
  if (s.includes('fit') || s.includes('gym') || s.includes('pilates') || s.includes('yoga')) return 'fitness';
  if (s.includes('cloth') || s.includes('apparel') || s.includes('fashion') || s.includes('boutique')) return 'fashion';
  return 'agency';
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

    const systemPrompt = `You are the Lead Digital Architect for Klyvora Studio (created by Xeorvia).
Generate a complete, world-class, bespoke website specification tailored specifically to the user's prompt.
You MUST output a valid JSON object matching this schema exactly:
{
  "name": "Creative business or website name",
  "category": "Cafe | Bakery | Restaurant | SaaS Startup | Agency | Portfolio | E-commerce | Fitness | Consulting | Local Service",
  "tagline": "Compelling, memorable tagline (under 12 words)",
  "description": "Comprehensive brand summary and value proposition (2-3 sentences)",
  "location": "City, State or Global",
  "phone": "+1 (555) 000-0000",
  "email": "contact@domain.com",
  "whatsapp": "+15550000000",
  "hours": "Operating hours e.g. Mon–Sun: 7:00 AM – 6:00 PM",
  "theme": {
    "primaryColor": "Hex color tailored to brand (e.g. #e07a5f for warm cafe, #10b981 for emerald, #06b6d4 for tech cyan, #8b5cf6 for luxury violet, #f59e0b for amber hearth, #ef4444 for crimson dining)",
    "secondaryColor": "Harmonious hex color code",
    "accentColor": "Vibrant accent hex color code",
    "bgColor": "Deep dark hex background e.g. #07080c, #09090b, #0c0a09",
    "borderRadius": "14px"
  },
  "hero": {
    "heading": "Inspiring, punchy main H1 headline (under 10 words)",
    "subheading": "Engaging sub-headline detailing the unique value proposition",
    "badge": "✦ EYE-CATCHING ALL-CAPS BADGE",
    "primaryBtnText": "Primary CTA label e.g. Explore Menu, View Plans, Book Session",
    "secondaryBtnText": "Secondary CTA label e.g. WhatsApp Order, Contact Us"
  },
  "about": {
    "heading": "About section title",
    "paragraph1": "Rich narrative about the craft, vision, and philosophy.",
    "paragraph2": "Secondary narrative emphasizing quality, sourcing, and customer dedication."
  },
  "features": [
    { "title": "Feature 1 Title", "description": "Compelling explanation of this offering or standard" },
    { "title": "Feature 2 Title", "description": "Compelling explanation of this offering or standard" },
    { "title": "Feature 3 Title", "description": "Compelling explanation of this offering or standard" }
  ],
  "showcaseItems": [
    { "title": "Signature Item 1", "description": "Rich culinary, product, or service details", "price": "$12.00", "tag": "BESTSELLER" },
    { "title": "Signature Item 2", "description": "Rich culinary, product, or service details", "price": "$16.50", "tag": "SIGNATURE" },
    { "title": "Signature Item 3", "description": "Rich culinary, product, or service details", "price": "$9.00", "tag": "POPULAR" },
    { "title": "Signature Item 4", "description": "Rich culinary, product, or service details", "price": "$22.00", "tag": "SEASONAL" }
  ],
  "testimonials": [
    { "name": "Elena Rostova", "role": "Architect & Regular", "comment": "Authentic, glowing customer quote highlighting quality." },
    { "name": "Marcus Chen", "role": "Creative Director", "comment": "Another glowing review highlighting exceptional taste or craft." }
  ],
  "pricing": [
    { "name": "Starter", "price": "$29", "period": "/mo or flat", "popular": false, "features": ["Feature A", "Feature B", "Feature C"] },
    { "name": "Professional", "price": "$79", "period": "/mo or flat", "popular": true, "features": ["Everything in Starter", "Feature D", "Feature E", "Priority Support"] },
    { "name": "Bespoke", "price": "Custom", "period": "", "popular": false, "features": ["Dedicated Consultant", "Unlimited Access", "24/7 SLA"] }
  ],
  "faq": [
    { "question": "Relevant question about reservations, ordering, or process?", "answer": "Clear, informative answer providing confidence." },
    { "question": "What is the pre-order or consultation policy?", "answer": "Customer-friendly explanation." },
    { "question": "How can we contact the team directly?", "answer": "Direct assistance channels including WhatsApp and email." }
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
    const brandName = data.name || 'Omni Digital Studio';
    const category = data.category || 'Digital Creation';
    const description = data.description || originalPrompt;
    const isFood = ['restaurant', 'bakery', 'cafe'].includes(resolveCategoryKey(category));

    // 1. Navigation
    const navLinks = [
      { label: 'Home', url: '#home' },
      { label: 'About', url: '#about' },
      { label: isFood ? 'Menu' : 'Offerings', url: '#products' },
      { label: 'Reviews', url: '#testimonials' },
      { label: 'Pricing', url: '#pricing' },
      { label: 'FAQ', url: '#faq' },
      { label: 'Contact', url: '#contact' },
    ];

    // 2. Hero Section
    const heroSection = createSection('hero', {
      badge: data.hero?.badge || '✦ XEORVIA INTELLIGENCE',
      heading: data.hero?.heading || `${brandName} — Crafted with Purpose.`,
      subheading: data.hero?.subheading || description,
      primaryBtnText: data.hero?.primaryBtnText || (data.whatsapp ? 'Order via WhatsApp' : 'Explore Offerings'),
      primaryBtnUrl: data.whatsapp ? '#whatsapp' : '#products',
      secondaryBtnText: data.hero?.secondaryBtnText || 'Get in Touch',
      secondaryBtnUrl: '#contact',
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

    // 4. Products / Menu Section (FULLY POPULATED)
    const showcaseList = (data.showcaseItems || data.products || []).map((item, idx) => ({
      name: item.title || item.name || `Signature Offering 0${idx + 1}`,
      price: item.price || (isFood ? `$${(8 + idx * 4.5).toFixed(2)}` : '$49.00'),
      desc: item.description || item.desc || 'Prepared with highest standard ingredients and exceptional care.',
      tag: item.tag || (idx === 0 ? 'BESTSELLER' : idx === 1 ? 'SIGNATURE' : 'POPULAR'),
      imageUrl: item.imageUrl || getCuratedPhoto(category, idx),
    }));

    const productsSection = createSection('products', {
      badge: isFood ? 'DAILY MENU' : 'FEATURED OFFERINGS',
      heading: isFood ? 'Artisan Provisions & Selections' : 'Signature Products & Solutions',
      subheading: 'Curated and crafted with precision for our patrons and clients.',
      items: showcaseList.length > 0 ? showcaseList : [
        { name: 'Signature Offering 01', price: '$14.00', desc: 'Handcrafted daily with premium sourcing.', tag: 'Bestseller', imageUrl: getCuratedPhoto(category, 0) },
        { name: 'Signature Offering 02', price: '$18.50', desc: 'Award-winning craft, seasonal availability.', tag: 'Signature', imageUrl: getCuratedPhoto(category, 1) },
        { name: 'Signature Offering 03', price: '$11.00', desc: 'Customer favorite, freshly prepared.', tag: 'Popular', imageUrl: getCuratedPhoto(category, 2) },
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
      author: t.name || t.author || 'Elena Rostova',
      role: t.role || 'Verified Patron',
      rating: 5,
    }));

    const testimonialsSection = createSection('testimonials', {
      badge: 'COMMUNITY REVIEWS',
      heading: 'Endorsed by Regulars & Critics',
      items: reviewsList.length > 0 ? reviewsList : [
        { quote: 'The attention to craft is unmatched. Hands down the finest experience in the city.', author: 'Elena Rostova', role: 'Architect & Regular', rating: 5 },
        { quote: 'Fast, seamless ordering via WhatsApp and impeccable quality every single time.', author: 'Marcus Vance', role: 'Design Director', rating: 5 },
      ],
    });

    // 7. Pricing Section (FULLY POPULATED)
    const pricingList = (data.pricing || []).map((p, idx) => ({
      name: p.name || `Tier 0${idx + 1}`,
      price: p.price || (idx === 0 ? '$29' : idx === 1 ? '$79' : '$199'),
      period: p.period || '/month',
      desc: p.description || (idx === 1 ? 'Our most popular comprehensive engagement.' : 'Essential package with dedicated support.'),
      popular: Boolean(p.popular || idx === 1),
      features: Array.isArray(p.features) ? p.features : ['Full Access', 'Dedicated Account Lead', 'Priority 24/7 SLA'],
    }));

    const pricingSection = createSection('pricing', {
      badge: 'TRANSPARENT PLANS',
      heading: 'Straightforward Engagements',
      subheading: 'Choose the plan tailored to your scale and requirements.',
      plans: pricingList.length > 0 ? pricingList : [
        { name: 'Essential', price: '$29', period: '/month', desc: 'Perfect for individuals and small teams.', popular: false, features: ['Core Features', 'Email Support', 'Weekly Updates'] },
        { name: 'Professional', price: '$79', period: '/month', desc: 'Our most popular tier for growing ventures.', popular: true, features: ['Everything in Essential', 'Priority Support', 'Full Analytics', 'Dedicated Manager'] },
        { name: 'Bespoke', price: 'Custom', period: '', desc: 'Custom enterprise integration and support.', popular: false, features: ['Unlimited Bandwidth', 'Dedicated SLA', 'Custom Integrations'] },
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
        { q: 'How do I place an order or booking?', a: 'You can reach out directly via WhatsApp or submit our inquiry form below.' },
        { q: 'What is your cancellation or modification policy?', a: 'We offer flexible 24-hour adjustments on all reservations and orders.' },
        { q: 'Do you cater to custom corporate or private requests?', a: 'Yes, contact our team directly for tailored private arrangements.' },
      ],
    });

    // 9. Contact Section
    const contactSection = createSection('contact', {
      badge: 'GET IN TOUCH',
      heading: 'Connect with Our Team',
      subheading: `Located in ${data.location || 'San Francisco, CA'}. We welcome your inquiry and visit.`,
    });

    // 10. Footer Section
    const footerSection = createSection('footer', {
      businessName: brandName,
      tagline: data.tagline || description.slice(0, 80),
      links: navLinks,
    });

    const sections = [
      createSection('navigation', {
        logoText: brandName,
        links: navLinks,
        ctaText: data.whatsapp ? 'WhatsApp Order' : 'Get in Touch',
        ctaUrl: data.whatsapp ? '#whatsapp' : '#contact',
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
      primaryColor: data.theme?.primaryColor || '#06b6d4',
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
        location: data.location || 'San Francisco, CA',
        contact: {
          email: data.email || 'contact@domain.com',
          phone: data.phone || '+1 (555) 000-0000',
          whatsapp: data.whatsapp || '+15550000000',
          address: data.location || 'San Francisco, CA',
          openingHours: data.hours || 'Mon–Sun: 7:00 AM – 7:00 PM',
        },
        social: {
          instagram: `https://instagram.com/${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        },
        ctaText: data.whatsapp ? 'WhatsApp Order' : 'Contact Us',
        ctaLink: data.whatsapp ? '#whatsapp' : '#contact',
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
        name: 'Sakura Omakase Lounge',
        category: 'Restaurant',
        tagline: 'The Art of Edomae Culinary Splendor',
        description: 'An intimate 12-seat Japanese sushi counter and natural wine salon serving seasonal Toyosu market arrivals.',
        location: 'Downtown San Francisco, CA',
        phone: '+1 (555) 789-0123',
        email: 'reservations@sakuraomakase.com',
        whatsapp: '+15557890123',
        hours: 'Tue–Sun: 5:30 PM – 10:30 PM',
        theme: { primaryColor: '#ef4444', secondaryColor: '#f59e0b', accentColor: '#f43f5e', bgColor: '#06070a', borderRadius: '14px' },
        hero: { heading: 'Culinary Artistry Meets Edomae Mastery.', subheading: 'A multi-course omakase journey paired with rare cellar vintages and artisanal sake.', badge: '✦ MICHELIN GUIDED EXCELLENCE', primaryBtnText: 'Reserve Omakase', secondaryBtnText: 'WhatsApp Inquiries' },
        about: { heading: 'A Dedication to the Season & Ocean', paragraph1: 'Every morning, our chef team inspects direct air freight shipments from Tokyo fish auctions, dry-aging and curing seafood to its peak umami.', paragraph2: 'We believe hospitality is an unspoken conversation of care, warmth, and precision.' },
        features: [
          { title: 'Wild Toyosu Seafood', description: 'Direct weekly air-freight from Tokyo fish markets.' },
          { title: 'Aged Red Vinegar Shari', description: 'Niigata rice seasoned with vintage akazu vinegar.' },
          { title: 'Curated Sake Pairing', description: 'Small-batch artisanal junmai daiginjo cellars.' }
        ],
        showcaseItems: [
          { title: 'Otoro Nigiri with Fresh Wasabi', description: 'Fatty bluefin tuna belly gently kissed by charcoal binchotan.', price: '$18.00', tag: 'Signature' },
          { title: 'Hokkaido Bafun Uni Spoon', description: 'Sweet creamy sea urchin crowned with Oscietra caviar.', price: '$24.00', tag: 'Bestseller' },
          { title: 'A5 Miyazaki Wagyu Sukiyaki', description: 'Thinly shaved marble beef with slow-poached onsen yolk.', price: '$28.00', tag: 'Deluxe' }
        ],
        testimonials: [
          { name: 'Kaito Tanaka', role: 'Culinary Critic', comment: 'The finest Edomae sushi experience on the West Coast. Simply magnificent.' },
          { name: 'Claire Dupont', role: 'Sommelier', comment: 'The wine and sake pairings elevated each delicate bite to absolute poetry.' }
        ],
        pricing: [
          { name: 'Tasting Menu', price: '$165', period: '/guest', popular: false, features: ['12 Nigiri Courses', 'Miso Soup & Chawanmushi', 'Seasonal Dessert'] },
          { name: 'Grand Omakase', price: '$245', period: '/guest', popular: true, features: ['18 Premium Courses', 'Oscietra Caviar & Uni', 'Full Sake Pairing', 'Priority Booking'] }
        ],
        faq: [
          { question: 'Do you accommodate dietary restrictions?', answer: 'We can accommodate shellfish or gluten sensitivities with 48-hour advance notice.' },
          { question: 'How can I reserve a counter seat?', answer: 'Reservations open on the 1st of every month via our website or WhatsApp concierge.' }
        ]
      };
    }

    if (catKey === 'cafe' || catKey === 'bakery') {
      return {
        name: 'Aura Artisan Roastery & Bakes',
        category: 'Cafe',
        tagline: 'Single-Origin Roasts & Natural Fermentations',
        description: 'Boutique coffee bar and artisan bakery serving slow-poured micro-roasts, cold brews, and flaky morning viennoiserie.',
        location: 'San Francisco, CA',
        phone: '+1 (555) 234-8901',
        email: 'hello@auracoffee.com',
        whatsapp: '+15552348901',
        hours: 'Mon–Sun: 6:30 AM – 4:00 PM',
        theme: { primaryColor: '#e07a5f', secondaryColor: '#3d405b', accentColor: '#81b29a', bgColor: '#0c0a09', borderRadius: '14px' },
        hero: { heading: 'Slow Coffee & Warm Morning Bakes.', subheading: 'Naturally fermented sourdough buns, single-origin espresso, and neighborhood warmth.', badge: '✦ FRESH ROASTED DAILY', primaryBtnText: 'Explore Menu', secondaryBtnText: 'WhatsApp Order' },
        about: { heading: 'From Farm to Roaster, Without Compromise', paragraph1: 'We partner directly with regenerative coffee cooperatives across Ethiopia and Colombia, roasting weekly in small batches.', paragraph2: 'Our bakery pairs these nuanced beans with sourdough breads fermented for 36 hours.' },
        features: [
          { title: 'Single-Origin Direct Trade', description: 'Direct relationship coffee beans roasted every Tuesday.' },
          { title: '36-Hour Sourdough Ferment', description: 'Wild yeast sourdough buns and rustic country loaves.' },
          { title: 'Pre-Order via WhatsApp', description: 'Skip morning queues with instant text ordering.' }
        ],
        showcaseItems: [
          { title: 'Kyoto Slow-Drip Cold Brew', description: '12-hour tower extraction with notes of dark cacao and citrus.', price: '$6.25', tag: 'Bestseller' },
          { title: 'Cardamom Pistachio Morning Knot', description: 'Flaky laminated pastry rolled in crushed cardamom sugar.', price: '$5.50', tag: 'Baked Daily' },
          { title: 'Ceremonial Uji Matcha Latte', description: 'First-harvest Kyoto green tea with organic oat milk.', price: '$6.50', tag: 'Signature' }
        ],
        testimonials: [
          { name: 'Marcus Chen', role: 'Architect & Regular', comment: 'The Kyoto Cold Brew and Cardamom knot make my mornings complete.' },
          { name: 'Elena Vance', role: 'Coffee Enthusiast', comment: 'The cleanest pour-overs in the Bay Area. Impeccable roasting.' }
        ],
        pricing: [
          { name: 'Coffee Club', price: '$22', period: '/month', popular: true, features: ['1 Bag Fresh Whole Bean', 'Free Drink in Store', '10% Off All Pastries'] },
          { name: 'Office Tier', price: '$85', period: '/month', popular: false, features: ['4 Bags Fresh Whole Bean', 'Weekly Delivery', 'Free Brewing Equipment Consultation'] }
        ],
        faq: [
          { question: 'Do you roast your own beans?', answer: 'Yes, we roast in-house in small 5kg batches every Tuesday.' },
          { question: 'Can I order online for morning pickup?', answer: 'Yes! Text us via WhatsApp and your bag will be warm at the counter.' }
        ]
      };
    }

    if (catKey === 'fitness') {
      return {
        name: 'Apex Athletic Club',
        category: 'Fitness',
        tagline: 'High-Performance Functional Training & Recovery',
        description: 'Premier athletic training facility featuring small-group conditioning, strength programming, and infrared sauna recovery.',
        location: 'San Francisco, CA',
        phone: '+1 (555) 456-7890',
        email: 'info@apexathletic.com',
        whatsapp: '+15554567890',
        hours: 'Mon–Fri: 5:00 AM – 9:00 PM',
        theme: { primaryColor: '#10b981', secondaryColor: '#06b6d4', accentColor: '#34d399', bgColor: '#06070a', borderRadius: '12px' },
        hero: { heading: 'Train with Purpose. Recover with Precision.', subheading: 'Evidence-based conditioning, expert coaching, and state-of-the-art recovery bays.', badge: '✦ ELITE PERFORMANCE SANCTUARY', primaryBtnText: 'Start 7-Day Trial', secondaryBtnText: 'View Classes' },
        about: { heading: 'The Standard of Sustainable Strength', paragraph1: 'We believe fitness is not about exhaustion—it is about intelligent progression, structural durability, and longevity.', paragraph2: 'Every member receives personalized baseline metrics and movement screenings.' },
        features: [
          { title: 'Small Group Coaching', description: 'Maximum 8 athletes per coach for dialed-in form.' },
          { title: 'Contrast Recovery Bays', description: 'Cold plunge tubs and private infrared saunas.' },
          { title: 'Custom Programming', description: 'Tailored macrocycles tracking real hypertrophy and VO2 max.' }
        ],
        showcaseItems: [
          { title: 'Functional Strength & Engine', description: 'Compound barbell movements paired with high-output conditioning.', price: '$35 / drop-in', tag: 'Popular' },
          { title: 'Contrast Therapy & Cold Plunge', description: 'Guided 45-minute infrared sauna and 38°F plunge session.', price: '$40 / session', tag: 'Recovery' },
          { title: 'Private Performance Assessment', description: 'Comprehensive movement screen and VO2 threshold test.', price: '$99 / session', tag: 'New' }
        ],
        testimonials: [
          { name: 'David Miller', role: 'Marathon Runner', comment: 'The contrast recovery bays and strength coaching cured my chronic knee pain.' },
          { name: 'Sarah Jenkins', role: 'CrossFit Competitor', comment: 'The most knowledgeable coaches in the city. Real measurable gains.' }
        ],
        pricing: [
          { name: 'Unlimited Membership', price: '$220', period: '/month', popular: true, features: ['Unlimited Classes', 'Sauna & Plunge Access', 'Monthly Screenings'] },
          { name: 'Recovery Only', price: '$120', period: '/month', popular: false, features: ['8 Recovery Bay Sessions', 'Towel & Locker Service'] }
        ],
        faq: [
          { question: 'Is this beginner-friendly?', answer: 'Yes! Every session scales to your current fitness level.' },
          { question: 'How do I schedule my first session?', answer: 'Click Start Trial or WhatsApp us to book your baseline screening.' }
        ]
      };
    }

    // Default Tech / SaaS / Studio
    return {
      name: 'Veloce Intelligence Engine',
      category: 'SaaS Startup',
      tagline: 'Real-Time Telemetry & Autonomous Workflows',
      description: 'The modern distributed streaming platform empowering engineering teams to monitor, debug, and automate edge systems at scale.',
      location: 'San Francisco, CA & Remote',
      phone: '+1 (555) 902-1200',
      email: 'hello@veloce.dev',
      whatsapp: '+15559021200',
      hours: '24/7 Cloud Availability',
      theme: { primaryColor: '#06b6d4', secondaryColor: '#8b5cf6', accentColor: '#38bdf8', bgColor: '#06070a', borderRadius: '16px' },
      hero: { heading: 'Autonomous Edge Telemetry for Cloud Scale.', subheading: 'Stream events, monitor distributed traces, and deploy self-healing architectures with millisecond latency.', badge: '✦ POWERED BY SYSTEM ARCHITECT', primaryBtnText: 'Start Free Trial', secondaryBtnText: 'Book Live Demo' },
      about: { heading: 'Observability Engineered for the Next Decade', paragraph1: 'Traditional monitoring tools choke on high-cardinality streaming data. Veloce was built from the ground up on modern vectorized engines.', paragraph2: 'We empower developers to query billions of telemetry points in under 30 milliseconds.' },
      features: [
        { title: 'Sub-Millisecond Ingestion', description: 'Zero-loss streaming pipeline handling 100k+ events/sec.' },
        { title: 'Self-Healing Anomaly Routing', description: 'Autonomous edge rules that quarantine bad deployments instantly.' },
        { title: 'Single Pane of Glass', description: 'Unified tracing, metrics, and application logs in one dashboard.' }
      ],
      showcaseItems: [
        { title: 'Veloce Edge Agent', description: 'Lightweight eBPF daemon with sub-1% CPU overhead.', price: 'Free Core', tag: 'Open Source' },
        { title: 'Real-Time Vector Pipeline', description: 'High-throughput stream processing engine with SQL queries.', price: '$0.05 / GB', tag: 'Core Platform' },
        { title: 'Autonomous Incident Triager', description: 'AI agent that pins root cause commits in under 60 seconds.', price: '$49 / mo', tag: 'Flagship' }
      ],
      testimonials: [
        { name: 'Alex Rivera', role: 'VP Infrastructure at CloudScale', comment: 'Veloce cut our mean time to resolution from 45 minutes down to 3 minutes.' },
        { name: 'Samantha Wu', role: 'Staff SRE at NexaPay', comment: 'The cleanest developer telemetry platform we have ever integrated.' }
      ],
      pricing: [
        { name: 'Developer', price: '$0', period: '/free forever', popular: false, features: ['Up to 5M Events / Mo', '3-Day Retention', 'Community Slack'] },
        { name: 'Team', price: '$89', period: '/month', popular: true, features: ['50M Events / Mo', '30-Day Retention', 'Autonomous Remediation', 'Priority Support'] },
        { name: 'Enterprise', price: 'Custom', period: '', popular: false, features: ['Unlimited Events', 'Dedicated VPC Peering', 'Custom SLA & SOC2'] }
      ],
      faq: [
        { question: 'How hard is it to integrate Veloce into our Kubernetes cluster?', answer: 'You can deploy via our single Helm chart in under 2 minutes.' },
        { question: 'Is Veloce compliant with SOC2 and GDPR?', answer: 'Yes, all data in transit and at rest is AES-256 encrypted and SOC2 Type II certified.' }
      ]
    };
  },
};
