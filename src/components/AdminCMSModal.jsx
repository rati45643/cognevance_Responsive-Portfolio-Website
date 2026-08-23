import React, { useState, useEffect } from 'react';
import {
  X, Lock, Unlock, Save, RotateCcw, KeyRound, AlertCircle,
  User, GraduationCap, Code, Briefcase, Plus, Trash2, LayoutDashboard, Award, Eye, EyeOff, LogOut
} from 'lucide-react';
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkillsData,
  projectsData as defaultProjectsData,
  experienceData as defaultExperienceData,
  certificatesData as defaultCertificatesData
} from '../data/portfolioData';

const CATEGORY_OPTIONS = [
  'Mobile',
  'Fullstack',
  'AI & ML',
  'Testing & Automation',
  'Web & Frontend',
  'Backend & Cloud'
];

// Helper to safely parse tech tags from arrays or hyphenated/comma strings
const cleanTechList = (input) => {
  if (!input) return [];
  let list = [];
  try {
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
  } catch (err) {
    console.error('Error cleaning tech list:', err);
  }
  return Array.from(new Set(list)).filter(Boolean);
};

const AdminCMSModal = ({ isOpen, onClose, portfolioContent, onSaveContent, onResetContent }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [saveStatus, setSaveStatus] = useState('');

  // Local state copy
  const [content, setContent] = useState(() => ({
    personalInfo: portfolioContent?.personalInfo || defaultPersonalInfo,
    skillsData: portfolioContent?.skillsData || defaultSkillsData,
    projectsData: portfolioContent?.projectsData || defaultProjectsData,
    experienceData: portfolioContent?.experienceData || defaultExperienceData,
    certificatesData: portfolioContent?.certificatesData || defaultCertificatesData,
  }));

  // Inputs buffer per category index
  const [newSkillInputs, setNewSkillInputs] = useState({});
  // Tech input buffer per project
  const [techInputs, setTechInputs] = useState({});

  useEffect(() => {
    if (portfolioContent) {
      try {
        const cloned = JSON.parse(JSON.stringify(portfolioContent));
        cloned.personalInfo = cloned.personalInfo || defaultPersonalInfo;
        cloned.personalInfo.education = cloned.personalInfo.education || defaultPersonalInfo.education;
        cloned.skillsData = Array.isArray(cloned.skillsData) ? cloned.skillsData : defaultSkillsData;
        cloned.projectsData = Array.isArray(cloned.projectsData) ? cloned.projectsData : defaultProjectsData;
        cloned.experienceData = Array.isArray(cloned.experienceData) ? cloned.experienceData : defaultExperienceData;
        cloned.certificatesData = Array.isArray(cloned.certificatesData) ? cloned.certificatesData : defaultCertificatesData;

        cloned.projectsData = cloned.projectsData.map(p => ({
          ...p,
          technologies: cleanTechList(p.technologies)
        }));

        setContent(cloned);
      } catch (err) {
        console.error('Error syncing portfolioContent:', err);
      }
    }
  }, [portfolioContent]);

  if (!isOpen) return null;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    const entered = (adminPassword || '').trim();
    const envPass = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();
    if (envPass && (entered === envPass || entered.toLowerCase() === envPass.toLowerCase())) {
      setIsAdminAuthenticated(true);
      setAuthError('');
      setSaveStatus('Admin Edit Mode Unlocked!');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        setAuthError('');
        setSaveStatus('Admin Edit Mode Unlocked!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setAuthError(data.error || 'Incorrect Admin Password');
      }
    } catch (err) {
      setAuthError('Incorrect Admin Password');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword('');
    setShowPasswordText(false);
    setSaveStatus('Logged out of Admin Edit Mode.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSaveAll = async () => {
    setSaveStatus('Saving changes live to database...');
    try {
      const sanitizedContent = {
        ...content,
        projectsData: (content.projectsData || []).map(p => ({
          ...p,
          technologies: cleanTechList(p.technologies)
        }))
      };

      const result = await onSaveContent(sanitizedContent, adminPassword);
      if (result.success) {
        setSaveStatus('Entire portfolio updated live & saved to SQLite database!');
      } else {
        setSaveStatus(`Save failed: ${result.error}`);
      }
    } catch (err) {
      setSaveStatus('Failed to save portfolio content.');
    }
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the entire portfolio to initial default values?')) {
      await onResetContent(adminPassword);
      setSaveStatus('Portfolio reset to default content.');
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  // Safe field accessors
  const personal = (content && content.personalInfo) || defaultPersonalInfo;
  const education = (personal && personal.education) || defaultPersonalInfo.education;
  const skills = Array.isArray(content?.skillsData) ? content.skillsData : defaultSkillsData;
  const projects = Array.isArray(content?.projectsData) ? content.projectsData : defaultProjectsData;
  const experiences = Array.isArray(content?.experienceData) ? content.experienceData : defaultExperienceData;
  const certificates = Array.isArray(content?.certificatesData) ? content.certificatesData : defaultCertificatesData;

  // Personal Info helpers
  const updatePersonalInfo = (field, val) => {
    setContent((prev) => ({
      ...prev,
      personalInfo: { ...(prev?.personalInfo || defaultPersonalInfo), [field]: val }
    }));
  };

  const updateEducation = (field, val) => {
    setContent((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev?.personalInfo || defaultPersonalInfo),
        education: { ...((prev?.personalInfo?.education) || defaultPersonalInfo.education), [field]: val }
      }
    }));
  };

  // Skills Toolkit handlers
  const addSkillCategory = () => {
    const newCat = {
      category: 'New Skill Category',
      icon: 'Code',
      skills: ['Sample Skill 1', 'Sample Skill 2']
    };
    setContent((prev) => ({
      ...prev,
      skillsData: [...(prev?.skillsData || []), newCat]
    }));
  };

  const deleteSkillCategory = (cIdx) => {
    if (window.confirm(`Delete skill category #${cIdx + 1}?`)) {
      setContent((prev) => {
        const updated = [...(prev?.skillsData || [])];
        updated.splice(cIdx, 1);
        return { ...prev, skillsData: updated };
      });
    }
  };

  const addSkillToCategory = (cIdx, skillName) => {
    const raw = skillName || newSkillInputs[cIdx] || '';
    if (!raw.trim()) return;

    const parsedSkills = raw.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

    setContent((prev) => {
      const updated = [...(prev?.skillsData || [])];
      const existing = updated[cIdx]?.skills || [];
      const merged = Array.from(new Set([...existing, ...parsedSkills]));
      updated[cIdx] = { ...updated[cIdx], skills: merged };
      return { ...prev, skillsData: updated };
    });

    setNewSkillInputs((prev) => ({ ...prev, [cIdx]: '' }));
  };

  const removeSkillFromCategory = (cIdx, skillIdx) => {
    setContent((prev) => {
      const updated = [...(prev?.skillsData || [])];
      const currentSkills = [...(updated[cIdx]?.skills || [])];
      currentSkills.splice(skillIdx, 1);
      updated[cIdx] = { ...updated[cIdx], skills: currentSkills };
      return { ...prev, skillsData: updated };
    });
  };

  // Project handlers
  const updateProject = (idx, field, val) => {
    setContent((prev) => {
      const updated = [...(prev?.projectsData || defaultProjectsData)];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, projectsData: updated };
    });
  };

  // Tech tag pill handlers
  const addTechTag = (pIdx, tagToAdd) => {
    const raw = tagToAdd || techInputs[pIdx] || '';
    if (!raw.trim()) return;

    const parsed = cleanTechList(raw);
    setContent((prev) => {
      const updated = [...(prev?.projectsData || defaultProjectsData)];
      const existing = updated[pIdx]?.technologies || [];
      const merged = Array.from(new Set([...existing, ...parsed]));
      updated[pIdx] = { ...updated[pIdx], technologies: merged };
      return { ...prev, projectsData: updated };
    });

    setTechInputs((prev) => ({ ...prev, [pIdx]: '' }));
  };

  const removeTechTag = (pIdx, tagIndex) => {
    setContent((prev) => {
      const updated = [...(prev?.projectsData || defaultProjectsData)];
      const currentTech = [...(updated[pIdx]?.technologies || [])];
      currentTech.splice(tagIndex, 1);
      updated[pIdx] = { ...updated[pIdx], technologies: currentTech };
      return { ...prev, projectsData: updated };
    });
  };

  const addProject = () => {
    const newProj = {
      id: `project-${Date.now()}`,
      title: 'New Project Title',
      category: 'Mobile',
      badge: 'New App',
      description: 'Add project description here...',
      technologies: ['Kotlin', 'Android Studio', 'Jetpack Compose'],
      image: '/images/portfolio.jpg',
      githubLink: 'https://github.com/ratishkannur',
      liveLink: 'https://github.com/ratishkannur',
      credentialLink: 'https://github.com/ratishkannur',
      highlights: ['Key Deliverable 1', 'Key Deliverable 2']
    };
    setContent((prev) => ({
      ...prev,
      projectsData: [newProj, ...(prev?.projectsData || [])]
    }));
  };

  const deleteProject = (idx) => {
    if (window.confirm('Delete this project?')) {
      setContent((prev) => {
        const updated = [...(prev?.projectsData || [])];
        updated.splice(idx, 1);
        return { ...prev, projectsData: updated };
      });
    }
  };

  // Experience handlers
  const updateExperience = (idx, field, val) => {
    setContent((prev) => {
      const updated = [...(prev?.experienceData || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, experienceData: updated };
    });
  };

  const addExperience = () => {
    const newExp = {
      role: 'New Role / Position',
      company: 'Company Name',
      period: '2026 – Present',
      location: 'Bengaluru, India',
      description: ['Key responsibility or achievement bullet 1', 'Key bullet 2']
    };
    setContent((prev) => ({
      ...prev,
      experienceData: [newExp, ...(prev?.experienceData || [])]
    }));
  };

  const deleteExperience = (idx) => {
    if (window.confirm('Delete this experience entry?')) {
      setContent((prev) => {
        const updated = [...(prev?.experienceData || [])];
        updated.splice(idx, 1);
        return { ...prev, experienceData: updated };
      });
    }
  };

  // Certificate handlers
  const updateCertificate = (idx, field, val) => {
    setContent((prev) => {
      const updated = [...(prev?.certificatesData || [])];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, certificatesData: updated };
    });
  };

  const addCertificate = () => {
    const newCert = {
      title: 'New Professional Certification Title',
      issuer: 'Issuing Organization / Platform',
      details: 'Certification details, covered topics, or skills validated.',
      credentialLink: 'https://github.com/ratishkannur'
    };
    setContent((prev) => ({
      ...prev,
      certificatesData: [newCert, ...(prev?.certificatesData || [])]
    }));
  };

  const deleteCertificate = (idx) => {
    if (window.confirm('Delete this certificate?')) {
      setContent((prev) => {
        const updated = [...(prev?.certificatesData || [])];
        updated.splice(idx, 1);
        return { ...prev, certificatesData: updated };
      });
    }
  };

  // Safe helper to convert bullet lists to string
  const formatListText = (val) => {
    if (Array.isArray(val)) return val.join('\n');
    if (typeof val === 'string') return val;
    return '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 'min(94%, 1050px)', maxHeight: '90vh' }}>
        <button className="modal-close-btn" onClick={onClose} title="Close Admin CMS">
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem' }}>Portfolio Website CMS Editor</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Live Content Management System protected by owner password
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAdminAuthenticated && (
              <>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', color: '#ef4444' }} onClick={handleReset}>
                  <RotateCcw size={15} />
                  <span>Reset Defaults</span>
                </button>
                <button className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem' }} onClick={handleSaveAll}>
                  <Save size={15} />
                  <span>Save All Live</span>
                </button>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', color: '#ef4444' }} onClick={handleLogout}>
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {saveStatus && (
          <div style={{ padding: '0.6rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            {saveStatus}
          </div>
        )}

        {/* Login Form if not authenticated */}
        {!isAdminAuthenticated ? (
          <form onSubmit={handleAdminLogin} style={{ padding: '2.5rem 1.5rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto', background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.15)', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <KeyRound size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Owner Admin Authentication</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Enter password to unlock live full-page CMS editing for your portfolio website:
            </p>

            {authError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {/* Password input with Show / Hide Toggle */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input
                type={showPasswordText ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ textAlign: 'center', paddingRight: '2.75rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordText(!showPasswordText)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title={showPasswordText ? "Hide Password" : "Show Password"}
              >
                {showPasswordText ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Unlock size={18} />
              <span>Unlock Entire Page Editor</span>
            </button>
          </form>
        ) : (
          /* CMS Tabs & Editor */
          <div>
            {/* Tabs Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              {[
                { id: 'personal', name: 'Personal & Bio', icon: <User size={16} /> },
                { id: 'about', name: 'About & Education', icon: <GraduationCap size={16} /> },
                { id: 'skills', name: 'Skills Toolkit', icon: <Code size={16} /> },
                { id: 'projects', name: 'Projects Manager', icon: <Briefcase size={16} /> },
                { id: 'experience', name: 'Experience & Internships', icon: <Briefcase size={16} /> },
                { id: 'certificates', name: 'Certificates & Proof Links', icon: <Award size={16} /> },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab(t.id)}
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.825rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
                >
                  {t.icon}
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Personal & Bio */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '58vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Header & Hero Personal Information</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personal.name || ''}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Title / Role</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personal.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subtitle / Specializations</label>
                  <input
                    type="text"
                    className="form-input"
                    value={personal.subtitle || ''}
                    onChange={(e) => updatePersonalInfo('subtitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Bio Summary</label>
                  <textarea
                    className="form-textarea"
                    value={personal.bio || ''}
                    onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                    style={{ minHeight: '90px' }}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--accent-cyan)' }}>
                    Profile Photo URL / Image Path
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. /images/ratish.png or image URL"
                    value={personal.avatarImage || '/images/ratish.png'}
                    onChange={(e) => updatePersonalInfo('avatarImage', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={personal.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personal.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personal.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personal.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personal.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: About & Education */}
            {activeTab === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '58vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Academic Background & Education Details</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Institution / College</label>
                    <input
                      type="text"
                      className="form-input"
                      value={education.institution || ''}
                      onChange={(e) => updateEducation('institution', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Degree & Major</label>
                    <input
                      type="text"
                      className="form-input"
                      value={education.degree || ''}
                      onChange={(e) => updateEducation('degree', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Graduation Period</label>
                    <input
                      type="text"
                      className="form-input"
                      value={education.period || ''}
                      onChange={(e) => updateEducation('period', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Academic CGPA</label>
                    <input
                      type="text"
                      className="form-input"
                      value={education.cgpa || ''}
                      onChange={(e) => updateEducation('cgpa', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Skills Toolkit */}
            {activeTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '58vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    Manage Technical Skill Categories ({skills.length})
                  </h4>
                  <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.825rem' }} onClick={addSkillCategory}>
                    <Plus size={14} />
                    <span>Add New Category</span>
                  </button>
                </div>

                {skills.map((cat, cIdx) => {
                  const skillPills = Array.isArray(cat.skills) ? cat.skills : [];

                  return (
                    <div key={cIdx} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          Category #{cIdx + 1}: {cat.category || 'Untitled Category'}
                        </h5>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => deleteSkillCategory(cIdx)}>
                          <Trash2 size={13} />
                          <span>Delete Category</span>
                        </button>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Category Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cat.category || ''}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[cIdx].category = e.target.value;
                            setContent({ ...content, skillsData: updated });
                          }}
                        />
                      </div>

                      {/* Interactive Skill Pills Manager */}
                      <div className="form-group" style={{ marginBottom: '0.85rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
                          Skills Pills Preview ({skillPills.length} skills):
                        </label>

                        {/* Visual Skill Pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                          {skillPills.length === 0 ? (
                            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>No skills added to this category yet.</span>
                          ) : (
                            skillPills.map((sk, sIdx) => (
                              <span
                                key={sIdx}
                                className="skill-pill"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', fontSize: '0.775rem', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: 'var(--text-primary)' }}
                              >
                                <span>{sk}</span>
                                <X
                                  size={13}
                                  style={{ cursor: 'pointer', color: '#ef4444' }}
                                  onClick={() => removeSkillFromCategory(cIdx, sIdx)}
                                  title={`Remove ${sk}`}
                                />
                              </span>
                            ))
                          )}
                        </div>

                        {/* Input to add skill */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Add new skill tag (e.g. React.js, Docker, MongoDB)..."
                            value={newSkillInputs[cIdx] || ''}
                            onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [cIdx]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkillToCategory(cIdx);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            onClick={() => addSkillToCategory(cIdx)}
                          >
                            <Plus size={14} />
                            <span>Add Skill</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 4: Projects Manager */}
            {activeTab === 'projects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '58vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Manage Portfolio Projects ({projects.length})</h4>
                  <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.825rem' }} onClick={addProject}>
                    <Plus size={14} />
                    <span>Add New Project</span>
                  </button>
                </div>

                {projects.map((proj, pIdx) => {
                  const techList = cleanTechList(proj.technologies);

                  return (
                    <div key={proj.id || pIdx} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-cyan)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                          Project #{pIdx + 1}: {proj.title || 'Untitled Project'}
                        </h5>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => deleteProject(pIdx)}>
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.775rem' }}>Title</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.title || ''}
                            onChange={(e) => updateProject(pIdx, 'title', e.target.value)}
                          />
                        </div>

                        {/* Category Dropdown Selection + Custom Input */}
                        <div>
                          <label className="form-label" style={{ fontSize: '0.775rem' }}>Project Category</label>
                          <select
                            className="form-input"
                            value={CATEGORY_OPTIONS.includes(proj.category) ? proj.category : 'Custom'}
                            onChange={(e) => {
                              if (e.target.value !== 'Custom') {
                                updateProject(pIdx, 'category', e.target.value);
                              }
                            }}
                            style={{ marginBottom: '0.35rem' }}
                          >
                            {CATEGORY_OPTIONS.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="Custom">Custom Category...</option>
                          </select>

                          {!CATEGORY_OPTIONS.includes(proj.category) && (
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter custom category"
                              value={proj.category || ''}
                              onChange={(e) => updateProject(pIdx, 'category', e.target.value)}
                            />
                          )}
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.775rem' }}>Badge Label</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.badge || ''}
                            onChange={(e) => updateProject(pIdx, 'badge', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Description</label>
                        <textarea
                          className="form-textarea"
                          style={{ minHeight: '65px' }}
                          value={proj.description || ''}
                          onChange={(e) => updateProject(pIdx, 'description', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Key Deliverables & Highlights (One bullet per line)</label>
                        <textarea
                          className="form-textarea"
                          style={{ minHeight: '75px' }}
                          value={formatListText(proj.highlights)}
                          onChange={(e) => updateProject(pIdx, 'highlights', e.target.value.split('\n').filter(Boolean))}
                        ></textarea>
                      </div>

                      {/* Interactive Technologies Tag Manager */}
                      <div className="form-group" style={{ marginBottom: '0.85rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>Technologies Pills Preview ({techList.length} items):</span>
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Separate items like: <strong>Kotlin, Android Studio, Firebase</strong></span>
                        </label>

                        {/* Interactive Pill Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                          {techList.length === 0 ? (
                            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>No technologies added yet.</span>
                          ) : (
                            techList.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="tech-tag"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', fontSize: '0.775rem', background: 'rgba(99, 102, 241, 0.18)', border: '1px solid rgba(99, 102, 241, 0.35)', color: 'var(--accent-cyan)' }}
                              >
                                <span>{tech}</span>
                                <X
                                  size={13}
                                  style={{ cursor: 'pointer', color: '#ef4444' }}
                                  onClick={() => removeTechTag(pIdx, tIdx)}
                                  title={`Remove ${tech}`}
                                />
                              </span>
                            ))
                          )}
                        </div>

                        {/* Input to add technology pill */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Add technology (e.g. Android Studio, Kotlin, Firebase)..."
                            value={techInputs[pIdx] || ''}
                            onChange={(e) => setTechInputs({ ...techInputs, [pIdx]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTechTag(pIdx);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            onClick={() => addTechTag(pIdx)}
                          >
                            <Plus size={14} />
                            <span>Add Tech</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Image Path / URL</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.image || ''}
                            onChange={(e) => updateProject(pIdx, 'image', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>GitHub Code Link</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.githubLink || ''}
                            onChange={(e) => updateProject(pIdx, 'githubLink', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Live Demo Link</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.liveLink || ''}
                            onChange={(e) => updateProject(pIdx, 'liveLink', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Credential / Proof Link</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proj.credentialLink || ''}
                            onChange={(e) => updateProject(pIdx, 'credentialLink', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 5: Experience & Internships */}
            {activeTab === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '58vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Manage Experience & Internships ({experiences.length})</h4>
                  <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.825rem' }} onClick={addExperience}>
                    <Plus size={14} />
                    <span>Add New Experience</span>
                  </button>
                </div>

                {experiences.map((exp, eIdx) => (
                  <div key={eIdx} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h5 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        Experience #{eIdx + 1}: {exp.role || 'Untitled Role'} ({exp.company || 'N/A'})
                      </h5>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => deleteExperience(eIdx)}>
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Role / Position Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={exp.role || ''}
                          onChange={(e) => updateExperience(eIdx, 'role', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Company / Organization</label>
                        <input
                          type="text"
                          className="form-input"
                          value={exp.company || ''}
                          onChange={(e) => updateExperience(eIdx, 'company', e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Period / Dates</label>
                        <input
                          type="text"
                          className="form-input"
                          value={exp.period || ''}
                          onChange={(e) => updateExperience(eIdx, 'period', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Location</label>
                        <input
                          type="text"
                          className="form-input"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(eIdx, 'location', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.775rem' }}>Description Highlights (One bullet per line)</label>
                      <textarea
                        className="form-textarea"
                        style={{ minHeight: '80px' }}
                        value={formatListText(exp.description)}
                        onChange={(e) => updateExperience(eIdx, 'description', e.target.value.split('\n').filter(Boolean))}
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Certificates & Proof Links */}
            {activeTab === 'certificates' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '58vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-pink)', fontSize: '1.1rem' }}>Manage Certifications & Proof Links ({certificates.length})</h4>
                  <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.825rem' }} onClick={addCertificate}>
                    <Plus size={14} />
                    <span>Add New Certificate</span>
                  </button>
                </div>

                {certificates.map((cert, cIdx) => (
                  <div key={cIdx} className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-pink)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h5 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        Certificate #{cIdx + 1}: {cert.title || 'Untitled Certificate'}
                      </h5>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => deleteCertificate(cIdx)}>
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Certificate Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cert.title || ''}
                          onChange={(e) => updateCertificate(cIdx, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.775rem' }}>Issuer / Organization</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cert.issuer || ''}
                          onChange={(e) => updateCertificate(cIdx, 'issuer', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.775rem' }}>Details & Skills Covered</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cert.details || ''}
                        onChange={(e) => updateCertificate(cIdx, 'details', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)' }}>
                        Proof Link / Credential Verification URL
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. https://credential.example.com/certificate/123"
                        value={cert.credentialLink || ''}
                        onChange={(e) => updateCertificate(cIdx, 'credentialLink', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Status: {isAdminAuthenticated ? 'Admin CMS Unlocked' : 'Locked'}
          </span>
          <button className="btn btn-secondary" onClick={onClose}>Close Editor</button>
        </div>
      </div>
    </div>
  );
};

export default AdminCMSModal;
