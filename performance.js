// Modern Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.init();
  }

  init() {
    // Core Web Vitals monitoring
    this.observeCLS();
    this.observeFID();
    this.observeLCP();
    this.observeFCP();
    this.observeTTFB();
  }

  // Cumulative Layout Shift
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          this.metrics.set('CLS', (this.metrics.get('CLS') || 0) + entry.value);
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('CLS', observer);
  }

  // First Input Delay
  observeFID() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.set('FID', entry.processingStart - entry.startTime);
      }
    });
    
    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('FID', observer);
  }

  // Largest Contentful Paint
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('LCP', observer);
  }

  // First Contentful Paint
  observeFCP() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('FCP', entry.startTime);
        }
      }
    });
    
    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('FCP', observer);
  }

  // Time to First Byte
  observeTTFB() {
    if (!('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.metrics.set('TTFB', entry.responseStart - entry.requestStart);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    this.observers.set('TTFB', observer);
  }

  // Get all metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Report metrics to console
  reportMetrics() {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Metrics');
    console.table(metrics);
    console.groupEnd();
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize performance monitoring
const perfMonitor = new PerformanceMonitor();

// Report metrics after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    perfMonitor.reportMetrics();
  }, 2000);
});

// Export for use in other scripts
window.PerformanceMonitor = PerformanceMonitor;
