import { getPortfolioContent, savePortfolioContent } from './db.js';

setTimeout(async () => {
  try {
    const content = await getPortfolioContent();
    if (content && Array.isArray(content.projectsData)) {
      let foundMskr = false;
      content.projectsData = content.projectsData.map(p => {
        const titleLower = p.title ? p.title.toLowerCase() : '';
        if (titleLower.includes('mskr resort') || titleLower.includes('resort')) {
          foundMskr = true;
          return {
            ...p,
            title: 'MSKR Resort Booking Platform',
            image: '/images/mskr_resort.jpg'
          };
        } else if (titleLower.includes('santhe')) {
          return {
            ...p,
            title: 'Santhe-Connect Karnataka Marketplace',
            image: '/images/santhe_connect.jpg'
          };
        } else if (titleLower.includes('travel planner') || titleLower.includes('travel')) {
          return {
            ...p,
            title: 'MSKR AI Travel Planner Mobile App',
            image: '/images/mskr_travel_planner.jpg'
          };
        }
        return p;
      });

      // If MSKR Resort project card wasn't full, add/update it
      if (!foundMskr) {
        content.projectsData.push({
          id: 'mskr-resort',
          title: 'MSKR Resort Booking Platform',
          category: 'Fullstack',
          badge: 'Web App',
          description: 'Luxury resort booking and services digital platform. Allows guests to book luxury rooms, order dining/food, and access resort amenities with seamless mobile experience.',
          technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'CSS Modules'],
          image: '/images/mskr_resort.jpg',
          githubLink: 'https://github.com/rati45643',
          liveLink: 'https://github.com/rati45643',
          credentialLink: 'https://github.com/rati45643',
          highlights: ['Luxury room booking system', 'In-room food ordering API', 'Interactive resort amenities guide']
        });
      }

      await savePortfolioContent(content);
      console.log('Successfully updated MSKR Resort, Santhe Connect, and MSKR Travel Planner project images in SQLite DB!');
    }
  } catch (err) {
    console.error('Error updating project images:', err);
  }
  process.exit(0);
}, 500);
