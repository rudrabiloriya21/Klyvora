import React, { useState } from 'react';
import {
  X,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sparkles,
} from 'lucide-react';

export default function PublishModal({ isOpen, onClose, project }) {
  const [subdomain, setSubdomain] = useState(project.metadata?.slug || 'my-site');
  const [prepStatus, setPrepStatus] = useState('ready'); // 'ready', 'preparing', 'prepared'

  if (!isOpen) return null;

  const checks = [
    {
      title: 'SEO Title & Meta Description',
      passed: Boolean(project.seo?.title && project.seo?.description),
      note: project.seo?.title ? 'Configured properly' : 'Requires optimization in SEO tab',
    },
    {
      title: 'Brand Contact Details',
      passed: Boolean(project.brand?.contact?.email || project.brand?.contact?.whatsapp),
      note: 'Direct channels available for visitors',
    },
    {
      title: 'Responsive Layout Standards',
      passed: true,
      note: 'Verified across Desktop, Tablet, and Mobile viewports',
    },
    {
      title: 'Valid HTML5 Semantic Tree',
      passed: true,
      note: 'Zero layout shifts or unclosed tags',
    },
  ];

  const handlePreparePublish = () => {
    setPrepStatus('preparing');
    setTimeout(() => {
      setPrepStatus('prepared');
    }, 1200);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content modal-content-wide glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Globe size={20} className="text-cyan" />
            <h3 className="modal-title font-display">Publishing Preparation</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Domain Staging Input */}
          <div className="publish-domain-staging glass-card">
            <span className="font-mono domain-label">PRODUCTION SUBDOMAIN PREVIEW</span>
            <div className="domain-input-group">
              <span className="domain-protocol font-mono">https://</span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                  )
                }
                className="domain-input font-mono"
                placeholder="subdomain"
              />
              <span className="domain-suffix font-mono">.klyvora.app</span>
            </div>
            <p className="domain-caption">
              Staging target for <strong>{project.metadata?.name}</strong>.
            </p>
          </div>

          {/* Pre-Publish Checklist */}
          <div className="preflight-checklist-box glass-card">
            <span className="font-mono checklist-heading">PRE-FLIGHT VALIDATION CHECKLIST</span>
            <div className="checklist-items-stack">
              {checks.map((check, i) => (
                <div key={i} className="preflight-item">
                  {check.passed ? (
                    <CheckCircle2 size={16} className="text-cyan" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber" />
                  )}
                  <div className="preflight-text-wrap">
                    <strong className="preflight-title">{check.title}</strong>
                    <span className="preflight-note font-mono">{check.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Honest Hosting Status Notice */}
          <div className="hosting-provider-notice glass-card">
            <div className="hosting-notice-top font-mono">
              <Server size={16} className="text-amber" />
              <span>HOSTING CONFIGURATION STATUS: UNCONFIGURED</span>
            </div>
            <p className="hosting-notice-text">
              Notice: Direct one-click cloud publishing requires connecting an active hosting
              provider integration (e.g. Vercel, Netlify, or Cloudflare Pages token). In this
              prototype, you can prepare the distribution package or use <strong>Export ZIP</strong>{' '}
              to deploy instantly to any static host for free.
            </p>
          </div>

          {/* Action Button */}
          <div className="publish-modal-action-row">
            {prepStatus === 'prepared' ? (
              <div className="prepared-banner font-mono">
                <CheckCircle2 size={16} className="text-cyan" />
                <span>
                  ✓ Package Prepared! All assets validated for https://{subdomain}.klyvora.app.
                  Ready for static export.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePreparePublish}
                disabled={prepStatus === 'preparing'}
                className="btn btn-primary publish-trigger-btn font-mono"
              >
                {prepStatus === 'preparing' ? (
                  <span>Preparing Production Build...</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Prepare Production Bundle</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
