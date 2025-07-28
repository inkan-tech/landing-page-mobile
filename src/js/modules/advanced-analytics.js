// Advanced Analytics Module - Lazy loaded
export class AdvancedAnalytics {
  constructor() {
    this.events = [];
    this.init();
  }

  init() {
    this.setupScrollTracking();
    this.setupEngagementTracking();
    this.setupConversionTracking();
  }

  setupScrollTracking() {
    let scrollDepths = [25, 50, 75, 90];
    let tracked = [];

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !tracked.includes(depth)) {
          tracked.push(depth);
          this.trackEvent('scroll_depth', {
            depth: depth,
            page: window.location.pathname
          });
        }
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          trackScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupEngagementTracking() {
    // Track video interactions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.video-timer-container, .youtube-timer-load')) {
        this.trackEvent('video_interaction', {
          type: 'play',
          element: e.target.closest('[data-video], [data-video-id]')?.dataset.video || 'youtube'
        });
      }
    });

    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('time_on_page', { seconds: timeOnPage });
    });
  }

  setupConversionTracking() {
    // Track app store clicks
    document.addEventListener('click', (e) => {
      const appStoreLink = e.target.closest('a[href*="play.google.com"], a[href*="apps.apple.com"]');
      if (appStoreLink) {
        const store = appStoreLink.href.includes('play.google.com') ? 'google_play' : 'app_store';
        this.trackEvent('app_download_intent', { store });
      }
    });

    // Track email clicks
    document.addEventListener('click', (e) => {
      const emailLink = e.target.closest('a[href^="mailto:"]');
      if (emailLink) {
        this.trackEvent('contact_intent', { method: 'email' });
      }
    });
  }

  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      url: window.location.href,
      ...data
    };

    this.events.push(event);

    // Send to Matomo if available
    if (typeof _paq !== 'undefined') {
      const category = data.category || 'User Engagement';
      const action = eventName;
      const name = data.name || data.element || data.store || '';
      const value = data.value || data.seconds || data.depth || null;
      
      if (value !== null) {
        _paq.push(['trackEvent', category, action, name, value]);
      } else {
        _paq.push(['trackEvent', category, action, name]);
      }
    }

    // Fallback to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }

    // Store locally for offline analysis
    this.storeEventLocally(event);
  }

  storeEventLocally(event) {
    try {
      const events = JSON.parse(localStorage.getItem('sealfie_analytics') || '[]');
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('sealfie_analytics', JSON.stringify(events));
    } catch (e) {
      console.warn('Could not store analytics event locally:', e);
    }
  }

  getStoredEvents() {
    try {
      return JSON.parse(localStorage.getItem('sealfie_analytics') || '[]');
    } catch (e) {
      return [];
    }
  }
}