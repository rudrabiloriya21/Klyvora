import React, { useState, useEffect, useCallback } from 'react';
import TopToolbar from './TopToolbar';
import LeftSidebar from './LeftSidebar';
import CenterCanvas from './CenterCanvas';
import RightInspector from './RightInspector';
import AIAssistantDrawer from './AIAssistantDrawer';
import FloatingAICopilot from './FloatingAICopilot';
import SectionLibraryModal from './SectionLibraryModal';
import CodeViewerModal from './CodeViewerModal';
import ExportModal from './ExportModal';
import PublishModal from './PublishModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import { storageService } from '../../services/storageService';
import { getModelById } from '../../services/ai/modelRegistry';
import { executeActions } from '../../services/ai/actionExecutor';

export default function WorkspaceLayout({
  projectId,
  initialPageSlug = 'home',
  onBackToDashboard,
}) {
  const [project, setProject] = useState(() => storageService.getProject(projectId));
  const [historyStack, setHistoryStack] = useState(() => {
    const loaded = storageService.getProject(projectId);
    return loaded ? [JSON.parse(JSON.stringify(loaded))] : [];
  });
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sub-page navigation within project
  const [activePageSlug, setActivePageSlug] = useState(initialPageSlug || 'home');

  // Sync activePageSlug with browser back/forward buttons and hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#/workspace/')) {
        const rawPath = hash.replace('#/workspace/', '').split('?')[0];
        const parts = rawPath.split('/').filter(Boolean);
        const slug = parts[1] || 'home';
        setActivePageSlug(slug);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const handleNavigatePage = useCallback((slug) => {
    const targetSlug = slug === 'home' || !slug ? 'home' : slug;
    setActivePageSlug(targetSlug);
    const newHash = targetSlug === 'home'
      ? `#/workspace/${projectId}`
      : `#/workspace/${projectId}/${targetSlug}`;
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  }, [projectId]);

  // Editor UI State
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [selectedModel, setSelectedModel] = useState(getModelById('system-architect-1.2-neo'));
  const [selectedSectionId, setSelectedSectionId] = useState(null); // Clean view on load
  const [showSidebar, setShowSidebar] = useState(false); // Clean full-width canvas by default
  const [leftTab, setLeftTab] = useState('sections'); // Friendly sections view when sidebar opened
  const [showInspector, setShowInspector] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Modals
  const [sectionLibraryOpen, setSectionLibraryOpen] = useState(false);
  const [codeViewerOpen, setCodeViewerOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Fallback if project does not exist
  useEffect(() => {
    if (!project) {
      onBackToDashboard();
    }
  }, [project, onBackToDashboard]);

  // Update project state with Undo/Redo stack preservation
  const commitProjectState = useCallback((newProject, _label = '') => {
    setProject(newProject);
    setSaveStatus('Saving...');

    // Persist to storage
    try {
      storageService.saveProject(newProject);
      setTimeout(() => setSaveStatus('Saved'), 400);
    } catch (err) {
      console.error('Failed to auto-save project', err);
      setSaveStatus('Error saving');
    }

    // Push to undo stack
    setHistoryStack((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, JSON.parse(JSON.stringify(newProject))];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevProject = historyStack[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      setProject(prevProject);
      storageService.saveProject(prevProject);
    }
  }, [historyIndex, historyStack]);

  const handleRedo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      const nextProject = historyStack[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      setProject(nextProject);
      storageService.saveProject(nextProject);
    }
  }, [historyIndex, historyStack]);

  // Keyboard shortcut listener for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  if (!project) {
    return (
      <div className="workspace-loading-state font-mono">
        <span className="thinking-spinner" />
        <span>INITIALIZING KLYVORA WORKSPACE...</span>
      </div>
    );
  }

  const homePage = project.pages?.find((p) => p.isHome) || project.pages?.[0];

  // Section Operations
  const handleMoveSectionUp = (secId) => {
    if (!homePage) return;
    const sections = [...homePage.sections];
    const idx = sections.findIndex((s) => s.id === secId);
    if (idx > 0) {
      const temp = sections[idx];
      sections[idx] = sections[idx - 1];
      sections[idx - 1] = temp;
      const updated = {
        ...project,
        pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
      };
      commitProjectState(updated, 'Moved Section Up');
    }
  };

  const handleMoveSectionDown = (secId) => {
    if (!homePage) return;
    const sections = [...homePage.sections];
    const idx = sections.findIndex((s) => s.id === secId);
    if (idx >= 0 && idx < sections.length - 1) {
      const temp = sections[idx];
      sections[idx] = sections[idx + 1];
      sections[idx + 1] = temp;
      const updated = {
        ...project,
        pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
      };
      commitProjectState(updated, 'Moved Section Down');
    }
  };

  const handleDuplicateSection = (secId) => {
    if (!homePage) return;
    const sections = [...homePage.sections];
    const idx = sections.findIndex((s) => s.id === secId);
    if (idx >= 0) {
      const clone = JSON.parse(JSON.stringify(sections[idx]));
      clone.id = `sec_${clone.type}_${Date.now()}`;
      clone.name = `${clone.name || clone.type} (Copy)`;
      sections.splice(idx + 1, 0, clone);
      const updated = {
        ...project,
        pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
      };
      commitProjectState(updated, 'Duplicated Section');
      setSelectedSectionId(clone.id);
    }
  };

  const handleDeleteSection = (secId) => {
    if (!homePage) return;
    const sections = homePage.sections.filter((s) => s.id !== secId);
    const updated = {
      ...project,
      pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
    };
    commitProjectState(updated, 'Deleted Section');
    if (selectedSectionId === secId) {
      setSelectedSectionId(sections[0]?.id || null);
    }
  };

  const handleToggleSectionVisibility = (secId) => {
    if (!homePage) return;
    const sections = homePage.sections.map((s) =>
      s.id === secId ? { ...s, hidden: !s.hidden } : s
    );
    const updated = {
      ...project,
      pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
    };
    commitProjectState(updated, 'Toggled Section Visibility');
  };

  const handleAddSection = (newSection) => {
    if (!homePage) return;
    const sections = [...homePage.sections];
    // Insert before footer or at bottom
    const footerIdx = sections.findIndex((s) => s.type === 'footer');
    if (footerIdx >= 0) {
      sections.splice(footerIdx, 0, newSection);
    } else {
      sections.push(newSection);
    }
    const updated = {
      ...project,
      pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
    };
    commitProjectState(updated, `Added ${newSection.name} Section`);
    setSelectedSectionId(newSection.id);
  };

  const handleUpdateSectionProps = (secId, partialProps) => {
    if (!homePage) return;
    const sections = homePage.sections.map((s) =>
      s.id === secId ? { ...s, props: { ...s.props, ...partialProps } } : s
    );
    const updated = {
      ...project,
      pages: project.pages.map((p) => (p.id === homePage.id ? { ...p, sections } : p)),
    };
    commitProjectState(updated, 'Updated Section Content');
  };

  // Theme & Project updates
  const handleUpdateTheme = (partialTheme) => {
    const updated = {
      ...project,
      theme: { ...project.theme, ...partialTheme },
    };
    commitProjectState(updated, 'Updated Design Tokens');
  };

  const handleUpdateProjectName = (name) => {
    const updated = {
      ...project,
      metadata: { ...project.metadata, name },
      brand: { ...project.brand, businessName: name },
    };
    commitProjectState(updated, 'Renamed Project');
  };

  // AI Actions execution
  const handleApplyAiActions = (actions) => {
    const { updatedProject, changeSummaries } = executeActions(project, actions);
    commitProjectState(updatedProject, 'Applied AI Architectural Mutations');
    storageService.addVersionSnapshot(
      project.id,
      'AI Assistance Update',
      changeSummaries.join(', ')
    );
  };

  return (
    <div className="studio-workspace-container">
      {/* 1. Top Toolbar */}
      <TopToolbar
        project={project}
        onUpdateProjectName={handleUpdateProjectName}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyStack.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        device={device}
        onSetDevice={setDevice}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onUpdateTheme={handleUpdateTheme}
        previewMode={previewMode}
        onTogglePreviewMode={() => setPreviewMode(!previewMode)}
        onOpenExport={() => setExportModalOpen(true)}
        onOpenPublish={() => setPublishModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onBackToDashboard={onBackToDashboard}
        saveStatus={saveStatus}
      />

      {/* 2. Workspace Body Grid */}
      <div
        className={`studio-workspace-body ${
          showSidebar && !previewMode ? 'has-sidebar' : 'canvas-full-width'
        }`}
      >
        {/* Left Sidebar (Only visible when user toggles Sections/Structure) */}
        {!previewMode && showSidebar && (
          <LeftSidebar
            project={project}
            activeTab={leftTab}
            onSetActiveTab={setLeftTab}
            activePageSlug={activePageSlug}
            onNavigatePage={handleNavigatePage}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onClearSelectedSection={() => setSelectedSectionId(null)}
            workspaceMode="manual"
            onSwitchMode={(mode) => setLeftTab(mode === 'ai' ? 'ai' : 'sections')}
            onUpdateTheme={handleUpdateTheme}
            onUpdateProject={(p) => commitProjectState({ ...project, ...p })}
            onAddSectionClick={() => setSectionLibraryOpen(true)}
            onDeleteSection={handleDeleteSection}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onDuplicateSection={handleDuplicateSection}
            onMoveSectionUp={handleMoveSectionUp}
            onMoveSectionDown={handleMoveSectionDown}
            onRestoreSnapshot={(data) => commitProjectState(data, 'Restored Revision')}
            onCreateManualSnapshot={(label) =>
              storageService.addVersionSnapshot(project.id, label, 'Manual checkpoint')
            }
            selectedModel={selectedModel}
            onApplyAiActions={handleApplyAiActions}
            onUndo={handleUndo}
            canUndo={historyIndex > 0}
          />
        )}

        {/* Center Canvas Area with Full Focus on the Live Website */}
        <div className="canvas-wrapper-relative">
          <CenterCanvas
            project={project}
            device={device}
            workspaceMode={leftTab === 'ai' ? 'ai' : 'manual'}
            activePageSlug={activePageSlug}
            onNavigatePage={handleNavigatePage}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onMoveSectionUp={handleMoveSectionUp}
            onMoveSectionDown={handleMoveSectionDown}
            onDuplicateSection={handleDuplicateSection}
            onDeleteSection={handleDeleteSection}
            onAddSectionClick={() => setSectionLibraryOpen(true)}
            previewMode={previewMode}
          />

          {/* Floating AI Copilot Bar docked over Canvas */}
          <FloatingAICopilot
            project={project}
            selectedSectionId={selectedSectionId}
            onClearSelectedSection={() => setSelectedSectionId(null)}
            onApplyActions={handleApplyAiActions}
            previewMode={previewMode}
          />
        </div>

        {/* Right Inspector (Hidden in Pure Preview and by default) */}
        {!previewMode && showInspector && (
          <RightInspector
            project={project}
            selectedSectionId={selectedSectionId}
            onClose={() => setShowInspector(false)}
            onUpdateSectionProps={handleUpdateSectionProps}
            onApplyAiPrompt={(_prompt) => {
              setLeftTab('ai');
            }}
          />
        )}
      </div>

      {/* AI Assistant Sliding Drawer */}
      <AIAssistantDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        project={project}
        selectedModel={selectedModel}
        onApplyActions={handleApplyAiActions}
      />

      {/* Auxiliary Modals */}
      <SectionLibraryModal
        isOpen={sectionLibraryOpen}
        onClose={() => setSectionLibraryOpen(false)}
        onAddSection={handleAddSection}
      />

      <CodeViewerModal
        isOpen={codeViewerOpen}
        onClose={() => setCodeViewerOpen(false)}
        project={project}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        project={project}
      />

      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        project={project}
      />

      <ProjectSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        project={project}
        onUpdateProject={(p) => commitProjectState({ ...project, ...p })}
        onDeleteProject={(id) => {
          storageService.deleteProject(id);
          onBackToDashboard();
        }}
      />
    </div>
  );
}
