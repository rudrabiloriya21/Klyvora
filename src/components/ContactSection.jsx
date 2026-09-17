import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles, Shield } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Please provide a valid email address';
    if (!formData.message.trim()) errs.message = 'Please enter your message';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-space contact-section" aria-labelledby="contact-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">COMMUNICATION</span>
          <h2 id="contact-heading" className="section-title">
            Connect with Klyvora.
          </h2>
          <p className="section-desc">
            Whether inquiring about digital experiences, collaboration opportunities, or the
            Xeorvia creative pipeline, we welcome thoughtful conversation.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details & Ethos */}
          <div className="contact-info-card glass-card glass-card-elevated">
            <div className="badge-pill font-mono">
              <span className="badge-dot" />
              <span>DIRECT CHANNELS</span>
            </div>

            <h3 className="contact-info-title font-display">
              Initiate a dialogue with the team.
            </h3>

            <p className="contact-info-desc">
              Every inquiry is reviewed by the Xeorvia and Klyvora design collective. We prioritize
              meaningful collaborations that push digital boundaries.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="contact-detail-label font-mono">DIRECT INQUIRIES</span>
                  <a href="mailto:hello@xeorvia.com" className="contact-detail-val font-mono">
                    hello@xeorvia.com
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Shield size={18} />
                </div>
                <div>
                  <span className="contact-detail-label font-mono">LOCATION & CADENCE</span>
                  <span className="contact-detail-val">Global Digital Studio · Remote First</span>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="contact-detail-label font-mono">RESPONSE TIME</span>
                  <span className="contact-detail-val">Typically within 24–48 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="contact-form-card glass-card">
            {submitted ? (
              <div className="contact-success-state" role="status" aria-live="polite">
                <div className="success-icon-wrap">
                  <CheckCircle size={44} className="text-cyan" />
                </div>
                <h3 className="font-display success-title">Message Transmitted</h3>
                <p className="success-desc">
                  Thank you for reaching out to Klyvora. The Xeorvia team will review your inquiry
                  and respond promptly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', topic: 'General Inquiry', message: '' });
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '20px' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="contact-form">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label font-mono">
                    NAME / ORGANIZATION <span className="req">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <span id="name-error" className="form-error-msg font-mono">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label font-mono">
                    EMAIL ADDRESS <span className="req">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@domain.com"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className="form-error-msg font-mono">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contact-topic" className="form-label font-mono">
                    INQUIRY TOPIC
                  </label>
                  <select
                    id="contact-topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="form-input form-select"
                  >
                    <option value="General Inquiry">General Digital Inquiry</option>
                    <option value="Collaboration">Creative Collaboration</option>
                    <option value="Technology">Technology & Architecture</option>
                    <option value="Xeorvia Studio">Xeorvia Brand Direction</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label font-mono">
                    MESSAGE <span className="req">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your thoughts or inquiry..."
                    className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <span id="message-error" className="form-error-msg font-mono">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary form-submit-btn">
                  <span>Send Inquiry</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
