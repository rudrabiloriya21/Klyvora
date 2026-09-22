import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';
import { groqService } from '../../services/ai/groqService';
import { getModelById } from '../../services/ai/modelRegistry';

const SUGGESTIONS = [
  { label: '₹ Rupee Pricing', prompt: 'Format all pricing, fee structures, and products in Indian Rupees (₹) with realistic prices' },
  { label: '💬 WhatsApp CTA', prompt: 'Add a direct 1-tap WhatsApp order or admission enquiry button with +91 phone number' },
  { label: '📍 Store Address & Maps', prompt: 'Add our local shop address, landmark, operating hours, and Google Maps direction info' },
  { label: '⭐ Indian Patron Reviews', prompt: 'Add 5-star customer testimonials from verified Indian patrons, students, and clients' },
  { label: '🏷️ Festive Offer Banner', prompt: 'Add a top announcement bar with a 20% festival discount and coupon code' },
  { label: '🎨 Royal Saffron Theme', prompt: 'Update color palette with vibrant Indian saffron gold and deep obsidian elegance' },
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
  const [isMinimized, setIsMinimized] = useState(false);

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

  // Minimized Sleek Trigger Pill
  if (isMinimized) {
    return (
      <div className="floating-ai-copilot-container is-minimized" role="region" aria-label="AI Website Assistant">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="copilot-minimized-trigger glass-card font-sans"
          aria-label="Expand AI Copilot"
          title="Click to expand AI Copilot assistant"
        >
          <Sparkles size={14} className="copilot-sparkle-icon text-cyan" />
          <span className="copilot-minimized-label">AI Copilot</span>
          {targetedSection && (
            <span className="copilot-minimized-badge">
              {targetedSection.name || targetedSection.type}
            </span>
          )}
          <ChevronUp size={14} className="copilot-chevron-icon" />
        </button>

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

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="copilot-minimize-btn"
          title="Minimize AI Copilot to see full website"
          aria-label="Minimize AI Copilot"
        >
          <ChevronDown size={15} />
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
