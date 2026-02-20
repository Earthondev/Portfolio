// Simple Cache Busting Script
const isCaseStudyPage = location.pathname.includes('/case-studies/');

if (!isCaseStudyPage) {
  // Simple cache busting for critical assets
  const timestamp = Date.now();
  
  // Force reload of CSS
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
      if (link.href.includes('style.css')) {
          link.href = link.href.split('?')[0] + '?v=' + timestamp;
      }
  });
}
