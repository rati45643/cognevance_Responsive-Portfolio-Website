import { getPortfolioContent, savePortfolioContent } from './db.js';

setTimeout(async () => {
  try {
    const content = await getPortfolioContent();
    if (content && Array.isArray(content.projectsData)) {
      content.projectsData = content.projectsData.map(p => {
        const titleLower = p.title ? p.title.toLowerCase() : '';
        if (titleLower.includes('mock') || titleLower.includes('interview')) {
          return {
            ...p,
            title: 'AI Mock Interview Platform (Interview Pro)',
            image: '/images/interview_pro.png'
          };
        } else if (titleLower.includes('portfolio')) {
          return {
            ...p,
            title: 'Responsive Portfolio Website',
            image: '/images/portfolio_website_preview.png'
          };
        } else if (titleLower.includes('feedback') || titleLower.includes('customer')) {
          return {
            ...p,
            title: 'AI Customer Feedback Platform (Project Loop)',
            image: '/images/ai_customer_feedback.png'
          };
        }
        return p;
      });

      await savePortfolioContent(content);
      console.log('Successfully updated all project images in SQLite DB!');
    }
  } catch (err) {
    console.error('Error updating project images:', err);
  }
  process.exit(0);
}, 500);
