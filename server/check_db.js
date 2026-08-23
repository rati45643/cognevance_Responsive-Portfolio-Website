import { getPortfolioContent } from './db.js';

setTimeout(() => {
  getPortfolioContent((err, content) => {
    if (err) {
      console.error(err);
    } else {
      console.log('DB Content projectsData:', JSON.stringify(content?.projectsData, null, 2));
    }
    process.exit(0);
  });
}, 500);
