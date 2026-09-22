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
      {/* 1. Left Block: Back, Logo, Project Title & Saved Status */}
      <div className="toolbar-left-block">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="toolbar-back-btn"
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft size={16} />
          <span className="back-btn-text font-sans">Dashboard</span>
        </button>

        <div className="toolbar-divider" aria-hidden="true" />

        <BrandLogo size="small" isStudio={true} showParent={false} />

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

        <span className="toolbar-save-badge font-sans">
          <span className="save-dot-live" />
          <span>{saveStatus === 'Saving...' ? 'Saving...' : 'All changes saved'}</span>
        </span>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Undo / Redo */}
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

      {/* 2. Center Block: Responsive Device Switcher */}
      <div className="toolbar-center-block">
        <div className="toolbar-device-segmented" role="radiogroup" aria-label="Device Viewport">
          <button
            type="button"
            role="radio"
            aria-checked={device === 'desktop'}
            onClick={() => onSetDevice('desktop')}
            className={`segmented-device-btn ${device === 'desktop' ? 'active' : ''}`}
            title="Desktop View"
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
            title="Mobile View"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* 3. Right Block: Color Palette, Sidebar Toggle, Preview, Export, Publish, Settings */}
      <div className="toolbar-right-block">
        {/* Quick Color Palette Trigger */}
        <div className="toolbar-palette-wrap">
          <button
            type="button"
            onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
            className="toolbar-palette-btn font-sans"
            title="Quick Theme Colors"
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

        {/* Sidebar Structure Toggle (Sections & Pages) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`toolbar-action-pill font-sans ${showSidebar ? 'btn-pill-active' : ''}`}
          title="Toggle Sections & Page Layout"
        >
          <Layers size={14} />
          <span>{showSidebar ? 'Hide Structure' : 'Sections'}</span>
        </button>

        {/* Live Preview Toggle */}
        <button
          type="button"
          onClick={onTogglePreviewMode}
          className={`btn btn-secondary toolbar-action-pill font-sans ${
            previewMode ? 'btn-preview-active' : ''
          }`}
          title="Toggle Clean Preview"
        >
          {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Export Modal Button */}
        <button
          type="button"
          onClick={onOpenExport}
          className="toolbar-icon-btn"
          title="Download Website (ZIP)"
          aria-label="Download Website"
        >
          <Download size={15} />
        </button>

        {/* Primary Publish Button */}
        <button
          type="button"
          onClick={onOpenPublish}
          className="btn btn-primary toolbar-publish-btn font-sans"
        >
          <Globe size={14} />
          <span>Publish</span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="toolbar-icon-btn"
          title="Website Settings"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>

        {/* User Account Menu */}
        <UserMenuDropdown onNavigate={(h) => (window.location.hash = h)} />
      </div>
    </header>
  );
}
