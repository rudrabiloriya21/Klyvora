import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Check, Bot, User } from 'lucide-react';
import { providerRegistry } from '../../services/ai/providerRegistry';

let msgCounter = 0;
function createMsgId(prefix = 'msg') {
  msgCounter += 1;
  return `${prefix}_${Date.now()}_${msgCounter}`;
}

export default function AIAssistantDrawer({
  isOpen,
  onClose,
  project,
  selectedModel,
  onApplyActions,
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: `Greetings. I am ${selectedModel.name}, your Xeorvia website architect. How can I refine the ${project.brand?.businessName || 'project'} digital experience today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingActions, setPendingActions] = useState(null);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, pendingActions]);

  const handleSendMessage = async (customPrompt) => {
    const text = (customPrompt || inputPrompt).trim();
    if (!text || isProcessing) return;

    const userMsg = {
      id: createMsgId('user'),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);
    setPendingActions(null);

    try {
      const response = await providerRegistry.processUserPrompt({
        prompt: text,
        project,
        selectedModel,
        history: messages,
      });

      const assistantMsg = {
        id: createMsgId('ai'),
        role: 'assistant',
        text: response.message,
        isFallback: response.isFallback,
        provider: response.provider,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (response.actions && response.actions.length > 0) {
        setPendingActions(response.actions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMsgId('ai_err'),
          role: 'assistant',
          text: `Error processing request: ${err.message}. Please check your AI provider configuration or rephrase your prompt.`,
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptPendingActions = () => {
    if (!pendingActions) return;
    onApplyActions(pendingActions);
    setPendingActions(null);

    setMessages((prev) => [
      ...prev,
      {
        id: createMsgId('msg_applied'),
        role: 'system',
        text: `✓ Successfully applied ${pendingActions.length} architectural mutations to the live preview.`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleRejectPendingActions = () => {
    setPendingActions(null);
    setMessages((prev) => [
      ...prev,
      {
        id: createMsgId('msg_rejected'),
        role: 'system',
        text: 'Changes discarded. The live project state was preserved.',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'Make the hero section more luxury and cinematic',
    'Add a customer testimonials section',
    'Add a WhatsApp order button',
    'Change the primary color to emerald & obsidian',
    'Add a transparent pricing table',
    'Optimize SEO metadata and keywords',
  ];

  return (
    <div className="studio-ai-drawer glass-card glass-card-elevated" role="region" aria-label="AI Assistant">
      {/* Drawer Header */}
      <div className="ai-drawer-header">
        <div className="ai-drawer-model-badge">
          <Sparkles size={16} className="text-cyan" />
          <div className="ai-drawer-title-column">
            <span className="ai-drawer-title font-display">{selectedModel.name}</span>
            <span className="ai-drawer-sub font-mono">XEORVIA ARCHITECT ENGINE</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ai-drawer-close-btn"
          aria-label="Close AI Assistant"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="ai-messages-scroll" ref={chatScrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-message-row role-${msg.role}`}>
            <div className="ai-msg-avatar">
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-cyan" />}
            </div>
            <div className="ai-msg-bubble">
              {msg.isFallback && (
                <div className="engine-status-tag font-mono">
                  [Engine: Local Intelligent Simulator]
                </div>
              )}
              <p className="ai-msg-text">{msg.text}</p>
              <span className="ai-msg-time font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="ai-message-row role-assistant">
            <div className="ai-msg-avatar">
              <Bot size={14} className="text-cyan" />
            </div>
            <div className="ai-msg-bubble ai-thinking-bubble font-mono">
              <span className="thinking-spinner" />
              <span>Analyzing project structure & synthesizing actions...</span>
            </div>
          </div>
        )}

        {/* Pending Actions Diff Card */}
        {pendingActions && (
          <div className="pending-actions-card glass-card">
            <div className="pending-header font-mono">
              <Sparkles size={14} className="text-cyan" />
              <span>PROPOSED ARCHITECTURAL MUTATIONS ({pendingActions.length})</span>
            </div>

            <ul className="pending-actions-list">
              {pendingActions.map((action, i) => (
                <li key={i} className="pending-action-item">
                  <span className="pending-type-tag font-mono">{action.type}</span>
                  <span className="pending-desc">
                    {action.description || `${action.target}: ${JSON.stringify(action.value).slice(0, 35)}...`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pending-actions-btn-row">
              <button
                type="button"
                onClick={handleAcceptPendingActions}
                className="btn btn-primary btn-accept font-mono"
              >
                <Check size={14} />
                <span>Apply to Preview</span>
              </button>
              <button
                type="button"
                onClick={handleRejectPendingActions}
                className="btn btn-secondary btn-reject font-mono"
              >
                <X size={14} />
                <span>Discard</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="ai-quick-prompts-bar">
        <span className="quick-label font-mono">SUGGESTIONS:</span>
        <div className="quick-chips-scroll">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(qp)}
              disabled={isProcessing}
              className="quick-prompt-chip"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="ai-chat-input-form"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Instruct ${selectedModel.name}...`}
          disabled={isProcessing}
          className="ai-chat-input"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isProcessing}
          className="ai-chat-send-btn"
          aria-label="Send prompt"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
