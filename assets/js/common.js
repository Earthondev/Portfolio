(() => {
  function initMobileMenu(options = {}) {
    const buttonSelector = options.buttonSelector || '#mobile-menu-btn';
    const menuSelector = options.menuSelector || '#mobile-menu';
    const lockScroll = Boolean(options.lockScroll);
    const closeOnBackdrop = Boolean(options.closeOnBackdrop);

    const button = document.querySelector(buttonSelector);
    const menu = document.querySelector(menuSelector);
    if (!button || !menu) return null;

    const icon = button.querySelector('i');
    let isOpen = !menu.classList.contains('hidden');

    if (!button.getAttribute('type')) {
      button.setAttribute('type', 'button');
    }

    if (menu.id && !button.hasAttribute('aria-controls')) {
      button.setAttribute('aria-controls', menu.id);
    }

    function syncButton(open) {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

      if (icon) {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-xmark', open);
      }
    }

    function setOpen(open) {
      isOpen = open;
      menu.classList.toggle('hidden', !open);
      if (lockScroll) {
        document.body.style.overflow = open ? 'hidden' : '';
      }
      syncButton(open);
    }

    button.addEventListener('click', () => setOpen(!isOpen));

    menu.querySelectorAll('a[href]').forEach((link) => {
      const linkPath = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').pop() || 'index.html';
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';

      if (linkPath === currentPath) {
        link.setAttribute('aria-current', 'page');
      }

      link.addEventListener('click', () => setOpen(false));
    });

    if (closeOnBackdrop) {
      menu.addEventListener('click', (event) => {
        if (event.target === menu) setOpen(false);
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) {
        setOpen(false);
        button.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (isOpen && window.matchMedia('(min-width: 768px)').matches) {
        setOpen(false);
      }
    });

    syncButton(isOpen);
    return { setOpen };
  }

  function initRevealObserver(options = {}) {
    const selector = options.selector || '.section-reveal';
    const threshold = typeof options.threshold === 'number' ? options.threshold : 0.1;
    const onEnter = typeof options.onEnter === 'function' ? options.onEnter : ((element) => {
      element.classList.add('visible');
    });

    const nodes = Array.from(document.querySelectorAll(selector));
    if (!nodes.length) return null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEnter(entry.target);
        }
      });
    }, { threshold });

    nodes.forEach((node) => observer.observe(node));
    return observer;
  }

  function initNavbarScroll(options = {}) {
    const selector = options.selector || '#navbar';
    const topBackground = options.topBackground || 'rgba(251, 250, 247, 0.72)';
    const scrolledBackground = options.scrolledBackground || 'rgba(251, 250, 247, 0.92)';
    const topBlur = options.topBlur || 'blur(12px)';
    const scrolledBlur = options.scrolledBlur || 'blur(14px)';
    const threshold = typeof options.threshold === 'number' ? options.threshold : 20;

    const navbar = document.querySelector(selector);
    if (!navbar) return null;

    function applyState(isScrolled) {
      navbar.classList.toggle('shadow-lg', isScrolled);
      navbar.style.background = isScrolled ? scrolledBackground : topBackground;
      navbar.style.backdropFilter = isScrolled ? scrolledBlur : topBlur;
    }

    window.addEventListener('scroll', () => {
      applyState(window.scrollY > threshold);
    });

    applyState(window.scrollY > threshold);
    return navbar;
  }

  window.PortfolioCommon = {
    initMobileMenu,
    initRevealObserver,
    initNavbarScroll
  };
})();
