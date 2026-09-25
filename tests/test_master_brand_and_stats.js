import { extractBrandName, extractWebsiteContext } from '../src/services/ai/businessContextEngine.js';
import { generateSiteArchitecture } from '../src/services/ai/sitemapEngine.js';
import { createDesignSystem } from '../src/services/ai/designSystemEngine.js';
import { validateEntireWebsite } from '../src/services/ai/contentValidator.js';
import { groqService } from '../src/services/ai/groqService.js';
import { executeActions, sanitizeImageUrl } from '../src/services/ai/actionExecutor.js';

console.log('================================================================');
console.log('⚡ KLYVORA NEXT-GEN AI WEBSITE BUILDER — VERIFICATION SUITE');
console.log('================================================================\n');

let total = 0;
let passed = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// TEST 1: Natural Language Brand Name Extraction
// -------------------------------------------------------------
console.log('--- TEST 1: NATURAL LANGUAGE BRAND NAME EXTRACTION ---');
const brandTestCases = [
  { prompt: 'Modern AI SaaS automation platform named OrbitPulse', expected: 'OrbitPulse' },
  { prompt: 'Luxury Boutique Hotel in Amalfi Coast named Villa Serenità', expected: 'Villa Serenità' },
  { prompt: 'Modern Electric Bike Brand named Voltrix', expected: 'Voltrix' },
  { prompt: 'A portfolio for Alex Rivera, a Principal AI Systems Engineer', expected: 'Alex Rivera' },
  { prompt: 'Create a bakery website called Sweet Cravings', expected: 'Sweet Cravings' },
  { prompt: 'High-converting digital marketing agency named GrowthForge', expected: 'GrowthForge' },
  { prompt: 'ZenithFlow — Enterprise AI Workflow Automation', expected: 'ZenithFlow' },
];

for (const { prompt, expected } of brandTestCases) {
  const extracted = extractBrandName(prompt);
  assert(extracted === expected, `Extracted "${expected}" from "${prompt}" (got: "${extracted}")`);
}

// -------------------------------------------------------------
// TEST 2: Rich Architecture with Stats & CTA Banner
// -------------------------------------------------------------
console.log('\n--- TEST 2: ARCHITECTURE WITH STATS & CTA BANNER ---');
const orbitPrompt = 'Modern AI SaaS automation platform named OrbitPulse';
const orbitCtx = extractWebsiteContext(orbitPrompt);
const orbitArch = generateSiteArchitecture(orbitCtx);

assert(orbitArch.sectionSequence.includes('stats'), 'Architecture sectionSequence includes "stats"');
assert(orbitArch.sectionSequence.includes('cta_banner'), 'Architecture sectionSequence includes "cta_banner"');
assert(Array.isArray(orbitArch.stats) && orbitArch.stats.length >= 3, 'Architecture provides default stats metrics');
assert(Boolean(orbitArch.trustBadge), `Architecture provides trustBadge: "${orbitArch.trustBadge}"`);
assert(Boolean(orbitArch.chipText), `Architecture provides chipText: "${orbitArch.chipText}"`);

// -------------------------------------------------------------
// TEST 3: Project Construction & Schema Integrity
// -------------------------------------------------------------
console.log('\n--- TEST 3: PROJECT CONSTRUCTION & SCHEMA INTEGRITY ---');
const orbitDesign = createDesignSystem(orbitCtx);
const mockAiData = {
  name: 'OrbitPulse',
  category: 'AI Automation SaaS',
  tagline: 'Autonomous AI Workflows for Modern Engineering Teams',
  description: 'Deploy self-improving agents that automate critical operations and streamline engineering pipelines.',
  hero: {
    heading: 'OrbitPulse — Autonomous Cloud Automation at Speed of Thought.',
    subheading: 'Eliminate engineering bottlenecks with real-time AI agents built for resilience.',
    badge: '✦ REVOLUTIONARY CLOUD INTELLIGENCE',
    trustBadge: '✦ SOC-2 TYPE II & ISO 27001 AUDITED',
    chipText: 'ORBITPULSE ENGINE v3.4',
    stats: [
      { value: '99.99%', label: 'Uptime SLA' },
      { value: '<8ms', label: 'Inference Latency' },
      { value: '5.2x', label: 'Sprint Velocity' },
    ],
    primaryBtnText: 'Launch Autonomous Stack',
    secondaryBtnText: 'Schedule Engineering Demo',
  },
  stats: [
    { value: '99.99%', label: 'Platform Availability', desc: 'Continuous uptime across multi-region clusters.' },
    { value: '<8ms', label: 'Average Pipeline Latency', desc: 'Sub-millisecond decision processing.' },
    { value: '5.2x', label: 'Engineering Velocity', desc: 'Measured acceleration in software ship cycles.' },
    { value: '1.2B+', label: 'Events Handled Annually', desc: 'High-throughput reliability at enterprise scale.' },
  ],
  ctaBanner: {
    badge: 'GET STARTED TODAY',
    heading: 'Supercharge Your Engineering Pipeline with OrbitPulse',
    subheading: 'Deploy within minutes. No credit card required. Free tier forever.',
    primaryBtnText: 'Start Free Trial',
    secondaryBtnText: 'Book Technical Demo',
  },
};

const orbitProject = groqService.constructProjectFromData(
  mockAiData,
  orbitPrompt,
  'test_user_id',
  orbitCtx,
  orbitArch,
  orbitDesign
);

assert(orbitProject.brand.businessName === 'OrbitPulse', `Project brand name preserved as OrbitPulse (got: ${orbitProject.brand.businessName})`);
assert(orbitProject.metadata.name === 'OrbitPulse', `Project metadata name preserved as OrbitPulse (got: ${orbitProject.metadata.name})`);

const homeSecs = orbitProject.pages[0].sections;
const heroSec = homeSecs.find(s => s.type === 'hero');
const statsSec = homeSecs.find(s => s.type === 'stats');
const ctaSec = homeSecs.find(s => s.type === 'cta_banner');
const navSec = homeSecs.find(s => s.type === 'navigation');
const footerSec = homeSecs.find(s => s.type === 'footer');

assert(Boolean(heroSec), 'Hero section is present');
assert(heroSec.props.badge === '✦ REVOLUTIONARY CLOUD INTELLIGENCE', `Hero badge matches AI generation (got: "${heroSec.props.badge}")`);
assert(heroSec.props.trustBadge === '✦ SOC-2 TYPE II & ISO 27001 AUDITED', `Hero trustBadge matches AI generation (got: "${heroSec.props.trustBadge}")`);
assert(heroSec.props.chipText === 'ORBITPULSE ENGINE v3.4', `Hero chipText matches AI generation (got: "${heroSec.props.chipText}")`);
assert(Array.isArray(heroSec.props.stats) && heroSec.props.stats.length === 3, 'Hero contains 3 metrics');

assert(Boolean(statsSec), 'Standalone stats section is present');
assert(statsSec.props.items.length === 4, `Stats section contains 4 items (got: ${statsSec.props.items.length})`);
assert(statsSec.props.items[0].value === '99.99%', 'Stats item value preserved');

assert(Boolean(ctaSec), 'CTA banner section is present');
assert(ctaSec.props.heading.includes('OrbitPulse'), `CTA heading contains OrbitPulse (got: "${ctaSec.props.heading}")`);

assert(navSec.props.logoText === 'OrbitPulse', `Navigation logo is OrbitPulse (got: "${navSec.props.logoText}")`);
assert(footerSec.props.businessName === 'OrbitPulse', `Footer brand name is OrbitPulse (got: "${footerSec.props.businessName}")`);

// -------------------------------------------------------------
// TEST 4: Action Executor & Image Sanitization
// -------------------------------------------------------------
console.log('\n--- TEST 4: ACTION EXECUTOR & IMAGE SANITIZATION ---');
// Test placeholder sanitization
const placeholderUrl = 'https://example.com/mock-hero.jpg';
const sanitized = sanitizeImageUrl(placeholderUrl, 'saas', 0);
assert(sanitized.includes('unsplash.com'), `Sanitized placeholder URL to Unsplash (got: ${sanitized.slice(0, 40)}...)`);

// Test adding a stats section via AI action
const addStatsAction = {
  type: 'add_section',
  target: 'page.home.sections',
  value: {
    type: 'stats',
    name: 'Growth Metrics',
    props: {
      heading: 'Measured Performance Impact',
      items: [
        { value: '10x', label: 'Faster Deployments' },
        { value: '0', label: 'Downtime Incidents' },
      ],
    },
  },
  description: 'Added growth metrics section',
};

const execResult = executeActions(orbitProject, [addStatsAction]);
assert(execResult.appliedCount === 1, 'add_section action executed successfully');
const updatedStatsSec = execResult.updatedProject.pages[0].sections.find(s => s.name === 'Growth Metrics');
assert(Boolean(updatedStatsSec), 'New Growth Metrics section successfully added to project');

// -------------------------------------------------------------
// TEST 5: Live Groq Generation Call
// -------------------------------------------------------------
console.log('\n--- TEST 5: LIVE GROQ GENERATION PIPELINE ---');
try {
  console.log('  Invoking live groqService.generateWebsiteFromPrompt...');
  const liveProject = await groqService.generateWebsiteFromPrompt(orbitPrompt, 'live_test_user');
  assert(Boolean(liveProject), 'Live project returned from Groq');
  assert(liveProject.brand.businessName === 'OrbitPulse', `Live project brand is OrbitPulse (got: ${liveProject.brand.businessName})`);
  
  const liveHero = liveProject.pages[0].sections.find(s => s.type === 'hero');
  const liveStats = liveProject.pages[0].sections.find(s => s.type === 'stats');
  const liveCta = liveProject.pages[0].sections.find(s => s.type === 'cta_banner');
  
  assert(Boolean(liveHero), 'Live project contains hero section');
  assert(Boolean(liveStats), 'Live project contains stats section');
  assert(Boolean(liveCta), 'Live project contains cta_banner section');
  assert(Boolean(liveHero.props.heading), `Live hero heading: "${liveHero.props.heading}"`);
  console.log(`  Live Hero Badge: "${liveHero.props.badge}"`);
  console.log(`  Live Trust Badge: "${liveHero.props.trustBadge}"`);
  console.log(`  Live Chip Text: "${liveHero.props.chipText}"`);
  console.log(`  Live CTA Heading: "${liveCta?.props?.heading}"`);
} catch (err) {
  console.error('  Live Groq call error (may fall back):', err);
  assert(false, `Live Groq test encountered error: ${err.message}`);
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`✨ RESULTS: ${passed} / ${total} tests passed!`);
console.log('================================================================\n');

if (passed === total) {
  console.log('🏆 ALL MARKET-LEADING WEBSITE BUILDER CHECKS PASSED WITH FLYING COLORS!');
} else {
  console.error('⚠️ Some checks failed. Review output above.');
  process.exit(1);
}
