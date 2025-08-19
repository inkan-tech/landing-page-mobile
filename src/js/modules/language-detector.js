/**
 * Language Detection and Popup Module
 * Detects browser language and offers to switch if different from current site language
 */

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'sealfie_language_preference';
    const POPUP_DISMISSED_KEY = 'sealfie_language_popup_dismissed';
    const SUPPORTED_LANGUAGES = ['en', 'fr'];
    const DEFAULT_LANGUAGE = 'en';

    // Get current page language from URL or HTML lang attribute
    function getCurrentLanguage() {
        const pathname = window.location.pathname;
        const langMatch = pathname.match(/^\/(en|fr)\//);
        
        if (langMatch) {
            return langMatch[1];
        }
        
        // Check if we're at root - root is now English by default
        if (pathname === '/' || pathname === '/index.html') {
            return DEFAULT_LANGUAGE;
        }
        
        // Fallback to HTML lang attribute
        return document.documentElement.lang || DEFAULT_LANGUAGE;
    }

    // Get browser language
    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage || DEFAULT_LANGUAGE;
        // Extract the primary language code (e.g., 'en' from 'en-US')
        const primaryLang = lang.split('-')[0].toLowerCase();
        
        // Return supported language or default
        return SUPPORTED_LANGUAGES.includes(primaryLang) ? primaryLang : DEFAULT_LANGUAGE;
    }

    // Check if popup was previously dismissed for specific language combination
    function wasPopupDismissedForLanguages(browserLang, currentLang) {
        const dismissalKey = `${POPUP_DISMISSED_KEY}_${browserLang}_${currentLang}`;
        return localStorage.getItem(dismissalKey) === 'true';
    }

    // Dismiss popup for specific language combination
    function dismissPopup(browserLang, currentLang) {
        const dismissalKey = `${POPUP_DISMISSED_KEY}_${browserLang}_${currentLang}`;
        localStorage.setItem(dismissalKey, 'true');
    }

    // Check if user came from our site (to avoid showing popup when switching back)
    function cameFromOurSite() {
        const referrer = document.referrer;
        const currentDomain = window.location.hostname;
        
        // Check if referrer is from the same domain (our site)
        if (referrer && referrer.includes(currentDomain)) {
            return true;
        }
        
        // Also check if user has recently interacted with our site
        const lastVisit = localStorage.getItem('sealfie_last_visit');
        const now = Date.now();
        const fiveMinutesAgo = now - (5 * 60 * 1000); // 5 minutes
        
        return lastVisit && parseInt(lastVisit) > fiveMinutesAgo;
    }

    // Track user visit to prevent popup on returns
    function trackVisit() {
        localStorage.setItem('sealfie_last_visit', Date.now().toString());
    }

    // Save language preference
    function saveLanguagePreference(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    // Get saved language preference
    function getSavedLanguagePreference() {
        return localStorage.getItem(STORAGE_KEY);
    }

    // Redirect to language-specific URL
    function redirectToLanguage(lang) {
        const currentPath = window.location.pathname;
        const currentLang = getCurrentLanguage();
        
        // If we're at root, redirect to language subdirectory
        if (currentPath === '/' || currentPath === '/index.html') {
            window.location.href = `/${lang}/`;
            return;
        }
        
        // Replace current language in path
        if (currentLang && currentPath.includes(`/${currentLang}/`)) {
            const newPath = currentPath.replace(`/${currentLang}/`, `/${lang}/`);
            window.location.href = newPath;
        } else {
            // Fallback: go to language home
            window.location.href = `/${lang}/`;
        }
    }

    // Create and show language popup
    function showLanguagePopup(suggestedLang, currentLang) {
        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'language-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-labelledby', 'language-popup-title');
        
        // Language names
        const languageNames = {
            'en': 'English',
            'fr': 'Français'
        };
        
        // Popup content - ALWAYS in the browser's language (suggestedLang)
        const message = suggestedLang === 'fr' 
            ? `Nous avons détecté que votre navigateur est configuré en français. Souhaitez-vous consulter ce site en français ?`
            : `We noticed your browser is set to English. Would you like to view this site in English?`;
        
        const yesText = suggestedLang === 'fr' ? 'Oui, changer de langue' : 'Yes, switch language';
        const noText = suggestedLang === 'fr' ? 'Non, rester en ' + languageNames[currentLang] : 'No, stay in ' + languageNames[currentLang];
        
        popup.innerHTML = `
            <div class="language-popup-content">
                <button class="language-popup-close" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="language-popup-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                </div>
                <h2 id="language-popup-title" class="language-popup-title">${message}</h2>
                <div class="language-popup-buttons">
                    <button class="language-popup-btn language-popup-btn-primary" data-action="yes">
                        ${yesText}
                    </button>
                    <button class="language-popup-btn language-popup-btn-secondary" data-action="no">
                        ${noText}
                    </button>
                </div>
            </div>
        `;
        
        // Add popup to body
        document.body.appendChild(popup);
        
        // Animate in
        setTimeout(() => {
            popup.classList.add('language-popup-show');
        }, 100);
        
        // Handle button clicks
        popup.addEventListener('click', function(e) {
            const target = e.target;
            const action = target.getAttribute('data-action');
            
            if (action === 'yes') {
                saveLanguagePreference(suggestedLang);
                redirectToLanguage(suggestedLang);
            } else if (action === 'no' || target.classList.contains('language-popup-close') || target.closest('.language-popup-close')) {

                dismissPopup(suggestedLang, currentLang);

                saveLanguagePreference(currentLang);
                closePopup();
            }
        });
        
        // Close popup function
        function closePopup() {
            popup.classList.remove('language-popup-show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.contains(popup)) {

                dismissPopup(suggestedLang, currentLang);

                saveLanguagePreference(currentLang);
                closePopup();
            }
        });
    }

    // Initialize language detection
    function init() {
        const currentLang = getCurrentLanguage();
        const browserLang = getBrowserLanguage();
        const savedLang = getSavedLanguagePreference();
        
        // Debug logging
        console.log('🌐 Language Detection Debug:', {
            currentLang,
            browserLang,
            savedLang,
            referrer: document.referrer,
            url: window.location.pathname
        });
        
        // If user has a saved preference and it's different from current, redirect
        if (savedLang && savedLang !== currentLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
            console.log('Redirecting due to saved preference:', savedLang);
            redirectToLanguage(savedLang);
            return;
        }
        
        // Track this visit
        trackVisit();
        
        // Show popup if browser language differs from current language, unless specifically dismissed or user came from our site
        const wasSpecificCombinationDismissed = wasPopupDismissedForLanguages(browserLang, currentLang);
        const userCameFromOurSite = cameFromOurSite();
        
        console.log('🔍 Popup conditions:', {
            browserLang,
            currentLang,
            browserDiffersFromCurrent: browserLang !== currentLang,
            hasSavedLang: !!savedLang,
            wasSpecificCombinationDismissed,
            userCameFromOurSite
        });
        
        if (browserLang !== currentLang && !savedLang && !wasSpecificCombinationDismissed && !userCameFromOurSite) {
            console.log('🎌 Showing language popup');
            // Wait for page to load before showing popup
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => showLanguagePopup(browserLang, currentLang), 1000);
                });
            } else {
                setTimeout(() => showLanguagePopup(browserLang, currentLang), 1000);
            }
        } else {
            console.log('❌ Not showing popup - conditions not met');
        }
    }

    // Test function to force show popup (for debugging)
    function testPopup() {
        console.log('🧪 Testing language popup...');
        showLanguagePopup('fr', 'en');
    }

    // Function to clear all language preferences (for testing)
    function clearLanguageData() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('sealfie_last_visit');
        // Clear all dismissal keys
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(POPUP_DISMISSED_KEY)) {
                localStorage.removeItem(key);
            }
        });
        console.log('🧹 Cleared all language data');
    }

    // Make test functions globally available for debugging
    window.testLanguagePopup = testPopup;
    window.clearLanguageData = clearLanguageData;

    // Start detection
    init();
})();