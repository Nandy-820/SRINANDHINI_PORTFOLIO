/**
 * Srinandhini Puralasetti - Personal Portfolio Scripts
 * Handles sticky nav, smooth active link highlighting, mobile menu,
 * scroll reveals via IntersectionObserver, back-to-top button, and interactive contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initKineticTypography();
  initScrollSpy();
  initScrollAnimations();
  initBackToTop();
  initContactForm();
});

/**
 * Navbar scroll elevation effect
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on initial load
}

/**
 * Mobile hamburger navigation toggle
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a nav link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside of the navbar
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Active Navigation Link Indicator based on Scroll Position (ScrollSpy)
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Subtle Scroll-Triggered Animation System with IntersectionObserver
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  if (!animatedElements.length) return;

  // If user prefers reduced motion, show immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animatedElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => revealObserver.observe(el));
}

/**
 * Floating Back-to-Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Professional Contact Form Handling & Validation
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const statusMsg = document.getElementById('formStatusMsg');
  if (!contactForm || !statusMsg) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    if (!emailRegex.test(email)) {
      showStatus('Please provide a valid email address.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
      Sending...
    `;
    submitBtn.disabled = true;

    // Simulate sending email asynchronously
    setTimeout(() => {
      // Create mailto link as fallback/direct integration
      const mailtoLink = `mailto:purlachittinandhini@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\nMessage:\n" + message)}`;
      
      showStatus('Thank you for reaching out! Your message draft is ready. If your mail client does not open automatically, please reach me directly at purlachittinandhini@gmail.com.', 'success');
      
      // Prompt mailto
      window.location.href = mailtoLink;

      contactForm.reset();
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }, 800);
  });

  function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `form-status-msg ${type}`;
    statusMsg.style.display = 'block';

    setTimeout(() => {
      statusMsg.style.display = 'none';
    }, 7000);
  }
}

/**
 * Interactive Kinetic Typography for "Srinandhini Puralasetti"
 * Inspired by Kokonut UI Pro Kinetic Type Hero:
 * Each letter detects cursor proximity and dynamically leans / skews away from the cursor.
 */
function initKineticTypography() {
  const container = document.getElementById('kineticName');
  if (!container) return;

  const rawText = container.textContent.trim();
  const words = rawText.split(/\s+/);

  // Wrap letters in interactive spans while preserving accessible words
  container.innerHTML = words.map(word => {
    const lettersHtml = word.split('').map(char => 
      `<span class="kinetic-char">${char}</span>`
    ).join('');
    return `<span class="kinetic-word">${lettersHtml}</span>`;
  }).join('<span class="kinetic-char" style="width: 0.35em; display: inline-block;">&nbsp;</span>');

  const chars = container.querySelectorAll('.kinetic-char');
  if (!chars.length) return;

  // Proximity and kinetic configuration
  const maxDistance = 240; // Proximity radius in px
  const maxSkew = 24;      // Max lean angle in degrees
  const maxLift = 6;       // Max vertical lift in px

  let mouseX = -9999;
  let mouseY = -9999;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(updateKineticLetters);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    resetCharacters();
  });

  // Touch support for mobile devices
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateKineticLetters);
      }
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    resetCharacters();
  });

  function updateKineticLetters() {
    rafId = null;

    chars.forEach((char) => {
      if (char.textContent === '\u00A0' || !char.textContent.trim()) return;

      const rect = char.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const deltaX = mouseX - charCenterX;
      const deltaY = mouseY - charCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < maxDistance) {
        // Smooth falloff factor
        const factor = Math.cos((distance / maxDistance) * (Math.PI / 2));
        
        // Negative deltaX leans away to the opposite direction of cursor
        const leanDirection = deltaX > 0 ? -1 : 1;
        const skewAngle = Math.min(Math.abs(deltaX) / maxDistance, 1) * maxSkew * leanDirection * factor;
        const translateY = -maxLift * factor;
        const scale = 1 + (0.06 * factor);

        char.style.transform = `skewX(${skewAngle.toFixed(2)}deg) translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        char.classList.add('hover-active');
      } else {
        char.style.transform = 'skewX(0deg) translateY(0px) scale(1)';
        char.classList.remove('hover-active');
      }
    });
  }

  function resetCharacters() {
    chars.forEach((char) => {
      char.style.transform = 'skewX(0deg) translateY(0px) scale(1)';
      char.classList.remove('hover-active');
    });
  }
}

