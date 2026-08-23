import React, { useState } from 'react';
import { Sun, Moon, Database, FileText, Menu, X, Edit3, Shield } from 'lucide-react';
import { personalInfo as defaultInfo } from '../data/portfolioData';

const Navbar = ({ theme, toggleTheme, onOpenMessages, onOpenResume, onOpenCMS, messageCount, personalInfo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const info = personalInfo || defaultInfo;

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setActiveSection(href.substring(1));
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar glass-card">
      <a href="#home" className="nav-brand" onClick={() => handleNavClick('#home')}>
        <div className="nav-logo-icon">RK</div>
        <span>{info.name}</span>
      </a>

      {/* Desktop Nav */}
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className={`nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`}
              onClick={() => handleNavClick(link.href)}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Edit Page / Admin CMS Button */}
        <button
          className="btn btn-secondary"
          onClick={onOpenCMS}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', color: 'var(--accent-pink)', borderColor: 'rgba(236, 72, 153, 0.4)' }}
          title="Open Full Page CMS Editor (Password Protected)"
        >
          <Edit3 size={15} />
          <span>Edit Page</span>
        </button>

        {/* Database Inquiries Modal Button */}
        <button
          className="btn btn-secondary"
          onClick={onOpenMessages}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          title="Inspect stored database messages"
        >
          <Database size={15} />
          <span>DB Messages</span>
          {messageCount > 0 && (
            <span style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: '99px',
              padding: '0.1rem 0.45rem',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              {messageCount}
            </span>
          )}
        </button>

        {/* Resume Button */}
        <button
          className="btn btn-primary"
          onClick={onOpenResume}
          style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
        >
          <FileText size={15} />
          <span>Resume</span>
        </button>

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          marginTop: '0.75rem',
          padding: '1.25rem',
          boxShadow: 'var(--glass-shadow)',
          zIndex: 150
        }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="nav-link"
                  style={{ fontSize: '1.1rem', display: 'block' }}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
