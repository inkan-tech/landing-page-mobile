/**
 * Core Web Vitals Measurement
 * Tracks LCP, FID, CLS, INP, FCP, TTFB and sends to analytics
 */

// Web Vitals monitoring
function vitals(name, value, id) {
  // Core Web Vital measured
  // Send to Matomo if available
  if (typeof _paq !== 'undefined') {
    _paq.push(['trackEvent', 'Web Vitals', name, id, Math.round(value)]);
  }
  // Fallback to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(value),
      non_interaction: true,
    });
  }
}

// Measure LCP, FID, CLS
if ('web-vital' in window || 'requestIdleCallback' in window) {
  import('https://unpkg.com/web-vitals@3/dist/web-vitals.js')
    .then(({onCLS, onFID, onLCP, onINP, onFCP, onTTFB}) => {
      onCLS(vitals);
      onFID(vitals);
      onLCP(vitals);
      onINP(vitals);
      onFCP(vitals);
      onTTFB(vitals);
    })
    .catch(err => {/* Web Vitals not loaded */});
}