// ---------- State ----------
let projects = [];
let services = [];
let currentFilter = 'all';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Performance optimization: Cache DOM elements
const domCache = new Map();

// ---------- Helpers ----------
const $ = (sel, root = document) => {
  if (domCache.has(sel)) return domCache.get(sel);
  const element = (root && root.querySelector) ? root.querySelector(sel) : null;
  if (element) domCache.set(sel, element);
  return element;
};
const $$ = (sel, root = document) => (root && root.querySelectorAll) ? Array.from(root.querySelectorAll(sel)) : [];

// บอกว่าอยู่หน้าไหน (ระบุให้ชัดขึ้น กัน false-positive)
const onPortfolio =
  location.pathname.endsWith('/portfolio.html') ||
  location.pathname.endsWith('/index.html') ||
  location.pathname === '/';

// ---------- Elements ----------
const projectsContainer = document.getElementById('projects-container');
const servicesContainer = document.getElementById('services-container');
const skillsContainer = document.getElementById('skills-container');
const certificationsContainer = document.getElementById('certifications-container');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navbarNav = document.getElementById('navbar-nav');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const themeToggle = document.getElementById('theme-toggle');

// ---------- Init ----------
const isCaseStudy = location.pathname.includes('/case-studies/');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded fired - Script version:', Date.now());
  console.log('📍 Current page:', location.pathname);
  console.log('🔧 Script loaded from:', document.currentScript?.src || 'unknown');
  console.log('🆔 Script ID:', Math.random().toString(36).substr(2, 9));
  console.log('🔍 Script URL params:', new URLSearchParams(document.currentScript?.src?.split('?')[1] || ''));
  console.log('📁 Is Case Study:', isCaseStudy);
  console.log('📦 projectsContainer:', projectsContainer);

  // หน้า case study: ไม่ต้อง loadData (ไม่ใช้ projects/services)
  if (isCaseStudy) {
    console.log('📄 Case Study page - skipping JSON loading');
    setupEventListeners();
    setupNavbar();
    setupScrollToTop();
    setupThemeToggle();
    setupKeyboardNavigation();
    applyTheme();
    return; // <- ตัดจบ ไม่เรียก loadData()
  }

  // หน้า about: โหลดเฉพาะ services data
  if (location.pathname.includes('about.html')) {
    console.log('📄 About page - loading services data');
    setupEventListeners();
    setupNavbar();
    setupScrollToTop();
    setupThemeToggle();
    setupKeyboardNavigation();
    applyTheme();
    // Load data for about page
    setTimeout(() => {
      console.log('🎯 Loading about page data...');
      loadAboutPageData();
    }, 100);
    return;
  }

  // หน้าอื่นค่อยโหลด JSON
  console.log('🎯 Setting up page...');
  setupModalShells();      // เรียกก่อน
  showLoadingStates();
  setTimeout(() => {
    console.log('🎯 Calling loadData...');
    loadData();
  }, 100);
  setupEventListeners();
  setupNavbar();
  setupScrollToTop();
  setupThemeToggle();
  setupKeyboardNavigation();
  trackPageEvents();
  applyTheme();
});




// ---------- Removed preload for better performance ----------

// ---------- Analytics Removed ----------

// Track page-specific events
function trackPageEvents() {
  // All analytics tracking removed
}



// ---------- Theme ----------
function setupThemeToggle() {
  (function () {
    const KEY = 'theme';
    const btn = document.getElementById('theme-toggle');
    const icon = btn?.querySelector('i');
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const order = ['auto', 'light', 'dark'];

    function setMeta(isLight) {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
      meta.setAttribute('content', isLight ? '#ffffff' : '#111111');
    }
    function apply(theme) {
      const root = document.documentElement;
      root.classList.toggle('light-theme', theme === 'light' || (theme === 'auto' && !mql.matches));
      root.dataset.theme = theme;
      const isLight = theme === 'light' || (theme === 'auto' && !mql.matches);
      setMeta(isLight);
      // อัปเดตไอคอน/ป้าย
      if (icon) {
        icon.className = isLight ? 'fa-solid fa-sun' : (theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-circle-half-stroke');
      }
      btn?.setAttribute('aria-label', `Theme: ${theme[0].toUpperCase() + theme.slice(1)}`);
      btn?.setAttribute('title', `Theme: ${theme[0].toUpperCase() + theme.slice(1)}`);
    }

    const saved = localStorage.getItem(KEY) || 'auto';
    apply(saved);
    mql.addEventListener?.('change', () => { if ((localStorage.getItem(KEY) || 'auto') === 'auto') apply('auto'); });

    btn?.addEventListener('click', () => {
      const cur = localStorage.getItem(KEY) || 'auto';
      const next = order[(order.indexOf(cur) + 1) % order.length];
      localStorage.setItem(KEY, next);
      apply(next);
    });
  })();
}

function setTheme(next) {
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  currentTheme = next;
  const icon = themeToggle?.querySelector('i');
  if (icon) icon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function applyTheme() {
  const root = document.documentElement;
  const icon = themeToggle?.querySelector('i');
  root.setAttribute('data-theme', currentTheme);
  if (icon) icon.className = currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// ---------- Data ----------
// --- helper: สร้าง URL แบบ absolute จาก root path ---
const jsonURL = (name) => {
  const file = name.endsWith('.json') ? name : `${name}.json`;

  // Detect if we are in a subdirectory (like /case-studies/)
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const isCaseStudy = pathSegments.includes('case-studies');

  // GH Pages usually adds repository name as first segment, e.g. /Portfolio/
  // If we are in case-studies, we need to go up one level relative to the HTML file location
  if (isCaseStudy) {
    return '../' + file;
  }

  // If we are at root (index.html, portfolio.html), just use the file name
  // This works for both localhost and GH Pages /Portfolio/ root
  return file;
};

async function loadJSON(name) {
  return await safeAsync(async () => {
    const url = `${jsonURL(name)}?v=${Date.now()}`;
    console.log('📥 Loading JSON:', url);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    console.log('📥 JSON data loaded:', data);
    return data;
  }, () => {
    console.warn(`Fallback data for ${name}`);
    if (String(name).includes('projects')) return getFallbackProjects();
    if (String(name).includes('services')) return getFallbackServices();
    return [];
  });
}

// Fallback data for when JSON files fail to load
function getFallbackProjects() {
  return [{
    id: 'fallback',
    title: 'Sample Project',
    year: 2025,
    summary: 'This is a fallback project shown when the main data fails to load.',
    role: ['Developer'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    highlights: ['Responsive design', 'Modern UI'],
    coverImage: {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
      alt: 'Fallback project image'
    },
    gallery: [],
    links: { live: '#', repo: '#' },
    tags: ['web', 'fallback'],
    status: 'Active',
    caseStudy: false
  }];
}

function getFallbackServices() {
  return {
    services: [{
      title: 'Web Development',
      description: 'Building modern web applications',
      icon: 'fas fa-code'
    }],
    skills: [{
      name: 'HTML',
      level: 'high',
      icon: 'fab fa-html5'
    }, {
      name: 'CSS',
      level: 'high',
      icon: 'fab fa-css3-alt'
    }, {
      name: 'JavaScript',
      level: 'medium',
      icon: 'fab fa-js'
    }],
    certifications: ['Sample Certification']
  };
}

async function loadData() {
  try {
    console.log('📊 Loading data from JSON files...');
    console.log('🔍 Current URL:', location.href);
    console.log('📄 Page:', location.pathname);
    console.log('🆔 Script ID:', Math.random().toString(36).substr(2, 9));
    console.log('🔍 Script URL params:', new URLSearchParams(document.currentScript?.src?.split('?')[1] || ''));
    const page = location.pathname.split('/').pop() || 'index.html';

    const isCaseStudy = location.pathname.includes('/case-studies/');
    console.log('📁 Is Case Study:', isCaseStudy);
    console.log('📄 Current page:', page);

    if (page === 'about.html') {
      // หน้า ABOUT: เอาเฉพาะ services.json เพื่อ skills/certifications
      const servicesData = await loadJSON('services.json');
      console.log('Services data:', servicesData);

      services = servicesData.services || [];
      renderServices(); // ถ้ามี section services ในหน้า about (ถ้าไม่มีจะไม่ทำอะไร)
      renderSkills(servicesData.skills || []);
      renderCertifications(servicesData.certifications || []);

      if (!services?.length) showFallbackMessage('services');
      return; // จบแค่ไฟล์เดียว
    }

    // ถ้าเป็นหน้า case study คุณอาจไม่ต้องโหลด projects เลย
    if (isCaseStudy) {
      try {
        const servicesData = await loadJSON('services.json'); // สำหรับ skills/cta ถ้าหน้านั้นใช้
        renderSkills(servicesData.skills || []);
        renderCertifications(servicesData.certifications || []);
      } catch (e) {
        console.warn('Case study: skip related data gracefully');
      }
      return;
    }

    // หน้าอื่น: โหลดคู่
    const [projectsData, servicesData] = await Promise.all([
      loadJSON('projects.json'),
      loadJSON('services.json')
    ]);

    console.log('📊 Projects data:', projectsData);
    console.log('📊 Services data:', servicesData);
    console.log('📊 Projects length:', projectsData?.length);

    projects = projectsData;
    services = servicesData.services || [];

    console.log('🎯 About to render projects...');
    renderProjects();
    renderServices();
    renderSkills(servicesData.skills || []);
    renderCertifications(servicesData.certifications || []);

    if (!projects?.length) showFallbackMessage('projects');
    if (!services?.length) showFallbackMessage('services');

  } catch (err) {
    console.error('Error loading data:', err);
    showFallbackMessage('general');
  }
}

function showLoadingStates() {
  console.log('🔄 showLoadingStates called');
  console.log('📦 projectsContainer:', projectsContainer);
  if (projectsContainer) {
    console.log('✅ Showing skeleton loading states');
    projectsContainer.innerHTML = `
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    `;
  } else {
    console.error('❌ projectsContainer not found for skeleton loading');
  }

  if (skillsContainer) {
    skillsContainer.innerHTML = `
      <div class="skeleton-card">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    `;
  }
}

function hideLoadingStates() {
  // Loading states will be replaced by actual content
  // No need to explicitly hide them
}

// ---------- Fallback ----------
function showFallbackMessage(type) {
  const map = { projects: projectsContainer, services: servicesContainer };
  const container = map[type];
  if (!container) return;
  container.innerHTML = `
    <div class="fallback-message">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Unable to load ${type}</h3>
      <p>Please check your connection and refresh the page.</p>
      <button class="btn-primary" type="button">
        <i class="fas fa-redo"></i> Refresh
      </button>
    </div>`;
  container.querySelector('button')?.addEventListener('click', () => location.reload());
}

// ---------- Navbar / Mobile menu ----------
function setupNavbar() {
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (mobileMenuBtn && navbarNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navbarNav.classList.toggle('open'); // <-- ใช้ .open ให้ตรง CSS
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navbarNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        if (navbarNav.classList.contains('open')) {
          navbarNav.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      })
    );
  }
}

// ---------- Scroll to top ----------
function setupScrollToTop() {
  if (!scrollToTopBtn) return;
  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
  });
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Keyboard Navigation ----------
function setupKeyboardNavigation() {
  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Tab navigation for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && document.querySelector('.modal.active')) {
      handleModalTabNavigation(e);
    }
  });

  // Arrow keys for gallery navigation
  document.addEventListener('keydown', (e) => {
    const galleryModal = document.querySelector('.gallery-modal.active');
    if (!galleryModal) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevBtn = galleryModal.querySelector('.gallery-nav.prev');
      if (prevBtn) prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextBtn = galleryModal.querySelector('.gallery-nav.next');
      if (nextBtn) nextBtn.click();
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

function handleModalTabNavigation(e) {
  const modal = document.querySelector('.modal.active');
  if (!modal) return;

  // Safe querySelectorAll with null check
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
}

// ---------- UI events ----------
function setupEventListeners() {
  // Modern event delegation for better performance
  delegateEvent('#searchInput', 'input', debounce(handleSearch, 300));
  delegateEvent('.filter-btn', 'click', handleFilter);

  // Legacy support for existing elements
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
  filterButtons.forEach((btn) => btn.addEventListener('click', handleFilter));
}

function handleSearch(e) {
  const q = (e.target.value || '').toLowerCase();
  const filtered = projects.filter((p) =>
    [p.title, p.summary]
      .filter(Boolean)
      .some((t) => String(t).toLowerCase().includes(q)) ||
    (Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(q))) ||
    (Array.isArray(p.stack) && p.stack.some((t) => String(t).toLowerCase().includes(q)))
  );
  renderProjects(filtered);
}

function handleFilter(e) {
  const filter = e.currentTarget?.dataset?.filter || 'all';
  currentFilter = filter;

  filterButtons.forEach((b) => b.classList.remove('active'));
  e.currentTarget.classList.add('active');

  const filtered =
    filter === 'all'
      ? projects
      : projects.filter((p) => Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(filter.toLowerCase())));
  renderProjects(filtered);
}

// ---------- Render: Projects ----------
function renderProjects(list = projects) {
  console.log('🎨 renderProjects called with:', list);
  console.log('📦 projectsContainer:', projectsContainer);

  if (!projectsContainer) {
    console.error('❌ projectsContainer not found!');
    return;
  }

  // For home page, show only featured projects (max 3)
  const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  const displayList = isHomePage ? list.slice(0, 3) : list;

  console.log('📄 Is Home Page:', isHomePage);
  console.log('📋 Display List:', displayList);

  // Clear skeleton loading states
  const skeletons = projectsContainer.querySelectorAll('.skel');
  skeletons.forEach(skel => skel.remove());

  const html = displayList.map(toCardHTML).join('');
  console.log('🎨 Generated HTML length:', html.length);

  projectsContainer.innerHTML = html;
  initializeRevealAnimations();
  attachCardEvents(displayList);
}

function toCardHTML(p) {
  console.log('🎨 toCardHTML called for:', p.title);
  const hasCaseStudy = !!p.caseStudy;
  const cover = p.coverImage || {};
  const live = p.links?.live || '#';
  const repo = p.links?.repo || '#';

  return `
    <div class="portfolio-item reveal-scale" data-project-id="${p.id}">
      <div class="portfolio-image-container">
        <img src="${cover.src || ''}" alt="${cover.alt || p.title || 'Project'}" class="portfolio-image" loading="lazy">
        <div class="portfolio-overlay">
          <button class="view-details-btn" type="button" aria-label="View project details">
            <i class="fas fa-eye"></i>
            View Details
          </button>
        </div>
      </div>
      <div class="portfolio-content">
        <div class="portfolio-header">
          <h3 class="portfolio-title">${p.title || ''}</h3>
          <span class="portfolio-year">${p.year || ''}</span>
        </div>
        <p class="portfolio-summary">${p.summary || ''}</p>
        <div class="portfolio-meta">
          <div class="portfolio-role">
            <span class="meta-label">Role:</span>
            ${(p.role || []).map((r) => `<span>${r}</span>`).join('')}
          </div>
          <div class="portfolio-stack">
            <span class="meta-label">Tech:</span>
            ${(p.stack || []).map((s) => `<span>${s}</span>`).join('')}
          </div>
        </div>
        <div class="portfolio-actions">
          <a href="${live}" target="_blank" rel="noopener" class="btn-primary" aria-label="View live demo">
            <i class="fas fa-external-link-alt"></i>
            Live Demo
          </a>
          <a href="${repo}" target="_blank" rel="noopener" class="btn-secondary" aria-label="View source code">
            <i class="fab fa-github"></i>
            Code
          </a>
          ${hasCaseStudy ? `
          <a href="/case-studies/${p.slug}.html" class="btn-case-study" aria-label="Read case study">
            <i class="fas fa-book-open"></i>
            Case Study
          </a>` : ''}
        </div>
        ${Array.isArray(p.gallery) && p.gallery.length ? `
          <button class="btn-gallery" type="button" data-project-id="${p.id}" aria-label="View project screenshots">
            <i class="fas fa-images"></i> Screenshots (${p.gallery.length})
          </button>` : ''}
      </div>
    </div>`;
}

function attachCardEvents(list) {
  // Guard: ผูกอีเวนต์เฉพาะหน้า portfolio ที่มี projects container
  if (!onPortfolio || !projectsContainer) {
    console.debug('Not on portfolio page or no projects container, skipping card events');
    return;
  }

  list.forEach((p) => {
    const card = $(`[data-project-id="${CSS.escape(String(p.id))}"]`);
    if (!card) return;

    const viewBtn = $('.view-details-btn', card);
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        openProjectModal(p);
      });
    }

    const galleryBtn = $('.btn-gallery', card);
    if (galleryBtn) {
      galleryBtn.addEventListener('click', () => {
        openGalleryModal(p);
      });
    }
  });
}

// ---------- Render: Services / Skills / Certs ----------
function renderServices() {
  if (!servicesContainer) return;

  // Clear skeleton loading states
  const skeletons = servicesContainer.querySelectorAll('.skel');
  skeletons.forEach(skel => skel.remove());

  servicesContainer.innerHTML = services
    .map(
      (s) => `
      <div class="service-card reveal">
        <img class="service-image" src="${s.image || ''}" alt="${s.title || 'Service'}" loading="lazy">
        <div class="service-icon"><i class="${s.icon || 'fas fa-asterisk'}"></i></div>
        <h3 class="service-title">${s.title || ''}</h3>
        <p class="service-desc">${s.description || ''}</p>
        ${s.result ? `<div class="service-result"><strong>ผลลัพธ์:</strong> ${s.result}</div>` : ''}
      </div>`
    )
    .join('');
}

function renderSkills(skills) {
  console.log('renderSkills called with:', skills);
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) {
    console.log('ℹ️  No skills container found - this is normal for portfolio page');
    return;
  }

  // Clear skeleton loading states and fallback text
  const skeletons = skillsContainer.querySelectorAll('.skel');
  skeletons.forEach(skel => skel.remove());

  // Remove fallback text
  const fallback = skillsContainer.querySelector('[data-fallback]');
  if (fallback) {
    fallback.remove();
  }

  if (!skills.length) {
    console.log('No skills to render');
    return;
  }

  // Check if we're on home page (skills summary) or about page (full skills)
  const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  const isAboutPage = window.location.pathname.includes('about.html');

  if (isHomePage) {
    // Home page: Show top skills only (max 6)
    const topSkills = skills.slice(0, 6);
    skillsContainer.innerHTML = topSkills
      .map((sk) => {
        return `
          <div class="skill-card">
            <i class="${sk.icon || 'fas fa-check'} skill-icon"></i>
            <span>${sk.name}</span>
            <div class="skill-level">
              <div class="skill-bar ${sk.level}"></div>
            </div>
          </div>
        `;
      })
      .join('');
  } else if (isAboutPage) {
    // About page: Show full skills with groups
    console.log("🎯 About page: Rendering skills with groups");
    const groups = groupSkillsByCategory(skills);
    console.log("📊 Skills groups:", groups);

    let html = '';
    for (const [group, items] of Object.entries(groups)) {
      if (!items.length) continue;
      html += `
        <div class="skills-group reveal">
          <h3>${group}</h3>
          <div class="skills-grid">
            ${items
          .map((sk) => {
            const pct = sk.level === 'high' ? 85 : sk.level === 'medium' ? 50 : 25;
            return `
                  <div class="skill-card">
                    <i class="${sk.icon || 'fas fa-check'} skill-icon"></i>
                    <span>${sk.name}</span>
                    <div class="skill-level">
                      <div class="skill-bar ${sk.level}" title="${pct}% Proficiency"></div>
                    </div>
                  </div>`;
          })
          .join('')}
          </div>
        </div>`;
    }
    console.log("🎨 Setting skills container HTML:", html.length, "characters");
    skillsContainer.innerHTML = html;

    // Animate donuts after mount
    requestAnimationFrame(() => {
      document.querySelectorAll('.skill-progress .progress').forEach((c) => {
        // map by class (same as your CSS)
        const offset =
          c.classList.contains('high') ? 47.1 :
            c.classList.contains('medium') ? 157 :
              235.5; // low
        c.style.transition = 'stroke-dashoffset 0.8s ease';
        c.style.strokeDashoffset = String(offset);
      });
    });
  }
}

// Group skills by category
function groupSkillsByCategory(skills) {
  const groups = {};
  skills.forEach(skill => {
    const group = skill.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(skill);
  });
  return groups;
}

function renderCertifications(certs) {
  console.log('renderCertifications called with:', certs);
  const certificationsContainer = document.getElementById('certifications-container');
  if (!certificationsContainer) {
    console.debug('ℹ️  No certifications container found - this is normal for portfolio page');
    return;
  }

  // Remove fallback text
  const fallback = certificationsContainer.querySelector('[data-fallback]');
  if (fallback) {
    fallback.remove();
  }

  // Only show certifications on About page, not on Home page
  const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  const isAboutPage = window.location.pathname.includes('about.html');

  console.log('isHomePage:', isHomePage, 'isAboutPage:', isAboutPage);

  if (isHomePage) {
    certificationsContainer.innerHTML = '';
    return;
  }

  if (!isAboutPage) {
    certificationsContainer.innerHTML = '';
    return;
  }

  certificationsContainer.innerHTML = (certs || [])
    .map(
      (t) => `
      <div class="cert-card reveal">
        <i class="fas fa-certificate cert-icon" aria-hidden="true"></i>
        <span>${t}</span>
      </div>`
    )
    .join('');
}

// ---------- Modals ----------
function setupModalShells() {
  // กันสร้าง modal ซ้ำ (ป้องกัน querySelectorAll บน null/โครงสร้างเพี้ยน)
  if (document.getElementById('project-modal') || document.getElementById('gallery-modal')) {
    console.debug('Modals already exist, skipping creation');
    return;
  }

  // Project modal
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div id="project-modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-content">
        <button class="modal-close" type="button" aria-label="Close modal"><i class="fas fa-times"></i></button>
        <div class="modal-body">
          <div class="modal-image-container"><img id="modal-image" alt=""></div>
          <div class="modal-info">
            <h2 id="modal-title"></h2>
            <div class="modal-meta"><span id="modal-year"></span><span id="modal-status" style="margin-left:.75rem"></span></div>
            <p id="modal-summary"></p>
            <div class="modal-details">
              <div class="modal-role"><h4>Role</h4><p id="modal-role"></p></div>
              <div class="modal-stack"><h4>Tech Stack</h4><p id="modal-stack"></p></div>
            </div>
            <div class="modal-highlights"><h4>Key Features</h4><ul id="modal-highlights"></ul></div>
            <div id="modal-tags" class="modal-tags"></div>
            <div class="modal-links">
              <a id="modal-live" href="#" target="_blank" rel="noopener" class="modal-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>
              <a id="modal-repo" href="#" target="_blank" rel="noopener" class="modal-link"><i class="fab fa-github"></i> View Code</a>
            </div>
          </div>
        </div>
      </div>
    </div>`
  );

  // Gallery modal
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div id="gallery-modal" class="modal" role="dialog" aria-modal="true" aria-label="Project gallery">
      <div class="modal-content">
        <button class="modal-close" type="button" aria-label="Close gallery"><i class="fas fa-times"></i></button>
        <div class="modal-body">
          <div class="gallery-wrap"></div>
        </div>
      </div>
    </div>`
  );

  // generic close handlers (delegation)
  document.body.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.modal-close');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal');
      if (modal) closeModal(modal);
    }
  });

  // click outside content to close
  document.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal && e.target === modal) closeModal(modal);
  });

  // esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach((m) => closeModal(m));
    }
  });
}

function openProjectModal(p) {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const img = modal.querySelector('#modal-image');
  const title = modal.querySelector('#modal-title');
  const year = modal.querySelector('#modal-year');
  const status = modal.querySelector('#modal-status');
  const summary = modal.querySelector('#modal-summary');
  const role = modal.querySelector('#modal-role');
  const stack = modal.querySelector('#modal-stack');
  const highlights = modal.querySelector('#modal-highlights');
  const tags = modal.querySelector('#modal-tags');
  const live = modal.querySelector('#modal-live');
  const repo = modal.querySelector('#modal-repo');

  const cover = p.coverImage || {};
  img.src = cover.src || '';
  img.alt = cover.alt || p.title || 'Project image';
  title.textContent = p.title || '';
  year.textContent = p.year || '';
  status.textContent = p.status || '';
  summary.textContent = p.summary || '';
  role.textContent = (p.role || []).join(', ');
  stack.textContent = (p.stack || []).join(', ');
  highlights.innerHTML = (p.highlights || []).map((h) => `<li>${h}</li>`).join('');
  tags.innerHTML = (p.tags || []).map((t) => `<span class="modal-tag">${t}</span>`).join('');
  live.href = p.links?.live || '#';
  repo.href = p.links?.repo || '#';

  openModal(modal);
}

function openGalleryModal(p) {
  console.log('🖼️ openGalleryModal called for:', p.title);

  // Guard: ตรวจสอบว่าอยู่หน้า portfolio และมี modal
  if (!onPortfolio) {
    console.debug('Not on portfolio page, skipping gallery modal');
    return;
  }

  // ต้องมี data ก่อน
  if (!p || !Array.isArray(p.gallery) || p.gallery.length === 0) {
    console.warn('Gallery data missing. Skipping.');
    return;
  }

  // ถ้ายังไม่มี shell ให้สร้างก่อน
  let modal = document.getElementById('gallery-modal');
  if (!modal) {
    console.log('🖼️ Modal not found, creating shell...');
    setupModalShells();
    modal = document.getElementById('gallery-modal');
    if (!modal) {
      console.warn('Failed to create gallery modal shell. Skipping.');
      return;
    }
  }

  const wrap = $('.gallery-wrap', modal);
  console.log('🖼️ Gallery wrap found:', wrap);

  if (!wrap) {
    console.warn('Gallery wrap container not found. Skipping.');
    return;
  }

  wrap.innerHTML = `
    <div class="gallery-main">
      <img id="gallery-main-img" src="${p.gallery[0].src}" alt="${p.gallery[0].alt}">
      ${p.gallery.length > 1 ? `
        <button class="gallery-nav prev" id="gallery-prev"><i class="fas fa-chevron-left"></i></button>
        <button class="gallery-nav next" id="gallery-next"><i class="fas fa-chevron-right"></i></button>` : ''}
    </div>
    ${p.gallery.length > 1 ? `
      <div class="gallery-dots" id="gallery-dots">
        ${p.gallery.map((_, i) => `<div class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
      </div>` : ''}
    <div class="gallery-thumbnails" id="gallery-thumbnails">
      ${p.gallery
      .map(
        (g, i) => `
        <figure class="gallery-item ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${g.src}" alt="${g.alt}" loading="lazy">
          <figcaption>${g.alt}</figcaption>
        </figure>`
      )
      .join('')}
    </div>`;

  let current = 0;
  const mainImg = modal.querySelector('#gallery-main-img');
  const thumbs = modal.querySelector('#gallery-thumbnails');
  const dots = modal.querySelectorAll('.gallery-dot');
  const prev = modal.querySelector('#gallery-prev');
  const next = modal.querySelector('#gallery-next');

  console.log('🖼️ Gallery elements:', { mainImg, thumbs, dots: dots.length, prev, next });

  function update(index) {
    current = (index + p.gallery.length) % p.gallery.length;
    const img = p.gallery[current];
    console.log('🖼️ Updating to image:', current, img.src);

    if (mainImg) {
      mainImg.src = img.src;
      mainImg.alt = img.alt;
    }

    // Safe updates with helper functions
    if (thumbs) {
      const thumbItems = thumbs.querySelectorAll('.gallery-item');
      thumbItems.forEach((el, i) => el.classList.toggle('active', i === current));
    }
    if (dots.length > 0) {
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }

  // Safe event listeners with helper functions
  if (prev) {
    prev.addEventListener('click', () => {
      console.log('🖼️ Previous clicked');
      update(current - 1);
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      console.log('🖼️ Next clicked');
      update(current + 1);
    });
  }

  if (thumbs) {
    const thumbItems = thumbs.querySelectorAll('.gallery-item');
    thumbItems.forEach((el) =>
      el.addEventListener('click', () => {
        console.log('🖼️ Thumbnail clicked:', el.dataset.index);
        update(parseInt(el.dataset.index, 10));
      })
    );
  }

  if (dots.length > 0) {
    dots.forEach((d) =>
      d.addEventListener('click', () => {
        console.log('🖼️ Dot clicked:', d.dataset.index);
        update(parseInt(d.dataset.index, 10));
      })
    );
  }

  openModal(modal);
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ---------- Reveal on scroll ----------
function initializeRevealAnimations() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  // Fallback for no IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('show'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el) => io.observe(el));
}

// ---------- Utils ----------
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Modern async/await with error handling
async function safeAsync(fn, fallback = null) {
  try {
    return await fn();
  } catch (error) {
    console.warn('Safe async error:', error);
    return fallback;
  }
}

// Performance: Intersection Observer for lazy loading
function createIntersectionObserver(callback, options = {}) {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return { observe: () => { }, unobserve: () => { } };
  }

  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  });
}

// Modern event delegation
function delegateEvent(selector, event, handler) {
  document.addEventListener(event, (e) => {
    if (e.target.matches(selector)) {
      handler(e);
    }
  });
}

// ---------- Script Load Verification ----------
console.log('✅ script.js loaded successfully - syntax error fixed at', new Date().toISOString());
// Load data specifically for about page
async function loadAboutPageData() {
  try {
    console.log('📊 Loading services data for about page...');
    const servicesData = await loadJSON('services.json');
    console.log('Services data loaded:', servicesData);

    if (servicesData && servicesData.skills) {
      console.log('🎨 Rendering skills:', servicesData.skills.length);
      renderSkills(servicesData.skills);
    }

    if (servicesData && servicesData.certifications) {
      console.log('🏆 Rendering certifications:', servicesData.certifications.length);
      renderCertifications(servicesData.certifications);
    }

    console.log('✅ About page data loaded successfully');
  } catch (err) {
    console.error('❌ Error loading about page data:', err);
  }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // Initialize Animations (Fix for white screen)
  initializeRevealAnimations();

  // Page specific logic
  const path = window.location.pathname;

  // Reset scroll on unload to prevent weird positioning
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

  // Re-run animations periodically to catch content loaded via JS
  setInterval(() => {
    initializeRevealAnimations();
  }, 1000);
});
