import React, { useState } from 'react';
import LiveWebsiteRenderer from './LiveWebsiteRenderer';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function CenterCanvas({
  project,
  device,
  workspaceMode = 'ai',
  activePageSlug = 'home',
  onNavigatePage,
  selectedSectionId,
  onSelectSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onDeleteSection,
  onAddSectionClick,
  previewMode,
}) {
  const [zoom, setZoom] = useState(100);

  const getDeviceStyle = () => {
    switch (device) {
      case 'mobile':
        return {
          width: '390px',
          minHeight: '844px',
          borderRadius: '36px',
          border: '10px solid #1a1d26',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1)',
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
          borderRadius: '24px',
          border: '12px solid #1a1d26',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1)',
        };
      default: // desktop
        return {
          width: '100%',
          maxWidth: '1280px',
          minHeight: '100%',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8)',
        };
    }
  };

  return (
    <div
      className={`studio-center-canvas-area ${
        previewMode ? 'is-pure-preview' : ''
      }`}
    >
      {/* Canvas Floating Zoom & Info Bar */}
      {!previewMode && (
        <div className="canvas-viewport-bar font-mono">
          <span className="canvas-dimension-label">
            {device === 'desktop' && 'DESKTOP · 1280 × FLUID'}
            {device === 'tablet' && 'TABLET · 768 × 1024'}
            {device === 'mobile' && 'MOBILE · 390 × 844'}
          </span>

          <div className="canvas-zoom-controls">
            <button
              type="button"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="zoom-btn"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="zoom-value">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(125, zoom + 10))}
              className="zoom-btn"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="zoom-btn"
              title="Reset Zoom"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Viewport Frame Container with Dedicated Clean Scroll */}
      <div className="canvas-scroll-container">
        <div
          className="canvas-zoom-wrapper"
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div className="canvas-device-frame" style={getDeviceStyle()}>
            {/* Simulated Mobile Notch / Speaker Bar */}
            {device === 'mobile' && (
              <div className="simulated-device-header">
                <div className="device-speaker-notch" />
              </div>
            )}

            {/* Live Website Component */}
          <LiveWebsiteRenderer
            project={project}
            activePageSlug={activePageSlug}
            onNavigatePage={onNavigatePage}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
            onMoveSectionUp={onMoveSectionUp}
            onMoveSectionDown={onMoveSectionDown}
            onDuplicateSection={onDuplicateSection}
            onDeleteSection={onDeleteSection}
            onAddSectionClick={onAddSectionClick}
            isInteractiveMode={previewMode}
            workspaceMode={workspaceMode}
          />
        </div>
      </div>
    </div>
  </div>
);
}
