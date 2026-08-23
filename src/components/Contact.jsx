import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const Contact = ({ onMessageSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    savedData: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error once user types
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null, savedData: null });

    // Client-side strict validation for ALL 5 fields
    if (
      !formData.name || !formData.name.trim() ||
      !formData.email || !formData.email.trim() || !formData.email.includes('@') ||
      !formData.company || !formData.company.trim() ||
      !formData.subject || !formData.subject.trim() ||
      !formData.message || !formData.message.trim()
    ) {
      setStatus({
        submitting: false,
        success: false,
        error: 'All fields are required! Please complete all fields before sending.',
        savedData: null
      });
      return;
    }

    try {
      // Step 1: Save message to SQLite database via Express REST API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'All fields are required! Please complete all fields before sending.');
      }

      setStatus({
        submitting: false,
        success: true,
        error: null,
        savedData: data.data
      });

      // Step 2: Open Gmail / Mail app with pre-filled message to ratishkannur@gmail.com
      const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject} from ${formData.name}`);
      const mailBody = encodeURIComponent(
        `Hi Ratish,\n\n${formData.message}\n\n---\nSender Details:\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nSubject: ${formData.subject}`
      );
      
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ratishkannur@gmail.com&su=${mailSubject}&body=${mailBody}`;
      
      // Open Gmail compose tab automatically
      window.open(gmailComposeUrl, '_blank');

      // Clear form
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });

      // Trigger message update in parent app
      if (onMessageSubmitted) {
        onMessageSubmitted();
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'All fields are required! Please complete all fields before sending.',
        savedData: null
      });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-subtitle">
            Have a project in mind, a hiring opportunity, or a question? Please complete all 5 required fields below. Messages save to the SQLite database and open Gmail directly for dispatch!
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="glass-card contact-info-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
              Contact Information
            </h3>

            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <Mail size={22} />
              </div>
              <div>
                <div className="contact-method-title">Email Me</div>
                <a href={`mailto:${personalInfo.email}`} className="contact-method-value">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <Phone size={22} />
              </div>
              <div>
                <div className="contact-method-title">Call / WhatsApp</div>
                <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="contact-method-value">
                  {personalInfo.phone}
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <MapPin size={22} />
              </div>
              <div>
                <div className="contact-method-title">Location</div>
                <div className="contact-method-value">
                  {personalInfo.location}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                Strict 5-Field Validation
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                All 5 fields (Name, Email, Company, Subject, Message) are mandatory. Upon completion, message saves to <strong>SQLite DB</strong> and opens <strong>Gmail</strong> for <strong>ratishkannur@gmail.com</strong>!
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="glass-card contact-form-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send a Message</h3>

            {status.success && (
              <div className="alert-box alert-success">
                <CheckCircle2 size={20} />
                <div>
                  <strong>Saved to Database! Opening Gmail...</strong>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Record ID: #{status.savedData?.id} saved to DB. Gmail launched for direct dispatch to <strong>ratishkannur@gmail.com</strong>.
                  </div>
                </div>
              </div>
            )}

            {status.error && (
              <div className="alert-box alert-error">
                <AlertCircle size={20} />
                <span style={{ fontWeight: '600' }}>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Alex Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Your Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. alex@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="company">Company / Organization *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="form-input"
                    placeholder="e.g. TechCorp / Freelance"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-input"
                  placeholder="e.g. Full Stack Developer Opportunity"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving to DB & Opening Gmail...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Save to DB & Open Gmail</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
