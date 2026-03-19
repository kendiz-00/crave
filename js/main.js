// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
  // Navbar toggle and sticky behavior
  initNavbarBehavior();
  
  // Sidebar toggle
  initSidebar();
  
  // Smooth scrolling
  initSmoothScroll();
  
  // Form handlers
  initForms();
  
  // Animations
  initAnimations();
  
  // Menu filtering
  initMenuFilter();
  
  // Menu category scroll detection
  initMenuCategoryScroll();
});

/**
 * Initialize Navbar Behavior (toggle + sticky shadow)
 */
function initNavbarBehavior() {
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMenu = document.getElementById('navbarMenu');
  const navbarHeader = document.querySelector('.navbar-header');
  const navbarLinks = document.querySelectorAll('.navbar-link');
  
  // Mobile menu toggle
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('active');
      navbarToggle.setAttribute('aria-expanded', 
        navbarMenu.classList.contains('active'));
    });
    
    // Close menu when clicking on a link
    navbarLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbarMenu.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.navbar-container')) {
        navbarMenu.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', function() {
    if (navbarHeader) {
      if (window.scrollY > 10) {
        navbarHeader.classList.add('scrolled');
      } else {
        navbarHeader.classList.remove('scrolled');
      }
    }
  });
}

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

  // Smooth scroll when landing on a page with a hash (e.g., menu.html#smoothies)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }
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

/**
 * Initialize Menu Category Section Scroll Detection
 */
function initMenuCategoryScroll() {
  const stickyNav = document.querySelector('.menu-sticky-nav');
  const navLinks = document.querySelectorAll('.sticky-nav-link');
  const sections = document.querySelectorAll('.menu-category-section');
  
  if (navLinks.length === 0 || sections.length === 0) return;
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200; // Account for sticky nav height
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
        
        // Scroll the sticky nav to show the active link
        const linkLeft = link.offsetLeft;
        const linkWidth = link.offsetWidth;
        const containerWidth = link.parentElement.offsetWidth;
        const scrollLeft = link.parentElement.scrollLeft;
        
        if (linkLeft < scrollLeft) {
          link.parentElement.scrollLeft = linkLeft - 10;
        } else if (linkLeft + linkWidth > scrollLeft + containerWidth) {
          link.parentElement.scrollLeft = linkLeft + linkWidth - containerWidth + 10;
        }
      }
    });
  });
}

  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  
  if (filterButtons.length === 0 || menuItems.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      // Filter menu items
      menuItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'popular' || category === filterValue) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
}
