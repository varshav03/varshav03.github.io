(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const themeToggle = document.getElementById('themeToggle');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle — the <head> script has already applied any saved choice.
  if (themeToggle) {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const activeTheme = () =>
      root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
    const syncLabel = () => {
      const next = activeTheme() === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
    };
    syncLabel();

    themeToggle.addEventListener('click', () => {
      const next = activeTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncLabel();
    });

    // Follow the OS if the visitor hasn't made an explicit choice this session.
    prefersDark.addEventListener('change', () => {
      if (!root.getAttribute('data-theme')) syncLabel();
    });
  }

  // Scroll-driven header state + progress bar
  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', scrollY > 20);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';

    if (backToTop) backToTop.style.opacity = scrollY > 400 ? '1' : '0.4';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('menu-open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // Active nav link highlighting
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  // Contact form -> mailto handoff (static site, no backend)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:varsharamana03@gmail.com?subject=${subject}&body=${body}`;

      if (formNote) {
        formNote.textContent = 'Opening your email client…';
      }
    });
  }
})();
