/* ==========================================================================
   Portfolio Douglas Dreer — App Script
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // DOM Ready
  // --------------------------------------------------------------------------
  function ready(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initNavbar();
    initScrollSpy();
    initFadeIn();
    initBackToTop();
    initContactForm();
    initTogglerIcon();
    initCloseMobileNav();
    initTypedText();
    footerYear();
    initThemeToggle();
    initDownloadCV();
    initBrokenLinkFallback();
  });

  // --------------------------------------------------------------------------
  // Navbar scroll effect
  // --------------------------------------------------------------------------
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          navbar.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Toggler icon toggle (hamburger <-> x)
  // --------------------------------------------------------------------------
  function initTogglerIcon() {
    var toggle = document.querySelector('.navbar-toggler');
    if (!toggle) return;

    var iconBars = toggle.querySelector('.bi-list');
    var iconClose = toggle.querySelector('.bi-x');
    if (!iconBars || !iconClose) return;

    var collapseEl = document.getElementById('navbarNav');
    if (!collapseEl) return;

    var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });

    collapseEl.addEventListener('show.bs.collapse', function () {
      iconBars.classList.add('d-none');
      iconClose.classList.remove('d-none');
    });

    collapseEl.addEventListener('hide.bs.collapse', function () {
      iconClose.classList.add('d-none');
      iconBars.classList.remove('d-none');
    });
  }

  // --------------------------------------------------------------------------
  // Close mobile nav on link click
  // --------------------------------------------------------------------------
  function initCloseMobileNav() {
    var collapseEl = document.getElementById('navbarNav');
    if (!collapseEl) return;

    var navLinks = collapseEl.querySelectorAll('.nav-link, .btn-orange');
    var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        bsCollapse.hide();
      });
    });
  }

  // --------------------------------------------------------------------------
  // Scroll Spy — active nav link
  // --------------------------------------------------------------------------
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var ticking = false;
    var offset = 100;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.scrollY + offset;

          var currentId = '';
          sections.forEach(function (section) {
            if (scrollY >= section.offsetTop) {
              currentId = section.getAttribute('id');
            }
          });

          document.querySelectorAll('.nav-link[href^="#"]').forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Fade-in on scroll
  // --------------------------------------------------------------------------
  function initFadeIn() {
    var items = document.querySelectorAll('.fade-in');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  // --------------------------------------------------------------------------
  // Back to Top
  // --------------------------------------------------------------------------
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          btn.classList.toggle('visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // Contact Form
  // --------------------------------------------------------------------------
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var feedback = document.getElementById('formFeedback');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;

        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#10b981';
          feedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
        }

        form.reset();
        form.classList.remove('was-validated');

        setTimeout(function () {
          if (feedback) feedback.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  // --------------------------------------------------------------------------
  // Typed text effect
  // --------------------------------------------------------------------------
  function initTypedText() {
    var el = document.getElementById('typedText');
    if (!el) return;

    var words = [
      'Java',
      'Kotlin',
      'Spring Boot',
      'Microsserviços',
      'Clean Code',
      'Arquitetura de Sistemas',
      'Quarkus',
      'Banco de Dados',

    ];
    var wordIdx = 0;
    var charIdx = 0;
    var deleting = false;
    var typeSpeed = 80;
    var delSpeed = 40;
    var pauseEnd = 1500;

    function randomizeNumber(min = 1, max = 100) {
      return parseInt(Math.random() * max) + min

    }

    function tick() {
      var word = words[wordIdx];

      if (!deleting) {
        charIdx++;
        el.textContent = word.substring(0, charIdx);
        if (charIdx === word.length) {
          deleting = true;
          setTimeout(tick, pauseEnd);
        } else {
          setTimeout(tick, typeSpeed);
        }
      } else {
        charIdx--;
        el.textContent = word.substring(0, charIdx);
        if (charIdx <= 0) {
          deleting = false;
          charIdx = 0;
          wordIdx = (wordIdx + 1) % words.length;
          setTimeout(tick, 400);
        } else {
          setTimeout(tick, delSpeed);
        }
      }
    }

    setTimeout(tick, 600);
  }

  // --------------------------------------------------------------------------
  // Footer year
  // --------------------------------------------------------------------------
  function footerYear() {
    var el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // Theme toggle (dark / light)
  // --------------------------------------------------------------------------
  function initThemeToggle() {
    var toggle = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    var root = document.documentElement;
    var storageKey = 'dd-theme';
    if (!toggle || !icon) return;

    function updateIcon(theme) {
      icon.classList.remove('bi-sun-fill', 'bi-moon-stars-fill');
      icon.classList.add(theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill');
      toggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'
      );
    }

    function applyTheme(theme, persist) {
      root.setAttribute('data-theme', theme);
      updateIcon(theme);
      if (persist) localStorage.setItem(storageKey, theme);
    }

    var savedTheme = localStorage.getItem(storageKey);
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    var initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    applyTheme(initialTheme, false);

    // Keep the toggle visible as a floating action button.
    toggle.classList.add('visible');

    toggle.addEventListener('click', function () {
      document.body.classList.add('theme-transitioning');
      var nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme, true);

      setTimeout(function () {
        document.body.classList.remove('theme-transitioning');
      }, 450);
    });
  }

  // --------------------------------------------------------------------------
  // Init Download CV
  // --------------------------------------------------------------------------
  function initDownloadCV() {

    var btn = document.getElementById('downloadCv');
    if (btn) { btn.addEventListener('click', window.downloadCV); }
  }

  // --------------------------------------------------------------------------
  // Redirect invalid internal links to 404 page
  // --------------------------------------------------------------------------
  function initBrokenLinkFallback() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) return;

      // Preserve normal browser behaviors (new tab, download, etc.)
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.hasAttribute('download')) return;

      var rawHref = link.getAttribute('href');
      if (!rawHref || rawHref[0] === '#') return;
      if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      event.preventDefault();

      fetch(url.pathname, { method: 'HEAD' })
        .then(function (response) {
          if (response.ok) {
            window.location.href = url.href;
            return;
          }

          window.location.href = './404.html';
        })
        .catch(function () {
          window.location.href = './404.html';
        });
    });
  }


})();
