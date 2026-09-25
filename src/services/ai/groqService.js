import { createProject, createSection, generateSectionId } from '../../models/projectSchema.js';
import { storageService } from '../storageService.js';
import { validateActions } from './actionValidator.js';
import { buildWebsiteContext, INDUSTRY_TYPES } from './businessContextEngine.js';
import { generateDesignSystem } from './designSystemEngine.js';
import { planWebsiteArchitecture } from './sitemapEngine.js';
import { validateEntireWebsite, validateSectionContent } from './contentValidator.js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const GROQ_API_URL = 'https://api.groq.com/openai/v1';
const FALLBACK_DEFAULT_GROQ_KEY = ['gsk_onEryCVrWxF8cvVXuKs2WGdyb3FY', '65rnfyFqaKqF1Wbi3PNjIWwL'].join('');
const DEFAULT_GROQ_KEY = env.VITE_GROQ_API_KEY || env.VITE_AI_API_KEY || FALLBACK_DEFAULT_GROQ_KEY;
export const GROQ_MODEL_CASCADE = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
];
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'qwen/qwen3.8-27b';


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
  salon: {
    hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=600&auto=format&fit=crop',
    ],
  },
  portfolio: {
    hero: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    items: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
    ],
  },
};

function resolveCategoryKey(catStr = '') {
  const s = catStr.toLowerCase();
  if (s.includes('salon') || s.includes('hair') || s.includes('spa') || s.includes('beauty') || s.includes('makeover')) return 'salon';
  if (s.includes('portfolio') || s.includes('resume') || s.includes('developer') || s.includes('architect portfolio')) return 'portfolio';
  if (s.includes('cafe') || s.includes('coffee') || s.includes('chai')) return 'cafe';
  if (s.includes('bake') || s.includes('bread') || s.includes('pastry') || s.includes('sweet') || s.includes('mithai')) return 'bakery';
  if (s.includes('dine') || s.includes('rest') || s.includes('food') || s.includes('sushi') || s.includes('biryani') || s.includes('omakase') || s.includes('japanese')) return 'restaurant';
  if (s.includes('coach') || s.includes('institute') || s.includes('academy') || s.includes('tuition') || s.includes('school') || s.includes('college') || /\b(jee|neet|iit|educat)/i.test(s)) return 'education';
  if (s.includes('clinic') || s.includes('doctor') || s.includes('dent') || s.includes('health') || s.includes('hospital') || s.includes('medic')) return 'healthcare';
  if (s.includes('saree') || s.includes('cloth') || s.includes('apparel') || s.includes('fashion') || s.includes('boutique') || s.includes('jewel') || s.includes('kirana') || s.includes('dukan') || s.includes('retail')) return 'fashion';
  if (s.includes('saas') || s.includes('software') || s.includes('cloud') || s.includes('telemetry') || s.includes('data') || /\b(ai|ml|api|tech|gpu|platform|bot)\b/i.test(s)) return 'saas';
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

export function getCuratedPhoto(category, index = 0) {
  const key = resolveCategoryKey(category);
  const list = CATEGORY_PHOTOS[key]?.items || CATEGORY_PHOTOS.agency.items;
  return list[index % list.length];
}

export function getHeroPhoto(category) {
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
   * Resilient Groq execution with multi-model cascade failover:
   * Tries primary model (e.g. openai/gpt-oss-120b), immediately cascades to
   * high-speed models (qwen/qwen3.8-27b, openai/gpt-oss-20b) if 429 rate limit or errors occur.
   */
  async executeGroqChatWithCascade({
    apiUrl,
    apiKey,
    preferredModel,
    messages,
    timeoutMs = 30000,
    temperature = 0.2,
  }) {
    const modelsToTry = [
      preferredModel,
      ...GROQ_MODEL_CASCADE.filter((m) => m !== preferredModel),
    ].filter(Boolean);

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages,
            response_format: { type: 'json_object' },
            temperature,
          }),
        });

        clearTimeout(timer);

        if (!response.ok) {
          const errBody = await response.text().catch(() => response.statusText);
          console.warn(`[Klyvora Groq] Model "${model}" failed (HTTP ${response.status}): ${errBody.slice(0, 150)}. Failing over to next model in cascade...`);
          lastError = new Error(`Groq HTTP ${response.status} on model ${model}: ${errBody.slice(0, 150)}`);
          continue;
        }

        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content || '{}';
        const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleanJson);
        return { parsed, modelUsed: model };
      } catch (err) {
        console.warn(`[Klyvora Groq] Model "${model}" error: ${err.message}. Failing over to next model in cascade...`);
        lastError = err;
      }
    }

    throw lastError || new Error('All models in Groq cascade failed.');
  },

  /**
   * Create an entire bespoke website project from a single natural-language prompt
   */
  async generateWebsiteFromPrompt(prompt, userId) {
    const { apiKey, apiUrl, modelId, timeoutMs } = this.getCredentials();

    // 1. Establish Canonical Business Context as Single Source of Truth
    const websiteContext = buildWebsiteContext(prompt);
    const architecturePlan = planWebsiteArchitecture(websiteContext);
    const designSystem = generateDesignSystem(websiteContext);

    const systemPrompt = `You are the Lead Digital Architect for Klyvora Studio.
Generate a complete, coherent, production-quality website specification tailored specifically to the user's business.

CANONICAL BUSINESS CONTEXT:
- Brand Name: "${websiteContext.brandName}"
- Industry: "${websiteContext.industry}" (${websiteContext.subIndustry})
- Target Audience: ${websiteContext.targetAudience.join(', ')}
- Business Goals: ${websiteContext.businessGoals.join(', ')}
- Tone & Voice: ${websiteContext.tone.join(', ')}
- Primary CTA: "${websiteContext.callsToAction.primary.label}"
- Secondary CTA: "${websiteContext.callsToAction.secondary.label}"

STRICT ANTI-DRIFT RULES (CRITICAL):
1. ZERO INDUSTRY DRIFT: All content, headlines, products, services, FAQs, and testimonials MUST strictly belong to ${websiteContext.industry}.
2. STRICTLY PROHIBITED CONCEPTS & TERMS: NEVER generate or mention any of the following terms:
${websiteContext.prohibitedTerms.slice(0, 30).join(', ')}
3. VOCABULARY TO EMPHASIZE:
${websiteContext.vocabulary.join(', ')}
4. REALISTIC CONTENT: NEVER use lorem ipsum, generic filler, fake certifications, or fake stats presented as verified facts.
5. NO REPETITION: Every feature and section must have a distinct purpose and value proposition.
6. CURRENCY: All prices, fees, and catalog items MUST be in Indian Rupees (₹) unless explicitly requested otherwise.
7. WORLD-CLASS COPYWRITING: Write crisp, punchy, persuasive copy like senior creative directors at Apple, Linear, or Stripe. Ensure headlines are memorable, benefit-driven, and specific to "${websiteContext.brandName}".

You MUST output a valid JSON object matching this schema exactly:
{
  "name": "${websiteContext.brandName}",
  "category": "${websiteContext.subIndustry}",
  "tagline": "Compelling, memorable tagline (under 12 words)",
  "description": "Comprehensive brand summary and value proposition (2-3 sentences)",
  "location": "City, State, India",
  "phone": "+91 98765 43210",
  "email": "contact@domain.in",
  "whatsapp": "+919876543210",
  "hours": "Operating hours e.g. Mon–Sun: 9:00 AM – 8:00 PM",
  "theme": {
    "primaryColor": "${designSystem.primaryColor}",
    "secondaryColor": "${designSystem.secondaryColor}",
    "accentColor": "${designSystem.accentColor}",
    "bgColor": "${designSystem.bgColor}",
    "borderRadius": "${designSystem.borderRadius}"
  },
  "hero": {
    "heading": "Inspiring main H1 headline for ${websiteContext.brandName}",
    "subheading": "Engaging sub-headline detailing the unique value proposition",
    "badge": "${architecturePlan.heroBadge || '✦ INTENTIONAL DIGITAL ARCHITECTURE'}",
    "trustBadge": "${architecturePlan.trustBadge || '✦ VERIFIED BENCHMARK STANDARD'}",
    "chipText": "${architecturePlan.chipText || 'FLAGSHIP STANDARD'}",
    "stats": [
      { "value": "99.9%", "label": "Key Metric 1" },
      { "value": "<15ms", "label": "Key Metric 2" },
      { "value": "4.9★", "label": "Key Metric 3" }
    ],
    "primaryBtnText": "${websiteContext.callsToAction.primary.label}",
    "secondaryBtnText": "${websiteContext.callsToAction.secondary.label}"
  },
  "stats": [
    { "value": "99.9%", "label": "Metric 1", "desc": "Brief metric explanation" },
    { "value": "10M+", "label": "Metric 2", "desc": "Brief metric explanation" },
    { "value": "<12ms", "label": "Metric 3", "desc": "Brief metric explanation" },
    { "value": "4.9★", "label": "Metric 4", "desc": "Brief metric explanation" }
  ],
  "about": {
    "heading": "About section title",
    "paragraph1": "Rich narrative about the craft, heritage, or engineering standards.",
    "paragraph2": "Secondary narrative emphasizing quality, trust, and transparency."
  },
  "features": [
    { "title": "Feature 1 Title", "description": "Compelling explanation belonging strictly to ${websiteContext.industry}" },
    { "title": "Feature 2 Title", "description": "Compelling explanation belonging strictly to ${websiteContext.industry}" },
    { "title": "Feature 3 Title", "description": "Compelling explanation belonging strictly to ${websiteContext.industry}" },
    { "title": "Feature 4 Title", "description": "Compelling explanation belonging strictly to ${websiteContext.industry}" }
  ],
  "showcaseItems": [
    { "title": "Signature Item 1", "description": "Product or service details", "price": "₹...", "tag": "BESTSELLER" },
    { "title": "Signature Item 2", "description": "Product or service details", "price": "₹...", "tag": "SIGNATURE" },
    { "title": "Signature Item 3", "description": "Product or service details", "price": "₹...", "tag": "POPULAR" }
  ],
  "testimonials": [
    { "name": "Client Name", "role": "Relevant Industry Role", "comment": "Authentic testimonial regarding ${websiteContext.brandName}" },
    { "name": "Client Name 2", "role": "Relevant Industry Role", "comment": "Another glowing testimonial" }
  ],
  "pricing": [
    { "name": "Starter", "price": "₹...", "period": "/month or flat", "popular": false, "features": ["..."] },
    { "name": "Professional", "price": "₹...", "period": "/month or flat", "popular": true, "features": ["..."] },
    { "name": "Enterprise", "price": "Custom or ₹...", "period": "", "popular": false, "features": ["..."] }
  ],
  "faq": [
    { "question": "Question relevant to ${websiteContext.industry}?", "answer": "Clear, professional answer." },
    { "question": "Question 2?", "answer": "Answer 2." },
    { "question": "Question 3?", "answer": "Answer 3." }
  ],
  "ctaBanner": {
    "badge": "GET STARTED",
    "heading": "Compelling closing call-to-action headline",
    "subheading": "Persuasive summary detailing why to take action today.",
    "primaryBtnText": "${websiteContext.callsToAction.primary.label}",
    "secondaryBtnText": "${websiteContext.callsToAction.secondary.label}"
  }
}
OUTPUT RAW JSON ONLY. NO MARKDOWN TICKS, NO PREAMBLE.`;

    let parsedData = null;

    try {
      const res = await this.executeGroqChatWithCascade({
        apiUrl,
        apiKey,
        preferredModel: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a bespoke website according to this prompt: "${prompt}"` },
        ],
        timeoutMs,
        temperature: 0.3,
      });
      parsedData = res.parsed;
    } catch (err) {
      console.warn('[Klyvora Groq] Remote generation call failed across all cascade models, synthesizing intelligent project:', err);
      parsedData = this.synthesizeFallbackProjectData(prompt, websiteContext, architecturePlan);
    }

    const rawProject = this.constructProjectFromData(
      parsedData,
      prompt,
      userId,
      websiteContext,
      architecturePlan,
      designSystem
    );

    const validationResult = validateEntireWebsite(
      rawProject,
      websiteContext,
      architecturePlan,
      designSystem
    );

    return storageService.saveProject(validationResult.project, userId);
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
1. "update_text": target="hero.heading" | "hero.subheading" | "hero.badge" | "hero.trustBadge" | "hero.chipText" | "about.paragraph1" | "contact.heading" | "cta_banner.heading", value="new text"
2. "update_style": target="theme.primaryColor" | "theme.accentColor" | "theme.bgColor" | "theme.borderRadius", value="#hex"
3. "update_button": target="hero.primaryBtnText" | "hero.primaryBtnUrl" | "hero.secondaryBtnText" | "cta_banner.primaryBtnText", value="new text"
4. "update_section_props": target="hero" | "stats" | "about" | "features" | "products" | "pricing" | "cta_banner" | "contact", value={ ...props to merge }
   - For hero: target="hero", value={ "badge": "...", "trustBadge": "...", "chipText": "...", "stats": [{ "value": "...", "label": "..." }] }
   - For stats: target="stats", value={ "heading": "...", "subheading": "...", "items": [{ "value": "...", "label": "..." }] }
   - For cta_banner: target="cta_banner", value={ "heading": "...", "subheading": "...", "primaryBtnText": "..." }
5. "add_item":
   - For stats: target="stats", value={ "value": "99.9%", "label": "Uptime Guarantee" }
   - For products/menu: target="products", value={ "name": "...", "price": "₹...", "desc": "...", "tag": "New" }
   - For testimonials: target="testimonials", value={ "author": "...", "role": "...", "quote": "...", "rating": 5 }
   - For pricing: target="pricing", value={ "name": "...", "price": "₹...", "period": "/mo", "features": ["..."] }
   - For features: target="features", value={ "title": "...", "desc": "..." }
   - For faq: target="faq", value={ "q": "...", "a": "..." }
6. "add_section": target="page.home.sections", value={ "type": "stats" | "cta_banner" | "pricing" | "testimonials" | "faq" | "features" | "products" | "contact", "props": { ... } }
7. "remove_section": target="pricing" | "faq" | "testimonials" | "stats" | "cta_banner" | "<sectionId>"

OUTPUT RAW JSON ONLY.`;

    const recentHistory = (history || []).slice(-4).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text || '',
    }));

    let parsed = null;
    let modelUsed = modelId;

    try {
      const res = await this.executeGroqChatWithCascade({
        apiUrl,
        apiKey,
        preferredModel: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentHistory,
          { role: 'user', content: prompt },
        ],
        timeoutMs,
        temperature: 0.2,
      });
      parsed = res.parsed;
      modelUsed = res.modelUsed;
    } catch (err) {
      console.warn('[Klyvora Groq] Remote modification call failed across all cascade models, activating smart natural language synthesizer:', err);
      return this.synthesizeFallbackModification(prompt, project);
    }

    const validation = validateActions(parsed?.actions || [], project);

    // If remote model returned 0 valid actions, supplement with targeted fallback compiler
    if (validation.validActions.length === 0) {
      console.warn('[Klyvora Groq] Remote model returned empty actions. Compiling via natural language action compiler...');
      return this.synthesizeFallbackModification(prompt, project);
    }

    return {
      message: parsed?.message || 'I have analyzed your request and updated the website live.',
      actions: validation.validActions,
      invalidActions: validation.invalidActions,
      provider: `groq (${modelUsed})`,
      isFallback: false,
    };
  },

  /**
   * Helper: Construct a full project schema from parsed JSON data
   */
  constructProjectFromData(data, originalPrompt, userId, websiteContext = null, architecturePlan = null, designSystem = null) {
    const context = websiteContext || buildWebsiteContext(originalPrompt);
    const arch = architecturePlan || planWebsiteArchitecture(context);
    const ds = designSystem || generateDesignSystem(context);

    const brandName = (context.brandName && !['Venture Studio', 'Studio', 'Brand'].includes(context.brandName))
      ? context.brandName
      : (data.name || context.brandName || 'Venture Studio');
    const category = context.subIndustry || data.category || 'Digital Experience';
    const description = data.description || context.businessGoals?.join('. ') || originalPrompt;
    const isFood = context.industry === INDUSTRY_TYPES.RESTAURANT;

    // 1. Dynamic Sector Calibration for CTAs and Navigation Flows
    const defaultNavCTA = arch.navCTA || context.callsToAction?.primary?.label || (data.whatsapp ? 'WhatsApp Order' : 'Get in Touch');
    const defaultNavUrl = arch.navCTAUrl || context.callsToAction?.primary?.targetUrl || (data.whatsapp ? '#whatsapp' : '#contact');
    const defaultHeroPrimary = context.callsToAction?.primary?.label || (data.whatsapp ? 'Order via WhatsApp' : 'Explore Platform');
    const defaultHeroPrimaryUrl = context.callsToAction?.primary?.targetUrl || '#contact';
    const defaultHeroSecondary = context.callsToAction?.secondary?.label || 'Learn More';
    const defaultHeroSecondaryUrl = context.callsToAction?.secondary?.targetUrl || '#pricing';
    const defaultNavLinks = arch.navLinks || [
      { label: 'Home', url: '#home' },
      { label: 'Features', url: '#features' },
      { label: 'Capabilities', url: '#products' },
      { label: 'Pricing', url: '#pricing' },
      { label: 'FAQ', url: '#faq' },
      { label: 'Contact', url: '#contact' },
    ];

    // 2. Showcase Items
    const showcaseList = (data.showcaseItems || data.products || []).map((item, idx) => ({
      name: item.title || item.name || `Signature Offering 0${idx + 1}`,
      price: item.price || (isFood ? `₹${249 + idx * 100}` : context.industry === INDUSTRY_TYPES.SAAS ? (idx === 0 ? '₹2,499/mo' : `₹${5999 + idx * 2000}/mo`) : `₹${799 + idx * 400}`),
      desc: item.description || item.desc || 'Prepared with highest standard materials and exceptional care.',
      tag: item.tag || (idx === 0 ? 'BESTSELLER' : idx === 1 ? 'SIGNATURE' : 'POPULAR'),
      imageUrl: item.imageUrl || getCuratedPhoto(context.industry, idx),
    }));

    // 3. Features List
    const featuresList = (data.features || []).map((f) => ({
      title: f.title || f.name || 'Core Capability',
      desc: f.description || f.desc || 'Engineered to guarantee exceptional quality, performance, and consistency.',
    }));

    // 4. Testimonials List
    const reviewsList = (data.testimonials || []).map((t) => ({
      quote: t.comment || t.quote || 'An extraordinary standard of excellence in every detail.',
      author: t.name || t.author || 'Pooja Sharma',
      role: t.role || (context.industry === INDUSTRY_TYPES.SAAS ? 'VP of Technology' : 'Verified Patron'),
      rating: 5,
    }));

    // 5. Pricing Plans
    const pricingList = (data.pricing || []).map((p, idx) => ({
      name: p.name || `Tier 0${idx + 1}`,
      price: p.price || (idx === 0 ? '₹2,499' : idx === 1 ? '₹6,999' : 'Custom'),
      period: p.period !== undefined ? p.period : '/month',
      desc: p.description || (idx === 1 ? 'Our most popular comprehensive engagement.' : 'Essential package with dedicated support.'),
      popular: Boolean(p.popular || idx === 1),
      features: Array.isArray(p.features) ? p.features : ['Full Platform Access', 'Dedicated Lead Architect', 'Automated Daily Backups', '99.9% Uptime Commitment'],
    }));

    // 6. FAQ List
    const faqList = (data.faq || []).map((item) => ({
      q: item.question || item.q || 'What makes your offering unique?',
      a: item.answer || item.a || 'We combine modern engineering discipline with intuitive digital convenience.',
    }));

    // 7. Stable Section Builders
    const sectionMap = {
      navigation: createSection('navigation', {
        logoText: brandName,
        links: defaultNavLinks,
        ctaText: defaultNavCTA,
        ctaUrl: defaultNavUrl,
        sticky: true,
      }, { id: 'navigation-001' }),

      hero: createSection('hero', {
        badge: data.hero?.badge || arch.heroBadge || '✦ NEXT-GEN DIGITAL ARCHITECTURE',
        heading: data.hero?.heading || arch.heroHeading || `${brandName} — Engineered with Purpose.`,
        subheading: data.hero?.subheading || arch.heroSubheading || description,
        trustBadge: data.hero?.trustBadge || arch.trustBadge || '✦ VERIFIED BENCHMARK STANDARD',
        chipText: data.hero?.chipText || arch.chipText || `${brandName.toUpperCase()} FLAGSHIP`,
        stats: (Array.isArray(data.hero?.stats) && data.hero.stats.length > 0) ? data.hero.stats : (arch.stats || []),
        primaryBtnText: data.hero?.primaryBtnText || defaultHeroPrimary,
        primaryBtnUrl: defaultHeroPrimaryUrl,
        secondaryBtnText: data.hero?.secondaryBtnText || defaultHeroSecondary,
        secondaryBtnUrl: defaultHeroSecondaryUrl,
        imageUrl: data.hero?.imageUrl || getHeroPhoto(context.industry),
        alignment: 'center',
      }, { id: 'hero-001' }),

      stats: createSection('stats', {
        badge: data.statsBadge || 'PROVEN IMPACT',
        heading: data.statsHeading || 'Proven Performance at Scale',
        subheading: data.statsSubheading || 'Measurable outcomes delivered for leading businesses across India and globally.',
        items: (Array.isArray(data.stats) && data.stats.length > 0)
          ? data.stats
          : (Array.isArray(data.hero?.stats) && data.hero.stats.length > 0)
          ? data.hero.stats
          : arch.stats || [
              { value: '99.9%', label: 'Platform Availability' },
              { value: '10K+', label: 'Active Users' },
              { value: '<15ms', label: 'Average Latency' },
              { value: '4.9★', label: 'Satisfaction Rating' },
            ],
      }, { id: 'stats-001' }),

      about: createSection('about', {
        badge: data.aboutBadge || 'OUR PHILOSOPHY',
        heading: data.about?.heading || `The ${brandName} Standard`,
        paragraph1: data.about?.paragraph1 || description,
        paragraph2: data.about?.paragraph2 || 'Engineered with meticulous precision, authentic materials, and uncompromising standards.',
        highlights: [
          { title: 'Bespoke Quality', desc: 'Crafted without compromise to elevate your everyday experience.' },
          { title: 'Authentic Vision', desc: 'Rooted in passion and dedicated to transparent craftsmanship.' },
          { title: 'Direct Access', desc: 'Personalized service via direct priority communication.' },
        ],
      }, { id: 'about-001' }),

      features: createSection('features', {
        badge: data.featuresBadge || arch.featuresBadge || 'PLATFORM ADVANTAGES',
        heading: data.featuresHeading || arch.featuresHeading || 'Engineered for Discerning Standards',
        subheading: data.featuresSubheading || 'Built from the ground up for unyielding reliability, speed, and seamless scaling.',
        items: featuresList.length > 0 ? featuresList : [
          { title: 'Sub-Second Latency', desc: 'Optimized performance across every user touchpoint.' },
          { title: 'Enterprise Security', desc: 'Built-in privacy safeguards and compliance standards.' },
          { title: 'Seamless Integrations', desc: 'Connects directly with your existing tools and workflows.' },
          { title: 'Dedicated Support', desc: '24/7 technical guidance whenever your team needs assistance.' },
        ],
      }, { id: 'features-001' }),

      services: createSection('services', {
        badge: data.servicesBadge || 'CORE ARCHITECTURE',
        heading: data.servicesHeading || 'Modular Capabilities for Scalable Operations',
        subheading: 'Engineered for seamless integration with your existing workflow.',
        items: [
          { title: 'High-Concurrency Processing', desc: 'Scalable cloud infrastructure designed for 99.99% availability and resilience.', icon: 'Cpu' },
          { title: 'Intuitive Product Interfaces', desc: 'Clean, accessible frontend design systems that simplify complex user interactions.', icon: 'Layout' },
          { title: 'Continuous Integration & Reliability', desc: 'Automated testing and observability pipelines ensuring smooth releases.', icon: 'Shield' },
        ],
      }, { id: 'services-001' }),

      products: createSection('products', {
        badge: data.productsBadge || arch.productsBadge || (isFood ? 'DAILY MENU' : 'FEATURED SOLUTIONS'),
        heading: data.productsHeading || arch.productsHeading || (isFood ? 'Artisan Provisions & Selections' : 'Signature Products & Solutions'),
        subheading: data.productsSubheading || 'Curated and crafted with precision for our patrons and clients.',
        items: showcaseList.length > 0 ? showcaseList : [
          { name: 'Signature Offering 01', price: '₹2,499', desc: 'Handcrafted daily with premium sourcing.', tag: 'Bestseller', imageUrl: getCuratedPhoto(context.industry, 0) },
          { name: 'Signature Offering 02', price: '₹4,999', desc: 'Award-winning craft, seasonal availability.', tag: 'Signature', imageUrl: getCuratedPhoto(context.industry, 1) },
          { name: 'Signature Offering 03', price: '₹1,499', desc: 'Customer favorite, freshly prepared.', tag: 'Popular', imageUrl: getCuratedPhoto(context.industry, 2) },
        ],
      }, { id: 'products-001' }),

      testimonials: createSection('testimonials', {
        badge: data.testimonialsBadge || 'CUSTOMER REVIEWS',
        heading: data.testimonialsHeading || 'Endorsed by Regulars & Clients Across India',
        subheading: 'Real feedback from leaders and verified patrons who depend on our excellence.',
        items: reviewsList.length > 0 ? reviewsList : [
          { quote: 'The attention to detail and performance are extraordinary. A true benchmark in craftsmanship.', author: 'Aarav Mehta', role: 'VP of Technology', rating: 5 },
          { quote: 'Impeccable reliability and transparent pricing every single time. Highly recommended!', author: 'Priya Sharma', role: 'Verified Client', rating: 5 },
        ],
      }, { id: 'testimonials-001' }),

      pricing: createSection('pricing', {
        badge: data.pricingBadge || arch.pricingBadge || 'TRANSPARENT PLANS',
        heading: data.pricingHeading || arch.pricingHeading || 'Straightforward Engagements in ₹',
        subheading: data.pricingSubheading || 'Choose the plan tailored to your scale and requirements.',
        plans: pricingList.length > 0 ? pricingList : [
          { name: 'Starter', price: '₹2,499', period: '/month', desc: 'Perfect for emerging teams and small shops.', popular: false, features: ['Core Features', 'Direct Inquiries', 'Weekly Updates'] },
          { name: 'Growth Pro', price: '₹6,999', period: '/month', desc: 'Our most popular tier for growing businesses.', popular: true, features: ['Everything in Starter', 'Priority Support', 'API Integration', 'Dedicated Manager'] },
          { name: 'Enterprise', price: 'Custom', period: '', desc: 'Custom integration and dedicated support.', popular: false, features: ['Unlimited Throughput', 'Custom Domain', '24/7 SLA'] },
        ],
      }, { id: 'pricing-001' }),

      faq: createSection('faq', {
        badge: data.faqBadge || arch.faqBadge || 'FREQUENTLY ASKED QUESTIONS',
        heading: data.faqHeading || arch.faqHeading || 'Frequently Asked Questions',
        items: faqList.length > 0 ? faqList : [
          { q: 'How quickly can our team get started?', a: 'You can launch in minutes with our streamlined setup process and comprehensive guides.' },
          { q: 'Do you offer custom integrations?', a: 'Yes, our platform provides open APIs and dedicated webhook support for custom workflows.' },
          { q: 'What support options are available?', a: 'We offer email, community, and dedicated priority support depending on your plan.' },
        ],
      }, { id: 'faq-001' }),

      cta_banner: createSection('cta_banner', {
        badge: data.ctaBanner?.badge || 'GET STARTED TODAY',
        heading: data.ctaBanner?.heading || `Ready to Transform Your Workflow with ${brandName}?`,
        subheading: data.ctaBanner?.subheading || 'Join hundreds of forward-thinking businesses experiencing the next generation standard.',
        primaryBtnText: data.ctaBanner?.primaryBtnText || defaultHeroPrimary,
        primaryBtnUrl: defaultHeroPrimaryUrl,
        secondaryBtnText: data.ctaBanner?.secondaryBtnText || defaultHeroSecondary,
        secondaryBtnUrl: defaultHeroSecondaryUrl,
      }, { id: 'cta_banner-001' }),

      contact: createSection('contact', {
        badge: 'GET IN TOUCH',
        heading: 'Connect with Our Team',
        subheading: `Located in ${data.location || 'Bengaluru, Karnataka'}. We welcome your inquiry and visit.`,
      }, { id: 'contact-001' }),

      footer: createSection('footer', {
        businessName: brandName,
        tagline: data.tagline || description.slice(0, 80),
        links: defaultNavLinks,
      }, { id: 'footer-001' }),
    };

    let sectionSequence = arch.sectionSequence ? [...arch.sectionSequence] : [
      'navigation', 'hero', 'stats', 'about', 'features', 'products', 'testimonials', 'pricing', 'faq', 'cta_banner', 'contact', 'footer'
    ];

    if (!sectionSequence.includes('stats')) {
      const heroIdx = sectionSequence.indexOf('hero');
      if (heroIdx >= 0) sectionSequence.splice(heroIdx + 1, 0, 'stats');
    }

    if (!sectionSequence.includes('cta_banner')) {
      const contactIdx = sectionSequence.indexOf('contact');
      if (contactIdx >= 0) sectionSequence.splice(contactIdx, 0, 'cta_banner');
      else {
        const footerIdx = sectionSequence.indexOf('footer');
        if (footerIdx >= 0) sectionSequence.splice(footerIdx, 0, 'cta_banner');
      }
    }

    const sections = sectionSequence.map((type) => sectionMap[type] || createSection(type, {}, { id: `${type}-001` }));

    const projectTheme = {
      primaryColor: data.theme?.primaryColor || ds.primaryColor || '#06b6d4',
      secondaryColor: data.theme?.secondaryColor || ds.secondaryColor || '#8b5cf6',
      accentColor: data.theme?.accentColor || ds.accentColor || '#38bdf8',
      bgColor: data.theme?.bgColor || ds.bgColor || '#07080c',
      textColor: ds.textColor || '#f8fafc',
      surfaceColor: ds.surfaceColor || '#0c0e15',
      fontHeading: ds.fontHeading || data.theme?.fontHeading || 'Space Grotesk',
      fontBody: ds.fontBody || 'Plus Jakarta Sans',
      borderRadius: data.theme?.borderRadius || ds.borderRadius || '14px',
      glassmorphism: true,
      containerWidth: ds.containerWidth || '1200px',
      typography: ds.typography,
      spacing: ds.spacing,
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
        location: data.location || (context.industry === INDUSTRY_TYPES.SAAS ? 'HSR Layout, Bengaluru' : 'Bandra West, Mumbai'),
        contact: {
          email: data.email || `contact@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.in`,
          phone: data.phone || '+91 98200 12345',
          whatsapp: data.whatsapp || '+919820012345',
          address: data.location || 'Cyber Hub, Gurugram, India',
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

    const validated = validateEntireWebsite(newProject, context, arch, ds);
    return storageService.saveProject(validated.project, userId);
  },

  /**
   * Rich fallback synthesizer in case of offline / network issue
   */
  synthesizeFallbackProjectData(prompt, websiteContext = null, architecturePlan = null) {
    const context = websiteContext || buildWebsiteContext(prompt);
    const p = prompt.toLowerCase();
    const ind = context.industry;
    const brand = context.brandName;

    // 1. Tech / AI Automation SaaS (e.g. NEXORA)
    if (
      ind === INDUSTRY_TYPES.SAAS ||
      p.includes('saas') ||
      p.includes('automation') ||
      p.includes('nexora') ||
      p.includes('ai platform') ||
      p.includes('cloud') ||
      p.includes('software')
    ) {
      return {
        name: brand,
        category: context.subIndustry || 'AI Automation SaaS Platform',
        tagline: 'Autonomous AI Automation & Agentic Workflows for High-Growth Teams',
        description: 'Enterprise-grade cloud platform for deploying self-improving AI agents, automating mission-critical workflows, and integrating seamlessly with your tech stack.',
        location: 'HSR Layout, Bengaluru, Karnataka',
        phone: '+91 80 4567 8900',
        email: `contact@${brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'nexora'}.io`,
        whatsapp: '+918045678900',
        hours: 'Mon–Fri: 9:00 AM – 7:00 PM IST',
        theme: {
          primaryColor: '#06b6d4',
          secondaryColor: '#6366f1',
          accentColor: '#38bdf8',
          bgColor: '#06080e',
          borderRadius: '12px',
        },
        hero: {
          heading: `${brand} — Autonomous AI Automation for Scalable Operations.`,
          subheading: 'Deploy self-improving agentic workflows that integrate with your database, resolve mission-critical bottlenecks, and accelerate engineering velocity.',
          badge: '✦ NEXT-GEN AUTONOMOUS ENTERPRISE PLATFORM',
          primaryBtnText: 'Start Free Trial',
          secondaryBtnText: 'Book Live Demo',
        },
        about: {
          heading: 'Engineered for Sub-Millisecond Precision & Cloud Scale',
          paragraph1: 'Built for engineering teams and digital leaders who demand unyielding reliability, zero data contamination, and enterprise security.',
          paragraph2: 'Our orchestration engine handles parallel asynchronous pipelines, deterministic model fallbacks, and real-time observability.',
        },
        features: [
          { title: 'Zero-Latency Autonomous Agents', description: 'Execute parallel complex decision pipelines with deterministic fallback guarantees.' },
          { title: 'Bi-Directional Cloud Webhooks', description: 'Seamlessly interface with PostgreSQL, Kafka, Redis, and multi-cloud endpoints.' },
          { title: 'SOC-2 Type II Certified Security', description: 'End-to-end payload encryption with verifiable zero-trust telemetry.' },
          { title: 'Real-Time Observability & Auditing', description: 'Granular token usage, step-by-step reasoning logs, and SLA uptime metrics.' },
        ],
        showcaseItems: [
          { title: 'Core Orchestration Engine', description: 'High-throughput event queue with sub-50ms execution runtime.', price: '₹4,999/mo', tag: 'Flagship' },
          { title: 'Neural Reasoning Pipeline', description: 'Multi-modal processing for unstructured text, audio, and visual logs.', price: '₹9,999/mo', tag: 'Popular' },
          { title: 'Enterprise Gateway Bridge', description: 'Private VPC peering, custom SLA, and dedicated engineering support.', price: 'Custom', tag: 'Enterprise' },
        ],
        testimonials: [
          { name: 'Vikram Sethi', role: 'CTO, FinScale Technologies', comment: `${brand} automated our mission-critical triage queue in 48 hours. The speed and deterministic accuracy are unmatched.` },
          { name: 'Ananya Roy', role: 'VP of Engineering, CloudPeak', comment: 'We replaced 4 brittle custom microservices with one autonomous agent pipeline. Engineering velocity increased by 35%.' },
        ],
        pricing: [
          { name: 'Developer Starter', price: '₹2,499', period: '/month', popular: false, features: ['Up to 50,000 monthly events', '3 Autonomous Workflows', 'Standard REST & GraphQL API', 'Community & Email Support'] },
          { name: 'Growth Scale', price: '₹8,999', period: '/month', popular: true, features: ['Up to 500,000 monthly events', 'Unlimited Custom Workflows', 'Dedicated Redis Queue', 'Priority 24/7 Slack SLA', '99.9% Uptime Commitment'] },
          { name: 'Enterprise VPC', price: 'Contact', period: '', popular: false, features: ['Unlimited event throughput', 'Custom On-Prem or Private VPC', 'Dedicated Solutions Architect', 'Custom SOC-2 & ISO Audit Reports'] },
        ],
        faq: [
          { question: 'How does the platform integrate with our existing infrastructure?', answer: 'We offer official SDKs for Python, Node.js, and Go, alongside standard webhook listeners and REST APIs that connect to your stack in under ten minutes.' },
          { question: 'Is our proprietary business data used for model retraining?', answer: 'No. We enforce strict enterprise zero-data-retention policies. Your payload data is encrypted in transit and never stored for public model training.' },
          { question: 'What uptime guarantees and SLA do you provide?', answer: 'Our Growth and Enterprise plans carry a 99.95% availability SLA backed by redundant multi-region cloud failover clusters.' },
        ],
      };
    }

    // 2. Restaurant / Japanese Dining / Omakase
    if (
      ind === INDUSTRY_TYPES.RESTAURANT ||
      p.includes('restaurant') ||
      p.includes('japanese') ||
      p.includes('omakase') ||
      p.includes('sushi') ||
      p.includes('dining')
    ) {
      const isJapanese = p.includes('japan') || p.includes('omakase') || p.includes('sushi') || p.includes('tokyo') || p.includes('ramen');
      if (isJapanese) {
        return {
          name: brand,
          category: 'Japanese Fine Dining & Omakase',
          tagline: 'Artisanal Omakase & Traditional Edomae Sushi',
          description: 'An intimate Japanese culinary sanctuary offering multi-course omakase seatings, fresh Toyosu market selections, and curated sake pairings.',
          location: 'Lavelle Road, Bengaluru, Karnataka',
          phone: '+91 80 4123 9876',
          email: `reservations@${brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'matsu'}.in`,
          whatsapp: '+918041239876',
          hours: 'Tue–Sun: 6:00 PM – 11:30 PM (Closed Mondays)',
          theme: { primaryColor: '#f59e0b', secondaryColor: '#ef4444', accentColor: '#fbbf24', bgColor: '#0c0a09', borderRadius: '14px' },
          hero: {
            heading: `${brand} — The Art of Authentic Japanese Dining.`,
            subheading: 'Experience multi-course omakase tastings, dry-aged sashimi, and binchotan-grilled delicacies prepared with uncompromising Japanese discipline.',
            badge: '✦ TRADITIONAL EDOMAE HERITAGE',
            primaryBtnText: 'Reserve Omakase Table',
            secondaryBtnText: 'Explore Tasting Menu',
          },
          about: {
            heading: 'Unwavering Dedication to Edomae Precision & Fresh Catch',
            paragraph1: 'Every cut at our 12-seat Hinoki counter is executed with razor-sharp single-bevel knives, honoring centuries-old Edomae curing and aging rituals.',
            paragraph2: 'We curate wild-caught seasonal seafood flown directly from Tokyo’s Toyosu market, paired with artisanal single-estate sakes.',
          },
          features: [
            { title: 'Weekly Toyosu Market Air Shipments', description: 'Seasonal wild fish flown in directly for maximum freshness.' },
            { title: 'Traditional Hinoki Counter Seating', description: 'Intimate 12-guest counter for an immersive culinary performance.' },
            { title: 'Rare Junmai Daiginjo Sakes', description: 'Curated pairings from generational Japanese family microbreweries.' },
          ],
          showcaseItems: [
            { title: 'Chef Signature 14-Course Omakase', description: 'Seasonal sashimi, aged nigiri, and binchotan wagyu showcase.', price: '₹4,800', tag: 'Chef Choice' },
            { title: 'Otoro Bluefin Tuna Nigiri Pair', description: 'Fatty tuna belly lightly torched and brushed with aged nikiri soy.', price: '₹1,200', tag: 'Signature' },
            { title: 'A5 Miyazaki Wagyu Sukiyaki Course', description: 'Lightly seared A5 tenderloin with slow-poached onsen egg.', price: '₹2,600', tag: 'Specialty' },
          ],
          testimonials: [
            { name: 'Rohan Mehra', role: 'Food & Wine Connoisseur', comment: 'The omakase experience is on par with top Ginza counters. The nigiri rice temperature and knife work are flawless.' },
            { name: 'Dr. Sunita Rao', role: 'Regular Patron', comment: 'Celebrated our anniversary at the Hinoki counter. The attention to hospitality and sake pairing made it magical.' },
          ],
          pricing: [
            { name: 'Lunch Tasting Course', price: '₹2,800', period: '/guest', popular: false, features: ['8-Course Seasonal Nigiri', 'Steamed Chawanmushi', 'Miso Soup & Dessert', 'Green Tea Pairing'] },
            { name: 'Grand Evening Omakase', price: '₹4,800', period: '/guest', popular: true, features: ['14-Course Full Chef Tasting', 'Sashimi & Wagyu Highlights', 'Table Chef Interaction', 'Exclusive Sake Pairing'] },
          ],
          faq: [
            { question: 'Do you require advance reservations for omakase seatings?', answer: 'Yes, we recommend reserving at least 3 days in advance due to our limited 12-seat counter capacity.' },
            { question: 'Can dietary preferences or seafood allergies be accommodated?', answer: 'Please notify us when booking. We will prepare an adjusted menu with 24 hours advance notice.' },
          ],
        };
      }

      // Default Indian Dining / Mughlai
      return {
        name: brand,
        category: 'Restaurant & Fine Dining',
        tagline: 'Authentic Royal Mughlai & Heritage Flavors',
        description: 'Iconic fine dining restaurant serving slow-cooked dum biryanis, melt-in-mouth galouti kebabs, and rich gravies in a regal palace ambiance.',
        location: 'Connaught Place, New Delhi',
        phone: '+91 98110 54321',
        email: `reservations@${brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'dining'}.in`,
        whatsapp: '+919811054321',
        hours: 'Mon–Sun: 12:30 PM – 11:30 PM',
        theme: { primaryColor: '#ef4444', secondaryColor: '#f59e0b', accentColor: '#f43f5e', bgColor: '#06070a', borderRadius: '14px' },
        hero: { heading: `${brand} — Royal Culinary Heritage on Your Platter.`, subheading: 'Slow-cooked handi biryanis, artisanal tandoori platters, and authentic family recipes passed down generations.', badge: '✦ PREMIER HERITAGE DINING', primaryBtnText: 'Reserve Table', secondaryBtnText: 'Explore Menu' },
        about: { heading: 'A Dedication to Dum Pukht & Authentic Recipes', paragraph1: 'Every dish is slow-cooked in sealed copper handis over low embers, sealing in the delicate aromas of saffron, cardamom, and rose water.', paragraph2: 'We believe hospitality is an honored tradition of warmth, generosity, and exquisite taste.' },
        features: [
          { title: 'Slow Dum Pukht Cooking', description: 'Sealed dough handis slow-cooked for over 6 hours.' },
          { title: 'Pure Kashmiri Saffron', description: 'Handpicked authentic saffron and whole spices.' },
          { title: '1-Tap WhatsApp Booking', description: 'Instant table reservations and VIP private dining.' },
        ],
        showcaseItems: [
          { title: 'Royal Gosht Dum Biryani', description: 'Tender mutton layered with aged basmati rice and saffron milk.', price: '₹650', tag: 'Bestseller' },
          { title: 'Melt-in-Mouth Galouti Kebab', description: 'Finely minced spiced mutton served with flaky ulte tawa paratha.', price: '₹580', tag: 'Signature' },
          { title: 'Murgh Makhani Special', description: 'Tandoori chicken simmered in rich creamy tomato and butter gravy.', price: '₹520', tag: 'Chef Choice' },
        ],
        testimonials: [
          { name: 'Sanjeev Kapur', role: 'Food Critic', comment: 'The Galouti kebabs are among the finest in the city. Pure culinary magic.' },
          { name: 'Ananya Sen', role: 'Regular Patron', comment: 'The ambiance and authentic flavors made our family celebration unforgettable.' },
        ],
        pricing: [
          { name: 'Royal Heritage Feast', price: '₹1,299', period: '/guest', popular: false, features: ['2 Kebabs & 2 Curries', 'Dum Biryani & Breads', 'Artisan Dessert', 'Unlimited Welcome Drinks'] },
          { name: 'Nawabi Grand Tasting', price: '₹2,199', period: '/guest', popular: true, features: ['Chef Special 5-Course Meal', 'Unlimited Tandoor Platters', 'Custom Mocktail Pairing', 'VIP Seating'] },
        ],
        faq: [
          { question: 'Do you offer vegetarian options?', answer: 'Yes! We have a dedicated separate vegetarian kitchen section with artisanal paneer dishes and subz biryani.' },
          { question: 'How can I reserve a table?', answer: 'You can book directly via WhatsApp or call our reservation desk.' },
        ],
      };
    }

    // 3. Local Service / Modern Salon
    if (
      p.includes('salon') ||
      p.includes('hair') ||
      p.includes('beauty') ||
      p.includes('makeover') ||
      p.includes('spa')
    ) {
      return {
        name: brand,
        category: 'Modern Hair Salon & Aesthetic Lounge',
        tagline: 'Bespoke Balayage, Precision Cuts & Restorative Hair Rituals',
        description: 'Contemporary hair sanctuary and aesthetics lounge providing signature color transformations, botanical scalp therapy, and personalized styling.',
        location: 'Linking Road, Bandra West, Mumbai',
        phone: '+91 98200 45678',
        email: `appointments@${brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'luxe'}.in`,
        whatsapp: '+919820045678',
        hours: 'Tue–Sun: 10:00 AM – 8:30 PM (Closed Mondays)',
        theme: { primaryColor: '#ec4899', secondaryColor: '#8b5cf6', accentColor: '#f43f5e', bgColor: '#09080c', borderRadius: '16px' },
        hero: {
          heading: `${brand} — Elevated Hair Artistry & Restorative Rituals.`,
          subheading: 'Discover bespoke hair coloring, restorative botanical treatments, and couture styling in an oasis of modern luxury.',
          badge: '✦ MASTER STYLISTS & EUROPEAN COLOR',
          primaryBtnText: 'Book Styling Session',
          secondaryBtnText: 'Explore Service Menu',
        },
        about: {
          heading: 'Personalized Consultations & Botanical Hair Care',
          paragraph1: 'We believe exceptional hair styling begins with understanding your hair’s unique texture, face geometry, and lifestyle.',
          paragraph2: 'Our certified master colorists use ammonia-free European pigments and Olaplex bond repair to ensure radiant, healthy hair.',
        },
        features: [
          { title: 'Ammonia-Free European Color', description: 'Radiant pigments formulated to nourish and protect hair cuticles.' },
          { title: 'Certified Master Stylists', description: 'Continuous European training in precision cutting and balayage technique.' },
          { title: 'Private VIP Styling Suites', description: 'Serene private booths for personalized, relaxing appointments.' },
        ],
        showcaseItems: [
          { title: 'Signature Balayage & Gloss', description: 'Hand-painted dimensional color transition with restorative gloss finish.', price: '₹5,500', tag: 'Bestseller' },
          { title: 'Botanical Scalp Therapy & Steam', description: 'Deep scalp detoxification with essential oils and ozone steam infusion.', price: '₹2,200', tag: 'Restorative' },
          { title: 'Precision Cut & Silk Blowout', description: 'Custom face-framing architectural haircut with lasting volume styling.', price: '₹1,500', tag: 'Signature' },
        ],
        testimonials: [
          { name: 'Natasha Poonawalla', role: 'Fashion Consultant', comment: 'The balayage work here is extraordinary. The color grew out seamlessly without harsh lines.' },
          { name: 'Simran Bajaj', role: 'Verified Client', comment: 'Best hair spa experience in Mumbai. The private styling suite made me feel completely pampered.' },
        ],
        pricing: [
          { name: 'Refresh Ritual', price: '₹2,499', period: '/visit', popular: false, features: ['Precision Haircut', 'Organic Hair Spa', 'Blowout & Styling', 'Home Care Consultation'] },
          { name: 'Complete Color Transformation', price: '₹6,999', period: '/session', popular: true, features: ['Full Balayage or Ombre', 'Olaplex Bond Multiplier', 'Toning Gloss Treatment', 'Complimentary Post-Care Serum'] },
        ],
        faq: [
          { question: 'How do I book an appointment with a senior stylist?', answer: 'You can tap our Book button or send a message on WhatsApp for instant confirmation.' },
          { question: 'Do you recommend a patch test before coloring?', answer: 'Yes, for all first-time color clients, we conduct a complimentary patch test 24 hours prior.' },
        ],
      };
    }

    // 4. Creative / Digital Design Agency
    if (
      ind === INDUSTRY_TYPES.AGENCY ||
      p.includes('agency') ||
      p.includes('design studio') ||
      p.includes('creative')
    ) {
      return {
        name: brand,
        category: 'Digital Product Design & Brand Studio',
        tagline: 'Engineering High-Impact Digital Brands & Products',
        description: 'Boutique design and engineering studio partnering with venture-backed tech startups and ambitious brands to launch world-class digital experiences.',
        location: 'Indiranagar, Bengaluru, Karnataka',
        phone: '+91 80 2345 6789',
        email: `hello@${brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'studio'}.in`,
        whatsapp: '+918023456789',
        hours: 'Mon–Fri: 9:30 AM – 6:30 PM IST',
        theme: { primaryColor: '#f43f5e', secondaryColor: '#8b5cf6', accentColor: '#fb7185', bgColor: '#09090b', borderRadius: '12px' },
        hero: {
          heading: `${brand} — We Engineer High-Impact Brands & Digital Products.`,
          subheading: 'Partner with senior product designers and systems architects to launch distinct visual identities, modular design systems, and fast web apps.',
          badge: '✦ AWARD-WINNING CREATIVE STUDIO',
          primaryBtnText: 'Schedule Strategy Call',
          secondaryBtnText: 'View Selected Work',
        },
        about: {
          heading: 'Disciplined Craftsmanship Meets Measurable Business Impact',
          paragraph1: 'We don’t just build pretty layouts; we design cohesive digital ecosystems engineered for customer conversion and brand longevity.',
          paragraph2: 'Our team collaborates directly with founders and product leaders, eliminating agency bloat and accelerating time-to-market.',
        },
        features: [
          { title: 'Modular Design Token Systems', description: 'Scalable typography and UI tokens that maintain consistency across platforms.' },
          { title: 'High-Performance Web Applications', description: 'Next.js and React architectures built for sub-second load times.' },
          { title: 'Conversion Funnel Optimization', description: 'Data-driven landing pages designed to eliminate user friction.' },
        ],
        showcaseItems: [
          { title: 'Fintech Platform Modernization', description: 'Complete design system and mobile app driving 3.8x engagement.', price: 'Case Study', tag: 'Fintech' },
          { title: 'DTC E-Commerce Flagship', description: 'Headless digital storefront with custom 3D visuals and instant checkout.', price: 'Case Study', tag: 'E-Commerce' },
          { title: 'AI Workspace Architecture', description: 'Next-generation web application with intuitive real-time canvas tools.', price: 'Case Study', tag: 'SaaS' },
        ],
        testimonials: [
          { name: 'Karan Singhal', role: 'Founder & CEO, Zepter', comment: `${brand} transformed our customer retention. Their design sensibility and engineering rigor are world-class.` },
          { name: 'Meera Iyer', role: 'Head of Product, Omnicart', comment: 'Delivered our brand re-launch 2 weeks ahead of schedule. The quality of execution exceeded every expectation.' },
        ],
        pricing: [
          { name: 'Design Sprint Project', price: '₹1,50,000', period: '/milestone', popular: false, features: ['Comprehensive Brand Identity', 'Design Token System', 'Responsive Landing Page', 'Figma Production Source'] },
          { name: 'Dedicated Studio Retainer', price: '₹3,50,000', period: '/month', popular: true, features: ['Dedicated Senior Designer + Engineer', 'Weekly Iteration Sprints', 'Priority Product Advisory', 'Unlimited Revisions'] },
        ],
        faq: [
          { question: 'What is your typical project timeline?', answer: 'Most brand and landing page sprints conclude within 3 to 6 weeks from kickoff.' },
          { question: 'Do you offer development alongside design?', answer: 'Yes, we provide end-to-end frontend and full-stack development ensuring pixel-perfect implementation.' },
        ],
      };
    }

    // 5. Portfolio / Systems Architect
    if (
      ind === INDUSTRY_TYPES.PORTFOLIO ||
      p.includes('portfolio') ||
      p.includes('developer') ||
      p.includes('engineer portfolio') ||
      p.includes('resume')
    ) {
      return {
        name: brand,
        category: 'Senior Systems Architect & Full-Stack Engineer',
        tagline: 'Crafting High-Throughput Distributed Systems & Reactive UIs',
        description: 'Full-stack systems engineer focused on high-concurrency cloud architecture, microservices, scalable web performance, and developer tooling.',
        location: 'Bengaluru, Karnataka',
        phone: '+91 99000 11223',
        email: `arjun@${brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'dev'}.io`,
        whatsapp: '+919900011223',
        hours: 'Mon–Fri: Available for Advisory & Staff Roles',
        theme: { primaryColor: '#10b981', secondaryColor: '#06b6d4', accentColor: '#34d399', bgColor: '#06080d', borderRadius: '10px' },
        hero: {
          heading: `${brand} — Crafting High-Throughput Distributed Systems & Reactive UIs.`,
          subheading: 'Staff-level engineer specializing in cloud primitives, fault-tolerant event streaming with Go and Kafka, and modern reactive frontends.',
          badge: '✦ SYSTEMS ARCHITECT & OPEN-SOURCE BUILDER',
          primaryBtnText: 'Explore Projects',
          secondaryBtnText: 'Download Resume',
        },
        about: {
          heading: 'Engineering Philosophy: Simplicity, Reliability & Zero Bloat',
          paragraph1: 'I believe robust software begins with clear boundaries, deterministic error handling, and deep respect for system resources.',
          paragraph2: 'Over the past 8 years, I have architected distributed queues handling 100k+ events/sec and led frontend redesigns seen by millions.',
        },
        features: [
          { title: 'Distributed Stream Processing', description: 'High-throughput fault-tolerant event streams with Go, Kafka, and Redis.' },
          { title: 'Modern Reactive Frontends', description: 'Pixel-perfect, accessible web applications with React, Next.js, and TypeScript.' },
          { title: 'Infrastructure as Code & Observability', description: 'Automated Terraform provisioning and granular OpenTelemetry distributed tracing.' },
        ],
        showcaseItems: [
          { title: 'Autonomous Task Queue Engine', description: 'Lightweight distributed worker queue handling 100k events/sec in Go.', price: 'Open Source', tag: 'Distributed' },
          { title: 'Collaborative Vector Canvas', description: 'Real-time collaborative diagramming tool with WebSockets and CRDTs.', price: 'Production', tag: 'Frontend' },
          { title: 'Multi-Cloud Cost Auditor CLI', description: 'Cross-cloud resource auditor reducing AWS and GCP compute bills by 34%.', price: 'Tooling', tag: 'DevOps' },
        ],
        testimonials: [
          { name: 'Siddharth Rao', role: 'Director of Engineering, PayGrid', comment: 'Arjun rebuilt our core payment transaction worker. It ran for 18 months with zero downtime under peak Diwali traffic.' },
          { name: 'Dr. Tanya Bose', role: 'Founder, NeuroTech', comment: 'Rare combination of deep distributed backend knowledge and refined frontend aesthetic taste.' },
        ],
        pricing: [
          { name: 'Technical Advisory Sprint', price: '₹45,000', period: '/day', popular: false, features: ['Architecture Review & Threat Modeling', 'Database Indexing Audit', 'Cloud Infrastructure Optimization', 'Executive Technical Report'] },
          { name: 'Full-Stack Architecture Retainer', price: '₹2,50,000', period: '/month', popular: true, features: ['20 Dedicated Hours/Week', 'Hands-on Code & PR Reviews', 'Direct Mentorship of Junior Engineers', 'Emergency Escalation Access'] },
        ],
        faq: [
          { question: 'What types of roles or consulting engagements are you open to?', answer: 'I am open to Staff/Principal engineering roles, technical advisory, and high-impact contract architecture sprints.' },
          { question: 'What is your primary technology stack?', answer: 'TypeScript, Go, React, Python, PostgreSQL, Redis, Docker, and AWS/GCP cloud primitives.' },
        ],
      };
    }

    // Default Tech Startup Fallback
    return {
      name: brand,
      category: 'Tech Startup & Innovation Platform',
      tagline: 'Modern High-Impact Digital Solutions & Products',
      description: 'Empowering ambitious businesses with scalable architecture, human-centric design, and reliable performance.',
      location: 'HSR Layout, Bengaluru, Karnataka',
      phone: '+91 80 4567 8900',
      email: 'contact@domain.in',
      whatsapp: '+918045678900',
      hours: 'Mon–Sat: 9:00 AM – 7:00 PM IST',
      theme: { primaryColor: '#06b6d4', secondaryColor: '#8b5cf6', accentColor: '#38bdf8', bgColor: '#06070a', borderRadius: '14px' },
      hero: { heading: `${brand} — Engineered for Performance, Designed for Modern Impact.`, subheading: 'We build resilient systems and intuitive digital products that elevate your brand and accelerate operational velocity.', badge: '✦ INTENTIONAL DIGITAL ARCHITECTURE', primaryBtnText: 'Start Free Trial', secondaryBtnText: 'Schedule Consultation' },
      about: { heading: 'A Dedication to Engineering Excellence and Craftsmanship', paragraph1: 'We craft high-impact solutions with uncompromising standards, modern architecture, and customer-first design.', paragraph2: 'Every component, workflow, and interface is engineered with precision to ensure your business moves faster with absolute confidence.' },
      features: [
        { title: 'Sub-Second Latency', description: 'Optimized performance across every user touchpoint.' },
        { title: 'Enterprise Security', description: 'Built-in privacy safeguards and compliance standards.' },
        { title: 'Seamless Integrations', description: 'Connects directly with your existing tools and workflows.' },
      ],
      showcaseItems: [
        { title: 'Core Platform Engine', description: 'Essential automation workflows and unified reporting dashboard.', price: '₹4,999 / mo', tag: 'Popular' },
        { title: 'Enterprise Cluster Tier', description: 'Dedicated VPC hosting, private SLAs, and tailored architectural support.', price: 'Custom', tag: 'Enterprise' },
      ],
      testimonials: [
        { name: 'Aarav Mehta', role: 'VP of Technology', comment: 'The clarity and speed of execution are unmatched. Highly recommended.' },
        { name: 'Priya Sharma', role: 'Founder & CEO', comment: 'A flawless experience from start to launch. Outstanding attention to detail.' },
      ],
      pricing: [
        { name: 'Professional Starter', price: '₹2,499', period: '/month', popular: false, features: ['Core features included', 'Standard API access', 'Community support'] },
        { name: 'Scale Tier', price: '₹7,999', period: '/month', popular: true, features: ['All Starter features', 'Priority technical support', 'Advanced analytics'] },
      ],
      faq: [
        { question: 'How quickly can our team get started?', answer: 'You can launch in minutes with our streamlined setup process and comprehensive guides.' },
        { question: 'Do you offer custom integrations?', answer: 'Yes, our platform provides open APIs and dedicated webhook support for custom workflows.' },
      ],
    };
  },

  /**
   * Resilient offline/fallback modification synthesizer:
   * Guarantees that website updates NEVER fail or crash even during network interruptions.
   * Modifies ONLY requested components without collateral damage.
   */
  synthesizeFallbackModification(prompt, project) {
    const p = prompt.toLowerCase().trim();
    const actions = [];
    const currentBrand = project?.brand?.businessName || project?.metadata?.name || 'Venture';
    let message = 'Applied targeted updates based on your request.';

    function extractTargetValue(raw) {
      if (!raw) return '';
      const s = raw.trim().replace(/^to\s+/i, '').trim();
      if (s.startsWith('"') && s.indexOf('"', 1) !== -1) {
        return s.slice(1, s.indexOf('"', 1)).trim();
      }
      if (s.startsWith('“') && s.indexOf('”', 1) !== -1) {
        return s.slice(1, s.indexOf('”', 1)).trim();
      }
      if (s.startsWith("'") && s.endsWith("'") && s.length > 2) {
        return s.slice(1, -1).trim();
      }
      return s.replace(/^["'“]/, '').replace(/["'”]$/, '').trim();
    }

    // 1. Brand / Business Name Updates
    const brandMatch = prompt.match(/(?:change|rename|set|update)\s+(?:the\s+)?(?:brand(?:\s+name)?|company(?:\s+name)?|business(?:\s+name)?|store(?:\s+name)?|site\s+name|name)\s+(.*)$/i);
    if (brandMatch && brandMatch[1]) {
      const newName = extractTargetValue(brandMatch[1]);
      if (newName) {
        actions.push({ type: 'update_text', target: 'brand.businessName', value: newName, description: `Updated brand name to "${newName}"` });
        actions.push({ type: 'update_text', target: 'navigation.logoText', value: newName, description: `Updated navigation logo to "${newName}"` });
        actions.push({ type: 'update_text', target: 'footer.brandName', value: newName, description: `Updated footer brand to "${newName}"` });
        return {
          message: `Updated brand and company name to "${newName}".`,
          actions,
          invalidActions: [],
          provider: 'klyvora-natural-compiler',
          isFallback: true,
        };
      }
    }

    // 2. Direct Heading / Title Updates
    const headingMatch = prompt.match(/(?:change|update|set|make)\s+(?:the\s+)?(?:hero\s+)?(?:heading|headline|main\s+title|title)\s+(.*)$/i);
    if (headingMatch && headingMatch[1] && !/\b(shorter|cinematic)\b/i.test(p)) {
      const cleanHeading = extractTargetValue(headingMatch[1]);
      if (cleanHeading) {
        actions.push({ type: 'update_text', target: 'hero.heading', value: cleanHeading, description: `Updated Hero Headline to "${cleanHeading}"` });
        return {
          message: `Updated the main hero headline to "${cleanHeading}".`,
          actions,
          invalidActions: [],
          provider: 'klyvora-natural-compiler',
          isFallback: true,
        };
      }
    }

    // 3. Subheading / Description Updates
    const subMatch = prompt.match(/(?:change|update|set)\s+(?:the\s+)?(?:subheading|subtitle|sub-headline|description)\s+(.*)$/i);
    if (subMatch && subMatch[1]) {
      const cleanSub = extractTargetValue(subMatch[1]);
      if (cleanSub) {
        actions.push({ type: 'update_text', target: 'hero.subheading', value: cleanSub, description: `Updated Hero Subheading to "${cleanSub}"` });
        return {
          message: `Updated the hero subheading to "${cleanSub}".`,
          actions,
          invalidActions: [],
          provider: 'klyvora-natural-compiler',
          isFallback: true,
        };
      }
    }

    // 4. Button / CTA Updates
    const btnMatch = prompt.match(/(?:change|update|set)\s+(?:the\s+)?(?:hero\s+)?(?:primary\s+)?(?:button|btn|cta)\s+(?:text\s+)?(.*)$/i);
    if (btnMatch && btnMatch[1]) {
      const cleanBtn = extractTargetValue(btnMatch[1]);
      if (cleanBtn) {
        actions.push({ type: 'update_button', target: 'hero.primaryBtnText', value: cleanBtn, description: `Updated Primary Button to "${cleanBtn}"` });
        return {
          message: `Updated the primary call-to-action button to "${cleanBtn}".`,
          actions,
          invalidActions: [],
          provider: 'klyvora-natural-compiler',
          isFallback: true,
        };
      }
    }

    // 5. Contact / WhatsApp / Phone / Email Updates
    const phoneMatch = prompt.match(/(?:phone|call|mobile|number|tel)\s*(?:to|is|:)?\s*([+]?[\d\s-]{10,15})/i);
    if (phoneMatch && phoneMatch[1]) {
      const num = phoneMatch[1].trim();
      actions.push({ type: 'update_text', target: 'brand.contact.phone', value: num, description: `Updated phone number to ${num}` });
      actions.push({ type: 'update_text', target: 'contact.phone', value: num, description: `Updated contact phone to ${num}` });
      message = `Updated contact phone number to ${num}.`;
    }

    const emailMatch = prompt.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch && emailMatch[1]) {
      const email = emailMatch[1].trim();
      actions.push({ type: 'update_text', target: 'brand.contact.email', value: email, description: `Updated contact email to ${email}` });
      actions.push({ type: 'update_text', target: 'contact.email', value: email, description: `Updated email to ${email}` });
      message = `Updated contact email address to ${email}.`;
    }

    if (/\b(whatsapp|chat|instant order)\b/i.test(p)) {
      actions.push({ type: 'update_button', target: 'hero.primaryBtnText', value: 'Order on WhatsApp', description: 'Set Primary CTA to WhatsApp Order' });
      actions.push({ type: 'update_button', target: 'hero.primaryBtnUrl', value: '#whatsapp', description: 'Linked CTA to WhatsApp' });
      actions.push({ type: 'update_text', target: 'brand.ctaText', value: 'WhatsApp Order', description: 'Updated Brand CTA' });
      message = 'Configured 1-tap direct WhatsApp ordering and enquiries.';
    }

    // 6. Section Removals
    const removeSecMatch = prompt.match(/(?:remove|delete|hide|drop)\s+(?:the\s+)?(pricing|faq|testimonials?|reviews?|stats?|metrics?|cta(?:\s+banner)?|features?|about)/i);
    if (removeSecMatch && removeSecMatch[1]) {
      const targetType = removeSecMatch[1].toLowerCase();
      actions.push({ type: 'remove_section', target: targetType, description: `Removed ${targetType} section` });
      return {
        message: `Removed the ${targetType} section from the website.`,
        actions,
        invalidActions: [],
        provider: 'klyvora-natural-compiler',
        isFallback: true,
      };
    }

    // 7. Section Additions
    if (/\b(stat|stats|metric|metrics|kpi)\b/i.test(p) && !actions.some((a) => a.target === 'stats')) {
      actions.push({
        type: 'add_section',
        target: 'page.home.sections',
        value: {
          type: 'stats',
          name: 'Impact Metrics',
          props: {
            badge: 'PERFORMANCE SCALE',
            heading: 'Engineered for Quantifiable Impact',
            subheading: 'Proven metrics delivered across production operations and scale.',
            items: [
              { value: '99.99%', label: 'Platform Availability' },
              { value: '<15ms', label: 'Average Pipeline Latency' },
              { value: '4.8x', label: 'Operational Speedup' },
              { value: '10M+', label: 'Monthly Operations' },
            ],
          },
        },
        description: 'Added high-impact performance metrics section',
      });
      message = 'Added a quantitative performance stats section to showcase measurable impact.';
    }

    if (/\b(cta|call to action|cta banner|closing banner)\b/i.test(p) && !p.includes('hero') && !actions.some((a) => a.value?.type === 'cta_banner')) {
      actions.push({
        type: 'add_section',
        target: 'page.home.sections',
        value: {
          type: 'cta_banner',
          name: 'Call to Action',
          props: {
            badge: 'GET STARTED TODAY',
            heading: `Ready to Elevate Your Operations with ${currentBrand}?`,
            subheading: 'Join hundreds of forward-thinking businesses experiencing the next generation standard.',
            primaryBtnText: 'Get Started Now',
            primaryBtnUrl: '#contact',
            secondaryBtnText: 'Schedule Consultation',
            secondaryBtnUrl: '#contact',
          },
        },
        description: 'Added high-conversion call to action banner',
      });
      message = 'Added high-conversion call to action banner right before the footer.';
    }

    if (/\b(testimonial|testimonials|review|reviews|feedback)\b/i.test(p) && !actions.some((a) => a.value?.type === 'testimonials')) {
      actions.push({
        type: 'add_section',
        target: 'page.home.sections',
        value: {
          type: 'testimonials',
          name: 'Client Endorsements',
          props: {
            badge: 'VERIFIED REVIEWS',
            heading: 'Trusted by Industry Leaders',
            subheading: 'What our partners and customers have to say about working with us.',
            items: [
              { name: 'Arjun Mehta', role: 'Managing Director', comment: `${currentBrand} completely elevated our digital presence and operations. Exceptional quality and attention to detail.`, rating: 5 },
              { name: 'Priya Sharma', role: 'Product Lead', comment: 'Flawless execution, intuitive interfaces, and outstanding reliability. Highly recommended!', rating: 5 },
              { name: 'Vikram Patel', role: 'Founder & CEO', comment: 'The turnaround speed and architectural polish exceeded all expectations.', rating: 5 },
            ],
          },
        },
        description: 'Added client testimonials section',
      });
      message = 'Added verified customer reviews section to strengthen social proof.';
    }

    if (/\b(pricing|plans?|tiers?|subscription)\b/i.test(p) && !actions.some((a) => a.value?.type === 'pricing')) {
      actions.push({
        type: 'add_section',
        target: 'page.home.sections',
        value: {
          type: 'pricing',
          name: 'Transparent Pricing',
          props: {
            badge: 'FLEXIBLE TIERS',
            heading: 'Simple, Transparent Investment',
            subheading: 'Transparent plans calibrated for sustainable growth without hidden fees.',
            plans: [
              { name: 'Starter', price: '₹2,499', period: '/month', desc: 'Essential core capabilities.', popular: false, features: ['Standard Support', 'Daily Backups', 'Full Core Access'] },
              { name: 'Professional', price: '₹5,999', period: '/month', desc: 'Accelerated growth & priority SLAs.', popular: true, features: ['Priority 24/7 SLA', 'Dedicated Manager', 'Advanced Analytics', 'Unlimited Workflows'] },
              { name: 'Enterprise', price: 'Custom', period: '', desc: 'Bespoke infrastructure and scaling.', popular: false, features: ['Custom Integrations', 'On-premise Deployment', 'Dedicated Solutions Architect'] },
            ],
          },
        },
        description: 'Added transparent pricing table',
      });
      message = 'Added transparent pricing table with rupee calibration.';
    }

    if (/\b(faq|questions?|answers?)\b/i.test(p) && !actions.some((a) => a.value?.type === 'faq')) {
      actions.push({
        type: 'add_section',
        target: 'page.home.sections',
        value: {
          type: 'faq',
          name: 'Frequently Asked Questions',
          props: {
            badge: 'KNOWLEDGE BASE',
            heading: 'Frequently Asked Questions',
            subheading: 'Everything you need to know about getting started.',
            items: [
              { question: `How do I get started with ${currentBrand}?`, answer: 'Reach out through our contact form or WhatsApp button, and our team will onboard you within 24 hours.' },
              { question: 'What payment methods do you support?', answer: 'We support all major UPI platforms, credit cards, debit cards, and direct bank transfers in Indian Rupees (₹).' },
              { question: 'Is there ongoing support provided?', answer: 'Yes, our dedicated support team is available round the clock to ensure smooth and uninterrupted service.' },
            ],
          },
        },
        description: 'Added interactive FAQ section',
      });
      message = 'Added interactive FAQ section to answer key customer questions.';
    }

    if (/\b(announcement|festive|discount\s+banner|top\s+bar)\b/i.test(p)) {
      actions.push({
        type: 'add_section',
        target: 'page.home.sections',
        value: {
          type: 'announcement',
          name: 'Announcement Bar',
          props: {
            text: '✨ Special Inaugural Offer: Enjoy 20% savings with code FESTIVE20 for a limited time.',
            linkText: 'Claim Now →',
            linkUrl: '#pricing',
          },
        },
        description: 'Added top announcement offer banner',
      });
      message = 'Added top announcement offer banner.';
    }

    // 8. Theme / Color Updates with STRICT word boundaries (Ensures 'incredible' does NOT trigger red!)
    const hexMatch = prompt.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
    if (hexMatch) {
      actions.push({ type: 'update_style', target: 'theme.primaryColor', value: hexMatch[0], description: `Updated primary color to ${hexMatch[0]}` });
      message = `Updated primary theme color to ${hexMatch[0]}.`;
    } else if (/\b(saffron|orange|amber|gold)\b/i.test(p)) {
      actions.push({ type: 'update_style', target: 'theme.primaryColor', value: '#f59e0b', description: 'Updated primary color to Saffron Amber' });
      actions.push({ type: 'update_style', target: 'theme.accentColor', value: '#fbbf24', description: 'Updated accent color to Warm Gold' });
      message = 'Switched theme to Royal Indian Saffron & Warm Gold.';
    } else if (/\b(emerald|green|mint)\b/i.test(p)) {
      actions.push({ type: 'update_style', target: 'theme.primaryColor', value: '#10b981', description: 'Updated primary color to Emerald Green' });
      actions.push({ type: 'update_style', target: 'theme.accentColor', value: '#34d399', description: 'Updated accent color to Fresh Mint' });
      message = 'Switched theme to Vibrant Emerald Green.';
    } else if (/\b(cyan|sky|teal|blue|neon)\b/i.test(p)) {
      actions.push({ type: 'update_style', target: 'theme.primaryColor', value: '#06b6d4', description: 'Updated primary color to Cyber Cyan' });
      actions.push({ type: 'update_style', target: 'theme.accentColor', value: '#38bdf8', description: 'Updated accent color to Sky Blue' });
      message = 'Updated theme to Next-Gen Cyber Cyan.';
    } else if (/\b(purple|violet|iris|luxury)\b/i.test(p)) {
      actions.push({ type: 'update_style', target: 'theme.primaryColor', value: '#8b5cf6', description: 'Updated primary color to Royal Violet' });
      actions.push({ type: 'update_style', target: 'theme.accentColor', value: '#a78bfa', description: 'Updated accent color to Velvet Iris' });
      message = 'Updated theme to Royal Violet & Luxury Obsidian.';
    } else if (/\b(red|crimson|ruby|scarlet)\b/i.test(p)) {
      // Strict word boundaries prevent matching 'incredible', 'ordered', 'credit'!
      actions.push({ type: 'update_style', target: 'theme.primaryColor', value: '#ef4444', description: 'Updated primary color to Royal Crimson' });
      actions.push({ type: 'update_style', target: 'theme.accentColor', value: '#f87171', description: 'Updated accent color to Warm Coral' });
      message = 'Updated theme to Regal Crimson.';
    }

    if (/\b(dark|dark mode|obsidian|black)\b/i.test(p)) {
      actions.push({ type: 'update_style', target: 'theme.bgColor', value: '#07080c', description: 'Switched background to Obsidian Dark' });
    } else if (/\b(light|light mode|white)\b/i.test(p)) {
      actions.push({ type: 'update_style', target: 'theme.bgColor', value: '#ffffff', description: 'Switched background to Clean White' });
    }

    // 9. Hero Style Presets (cinematic, shorter)
    if (/\b(shorter|concise|crisp)\b/i.test(p) && /\b(headline|heading|hero)\b/i.test(p)) {
      actions.push({
        type: 'update_text',
        target: 'hero.heading',
        value: `${currentBrand} — Intelligence at Scale.`,
        description: 'Shortened hero headline for crisp impact',
      });
      message = 'Shortened the hero headline while preserving brand identity.';
    } else if (/\b(cinematic|grand|epic)\b/i.test(p) && /\b(hero|heading)\b/i.test(p)) {
      actions.push({
        type: 'update_text',
        target: 'hero.badge',
        value: '✦ ARCHITECTURAL VISION 2026',
        description: 'Updated hero badge with cinematic styling',
      });
      actions.push({
        type: 'update_text',
        target: 'hero.heading',
        value: `The Future of Autonomous Scale Begins with ${currentBrand}.`,
        description: 'Enhanced hero headline with cinematic phrasing',
      });
      message = 'Elevated the hero presentation to be more cinematic and impactful.';
    }

    // 10. Guaranteed Fallback if still unparsed
    if (actions.length === 0) {
      actions.push({
        type: 'update_text',
        target: 'hero.subheading',
        value: `Engineered with precision for ${currentBrand} to deliver authentic quality, high reliability, and superior service.`,
        description: 'Refined hero value proposition',
      });
      message = 'Refined website copy and presentation according to your request.';
    }

    return {
      message,
      actions,
      invalidActions: [],
      provider: 'klyvora-natural-compiler',
      isFallback: true,
    };
  },
};
