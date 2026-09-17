import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileText } from 'lucide-react';
import {
  generateProjectHtml,
  generateProjectCss,
  generateProjectJs,
} from '../../services/codeGenerator';

export default function CodeViewerModal({ isOpen, onClose, project }) {
  const [activeFile, setActiveFile] = useState('index.html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files = {
    'index.html': generateProjectHtml(project),
    'styles.css': generateProjectCss(project),
    'app.js': generateProjectJs(),
    'klyvora-project.json': JSON.stringify(project, null, 2),
  };

  const currentCode = files[activeFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content modal-content-wide code-modal-content glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Code2 size={20} className="text-cyan" />
            <h3 className="modal-title font-display">Generated Code Viewer</h3>
          </div>
          <div className="code-modal-actions">
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-secondary code-copy-btn font-mono"
            >
              {copied ? <Check size={14} className="text-cyan" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy File'}</span>
            </button>
            <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="code-modal-layout">
          {/* File Tree Sidebar */}
          <div className="code-file-tree font-mono">
            <span className="file-tree-title">STANDALONE ASSETS</span>
            {Object.keys(files).map((filename) => (
              <button
                key={filename}
                type="button"
                onClick={() => setActiveFile(filename)}
                className={`file-tree-item ${activeFile === filename ? 'active' : ''}`}
              >
                <FileText size={14} />
                <span>{filename}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Viewport */}
          <div className="code-editor-viewport">
            <pre className="code-pre font-mono">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
