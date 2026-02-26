(() => {
  function initMobileMenu(options = {}) {
    const buttonSelector = options.buttonSelector || '#mobile-menu-btn';
    const menuSelector = options.menuSelector || '#mobile-menu';
    const lockScroll = Boolean(options.lockScroll);
    const closeOnBackdrop = Boolean(options.closeOnBackdrop);

    const button = document.querySelector(buttonSelector);
    const menu = document.querySelector(menuSelector);
    if (!button || !menu) return null;

    let isOpen = !menu.classList.contains('hidden');

    function setOpen(open) {
      isOpen = open;
      menu.classList.toggle('hidden', !open);
      if (lockScroll) {
        document.body.style.overflow = open ? 'hidden' : '';
      }
    }

    button.addEventListener('click', () => setOpen(!isOpen));

    if (closeOnBackdrop) {
      menu.addEventListener('click', (event) => {
        if (event.target === menu) setOpen(false);
      });
    }

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
    const topBackground = options.topBackground || 'rgba(10, 10, 15, 0.6)';
    const scrolledBackground = options.scrolledBackground || 'rgba(10, 10, 15, 0.85)';
    const topBlur = options.topBlur || 'blur(12px)';
    const scrolledBlur = options.scrolledBlur || 'blur(20px)';
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
