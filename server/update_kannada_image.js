import { getPortfolioContent, savePortfolioContent } from './db.js';

setTimeout(async () => {
  try {
    const content = await getPortfolioContent();
    if (content && Array.isArray(content.projectsData)) {
      content.projectsData = content.projectsData.map(p => {
        const titleLower = p.title ? p.title.toLowerCase() : '';
        if (titleLower.includes('kannada') || titleLower.includes('summarization')) {
          return {
            ...p,
            image: '/images/kannada_summarizer.png'
          };
        }
        return p;
      });

      await savePortfolioContent(content);
      console.log('Successfully updated Kannada Text Summarization image in SQLite DB!');
    }
  } catch (err) {
    console.error('Error updating Kannada image:', err);
  }
  process.exit(0);
}, 500);
