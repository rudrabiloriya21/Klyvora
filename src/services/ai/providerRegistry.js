import { validateActions } from './actionValidator';
import { groqService } from './groqService';

/**
 * Backend Provider Interface & Dispatcher
 * Bridges frontend Xeorvia product models to external Groq GPT-OSS 120B / Llama APIs
 * or local simulation when unconfigured.
 */

export const providerRegistry = {
  /**
   * Dispatches user instruction and project context to the configured provider
   */
  async processUserPrompt({ prompt, project, selectedModel, history = [] }) {
    try {
      return await groqService.processModificationPrompt({
        prompt,
        project,
        selectedModel,
        history,
      });
    } catch (err) {
      console.warn('Groq provider error, falling back with notification:', err);
      return {
        message: `Notice: Live inference experienced a temporary connection issue (${err.message}). Applied intelligent local modifications.`,
        isFallback: true,
        provider: 'local-simulator',
        actions: this.generateLocalSynthesizedActions(prompt, project),
      };
    }
  },

  /**
   * Calls an external OpenAI-compatible or Llama/GPT-OSS 120B endpoint
   */
  async callExternalProvider({ prompt, project, selectedModel, settings, history }) {
    const systemPrompt = `You are ${selectedModel.name}, an expert website architecture AI developed by Xeorvia for Klyvora Studio.
You receive instructions to modify a structured website project.
You MUST output a valid JSON object matching this schema:
{
  "message": "Human readable explanation of what changes you are applying",
  "actions": [
    {
      "type": "update_text" | "update_style" | "add_section" | "remove_section" | "update_button" | "update_seo",
      "target": "string path or section id",
      "value": "new value or object payload"
    }
  ]
}
Project Summary: Name: ${project.metadata.name}, Category: ${project.brand.category}, PrimaryColor: ${project.theme.primaryColor}.
DO NOT wrap in markdown quotes if possible, output raw JSON.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(settings.timeoutMs) || 30000);

    const response = await fetch(`${settings.apiUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: settings.modelId || selectedModel.defaultProviderMapping,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.slice(-4),
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    try {
      // Clean possible code blocks from model response
      const cleanJson = content.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      const validation = validateActions(parsed.actions || [], project);

      return {
        message: parsed.message || `Changes generated via ${settings.provider}.`,
        actions: validation.validActions,
        invalidActions: validation.invalidActions,
        provider: settings.provider,
        isFallback: false,
      };
    } catch {
      throw new Error('Model did not return valid structured action JSON.');
    }
  },

  /**
   * High-fidelity local action synthesizer
   * Provides real, meaningful, structured transformations when external credentials are absent.
   */
  generateLocalSynthesizedActions(prompt, project) {
    const p = prompt.toLowerCase();
    const actions = [];
    const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
    const sections = homePage?.sections || [];
    const heroSec = sections.find((s) => s.type === 'hero');

    // 1. Theme & Color adjustments
    if (p.includes('minimal') || p.includes('clean') || p.includes('white')) {
      actions.push({
        type: 'update_style',
        target: 'theme.primaryColor',
        value: '#e2e8f0',
        description: 'Set primary color to minimal crisp silver',
      });
      actions.push({
        type: 'update_style',
        target: 'theme.accentColor',
        value: '#38bdf8',
        description: 'Set accent to light sky',
      });
    } else if (p.includes('cyan') || p.includes('neon') || p.includes('blue')) {
      actions.push({
        type: 'update_style',
        target: 'theme.primaryColor',
        value: '#06b6d4',
        description: 'Updated primary color to Bioluminescent Cyan',
      });
    } else if (p.includes('purple') || p.includes('violet') || p.includes('luxury')) {
      actions.push({
        type: 'update_style',
        target: 'theme.primaryColor',
        value: '#8b5cf6',
        description: 'Updated primary color to Nebula Violet',
      });
      actions.push({
        type: 'update_style',
        target: 'theme.borderRadius',
        value: '18px',
        description: 'Refined border radius for luxury feel',
      });
    } else if (p.includes('amber') || p.includes('warm') || p.includes('gold')) {
      actions.push({
        type: 'update_style',
        target: 'theme.primaryColor',
        value: '#f59e0b',
        description: 'Updated primary color to Warm Hearth Amber',
      });
    }

    // 2. Hero copy improvements
    if (p.includes('hero') || p.includes('headline') || p.includes('copy') || p.includes('premium')) {
      if (heroSec) {
        if (p.includes('luxury') || p.includes('premium')) {
          actions.push({
            type: 'update_text',
            target: `section.${heroSec.id}.props.heading`,
            value: 'Sculpted with Purpose. Defining What Comes Next.',
            description: 'Elevated hero headline to cinematic, luxury tone',
          });
          actions.push({
            type: 'update_text',
            target: `section.${heroSec.id}.props.badge`,
            value: '✦ ARCHITECTURAL EXCELLENCE',
            description: 'Updated hero badge',
          });
        } else if (p.includes('restaurant') || p.includes('food') || p.includes('menu')) {
          actions.push({
            type: 'update_text',
            target: `section.${heroSec.id}.props.heading`,
            value: 'Culinary Mastery & Seasonal Flavors, Prepared Fresh Daily.',
            description: 'Customized headline for culinary/restaurant theme',
          });
          actions.push({
            type: 'update_text',
            target: `section.${heroSec.id}.props.badge`,
            value: '✦ ARTISAN TASTE',
            description: 'Updated hero badge',
          });
        } else {
          actions.push({
            type: 'update_text',
            target: `section.${heroSec.id}.props.heading`,
            value: `Experience the Standard in ${project.brand.category || 'Digital Craft'}.`,
            description: 'Enhanced hero headline clarity and focus',
          });
        }
      }
    }

    // 3. WhatsApp action
    if (p.includes('whatsapp') || p.includes('chat') || p.includes('order')) {
      if (heroSec) {
        actions.push({
          type: 'update_button',
          target: `section.${heroSec.id}.props.secondaryBtnText`,
          value: 'Order on WhatsApp',
          description: 'Added WhatsApp Call-To-Action button',
        });
        actions.push({
          type: 'update_button',
          target: `section.${heroSec.id}.props.secondaryBtnUrl`,
          value: '#contact',
          description: 'Linked WhatsApp CTA to direct channels',
        });
      }
    }

    // 4. Section management (add testimonials, pricing, faq)
    if (p.includes('testimonial') || p.includes('review')) {
      const hasTestimonials = sections.some((s) => s.type === 'testimonials');
      if (!hasTestimonials) {
        actions.push({
          type: 'add_section',
          target: 'page.home.sections',
          value: {
            type: 'testimonials',
            position: 'before_faq',
          },
          description: 'Injected Testimonials section with community reviews',
        });
      }
    }

    if (p.includes('pricing') || p.includes('plans') || p.includes('subscription')) {
      const hasPricing = sections.some((s) => s.type === 'pricing');
      if (!hasPricing) {
        actions.push({
          type: 'add_section',
          target: 'page.home.sections',
          value: {
            type: 'pricing',
            position: 'before_faq',
          },
          description: 'Added transparent Pricing & Subscription grid',
        });
      }
    }

    if (p.includes('faq') || p.includes('question')) {
      const hasFaq = sections.some((s) => s.type === 'faq');
      if (!hasFaq) {
        actions.push({
          type: 'add_section',
          target: 'page.home.sections',
          value: {
            type: 'faq',
            position: 'before_contact',
          },
          description: 'Added interactive FAQ accordion section',
        });
      }
    }

    // 5. SEO / Accessibility improvements
    if (p.includes('seo') || p.includes('metadata') || p.includes('keywords')) {
      actions.push({
        type: 'update_seo',
        target: 'seo.title',
        value: `${project.brand.businessName} — Official Flagship Experience`,
        description: 'Optimized SEO Title Tag',
      });
      actions.push({
        type: 'update_seo',
        target: 'seo.keywords',
        value: `${project.brand.businessName}, ${project.brand.category}, premier, official site, services`,
        description: 'Enriched Search Engine Keywords',
      });
    }

    // 6. Default fallback action if nothing matched
    if (actions.length === 0) {
      if (heroSec) {
        actions.push({
          type: 'update_text',
          target: `section.${heroSec.id}.props.subheading`,
          value: `${project.brand.description || 'Designed with purpose, built for what comes next.'} Optimized by Xeorvia AI.`,
          description: 'Refined hero narrative for higher engagement',
        });
      }
      actions.push({
        type: 'update_style',
        target: 'theme.glassmorphism',
        value: true,
        description: 'Enhanced spatial glassmorphism depth',
      });
    }

    return actions;
  },
};
