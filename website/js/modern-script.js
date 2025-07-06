// Modern JavaScript with ES6+ features and performance optimizations

class KPSWebsite {
  constructor() {
    this.init();
  }

  init() {
    // Initialize all components when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupComponents());
    } else {
      this.setupComponents();
    }
  }

  setupComponents() {
    this.setupMobileMenu();
    this.setupLazyLoading();
    this.setupSmoothScrolling();
    this.setupFormValidation();
    this.setupAccessibility();
    this.setupPerformanceMonitoring();
    this.setupServiceWorker();
  }

  // Mobile Menu with improved touch support
  setupMobileMenu() {
    const menuButton = document.querySelector('.icon-menu');
    const body = document.body;
    let touchStartX = 0;
    let touchEndX = 0;

    if (!menuButton) return;

    // Toggle menu on button click
    menuButton.addEventListener('click', (e) => {
      e.preventDefault();
      body.classList.toggle('menu-open');
      
      // Update ARIA attributes
      const isOpen = body.classList.contains('menu-open');
      menuButton.setAttribute('aria-expanded', isOpen);
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) {
        body.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    // Touch swipe support for mobile menu
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const body = document.body;
    
    if (endX < startX - swipeThreshold && body.classList.contains('menu-open')) {
      // Swipe left - close menu
      body.classList.remove('menu-open');
    } else if (endX > startX + swipeThreshold && !body.classList.contains('menu-open')) {
      // Swipe right - open menu
      body.classList.add('menu-open');
    }
  }

  // Enhanced lazy loading with native API and fallback
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Handle different image sources
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Add fade-in animation
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
      lazyImages.forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      });
    }
  }

  // Smooth scrolling with performance optimization
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without triggering scroll
          history.pushState(null, null, href);
        }
      });
    });
  }

  // Form validation with better UX
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!this.validateForm(form)) return;
        
        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
          // Simulate form submission (replace with actual API call)
          await this.submitForm(form);
          
          // Show success message
          this.showNotification('Form submitted successfully!', 'success');
          form.reset();
        } catch (error) {
          this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      });

      // Real-time validation
      form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
      });
    });
  }

  validateForm(form) {
    const fields = form.querySelectorAll('[required]');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;

    // Remove previous error
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) errorElement.remove();

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, 'This field is required');
      isValid = false;
    }
    
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        isValid = false;
      }
    }
    
    // Phone validation
    else if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
      }
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.parentElement.appendChild(error);
  }

  async submitForm(form) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  // Notification system
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Accessibility improvements
  setupAccessibility() {
    // Skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for modals/menus
    this.setupFocusTrap();

    // Keyboard navigation improvements
    this.setupKeyboardNavigation();
  }

  setupFocusTrap() {
    const menu = document.querySelector('.menu__body');
    if (!menu) return;

    const focusableElements = menu.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    document.addEventListener('keydown', (e) => {
      if (!document.body.classList.contains('menu-open')) return;
      
      if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  setupKeyboardNavigation() {
    // Arrow key navigation for menu items
    const menuItems = document.querySelectorAll('.menu__link');
    
    menuItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && index < menuItems.length - 1) {
          e.preventDefault();
          menuItems[index + 1].focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          menuItems[index - 1].focus();
        }
      });
    });
  }

  // Performance monitoring
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  // Service Worker for offline support and caching
  setupServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration);
      }).catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }
}

// Initialize the website
new KPSWebsite();

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Scroll-based animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
};

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
  animateOnScroll();
}