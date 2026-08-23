import { getPortfolioContent, savePortfolioContent } from './db.js';
import {
  personalInfo as defaultPersonalInfo,
  skillsData as defaultSkillsData,
  projectsData as defaultProjectsData,
  experienceData as defaultExperienceData,
  certificatesData as defaultCertificatesData
} from '../src/data/portfolioData.js';

setTimeout(() => {
  getPortfolioContent((err, content) => {
    if (err) {
      console.error('Error fetching content:', err);
      process.exit(1);
    }

    const currentContent = content || {
      personalInfo: defaultPersonalInfo,
      skillsData: defaultSkillsData,
      projectsData: defaultProjectsData,
      experienceData: defaultExperienceData,
      certificatesData: defaultCertificatesData
    };

    if (Array.isArray(currentContent.projectsData)) {
      currentContent.projectsData = currentContent.projectsData.map(p => {
        if (p.id === 'ai-customer-feedback' || (p.title && p.title.toLowerCase().includes('customer feedback'))) {
          return {
            ...p,
            image: '/images/ai_customer_feedback.png'
          };
        }
        return p;
      });

      savePortfolioContent(currentContent, (saveErr) => {
        if (saveErr) {
          console.error('Error saving updated content:', saveErr);
        } else {
          console.log('Successfully updated AI Customer Feedback project image URL in portfolio.db!');
        }
        process.exit(0);
      });
    } else {
      console.log('projectsData is not an array.');
      process.exit(0);
    }
  });
}, 500);
