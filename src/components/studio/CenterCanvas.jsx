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
          borderRadius: '40px',
          border: '10px solid #141720',
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
          borderRadius: '28px',
          border: '12px solid #141720',
          boxShadow: '0 25px 60px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        };
      default: // desktop
        return {
          width: '100%',
          maxWidth: '1280px',
          minHeight: '100%',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 60px -10px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          position: 'relative',
        };
    }
  };

  return (
    <div
      className={`studio-center-canvas-area ${
        previewMode ? 'is-pure-preview' : ''
      }`}
    >
      {/* Viewport Floating Zoom Controls (Minimal & Non-Intrusive) */}
      {!previewMode && (
        <div className="canvas-zoom-pill font-sans">
          <button
            type="button"
            onClick={() => setZoom(Math.max(60, zoom - 10))}
            className="zoom-mini-btn"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <span className="zoom-value-text">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(120, zoom + 10))}
            className="zoom-mini-btn"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          {zoom !== 100 && (
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="zoom-mini-btn reset"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={12} />
            </button>
          )}
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
            {/* Simulated Mobile Notch */}
            {device === 'mobile' && (
              <div className="simulated-device-header">
                <div className="device-speaker-notch" />
              </div>
            )}

            {/* Live Website Component */}
            <LiveWebsiteRenderer
              project={project}
              device={device}
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
