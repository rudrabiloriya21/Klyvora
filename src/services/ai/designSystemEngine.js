/**
 * Klyvora Studio — Design System Engine
 * Generates unified, cohesive design systems tailored to the business's industry, brand, and mood.
 * Every section in a website inherits these tokens to ensure it looks designed by one master designer.
 */

import { INDUSTRY_TYPES } from './businessContextEngine.js';

export const DESIGN_MOODS = {
  CYBER_DARK: 'cyber_dark',
  WARM_ARTISAN: 'warm_artisan',
  CLINICAL_SERENE: 'clinical_serene',
  ROYAL_HERITAGE: 'royal_heritage',
  EDITORIAL_CREATIVE: 'editorial_creative',
  ACADEMIC_PRESTIGE: 'academic_prestige',
  MINIMALIST_TECH: 'minimalist_tech',
  VIBRANT_FITNESS: 'vibrant_fitness',
};

const PALETTES_BY_MOOD = {
  [DESIGN_MOODS.CYBER_DARK]: {
    primaryColor: '#06b6d4',      // Cyber Cyan
    secondaryColor: '#6366f1',    // Electric Indigo
    accentColor: '#38bdf8',       // Neon Sky
    bgColor: '#06080e',           // Deep Space Obsidian
    surfaceColor: '#0d111a',      // Elevated Tech Surface
    textColor: '#f8fafc',         // Crisp White
    mutedColor: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    fontHeading: 'Space Grotesk',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '12px',
    shadowDepth: 'deep',
    glassmorphism: true,
  },
  [DESIGN_MOODS.WARM_ARTISAN]: {
    primaryColor: '#f59e0b',      // Saffron Gold
    secondaryColor: '#ef4444',    // Warm Crimson
    accentColor: '#fbbf24',       // Amber Radiance
    bgColor: '#0c0a09',           // Warm Charcoal
    surfaceColor: '#171412',      // Warm Slate Card
    textColor: '#fafaf9',         // Warm Linen White
    mutedColor: '#a8a29e',
    borderColor: 'rgba(245, 158, 11, 0.16)',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '16px',
    shadowDepth: 'medium',
    glassmorphism: true,
  },
  [DESIGN_MOODS.CLINICAL_SERENE]: {
    primaryColor: '#10b981',      // Fresh Emerald Care
    secondaryColor: '#06b6d4',    // Clinical Cyan
    accentColor: '#34d399',       // Mint Reassurance
    bgColor: '#060a0f',           // Deep Slate
    surfaceColor: '#0b131b',      // Sterile Glass Card
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderColor: 'rgba(16, 185, 129, 0.18)',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '14px',
    shadowDepth: 'medium',
    glassmorphism: true,
  },
  [DESIGN_MOODS.ROYAL_HERITAGE]: {
    primaryColor: '#d97706',      // Royal Antique Gold
    secondaryColor: '#dc2626',    // Banarasi Crimson
    accentColor: '#f59e0b',       // Saffron Accent
    bgColor: '#0a0808',           // Deep Velvet Obsidian
    surfaceColor: '#140f0f',      // Royal Silk Surface
    textColor: '#fffbeb',         // Pearl Silk White
    mutedColor: '#a8a29e',
    borderColor: 'rgba(217, 119, 6, 0.22)',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '16px',
    shadowDepth: 'deep',
    glassmorphism: true,
  },
  [DESIGN_MOODS.EDITORIAL_CREATIVE]: {
    primaryColor: '#8b5cf6',      // Nebula Violet
    secondaryColor: '#ec4899',    // Electric Rose
    accentColor: '#06b6d4',       // Cyan Accent
    bgColor: '#07080c',           // Deep Obsidian
    surfaceColor: '#0d0f17',      // Elevated Studio Glass
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    fontHeading: 'Syne',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '14px',
    shadowDepth: 'deep',
    glassmorphism: true,
  },
  [DESIGN_MOODS.ACADEMIC_PRESTIGE]: {
    primaryColor: '#2563eb',      // Academic Royal Blue
    secondaryColor: '#f59e0b',    // Golden Distinction
    accentColor: '#38bdf8',       // Sky Highlight
    bgColor: '#07090e',           // Deep Navy Obsidian
    surfaceColor: '#0d1322',      // Navy Blue Surface
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderColor: 'rgba(37, 99, 235, 0.22)',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '12px',
    shadowDepth: 'medium',
    glassmorphism: true,
  },
  [DESIGN_MOODS.MINIMALIST_TECH]: {
    primaryColor: '#0ea5e9',      // Ocean Tech Blue
    secondaryColor: '#10b981',    // Emerald
    accentColor: '#38bdf8',       // Crisp Cyan
    bgColor: '#090a0f',           // Clean Monolith
    surfaceColor: '#11131c',      // Crisp Card
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter',
    borderRadius: '8px',
    shadowDepth: 'subtle',
    glassmorphism: false,
  },
  [DESIGN_MOODS.VIBRANT_FITNESS]: {
    primaryColor: '#10b981',      // Fresh Mint
    secondaryColor: '#06b6d4',    // Cyan Energy
    accentColor: '#34d399',       // Spring Glow
    bgColor: '#06070a',           // Dark Gym Floor
    surfaceColor: '#0d1015',      // Matte Surface
    textColor: '#f8fafc',
    mutedColor: '#94a3b8',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    borderRadius: '12px',
    shadowDepth: 'medium',
    glassmorphism: true,
  },
};

/**
 * Resolves the appropriate design mood from WebsiteContext
 */
export function resolveDesignMood(context) {
  switch (context.industry) {
    case INDUSTRY_TYPES.SAAS:
      return DESIGN_MOODS.CYBER_DARK;
    case INDUSTRY_TYPES.RESTAURANT:
      return DESIGN_MOODS.WARM_ARTISAN;
    case INDUSTRY_TYPES.HEALTHCARE:
      return DESIGN_MOODS.CLINICAL_SERENE;
    case INDUSTRY_TYPES.RETAIL:
      return DESIGN_MOODS.ROYAL_HERITAGE;
    case INDUSTRY_TYPES.AGENCY:
      return DESIGN_MOODS.EDITORIAL_CREATIVE;
    case INDUSTRY_TYPES.EDUCATION:
      return DESIGN_MOODS.ACADEMIC_PRESTIGE;
    case INDUSTRY_TYPES.PORTFOLIO:
      return DESIGN_MOODS.MINIMALIST_TECH;
    case INDUSTRY_TYPES.FITNESS:
      return DESIGN_MOODS.VIBRANT_FITNESS;
    case INDUSTRY_TYPES.SALON:
      return DESIGN_MOODS.WARM_ARTISAN;
    default:
      return DESIGN_MOODS.EDITORIAL_CREATIVE;
  }
}

/**
 * Generates a full Design System Token tree
 */
export function generateDesignSystem(context, userOverrides = {}) {
  const mood = resolveDesignMood(context);
  const baseTokens = PALETTES_BY_MOOD[mood] || PALETTES_BY_MOOD[DESIGN_MOODS.EDITORIAL_CREATIVE];

  return {
    ...baseTokens,
    containerWidth: '1200px',
    typography: {
      display: 'clamp(2.5rem, 5vw, 3.8rem)',
      h1: 'clamp(2rem, 4vw, 3rem)',
      h2: 'clamp(1.6rem, 3vw, 2.2rem)',
      h3: '1.25rem',
      bodyLarge: '1.125rem',
      body: '0.9375rem',
      small: '0.8125rem',
      caption: '0.6875rem',
      lineHeightHeading: '1.18',
      lineHeightBody: '1.6',
    },
    spacing: {
      sectionPaddingDesktop: '80px 0',
      sectionPaddingMobile: '44px 0',
      cardPadding: '28px',
      gridGap: '24px',
    },
    ...userOverrides,
  };
}

export const createDesignSystem = generateDesignSystem;
