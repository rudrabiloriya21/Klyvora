import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Undo2,
  Redo2,
  Sparkles,
  Download,
  Globe,
  Settings,
  ArrowLeft,
  Check,
  Palette,
  Eye,
  EyeOff,
  Layers,
  Edit2,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';
import UserMenuDropdown from '../auth/UserMenuDropdown';

const THEME_PRESETS = [
  { id: 'obsidian', name: 'Obsidian Cyan', primary: '#06b6d4', secondary: '#8b5cf6', bg: '#07080c' },
  { id: 'warm', name: 'Artisan Warmth', primary: '#f59e0b', secondary: '#d97706', bg: '#0c0a09' },
  { id: 'emerald', name: 'Emerald Forest', primary: '#10b981', secondary: '#06b6d4', bg: '#061a14' },
  { id: 'violet', name: 'Ultra Violet', primary: '#8b5cf6', secondary: '#ec4899', bg: '#0d0b18' },
  { id: 'crimson', name: 'Crimson Luxe', primary: '#f43f5e', secondary: '#fb7185', bg: '#14090d' },
  { id: 'minimal', name: 'Pure Minimal', primary: '#e2e8f0', secondary: '#38bdf8', bg: '#090a0f' },
];

export default function TopToolbar({
  project,
  onUpdateProjectName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  device,
  onSetDevice,
  showSidebar,
  onToggleSidebar,
  onUpdateTheme,
  previewMode,
  onTogglePreviewMode,
  onOpenExport,
  onOpenPublish,
  onOpenSettings,
  onBackToDashboard,
  saveStatus = 'Saved',
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.metadata?.name || '');
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onUpdateProjectName(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="studio-top-toolbar" role="banner">
      {/* 1. Left Block: Back, Breadcrumb Logo, Project Title & Subtle Auto-save Status */}
      <div className="toolbar-left-block">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="toolbar-back-btn"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft size={14} />
          <span className="back-btn-text">Dashboard</span>
        </button>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Brand Mark with quick tooltip */}
        <div className="toolbar-brand-wrap" title="Klyvora Studio">
          <BrandLogo size="small" iconOnly={true} />
        </div>

        <span className="toolbar-breadcrumb-slash">/</span>

        {/* Project Name Editing */}
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="toolbar-title-form">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="toolbar-title-input font-sans"
              placeholder="Website Name"
            />
          </form>
        ) : (
          <div
            className="toolbar-project-name-wrap"
            onClick={() => {
              setTitleInput(project.metadata?.name || '');
              setIsEditingTitle(true);
            }}
            title="Click to rename website"
          >
            <span className="toolbar-project-name font-sans">
              {project.metadata?.name || 'My Website'}
            </span>
            <Edit2 size={12} className="rename-icon" />
          </div>
        )}

        {/* Subtle live save indicator */}
        <div
          className="toolbar-save-status"
          title={saveStatus === 'Saving...' ? 'Saving changes...' : 'All changes saved locally'}
        >
          <span className={`save-dot-live ${saveStatus === 'Saving...' ? 'saving' : ''}`} />
          <span className="save-status-text font-mono">
            {saveStatus === 'Saving...' ? 'Saving' : 'Saved'}
          </span>
        </div>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Undo / Redo */}
        <div className="toolbar-undo-group">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="toolbar-icon-btn"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="toolbar-icon-btn"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* 2. Center Block: Perfectly Centered Responsive Device Switcher */}
      <div className="toolbar-center-block">
        <div className="toolbar-device-segmented" role="radiogroup" aria-label="Device Viewport">
          <button
            type="button"
            role="radio"
            aria-checked={device === 'desktop'}
            onClick={() => onSetDevice('desktop')}
            className={`segmented-device-btn ${device === 'desktop' ? 'active' : ''}`}
            title="Desktop View (100% Canvas)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={device === 'mobile'}
            onClick={() => onSetDevice('mobile')}
            className={`segmented-device-btn ${device === 'mobile' ? 'active' : ''}`}
            title="Mobile View (390px Canvas)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* 3. Right Block: Grouped Design Tools, Preview, Export, Publish, Settings */}
      <div className="toolbar-right-block">
        {/* Design Tools Cluster: Colors & Sections */}
        <div className="toolbar-action-group">
          {/* Quick Color Palette Trigger */}
          <div className="toolbar-palette-wrap">
            <button
              type="button"
              onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
              className={`toolbar-btn-item ${paletteDropdownOpen ? 'active' : ''}`}
              title="Customize Theme Colors"
            >
              <Palette size={14} className="text-cyan" />
              <span>Colors</span>
              <div
                className="current-color-dot"
                style={{ backgroundColor: project.theme?.primaryColor || '#06b6d4' }}
              />
            </button>

            {paletteDropdownOpen && (
              <div className="toolbar-palette-menu glass-card">
                <div className="palette-menu-title font-sans">SELECT THEME PALETTE</div>
                <div className="palette-options-grid">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        if (onUpdateTheme) {
                          onUpdateTheme({
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            bgColor: preset.bg,
                          });
                        }
                        setPaletteDropdownOpen(false);
                      }}
                      className="palette-option-card"
                    >
                      <div className="palette-swatches">
                        <span style={{ backgroundColor: preset.primary }} />
                        <span style={{ backgroundColor: preset.secondary }} />
                        <span style={{ backgroundColor: preset.bg }} />
                      </div>
                      <span className="palette-name">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Structure Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`toolbar-btn-item ${showSidebar ? 'active' : ''}`}
            title="Toggle Sections & Structure Panel"
          >
            <Layers size={14} />
            <span>Sections</span>
          </button>
        </div>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* View & Export Cluster */}
        <div className="toolbar-action-group">
          {/* Clean Live Preview Toggle */}
          <button
            type="button"
            onClick={onTogglePreviewMode}
            className={`toolbar-btn-item ${previewMode ? 'active-preview' : ''}`}
            title="Toggle Clean Preview Mode"
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          {/* Export ZIP Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="toolbar-icon-btn"
            title="Download Clean Website (HTML/CSS/JS ZIP)"
            aria-label="Download Website ZIP"
          >
            <Download size={15} />
          </button>
        </div>

        {/* Primary Publish Action */}
        <button
          type="button"
          onClick={onOpenPublish}
          className="toolbar-publish-btn font-sans"
          title="Publish to Live Web"
        >
          <Globe size={14} />
          <span>Publish</span>
        </button>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* System & Profile Cluster */}
        <div className="toolbar-system-group">
          <button
            type="button"
            onClick={onOpenSettings}
            className="toolbar-icon-btn"
            title="Website Settings & SEO"
            aria-label="Settings"
          >
            <Settings size={15} />
          </button>

          <UserMenuDropdown onNavigate={(h) => (window.location.hash = h)} />
        </div>
      </div>
    </header>
  );
}
