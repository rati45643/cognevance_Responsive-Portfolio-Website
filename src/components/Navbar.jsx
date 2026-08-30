import React, { useState } from 'react';
import { Sun, Moon, Database, FileText, Menu, X } from 'lucide-react';
import { personalInfo as defaultInfo } from '../data/portfolioData';

const Navbar = ({ theme, toggleTheme, onOpenMessages, onOpenResume, messageCount, personalInfo }) => {
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
    <>
      <header className="navbar glass-card">
        <a href="#home" className="nav-brand" onClick={() => handleNavClick('#home')}>
          <div className="nav-logo-icon">RK</div>
          <span>{info.name}</span>
        </a>

        {/* Desktop Nav Links */}
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

        {/* Header Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Database Inquiries Button (Desktop) */}
          <button
            className="btn btn-secondary nav-action-btn desktop-only-action"
            onClick={onOpenMessages}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            title="Inspect stored database messages"
          >
            <Database size={15} />
            <span>DB Messages</span>
            {messageCount > 0 && (
              <span className="msg-badge">
                {messageCount}
              </span>
            )}
          </button>

          {/* Resume Button (Desktop) */}
          <button
            className="btn btn-primary nav-action-btn desktop-only-action"
            onClick={onOpenResume}
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
          >
            <FileText size={15} />
            <span>Resume</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="nav-brand">
                <div className="nav-logo-icon">RK</div>
                <span>{info.name}</span>
              </div>
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`mobile-nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`}
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mobile-drawer-actions">
              <button
                className="btn btn-secondary mobile-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMessages();
                }}
              >
                <Database size={16} />
                <span>DB Messages</span>
                {messageCount > 0 && (
                  <span className="msg-badge">
                    {messageCount}
                  </span>
                )}
              </button>

              <button
                className="btn btn-primary mobile-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
              >
                <FileText size={16} />
                <span>View Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
