/**
 * Service Worker Registration
 * Registers the service worker for offline functionality and caching
 */

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        // ServiceWorker registration successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function(err) {
        // ServiceWorker registration failed
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}