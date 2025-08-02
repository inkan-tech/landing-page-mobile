//
// Japanese Inkan-Inspired Theme Manager
// Handles light/dark theme switching with localStorage persistence
//

class ThemeManager {
  constructor() {
    this.currentTheme = this.getInitialTheme();
    this.initializeTheme();
    this.bindEvents();
    console.log('✅ Module loaded: Theme Manager');
  }
  
  /**
   * Determines the initial theme based on localStorage or system preference
   */
  getInitialTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('sealfie-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light theme
    return 'light';
  }
  
  /**
   * Initializes the theme on page load
   */
  initializeTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeToggleStates();
    this.trackThemeAnalytics('initialize', this.currentTheme);
  }
  
  /**
   * Toggles between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    this.trackThemeAnalytics('toggle', newTheme);
  }
  
  /**
   * Sets a specific theme
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn('Invalid theme:', theme);
      return;
    }
    
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sealfie-theme', theme);
    this.updateThemeToggleStates();
    
    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { 
        theme: theme,
        previousTheme: this.currentTheme === 'light' ? 'dark' : 'light'
      }
    }));
  }
  
  /**
   * Updates all theme toggle buttons to reflect current state
   */
  updateThemeToggleStates() {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      const isDark = this.currentTheme === 'dark';
      
      // Update aria-label for accessibility
      toggle.setAttribute('aria-label', 
        `Switch to ${isDark ? 'light' : 'dark'} theme`
      );
      
      // Update toggle state for CSS styling
      toggle.setAttribute('data-theme', this.currentTheme);
      
      // Update icon visibility
      const lightIcon = toggle.querySelector('.theme-icon.light');
      const darkIcon = toggle.querySelector('.theme-icon.dark');
      
      if (lightIcon && darkIcon) {
        lightIcon.style.display = isDark ? 'block' : 'none';
        darkIcon.style.display = isDark ? 'none' : 'block';
      }
    });
  }
  
  /**
   * Binds event listeners for theme switching
   */
  bindEvents() {
    // Handle theme toggle button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) {
        e.preventDefault();
        this.toggleTheme();
      }
    });
    
    // Handle keyboard navigation for theme toggle
    document.addEventListener('keydown', (e) => {
      const toggle = e.target.closest('.theme-toggle');
      if (toggle && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        this.toggleTheme();
      }
    });
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('sealfie-theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
    
    // Listen for storage changes (theme changed in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'sealfie-theme' && e.newValue) {
        this.setTheme(e.newValue);
      }
    });
  }
  
  /**
   * Tracks theme usage analytics
   * @param {string} action - 'initialize', 'toggle', 'system_change'
   * @param {string} theme - Current theme
   */
  trackThemeAnalytics(action, theme) {
    // Track with Matomo if available
    if (typeof _paq !== 'undefined') {
      _paq.push(['trackEvent', 'Theme', action, theme]);
    }
    
    // Custom analytics event
    window.dispatchEvent(new CustomEvent('analyticsEvent', {
      detail: {
        category: 'Theme',
        action: action,
        label: theme,
        nonInteraction: action === 'initialize'
      }
    }));
  }
  
  /**
   * Gets the current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Checks if dark theme is active
   * @returns {boolean} True if dark theme is active
   */
  isDarkTheme() {
    return this.currentTheme === 'dark';
  }
}

// Export for module usage
export { ThemeManager };

// Global initialization for non-module environments
window.ThemeManager = ThemeManager;