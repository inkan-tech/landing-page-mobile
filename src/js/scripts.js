//
// Scripts
//

//
// Japanese Inkan-Inspired Light Theme Manager
// Initializes the light theme styling
//

class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.initializeTheme();
    console.log('✅ Module loaded: Japanese Inkan Theme (Light Mode)');
  }
  
  /**
   * Initializes the light theme on page load
   */
  initializeTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Track theme initialization with analytics
    if (typeof _paq !== 'undefined') {
      _paq.push(['trackEvent', 'Theme', 'initialize', 'light']);
    }
  }
  
  /**
   * Gets the current theme (always light)
   * @returns {string} Current theme ('light')
   */
  getCurrentTheme() {
    return 'light';
  }
  
  /**
   * Checks if dark theme is active (always false)
   * @returns {boolean} Always false (light theme only)
   */
  isDarkTheme() {
    return false;
  }
}

window.addEventListener('DOMContentLoaded', event => {

    // Initialize Japanese Inkan-inspired theme system
    const themeManager = new ThemeManager();
    
    // Make theme manager globally accessible
    window.sealfieTheme = themeManager;

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

//
// Matomo scripts
//

var _paq = window._paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u="https://sealfie.matomo.cloud/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '1']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://cdn.matomo.cloud/sealfie.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
})();


var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.async=true; g.src='https://cdn.matomo.cloud/sealfie.matomo.cloud/container_5gw1cTb8.js'; s.parentNode.insertBefore(g,s);

