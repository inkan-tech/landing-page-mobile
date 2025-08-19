/**
 * Enhanced Performance Monitoring with Core Web Vitals
 * Tracks LCP, FID, CLS and other critical metrics for Japanese landing page
 */

// Core Web Vitals tracking
function trackCoreWebVitals() {
  // Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const lcpValue = Math.round(lastEntry.startTime);
    
    // Send to Matomo
    if (typeof _paq !== 'undefined') {
      _paq.push(['trackEvent', 'Core Web Vitals', 'LCP', 'Value', lcpValue]);
      _paq.push(['setCustomVariable', 1, 'LCP', lcpValue.toString(), 'page']);
    }
    
    console.log('LCP:', lcpValue + 'ms');
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const fidValue = Math.round(entry.processingStart - entry.startTime);
      
      if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', 'Core Web Vitals', 'FID', 'Value', fidValue]);
        _paq.push(['setCustomVariable', 2, 'FID', fidValue.toString(), 'page']);
      }
      
      console.log('FID:', fidValue + 'ms');
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    
    // Send final CLS on page unload
    window.addEventListener('beforeunload', () => {
      const clsScore = Math.round(clsValue * 1000); // Convert to score * 1000
      
      if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', 'Core Web Vitals', 'CLS', 'Value', clsScore]);
        _paq.push(['setCustomVariable', 3, 'CLS', clsScore.toString(), 'page']);
      }
      
      console.log('CLS:', clsValue.toFixed(3));
    });
  }).observe({ entryTypes: ['layout-shift'] });
}

// First Contentful Paint (FCP)
function trackFCP() {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        const fcpValue = Math.round(entry.startTime);
        
        if (typeof _paq !== 'undefined') {
          _paq.push(['trackEvent', 'Performance', 'FCP', 'Value', fcpValue]);
          _paq.push(['setCustomVariable', 4, 'FCP', fcpValue.toString(), 'page']);
        }
        
        console.log('FCP:', fcpValue + 'ms');
      }
    });
  }).observe({ entryTypes: ['paint'] });
}

// Japanese Design Performance Metrics
function trackJapaneseDesignMetrics() {
  window.addEventListener('load', () => {
    // Time to Interactive (TTI) estimation
    const perfData = window.performance.timing;
    const ttiValue = perfData.domInteractive - perfData.navigationStart;
    
    // Page Load Time
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // Japanese asset loading (video demos, optimized images)
    const videoLoadStart = performance.now();
    const videos = document.querySelectorAll('video, .video-timer-container');
    
    if (videos.length > 0) {
      const videoLoadTime = performance.now() - videoLoadStart;
      
      if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent', 'Japanese Design', 'Video Assets Load', 'Time', Math.round(videoLoadTime)]);
      }
    }
    
    // Track Tailwind v4 performance (Bootstrap-free)
    const cssLoadTime = performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('.css'))
      .reduce((total, entry) => total + entry.duration, 0);
    
    if (typeof _paq !== 'undefined') {
      _paq.push(['trackEvent', 'Performance', 'Total CSS Load', 'Time', Math.round(cssLoadTime)]);
      _paq.push(['trackEvent', 'Performance', 'Page Load Time', 'Total', pageLoadTime]);
      _paq.push(['trackEvent', 'Performance', 'TTI Estimate', 'Value', ttiValue]);
      
      // Track Japanese design system usage
      _paq.push(['setCustomVariable', 5, 'Design System', 'Japanese Tailwind v4', 'page']);
    }
    
    console.log('Japanese Landing Performance:', {
      pageLoad: pageLoadTime + 'ms',
      tti: ttiValue + 'ms',
      cssLoad: Math.round(cssLoadTime) + 'ms'
    });
  });
}

// Enhanced error tracking for Japanese components
function trackJapaneseComponentErrors() {
  window.addEventListener('error', (event) => {
    const isJapaneseComponent = event.filename && (
      event.filename.includes('tailwind') ||
      event.filename.includes('japanese') ||
      event.filename.includes('ma-spacing') ||
      event.filename.includes('shu-') ||
      event.filename.includes('enji-') ||
      event.filename.includes('sango-')
    );
    
    if (isJapaneseComponent && typeof _paq !== 'undefined') {
      _paq.push(['trackEvent', 'Japanese Design Error', event.message, event.filename + ':' + event.lineno]);
    }
  });
}

// Initialize all tracking
document.addEventListener('DOMContentLoaded', () => {
  // Only track if performance API is supported
  if ('PerformanceObserver' in window) {
    trackCoreWebVitals();
    trackFCP();
  }
  
  trackJapaneseDesignMetrics();
  trackJapaneseComponentErrors();
});