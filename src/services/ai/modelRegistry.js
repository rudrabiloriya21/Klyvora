/**
 * Xeorvia Model System Registry
 * Maps user-facing product models to capabilities and system directives
 * while preserving backend model mappings.
 */

export const aiModel = {
  id: 'system-architect-1.2-neo',
  displayName: 'System Architect 1.2 Neo',
  shortName: 'System Architect 1.2',
  backendModel: 'GPT-OSS 120B',
  backendModelId: 'openai/gpt-oss-120b',
};

export const XEORVIA_MODELS = [
  {
    id: 'system-architect-1.2-neo',
    name: 'System Architect 1.2 Neo',
    displayName: 'System Architect 1.2 Neo',
    shortName: 'System Architect 1.2',
    backendModel: 'GPT-OSS 120B',
    description: 'Autonomous website architecture, instant generation, real-time live canvas mutations, and responsive optimization.',
    capabilityLevel: 'Flagship Architecture',
    recommended: true,
    speed: 'Ultra-fast',
    reasoning: 'Maximum Rigor',
    contextWindow: '256k',
    defaultProviderMapping: 'openai/gpt-oss-120b',
  },
  {
    id: 'system-architect-1.1',
    name: 'System Architect 1.1 Neo',
    displayName: 'System Architect 1.1 Neo',
    shortName: 'System Architect 1.1',
    backendModel: 'GPT-OSS 120B',
    description: 'Design reasoning, component generation, website customization, and responsive layout assistance.',
    capabilityLevel: 'Advanced Design',
    recommended: false,
    speed: 'Ultra-fast',
    reasoning: 'High Precision',
    contextWindow: '128k',
    defaultProviderMapping: 'openai/gpt-oss-120b',
  },
  {
    id: 'system-architect-1.0',
    name: 'System Architect 1.0 Neo',
    displayName: 'System Architect 1.0 Neo',
    shortName: 'System Architect 1.0',
    backendModel: 'GPT-OSS 20B',
    description: 'Standard website generation, basic content creation, and standard layout assistance.',
    capabilityLevel: 'Standard',
    recommended: false,
    speed: 'Ultra-fast',
    reasoning: 'Standard',
    contextWindow: '32k',
    defaultProviderMapping: 'openai/gpt-oss-20b',
  },
];

export function getModelById(idOrName) {
  return (
    XEORVIA_MODELS.find(
      (m) =>
        m.id === idOrName ||
        m.name === idOrName ||
        (idOrName === 'system-architect-1.2' && m.id === 'system-architect-1.2-neo')
    ) ||
    XEORVIA_MODELS[0] // Default to System Architect 1.2 Neo
  );
}
