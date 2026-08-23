import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { personalInfo as defaultPersonalInfo } from '../data/portfolioData';

const ensureHttp = (url) => {
  if (!url || !url.trim()) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const Footer = ({ personalInfo }) => {
  const info = personalInfo || defaultPersonalInfo;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="nav-logo-icon" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>RK</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{info.name}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
          Full Stack Web Developer & Software Engineer. Dedicated to crafting elegant digital experiences and robust backend APIs.
        </p>

        <div className="social-links" style={{ margin: '0.5rem 0' }}>
          {info.github && (
            <a href={ensureHttp(info.github)} target="_blank" rel="noreferrer" className="social-icon-btn" title="GitHub">
              <Github size={18} />
            </a>
          )}
          {info.linkedin && (
            <a href={ensureHttp(info.linkedin)} target="_blank" rel="noreferrer" className="social-icon-btn" title="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {info.email && (
            <a href={`mailto:${info.email}`} className="social-icon-btn" title="Email">
              <Mail size={18} />
            </a>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} {info.name}. Built with React.js, Express & SQLite.</span>
        </div>

        <button
          onClick={scrollToTop}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          title="Scroll to Top"
        >
          <ArrowUp size={14} />
          <span>Back to Top</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
