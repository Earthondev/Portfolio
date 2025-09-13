// Enhanced Cache Busting Script
console.log('Enhanced cache busting script loaded at:', new Date().toISOString());

// หน้า case study: ไม่ต้องทำ cache bust สำหรับ JSON
const isCaseStudy = location.pathname.includes('/case-studies/');
if (isCaseStudy) {
  console.log('📄 Case Study page - skipping cache busting');
  return;
}

// Force reload of critical assets
const timestamp = Date.now();
const links = document.querySelectorAll('link[rel="stylesheet"]');
links.forEach(link => {
    if (link.href.includes('style.css')) {
        link.href = link.href + '?v=' + timestamp;
    }
});

// Force reload of script files - AGGRESSIVE CACHE BUSTING
const scripts = document.querySelectorAll('script[src]');
scripts.forEach(script => {
    if (script.src.includes('script.js')) {
        // Remove existing cache busting
        const baseUrl = script.src.split('?')[0];
        script.src = baseUrl + '?v=' + timestamp + '&force=' + Math.random();
    }
});

// Also force reload any cached script.js
if (window.scriptCacheBusted) {
    console.log('Script already cache busted, skipping...');
} else {
    window.scriptCacheBusted = true;
    console.log('Force cache busting script.js...');
}

// EMERGENCY: Force reload script.js if still using old version
setTimeout(() => {
    const oldScript = document.querySelector('script[src*="script.js"]');
    if (oldScript && oldScript.src.includes('script.js')) {
        console.log('🚨 EMERGENCY: Force reloading script.js...');
        const newScript = document.createElement('script');
        newScript.src = oldScript.src.split('?')[0] + '?v=' + Date.now() + '&emergency=' + Math.random();
        newScript.defer = true;
        document.head.appendChild(newScript);
        oldScript.remove();
    }
}, 100);

// NUCLEAR OPTION: Force reload ALL scripts
setTimeout(() => {
    console.log('💥 NUCLEAR: Force reloading ALL scripts...');
    const allScripts = document.querySelectorAll('script[src]');
    allScripts.forEach(script => {
        if (script.src.includes('script.js')) {
            const newScript = document.createElement('script');
            newScript.src = script.src.split('?')[0] + '?v=' + Date.now() + '&nuclear=' + Math.random();
            newScript.defer = true;
            document.head.appendChild(newScript);
            script.remove();
        }
    });
}, 200);

// ULTRA NUCLEAR: Force reload with different approach
setTimeout(() => {
    console.log('🚀 ULTRA NUCLEAR: Force reloading with different approach...');
    const scripts = document.querySelectorAll('script[src*="script.js"]');
    scripts.forEach(script => {
        const baseUrl = script.src.split('?')[0];
        const newScript = document.createElement('script');
        newScript.src = baseUrl + '?v=' + Date.now() + '&ultra=' + Math.random() + '&force=' + Math.random();
        newScript.defer = true;
        newScript.onload = () => {
            console.log('✅ New script loaded successfully');
            script.remove();
        };
        newScript.onerror = () => {
            console.error('❌ Failed to load new script');
        };
        document.head.appendChild(newScript);
    });
}, 500);

// EMERGENCY CACHE CLEAR: Force clear all cached versions
setTimeout(() => {
    console.log('🚨 EMERGENCY: Clearing all script.js cache...');
    
    // Remove ALL script.js references
    const allScripts = document.querySelectorAll('script[src*="script.js"]');
    allScripts.forEach(script => {
        console.log('🗑️ Removing old script:', script.src);
        script.remove();
    });
    
    // Add fresh script with unique timestamp
    const newScript = document.createElement('script');
    newScript.src = '/script.js?v=' + Date.now() + '&emergency=' + Math.random() + '&clear=' + Math.random();
    newScript.defer = true;
    newScript.onload = () => {
        console.log('🎉 EMERGENCY: Fresh script loaded successfully!');
    };
    newScript.onerror = () => {
        console.error('💥 EMERGENCY: Failed to load fresh script');
    };
    document.head.appendChild(newScript);
}, 1000);

// Force reload of JSON files and add cache headers
window.addEventListener('load', () => {
    console.log('Page loaded, checking for cached data...');
    
    // Note: JSON files are loaded via fetch() in script.js with cache busting
    // No preloading to avoid browser warnings
});

// Override fetch to add cache busting for JSON files - ใช้ absolute path เสมอ
// แต่ไม่ทำบนหน้า case study
if (!isCaseStudy) {
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        if (typeof url === 'string' && url.includes('.json')) {
            // --- helper: สร้าง URL แบบ absolute จากรากเว็บเสมอ ---
            const toAbs = (u) => new URL(u, location.origin).toString();
            const bust = (u) => `${toAbs(u)}?v=${Date.now()}`;
            
            // ถ้าเป็น relative path ให้แปลงเป็น absolute
            if (url.startsWith('./') || url.startsWith('../')) {
                url = toAbs(url);
            }
            
            const separator = url.includes('?') ? '&' : '?';
            url = url + separator + 'v=' + Date.now();
            console.log('Cache busting fetch for:', url);
        }
        return originalFetch(url, options);
    };
}
