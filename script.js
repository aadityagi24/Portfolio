'use strict';

/* ==========================================================================
   AADI TYAGI — MASTERPORTFOLIO INTERACTIVE SCRIPT
   Smooth Page Loader · Mobile Navigation · Theme Toggle · Form Handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. THEME SWITCHER (Dark / Light Mode with localStorage & System Preference)
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme ? storedTheme : (systemPrefersDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    themeToggles.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-sun theme-icon-sun"></i>'
        : '<i class="fa-solid fa-moon theme-icon-moon"></i>';
    });
  };

  applyTheme(initialTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(targetTheme);
    });
  });

  // 2. PAGE LOADER FADE-OUT
  const loader = document.getElementById('pageLoader');
  if (loader) {
    const hideLoader = () => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    };

    // Hide loader after smooth delay (600ms)
    setTimeout(hideLoader, 600);
  }

  // 3. STICKY NAVBAR SCROLL & PROGRESS BAR
  const headerNav = document.getElementById('headerNav');
  let progressBar = document.getElementById('scrollProgress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);
  }

  const updateScroll = () => {
    const scrollY = window.scrollY;
    if (headerNav) {
      headerNav.classList.toggle('scrolled', scrollY > 20);
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();


  // 4. MOBILE MENU TOGGLE
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. CONTACT FORM SUBMISSION TO aadityagi1232@gmail.com
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending Message...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://formsubmit.co/ajax/aadityagi1232@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `Portfolio Message from ${name}: ${subject}`,
            message: message,
            _captcha: 'false',
            _template: 'table'
          })
        });

        if (response.ok) {
          contactForm.reset();
          submitBtn.textContent = 'Message Sent to Aadi ✓';
          submitBtn.style.background = '#059669';

          if (formSuccess) {
            formSuccess.style.display = 'block';
            formSuccess.textContent = '✓ Thank you! Your message has been sent directly to aadityagi1232@gmail.com.';
          }
        } else {
          // If AJAX response has issue, submit normally to ensure email goes through
          contactForm.submit();
        }
      } catch (err) {
        // Fallback for offline or CORS: submit natively
        contactForm.submit();
      }

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        if (formSuccess) {
          formSuccess.style.display = 'none';
        }
      }, 5000);
    });
  }

  // 5. DIRECTIONAL SCROLL REVEAL INTERSECTION OBSERVER
  const revealElements = document.querySelectorAll(
    '.scroll-reveal-up, .scroll-reveal-bottom, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-top, .scroll-reveal-forward, .scroll-reveal-back, .scroll-reveal-zoom'
  );

  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for older browsers without IntersectionObserver
      revealElements.forEach(el => el.classList.add('in-view'));
    }

    // Only activate initial above-the-fold hero content after page loader finishes
    setTimeout(() => {
      document.querySelectorAll(
        '.hero-split [class*="scroll-reveal-"], .page-hero-banner [class*="scroll-reveal-"], .contact-split-page .contact-avatar-side, .contact-split-page .contact-info-side'
      ).forEach(el => {
        el.classList.add('in-view');
      });
    }, 550);
  }

  // 6. HERO WORKING CARTOON 3D MOUSE PARALLAX TILT
  // 6. HERO WORKING CARTOONS 3D MOUSE PARALLAX TILT
  const cartoonArtElements = document.querySelectorAll('.hero-art-side, .page-hero-art, .contact-avatar-side');
  
  cartoonArtElements.forEach(artSide => {
    const wrap = artSide.querySelector('.illustration-wrap, .avatar-ring, .cartoon-board-container');
    if (!wrap) return;

    artSide.addEventListener('mousemove', (e) => {
      const rect = artSide.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const tiltX = (y * -12).toFixed(2);
      const tiltY = (x * 14).toFixed(2);
      
      wrap.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.02)`;
    });

    artSide.addEventListener('mouseleave', () => {
      wrap.style.transform = '';
    });
  });

});



