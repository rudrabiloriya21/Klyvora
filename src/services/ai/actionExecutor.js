import { createSection } from '../../models/projectSchema.js';
import { getCuratedPhoto } from './groqService.js';

/**
 * Section type aliasing & normalization map
 */
const SECTION_TYPE_ALIASES = {
  testimonial: 'testimonials',
  testimonials: 'testimonials',
  review: 'testimonials',
  reviews: 'testimonials',
  feedback: 'testimonials',
  product: 'products',
  products: 'products',
  menu: 'products',
  items: 'products',
  food: 'products',
  dish: 'products',
  dishes: 'products',
  feature: 'features',
  features: 'features',
  service: 'services',
  services: 'services',
  price: 'pricing',
  pricing: 'pricing',
  plan: 'pricing',
  plans: 'pricing',
  tier: 'pricing',
  tiers: 'pricing',
  faq: 'faq',
  faqs: 'faq',
  question: 'faq',
  questions: 'faq',
  hero: 'hero',
  banner: 'hero',
  header: 'navigation',
  nav: 'navigation',
  navigation: 'navigation',
  navbar: 'navigation',
  about: 'about',
  story: 'about',
  contact: 'contact',
  inquiry: 'contact',
  footer: 'footer',
  announcement: 'announcement',
  stats: 'stats',
  stat: 'stats',
  metrics: 'stats',
  metric: 'stats',
  cta: 'cta_banner',
  cta_banner: 'cta_banner',
  calltoaction: 'cta_banner',
};

/**
 * Sanitizes image URLs to guarantee crisp Unsplash photos and avoid broken dummy placeholders
 */
export function sanitizeImageUrl(url, category = 'saas', index = 0) {
  if (!url || typeof url !== 'string') return getCuratedPhoto(category, index);
  const u = url.toLowerCase().trim();
  if (
    u.includes('example.com') ||
    u.includes('placeholder') ||
    u.includes('dummyimage') ||
    u.includes('via.placeholder') ||
    u.includes('picsum.photos') ||
    u.includes('lorempixel') ||
    u.startsWith('undefined') ||
    u.startsWith('null') ||
    u === '#'
  ) {
    return getCuratedPhoto(category, index);
  }
  return url;
}

/**
 * Normalizes any section type string
 */
export function normalizeSectionType(typeStr) {
  if (!typeStr) return 'features';
  const clean = typeStr.toLowerCase().trim().replace(/^sec_/, '').split('_')[0];
  return SECTION_TYPE_ALIASES[clean] || clean;
}

/**
 * Finds a section in a project by exact ID, normalized type, or display name.
 */
export function findSection(project, identifier) {
  if (!project || !identifier) return null;

  // Clean identifier e.g. "section.sec_hero_1.props" -> "sec_hero_1" or "hero"
  const clean = identifier
    .trim()
    .replace(/^section\./i, '')
    .replace(/\.props.*$/i, '')
    .replace(/\.items.*$/i, '')
    .replace(/\.plans.*$/i, '');

  const normType = normalizeSectionType(clean);

  for (const page of project.pages || []) {
    const sections = page.sections || [];

    // 1. Exact ID match
    const byId = sections.find((s) => s.id === clean || s.id === identifier);
    if (byId) return { page, section: byId };

    // 2. Normalized Type match
    const byType = sections.find((s) => normalizeSectionType(s.type) === normType);
    if (byType) return { page, section: byType };

    // 3. Name match (case-insensitive)
    const byName = sections.find(
      (s) => s.name?.toLowerCase() === clean.toLowerCase()
    );
    if (byName) return { page, section: byName };
  }

  return null;
}

/**
 * Applies validated structured AI actions to a project immutably.
 */
export function executeActions(project, actions) {
  if (!actions || actions.length === 0) {
    return { updatedProject: project, appliedCount: 0, changeSummaries: [] };
  }

  // Deep clone project to ensure immutability
  const next = JSON.parse(JSON.stringify(project));
  const changeSummaries = [];
  let appliedCount = 0;

  for (const action of actions) {
    if (!action) continue;

    try {
      switch (action.type) {
        case 'update_text':
        case 'update_button': {
          const applied = applyFlexiblePropertyMutation(next, action.target, action.value);
          if (applied) {
            appliedCount++;
            changeSummaries.push(action.description || `Updated ${action.target}`);
          }
          break;
        }

        case 'update_section_props':
        case 'update_section': {
          const found = findSection(next, action.target || action.sectionType || action.value?.type);
          if (found && found.section) {
            const propsToMerge = action.value?.props ? { ...action.value.props } : (typeof action.value === 'object' ? { ...action.value } : {});
            if (propsToMerge.imageUrl) {
              propsToMerge.imageUrl = sanitizeImageUrl(propsToMerge.imageUrl, next.brand?.category || 'saas', 0);
            }
            if (Array.isArray(propsToMerge.items)) {
              propsToMerge.items = propsToMerge.items.map((it, idx) => {
                if (it && typeof it === 'object' && it.imageUrl) {
                  return { ...it, imageUrl: sanitizeImageUrl(it.imageUrl, next.brand?.category || 'saas', idx) };
                }
                return it;
              });
            }
            found.section.props = { ...found.section.props, ...propsToMerge };
            if (action.value?.name) found.section.name = action.value.name;
            appliedCount++;
            changeSummaries.push(action.description || `Updated ${found.section.name || found.section.type} section`);
          }
          break;
        }

        case 'add_item': {
          const found = findSection(next, action.target);
          if (found && found.section) {
            const sec = found.section;
            const normType = normalizeSectionType(sec.type);
            const val = typeof action.value === 'object' && action.value ? { ...action.value } : action.value;
            if (val && typeof val === 'object') {
              if (val.price) val.price = sanitizeCurrencyRupee(val.price);
              if (val.imageUrl) {
                val.imageUrl = sanitizeImageUrl(val.imageUrl, next.brand?.category || 'saas', sec.props.items?.length || 0);
              }
            }

            if (normType === 'pricing') {
              if (!Array.isArray(sec.props.plans)) sec.props.plans = [];
              sec.props.plans.push(val);
            } else {
              if (!Array.isArray(sec.props.items)) sec.props.items = [];
              sec.props.items.push(val);
            }
            appliedCount++;
            changeSummaries.push(action.description || `Added item to ${sec.name || sec.type}`);
          }
          break;
        }

        case 'update_item': {
          const found = findSection(next, action.target);
          if (found && found.section) {
            const sec = found.section;
            const normType = normalizeSectionType(sec.type);
            const list = normType === 'pricing' ? sec.props.plans : sec.props.items;
            const idx = action.index !== undefined ? Number(action.index) : 0;

            if (Array.isArray(list) && list[idx]) {
              let updatedVal = typeof action.value === 'object' ? { ...list[idx], ...action.value } : action.value;
              if (updatedVal && typeof updatedVal === 'object') {
                if (updatedVal.price) updatedVal.price = sanitizeCurrencyRupee(updatedVal.price);
                if (updatedVal.imageUrl) {
                  updatedVal.imageUrl = sanitizeImageUrl(updatedVal.imageUrl, next.brand?.category || 'saas', idx);
                }
              }
              list[idx] = updatedVal;
              appliedCount++;
              changeSummaries.push(action.description || `Updated item in ${sec.name || sec.type}`);
            }
          }
          break;
        }

        case 'delete_item': {
          const found = findSection(next, action.target);
          if (found && found.section) {
            const sec = found.section;
            const normType = normalizeSectionType(sec.type);
            const key = normType === 'pricing' ? 'plans' : 'items';

            if (Array.isArray(sec.props[key])) {
              const initialLen = sec.props[key].length;
              if (action.index !== undefined) {
                sec.props[key].splice(Number(action.index), 1);
              } else if (action.value?.name || action.value?.title) {
                const search = (action.value.name || action.value.title).toLowerCase();
                sec.props[key] = sec.props[key].filter(
                  (item) => (item.name || item.title || '').toLowerCase() !== search
                );
              }
              if (sec.props[key].length < initialLen) {
                appliedCount++;
                changeSummaries.push(action.description || `Removed item from ${sec.name || sec.type}`);
              }
            }
          }
          break;
        }

        case 'update_style':
        case 'update_theme': {
          if (!next.theme) next.theme = {};

          if (typeof action.value === 'object' && action.type === 'update_theme') {
            next.theme = { ...next.theme, ...action.value };
            appliedCount++;
            changeSummaries.push(action.description || 'Updated global theme configuration');
          } else {
            const rawTarget = action.target ? action.target.replace(/^theme\./, '') : 'primaryColor';
            next.theme[rawTarget] = action.value;
            appliedCount++;
            changeSummaries.push(action.description || `Updated theme: ${rawTarget} → ${action.value}`);
          }
          break;
        }

        case 'update_seo': {
          if (!next.seo) next.seo = {};
          const target = action.target.replace(/^seo\./, '');
          next.seo[target] = action.value;
          appliedCount++;
          changeSummaries.push(action.description || `Updated SEO: ${target}`);
          break;
        }

        case 'add_section': {
          const homePage = next.pages?.find((p) => p.isHome) || next.pages?.[0];
          if (homePage) {
            const rawType = action.value?.type || action.target || 'features';
            const normType = normalizeSectionType(rawType);
            const props = action.value?.props || (typeof action.value === 'object' ? action.value : {});
            const newSec = createSection(normType, props);

            if (action.value?.name) newSec.name = action.value.name;

            const pos = action.value?.position || action.position;
            if (normType === 'announcement') {
              // Announcement bars belong at the very top of the page
              homePage.sections.unshift(newSec);
            } else if (normType === 'navigation') {
              // Navigation belongs after announcement or at index 0
              const annIdx = homePage.sections.findIndex((s) => s.type === 'announcement');
              if (annIdx >= 0) homePage.sections.splice(annIdx + 1, 0, newSec);
              else homePage.sections.unshift(newSec);
            } else if (normType === 'stats' || pos === 'after_hero') {
              const heroIdx = homePage.sections.findIndex((s) => s.type === 'hero');
              if (heroIdx >= 0) homePage.sections.splice(heroIdx + 1, 0, newSec);
              else homePage.sections.push(newSec);
            } else if (normType === 'cta_banner' || pos === 'before_contact') {
              const contactIdx = homePage.sections.findIndex((s) => s.type === 'contact');
              if (contactIdx >= 0) homePage.sections.splice(contactIdx, 0, newSec);
              else {
                const footerIdx = homePage.sections.findIndex((s) => s.type === 'footer');
                if (footerIdx >= 0) homePage.sections.splice(footerIdx, 0, newSec);
                else homePage.sections.push(newSec);
              }
            } else {
              const footerIdx = homePage.sections.findIndex((s) => s.type === 'footer');
              if (footerIdx >= 0) homePage.sections.splice(footerIdx, 0, newSec);
              else homePage.sections.push(newSec);
            }

            appliedCount++;
            changeSummaries.push(action.description || `Added ${newSec.name} section`);
          }
          break;
        }

        case 'remove_section': {
          const homePage = next.pages?.find((p) => p.isHome) || next.pages?.[0];
          if (homePage) {
            const targetIdentifier = action.target || action.value;
            const normType = normalizeSectionType(targetIdentifier);

            const initialLength = homePage.sections.length;
            homePage.sections = homePage.sections.filter(
              (s) => s.id !== targetIdentifier && normalizeSectionType(s.type) !== normType
            );

            if (homePage.sections.length < initialLength) {
              appliedCount++;
              changeSummaries.push(action.description || `Removed ${targetIdentifier} section`);
            }
          }
          break;
        }

        case 'reorder_section': {
          const homePage = next.pages?.find((p) => p.isHome) || next.pages?.[0];
          if (homePage && action.target) {
            const secIdx = homePage.sections.findIndex(
              (s) => s.id === action.target || normalizeSectionType(s.type) === normalizeSectionType(action.target)
            );
            if (secIdx >= 0) {
              const [moved] = homePage.sections.splice(secIdx, 1);
              const newPos = typeof action.value === 'number'
                ? action.value
                : action.value === 'up'
                ? Math.max(0, secIdx - 1)
                : Math.min(homePage.sections.length, secIdx + 1);
              homePage.sections.splice(newPos, 0, moved);
              appliedCount++;
              changeSummaries.push(action.description || `Reordered ${moved.name || moved.type} section`);
            }
          }
          break;
        }

        default:
          console.warn(`Action type ${action.type} handled without mutation.`);
      }
    } catch (err) {
      console.warn('Failed executing action:', action, err);
    }
  }

  if (next.metadata) {
    next.metadata.updatedAt = new Date().toISOString();
  }

  return {
    updatedProject: next,
    appliedCount,
    changeSummaries,
  };
}

/**
 * Sanitizes currency strings to ensure Indian Rupee format
 */
export function sanitizeCurrencyRupee(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/^\$\s*/, '₹');
}

/**
 * Universal, fuzzy property mutator:
 * Resolves section properties, theme tokens, and brand values seamlessly.
 */
function applyFlexiblePropertyMutation(project, target, value) {
  if (!project || !target) return false;

  const path = target.trim();

  // 1. Direct Theme Mutations
  if (path.startsWith('theme.') || ['primaryColor', 'secondaryColor', 'accentColor', 'bgColor', 'textColor', 'borderRadius', 'fontHeading', 'fontBody'].includes(path)) {
    const key = path.replace(/^theme\./, '');
    if (!project.theme) project.theme = {};
    project.theme[key] = value;
    return true;
  }

  // 2. Direct Brand & Contact Mutations
  if (
    path.startsWith('brand.') ||
    path.startsWith('contact.') ||
    ['businessName', 'tagline', 'location', 'phone', 'whatsapp', 'email', 'address', 'hours'].includes(path)
  ) {
    if (!project.brand) project.brand = {};
    const key = path.replace(/^brand\./, '');

    // Support nested brand paths e.g. "contact.phone", "contact.whatsapp", "social.instagram"
    if (key.includes('.')) {
      const parts = key.split('.');
      let cur = project.brand;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
    } else if (['phone', 'whatsapp', 'email', 'address', 'hours', 'openingHours'].includes(key)) {
      if (!project.brand.contact) project.brand.contact = {};
      const contactKey = key === 'hours' ? 'openingHours' : key;
      project.brand.contact[contactKey] = value;
    } else {
      project.brand[key] = value;
    }

    // Simultaneously sync with contact section in homePage if contact fields were updated
    if (
      key.startsWith('contact.') ||
      ['phone', 'whatsapp', 'email', 'address', 'hours', 'openingHours'].includes(key)
    ) {
      const field = key.replace(/^contact\./, '');
      const contactSec = findSection(project, 'contact');
      if (contactSec && contactSec.section) {
        if (!contactSec.section.props) contactSec.section.props = {};
        contactSec.section.props[field] = value;
      }
    }
    return true;
  }

  // 3. Section Mutations (e.g. "hero.heading", "sec_hero_1.props.heading", "section.about.paragraph1")
  const parts = path.split('.');

  // Determine section part and prop part
  let sectionIdentifier = '';
  let propPath = '';

  if (parts[0] === 'section') {
    sectionIdentifier = parts[1];
    propPath = parts.slice(2).join('.').replace(/^props\./, '');
  } else {
    sectionIdentifier = parts[0];
    propPath = parts.slice(1).join('.').replace(/^props\./, '');
  }

  // If no prop path was extracted (e.g. target was just "hero"), default to "heading"
  if (!propPath) {
    propPath = 'heading';
  }

  // Auto rupee sanitization for pricing properties
  if (propPath.toLowerCase().includes('price') || propPath.toLowerCase().includes('fee')) {
    value = sanitizeCurrencyRupee(value);
  }

  // Auto image sanitization for image properties
  if (propPath.toLowerCase().includes('image') || propPath.toLowerCase().includes('photo')) {
    value = sanitizeImageUrl(value, project.brand?.category || 'saas', 0);
  }

  const found = findSection(project, sectionIdentifier);
  if (found && found.section) {
    if (!found.section.props) found.section.props = {};

    // Handle nested dot in propPath e.g. "items.0.name"
    if (propPath.includes('.')) {
      const subKeys = propPath.split('.');
      let cur = found.section.props;
      for (let i = 0; i < subKeys.length - 1; i++) {
        if (!cur[subKeys[i]]) cur[subKeys[i]] = {};
        cur = cur[subKeys[i]];
      }
      cur[subKeys[subKeys.length - 1]] = value;
    } else {
      found.section.props[propPath] = value;
    }
    return true;
  }

  // 4. Standard Object Traversal Fallback
  const keys = path.split('.');
  let current = project;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) return false;
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return true;
}
