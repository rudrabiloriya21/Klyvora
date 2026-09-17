import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

export default function LegalModal({ isOpen, type, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-content glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            {isPrivacy ? (
              <ShieldCheck size={22} className="text-cyan" />
            ) : (
              <FileText size={22} className="text-violet" />
            )}
            <h3 id="legal-modal-title" className="modal-title font-display">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isPrivacy ? (
            <div className="legal-article">
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
                EFFECTIVE DATE: JANUARY 2026 // XEORVIA DIGITAL DIRECTIVE
              </span>

              <h4>1. Respect for User Privacy</h4>
              <p>
                Klyvora, developed and presented by Xeorvia, is built with a deep commitment to digital
                sovereignty and minimal data retention. We believe modern experiences should prioritize
                elegance and speed without unnecessary surveillance or intrusive tracking.
              </p>

              <h4>2. Information We Collect</h4>
              <p>
                We only collect information voluntarily transmitted through our direct communication
                channels or inquiry form (such as your name, email address, and message). We do not sell,
                rent, or broker your personal information to third parties.
              </p>

              <h4>3. Performance & Session Storage</h4>
              <p>
                Klyvora operates client-side optimizations using standard browser storage strictly to
                preserve your interaction preferences (e.g., luminescence and surface density parameters in
                the showcase). No third-party profiling cookies are utilized.
              </p>

              <h4>4. Data Inquiries</h4>
              <p>
                If you have questions regarding your data or communication with Klyvora, please contact us
                directly at{' '}
                <a href="mailto:hello@xeorvia.com" className="legal-inline-link">
                  hello@xeorvia.com
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="legal-article">
              <span className="font-mono text-muted" style={{ fontSize: '12px' }}>
                LAST REVISED: JANUARY 2026 // XEORVIA TERMS
              </span>

              <h4>1. Agreement to Terms</h4>
              <p>
                By accessing or exploring Klyvora, you agree to these Terms of Service presented by
                Xeorvia. If you do not agree with any part of these terms, please discontinue your use of
                the digital experience.
              </p>

              <h4>2. Intellectual Property & Brand Rights</h4>
              <p>
                All visual designs, custom vector marks, interactive shader algorithms, brand marks, and
                copy associated with Klyvora and Xeorvia are the proprietary intellectual property of
                Xeorvia. Unauthorized replication, redistribution, or modification is prohibited.
              </p>

              <h4>3. Acceptable Use</h4>
              <p>
                Visitors agree not to probe, scan, or compromise the technical infrastructure, attempt
                denial-of-service disruptions, or utilize automated scraping mechanisms against Klyvora's
                systems.
              </p>

              <h4>4. Disclaimer of Warranties</h4>
              <p>
                The Klyvora experience is provided "as is" and "as available" for presentation and digital
                exploration purposes without warranties of any kind, either express or implied.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
