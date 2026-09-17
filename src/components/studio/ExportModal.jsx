import React, { useState } from 'react';
import { X, Download, FileJson, Check, Package } from 'lucide-react';
import { createProjectZipBundle } from '../../services/codeGenerator';

export default function ExportModal({ isOpen, onClose, project }) {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const blob = await createProjectZipBundle(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.metadata?.slug || 'klyvora-project'}-website.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 3000);
    } catch (err) {
      console.error('ZIP generation failed', err);
      alert('Failed to generate ZIP archive: ' + err.message);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleDownloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${project.metadata?.slug || 'klyvora-project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Download size={20} className="text-cyan" />
            <h3 className="modal-title font-display">Export Website Package</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-lead-text">
            Export <strong>{project.metadata?.name}</strong> as a production-ready package. All
            assets, CSS design tokens, and interactions are 100% self-contained without runtime
            dependencies.
          </p>

          <div className="export-options-grid">
            {/* ZIP Bundle */}
            <div className="export-card glass-card">
              <div className="export-card-top">
                <Package size={24} className="text-cyan" />
                <span className="export-card-badge font-mono">RECOMMENDED</span>
              </div>
              <h4 className="export-card-title font-display">Production Website ZIP</h4>
              <p className="export-card-desc">
                Includes standalone <code>index.html</code>, <code>styles.css</code>,{' '}
                <code>app.js</code>, and deployment guide. Ready for any hosting platform.
              </p>
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isExportingZip}
                className="btn btn-primary export-action-btn font-mono"
              >
                {isExportingZip ? (
                  <span>Generating ZIP Bundle...</span>
                ) : zipDownloaded ? (
                  <>
                    <Check size={16} />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Standalone ZIP</span>
                  </>
                )}
              </button>
            </div>

            {/* JSON Schema */}
            <div className="export-card glass-card">
              <div className="export-card-top">
                <FileJson size={24} className="text-violet" />
                <span className="export-card-badge font-mono">PROJECT SCHEMA</span>
              </div>
              <h4 className="export-card-title font-display">Klyvora JSON Backup</h4>
              <p className="export-card-desc">
                Raw structured project data including brand parameters, theme tokens, and section
                props. Can be re-imported into any Klyvora Studio instance.
              </p>
              <button
                type="button"
                onClick={handleDownloadJson}
                className="btn btn-secondary export-action-btn font-mono"
              >
                <Download size={16} />
                <span>Export Project JSON</span>
              </button>
            </div>
          </div>

          <div className="deployment-quick-guide glass-card">
            <span className="guide-tag font-mono">DEPLOYMENT COMPATIBILITY</span>
            <p className="guide-text">
              Unzip and drag-and-drop into <strong>Netlify Drop</strong>, <strong>Vercel CLI</strong>,{' '}
              <strong>GitHub Pages</strong>, or any standard web server. Works out of the box with
              zero configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
