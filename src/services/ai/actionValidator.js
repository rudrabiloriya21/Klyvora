/**
 * Validates AI action payloads to guarantee state integrity.
 * Rejects corrupt paths or unsupported mutations before touching project state.
 */

const ALLOWED_ACTION_TYPES = [
  'update_text',
  'update_style',
  'update_theme',
  'update_layout',
  'add_section',
  'remove_section',
  'update_section',
  'update_section_props',
  'add_item',
  'update_item',
  'delete_item',
  'duplicate_section',
  'reorder_section',
  'update_button',
  'update_seo',
  'create_page',
  'delete_page',
  'rename_page',
];

export function validateActions(actions, _project) {
  if (!Array.isArray(actions)) {
    return {
      isValid: false,
      validActions: [],
      invalidActions: [{ reason: 'Actions payload must be an array', raw: actions }],
    };
  }

  const validActions = [];
  const invalidActions = [];

  for (const action of actions) {
    if (!action || typeof action !== 'object') {
      invalidActions.push({ reason: 'Action is not a valid object', action });
      continue;
    }

    if (!ALLOWED_ACTION_TYPES.includes(action.type)) {
      invalidActions.push({
        reason: `Unsupported action type: "${action.type}"`,
        action,
      });
      continue;
    }

    // Target is optional for create_page or add_section if value is provided
    if (!action.target && action.type !== 'create_page' && action.type !== 'add_section') {
      invalidActions.push({
        reason: 'Action missing target path',
        action,
      });
      continue;
    }

    // Target path sanity check (prevent arbitrary prototype pollution)
    if (typeof action.target === 'string') {
      if (action.target.includes('__proto__') || action.target.includes('constructor') || action.target.includes('prototype')) {
        invalidActions.push({
          reason: 'Forbidden target path detected (security validation)',
          action,
        });
        continue;
      }
    }

    validActions.push(action);
  }

  return {
    isValid: invalidActions.length === 0,
    validActions,
    invalidActions,
  };
}
