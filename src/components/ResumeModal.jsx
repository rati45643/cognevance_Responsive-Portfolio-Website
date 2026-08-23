import React from 'react';
import { X, Printer, Download, FileText, ExternalLink, Github, Linkedin, Mail, Award } from 'lucide-react';
import {
  personalInfo as defaultInfo,
  skillsData as defaultSkills,
  projectsData as defaultProjects,
  experienceData as defaultExperience,
  certificatesData as defaultCertificates
} from '../data/portfolioData';

const ensureHttp = (url) => {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const ResumeModal = ({ isOpen, onClose, portfolioContent }) => {
  if (!isOpen) return null;

  const info = portfolioContent?.personalInfo || defaultInfo;
  const skills = portfolioContent?.skillsData || defaultSkills;
  const projects = portfolioContent?.projectsData || defaultProjects;
  const experience = portfolioContent?.experienceData || defaultExperience;
  const certificates = portfolioContent?.certificatesData || defaultCertificates;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(94%, 920px)', maxHeight: '88vh', overflowY: 'auto', padding: '2rem' }}
      >
        <button className="modal-close-btn" onClick={onClose} title="Close Resume Modal">
          <X size={20} />
        </button>

        {/* Modal Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={24} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.4rem' }}>Live Portfolio Resume Preview</h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <a href="/Ratish_Kannur_Resume.html" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 0.95rem', fontSize: '0.85rem' }}>
              <ExternalLink size={15} />
              <span>Open Printable / PDF Resume ↗</span>
            </a>
            <button className="btn btn-secondary" onClick={handlePrint} style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <a href="/Ratish_Kannur_Resume.md" download className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              <Download size={15} />
              <span>Raw Markdown</span>
            </a>
          </div>
        </div>

        {/* Dynamic Paper View */}
        <div
          id="resume-paper"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '2.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            lineHeight: 1.55
          }}
        >
          {/* Resume Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '1.25rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
              {info.name}
            </h1>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {info.title}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {info.email && (
                <a href={`mailto:${info.email}`} style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Mail size={13} />
                  <span>{info.email}</span>
                </a>
              )}
              {info.phone && <span>| {info.phone}</span>}
              {info.location && <span>| {info.location}</span>}
              {info.github && (
                <a href={ensureHttp(info.github)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Github size={13} />
                  <span>GitHub ↗</span>
                </a>
              )}
              {info.linkedin && (
                <a href={ensureHttp(info.linkedin)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Linkedin size={13} />
                  <span>LinkedIn ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.25rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              EDUCATION
            </h3>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
                <span>{info.education?.institution}</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{info.education?.period}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {info.education?.degree} | <strong style={{ color: 'var(--accent-emerald)' }}>CGPA: {info.education?.cgpa}</strong>
              </div>
            </div>
          </div>

          {/* Technical Skills Toolkit */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.25rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              TECHNICAL SKILLS TOOLKIT
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
              {skills.map((cat, idx) => (
                <div key={idx}>
                  <strong>• {cat.category}:</strong> {Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills}
                </div>
              ))}
            </div>
          </div>

          {/* Internship Experience */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.25rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              INTERNSHIP & PROFESSIONAL EXPERIENCE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    <span>{exp.role} – {exp.company}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>{exp.period}</span>
                  </div>
                  {exp.location && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{exp.location}</div>}
                  
                  {Array.isArray(exp.description) ? (
                    <ul style={{ listStyle: 'circle', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                      {exp.description.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects with Live Links */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.25rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              FEATURED PROJECTS & CASE STUDIES
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              {projects.map((p, idx) => (
                <div key={idx} style={{ padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      • {p.title} <span style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>({p.category})</span>
                    </span>

                    {/* Action Links */}
                    <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.775rem' }}>
                      {p.githubLink && (
                        <a href={ensureHttp(p.githubLink)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                          <Github size={12} />
                          <span>Code ↗</span>
                        </a>
                      )}
                      {p.liveLink && (
                        <a href={ensureHttp(p.liveLink)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-emerald)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                          <ExternalLink size={12} />
                          <span>Live ↗</span>
                        </a>
                      )}
                      {p.credentialLink && (
                        <a href={ensureHttp(p.credentialLink)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                          <Award size={12} />
                          <span>Proof ↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{p.description}</p>
                  
                  {p.technologies && (
                    <div style={{ fontSize: '0.775rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Tech Stack: {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications with Proof Links */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.25rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              PROFESSIONAL CERTIFICATES & PROOF LINKS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.875rem' }}>
              {certificates.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    • <strong>{c.title}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{c.issuer} - {c.details}</span>
                  </div>
                  {c.credentialLink && (
                    <a
                      href={ensureHttp(c.credentialLink)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-pink)', fontSize: '0.775rem', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <Award size={12} />
                      <span>Proof Link ↗</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Resume</button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
