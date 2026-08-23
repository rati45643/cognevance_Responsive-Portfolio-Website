import React from 'react';
import { Code, Smartphone, Database, ShieldCheck, Cpu, BarChart3, Check } from 'lucide-react';
import { skillsData as defaultSkills } from '../data/portfolioData';

const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Code': return <Code size={20} />;
    case 'Smartphone': return <Smartphone size={20} />;
    case 'Database': return <Database size={20} />;
    case 'ShieldCheck': return <ShieldCheck size={20} />;
    case 'Cpu': return <Cpu size={20} />;
    case 'BarChart3': return <BarChart3 size={20} />;
    default: return <Code size={20} />;
  }
};

const Skills = ({ skillsData }) => {
  const list = skillsData || defaultSkills;

  return (
    <section id="skills" className="section" style={{ background: 'rgba(0, 0, 0, 0.15)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Technical Skillset</span>
          <h2 className="section-title">Tools & Technologies</h2>
          <p className="section-subtitle">
            A versatile toolkit spanning software development, mobile frameworks, cloud databases, machine learning libraries, and QA testing tools.
          </p>
        </div>

        <div className="skills-categories">
          {list.map((cat, idx) => (
            <div key={idx} className="glass-card skill-category-card">
              <div className="category-header">
                <div className="category-icon">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3>{cat.category}</h3>
              </div>

              <div className="skills-pill-group">
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-pill">
                    <Check size={14} style={{ color: 'var(--accent-emerald)' }} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
