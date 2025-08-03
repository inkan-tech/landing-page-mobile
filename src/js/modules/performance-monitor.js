/**
 * Performance Monitoring for Matomo
 * Tracks page load times and sends to analytics
 */

window.addEventListener('load', () => {
  // Performance metrics
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

  // Send to Matomo
  if (typeof _paq !== 'undefined') {
    _paq.push(['trackEvent', 'Performance', 'Page Load Time', 'Total', pageLoadTime]);
  }
});