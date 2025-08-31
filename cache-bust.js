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
    
    // Force reload JSON files with cache busting
    const jsonFiles = ['projects.json', 'services.json'];
    jsonFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = './' + file + '?v=' + timestamp;
        document.head.appendChild(link);
    });
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
