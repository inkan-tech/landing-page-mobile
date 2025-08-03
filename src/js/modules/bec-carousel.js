/**
 * BEC Trends Carousel Module
 * Interactive carousel for displaying current threat intelligence
 */

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
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoAdvance();
    
    // Pause auto-advance on user interaction
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoAdvance());
    this.carousel.addEventListener('mouseleave', () => this.resumeAutoAdvance());
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
    }, { threshold: 0.5 });
    
    observer.observe(this.carousel);
  }
  
  updateCarousel() {
    // Update track position
    const translateX = -this.currentSlide * (100 / this.totalSlides);
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update active slide
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update button states
    this.updateButtonStates();
    
    // Announce to screen readers
    this.announceSlideChange();
  }
  
  updateButtonStates() {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentSlide === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentSlide === this.totalSlides - 1;
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
    }, 5000); // 5 seconds per slide
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
    setTimeout(() => this.resumeAutoAdvance(), 1000); // Resume after 1 second
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
  }
}

// Initialize carousels when DOM is ready
function initBECCarousels() {
  const carousels = document.querySelectorAll('[data-carousel="trends"]');
  carousels.forEach(carousel => {
    new BECCarousel(carousel);
  });
}

// Auto-initialize if module is loaded directly
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBECCarousels);
} else {
  initBECCarousels();
}

// Export for manual initialization
export { BECCarousel, initBECCarousels };