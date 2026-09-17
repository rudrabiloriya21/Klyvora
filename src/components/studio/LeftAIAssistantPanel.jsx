import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Zap,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Sparkles,
  Palette,
  Layers,
  FileEdit,
  Flame,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Dices,
} from 'lucide-react';
import { providerRegistry } from '../../services/ai/providerRegistry';

let msgCounter = 0;
function createMsgId(prefix = 'msg') {
  msgCounter += 1;
  return `${prefix}_${Date.now()}_${msgCounter}`;
}

const QUICK_PALETTES = [
  { id: 'emerald', name: 'Emerald', primary: '#10b981', secondary: '#059669', bg: '#061a14', text: '#ecfdf5' },
  { id: 'cyan', name: 'Cyan Glow', primary: '#06b6d4', secondary: '#0284c7', bg: '#08131e', text: '#f0fdfa' },
  { id: 'violet', name: 'Neon Violet', primary: '#8b5cf6', secondary: '#6366f1', bg: '#100b20', text: '#f5f3ff' },
  { id: 'amber', name: 'Royal Gold', primary: '#f59e0b', secondary: '#d97706', bg: '#1c1503', text: '#fffbeb' },
  { id: 'rose', name: 'Crimson Luxe', primary: '#f43f5e', secondary: '#e11d48', bg: '#1f0910', text: '#fff1f2' },
  { id: 'dark', name: 'Obsidian', primary: '#e2e8f0', secondary: '#94a3b8', bg: '#090b10', text: '#ffffff' },
];

const SURPRISE_PROMPTS = [
  'Change the theme to luxury obsidian black with glowing gold accents and modern curves',
  'Add a 5-star customer reviews section with glowing testimonials and verified badges',
  'Make the hero section headline punchy, bold, and cinematic to captivate visitors',
  'Add a 3-tier pricing section with Starter, Professional, and Enterprise plans',
  'Add an FAQ section with 4 helpful questions and detailed answers',
  'Add a WhatsApp order and live chat button in the hero and contact sections',
  'Add a limited-time 20% discount offer badge with subtle glow to the hero banner',
  'Rewrite the about section narrative to emphasize world-class craftsmanship and heritage',
];

export default function LeftAIAssistantPanel({
  project,
  selectedModel,
  onApplyActions,
  onUndo,
  canUndo,
  selectedSectionId,
  onClearSelectedSection,
  onSelectSection: _onSelectSection,
  onSwitchToManual,
  onUpdateTheme,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onDeleteSection,
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAppliedActions, setLastAppliedActions] = useState([]);
  const [activeChipCategory, setActiveChipCategory] = useState('themes');
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: `Hi! Welcome to your AI Workspace. Just type what you want to change, add, or customize, and I'll update your website live in seconds.`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, lastAppliedActions]);

  // Auto-resize textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputPrompt]);

  // Find currently targeted section (if any)
  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
  const allSections = homePage?.sections || [];
  const targetedSection = selectedSectionId
    ? allSections.find((s) => s.id === selectedSectionId)
    : null;
  const targetedSectionIndex = targetedSection
    ? allSections.findIndex((s) => s.id === selectedSectionId)
    : -1;

  const handleSendMessage = async (customPrompt) => {
    const rawText = (customPrompt || inputPrompt).trim();
    if (!rawText || isProcessing) return;

    // If a section is explicitly selected and the user didn't write custom section markers, prepend context
    let promptToSend = rawText;
    if (targetedSection && !customPrompt) {
      promptToSend = `[Target Section: "${targetedSection.name || targetedSection.type}" (type: ${targetedSection.type})] ${rawText}`;
    }

    const userMsg = {
      id: createMsgId('user'),
      role: 'user',
      text: rawText,
      targetSectionName: targetedSection?.name || targetedSection?.type,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsProcessing(true);
    setLastAppliedActions([]);

    try {
      const response = await providerRegistry.processUserPrompt({
        prompt: promptToSend,
        project,
        selectedModel,
        history: messages,
      });

      // Automatically execute and apply mutations in real time!
      if (response.actions && response.actions.length > 0) {
        onApplyActions(response.actions);
        setLastAppliedActions(response.actions);
      }

      const assistantMsg = {
        id: createMsgId('ai'),
        role: 'assistant',
        text: response.message || 'Updated the website according to your instruction.',
        actions: response.actions || [],
        isFallback: response.isFallback,
        provider: response.provider,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMsgId('ai_err'),
          role: 'assistant',
          text: `Error updating website: ${err.message}. Please try rephrasing your prompt.`,
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: createMsgId('msg_welcome_reset'),
        role: 'assistant',
        text: `Workspace cleared. What would you like to build or update next?`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setLastAppliedActions([]);
    if (onClearSelectedSection) onClearSelectedSection();
  };

  const handleSurpriseMe = () => {
    const randomPrompt = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setInputPrompt(randomPrompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleApplyPalette = (palette) => {
    if (onUpdateTheme) {
      onUpdateTheme({
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        backgroundColor: palette.bg,
        textColor: palette.text,
      });
      // Add friendly chat confirmation
      const palMsg = {
        id: createMsgId('ai_pal'),
        role: 'assistant',
        text: `Applied the ${palette.name} theme palette to your website!`,
        actions: [
          {
            type: 'update_style',
            description: `Switched theme palette to ${palette.name}`,
          },
        ],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, palMsg]);
    }
  };

  // Human-friendly action labels
  const formatActionTitle = (act) => {
    if (act.description) return act.description;
    if (act.type === 'update_style') return 'Updated color and design styling';
    if (act.type === 'update_text') return 'Refreshed section copy & text';
    if (act.type === 'add_item') return 'Added new showcase item / review';
    if (act.type === 'update_item') return 'Updated item details';
    if (act.type === 'delete_item') return 'Removed item';
    if (act.type === 'add_section') return 'Added new section';
    if (act.type === 'delete_section') return 'Removed section';
    return act.type;
  };

  // Section-specific quick prompts
  const getSectionSpecificChips = (type) => {
    switch (type) {
      case 'hero':
        return [
          { text: '⚡ Punchy Headline', prompt: 'Make the hero headline punchy, bold, and cinematic' },
          { text: '💬 Add WhatsApp CTA', prompt: 'Add a WhatsApp order and chat button to the hero section' },
          { text: '🏷️ Add 20% Offer Badge', prompt: 'Add a 20% discount offer badge to the hero section' },
          { text: '📸 Modern Split Layout', prompt: 'Make the hero layout a split modern showcase with an image card' },
        ];
      case 'products':
        return [
          { text: '➕ Add Special Item', prompt: 'Add a new signature seasonal item with description and price' },
          { text: '⭐ Best Seller Badge', prompt: 'Add a "Best Seller" tag to the first product' },
          { text: '💵 Adjust Pricing', prompt: 'Update all product prices to make them realistic premium rates' },
        ];
      case 'testimonials':
        return [
          { text: '⭐ Add 5-Star Review', prompt: 'Add a glowing 5-star customer review with verified patron badge' },
          { text: '✍️ Authentic Quotes', prompt: 'Rewrite the testimonials to sound authentic, specific, and enthusiastic' },
        ];
      case 'pricing':
        return [
          { text: '💎 Highlight Popular Tier', prompt: 'Highlight the middle pricing tier with a "Most Popular" badge' },
          { text: '➕ Add Features List', prompt: 'Add 2 more compelling bullet points to each pricing plan' },
        ];
      case 'features':
        return [
          { text: '✨ Modernize Benefits', prompt: 'Rewrite features to highlight speed, reliability, and craft excellence' },
          { text: '➕ Add Feature Item', prompt: 'Add a 4th feature highlighting 24/7 dedicated support' },
        ];
      case 'about':
        return [
          { text: '📖 Focus on Craft', prompt: 'Rewrite the about story emphasizing artisan quality and dedication' },
          { text: '✂️ Make Concise', prompt: 'Make the about text punchy and concise with 2 strong paragraphs' },
        ];
      case 'faq':
        return [
          { text: '➕ Add Questions', prompt: 'Add 2 more helpful customer questions and answers to the FAQ' },
        ];
      case 'contact':
        return [
          { text: '📍 Add Hours & Address', prompt: 'Add full business operating hours and downtown address to contact' },
        ];
      default:
        return [
          { text: '✨ Polish Content', prompt: `Make the content of the ${type} section more engaging and modern` },
        ];
    }
  };

  // General Categorized Inspiration Chips
  const chipCategories = [
    { id: 'themes', label: 'Colors & Style', icon: <Palette size={12} /> },
    { id: 'sections', label: 'Add Sections', icon: <Layers size={12} /> },
    { id: 'copy', label: 'Content & Copy', icon: <FileEdit size={12} /> },
    { id: 'quick', label: 'Quick Ideas', icon: <Flame size={12} /> },
  ];

  const inspirationChips = {
    themes: [
      { text: 'Dark Emerald & Obsidian', prompt: 'Change theme to modern emerald green and deep obsidian black with high contrast' },
      { text: 'Luxury Midnight & Gold', prompt: 'Change theme to luxury midnight black with warm amber gold accents and elegant curves' },
      { text: 'Cyberpunk Neon & Cyan', prompt: 'Change theme to vibrant cyberpunk neon cyan and deep violet with glowing accents' },
      { text: 'Minimal Clean White', prompt: 'Change theme to minimalist clean white and silver with crisp typography' },
    ],
    sections: [
      { text: '+ Customer Reviews', prompt: 'Add a customer testimonials section with glowing reviews and 5-star ratings' },
      { text: '+ 3-Tier Pricing Plans', prompt: 'Add a 3-tier pricing table section with Starter, Pro, and Enterprise tiers' },
      { text: '+ FAQ Section', prompt: 'Add an FAQ section with 4 helpful questions and answers' },
      { text: '+ Features Grid', prompt: 'Add a modern 3-column features section highlighting key benefits' },
    ],
    copy: [
      { text: 'Punchy Cinematic Headline', prompt: 'Make the hero headline punchy, bold, and cinematic to grab attention immediately' },
      { text: 'Add WhatsApp Order Button', prompt: 'Add a WhatsApp order button with direct chat link to the hero section' },
      { text: 'Rewrite About for Luxury', prompt: 'Rewrite the about section narrative with an emphasis on craftsmanship, quality, and heritage' },
      { text: 'Add Special Offer Badge', prompt: 'Add a limited-time 20% discount offer badge to the hero banner' },
    ],
    quick: [
      { text: 'Modernize Look & Contrast', prompt: 'Make the whole website look more modern with smooth card corners and better contrast' },
      { text: 'Round All Card Corners', prompt: 'Update border radius to 20px for a smooth modern pill look across all sections' },
      { text: 'Add Location & Hours', prompt: 'Update the contact section with full downtown address and business operating hours' },
    ],
  };

  return (
    <div className="left-ai-assistant-panel font-sans" role="region" aria-label="AI Website Assistant">
      {/* Top Telemetry Header */}
      <div className="left-ai-header">
        <div className="left-ai-model-status">
          <div className="left-ai-pulse-dot" aria-hidden="true" />
          <div className="left-ai-model-info">
            <div className="left-ai-badge font-mono" title="System Architect 1.2 Neo">
              <Zap size={13} className="text-cyan fill-cyan" />
              <span className="left-ai-title font-display">AI WORKSPACE</span>
            </div>
            <span className="left-ai-sub font-mono">SYSTEM ARCHITECT 1.2 NEO</span>
          </div>
        </div>

        <div className="left-ai-header-actions">
          {canUndo && (
            <button
              type="button"
              onClick={onUndo}
              className="left-ai-header-undo-btn font-mono"
              title="Undo last change (Ctrl+Z)"
            >
              <RotateCcw size={12} />
              <span>Undo</span>
            </button>
          )}

          {onSwitchToManual && (
            <button
              type="button"
              onClick={onSwitchToManual}
              className="left-ai-switch-mode-btn font-mono"
              title="Switch to manual tools"
            >
              <SlidersHorizontal size={12} />
              <span>Manual</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearHistory}
            className="left-ai-reset-btn"
            title="Start new conversation"
            aria-label="Clear chat history"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* 1-Tap Instant Color Palette Bar */}
      <div className="left-ai-palette-strip">
        <div className="palette-strip-title">
          <Palette size={12} className="text-cyan" />
          <span className="font-mono">Themes:</span>
        </div>
        <div className="palette-swatches-row">
          {QUICK_PALETTES.map((pal) => {
            const isCurrentPrimary = project.theme?.primaryColor?.toLowerCase() === pal.primary.toLowerCase();
            return (
              <button
                key={pal.id}
                type="button"
                onClick={() => handleApplyPalette(pal)}
                className={`palette-swatch-circle ${isCurrentPrimary ? 'active-swatch' : ''}`}
                style={{ background: `linear-gradient(135deg, ${pal.primary}, ${pal.secondary})` }}
                title={`${pal.name} Theme`}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleSurpriseMe}
          className="left-ai-surprise-btn font-mono"
          title="Inspire me with a creative prompt"
        >
          <Dices size={12} />
          <span>Surprise Me</span>
        </button>
      </div>

      {/* Active Section Focus Banner (if a section is clicked on canvas) */}
      {targetedSection && (
        <div className="left-ai-section-focus-bar">
          <div className="section-focus-header">
            <div className="section-focus-title-wrap">
              <span className="section-focus-indicator" />
              <span className="section-focus-name font-mono">
                {targetedSection.name || targetedSection.type} Section
              </span>
            </div>

            {/* Quick Actions for this section */}
            <div className="section-focus-actions">
              {onMoveSectionUp && (
                <button
                  type="button"
                  disabled={targetedSectionIndex === 0}
                  onClick={() => onMoveSectionUp(targetedSection.id)}
                  className="section-focus-btn"
                  title="Move section up"
                >
                  <ChevronUp size={13} />
                </button>
              )}
              {onMoveSectionDown && (
                <button
                  type="button"
                  disabled={targetedSectionIndex === allSections.length - 1}
                  onClick={() => onMoveSectionDown(targetedSection.id)}
                  className="section-focus-btn"
                  title="Move section down"
                >
                  <ChevronDown size={13} />
                </button>
              )}
              {onDuplicateSection && (
                <button
                  type="button"
                  onClick={() => onDuplicateSection(targetedSection.id)}
                  className="section-focus-btn"
                  title="Duplicate section"
                >
                  <Copy size={12} />
                </button>
              )}
              {onDeleteSection && (
                <button
                  type="button"
                  onClick={() => onDeleteSection(targetedSection.id)}
                  className="section-focus-btn delete-btn"
                  title="Delete section"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <button
                type="button"
                onClick={onClearSelectedSection}
                className="section-focus-clear-btn font-mono"
                title="Deselect (Edit whole site)"
              >
                <X size={12} />
                <span>Whole Site</span>
              </button>
            </div>
          </div>

          {/* Section-tailored fast prompt pills */}
          <div className="section-focus-chips">
            {getSectionSpecificChips(targetedSection.type).map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isProcessing}
                className="section-focus-chip font-mono"
              >
                <Sparkles size={10} className="text-cyan" />
                <span>{chip.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="left-ai-messages-scroll" ref={chatScrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`left-ai-msg-row role-${msg.role}`}>
            <div className="left-ai-avatar">
              {msg.role === 'user' ? (
                <User size={13} />
              ) : (
                <Bot size={14} className="text-cyan" />
              )}
            </div>

            <div className="left-ai-bubble">
              {/* Optional User Target Context */}
              {msg.targetSectionName && (
                <div className="left-ai-msg-context-tag font-mono">
                  <span>Target: {msg.targetSectionName}</span>
                </div>
              )}

              <p className="left-ai-bubble-text">{msg.text}</p>

              {/* Display humanized applied mutation tags */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="left-ai-mutations-box">
                  <div className="left-ai-mutations-head">
                    <span className="left-ai-mutations-title font-mono">
                      <CheckCircle2 size={12} className="text-cyan" />
                      <span>Applied Changes ({msg.actions.length}):</span>
                    </span>
                    {canUndo && (
                      <button
                        type="button"
                        onClick={onUndo}
                        className="left-ai-inline-undo-btn font-mono"
                        title="Undo this update"
                      >
                        <RotateCcw size={10} />
                        <span>Undo</span>
                      </button>
                    )}
                  </div>
                  <div className="left-ai-mutations-list">
                    {msg.actions.map((act, i) => (
                      <span key={i} className="left-ai-mutation-pill font-mono">
                        {formatActionTitle(act)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <span className="left-ai-msg-time font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Live Processing Indicator */}
        {isProcessing && (
          <div className="left-ai-msg-row role-assistant">
            <div className="left-ai-avatar">
              <Bot size={14} className="text-cyan" />
            </div>
            <div className="left-ai-bubble left-ai-thinking-bubble font-mono">
              <span className="thinking-spinner" aria-hidden="true" />
              <div className="thinking-text-wrap">
                <span className="thinking-title">Synthesizing website updates...</span>
                <span className="thinking-sub">System Architect 1.2 Neo applying mutations to live site</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Undo Banner if recent changes were made */}
      {lastAppliedActions.length > 0 && canUndo && (
        <div className="left-ai-undo-bar font-mono">
          <div className="left-ai-undo-info">
            <span className="text-cyan">✓ Updated live website</span>
            <span className="left-ai-undo-count">({lastAppliedActions.length} change{lastAppliedActions.length > 1 ? 's' : ''})</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onUndo();
              setLastAppliedActions([]);
            }}
            className="left-ai-undo-action-btn font-mono"
            title="Revert previous update"
          >
            <RotateCcw size={12} />
            <span>Undo Edit</span>
          </button>
        </div>
      )}

      {/* Categorized Inspiration Chips (shown when no section is selected) */}
      {!targetedSection && (
        <div className="left-ai-suggestions-container">
          <div className="left-ai-chip-cats">
            {chipCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveChipCategory(cat.id)}
                className={`left-ai-cat-pill font-mono ${activeChipCategory === cat.id ? 'active' : ''}`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="left-ai-chips-wrapper">
            {inspirationChips[activeChipCategory]?.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isProcessing}
                className="left-ai-chip"
                title={chip.prompt}
              >
                <Sparkles size={11} className="chip-sparkle-icon text-cyan" />
                <span>{chip.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Workspace Prompt Input Box */}
      <div className="left-ai-input-form-wrap">
        <div className="left-ai-input-container">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              targetedSection
                ? `What would you like to change in the ${targetedSection.name || targetedSection.type} section?`
                : "Type what you need (e.g. 'Add customer reviews', 'Change theme to emerald', 'Make hero punchy')..."
            }
            disabled={isProcessing}
            className="left-ai-textarea"
          />

          <div className="left-ai-input-bottom-row">
            <span className="left-ai-input-shortcut font-mono">
              Press <strong>↵ Enter</strong> to apply
            </span>

            <div className="left-ai-input-buttons">
              {inputPrompt.trim() && (
                <button
                  type="button"
                  onClick={() => setInputPrompt('')}
                  className="left-ai-clear-btn"
                  title="Clear input"
                >
                  <X size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isProcessing}
                className="left-ai-send-btn"
                aria-label="Apply website changes"
                title="Apply changes to website"
              >
                <Sparkles size={14} />
                <span>Update Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
