import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Palette, Star, MessageCircle, DollarSign, HelpCircle, Check, Loader2 } from 'lucide-react';
import { groqService } from '../../services/ai/groqService';
import { getModelById } from '../../services/ai/modelRegistry';

const SUGGESTIONS = [
  { label: 'Theme Colors', prompt: 'Change website colors to a warm golden bakery theme with dark espresso background' },
  { label: 'Rewrite Hero', prompt: 'Make the hero headline punchier, bolder, and more inviting' },
  { label: 'Add Reviews', prompt: 'Add a customer testimonials section with 5-star reviews and customer quotes' },
  { label: 'WhatsApp Order', prompt: 'Add a WhatsApp direct order button to the navigation and contact section' },
  { label: 'Pricing Table', prompt: 'Add a clean pricing table with Starter, Popular, and Deluxe tiers' },
  { label: 'Add FAQ', prompt: 'Add an FAQ section with 3 helpful questions and clear answers' },
];

export default function FloatingAICopilot({
  project,
  selectedSectionId,
  onClearSelectedSection,
  onApplyActions,
  previewMode,
}) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (previewMode) return null;

  // Find targeted section if selected
  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
  const allSections = homePage?.sections || [];
  const targetedSection = selectedSectionId
    ? allSections.find((s) => s.id === selectedSectionId)
    : null;

  const handleSubmitPrompt = async (customText) => {
    const textToSend = (customText || prompt).trim();
    if (!textToSend || isProcessing) return;

    setIsProcessing(true);
    setStatusMessage('Klyvora AI is updating your website...');

    let enrichedPrompt = textToSend;
    if (targetedSection && !customText) {
      enrichedPrompt = `[Target Section: "${targetedSection.name || targetedSection.type}"] ${textToSend}`;
    }

    try {
      const activeModel = getModelById('system-architect-1.2-neo');
      const result = await groqService.processModificationPrompt({
        prompt: enrichedPrompt,
        project,
        history: [],
        selectedModel: activeModel,
      });

      if (result.actions && result.actions.length > 0) {
        onApplyActions(result.actions);
        setStatusMessage(result.message || 'Website updated successfully!');
      } else {
        setStatusMessage('AI reviewed your request.');
      }

      setPrompt('');
      setTimeout(() => {
        setStatusMessage('');
      }, 4000);
    } catch (err) {
      console.warn('[FloatingAICopilot] Error updating website:', err);
      setStatusMessage('Could not complete update. Please try again.');
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="floating-ai-copilot-container" role="region" aria-label="AI Website Assistant">
      {/* 1. Floating Quick Action Suggestion Chips */}
      <div className="floating-copilot-chips">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug.label}
            type="button"
            disabled={isProcessing}
            onClick={() => handleSubmitPrompt(sug.prompt)}
            className="copilot-chip font-sans"
          >
            <Sparkles size={11} className="text-cyan" />
            <span>{sug.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Floating Main Prompt Bar */}
      <div className="floating-copilot-bar glass-card">
        {/* Active Target Section Indicator */}
        {targetedSection && (
          <div className="copilot-target-tag font-sans" title="Changes will apply to this section">
            <span>Editing: {targetedSection.name || targetedSection.type}</span>
            <button
              type="button"
              onClick={onClearSelectedSection}
              className="copilot-target-close"
              title="Target whole website instead"
              aria-label="Target whole website"
            >
              <X size={11} />
            </button>
          </div>
        )}

        <div className="copilot-input-wrapper">
          <Sparkles size={17} className="copilot-sparkle-icon text-cyan" />
          <input
            type="text"
            value={prompt}
            disabled={isProcessing}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitPrompt();
              }
            }}
            placeholder={
              targetedSection
                ? `Ask AI to change or rewrite the ${targetedSection.name || targetedSection.type}...`
                : 'Ask AI to change, add, or redesign anything on your website...'
            }
            className="copilot-input font-sans"
          />
        </div>

        <button
          type="button"
          disabled={!prompt.trim() || isProcessing}
          onClick={() => handleSubmitPrompt()}
          className="btn btn-primary copilot-submit-btn font-sans"
        >
          {isProcessing ? (
            <>
              <Loader2 size={14} className="copilot-spinner" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>Update</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* 3. Feedback Status Banner */}
      {statusMessage && (
        <div className="copilot-status-toast glass-card font-sans">
          {isProcessing ? (
            <Loader2 size={13} className="copilot-spinner text-cyan" />
          ) : (
            <Check size={13} className="text-emerald" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
