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

    // Initialize BEC Trends Carousel
    initializeBECCarousel();

    // Mobile navigation setup (Tailwind-based)
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const navbarCollapse = document.body.querySelector('#navbarResponsive');
    
    console.log('✅ Navbar elements found (Bootstrap-free):', {
        toggler: !!navbarToggler,
        collapse: !!navbarCollapse,
        framework: 'Tailwind v4'
    });

    // Mobile navigation toggle handler (replacing Bootstrap collapse)
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function(e) {
            console.log('Mobile menu button clicked');
            const isOpen = navbarCollapse.classList.contains('show');
            
            if (isOpen) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            } else {
                navbarCollapse.classList.add('show');
                navbarToggler.setAttribute('aria-expanded', 'true');
            }
            
            console.log('Mobile menu toggled:', !isOpen ? 'opened' : 'closed');
        });
    }

    // Collapse responsive navbar when toggler is visible
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
// BEC Trends Carousel - Threat Intelligence Display
//

class BECCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = element.querySelector('.carousel-track');
    this.slides = element.querySelectorAll('.carousel-slide');
    this.prevButton = element.querySelector('.carousel-prev');
    this.nextButton = element.querySelector('.carousel-next');
    this.indicators = element.querySelectorAll('.indicator');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.isAutoAdvancing = true;
    this.autoAdvanceInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoAdvanceDelay = 4000; // 4 seconds between slides
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoAdvance();
    
    // Pause auto-advance on user interaction, resume after delay
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoAdvance());
    this.carousel.addEventListener('mouseleave', () => this.resumeAutoAdvance());
    
    // Handle window resize to update carousel layout
    this.resizeHandler = () => {
      this.updateCarousel();
    };
    window.addEventListener('resize', this.resizeHandler);
  }
  
  setupEventListeners() {
    // Button controls
    this.prevButton?.addEventListener('click', () => this.previousSlide());
    this.nextButton?.addEventListener('click', () => this.nextSlide());
    
    // Indicator controls
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch/swipe support
    this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Intersection Observer for performance
    this.setupIntersectionObserver();
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.resumeAutoAdvance();
        } else {
          this.pauseAutoAdvance();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.carousel);
  }
  
  updateCarousel() {
    // For single card display, translate by 100% per slide
    const translateX = -this.currentSlide * 100;
    
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update active slide
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update button states for multi-card layout
    this.updateButtonStates();
    
    // Announce to screen readers
    this.announceSlideChange();
  }
  
  updateButtonStates() {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentSlide === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentSlide >= this.totalSlides - 1;
    }
  }
  
  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
      this.updateCarousel();
      this.resetAutoAdvance();
    }
  }
  
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // Loop back to start
    }
    this.updateCarousel();
    this.resetAutoAdvance();
  }
  
  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.totalSlides - 1; // Loop to end
    }
    this.updateCarousel();
    this.resetAutoAdvance();
  }
  
  startAutoAdvance() {
    if (!this.isAutoAdvancing) return;
    
    this.carousel.classList.add('carousel-auto-advancing');
    this.autoAdvanceInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoAdvanceDelay);
  }
  
  pauseAutoAdvance() {
    this.carousel.classList.remove('carousel-auto-advancing');
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  }
  
  resumeAutoAdvance() {
    if (this.isAutoAdvancing && !this.autoAdvanceInterval) {
      this.startAutoAdvance();
    }
  }
  
  resetAutoAdvance() {
    this.pauseAutoAdvance();
    setTimeout(() => this.resumeAutoAdvance(), 2000); // Resume after 2 seconds
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }
  
  handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.nextSlide(); // Swipe left - next slide
      } else {
        this.previousSlide(); // Swipe right - previous slide
      }
    }
  }
  
  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
        break;
    }
  }
  
  announceSlideChange() {
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('carousel-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'carousel-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
    
    const currentSlideContent = this.slides[this.currentSlide].querySelector('.trend-card');
    const trendNumber = currentSlideContent.querySelector('.trend-number')?.textContent || '';
    const trendLabel = currentSlideContent.querySelector('.trend-label')?.textContent || '';
    
    liveRegion.textContent = `Slide ${this.currentSlide + 1} of ${this.totalSlides}: ${trendNumber} ${trendLabel}`;
  }
  
  destroy() {
    this.pauseAutoAdvance();
    // Remove event listeners and clean up
    this.carousel.classList.remove('carousel-auto-advancing');
    
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}

// Initialize BEC carousels
function initializeBECCarousel() {
  const carousels = document.querySelectorAll('[data-carousel="trends"]');
  carousels.forEach(carousel => {
    new BECCarousel(carousel);
  });
  console.log('✅ BEC Trends Carousel initialized');
}

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

