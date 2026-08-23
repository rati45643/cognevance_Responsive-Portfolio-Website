import { getPortfolioContent, savePortfolioContent } from './db.js';

setTimeout(async () => {
  try {
    const content = await getPortfolioContent();
    if (content && Array.isArray(content.projectsData)) {
      content.projectsData = content.projectsData.filter(p => {
        const titleLower = (p.title || '').toLowerCase();
        return p.id !== 'automation-testing-suite' && !titleLower.includes('automated web & api testing');
      });

      await savePortfolioContent(content);
      console.log('Successfully removed Automated Web & API Testing Suite from SQLite database portfolio.db!');
    }
  } catch (err) {
    console.error('Error removing project from DB:', err);
  }
  process.exit(0);
}, 500);
