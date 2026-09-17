import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Sparkles,
  SlidersHorizontal,
  Code2,
  Download,
  Globe,
  Settings,
  ArrowLeft,
  Check,
  ChevronDown,
  PanelRightClose,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { XEORVIA_MODELS } from '../../services/ai/modelRegistry';
import UserMenuDropdown from '../auth/UserMenuDropdown';

export default function TopToolbar({
  project,
  onUpdateProjectName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  device,
  onSetDevice,
  selectedModel,
  onSelectModel,
  workspaceMode = 'ai',
  onToggleWorkspaceMode,
  showInspector = false,
  onToggleInspector,
  previewMode,
  onTogglePreviewMode,
  onOpenCodeViewer,
  onOpenExport,
  onOpenPublish,
  onOpenSettings,
  onBackToDashboard,
  saveStatus = 'Saved',
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.metadata?.name || '');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onUpdateProjectName(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="studio-top-toolbar" role="banner">
      {/* 1. Left Block: Navigation, Brand, Project Title & Undo/Redo */}
      <div className="toolbar-left-block">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="toolbar-back-btn"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft size={17} />
        </button>

        <BrandLogo size="default" isStudio={true} showParent={false} />

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Project Name Editing */}
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="toolbar-title-form">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="toolbar-title-input font-display"
            />
          </form>
        ) : (
          <div
            className="toolbar-project-name-wrap"
            onClick={() => {
              setTitleInput(project.metadata?.name || '');
              setIsEditingTitle(true);
            }}
            title={`Rename: ${project.metadata?.name || 'Untitled Experience'}`}
          >
            <span className="toolbar-project-name font-display">
              {project.metadata?.name || 'Untitled Experience'}
            </span>
            <span className="toolbar-save-badge font-mono">
              <Check size={11} className="save-check" />
              <span>{saveStatus}</span>
            </span>
          </div>
        )}

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Undo / Redo Buttons */}
        <div className="toolbar-btn-group">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="toolbar-icon-btn"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="toolbar-icon-btn"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 size={15} />
          </button>
        </div>
      </div>

      {/* 2. Center Block: Primary Mode Switcher & Device Viewports */}
      <div className="toolbar-center-block">
        {/* AI Workspace vs Manual Mode Switcher Pill */}
        <div className="toolbar-mode-switcher font-mono" role="radiogroup" aria-label="Editor Mode">
          <button
            type="button"
            role="radio"
            aria-checked={workspaceMode === 'ai'}
            onClick={() => workspaceMode !== 'ai' && onToggleWorkspaceMode && onToggleWorkspaceMode()}
            className={`toolbar-mode-btn ${workspaceMode === 'ai' ? 'active' : ''}`}
            title="AI Workspace Mode: natural language prompt and instant generation"
          >
            <Sparkles size={12} className="text-cyan" />
            <span>AI Workspace</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={workspaceMode === 'manual'}
            onClick={() => workspaceMode !== 'manual' && onToggleWorkspaceMode && onToggleWorkspaceMode()}
            className={`toolbar-mode-btn ${workspaceMode === 'manual' ? 'active' : ''}`}
            title="Manual Tools Mode: fine tune sections, themes, SEO, and pages"
          >
            <SlidersHorizontal size={12} />
            <span>Manual</span>
          </button>
        </div>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Responsive Device Switchers */}
        <div className="toolbar-device-switchers" role="radiogroup" aria-label="Device Viewport">
          <button
            type="button"
            role="radio"
            aria-checked={device === 'desktop'}
            onClick={() => onSetDevice('desktop')}
            className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
            title="Desktop Workstation (1280px)"
          >
            <Monitor size={15} />
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={device === 'tablet'}
            onClick={() => onSetDevice('tablet')}
            className={`device-btn ${device === 'tablet' ? 'active' : ''}`}
            title="Tablet Viewport (768px)"
          >
            <Tablet size={15} />
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={device === 'mobile'}
            onClick={() => onSetDevice('mobile')}
            className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
            title="Mobile Handheld (375px)"
          >
            <Smartphone size={15} />
          </button>
        </div>
      </div>

      {/* 3. Right Block: Model Selector, Preview, Inspector, Code, Export, Publish, Profile */}
      <div className="toolbar-right-block">
        {/* Xeorvia Model Selector */}
        <div className="toolbar-model-selector-wrap">
          <button
            type="button"
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="toolbar-model-dropdown-trigger font-mono"
            aria-haspopup="listbox"
            aria-expanded={modelDropdownOpen}
            title={`Active Model: ${selectedModel.name}`}
          >
            <span className="model-dot" />
            <span className="model-name-text">
              {selectedModel?.name ? selectedModel.name.replace('System ', '') : 'Architect 1.2 Neo'}
            </span>
            <ChevronDown size={13} className="dropdown-arrow" />
          </button>

          {modelDropdownOpen && (
            <div className="toolbar-model-menu glass-card">
              <div className="model-menu-header font-mono">
                <span>XEORVIA PRODUCT MODEL SYSTEM</span>
              </div>
              {XEORVIA_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model);
                    setModelDropdownOpen(false);
                  }}
                  className={`model-option-item ${
                    selectedModel.id === model.id ? 'active-model' : ''
                  }`}
                >
                  <div className="model-option-top">
                    <span className="model-opt-name font-display">{model.name}</span>
                    {model.recommended && (
                      <span className="badge-rec font-mono">RECOMMENDED</span>
                    )}
                  </div>
                  <p className="model-opt-desc">{model.description}</p>
                  <div className="model-opt-meta font-mono">
                    <span>CAPABILITY: {model.capabilityLevel}</span>
                    <span>CONTEXT: {model.contextWindow}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Live Presentation Preview Toggle */}
        <button
          type="button"
          onClick={onTogglePreviewMode}
          className={`btn btn-secondary toolbar-action-pill ${
            previewMode ? 'btn-preview-active' : ''
          }`}
          title="Toggle Clean Presentation Preview"
        >
          <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Toggle Inspector (Manual Fine-Tuning Only) */}
        {!previewMode && workspaceMode === 'manual' && (
          <button
            type="button"
            onClick={onToggleInspector}
            className={`toolbar-icon-btn ${showInspector ? 'btn-active-toggle' : ''}`}
            title={showInspector ? 'Hide Element Inspector' : 'Open Element Inspector'}
            aria-label="Toggle Element Inspector"
          >
            <PanelRightClose size={16} />
          </button>
        )}

        {/* Code Viewer Button (Manual Mode Only) */}
        {workspaceMode === 'manual' && (
          <button
            type="button"
            onClick={onOpenCodeViewer}
            className="toolbar-icon-btn"
            title="View Generated Code"
          >
            <Code2 size={16} />
          </button>
        )}

        {/* Export Modal Button */}
        <button
          type="button"
          onClick={onOpenExport}
          className="toolbar-icon-btn"
          title="Export Project (ZIP / JSON)"
        >
          <Download size={16} />
        </button>

        {/* Publish Button */}
        <button
          type="button"
          onClick={onOpenPublish}
          className="btn btn-primary toolbar-publish-btn"
        >
          <Globe size={14} />
          <span>Publish</span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="toolbar-icon-btn"
          title="Project & AI Settings"
        >
          <Settings size={16} />
        </button>

        {/* User Account Menu */}
        <UserMenuDropdown onNavigate={(h) => window.location.hash = h} />
      </div>
    </header>
  );
}
