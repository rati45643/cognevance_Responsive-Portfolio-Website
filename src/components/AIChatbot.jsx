import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, ChevronDown } from 'lucide-react';
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkillsData,
  projectsData as defaultProjectsData,
  experienceData as defaultExperienceData,
  certificatesData as defaultCertificatesData
} from '../data/portfolioData';

// Knowledge response engine grounded strictly in Ratish's portfolio
const generatePortfolioAIResponse = (query, content) => {
  const q = query.toLowerCase().trim();

  const info = content?.personalInfo || defaultPersonalInfo;
  const skills = content?.skillsData || defaultSkillsData;
  const projects = content?.projectsData || defaultProjectsData;
  const experience = content?.experienceData || defaultExperienceData;
  const certificates = content?.certificatesData || defaultCertificatesData;

  // 1. Skills & Tech Stack Queries
  if (
    q.includes('skill') || q.includes('technology') || q.includes('tech stack') ||
    q.includes('what can ratish do') || q.includes('programming') || q.includes('language') ||
    q.includes('framework') || q.includes('react') || q.includes('kotlin') || q.includes('node') ||
    q.includes('testing') || q.includes('playwright') || q.includes('database') || q.includes('sql')
  ) {
    const formattedCategories = skills.map(cat => {
      const listStr = Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills;
      return `🔹 **${cat.category}:** ${listStr}`;
    }).join('\n');

    return `Here is a summary of **Ratish Kannur's Technical Skills Toolkit**:\n\n${formattedCategories}\n\nRatish is proficient across Full Stack Engineering (MERN), Native Android (Kotlin + Jetpack Compose), Automated Testing (Playwright), and AI Integration.`;
  }

  // 2. Projects & Portfolio Queries
  if (
    q.includes('project') || q.includes('portfolio') || q.includes('build') ||
    q.includes('ats') || q.includes('feedback') || q.includes('summarizer') ||
    q.includes('interview') || q.includes('travel') || q.includes('app') || q.includes('case study')
  ) {
    const projectSummaries = projects.map((p, idx) => {
      const techStr = Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies;
      return `${idx + 1}. 🚀 **${p.title}** (${p.category})\n   • ${p.description}\n   • **Tech Stack:** ${techStr}`;
    }).join('\n\n');

    return `Ratish has engineered several high-impact projects:\n\n${projectSummaries}\n\nYou can click on any project card in the Portfolio section to inspect live demo links and source code repositories!`;
  }

  // 3. Education & CGPA Queries
  if (
    q.includes('education') || q.includes('college') || q.includes('degree') ||
    q.includes('cgpa') || q.includes('marks') || q.includes('university') ||
    q.includes('aps') || q.includes('study') || q.includes('graduation')
  ) {
    const edu = info.education || defaultPersonalInfo.education;
    return `🎓 **Education Background for Ratish Kannur:**\n\n• **Degree:** ${edu.degree}\n• **Institution:** ${edu.institution}\n• **Period:** ${edu.period}\n• **Academic CGPA:** **${edu.cgpa}**\n\nRatish maintains an outstanding academic standing with an 8.6 / 10.0 CGPA in Information Science & Engineering.`;
  }

  // 4. Internship & Work Experience Queries
  if (
    q.includes('experience') || q.includes('internship') || q.includes('work') ||
    q.includes('mind matrix') || q.includes('job') || q.includes('company') || q.includes('role')
  ) {
    const expSummaries = experience.map(exp => {
      const descStr = Array.isArray(exp.description) ? exp.description.join(' ') : exp.description;
      return `💼 **${exp.role}** at **${exp.company}** (${exp.period})\n• **Location:** ${exp.location}\n• **Key Highlights:** ${descStr}`;
    }).join('\n\n');

    return `Here is Ratish's professional internship background:\n\n${expSummaries}`;
  }

  // 5. Certifications & Proof Links Queries
  if (
    q.includes('certificate') || q.includes('certification') || q.includes('proof') ||
    q.includes('cyber suraksha') || q.includes('mern cert') || q.includes('analytics') || q.includes('tcs')
  ) {
    const certSummaries = certificates.map(c => `📜 **${c.title}** (${c.issuer})\n   ${c.details}`).join('\n\n');

    return `Ratish holds several recognized professional certifications:\n\n${certSummaries}\n\nAll certificates include verifiable proof links in the Experience & Certifications section!`;
  }

  // 6. Contact & Hiring Queries
  if (
    q.includes('contact') || q.includes('email') || q.includes('phone') ||
    q.includes('reach') || q.includes('hire') || q.includes('location') ||
    q.includes('address') || q.includes('bengaluru') || q.includes('linkedin') || q.includes('github')
  ) {
    return `📬 **Contact Information for Ratish Kannur:**\n\n• **Email:** [${info.email}](mailto:${info.email})\n• **Phone:** ${info.phone}\n• **Location:** ${info.location}\n• **GitHub:** [${info.github}](${info.github})\n• **LinkedIn:** [${info.linkedin}](${info.linkedin})\n\nYou can also use the **Contact Me** form on this website to send a direct email message!`;
  }

  // 7. Resume Queries
  if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
    return `📄 You can view and download Ratish's complete updated resume anytime by clicking the **"Resume"** button in the top navigation bar or Hero section! It offers printable HTML/PDF views and raw markdown downloads.`;
  }

  // 8. General Greetings / Who is Ratish
  if (
    q.includes('hi') || q.includes('hello') || q.includes('hey') ||
    q.includes('who is ratish') || q.includes('who are you') || q.includes('about')
  ) {
    return `Hello! 👋 I am **Ratish Kannur's Personal AI Portfolio Assistant**.\n\n${info.bio}\n\nFeel free to ask me questions like:\n• *"What are Ratish's key skills?"*\n• *"Tell me about his featured projects"*\n• *"What is his CGPA & education background?"*\n• *"How can I contact Ratish?"*`;
  }

  // 9. Out of Scope / Fallback Handler
  return `I am Ratish Kannur's Personal AI Assistant 🤖. I am specialized strictly in answering questions about Ratish's portfolio, technical skills, projects, education, internship experience, and contact details!\n\nPlease ask me anything related to Ratish (e.g. *"What are his skills?"*, *"Tell me about his projects"*, or *"How can I contact him?"*).`;
};

const AIChatbot = ({ portfolioContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! 👋 I'm Ratish Kannur's Personal AI Assistant. Ask me anything about Ratish's skills, projects, education, or work experience!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking & response generation
    setTimeout(() => {
      const botResponseText = generatePortfolioAIResponse(text, portfolioContent);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  const handleRefreshChat = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: "Chat refreshed & re-synced! 👋 Ask me anything about Ratish Kannur's skills, projects, education, or experience."
        }
      ]);
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 180,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease'
        }}
        className="ai-bot-float-btn"
        title="Chat with Ratish's AI Portfolio Assistant"
      >
        {isOpen ? <ChevronDown size={26} /> : <Bot size={28} />}
        <span className="pulse-dot" style={{ position: 'absolute', top: '2px', right: '2px', width: '12px', height: '12px' }}></span>
      </button>

      {/* Chatbot Glassmorphic Window */}
      {isOpen && (
        <div className="ai-chatbot-window">
          {/* Chat Header */}
          <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Ratish AI Assistant
                  <Sparkles size={14} style={{ color: 'var(--accent-pink)' }} />
                </h4>
                <span style={{ fontSize: '0.725rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></span>
                  Online & Portfolio Grounded
                </span>
              </div>
            </div>

            {/* Action Buttons: Refresh Chat & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleRefreshChat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.65rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Refresh AI Chat & Re-sync Content"
              >
                <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Close Chat Window"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages List */}
          <div style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
                    <Bot size={15} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '82%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0, marginTop: '2px' }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', paddingLeft: '2rem' }}>
                <span>AI Assistant is thinking...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.4rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {[
              "What are Ratish's skills?",
              "Tell me about his projects",
              "Education & CGPA?",
              "Mind Matrix internship?",
              "Contact info?"
            ].map((promptText, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleQuickPrompt(promptText)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.725rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                💡 {promptText}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Ask me about Ratish's skills, projects..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-sm)' }}
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
