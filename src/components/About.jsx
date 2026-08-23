import React from 'react';
import { GraduationCap, Award, MapPin, Mail, Phone } from 'lucide-react';
import { personalInfo as defaultInfo } from '../data/portfolioData';

const About = ({ personalInfo }) => {
  const info = personalInfo || defaultInfo;

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Driven by Innovation & Quality</h2>
          <p className="section-subtitle">
            A software engineer equipped with comprehensive technical skills across full-stack development, mobile apps, and automated testing pipelines.
          </p>
        </div>

        <div className="about-grid">
          {/* Bio & Education Card */}
          <div className="glass-card about-card-body">
            <h3 className="about-card-title">
              <GraduationCap size={24} />
              Education & Background
            </h3>
            
            <p className="about-text">
              I am pursuing my Bachelor of Engineering (B.E.) in Information Science and Engineering at <strong>{info.education?.institution}</strong>. Throughout my academic journey, I have maintained an outstanding academic record with a <strong>CGPA of {info.education?.cgpa}</strong>.
            </p>

            <p className="about-text">
              {info.bio}
            </p>

            <div className="info-list">
              <div className="info-item">
                <MapPin size={18} className="info-icon" />
                <span><strong>Location:</strong> {info.location}</span>
              </div>
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <span><strong>Email:</strong> {info.email}</span>
              </div>
              <div className="info-item">
                <Phone size={18} className="info-icon" />
                <span><strong>Phone:</strong> {info.phone}</span>
              </div>
              <div className="info-item">
                <GraduationCap size={18} className="info-icon" />
                <span><strong>Graduation:</strong> {info.education?.period}</span>
              </div>
            </div>
          </div>

          {/* Metrics Grid Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="metrics-grid">
              <div className="glass-card metric-box">
                <div className="metric-num">5+</div>
                <div className="metric-label">Fullstack & Mobile Projects</div>
              </div>
              <div className="glass-card metric-box">
                <div className="metric-num">{info.education?.cgpa?.split('/')[0] || '8.6'}</div>
                <div className="metric-label">Academic CGPA</div>
              </div>
              <div className="glass-card metric-box">
                <div className="metric-num">5</div>
                <div className="metric-label">Professional Certifications</div>
              </div>
              <div className="glass-card metric-box">
                <div className="metric-num">100%</div>
                <div className="metric-label">Backend API & DB Integration</div>
              </div>
            </div>

            <div className="glass-card about-card-body" style={{ flexGrow: 1 }}>
              <h3 className="about-card-title">
                <Award size={22} />
                Key Specializations
              </h3>
              <ul style={{ listStyleType: 'circle', paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><strong>Full Stack Engineering:</strong> Responsive UI design with React.js + RESTful APIs in Express.js + SQLite/MongoDB message databases.</li>
                <li><strong>Generative AI & Android:</strong> Building Kotlin apps with Jetpack Compose integrated with Gen AI services.</li>
                <li><strong>Quality & Test Automation:</strong> Comprehensive testing with Playwright, Postman API testing, STLC/SDLC methodologies.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
