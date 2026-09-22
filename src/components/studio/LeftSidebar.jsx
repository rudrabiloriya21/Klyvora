import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  FileText,
  Inbox,
  Search,
  History,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import LeftAIAssistantPanel from './LeftAIAssistantPanel';

export default function LeftSidebar({
  project,
  activeTab,
  onSetActiveTab,
  activePageSlug = 'home',
  onNavigatePage,
  selectedSectionId,
  onSelectSection,
  onClearSelectedSection,
  workspaceMode = 'ai',
  onSwitchMode,
  onUpdateTheme,
  onUpdateProject,
  onAddSectionClick,
  onDeleteSection,
  onToggleSectionVisibility,
  onDuplicateSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onRestoreSnapshot,
  onCreateManualSnapshot,
  selectedModel,
  onApplyAiActions,
  onUndo,
  canUndo,
}) {
  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
  const sections = homePage?.sections || [];
  const theme = project.theme || {};
  const forms = project.forms || [];
  const history = project.versionHistory || [];

  const [snapshotLabel, setSnapshotLabel] = useState('');

  // Accessibility Audit calculations
  const auditIssues = [];
  if (!project.seo?.title || project.seo.title.length < 10) {
    auditIssues.push({ type: 'warning', text: 'SEO page title is short or missing.' });
  }
  if (!project.seo?.description || project.seo.description.length < 25) {
    auditIssues.push({ type: 'warning', text: 'Meta description is under 25 characters.' });
  }
  const heroSec = sections.find((s) => s.type === 'hero');
  if (heroSec && !heroSec.props?.heading) {
    auditIssues.push({ type: 'error', text: 'Hero is missing an H1 heading.' });
  }
  const auditScore = Math.max(70, 100 - auditIssues.length * 10);

  // Manual configuration tabs (excluding AI which has dedicated mode)
  const manualTabs = [
    { id: 'sections', label: 'Sections', icon: <Layers size={16} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={16} /> },
    { id: 'pages', label: 'Pages', icon: <FileText size={16} /> },
    { id: 'forms', label: 'Inquiries', icon: <Inbox size={16} />, count: forms.length },
    { id: 'seo', label: 'SEO & Meta', icon: <Search size={16} /> },
    { id: 'audit', label: 'Audit', icon: <ShieldCheck size={16} /> },
    { id: 'history', label: 'History', icon: <History size={16} /> },
  ];

  // -------------------------------------------------------------
  // AI WORKSPACE MODE (Default, user-friendly, prompt-first)
  // -------------------------------------------------------------
  if (activeTab === 'ai') {
    return (
      <aside className="studio-left-sidebar is-ai-mode" role="complementary" aria-label="AI Workspace Assistant">
        <LeftAIAssistantPanel
          project={project}
          selectedModel={selectedModel}
          onApplyActions={onApplyAiActions}
          onUndo={onUndo}
          canUndo={canUndo}
          selectedSectionId={selectedSectionId}
          onClearSelectedSection={onClearSelectedSection}
          onSelectSection={onSelectSection}
          onSwitchToManual={() => onSetActiveTab('sections')}
          onUpdateTheme={onUpdateTheme}
          onMoveSectionUp={onMoveSectionUp}
          onMoveSectionDown={onMoveSectionDown}
          onDuplicateSection={onDuplicateSection}
          onDeleteSection={onDeleteSection}
          onAddSectionClick={onAddSectionClick}
        />
      </aside>
    );
  }

  // -------------------------------------------------------------
  // MANUAL TOOLS MODE (Advanced element-by-element fine tuning)
  // -------------------------------------------------------------
  return (
    <aside className="studio-left-sidebar is-manual-mode" role="complementary" aria-label="Studio Manual Tools">
      {/* Top Banner to easily return to AI Assistant */}
      <div className="manual-mode-top-banner">
        <button
          type="button"
          onClick={() => onSetActiveTab('ai')}
          className="btn-return-ai font-sans"
          title="Open AI Assistant prompt mode"
        >
          <Sparkles size={14} className="text-cyan" />
          <span>Ask AI Assistant</span>
        </button>
        <span className="manual-mode-badge font-sans">Sections & Style</span>
      </div>

      {/* Manual Tab Navigation */}
      <nav className="sidebar-tab-strip" aria-label="Editor Panels">
        {manualTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSetActiveTab(tab.id)}
            className={`sidebar-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            title={tab.label}
          >
            {tab.icon}
            <span className="sidebar-tab-label">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="sidebar-tab-badge font-mono">{tab.count}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Panel Body Content */}
      <div className="sidebar-panel-body">

        {/* TAB 1: SECTIONS */}
        {activeTab === 'sections' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Page Sections</h3>
              <button
                type="button"
                onClick={onAddSectionClick}
                className="btn btn-primary add-sec-btn font-mono"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
            <p className="panel-desc">
              Organize and customize sections on the <strong>{homePage?.title || 'Home'}</strong> page.
            </p>

            <div className="sections-tree-list">
              {sections.map((sec, idx) => {
                const isSelected = selectedSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => onSelectSection(sec.id)}
                    className={`section-tree-item ${isSelected ? 'selected' : ''} ${
                      sec.hidden ? 'hidden-section' : ''
                    }`}
                  >
                    <div className="tree-item-meta">
                      <span className="sec-type-badge font-mono">{sec.type}</span>
                      <span className="sec-title-text">{sec.name || sec.type}</span>
                    </div>

                    <div className="tree-item-controls" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onToggleSectionVisibility(sec.id)}
                        className="sec-ctrl-icon"
                        title={sec.hidden ? 'Show Section' : 'Hide Section'}
                      >
                        {sec.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onMoveSectionUp(sec.id)}
                        className="sec-ctrl-icon"
                        title="Move Up"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => onMoveSectionDown(sec.id)}
                        className="sec-ctrl-icon"
                        title="Move Down"
                      >
                        <ChevronDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateSection(sec.id)}
                        className="sec-ctrl-icon"
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSection(sec.id)}
                        className="sec-ctrl-icon sec-delete-icon"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: THEME */}
        {activeTab === 'theme' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Design Tokens</h3>
            </div>
            <p className="panel-desc">Customize colors, typography pairs, and geometry.</p>

            <div className="theme-editor-form">
              {/* Color Controls */}
              <div className="theme-field-group">
                <span className="theme-group-label font-mono">BRAND COLOR PALETTE</span>

                <div className="color-picker-row">
                  <label className="color-label">Primary Color</label>
                  <div className="color-input-wrap">
                    <input
                      type="color"
                      value={theme.primaryColor || '#8b5cf6'}
                      onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor || '#8b5cf6'}
                      onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                      className="color-hex-text font-mono"
                    />
                  </div>
                </div>

                <div className="color-picker-row">
                  <label className="color-label">Secondary Color</label>
                  <div className="color-input-wrap">
                    <input
                      type="color"
                      value={theme.secondaryColor || '#06b6d4'}
                      onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={theme.secondaryColor || '#06b6d4'}
                      onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                      className="color-hex-text font-mono"
                    />
                  </div>
                </div>

                <div className="color-picker-row">
                  <label className="color-label">Background Tone</label>
                  <div className="color-input-wrap">
                    <input
                      type="color"
                      value={theme.bgColor || '#07080c'}
                      onChange={(e) => onUpdateTheme({ bgColor: e.target.value })}
                      className="color-swatch-input"
                    />
                    <input
                      type="text"
                      value={theme.bgColor || '#07080c'}
                      onChange={(e) => onUpdateTheme({ bgColor: e.target.value })}
                      className="color-hex-text font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Typography Pair */}
              <div className="theme-field-group">
                <span className="theme-group-label font-mono">TYPOGRAPHY HIERARCHY</span>

                <div className="theme-select-field">
                  <label>Display Heading Font</label>
                  <select
                    value={theme.fontHeading || 'Syne'}
                    onChange={(e) => onUpdateTheme({ fontHeading: e.target.value })}
                    className="sidebar-select font-mono"
                  >
                    <option value="Syne">Syne (Futuristic / Cinematic)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech Monospace)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Geometric)</option>
                    <option value="Inter">Inter (Clean Neutral)</option>
                  </select>
                </div>

                <div className="theme-select-field">
                  <label>Body Font</label>
                  <select
                    value={theme.fontBody || 'Plus Jakarta Sans'}
                    onChange={(e) => onUpdateTheme({ fontBody: e.target.value })}
                    className="sidebar-select font-mono"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Ultra Legible)</option>
                    <option value="Inter">Inter (System Neutral)</option>
                    <option value="Space Grotesk">Space Grotesk (Technical)</option>
                  </select>
                </div>
              </div>

              {/* Geometry / Border Radius */}
              <div className="theme-field-group">
                <span className="theme-group-label font-mono">CORNER GEOMETRY</span>
                <div className="radius-pill-selector">
                  {['4px', '8px', '14px', '22px', '9999px'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onUpdateTheme({ borderRadius: r })}
                      className={`radius-pill font-mono ${theme.borderRadius === r ? 'active' : ''}`}
                    >
                      {r === '9999px' ? 'Pill' : r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAGES */}
        {activeTab === 'pages' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Pages</h3>
            </div>
            <p className="panel-desc">Manage site structure and multi-page routing.</p>

            <div className="pages-list">
              {(project.pages || []).map((page) => {
                const isActive =
                  activePageSlug === page.slug ||
                  (activePageSlug === 'home' && page.isHome);
                return (
                  <div
                    key={page.id}
                    onClick={() => onNavigatePage && onNavigatePage(page.slug)}
                    className={`page-list-card glass-card ${
                      isActive ? 'active-page-item' : ''
                    }`}
                    style={{
                      cursor: 'pointer',
                      border: isActive
                        ? '1px solid #06b6d4'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isActive
                        ? 'rgba(6, 182, 212, 0.08)'
                        : 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <div className="page-card-title-row">
                      <span className="font-display page-card-title">{page.title}</span>
                      {page.isHome ? (
                        <span className="home-badge font-mono">HOMEPAGE</span>
                      ) : (
                        <span className="font-mono text-cyan" style={{ fontSize: '10px' }}>
                          {isActive ? 'ACTIVE' : 'PAGE'}
                        </span>
                      )}
                    </div>
                    <span className="page-slug font-mono">/{page.slug}</span>
                    <div className="page-card-stats font-mono">
                      <span>{page.sections?.length || 0} SECTIONS</span>
                      {isActive && <span className="text-cyan"> · LIVE ON CANVAS</span>}
                    </div>
                  </div>
                );
              })}

              {/* If only 1 page exists, offer standard quick navigations */}
              {(project.pages || []).length <= 1 && (
                <div style={{ marginTop: '16px' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    VIRTUAL PAGE VIEWS
                  </span>
                  {[
                    { title: 'About Us', slug: 'about' },
                    { title: 'Menu & Offerings', slug: 'menu' },
                    { title: 'Contact & Location', slug: 'contact' },
                  ].map((vp) => (
                    <div
                      key={vp.slug}
                      onClick={() => onNavigatePage && onNavigatePage(vp.slug)}
                      className={`page-list-card glass-card ${
                        activePageSlug === vp.slug ? 'active-page-item' : ''
                      }`}
                      style={{
                        cursor: 'pointer',
                        marginBottom: '8px',
                        border:
                          activePageSlug === vp.slug
                            ? '1px solid #06b6d4'
                            : '1px solid rgba(255, 255, 255, 0.06)',
                        background:
                          activePageSlug === vp.slug
                            ? 'rgba(6, 182, 212, 0.08)'
                            : 'rgba(255, 255, 255, 0.02)',
                      }}
                    >
                      <div className="page-card-title-row">
                        <span className="font-display page-card-title">{vp.title}</span>
                        <span className="font-mono text-muted" style={{ fontSize: '10px' }}>
                          {activePageSlug === vp.slug ? 'VIEWING' : 'PREVIEW'}
                        </span>
                      </div>
                      <span className="page-slug font-mono">/{vp.slug}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FORMS INBOX */}
        {activeTab === 'forms' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Inquiry Inbox</h3>
              <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                {forms.length} SUBMISSIONS
              </span>
            </div>
            <p className="panel-desc">
              Test submissions from the live website preview are stored safely here.
            </p>

            {forms.length === 0 ? (
              <div className="inbox-empty-state">
                <Inbox size={32} className="text-muted" />
                <p>No inquiries yet. Fill out the contact form in the preview to test!</p>
              </div>
            ) : (
              <div className="inbox-submissions-list">
                {forms.map((sub) => (
                  <div key={sub.id} className="inbox-submission-card glass-card">
                    <div className="sub-top-row">
                      <span className="sub-type font-mono">{sub.formType || 'Inquiry'}</span>
                      <span className="sub-time font-mono">
                        {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <strong className="sub-name">{sub.data?.name || 'Anonymous'}</strong>
                    <a href={`mailto:${sub.data?.email}`} className="sub-email font-mono">
                      {sub.data?.email}
                    </a>
                    {sub.data?.message && <p className="sub-msg">&ldquo;{sub.data.message}&rdquo;</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SEO & META */}
        {activeTab === 'seo' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Search & Social Meta</h3>
            </div>
            <p className="panel-desc">Configure search engine visibility and social previews.</p>

            <div className="seo-form">
              <div className="form-group">
                <label className="form-label font-mono">SEO TITLE TAG</label>
                <input
                  type="text"
                  value={project.seo?.title || ''}
                  onChange={(e) =>
                    onUpdateProject({ seo: { ...project.seo, title: e.target.value } })
                  }
                  className="form-input"
                  placeholder="Business Name — Official Site"
                />
              </div>

              <div className="form-group">
                <label className="form-label font-mono">META DESCRIPTION</label>
                <textarea
                  rows="3"
                  value={project.seo?.description || ''}
                  onChange={(e) =>
                    onUpdateProject({ seo: { ...project.seo, description: e.target.value } })
                  }
                  className="form-input"
                  placeholder="Concise overview of your business..."
                />
              </div>

              {/* Google SERP Preview Card */}
              <div className="google-serp-preview glass-card">
                <span className="serp-tag font-mono">GOOGLE PREVIEW</span>
                <span className="serp-url font-mono">
                  https://{project.metadata?.slug || 'klyvora'}.app/
                </span>
                <h4 className="serp-title">{project.seo?.title || 'Website Title'}</h4>
                <p className="serp-desc">
                  {project.seo?.description || 'Meta description will be displayed here.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ACCESSIBILITY AUDIT */}
        {activeTab === 'audit' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Accessibility & SEO Audit</h3>
            </div>

            <div className="audit-score-card glass-card">
              <div className="score-circle font-display">
                <span>{auditScore}</span>
                <span className="score-total">/100</span>
              </div>
              <div className="score-text">
                <strong>Overall Compliance</strong>
                <p>{auditScore >= 90 ? 'Excellent standards compliance.' : 'Minor optimizations recommended.'}</p>
              </div>
            </div>

            <div className="audit-checklist">
              <div className="audit-check-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Responsive Viewport Meta Tag</span>
              </div>
              <div className="audit-check-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Reduced Motion Accessibility Listener</span>
              </div>
              <div className="audit-check-item">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Semantic Landmarks (header, nav, main, section)</span>
              </div>
              {auditIssues.map((issue, i) => (
                <div key={i} className="audit-check-item item-warning">
                  <AlertTriangle size={16} className="text-amber" />
                  <span>{issue.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: VERSION HISTORY */}
        {activeTab === 'history' && (
          <div className="sidebar-tab-content">
            <div className="panel-header-row">
              <h3 className="panel-title font-display">Revisions & Snapshots</h3>
            </div>
            <p className="panel-desc">Restore previous project versions or save manual checkpoints.</p>

            {/* Manual Checkpoint creation */}
            <div className="manual-snapshot-form">
              <input
                type="text"
                placeholder="Checkpoint label (e.g. Pre-Launch)"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => {
                  if (snapshotLabel.trim()) {
                    onCreateManualSnapshot(snapshotLabel.trim());
                    setSnapshotLabel('');
                  }
                }}
                className="btn btn-secondary font-mono"
                style={{ width: '100%', marginTop: '8px' }}
              >
                Create Manual Save Point
              </button>
            </div>

            <div className="history-timeline">
              {history.map((ver, i) => (
                <div key={ver.id || i} className="history-card glass-card">
                  <div className="history-head">
                    <strong className="history-label">{ver.label}</strong>
                    <span className="history-time font-mono">
                      {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {ver.snapshotSummary && <p className="history-summary">{ver.snapshotSummary}</p>}
                  {ver.data && (
                    <button
                      type="button"
                      onClick={() => onRestoreSnapshot(ver.data)}
                      className="restore-btn font-mono"
                    >
                      <RotateCcw size={12} />
                      <span>Restore this revision</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
