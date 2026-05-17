/* ============================================================
   100K Soluções Digitais — script.js
   Interatividade e animações
   ============================================================ */

(function () {
  'use strict';

  // ── Current Year ─────────────────────────────────────────
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll behavior ────────────────────────────────
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile menu ───────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    // Add WhatsApp button clone inside mobile menu
    const waBtnOrig = document.querySelector('.btn-whatsapp-nav');
    if (waBtnOrig) {
      const waClone = waBtnOrig.cloneNode(true);
      waClone.classList.add('btn-whatsapp-nav'); // keep styles
      navLinks.appendChild(waClone);
    }

    const closeNavMenu = () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNavMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        closeNavMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeNavMenu();
      }
    });

    // Close mobile menu when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
        closeNavMenu();
      }
    });
  }

  // ── Active nav link on scroll ─────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  onScroll(); // run once on load

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        current = sec.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  // ── Intersection Observer: fade-up & reveal ───────────────
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation plays once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.fade-up, .reveal').forEach(el => {
    observer.observe(el);
  });

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── WhatsApp float: hide on footer, show elsewhere ───────
  const waFloat = document.getElementById('whatsappFloat');
  const footer  = document.querySelector('.footer');

  if (waFloat && footer) {
    const waObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        waFloat.style.opacity = entry.isIntersecting ? '0' : '1';
        waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.1 });

    waObserver.observe(footer);
  }

  // ── Service cards: tilt effect on desktop ─────────────────
  let tiltCardsInitialized = false;
  const setupTiltCards = () => {
    if (tiltCardsInitialized) return;

    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
      };

      const onMouseLeave = () => {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });

    tiltCardsInitialized = true;
  };

  if (window.innerWidth > 900) {
    setupTiltCards();
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      setupTiltCards();
    }
  });

  // ── Counter animation for hero stats ─────────────────────
  function animateCounter(el, target, suffix, duration = 1400) {
    const startTime = performance.now();
    const startVal  = 0;

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + eased * target);
      el.textContent = '+' + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Trigger counters when hero stats become visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNums = entry.target.querySelectorAll('.stat-num');
          statNums.forEach(el => {
            const text = el.textContent.trim();
            if (text.includes('200')) animateCounter(el, 200, '', 1400);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ── Parallax on hero orbs (subtle) ───────────────────────
  const orbs = document.querySelectorAll('.hero-orb');
  if (orbs.length && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 8;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    }, { passive: true });
  }

  // ── Navbar active link CSS ────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: #fff !important;
      background: rgba(37, 99, 235, 0.18) !important;
    }
  `;
  document.head.appendChild(style);

  // ── Page load: trigger hero animations ───────────────────
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 100);
    });
    document.querySelectorAll('.trust-bar.fade-up').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 700);
    });
    document.querySelector('.hero-visual.fade-up')?.classList.add('visible');
  });

})();