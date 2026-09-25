import { groqService } from '../src/services/ai/groqService.js';
import { executeActions } from '../src/services/ai/actionExecutor.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runEndToEndModificationSuite() {
  console.log('================================================================');
  console.log('⚡ KLYVORA AI MODIFICATION & FAILOVER ENGINE — VERIFICATION');
  console.log('================================================================\n');

  // Baseline mock project
  const initialProject = {
    id: 'proj_test_1',
    metadata: { name: 'Voltrix' },
    brand: {
      businessName: 'Voltrix',
      category: 'fitness',
      contact: { phone: '+91 99999 11111', email: 'hello@voltrix.com' }
    },
    theme: {
      primaryColor: '#06b6d4',
      accentColor: '#38bdf8',
      bgColor: '#07080c'
    },
    pages: [
      {
        id: 'page_home',
        isHome: true,
        sections: [
          { id: 'sec_nav_1', type: 'navigation', name: 'Navigation', props: { logoText: 'Voltrix' } },
          { id: 'sec_hero_1', type: 'hero', name: 'Hero', props: { heading: 'Ride the Electric Revolution', subheading: 'Engineered for velocity.', primaryBtnText: 'Explore Models' } },
          { id: 'sec_features_1', type: 'features', name: 'Features', props: { heading: 'Engineered Performance', items: [] } },
          { id: 'sec_pricing_1', type: 'pricing', name: 'Pricing', props: { heading: 'Flexible Plans', plans: [] } },
          { id: 'sec_contact_1', type: 'contact', name: 'Contact', props: { heading: 'Get in Touch', phone: '+91 99999 11111' } },
          { id: 'sec_footer_1', type: 'footer', name: 'Footer', props: { brandName: 'Voltrix' } }
        ]
      }
    ]
  };

  // --- PART 1: TEST FALLBACK COMPILER ON DIVERSE NATURAL LANGUAGE INSTRUCTIONS ---
  console.log('--- TEST 1: NATURAL LANGUAGE ACTION COMPILER ---');

  const testPrompts = [
    {
      prompt: 'Change brand name to "Voltrix Superbikes"',
      verify: (res) => res.actions.some(a => a.target === 'brand.businessName' && a.value === 'Voltrix Superbikes')
    },
    {
      prompt: 'Change hero heading to "The World\'s Fastest Smart Electric Bike"',
      verify: (res) => res.actions.some(a => a.target === 'hero.heading' && a.value.includes('Fastest Smart Electric Bike'))
    },
    {
      prompt: 'Change subheading to "Precision-crafted frames with 180km range on a single charge"',
      verify: (res) => res.actions.some(a => a.target === 'hero.subheading' && a.value.includes('180km range'))
    },
    {
      prompt: 'Change primary button to "Book a Test Ride"',
      verify: (res) => res.actions.some(a => a.target === 'hero.primaryBtnText' && a.value === 'Book a Test Ride')
    },
    {
      prompt: 'Change phone number to +91 98000 11111',
      verify: (res) => res.actions.some(a => a.target === 'contact.phone' && a.value.includes('98000'))
    },
    {
      prompt: 'Add direct 1-tap WhatsApp order button',
      verify: (res) => res.actions.some(a => a.target === 'hero.primaryBtnText' && a.value.includes('WhatsApp'))
    },
    {
      prompt: 'Add impact metrics and stats section',
      verify: (res) => res.actions.some(a => a.value?.type === 'stats')
    },
    {
      prompt: 'Add high-conversion CTA banner before contact',
      verify: (res) => res.actions.some(a => a.value?.type === 'cta_banner')
    },
    {
      prompt: 'Add client testimonials with verified reviews',
      verify: (res) => res.actions.some(a => a.value?.type === 'testimonials')
    },
    {
      prompt: 'Add interactive FAQ accordion section',
      verify: (res) => res.actions.some(a => a.value?.type === 'faq')
    },
    {
      prompt: 'Add festive announcement offer banner at the top',
      verify: (res) => res.actions.some(a => a.value?.type === 'announcement')
    },
    {
      prompt: 'Remove the pricing section',
      verify: (res) => res.actions.some(a => a.type === 'remove_section' && a.target === 'pricing')
    },
    {
      prompt: 'Switch theme to vibrant emerald green',
      verify: (res) => res.actions.some(a => a.target === 'theme.primaryColor' && a.value === '#10b981')
    },
    {
      prompt: 'Make the whole design look incredible and modern', // MUST NOT trigger red (#ef4444)
      verify: (res) => !res.actions.some(a => a.value === '#ef4444')
    },
    {
      prompt: 'Make the background dark obsidian',
      verify: (res) => res.actions.some(a => a.target === 'theme.bgColor' && a.value === '#07080c')
    }
  ];

  for (const item of testPrompts) {
    const res = groqService.synthesizeFallbackModification(item.prompt, initialProject);
    assert(res.actions && res.actions.length > 0, `Actions produced for "${item.prompt}" (got: ${res.actions.length} actions)`);
    assert(item.verify(res), `Correct mutation payload for "${item.prompt}"`);
  }

  // --- PART 2: TEST ACTION EXECUTOR APPLICATION ---
  console.log('\n--- TEST 2: APPLYING ACTIONS WITH ACTION EXECUTOR ---');
  let currentProject = JSON.parse(JSON.stringify(initialProject));

  // 1. Apply brand change
  const brandRes = groqService.synthesizeFallbackModification('Change brand name to "Voltrix Apex"', currentProject);
  const ex1 = executeActions(currentProject, brandRes.actions);
  currentProject = ex1.updatedProject;
  assert(currentProject.brand.businessName === 'Voltrix Apex', 'Brand name updated to "Voltrix Apex"');
  assert(currentProject.pages[0].sections[0].props.logoText === 'Voltrix Apex', 'Navigation logo synchronized to "Voltrix Apex"');

  // 2. Apply stats addition
  const statsRes = groqService.synthesizeFallbackModification('Add impact metrics and stats section', currentProject);
  const ex2 = executeActions(currentProject, statsRes.actions);
  currentProject = ex2.updatedProject;
  const hasStats = currentProject.pages[0].sections.some(s => s.type === 'stats');
  assert(hasStats, 'Stats section successfully inserted into page');

  // 3. Apply CTA banner addition
  const ctaRes = groqService.synthesizeFallbackModification('Add high-conversion CTA banner', currentProject);
  const ex3 = executeActions(currentProject, ctaRes.actions);
  currentProject = ex3.updatedProject;
  const hasCta = currentProject.pages[0].sections.some(s => s.type === 'cta_banner');
  assert(hasCta, 'CTA banner section successfully inserted into page');

  // 4. Apply Section removal
  const rmRes = groqService.synthesizeFallbackModification('Remove the pricing section', currentProject);
  const ex4 = executeActions(currentProject, rmRes.actions);
  currentProject = ex4.updatedProject;
  const hasPricing = currentProject.pages[0].sections.some(s => s.type === 'pricing');
  assert(!hasPricing, 'Pricing section successfully removed from page');

  // --- PART 3: TEST LIVE GROQ CASCADE CALL ---
  console.log('\n--- TEST 3: LIVE GROQ MULTI-MODEL CASCADE INFERENCE ---');
  try {
    const liveRes = await groqService.processModificationPrompt({
      prompt: 'Change hero heading to "Next-Gen Autonomous Velocity" and make primary color emerald green',
      project: initialProject,
      history: []
    });

    assert(liveRes.actions && liveRes.actions.length > 0, `Live cascade returned actions (got: ${liveRes.actions.length})`);
    assert(liveRes.actions.some(a => a.type === 'update_text' || a.type === 'update_style'), 'Live cascade contains text or style mutations');
    console.log(`  Live provider reported: ${liveRes.provider}`);
    console.log(`  Live message: "${liveRes.message}"`);
  } catch (err) {
    console.error('Live cascade error:', err);
  }

  console.log('\n================================================================');
  console.log(`✨ RESULTS: ${passedTests} / ${totalTests} tests passed!`);
  console.log('================================================================\n');

  if (passedTests === totalTests) {
    console.log('🏆 100% OF VERIFICATION CHECKS PASSED!');
  } else {
    console.error('⚠️ SOME CHECKS FAILED!');
    process.exit(1);
  }
}

runEndToEndModificationSuite().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
