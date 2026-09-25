import React, { useState, useRef } from 'react';
import {
  Plus,
  Upload,
  Search,
  Star,
  Clock,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Edit2,
  Download,
  RotateCcw,
  Layers,
  Sparkles,
  Zap,
  Wand2,
  AlertTriangle,
  X,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { storageService } from '../../services/storageService';
import { createProjectZipBundle } from '../../services/codeGenerator';
import { useAuth } from '../../context/useAuth';
import UserMenuDropdown from '../auth/UserMenuDropdown';
import { groqService } from '../../services/ai/groqService';

export default function DashboardView({
  onOpenProject,
  onCreateNewProject,
  onOpenMarketingPage,
}) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState(() => {
    return currentUser?.uid
      ? storageService.getUserProjects(currentUser.uid)
      : storageService.getAllProjects();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'favorites', 'drafts', 'published'
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('updated'); // 'updated', 'name', 'created'
  const [activeMenuProjectId, setActiveMenuProjectId] = useState(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);
  const [undoDeleteProject, setUndoDeleteProject] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const fileInputRef = useRef(null);

  const loadProjects = () => {
    const list = currentUser?.uid
      ? storageService.getUserProjects(currentUser.uid)
      : storageService.getAllProjects();
    setProjects(list);
  };

  // Filter & Search
  const filteredProjects = projects
    .filter((p) => {
      if (activeFilter === 'favorites') return p.metadata?.favorite;
      if (activeFilter === 'drafts') return p.metadata?.status === 'draft';
      if (activeFilter === 'published') return p.metadata?.status === 'published';
      return true;
    })
    .filter((p) => {
      if (activeCategory === 'all') return true;
      return p.metadata?.category === activeCategory;
    })
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.metadata?.name?.toLowerCase().includes(q) ||
        p.metadata?.category?.toLowerCase().includes(q) ||
        p.brand?.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'name') {
        return (a.metadata?.name || '').localeCompare(b.metadata?.name || '');
      }
      if (sortOrder === 'created') {
        return new Date(b.metadata?.createdAt || 0) - new Date(a.metadata?.createdAt || 0);
      }
      return new Date(b.metadata?.updatedAt || 0) - new Date(a.metadata?.updatedAt || 0);
    });

  // Action handlers
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    storageService.toggleFavorite(id);
    loadProjects();
  };

  const handleDuplicate = (id, e) => {
    e.stopPropagation();
    setActiveMenuProjectId(null);
    storageService.duplicateProject(id, currentUser?.uid);
    loadProjects();
  };

  const handleCloneStarter = () => {
    const seeds = storageService.getAllProjects();
    const starter = seeds[0];
    if (starter) {
      const cloned = storageService.duplicateProject(starter.id, currentUser?.uid);
      loadProjects();
      if (cloned) onOpenProject(cloned.id);
    }
  };

  const handleDelete = (project) => {
    setUndoDeleteProject(project);
    storageService.deleteProject(project.id);
    setDeleteConfirmProject(null);
    setActiveMenuProjectId(null);
    loadProjects();

    // Auto-clear undo option after 6 seconds
    setTimeout(() => {
      setUndoDeleteProject(null);
    }, 6000);
  };

  const handleRestoreDeleted = () => {
    if (undoDeleteProject) {
      storageService.saveProject(undoDeleteProject);
      setUndoDeleteProject(null);
      loadProjects();
    }
  };

  const handleGenerateFromPrompt = async (customPrompt) => {
    const text = (customPrompt || aiPrompt).trim();
    if (!text || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep('System Architect is architecting your website...');

    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Designing chromatic palette & typography hierarchy...');
    }, 800);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Architecting semantic page sections (Hero, Showcase, Pricing, FAQ)...');
    }, 1600);

    try {
      const created = await groqService.generateWebsiteFromPrompt(text, currentUser?.uid);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGenerationStep('Launching Klyvora Studio workspace...');
      loadProjects();

      setTimeout(() => {
        setIsGenerating(false);
        setAiPrompt('');
        onOpenProject(created.id);
      }, 500);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error('Generation error:', err);
      setIsGenerating(false);
      alert(`Could not generate website: ${err.message}`);
    }
  };

  const handleExportZip = async (project, e) => {
    e.stopPropagation();
    setActiveMenuProjectId(null);
    try {
      const blob = await createProjectZipBundle(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.metadata?.slug || 'klyvora'}-website.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate export bundle: ' + err.message);
    }
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = storageService.importProjectFromJson(event.target.result);
        loadProjects();
        onOpenProject(imported.id);
      } catch (err) {
        alert('Invalid project file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Stats calculation
  const totalCount = projects.length;
  const draftCount = projects.filter((p) => p.metadata?.status === 'draft').length;
  const publishedCount = projects.filter((p) => p.metadata?.status === 'published').length;

  const categories = Array.from(
    new Set(projects.map((p) => p.metadata?.category).filter(Boolean))
  );

  return (
    <div className="dashboard-root-layout">
      {/* Dashboard Top Navbar */}
      <header className="dashboard-navbar" role="banner">
        <div className="container dashboard-nav-inner">
          <div className="dash-nav-left">
            <BrandLogo size="default" isStudio={true} showParent={true} />
          </div>

          <div className="dash-nav-right">
            <button
              type="button"
              onClick={onOpenMarketingPage}
              className="btn btn-secondary font-mono"
            >
              <span>Explore Marketing Page</span>
              <ExternalLink size={14} />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary font-mono"
              title="Import Project JSON"
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onClick={onCreateNewProject}
              className="btn btn-primary font-mono"
            >
              <Plus size={16} />
              <span>New Project</span>
            </button>

            {/* Authenticated User Account Menu */}
            <UserMenuDropdown onNavigate={(h) => window.location.hash = h} />
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="container dashboard-main-content">
        {/* Undo Toast Notification if project was deleted */}
        {undoDeleteProject && (
          <div className="undo-delete-toast glass-card" role="status">
            <span>Project &ldquo;{undoDeleteProject.metadata?.name}&rdquo; was removed.</span>
            <button
              type="button"
              onClick={handleRestoreDeleted}
              className="undo-btn font-mono"
            >
              <RotateCcw size={13} />
              <span>Undo Deletion</span>
            </button>
          </div>
        )}

        {/* Instant AI Website Generator (AI Workspace Prompt) */}
        <section className="dashboard-ai-generator-card glass-card glass-card-elevated" aria-label="AI Website Generator">
          <div className="ai-gen-top-badge font-mono">
            <div className="ai-gen-pulse" aria-hidden="true" />
            <Sparkles size={13} className="text-cyan fill-cyan" />
            <span>🇮🇳 INDIA'S AI WEBSITE CREATOR</span>
          </div>

          <div className="ai-gen-header">
            <h2 className="ai-gen-title font-display">
              Describe your business. Watch AI build it instantly.
            </h2>
            <p className="ai-gen-subtitle">
              Enter your shop, coaching institute, clinic, or startup idea. Klyvora creates mobile-ready sections, ₹ pricing, and WhatsApp ordering in seconds.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateFromPrompt();
            }}
            className="ai-gen-form"
          >
            <div className="ai-gen-input-wrapper">
              <Sparkles size={20} className="ai-gen-icon text-cyan" aria-hidden="true" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. A traditional saree & lehenga boutique in Jaipur with festival discounts, WhatsApp order, and ₹ pricing"
                disabled={isGenerating}
                className="ai-gen-input"
              />
              <button
                type="submit"
                disabled={!aiPrompt.trim() || isGenerating}
                className="btn btn-primary ai-gen-submit-btn font-mono"
              >
                {isGenerating ? (
                  <>
                    <span className="thinking-spinner" aria-hidden="true" />
                    <span>Creating Website...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    <span>Generate Website</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Inspiration Pills */}
          <div className="ai-gen-pills-row font-mono">
            <span className="ai-gen-pills-label">TRY AN IDEA:</span>
            <div className="ai-gen-pills-scroll">
              {[
                { label: '🛍️ Saree & Ethnic Boutique (Jaipur)', prompt: 'A luxury ethnic saree and lehenga boutique in Jaipur with bridal collections, festive discount offers, customer reviews, ₹ pricing, and direct WhatsApp ordering' },
                { label: '📚 IIT-JEE & NEET Academy (Kota)', prompt: 'A premier IIT-JEE and NEET coaching institute in Kota with classroom batch schedules, scholarship tests, fee structure in ₹, and WhatsApp admission helpline' },
                { label: '☕ Artisan Chai & Mithai Cafe (Delhi)', prompt: 'An artisan chai and gourmet mithai cafe in Delhi with signature sweets, street snack menu, ₹ pricing, and WhatsApp orders' },
                { label: '🚀 B2B AI Tech Startup (Bengaluru)', prompt: 'A modern Indian B2B AI SaaS startup landing page with cloud features, transparent pricing tiers in ₹ (INR), client testimonials, and book demo CTA' },
                { label: '🏥 Dental & Wellness Clinic (Mumbai)', prompt: 'A modern multispeciality dental and wellness clinic in Mumbai with doctor profiles, treatment pricing in ₹, patient reviews, and WhatsApp appointment booking' },
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAiPrompt(pill.prompt);
                    handleGenerateFromPrompt(pill.prompt);
                  }}
                  disabled={isGenerating}
                  className="ai-gen-pill-btn"
                >
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Generation Progress Modal/Overlay */}
          {isGenerating && (
            <div className="ai-gen-progress-overlay glass-card">
              <div className="ai-gen-progress-box font-mono">
                <div className="ai-gen-spinner-ring">
                  <div className="ai-gen-spinner" />
                  <Sparkles size={24} className="ai-gen-sparkle-center text-cyan" />
                </div>
                <div className="ai-gen-progress-text">
                  <span className="ai-gen-progress-title font-display">Generating Website with Klyvora AI...</span>
                  <span className="ai-gen-progress-step">{generationStep}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Welcome Stats Banner */}
        <section className="dashboard-stats-banner glass-card glass-card-elevated" aria-label="Overview">
          <div className="stats-banner-text">
            <span className="stats-label font-mono">
              ✦ XEORVIA STUDIO OPERATING SYSTEM // V2.4
            </span>
            <h1 className="stats-title font-display">
              Creation Workspace & Projects Hub.
            </h1>
            <p className="stats-sub">
              Manage your AI-crafted digital experiences, customize themes, and export production
              code bundles.
            </p>
          </div>

          <div className="stats-metric-pills">
            <div className="stat-pill glass-card">
              <span className="stat-count font-display">{totalCount}</span>
              <span className="stat-name font-mono">TOTAL PROJECTS</span>
            </div>
            <div className="stat-pill glass-card">
              <span className="stat-count font-display gradient-text-cyan">{draftCount}</span>
              <span className="stat-name font-mono">ACTIVE DRAFTS</span>
            </div>
            <div className="stat-pill glass-card">
              <span className="stat-count font-display text-violet">{publishedCount}</span>
              <span className="stat-name font-mono">PREPARED</span>
            </div>
          </div>
        </section>

        {/* Filter & Search Tool Strip */}
        <div className="dashboard-controls-strip">
          {/* Filter Tabs */}
          <div className="dashboard-filter-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              className={`dash-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            >
              All Projects ({totalCount})
            </button>
            <button
              role="tab"
              aria-selected={activeFilter === 'favorites'}
              onClick={() => setActiveFilter('favorites')}
              className={`dash-filter-btn ${activeFilter === 'favorites' ? 'active' : ''}`}
            >
              Favorites
            </button>
            <button
              role="tab"
              aria-selected={activeFilter === 'drafts'}
              onClick={() => setActiveFilter('drafts')}
              className={`dash-filter-btn ${activeFilter === 'drafts' ? 'active' : ''}`}
            >
              Drafts
            </button>
          </div>

          {/* Search & Selectors */}
          <div className="dashboard-search-wrap">
            <div className="search-input-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name or category..."
                className="search-text-input"
              />
            </div>

            {/* Category Dropdown */}
            {categories.length > 0 && (
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="category-filter-select font-mono"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="category-filter-select font-mono"
            >
              <option value="updated">Recently Edited</option>
              <option value="name">Alphabetical</option>
              <option value="created">Creation Date</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="dashboard-empty-projects glass-card">
            <Layers size={40} className="text-muted" />
            <h3 className="empty-title font-display">No Projects Found</h3>
            <p className="empty-desc">
              {searchQuery
                ? `No projects matched the search query "${searchQuery}".`
                : 'No projects match this filter tab. Create your first digital experience now!'}
            </p>
            <div className="empty-actions-row" style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={onCreateNewProject}
                className="btn btn-primary font-mono"
              >
                <Plus size={16} />
                <span>Create New Website</span>
              </button>
              <button
                type="button"
                onClick={handleCloneStarter}
                className="btn btn-secondary font-mono"
                title="Clone Aura Bakery Starter Template"
              >
                <span>Clone Starter Template</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard-projects-grid">
            {filteredProjects.map((project) => {
              const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];
              const sectionCount = homePage?.sections?.length || 0;
              const menuOpen = activeMenuProjectId === project.id;

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProject(project.id)}
                  className="project-grid-card glass-card"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onOpenProject(project.id);
                  }}
                >
                  {/* Card Thumbnail Area with Visual Device Mini-Mockup */}
                  <div
                    className="project-card-thumbnail"
                    style={{
                      background: `linear-gradient(135deg, ${
                        project.theme?.bgColor || '#07080c'
                      } 0%, rgba(18, 22, 33, 0.9) 100%)`,
                      borderBottom: `2px solid ${project.theme?.primaryColor || '#8b5cf6'}`,
                    }}
                  >
                    <div className="mini-preview-content">
                      <span className="mini-brand-tag font-mono">
                        {project.brand?.businessName || project.metadata?.name}
                      </span>
                      <p className="mini-desc-snippet">
                        {project.brand?.description || 'Custom crafted experience'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(project.id, e)}
                      className={`project-star-btn ${
                        project.metadata?.favorite ? 'is-fav' : ''
                      }`}
                      title="Toggle Favorite"
                      aria-label="Toggle Favorite"
                    >
                      <Star size={16} fill={project.metadata?.favorite ? '#f59e0b' : 'none'} />
                    </button>
                  </div>

                  {/* Card Info Body */}
                  <div className="project-card-body">
                    <div className="project-card-header-row">
                      <span className="project-category-tag font-mono">
                        {project.metadata?.category || 'General'}
                      </span>
                      <span className="project-status-pill font-mono">
                        {project.metadata?.status || 'draft'}
                      </span>
                    </div>

                    <h3 className="project-card-title font-display">{project.metadata?.name}</h3>
                    <p className="project-card-caption">
                      {project.brand?.tagline || project.metadata?.description || 'Digital Experience'}
                    </p>

                    <div className="project-card-footer-row">
                      <span className="project-timestamp font-mono">
                        <Clock size={12} />
                        <span>
                          {new Date(project.metadata?.updatedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>· {sectionCount} SECTIONS</span>
                      </span>

                      <div className="card-actions-row">
                        {/* More Menu Trigger */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuProjectId(menuOpen ? null : project.id);
                          }}
                          className="card-more-btn"
                          aria-label="Project actions"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Context Menu Dropdown */}
                    {menuOpen && (
                      <div
                        className="project-card-dropdown-menu glass-card font-mono"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenProject(project.id)}
                          className="dropdown-menu-item"
                        >
                          <Edit2 size={13} />
                          <span>Open Workspace</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(project.id, e)}
                          className="dropdown-menu-item"
                        >
                          <Copy size={13} />
                          <span>Duplicate</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleExportZip(project, e)}
                          className="dropdown-menu-item"
                        >
                          <Download size={13} />
                          <span>Download ZIP</span>
                        </button>
                        <div className="menu-divider" />
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmProject(project)}
                          className="dropdown-menu-item item-delete"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmProject && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setDeleteConfirmProject(null)}
        >
          <div
            className="modal-content glass-card glass-card-elevated delete-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <AlertTriangle size={20} className="text-rose" />
                <h3 className="modal-title font-display">Delete Project?</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="delete-modal-text">
                Are you sure you want to delete{' '}
                <strong className="text-white">&ldquo;{deleteConfirmProject.metadata?.name}&rdquo;</strong>? You can
                immediately undo this action using the restore toast if clicked by mistake.
              </p>
            </div>

            <div className="modal-footer delete-modal-footer font-mono">
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmProject)}
                className="btn btn-primary btn-confirm-delete text-xs"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
