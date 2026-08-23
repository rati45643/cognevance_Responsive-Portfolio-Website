import React, { useState } from 'react';
import { Github, ExternalLink, Award, CheckCircle2, Code } from 'lucide-react';
import { projectsData as defaultProjects } from '../data/portfolioData';

// Helper to normalize URLs
const ensureHttp = (url) => {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

// Helper to parse tech tags from arrays or hyphenated/comma strings
const cleanTechList = (input) => {
  if (!input) return [];
  let list = [];
  if (Array.isArray(input)) {
    input.forEach(item => {
      if (typeof item === 'string') {
        if (item.includes('-') && !item.includes(' ')) {
          const parts = item.split('-').map(s => s.replace(/([a-z])([A-Z])/g, '$1 $2').trim()).filter(Boolean);
          list.push(...parts);
        } else if (item.includes(',')) {
          list.push(...item.split(',').map(s => s.trim()).filter(Boolean));
        } else {
          list.push(item.trim());
        }
      }
    });
  } else if (typeof input === 'string') {
    if (input.includes('-') && !input.includes(' ') && !input.includes(',')) {
      list = input.split('-').map(s => s.replace(/([a-z])([A-Z])/g, '$1 $2').trim()).filter(Boolean);
    } else {
      list = input.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    }
  }
  return Array.from(new Set(list)).filter(Boolean);
};

const Projects = ({ projectsData }) => {
  const [filter, setFilter] = useState('All');
  const [failedImages, setFailedImages] = useState({});

  const rawList = projectsData || defaultProjects;

  // Clean all technology lists
  const list = rawList.map(p => ({
    ...p,
    technologies: cleanTechList(p.technologies)
  }));

  const categories = ['All', ...new Set(list.map((p) => p.category).filter(Boolean))];

  const filteredProjects = filter === 'All'
    ? list
    : list.filter((p) => p.category === filter);

  const handleImageError = (projectId) => {
    setFailedImages(prev => ({ ...prev, [projectId]: true }));
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Portfolio & Case Studies</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Explore my recent engineering work, ranging from full-stack web platforms with Express/SQLite backends to Generative AI mobile applications.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="project-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, idx) => {
            const pId = project.id || `proj-${idx}`;
            const imgSrc = ensureHttp(project.image) || '/images/portfolio.jpg';
            const isFailed = failedImages[pId];

            return (
              <div key={pId} className="glass-card project-card">
                <div className="project-image-box">
                  {!isFailed ? (
                    <img
                      src={imgSrc}
                      alt={project.title}
                      onError={() => handleImageError(pId)}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)', color: '#fff', padding: '1rem', textAlign: 'center' }}>
                      <Code size={32} style={{ marginBottom: '0.5rem' }} />
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{project.title}</span>
                    </div>
                  )}
                  <span className="project-badge">{project.badge || project.category}</span>
                </div>

                <div className="project-body">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>

                  {/* Key Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Key Deliverables & Highlights:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {project.highlights.map((h, i) => (
                          <li key={i} style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Individual Technology Pills */}
                  <div className="project-tech-stack">
                    {project.technologies && project.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  {/* Action Links for ALL projects */}
                  <div className="project-links" style={{ flexWrap: 'wrap', gap: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    {project.githubLink && (
                      <a href={ensureHttp(project.githubLink)} target="_blank" rel="noreferrer" className="project-link-btn">
                        <Github size={16} />
                        <span>Code</span>
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={ensureHttp(project.liveLink)} target="_blank" rel="noreferrer" className="project-link-btn" style={{ color: 'var(--accent-emerald)' }}>
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.credentialLink && (
                      <a href={ensureHttp(project.credentialLink)} target="_blank" rel="noreferrer" className="project-link-btn" style={{ color: 'var(--accent-cyan)' }}>
                        <Award size={16} />
                        <span>Credential / Proof</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
