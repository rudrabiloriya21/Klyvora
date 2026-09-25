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
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

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

      // Instantly execute & apply mutations to the live preview canvas!
      if (response.actions && response.actions.length > 0) {
        onApplyActions(response.actions);
      }

      const assistantMsg = {
        id: createMsgId('ai'),
        role: 'assistant',
        text: response.message,
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
          text: `Error processing request: ${err.message}. Please check your AI provider configuration or rephrase your prompt.`,
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
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
              {msg.actions && msg.actions.length > 0 && (
                <div className="ai-applied-actions-card font-mono">
                  <div className="applied-actions-header">
                    <Check size={12} className="text-emerald" />
                    <span>{msg.actions.length} MUTATION{msg.actions.length > 1 ? 'S' : ''} APPLIED LIVE</span>
                  </div>
                  <div className="applied-actions-chips">
                    {msg.actions.map((act, idx) => (
                      <div key={idx} className="applied-action-chip">
                        <span className="applied-chip-type">{act.type}</span>
                        <span className="applied-chip-desc">{act.description || act.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <span>Analyzing project structure & applying mutations live...</span>
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
