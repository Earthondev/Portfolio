// Cache busting script
console.log('Cache busting script loaded at:', new Date().toISOString());

// Force reload of critical assets
const timestamp = Date.now();
const links = document.querySelectorAll('link[rel="stylesheet"]');
links.forEach(link => {
    if (link.href.includes('style.css')) {
        link.href = link.href + '?v=' + timestamp;
    }
});

// Force reload of JSON files
window.addEventListener('load', () => {
    console.log('Page loaded, checking for cached data...');
});
