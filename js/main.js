// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle
  initSidebar();
  
  // Smooth scrolling
  initSmoothScroll();
  
  // Form handlers
  initForms();
  
  // Animations
  initAnimations();
});

/**
 * Initialize Sidebar Toggle
 */
function initSidebar() {
  const showBtn = document.querySelector('.btn-show-sidebar');
  const hideBtn = document.querySelector('.btn-hide-sidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (showBtn && sidebar) {
    showBtn.addEventListener('click', function() {
      sidebar.classList.add('show');
    });
  }
  
  if (hideBtn && sidebar) {
    hideBtn.addEventListener('click', function() {
      sidebar.classList.remove('show');
    });
  }
  
  // Close sidebar when clicking on a link
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (sidebar) sidebar.classList.remove('show');
    });
  });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * Initialize Forms
 */
function initForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Prevent default if no action
      if (!this.action) {
        e.preventDefault();
        alert('Thank you! Your message has been received.');
        this.reset();
      }
    });
  });
}

/**
 * Initialize Animations
 */
function initAnimations() {
  const elements = document.querySelectorAll('.animated.visible-false');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animationType = entry.target.getAttribute('data-appear');
        if (animationType) {
          entry.target.classList.add(animationType);
        }
        entry.target.classList.remove('visible-false');
        observer.unobserve(entry.target);
      }
    });
  });
  
  elements.forEach(el => observer.observe(el));
}

/**
 * Swiper initialization (if Swiper library is loaded)
 */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  
  // Hero Slider
  if (document.querySelector('.swiper-hero')) {
    new Swiper('.swiper-hero', {
      loop: true,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: '.next-slick1',
        prevEl: '.prev-slick1',
      },
      pagination: {
        el: '.wrap-slick1-dots',
        clickable: true,
      },
    });
  }
  
  // Event Slider
  if (document.querySelector('.swiper-event')) {
    new Swiper('.swiper-event', {
      loop: true,
      autoplay: {
        delay: 8000,
      },
    });
  }
}

// Swiper is initialized by swiper-custom.js when loaded (cravee.html)
