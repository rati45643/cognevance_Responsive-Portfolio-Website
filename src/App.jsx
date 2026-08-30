import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MessagesModal from './components/MessagesModal';
import ResumeModal from './components/ResumeModal';
import AIChatbot from './components/AIChatbot';
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkillsData,
  projectsData as defaultProjectsData,
  experienceData as defaultExperienceData,
  certificatesData as defaultCertificatesData
} from './data/portfolioData';

function App() {
  const [theme, setTheme] = useState('dark');
  const [messages, setMessages] = useState([]);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Portfolio Content State
  const [portfolioContent, setPortfolioContent] = useState({
    personalInfo: defaultPersonalInfo,
    skillsData: defaultSkillsData,
    projectsData: defaultProjectsData,
    experienceData: defaultExperienceData,
    certificatesData: defaultCertificatesData
  });

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Fetch live portfolio content from Express API or local storage fallback
  const fetchPortfolioContent = async () => {
    try {
      const stored = localStorage.getItem('ratish_portfolio_content');
      if (stored) {
        setPortfolioContent(JSON.parse(stored));
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setPortfolioContent(data.content);
          try {
            localStorage.setItem('ratish_portfolio_content', JSON.stringify(data.content));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.log('Unable to fetch custom portfolio content from server, using default state:', err);
    }
  };

  // Fetch stored messages from Express SQLite API
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.log('Unable to connect to backend server or fetch messages:', err);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    fetchPortfolioContent();
    fetchMessages();
  }, []);

  return (
    <div className="app-main">
      {/* Background Glowing Canvas Orbs */}
      <div className="bg-glow-container">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
        <div className="glow-orb-3"></div>
      </div>

      {/* Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenMessages={() => {
          fetchMessages();
          setMessagesModalOpen(true);
        }}
        onOpenResume={() => setResumeModalOpen(true)}
        messageCount={messages.length}
        personalInfo={portfolioContent.personalInfo}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenResume={() => setResumeModalOpen(true)}
          personalInfo={portfolioContent.personalInfo}
        />
        <About personalInfo={portfolioContent.personalInfo} />
        <Skills skillsData={portfolioContent.skillsData} />
        <Projects projectsData={portfolioContent.projectsData} />
        <Experience
          experienceData={portfolioContent.experienceData}
          certificatesData={portfolioContent.certificatesData}
        />
        <Contact onMessageSubmitted={fetchMessages} />
      </main>

      {/* Footer */}
      <Footer personalInfo={portfolioContent.personalInfo} />

      {/* Modals & Drawers */}
      <MessagesModal
        isOpen={messagesModalOpen}
        onClose={() => setMessagesModalOpen(false)}
        messages={messages}
        onRefresh={fetchMessages}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        portfolioContent={portfolioContent}
      />

      {/* Personal AI Portfolio Assistant Widget */}
      <AIChatbot portfolioContent={portfolioContent} />
    </div>
  );
}

export default App;
