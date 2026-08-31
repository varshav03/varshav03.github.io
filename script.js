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

  // Contact form -> Web3Forms (static site, no backend). The <form> also has a
  // plain action/method so it still works if this script fails to load.
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const defaultNote = formNote ? formNote.textContent : '';

    const setNote = (text, state) => {
      if (!formNote) return;
      formNote.textContent = text;
      formNote.classList.remove('is-success', 'is-error');
      if (state) formNote.classList.add(state);
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      setNote('Sending your message…');

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm)
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          contactForm.reset();
          setNote('Thanks — your message is on its way. Varsha will be in touch.', 'is-success');
        } else {
          setNote(
            (data && data.message) ||
              'Something went wrong. Please email varsharamana03@gmail.com directly.',
            'is-error'
          );
        }
      } catch (err) {
        setNote('Network error. Please email varsharamana03@gmail.com directly.', 'is-error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        if (formNote) {
          window.setTimeout(() => {
            if (!formNote.classList.contains('is-error')) {
              setNote(defaultNote);
            }
          }, 8000);
        }
      }
    });
  }
})();
