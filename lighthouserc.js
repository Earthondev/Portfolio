module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8000'],
      numberOfRuns: 3,
    },
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        
        // Specific performance audits - more lenient for portfolio
        'total-byte-weight': ['warn', { maxLength: 0 }], // Allow some large payloads
        'unminified-css': ['warn', { maxLength: 0 }], // Allow unminified CSS for development
        'unminified-javascript': ['warn', { maxLength: 0 }], // Allow unminified JS for development
        'unused-css-rules': ['warn', { maxLength: 0 }], // Allow some unused CSS
        'uses-responsive-images': ['warn', { maxLength: 0 }], // Allow some non-responsive images
        'uses-text-compression': ['warn', { maxLength: 0 }], // Allow uncompressed text
        
        // PWA audits - disable for portfolio site
        'installable-manifest': 'off',
        'maskable-icon': 'off', 
        'service-worker': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',
        
        // Accessibility - focus on critical issues
        'color-contrast': ['warn', { minScore: 0.8 }], // Allow some contrast issues
        'tap-targets': ['warn', { minScore: 0.8 }], // Allow some small tap targets
        
        // Best practices - focus on security
        'csp-xss': ['warn', { minScore: 0.8 }], // Allow some CSP issues
        'errors-in-console': ['warn', { minScore: 0.8 }], // Allow some console errors
        
        // Performance - allow some animations
        'non-composited-animations': ['warn', { maxLength: 0 }], // Allow some animations
        
        // Modern formats - warnings only
        'modern-image-formats': 'warn',
        'uses-long-cache-ttl': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
