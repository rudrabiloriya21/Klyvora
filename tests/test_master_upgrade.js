import { extractWebsiteContext } from '../src/services/ai/businessContextEngine.js';
import { generateSiteArchitecture } from '../src/services/ai/sitemapEngine.js';
import { createDesignSystem } from '../src/services/ai/designSystemEngine.js';
import { validateEntireWebsite, validateSectionContent } from '../src/services/ai/contentValidator.js';
import { groqService } from '../src/services/ai/groqService.js';
import { executeActions } from '../src/services/ai/actionExecutor.js';

console.log('================================================================');
console.log('🚀 KLYVORA MASTER WEBSITE GENERATION UPGRADE — TEST SUITE');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// Test 1: Regression Test for NEXORA (AI Automation SaaS)
// -------------------------------------------------------------
console.log('--- TEST 1: NEXORA AI AUTOMATION SAAS REGRESSION TEST ---');
const nexoraPrompt = 'NEXORA — AI automation platform for modern enterprises and local businesses';
const nexoraCtx = extractWebsiteContext(nexoraPrompt);

assert(nexoraCtx.brandName === 'NEXORA', `Brand name correctly extracted as NEXORA (got: ${nexoraCtx.brandName})`);
assert(nexoraCtx.industry === 'saas' || nexoraCtx.industry === 'technology', `Industry classified as SaaS/technology (got: ${nexoraCtx.industry})`);
assert(nexoraCtx.prohibitedTerms.includes('sourdough'), 'Prohibited terms include sourdough');
assert(nexoraCtx.prohibitedTerms.includes('bakery'), 'Prohibited terms include bakery');
assert(nexoraCtx.prohibitedTerms.includes('clinical'), 'Prohibited terms include clinical');

const nexoraArch = generateSiteArchitecture(nexoraCtx);
assert(nexoraArch.sectionSequence.includes('pricing'), 'SaaS architecture includes pricing');
assert(nexoraArch.sectionSequence.includes('features'), 'SaaS architecture includes features');

const nexoraDesign = createDesignSystem(nexoraCtx);
const saasBg = nexoraDesign.bgColor || nexoraDesign.tokens?.colors?.background || '';
assert(saasBg.includes('#0') || saasBg.includes('#1'), 'SaaS uses sleek dark/cyber background');

const nexoraRaw = groqService.synthesizeFallbackProjectData(nexoraPrompt, nexoraCtx, nexoraArch);
const nexoraProjectData = groqService.constructProjectFromData(nexoraRaw, nexoraPrompt, 'test_user', nexoraCtx, nexoraArch, nexoraDesign);
const nexoraValidation = validateEntireWebsite(nexoraProjectData, nexoraCtx, nexoraArch, nexoraDesign);

assert(nexoraValidation.valid === true, 'NEXORA website passed anti-drift validation');
assert(nexoraValidation.score >= 90, `NEXORA website quality score >= 90 (got: ${nexoraValidation.score})`);

// Ensure ZERO sourdough/clinical/dental terms in any section of NEXORA
const nexoraDump = JSON.stringify(nexoraProjectData).toLowerCase();
const driftedTerms = ['sourdough', 'croissant', 'artisan bakery', 'clinical treatment', 'dental care', 'hotel room'];
const foundDrifts = driftedTerms.filter(term => nexoraDump.includes(term));
assert(foundDrifts.length === 0, `NEXORA contains zero drifted terms (found: ${foundDrifts.join(', ') || 'none'})`);

// Verify stable section IDs
const homeSections = nexoraProjectData.pages[0].sections;
const hasStableIds = homeSections.every(s => /^[a-z_]+-00[0-9]$/.test(s.id));
assert(hasStableIds, `All NEXORA sections use stable IDs like hero-001 (sample: ${homeSections.map(s => s.id).join(', ')})`);

// -------------------------------------------------------------
// Test 2: Restaurant Archetype (Matsu Japanese Dining)
// -------------------------------------------------------------
console.log('\n--- TEST 2: RESTAURANT ARCHETYPE (MATSU JAPANESE DINING) ---');
const restaurantPrompt = 'Matsu — Premium Japanese omakase restaurant and sushi bar';
const restaurantCtx = extractWebsiteContext(restaurantPrompt);

assert(restaurantCtx.industry === 'restaurant', `Industry classified as restaurant (got: ${restaurantCtx.industry})`);
assert(restaurantCtx.prohibitedTerms.includes('software'), 'Prohibited terms include software');
assert(restaurantCtx.prohibitedTerms.includes('saas'), 'Prohibited terms include saas');

const restaurantArch = generateSiteArchitecture(restaurantCtx);
assert(restaurantArch.sectionSequence.includes('hours') || restaurantArch.sectionSequence.includes('contact'), 'Restaurant architecture includes hours or contact/reservation');

const restaurantDesign = createDesignSystem(restaurantCtx);
const restaurantRaw = groqService.synthesizeFallbackProjectData(restaurantPrompt, restaurantCtx, restaurantArch);
const restaurantProjectData = groqService.constructProjectFromData(restaurantRaw, restaurantPrompt, 'test_user', restaurantCtx, restaurantArch, restaurantDesign);
const restaurantValidation = validateEntireWebsite(restaurantProjectData, restaurantCtx, restaurantArch, restaurantDesign);

assert(restaurantValidation.valid === true, 'Restaurant website passed anti-drift validation');
assert(restaurantValidation.score >= 90, `Restaurant website quality score >= 90 (got: ${restaurantValidation.score})`);

// -------------------------------------------------------------
// Test 3: Local Service Archetype (Luxe Mane Salon)
// -------------------------------------------------------------
console.log('\n--- TEST 3: LOCAL SERVICE ARCHETYPE (LUXE MANE SALON) ---');
const salonPrompt = 'Luxe Mane — Modern luxury hair salon & aesthetic studio in Bandra, Mumbai';
const salonCtx = extractWebsiteContext(salonPrompt);

assert(salonCtx.industry === 'salon', `Industry classified as salon/wellness (got: ${salonCtx.industry})`);
const salonArch = generateSiteArchitecture(salonCtx);
const salonDesign = createDesignSystem(salonCtx);
const salonRaw = groqService.synthesizeFallbackProjectData(salonPrompt, salonCtx, salonArch);
const salonProjectData = groqService.constructProjectFromData(salonRaw, salonPrompt, 'test_user', salonCtx, salonArch, salonDesign);
const salonValidation = validateEntireWebsite(salonProjectData, salonCtx, salonArch, salonDesign);

assert(salonValidation.valid === true, 'Salon website passed anti-drift validation');
assert(salonValidation.score >= 90, `Salon website quality score >= 90 (got: ${salonValidation.score})`);

// -------------------------------------------------------------
// Test 4: Creative Agency Archetype (Kroma Creative Labs)
// -------------------------------------------------------------
console.log('\n--- TEST 4: CREATIVE AGENCY ARCHETYPE (KROMA CREATIVE LABS) ---');
const agencyPrompt = 'Kroma Creative Labs — High-impact digital design & brand agency';
const agencyCtx = extractWebsiteContext(agencyPrompt);

assert(agencyCtx.industry === 'agency', `Industry classified as agency (got: ${agencyCtx.industry})`);
const agencyArch = generateSiteArchitecture(agencyCtx);
assert(agencyArch.sectionSequence.includes('portfolio') || agencyArch.sectionSequence.includes('services'), 'Agency includes portfolio or services');

const agencyDesign = createDesignSystem(agencyCtx);
const agencyRaw = groqService.synthesizeFallbackProjectData(agencyPrompt, agencyCtx, agencyArch);
const agencyProjectData = groqService.constructProjectFromData(agencyRaw, agencyPrompt, 'test_user', agencyCtx, agencyArch, agencyDesign);
const agencyValidation = validateEntireWebsite(agencyProjectData, agencyCtx, agencyArch, agencyDesign);

assert(agencyValidation.valid === true, 'Agency website passed anti-drift validation');
assert(agencyValidation.score >= 90, `Agency website quality score >= 90 (got: ${agencyValidation.score})`);

// -------------------------------------------------------------
// Test 5: Personal Developer Portfolio (Arjun Sharma)
// -------------------------------------------------------------
console.log('\n--- TEST 5: PERSONAL PORTFOLIO ARCHETYPE (ARJUN SHARMA) ---');
const portfolioPrompt = 'Arjun Sharma — Systems Architect and Full-Stack AI Engineer Portfolio';
const portfolioCtx = extractWebsiteContext(portfolioPrompt);

assert(portfolioCtx.industry === 'portfolio', `Industry classified as portfolio (got: ${portfolioCtx.industry})`);
const portfolioArch = generateSiteArchitecture(portfolioCtx);
const portfolioDesign = createDesignSystem(portfolioCtx);
const portfolioRaw = groqService.synthesizeFallbackProjectData(portfolioPrompt, portfolioCtx, portfolioArch);
const portfolioProjectData = groqService.constructProjectFromData(portfolioRaw, portfolioPrompt, 'test_user', portfolioCtx, portfolioArch, portfolioDesign);
const portfolioValidation = validateEntireWebsite(portfolioProjectData, portfolioCtx, portfolioArch, portfolioDesign);

assert(portfolioValidation.valid === true, 'Portfolio website passed anti-drift validation');
assert(portfolioValidation.score >= 90, `Portfolio website quality score >= 90 (got: ${portfolioValidation.score})`);

// -------------------------------------------------------------
// Test 6: AI Copilot Targeted Section Editing
// -------------------------------------------------------------
console.log('\n--- TEST 6: AI COPILOT TARGETED SECTION EDITING ---');
const modResult = groqService.synthesizeFallbackModification(
  'Make the hero headline shorter and punchier',
  nexoraProjectData
);

const { updatedProject: modifiedSaaS } = executeActions(nexoraProjectData, modResult.actions);

const originalHero = nexoraProjectData.pages[0].sections.find(s => s.type === 'hero');
const updatedHero = modifiedSaaS.pages[0].sections.find(s => s.type === 'hero');
const originalPricing = nexoraProjectData.pages[0].sections.find(s => s.type === 'pricing');
const updatedPricing = modifiedSaaS.pages[0].sections.find(s => s.type === 'pricing');

assert(updatedHero.props.heading.length < originalHero.props.heading.length, `Hero headline was made shorter (was: ${originalHero.props.heading.length} chars, now: ${updatedHero.props.heading.length} chars)`);
assert(JSON.stringify(originalPricing.props) === JSON.stringify(updatedPricing.props), 'Pricing section remained completely untouched during hero headline edit');

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`✨ RESULTS: ${passedTests} / ${totalTests} assertions passed!`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL MASTER WEBSITE GENERATION QUALITY TESTS PASSED SUCCESFULLY!');
} else {
  console.error('⚠️ Some tests failed. Review logs above.');
  process.exit(1);
}
