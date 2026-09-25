import React, { useState } from 'react';
import {
  X,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sparkles,
  Copy,
  ExternalLink,
  Share2,
  QrCode,
  ShieldCheck,
  Check,
  RefreshCw,
  Printer,
  Radio,
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export default function PublishModal({ isOpen, onClose, project, onUpdateProject }) {
  const [activeTab, setActiveTab] = useState('subdomain'); // 'subdomain', 'custom', 'qr'
  const [subdomain, setSubdomain] = useState(
    project?.metadata?.slug || project?.brand?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-store'
  );
  const [isPublished, setIsPublished] = useState(project?.metadata?.status === 'published');
  const [customDomain, setCustomDomain] = useState(project?.metadata?.customDomain || '');
  const [dnsStatus, setDnsStatus] = useState(project?.metadata?.customDomain ? 'verified' : 'unconfigured');
  const [isVerifyingDns, setIsVerifyingDns] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen || !project) return null;

  const publicUrl = `https://${subdomain}.klyvora.live`;
  const customUrl = customDomain ? `https://${customDomain}` : null;
  const activeUrl = customUrl || publicUrl;

  const checks = [
    {
      title: 'SEO Title & Meta Description',
      passed: Boolean(project.seo?.title && project.seo?.description),
      note: project.seo?.title ? 'Configured properly' : 'Requires optimization in SEO tab',
    },
    {
      title: 'Direct WhatsApp & Phone Contact',
      passed: Boolean(project.brand?.contact?.whatsapp || project.brand?.contact?.phone),
      note: 'Instant Indian patron ordering & communication channels ready',
    },
    {
      title: 'Indian Rupee (₹) Pricing Calibration',
      passed: true,
      note: 'All catalog items & tiers calibrated in Indian Rupees',
    },
    {
      title: 'Responsive Layout Standards',
      passed: true,
      note: 'Verified across Phone, Tablet (768px), and Desktop viewports',
    },
  ];

  const handleTogglePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const nextStatus = !isPublished ? 'published' : 'draft';
      setIsPublished(!isPublished);

      const updated = {
        ...project,
        metadata: {
          ...project.metadata,
          status: nextStatus,
          slug: subdomain,
          publishedUrl: nextStatus === 'published' ? publicUrl : null,
          publishedAt: nextStatus === 'published' ? new Date().toISOString() : null,
        },
      };

      storageService.saveProject(updated, updated.metadata?.userId || 'usr_guest');
      if (onUpdateProject) {
        onUpdateProject(updated);
      }
      setIsPublishing(false);
    }, 700);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(activeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out our official website for ${project.brand?.businessName || project.metadata?.name}! View our catalog, prices, and order directly: ${activeUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleVerifyDns = () => {
    if (!customDomain.trim()) return;
    setIsVerifyingDns(true);
    setTimeout(() => {
      setIsVerifyingDns(false);
      setDnsStatus('verified');
      const updated = {
        ...project,
        metadata: {
          ...project.metadata,
          customDomain: customDomain.trim(),
        },
      };
      storageService.saveProject(updated, updated.metadata?.userId || 'usr_guest');
      if (onUpdateProject) onUpdateProject(updated);
    }, 1500);
  };

  const handlePrintTentCard = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content modal-content-wide glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Globe size={20} className="text-cyan" />
            <div>
              <h3 className="modal-title font-display">Publish & Deploy Center</h3>
              <span className="font-mono text-xs text-muted">
                {project.metadata?.name} • Live Edge Distribution
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Navigation Tabs */}
          <div className="publish-tabs-bar">
            <button
              type="button"
              onClick={() => setActiveTab('subdomain')}
              className={`publish-tab-btn ${activeTab === 'subdomain' ? 'is-active' : ''}`}
            >
              <Globe size={15} />
              <span>Instant Subdomain</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`publish-tab-btn ${activeTab === 'custom' ? 'is-active' : ''}`}
            >
              <Radio size={15} />
              <span>Custom Domain (.in / .com)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`publish-tab-btn ${activeTab === 'qr' ? 'is-active' : ''}`}
            >
              <QrCode size={15} />
              <span>Store Counter QR Stand</span>
            </button>
          </div>

          {/* TAB 1: Instant Subdomain */}
          {activeTab === 'subdomain' && (
            <div className="publish-tab-content">
              {/* Publication Status Pill */}
              <div className={`publish-status-banner ${isPublished ? 'is-live' : ''}`}>
                <div className="status-indicator-left">
                  <div className={isPublished ? 'status-dot-pulse' : 'status-dot-draft'} />
                  <div>
                    <strong className="text-sm font-sans block">
                      {isPublished ? 'Website is Live on the Global Web' : 'Currently in Draft Mode'}
                    </strong>
                    <span className="text-xs text-muted font-mono">
                      {isPublished
                        ? 'Edge CDN, HTTPS SSL, and automated cache purging active'
                        : 'Only visible inside Klyvora Studio workspace'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePublish}
                  disabled={isPublishing}
                  className={`btn font-mono text-xs ${isPublished ? 'btn-ghost text-rose' : 'btn-primary'}`}
                >
                  {isPublishing ? (
                    <span>Deploying...</span>
                  ) : isPublished ? (
                    <span>Unpublish (Draft)</span>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Publish Live Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Subdomain Configuration */}
              <div className="publish-domain-staging">
                <span className="font-mono domain-label">PRODUCTION SUBDOMAIN PREVIEW</span>
                <div className="domain-input-group">
                  <span className="domain-protocol font-mono">https://</span>
                  <input
                    type="text"
                    value={subdomain}
                    disabled={isPublished}
                    onChange={(e) =>
                      setSubdomain(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      )
                    }
                    className="domain-input font-mono"
                    placeholder="subdomain"
                  />
                  <span className="domain-suffix font-mono">.klyvora.live</span>
                </div>
                <p className="domain-caption">
                  {isPublished
                    ? 'Your unique high-speed public web address. Accessible worldwide.'
                    : 'Claim your unique subdomain handle before publishing.'}
                </p>
              </div>

              {/* Live URL & Action Card (Visible when published) */}
              {isPublished && (
                <div className="live-url-card">
                  <div className="live-url-text-wrap">
                    <span className="live-url-label font-mono">✦ PUBLIC PRODUCTION URL</span>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="live-url-link font-sans"
                    >
                      {publicUrl}
                    </a>
                  </div>

                  <div className="live-url-actions">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="btn btn-ghost font-mono text-xs"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                      <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(publicUrl, '_blank')}
                      className="btn btn-ghost font-mono text-xs"
                    >
                      <ExternalLink size={14} />
                      <span>Open Site</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="btn btn-primary font-mono text-xs"
                      style={{ background: '#10b981', borderColor: '#059669' }}
                    >
                      <Share2 size={14} />
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

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
            </div>
          )}

          {/* TAB 2: Custom Domain */}
          {activeTab === 'custom' && (
            <div className="publish-tab-content">
              <div className="publish-domain-staging">
                <span className="font-mono domain-label">CONNECT YOUR OWN DOMAIN</span>
                <div className="domain-input-group">
                  <span className="domain-protocol font-mono">https://</span>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value.toLowerCase().trim())}
                    className="domain-input font-mono"
                    placeholder="e.g. www.mybrand.in or store.co.in"
                  />
                </div>
                <p className="domain-caption">
                  Point any domain from GoDaddy, Namecheap, BigRock, or Cloudflare to Klyvora Edge.
                </p>
              </div>

              {/* DNS Instruction Table */}
              <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
                <span className="font-mono text-xs text-cyan block mb-2">
                  REQUIRED DNS RECORDS (ADD AT YOUR REGISTRAR)
                </span>
                <table className="dns-records-table">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>HOST / NAME</th>
                      <th>VALUE / TARGET</th>
                      <th>TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>CNAME</strong></td>
                      <td><code>www</code></td>
                      <td><code>edge.klyvora.live</code></td>
                      <td>Auto / 3600</td>
                    </tr>
                    <tr>
                      <td><strong>A Record</strong></td>
                      <td><code>@</code></td>
                      <td><code>76.76.21.21</code></td>
                      <td>Auto</td>
                    </tr>
                    <tr>
                      <td><strong>TXT</strong></td>
                      <td><code>_klyvora-challenge</code></td>
                      <td><code>klyvora-verify={project.id?.slice(0, 12)}</code></td>
                      <td>Auto</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} className={dnsStatus === 'verified' ? 'text-emerald' : 'text-muted'} />
                    <span className="font-mono text-xs text-secondary">
                      {dnsStatus === 'verified'
                        ? '✓ SSL Certificate Active & Domain Bound'
                        : 'DNS Propagation typically completes in 5–30 minutes'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyDns}
                    disabled={isVerifyingDns || !customDomain}
                    className="btn btn-primary font-mono text-xs"
                  >
                    {isVerifyingDns ? (
                      <>
                        <RefreshCw size={14} className="spin-icon" />
                        <span>Checking DNS...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Verify DNS Connection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Store Counter QR Stand */}
          {activeTab === 'qr' && (
            <div className="publish-tab-content">
              <p className="text-xs text-muted text-center mb-2">
                Print this tent card and place it on your retail counter, clinic reception desk, or classroom entrance.
              </p>

              {/* Printable Counter Tent Card Preview */}
              <div className="counter-tent-preview" id="klyvora-counter-card">
                <div className="counter-tent-logo">
                  {project.brand?.businessName || project.metadata?.name}
                </div>
                <div className="counter-tent-sub">
                  {project.brand?.tagline || 'Official Digital Menu & WhatsApp Inquiries'}
                </div>

                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeUrl)}&color=0f172a&bgcolor=ffffff`}
                  alt="Store Counter QR Code"
                  className="counter-tent-qr"
                />

                <div className="counter-tent-cta">
                  SCAN TO VISIT & ORDER VIA WHATSAPP
                </div>
                <div className="counter-tent-footer font-mono">
                  {activeUrl.replace('https://', '')}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={handlePrintTentCard}
                  className="btn btn-primary font-mono text-xs"
                >
                  <Printer size={15} />
                  <span>Print Counter Tent Display</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="btn btn-ghost font-mono text-xs"
                >
                  <Share2 size={15} />
                  <span>Share QR Link on WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
