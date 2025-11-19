/**
 * Offline Banner Module
 * Displays a banner notification when the user loses internet connectivity
 */

class OfflineBanner {
  constructor() {
    this.banner = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    // Create banner element
    this.createBanner();

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Check initial state
    if (!this.isOnline) {
      this.show();
    }
  }

  createBanner() {
    // Create banner container
    this.banner = document.createElement('div');
    this.banner.className = 'offline-banner';
    this.banner.setAttribute('role', 'alert');
    this.banner.setAttribute('aria-live', 'assertive');

    // Banner content
    this.banner.innerHTML = `
      <div class="offline-banner-content">
        <svg class="offline-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 9L5 5L9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 16L16 20L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="5" y1="5" x2="5" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="16" y1="20" x2="16" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="offline-message">
          <strong>You are offline</strong>
          <span>Some features may be unavailable</span>
        </div>
        <button class="offline-close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    // Add styles
    this.addStyles();

    // Attach close button handler
    const closeBtn = this.banner.querySelector('.offline-close');
    closeBtn.addEventListener('click', () => this.hide());

    // Append to body
    document.body.appendChild(this.banner);
  }

  addStyles() {
    if (document.getElementById('offline-banner-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'offline-banner-styles';
    styles.textContent = `
      .offline-banner {
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        min-width: 320px;
        max-width: 90vw;
        background: var(--bg-surface, #FFFFFF);
        border: 1px solid var(--border-color, #E2E8F0);
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        transition: top 0.3s ease;
      }

      .offline-banner.visible {
        top: 24px;
      }

      .offline-banner-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
      }

      .offline-icon {
        flex-shrink: 0;
        color: var(--shu-primary, #FF3500);
      }

      .offline-message {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        color: var(--text-primary, #1E293B);
      }

      .offline-message strong {
        font-size: 14px;
        font-weight: 600;
      }

      .offline-message span {
        font-size: 13px;
        color: var(--text-secondary, #64748B);
      }

      .offline-close {
        flex-shrink: 0;
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--text-secondary, #64748B);
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .offline-close:hover {
        background: var(--bg-secondary, #F8FAFC);
        color: var(--text-primary, #1E293B);
      }

      .offline-close:focus {
        outline: 2px solid var(--shu-primary, #FF3500);
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        .offline-banner {
          min-width: 280px;
          max-width: calc(100vw - 32px);
        }

        .offline-banner.visible {
          top: 16px;
        }

        .offline-banner-content {
          padding: 12px 16px;
          gap: 12px;
        }

        .offline-message strong {
          font-size: 13px;
        }

        .offline-message span {
          font-size: 12px;
        }
      }

      [data-theme="dark"] .offline-banner {
        background: var(--bg-surface, #313244);
        border-color: var(--border-color, #45475a);
      }
    `;

    document.head.appendChild(styles);
  }

  show() {
    if (this.banner) {
      this.banner.classList.add('visible');
    }
  }

  hide() {
    if (this.banner) {
      this.banner.classList.remove('visible');
    }
  }

  handleOnline() {
    this.isOnline = true;
    this.hide();
  }

  handleOffline() {
    this.isOnline = false;
    this.show();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new OfflineBanner());
} else {
  new OfflineBanner();
}
