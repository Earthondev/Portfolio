// Simple Cache Busting Script
console.log('Cache busting script loaded at:', new Date().toISOString());

// Check if this is a case study page
const isCaseStudyPage = location.pathname.includes('/case-studies/');

if (isCaseStudyPage) {
  console.log('📄 Case Study page - skipping cache busting');
} else {
  // Simple cache busting for critical assets
  const timestamp = Date.now();
  
  // Force reload of CSS
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
      if (link.href.includes('style.css')) {
          link.href = link.href.split('?')[0] + '?v=' + timestamp;
      }
  });

  // Force reload of main script
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
      if (script.src.includes('script.js')) {
          const baseUrl = script.src.split('?')[0];
          script.src = baseUrl + '?v=' + timestamp;
      }
  });

  console.log('✅ Cache busting applied');
}
