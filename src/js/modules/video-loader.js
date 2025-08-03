/**
 * Video Loading System - Timer-based video loading with hover-to-play
 * Handles both YouTube videos and device mockup videos with fallbacks
 */

// YouTube timer-based loading
function loadYouTubeVideo(element) {
  const videoId = element.dataset.videoId;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '90%');
  iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`);
  iframe.setAttribute('title', 'YouTube video player');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText = 'width: 100%; height: 90%; border-radius: 8px;';
  element.innerHTML = '';
  element.appendChild(iframe);
}

// Device mockup video loading
function loadDeviceVideo(container) {
  const videoSrc = container.dataset.video;
  const video = document.createElement('video');
  video.muted = true; // Set muted property directly
  video.setAttribute('muted', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.style.cssText = 'max-width: 100%; height: 100%; object-fit: cover; border-radius: 4px;';
  video.addEventListener('loadeddata', function() {
    container.classList.remove('loading');
    // Ensure video is muted and starts playing
    video.muted = true; // Double-check muted state before playing
    video.play().catch(function(e) {
      // Auto-play failed - show static fallback image
      const img = document.createElement('img');
      img.src = container.dataset.fallback || '/assets/img/video-fallback.webp';
      img.alt = 'Sealfie app demo';
      img.style.cssText = 'max-width: 100%; height: 100%; object-fit: cover; border-radius: 4px;';
      container.innerHTML = '';
      container.appendChild(img);
    });
  });
  // Add error handler for video loading failures
  video.addEventListener('error', function() {
    // Video failed to load - show fallback image
    const img = document.createElement('img');
    img.src = container.dataset.fallback || '/assets/img/video-fallback.webp';
    img.alt = 'Sealfie app demo';
    img.style.cssText = 'max-width: 100%; height: 100%; object-fit: cover; border-radius: 4px;';
    container.innerHTML = '';
    container.appendChild(img);
    container.classList.remove('loading');
  });

  const source = document.createElement('source');
  source.src = videoSrc;
  source.type = 'video/webm';
  video.appendChild(source);
  container.innerHTML = '';
  // Final mute enforcement before adding to DOM
  video.muted = true;
  video.volume = 0; // Also set volume to 0 as extra precaution
  container.appendChild(video);
  return video;
}

// Timer-based loading manager
function setupTimerLoading() {
  // YouTube timer loading
  document.querySelectorAll('.youtube-timer-load').forEach(function(element) {
    const loadDelay = parseInt(element.dataset.loadDelay) || 2000;
    let isLoaded = false;

    // Add initial loading indicator
    element.classList.add('timer-loading');

    // Set up timer-based loading
    setTimeout(function() {
      element.classList.remove('timer-loading');
      element.classList.add('loaded');

      // Auto-load video after timer completes
      element.classList.add('loading');
      setTimeout(function() {
        loadYouTubeVideo(element);
        isLoaded = true;
        element.classList.remove('loading');
      }, 500);
    }, loadDelay);

    // Set up hover-to-play functionality (backup if timer hasn't completed)
    element.addEventListener('mouseenter', function() {
      if (!isLoaded && !element.classList.contains('loaded') && !element.classList.contains('loading')) {
        element.classList.remove('timer-loading');
        element.classList.add('loading');
        setTimeout(function() {
          loadYouTubeVideo(element);
          isLoaded = true;
          element.classList.remove('loading');
        }, 300);
      }
    });
  });

  // Device video timer loading
  document.querySelectorAll('.video-timer-container').forEach(function(container) {
    const loadDelay = parseInt(container.dataset.loadDelay) || 3000;
    let video = null;
    let isLoaded = false;

    // Add initial loading indicator
    container.classList.add('timer-loading');

    // Set up timer-based loading
    setTimeout(function() {
      container.classList.remove('timer-loading');
      container.classList.add('loaded');

      // Auto-load video after timer completes
      container.classList.add('loading');
      video = loadDeviceVideo(container);
      isLoaded = true;
      container.classList.remove('loading');
    }, loadDelay);

    // Set up hover-to-play functionality (early trigger only)
    container.addEventListener('mouseenter', function() {
      if (!isLoaded && !container.classList.contains('loaded') && !container.classList.contains('loading')) {
        // Manual trigger if timer hasn't completed
        container.classList.remove('timer-loading');
        container.classList.add('loading');
        video = loadDeviceVideo(container);
        isLoaded = true;
        container.classList.remove('loading');
      }
      // No play/pause control - videos loop continuously once loaded
    });
  });
}

// Initialize timer-based loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setupTimerLoading();
});