import React from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail, CheckCircle2 } from 'lucide-react';
import { personalInfo as defaultInfo } from '../data/portfolioData';

const ensureHttp = (url) => {
  if (!url || !url.trim()) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const Hero = ({ onOpenResume, personalInfo }) => {
  const info = personalInfo || defaultInfo;
  const avatarSrc = info.avatarImage || '/images/ratish.png';

  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Text & CTAs */}
        <div>
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            <span>Available for Full Stack & Software Roles</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">{info.name}</span>
            <br />
            <span style={{ fontSize: '2.1rem', color: 'var(--text-secondary)' }}>
              {info.title}
            </span>
          </h1>

          <p className="hero-subtitle">
            {info.bio}
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              <span>View Projects</span>
              <ArrowRight size={18} />
            </a>

            <a href="#contact" className="btn btn-secondary">
              <Mail size={18} />
              <span>Contact Me</span>
            </a>

            <button onClick={onOpenResume} className="btn btn-outline">
              <Download size={18} />
              <span>Resume</span>
            </button>
          </div>

          <div className="social-links">
            {info.github && (
              <a href={ensureHttp(info.github)} target="_blank" rel="noreferrer" className="social-icon-btn" title="GitHub">
                <Github size={20} />
              </a>
            )}
            {info.linkedin && (
              <a href={ensureHttp(info.linkedin)} target="_blank" rel="noreferrer" className="social-icon-btn" title="LinkedIn">
                <Linkedin size={20} />
              </a>
            )}
            {info.email && (
              <a href={`mailto:${info.email}`} className="social-icon-btn" title="Email">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Executive Photo Card */}
        <div className="avatar-wrapper">
          <div className="avatar-glow"></div>
          <div className="avatar-card glass-card">
            <div className="avatar-img-circle">
              <img src={avatarSrc} alt={info.name} />
            </div>

            <h3 className="avatar-name">{info.name}</h3>
            <p className="avatar-role">B.E. Information Science (2026)</p>

            <div style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> CGPA: {info.education?.cgpa}
            </div>

            <div className="avatar-tags">
              <span className="avatar-tag">MERN Stack</span>
              <span className="avatar-tag">React.js</span>
              <span className="avatar-tag">Node / Express</span>
              <span className="avatar-tag">SQLite</span>
              <span className="avatar-tag">Kotlin</span>
              <span className="avatar-tag">Playwright</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
