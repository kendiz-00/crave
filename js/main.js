// Initialize everything when DOM is loaded
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
  
  // Initialize menu cards generation
  initMenuCards();
  
  // SIMPLE WORKING CART SYSTEM
  initSimpleCart();
  
  // Initialize menu category scroll
  initMenuCategoryScroll();
  
  // Initialize reservation form
  initReservationForm();
  
  // SAFE: Floating Cart Button Functionality
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const cartBadge = document.getElementById('cartBadge');
  
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', function() {
      window.location.href = 'cart.html';
    });
  }
  
  // SAFE: Update cart badge function
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('craveCart')) || {};
    const itemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    
    // Update floating cart badge
    if (cartBadge) {
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
    }
    
    // Update mini cart text
    const miniCartText = document.getElementById('miniCartText');
    if (miniCartText) {
      miniCartText.textContent = itemCount === 0 ? '0 items' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    }
  }
  
  // Update badge on page load
  updateCartBadge();
  
  // SAFE: Override original updateCartSummary to also update badge
  const originalUpdateCartSummary = updateCartSummary;
  updateCartSummary = function() {
    originalUpdateCartSummary();
    updateCartBadge();
  };
});

/**
 * Initialize Navbar Behavior (toggle + sticky shadow)
 */
function initNavbarBehavior() {
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMenu = document.getElementById('navbarMenu');
  const navbarHeader = document.getElementById('siteHeader') || document.querySelector('.navbar-header');
  const navbarLinks = document.querySelectorAll('.navbar-link');

  function closeMobileMenu() {
    if (navbarMenu) {
      navbarMenu.classList.remove('open');
      navbarMenu.setAttribute('aria-hidden', 'true');
    }
    if (navbarToggle) {
      navbarToggle.classList.remove('open');
      navbarToggle.setAttribute('aria-expanded', 'false');
      navbarToggle.focus();
    }
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapTabKey);
  }

  function updateFocusTrap() {
    const focusable = navbarMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const focusArray = Array.from(focusable);
    return {
      first: focusArray[0],
      last: focusArray[focusArray.length - 1],
    };
  }

  function trapTabKey(e) {
    if (!navbarMenu.classList.contains('open')) return;
    if (e.key !== 'Tab') return;

    const { first, last } = updateFocusTrap();
    if (!first || !last) return;

    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === navbarToggle) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      navbarMenu.classList.toggle('open');
      const isOpen = navbarMenu.classList.contains('open');
      navbarToggle.classList.toggle('open', isOpen);
      navbarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navbarMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        const { first } = updateFocusTrap();
        if (first) first.focus();
        document.addEventListener('keydown', trapTabKey);
      } else {
        document.removeEventListener('keydown', trapTabKey);
      }
    });

    navbarLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      });
    });

    document.addEventListener('click', function(event) {
      if (!event.target.closest('.navbar-container')) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  // Active link highlight based on current page path
  const path = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const pageName = path === '' ? 'index.html' : path;

  navbarLinks.forEach(link => {
    const target = link.getAttribute('data-page');
    link.classList.remove('active');

    if ((target === 'home' && (pageName === 'index.html' || pageName === '')) ||
        (target && pageName === `${target}.html`)) {
      link.classList.add('active');
    }
  });

  function updateHeaderShadow() {
    if (!navbarHeader) return;
    const hasShadow = window.scrollY > 8;
    navbarHeader.classList.toggle('scrolled', hasShadow);
  }

  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();
  initAdaptiveMenuSizing();
}

function initAdaptiveMenuSizing() {
  const mql = window.matchMedia('(max-width: 768px)');
  const navbarLinks = document.querySelectorAll('.navbar-link');

  function applySizing() {
    const isCompact = mql.matches;
    navbarLinks.forEach(link => {
      link.style.fontSize = isCompact ? '16px' : '15px';
      link.style.padding = isCompact ? '12px 18px' : '0.5rem 0.65rem';
    });
  }

  mql.addEventListener('change', applySizing);
  applySizing();
}

function preloadHeroBackground() {
  const heroUrl = 'images/cover_page.jpeg';
  if (!heroUrl) return;
  const heroImg = new Image();
  heroImg.src = heroUrl;
  heroImg.onload = () => {
    /* loaded */
  };
  heroImg.onerror = () => {
    /* fallback or ignore */
  };
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

function initMenuScrollAnimations() {
  const items = document.querySelectorAll('.menu-item, .testimonial-card, .hero-content, .menu-section, .testimonials-section, footer');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;

        let delay = 0;
        if (target.dataset && typeof target.dataset.index !== 'undefined') {
          delay = Number(target.dataset.index) * 0.12;
        }

        target.style.transitionDelay = `${delay}s`;
        target.classList.add('fadeInUp');
        target.classList.remove('visible-false');
        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.15
  });

  items.forEach((item, index) => {
    if (!item.classList.contains('visible-false')) {
      item.classList.add('visible-false');
    }
    item.dataset.index = index;
    observer.observe(item);
  });

  // Fallback for stale observers - trigger animation after 3 seconds if not already animated
  setTimeout(() => {
    items.forEach(item => {
      if (item.classList.contains('visible-false')) {
        item.classList.add('fadeInUp');
        item.classList.remove('visible-false');
        item.classList.add('cards-loading-fallback');
      }
    });
  }, 3000);
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
 * Initialize Menu Category Section Scroll Detection - Enhanced
 */
function initMenuCategoryScroll() {
  const stickyNav = document.querySelector('.menu-sticky-nav');
  const navLinks = document.querySelectorAll('.sticky-nav-link');
  const sections = document.querySelectorAll('.menu-category-section');
  
  if (navLinks.length === 0 || sections.length === 0) return;
  
  // Get navbar height for accurate offset calculation
  const navbar = document.querySelector('.navbar-header');
  const navbarHeight = navbar ? navbar.offsetHeight : 64;
  const stickyNavHeight = stickyNav ? stickyNav.offsetHeight : 60;
  const totalOffset = navbarHeight + stickyNavHeight + 20; // 20px extra buffer
  
  // Throttle function for better performance
  let ticking = false;
  function updateActiveCategory() {
    let current = '';
    let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - totalOffset;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        current = section.getAttribute('id');
      }
    });
    
    // Handle case when scrolling above first section
    if (scrollPosition < sections[0].offsetTop - totalOffset) {
      current = sections[0].getAttribute('id');
    }
    
    // Handle case when scrolling past last section
    if (scrollPosition >= sections[sections.length - 1].offsetTop + sections[sections.length - 1].offsetHeight - totalOffset) {
      current = sections[sections.length - 1].getAttribute('id');
    }
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
        
        // Scroll the sticky nav to show the active link
        const container = link.parentElement;
        const linkLeft = link.offsetLeft;
        const linkWidth = link.offsetWidth;
        const containerWidth = container.offsetWidth;
        const containerScrollLeft = container.scrollLeft;
        
        if (linkLeft < containerScrollLeft) {
          container.scrollLeft = linkLeft - 10;
        } else if (linkLeft + linkWidth > containerScrollLeft + containerWidth) {
          container.scrollLeft = linkLeft + linkWidth - containerWidth + 10;
        }
      }
    });
    
    ticking = false;
  }
  
  // Initial update
  updateActiveCategory();
  
  // Scroll event listener with throttling
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateActiveCategory);
      ticking = true;
    }
  }, { passive: true });
  
  // Click event for smooth scrolling
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const targetPosition = targetSection.offsetTop - totalOffset + 1;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initMenuFilter() {
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

/**
 * Initialize Menu Cards Generation (reusable template)
 */
function initMenuCards() {
  // Only run on menu.html
  if (!window.location.pathname.includes('menu.html')) return;

  const menuData = {
    'most-popular': [
      { img: 'images/meat.jpeg', alt: 'Grilled Chicken Salad', title: 'Grilled Chicken Salad', desc: 'Grilled chicken breast over mixed greens with balsamic vinaigrette', price: '$15.99', badge: '🔥 Popular' },
      { img: 'images/smoothies.jpeg', alt: 'Fresh Smoothie', title: 'Fresh Smoothie', desc: 'Blend of seasonal fruits with yogurt and honey', price: '$6.99', badge: 'Best Seller' },
      { img: 'images/coffee.jpeg', alt: 'Artisan Coffee', title: 'Artisan Coffee', desc: 'Single-origin coffee beans roasted in-house', price: '$4.99', badge: 'Popular' }
    ],
    'loaded-fries': [
      { img: 'images/tx-chick.jpeg', alt: 'Avocado Toast', title: 'Avocado Toast', desc: 'Fresh avocado on artisanal bread with poached eggs and cherry tomatoes', price: '$12.99', badge: '🔥 Popular' },
      { img: 'images/pancakes.jpeg', alt: 'Fluffy Pancakes', title: 'Fluffy Pancakes', desc: 'Light and fluffy pancakes served with maple syrup and fresh berries', price: '$9.99' }
    ],
    'texas-chicken': [
      { img: 'images/meat.jpeg', alt: 'Grilled Chicken Salad', title: 'Grilled Chicken Salad', desc: 'Grilled chicken breast over mixed greens with balsamic vinaigrette', price: '$15.99', badge: '🔥 Popular' },
      { img: 'images/wrap-01.jpeg', alt: 'Turkey Club Wrap', title: 'Turkey Club Wrap', desc: 'Sliced turkey, bacon, lettuce, and tomato in a whole wheat wrap', price: '$11.99' }
    ],
    'smoothies': [
      { img: 'images/steak.jpeg', alt: 'Grilled Ribeye Steak', title: 'Grilled Ribeye Steak', desc: '8oz ribeye steak grilled to perfection with garlic mashed potatoes', price: '$28.99', badge: '🔥 Popular' },
      { img: 'images/pasta.jpeg', alt: 'Truffle Pasta', title: 'Truffle Pasta', desc: 'House-made pasta with black truffle oil, parmesan, and fresh herbs', price: '$22.99' }
    ],
    'milkshakes': [
      { img: 'images/smoothies.jpeg', alt: 'Fresh Smoothie', title: 'Fresh Smoothie', desc: 'Blend of seasonal fruits with yogurt and honey', price: '$6.99' },
      { img: 'images/coffee.jpeg', alt: 'Artisan Coffee', title: 'Artisan Coffee', desc: 'Single-origin coffee beans roasted in-house', price: '$4.99', badge: 'Popular' }
    ],
    'jamaican-kitchen': [
      { img: 'images/meat.jpeg', alt: 'Jerk Chicken', title: 'Jerk Chicken', desc: 'Spicy marinated chicken with traditional Jamaican spices', price: '$16.99', badge: '🔥 Popular' }
    ],
    'cupcakes': [
      { img: 'images/cupcake.jpeg', alt: 'Red Velvet Cupcake', title: 'Red Velvet Cupcake', desc: 'Classic red velvet with cream cheese frosting', price: '$4.50' }
    ],
    'cake-and-shakes': [
      { img: 'images/cupcake.jpeg', alt: 'Chocolate Cake', title: 'Chocolate Cake', desc: 'Rich chocolate cake with vanilla ice cream', price: '$7.99' }
    ]
  };

  function createMenuCard(item) {
    const badgeHtml = item.badge ? `<div class="menu-badge">${item.badge}</div>` : '';
    return `
      <div class="menu-item" data-category="${item.category || 'popular'}">
        <div class="menu-card">
          <div class="menu-image">
            <img src="${item.img}" alt="${item.alt}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
            ${badgeHtml}
          </div>
          <div class="menu-content">
            <h4 class="menu-title">${item.title}</h4>
            <p class="menu-description">${item.desc}</p>
            <div class="menu-price">${item.price}</div>
            <div class="qty-controls">
              <button class="qty-btn" data-action="decrease" data-item="${item.title}" type="button">-</button>
              <input class="qty-input" type="number" min="1" value="1" data-item="${item.title}" />
              <button class="qty-btn" data-action="increase" data-item="${item.title}" type="button">+</button>
            </div>
            <button class="btn-add-cart" data-item="${item.title}" data-price="${item.price}">Add to Cart</button>
            <button class="btn-order" data-item="${item.title}">Order This Item</button>
          </div>
        </div>
      </div>
    `;
  }

  Object.keys(menuData).forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      const grid = section.querySelector('.menu-grid');
      if (grid) {
        grid.innerHTML = menuData[sectionId].map(createMenuCard).join('');
      }
    }
  });
}

/**
 * Initialize WhatsApp Order Integration
 */
function initWhatsAppOrders() {
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-order')) {
      event.preventDefault();
      const itemName = event.target.getAttribute('data-item');
      const phoneNumber = '233550020788';
      const message = `Hi Crave, I'd like to order ${itemName}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  });
}

/**
 * SIMPLE WORKING CART SYSTEM
 */
function initSimpleCart() {
  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem('craveCart')) || {};
  
  // Add to Cart
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add-cart')) {
      e.preventDefault();
      
      const title = e.target.getAttribute('data-item');
      const price = e.target.getAttribute('data-price');
      const qtyInput = document.querySelector(`.qty-input[data-item="${title}"]`);
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      
      // Add to cart
      const key = title.toLowerCase().replace(/\s+/g, '-');
      if (cart[key]) {
        cart[key].quantity += quantity;
      } else {
        cart[key] = { title, price, quantity };
      }
      
      // Save to localStorage
      localStorage.setItem('craveCart', JSON.stringify(cart));
      
      // Update displays
      updateCartDisplay();
      
      // Reset quantity
      if (qtyInput) qtyInput.value = 1;
      
      console.log('Added to cart:', title, quantity);
    }
  });
  
  // Order This Item (WhatsApp)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-order')) {
      e.preventDefault();
      
      const title = e.target.getAttribute('data-item');
      const message = `Hi Crave, I'd like to order: ${title}`;
      const whatsappUrl = `https://wa.me/233550020788?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  });
  
  // Quantity Controls
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('qty-btn')) {
      e.preventDefault();
      
      const action = e.target.getAttribute('data-action');
      const itemTitle = e.target.getAttribute('data-item');
      const qtyInput = document.querySelector(`.qty-input[data-item="${itemTitle}"]`);
      
      if (qtyInput) {
        let value = parseInt(qtyInput.value) || 1;
        if (action === 'increase') {
          value = Math.min(value + 1, 99);
        } else if (action === 'decrease') {
          value = Math.max(value - 1, 1);
        }
        qtyInput.value = value;
      }
    }
  });
  
  // Update cart displays
  function updateCartDisplay() {
    const itemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    
    // Update mini cart text
    const miniCartText = document.getElementById('miniCartText');
    if (miniCartText) {
      miniCartText.textContent = itemCount === 0 ? '0 items' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    }
    
    // Update floating cart badge
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
    }
  }
  
  // Initial update
  updateCartDisplay();
}

function getItemKey(itemTitle) {
  return itemTitle.trim().toLowerCase().replace(/\s+/g, '-');
}

function parsePrice(value) {
  const number = parseFloat(value.replace(/[^0-9.]/g, ''));
  return Number.isNaN(number) ? 0 : number;
}

function updateCartSummary() {
  const orderCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  const orderSummary = document.getElementById('orderCount');
  if (orderSummary) {
    orderSummary.textContent = orderCount > 0 ? `Cart: ${orderCount} item${orderCount > 1 ? 's' : ''}` : 'Cart is empty';
  }
}

function clearCart() {
  Object.keys(cart).forEach(key => delete cart[key]);
  localStorage.setItem('craveCart', JSON.stringify(cart));
  updateCartSummary();
}

function buildWhatsAppCartMessage() {
  const lines = Object.values(cart).map(item => `${item.quantity} x ${item.title} (${item.price})`);
  if (lines.length === 0) return '';
  return `Hi Crave, I'd like to order:\n${lines.join('\n')}`;
}

function initMenuCart() {
  document.addEventListener('click', function(event) {
    const target = event.target;

    // Add to Cart functionality
    if (target.matches('.btn-add-cart')) {
      event.preventDefault();
      console.log('Add to Cart clicked!'); // Debug log
      
      const itemTitle = target.getAttribute('data-item');
      const itemPrice = target.getAttribute('data-price') || '$0';
      const itemKey = getItemKey(itemTitle);
      const qtyInput = document.querySelector(`.qty-input[data-item="${itemTitle}"]`);
      const quantity = Math.max(1, Number(qtyInput ? qtyInput.value : 1));

      console.log('Adding item:', itemTitle, quantity); // Debug log

      if (!cart[itemKey]) {
        cart[itemKey] = { title: itemTitle, price: itemPrice, quantity };
      } else {
        cart[itemKey].quantity += quantity;
      }

      // Save cart to localStorage
      localStorage.setItem('craveCart', JSON.stringify(cart));
      
      console.log('Cart saved:', cart); // Debug log
      
      updateCartSummary();
      if (qtyInput) qtyInput.value = 1;
      return;
    }

    // Checkout functionality
    if (target.matches('#checkoutOrder')) {
      event.preventDefault();
      const message = buildWhatsAppCartMessage();
      if (!message) {
        alert('Cart is empty. Add an item before checkout.');
        return;
      }
      const phoneNumber = '233550020788';
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    // Clear cart functionality
    if (target.matches('#clearCart')) {
      event.preventDefault();
      if (confirm('Are you sure you want to clear your cart?')) {
        clearCart();
      }
      return;
    }

    // Quantity controls
    if (target.matches('.qty-btn')) {
      event.preventDefault();
      const action = target.getAttribute('data-action');
      const itemTitle = target.getAttribute('data-item');
      const qtyInput = document.querySelector(`.qty-input[data-item="${itemTitle}"]`);
      if (!qtyInput) return;
      
      let currentValue = parseInt(qtyInput.value) || 1;
      if (action === 'increase') {
        currentValue = Math.min(currentValue + 1, 99);
      } else if (action === 'decrease') {
        currentValue = Math.max(currentValue - 1, 1);
      }
      qtyInput.value = currentValue;
      return;
    }
  });
}

/**
 * Initialize WhatsApp Order Integration
 */
function initWhatsAppOrders() {
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-order')) {
      event.preventDefault();
      const itemName = event.target.getAttribute('data-item');
      const phoneNumber = '233550020788';
      const message = `Hi Crave, I'd like to order ${itemName}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  });
}

/**
 * Initialize Mobile Sticky Order Bar
 */
function initMobileOrderBar() {
  const orderBtn = document.getElementById('mobileOrderNow');
  const phoneNumber = '233550020788';

  if (!orderBtn) return;

  orderBtn.addEventListener('click', function() {
    const message = 'Hi Crave, I would like to place an order.';
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  });
}


/**
 * Initialize Testimonials Carousel Auto-Scroll + Dots
 */
function initTestimonialsCarousel() {
  const sections = document.querySelectorAll('.testimonials-section');
  if (!sections.length) return;

  sections.forEach(section => {
    const carousel = section.querySelector('.testimonials-grid');
    const slides = carousel ? Array.from(carousel.querySelectorAll('.testimonial-card')) : [];
    if (!carousel || !slides.length) return;

    let currentSlide = 0;
    let intervalId = null;

    // Activate first slide
    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
      const dots = section.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    function moveTo(index) {
      currentSlide = (index + slides.length) % slides.length;
      updateSlides();
      resetAutoScroll();
    }

    function prevSlide() {
      moveTo(currentSlide - 1);
    }

    function nextSlide() {
      moveTo(currentSlide + 1);
    }

    function resetAutoScroll() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(nextSlide, 5000);
    }

    // Add controls
    const controls = document.createElement('div');
    controls.className = 'testimonial-controls';
    controls.innerHTML = `
      <button class="testimonial-arrow testimonial-prev" aria-label="Previous testimonial">⟨</button>
      <button class="testimonial-arrow testimonial-next" aria-label="Next testimonial">⟩</button>
    `;
    section.appendChild(controls);

    controls.querySelector('.testimonial-prev').addEventListener('click', prevSlide);
    controls.querySelector('.testimonial-next').addEventListener('click', nextSlide);

    // Add dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';

    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'testimonial-dot';
      dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
      dot.addEventListener('click', () => moveTo(idx));
      dotsContainer.appendChild(dot);
    });

    section.appendChild(dotsContainer);

    updateSlides();
    resetAutoScroll();

    section.addEventListener('mouseenter', function() {
      if (intervalId) clearInterval(intervalId);
    });

    section.addEventListener('mouseleave', function() {
      resetAutoScroll();
    });
  });
}



