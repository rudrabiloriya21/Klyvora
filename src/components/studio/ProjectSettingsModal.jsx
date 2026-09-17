import React, { useState } from 'react';
import { X, Settings, Shield, Cpu, Trash2, Check, AlertTriangle } from 'lucide-react';
import { storageService } from '../../services/storageService';

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  onUpdateProject,
  onDeleteProject,
}) {
  const currentSettings = storageService.getSettings();
  const [providerSettings, setProviderSettings] = useState({
    provider: currentSettings.provider || 'local-simulator',
    apiUrl: currentSettings.apiUrl || '',
    apiKey: currentSettings.apiKey || '',
    modelId: currentSettings.modelId || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    storageService.saveSettings(providerSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Settings size={20} className="text-cyan" />
            <h3 className="modal-title font-display">Project & AI Provider Settings</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* AI Provider Config */}
          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="settings-section-head font-mono">
              <Cpu size={15} className="text-cyan" />
              <span>AI BACKEND PROVIDER CREDENTIALS</span>
            </div>

            <div className="form-group">
              <label className="form-label font-mono">ACTIVE PROVIDER</label>
              <select
                value={providerSettings.provider}
                onChange={(e) =>
                  setProviderSettings({ ...providerSettings, provider: e.target.value })
                }
                className="form-input form-select"
              >
                <option value="local-simulator">
                  Local Intelligent Simulator (Default / No Credentials Required)
                </option>
                <option value="llama">Llama 3.3 (Self-hosted or Together API)</option>
                <option value="gpt-oss-120b">System Architect 1.2 Neo (GPT-OSS 120B Inference)</option>
              </select>
            </div>

            {providerSettings.provider !== 'local-simulator' && (
              <>
                <div className="form-group">
                  <label className="form-label font-mono">API BASE URL</label>
                  <input
                    type="text"
                    value={providerSettings.apiUrl}
                    onChange={(e) =>
                      setProviderSettings({ ...providerSettings, apiUrl: e.target.value })
                    }
                    placeholder="https://api.together.xyz/v1 or http://localhost:11434/v1"
                    className="form-input font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label font-mono">API KEY / TOKEN</label>
                  <input
                    type="password"
                    value={providerSettings.apiKey}
                    onChange={(e) =>
                      setProviderSettings({ ...providerSettings, apiKey: e.target.value })
                    }
                    placeholder="sk-..."
                    className="form-input font-mono"
                  />
                  <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                    Keys are stored strictly in your local browser session and never sent to
                    external servers.
                  </span>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary font-mono" style={{ alignSelf: 'flex-start' }}>
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <span>Save Provider Settings</span>
              )}
            </button>
          </form>

          {/* Project Details */}
          <div className="settings-project-meta-box glass-card" style={{ marginTop: '28px' }}>
            <div className="settings-section-head font-mono">
              <Shield size={15} className="text-violet" />
              <span>PROJECT METADATA</span>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label font-mono">PROJECT NAME</label>
              <input
                type="text"
                value={project.metadata?.name || ''}
                onChange={(e) =>
                  onUpdateProject({
                    metadata: { ...project.metadata, name: e.target.value },
                    brand: { ...project.brand, businessName: e.target.value },
                  })
                }
                className="form-input"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="danger-zone-box glass-card" style={{ marginTop: '24px' }}>
            <div className="danger-head font-mono">
              <AlertTriangle size={15} className="text-amber" />
              <span>DANGER ZONE</span>
            </div>
            <p className="danger-text">
              Permanently delete this project and all its captured inquiries. This action cannot be
              undone.
            </p>

            {showDeleteConfirm ? (
              <div className="delete-confirm-bar">
                <span className="confirm-prompt font-mono">Are you absolutely sure?</span>
                <div className="confirm-btn-row">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteProject(project.id);
                      onClose();
                    }}
                    className="btn btn-primary btn-confirm-delete font-mono"
                  >
                    Yes, Delete Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-secondary font-mono"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-secondary btn-danger-trigger font-mono"
              >
                <Trash2 size={14} />
                <span>Delete This Project</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
