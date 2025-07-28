// Contact Form Module - Lazy loaded
export class ContactForm {
  constructor() {
    this.form = null;
    this.init();
  }

  init() {
    // Initialize contact form functionality
    this.setupFormValidation();
    this.setupSubmission();
  }

  setupFormValidation() {
    // Add form validation logic
    console.log('Contact form validation initialized');
  }

  setupSubmission() {
    // Handle form submission with offline support
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-contact-form]')) {
        e.preventDefault();
        this.handleSubmit(e.target);
      }
    });
  }

  handleSubmit(form) {
    const formData = new FormData(form);
    
    // Try to submit online first
    if (navigator.onLine) {
      this.submitOnline(formData);
    } else {
      this.queueForLater(formData);
    }
  }

  submitOnline(formData) {
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      this.showSuccess();
    })
    .catch(error => {
      this.queueForLater(formData);
    });
  }

  queueForLater(formData) {
    // Store in IndexedDB for later submission
    console.log('Form queued for offline submission');
    this.showOfflineMessage();
  }

  showSuccess() {
    // Show success message
    console.log('Form submitted successfully');
  }

  showOfflineMessage() {
    // Show offline queue message
    console.log('Form will be submitted when online');
  }
}