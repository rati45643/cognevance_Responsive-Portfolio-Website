import React from 'react';
import { Briefcase, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { experienceData as defaultExperience, certificatesData as defaultCertificates } from '../data/portfolioData';

const Experience = ({ experienceData, certificatesData }) => {
  const expList = experienceData || defaultExperience;
  const certList = certificatesData || defaultCertificates;

  return (
    <section id="experience" className="section" style={{ background: 'rgba(0, 0, 0, 0.15)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Career & Achievements</span>
          <h2 className="section-title">Experience & Certifications</h2>
          <p className="section-subtitle">
            Hands-on software internship experience and professional certifications validating expertise across Fullstack, Gen AI, Cybersecurity, and Data Analytics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Internship Timeline */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-primary)' }}>
              <Briefcase size={22} />
              Experience & Internships ({expList.length})
            </h3>

            <div className="timeline">
              {expList.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="glass-card timeline-content">
                    <div className="timeline-date">{exp.period}</div>
                    <h4 className="timeline-title">{exp.role}</h4>
                    <div className="timeline-subtitle">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                    
                    {Array.isArray(exp.description) ? (
                      <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Professional Certifications */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-pink)' }}>
              <Award size={22} />
              Verified Certifications ({certList.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {certList.map((cert, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle size={20} style={{ color: 'var(--accent-emerald)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                          {cert.title}
                        </h4>
                        
                        {/* Proof / Credential Link */}
                        {cert.credentialLink && (
                          <a
                            href={cert.credentialLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: 'var(--accent-cyan)',
                              background: 'rgba(6, 182, 212, 0.1)',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              padding: '0.2rem 0.6rem',
                              borderRadius: 'var(--radius-full)',
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={13} />
                            <span>Proof Link</span>
                          </a>
                        )}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.4rem' }}>
                        {cert.issuer}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {cert.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
