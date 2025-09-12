// Enhanced Cache Busting Script
console.log('Enhanced cache busting script loaded at:', new Date().toISOString());

// Force reload of critical assets
const timestamp = Date.now();
const links = document.querySelectorAll('link[rel="stylesheet"]');
links.forEach(link => {
    if (link.href.includes('style.css')) {
        link.href = link.href + '?v=' + timestamp;
    }
});

// Force reload of JSON files and add cache headers
window.addEventListener('load', () => {
    console.log('Page loaded, checking for cached data...');
    
    // Note: JSON files are loaded via fetch() in script.js with cache busting
    // No need for preload links as they cause warnings
});

// Override fetch to add cache busting for JSON files
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    if (typeof url === 'string' && url.includes('.json')) {
        const separator = url.includes('?') ? '&' : '?';
        url = url + separator + 'v=' + Date.now();
        console.log('Cache busting fetch for:', url);
    }
    return originalFetch(url, options);
};
