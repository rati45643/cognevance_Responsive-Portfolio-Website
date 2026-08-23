import { getPortfolioContent, savePortfolioContent } from './db.js';

setTimeout(() => {
  getPortfolioContent((err, content) => {
    if (err || !content) {
      console.error('Fetch error:', err);
      process.exit(1);
    }

    if (Array.isArray(content.projectsData)) {
      content.projectsData = content.projectsData.map(p => {
        if (p.title && p.title.toLowerCase().includes('customer feedback')) {
          return {
            ...p,
            image: '/images/ai_customer_feedback.png'
          };
        }
        return p;
      });

      savePortfolioContent(content, (saveErr) => {
        if (saveErr) {
          console.error('Save error:', saveErr);
        } else {
          console.log('Successfully updated AI Customer Feedback image path to /images/ai_customer_feedback.png in SQLite database!');
        }
        process.exit(0);
      });
    }
  });
}, 500);
