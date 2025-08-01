// Lazy Loading Manager for Phase 3 Performance
class LazyLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupUserInteractionLoading();
    this.setupDelayedLoading();
  }

  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const moduleName = element.dataset.lazyModule;
          
          if (moduleName) {
            this.loadModule(moduleName);
            observer.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe elements that should trigger module loading
    document.querySelectorAll('[data-lazy-module]').forEach(el => {
      observer.observe(el);
    });
  }

  setupUserInteractionLoading() {
    // Load contact form module on first form interaction
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.loadModule('contact-form');
      }
    }, { once: true });

    // Load advanced analytics on first meaningful interaction
    const meaningfulEvents = ['click', 'scroll', 'keydown'];
    const loadAnalytics = () => {
      this.loadModule('advanced-analytics');
      meaningfulEvents.forEach(event => {
        document.removeEventListener(event, loadAnalytics);
      });
    };

    meaningfulEvents.forEach(event => {
      document.addEventListener(event, loadAnalytics, { once: true, passive: true });
    });
  }

  setupDelayedLoading() {
    // Load non-critical modules after page load with delays
    window.addEventListener('load', () => {
      // Load analytics after 2 seconds
      setTimeout(() => this.loadModule('advanced-analytics'), 2000);
      
      // Load contact form after 3 seconds
      setTimeout(() => this.loadModule('contact-form'), 3000);
    });
  }

  async loadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      return;
    }

    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    const loadingPromise = this.doLoadModule(moduleName);
    this.loadingPromises.set(moduleName, loadingPromise);

    try {
      await loadingPromise;
      this.loadedModules.add(moduleName);
      // Module loaded successfully
    } catch (error) {
      // Module loading failed
    } finally {
      this.loadingPromises.delete(moduleName);
    }
  }

  async doLoadModule(moduleName) {
    switch (moduleName) {
      case 'contact-form':
        const { ContactForm } = await import('./modules/contact-form.js');
        new ContactForm();
        break;

      case 'advanced-analytics':
        const { AdvancedAnalytics } = await import('./modules/advanced-analytics.js');
        new AdvancedAnalytics();
        break;

      default:
        throw new Error(`Unknown module: ${moduleName}`);
    }
  }

  // Preload modules for better performance
  preloadModule(moduleName) {
    const moduleMap = {
      'contact-form': './modules/contact-form.js',
      'advanced-analytics': './modules/advanced-analytics.js'
    };

    const modulePath = moduleMap[moduleName];
    if (modulePath) {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = modulePath;
      document.head.appendChild(link);
    }
  }
}

// Initialize lazy loader
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();
});