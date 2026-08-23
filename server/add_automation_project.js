import { getPortfolioContent, savePortfolioContent } from './db.js';
import { projectsData as defaultProjects } from '../src/data/portfolioData.js';

setTimeout(async () => {
  try {
    const content = await getPortfolioContent();
    if (content) {
      let projects = Array.isArray(content.projectsData) ? content.projectsData : [];
      
      const exists = projects.some(p => p.id === 'automation-testing-suite' || (p.title && p.title.toLowerCase().includes('automation')));
      if (!exists) {
        const autoProject = defaultProjects.find(p => p.id === 'automation-testing-suite');
        if (autoProject) {
          projects.unshift(autoProject);
        }
      }

      content.projectsData = projects;
      await savePortfolioContent(content);
      console.log('Successfully added Automation Testing Suite to SQLite database portfolio.db!');
    }
  } catch (err) {
    console.error('Error updating DB:', err);
  }
  process.exit(0);
}, 500);
