// ---------- State ----------
let projects = [];
let services = [];
let currentFilter = 'all';
let currentTheme = localStorage.getItem('theme') || 'dark';

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
document.addEventListener('DOMContentLoaded', () => {
  preloadJSONFiles();
  setTimeout(loadData, 100);

  setupEventListeners();
  setupModalShells();
  setupNavbar();
  setupScrollToTop();
  setupThemeToggle();
  setupKeyboardNavigation();
  setupAnalytics();
  trackPageEvents();
  applyTheme();
});

function setupAnalytics() {
  // Track page view
  trackPageView();
  
  // Setup scroll tracking
  setupScrollTracking();
  
  // Setup time tracking
  setupTimeTracking();
  
  // Track form interactions
  setupFormTracking();
  
  // Track external link clicks
  setupExternalLinkTracking();
}

function setupFormTracking() {
  // Track contact form interactions
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      trackEvent('form_submit', 'contact_form');
    });
    
    // Track form field focus
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('focus', () => {
        trackEvent('form_field_focus', field.name || field.type);
      });
    });
  }
}

function setupExternalLinkTracking() {
  // Track external link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
      trackEvent('external_link_click', link.href);
    }
  });
}

// ---------- Preload JSON ----------
function preloadJSONFiles() {
  const ts = Date.now();
  ['projects.json', 'services.json'].forEach((name) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = `./${name}?v=${ts}`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  window.preloadTimestamp = ts;
}

// ---------- Analytics ----------
function trackEvent(eventName, eventLabel) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, {
      event_category: 'portfolio_interaction',
      event_label: eventLabel
    });
  }
  
  // Custom analytics tracking
  const analyticsData = {
    action: eventName,
    category: 'portfolio_interaction',
    label: eventLabel,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
  
  // Store in localStorage for offline analytics
  const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
  analytics.push(analyticsData);
  
  // Keep only last 100 events
  if (analytics.length > 100) {
    analytics.splice(0, analytics.length - 100);
  }
  
  localStorage.setItem('analytics', JSON.stringify(analytics));
  
  // Send to custom endpoint if available
  if (navigator.onLine) {
    sendAnalytics(analyticsData);
  }
  
  // dev log
  console.log(`Event: ${eventName} - ${eventLabel}`);
}

// Track page-specific events
function trackPageEvents() {
  // Track print button clicks
  const printButtons = document.querySelectorAll('button[onclick*="print"]');
  printButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('print_pdf', 'print_button_click');
    });
  });
  
  // Track FAQ interactions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      trackEvent('faq_interaction', `faq_item_${index}`);
    });
  });
  
  // Track impact highlights
  const impactCards = document.querySelectorAll('.impact-card');
  impactCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      trackEvent('impact_card_click', `impact_${index}`);
    });
  });
  
  // Track principle cards
  const principleCards = document.querySelectorAll('.principle-card');
  principleCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      trackEvent('principle_card_click', `principle_${index}`);
    });
  });
}

async function sendAnalytics(data) {
  try {
    // Replace with your analytics endpoint
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.log('Analytics send failed:', error);
  }
}

// Track page views
function trackPageView() {
  trackEvent('page_view', window.location.pathname);
}

// Track scroll depth
function setupScrollTracking() {
  let maxScroll = 0;
  const milestones = [25, 50, 75, 100];
  const trackedMilestones = new Set();
  
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackEvent('scroll_depth', `${milestone}%`);
        }
      });
    }
  });
}

// Track time on page
function setupTimeTracking() {
  const startTime = Date.now();
  
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', 'seconds', timeOnPage);
  });
}

// ---------- Theme ----------
function setupThemeToggle() {
  if (!themeToggle) return;
  themeToggle.addEventListener('click', () => {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    setTheme(next);
    trackEvent('theme_toggle', next);
  });
  // sync icon on load
  setTheme(getTheme());
}

function setTheme(next){
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  currentTheme = next;
  const icon = themeToggle?.querySelector('i');
  if (icon) icon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

function getTheme(){
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function applyTheme() {
  const root = document.documentElement;
  const icon = themeToggle?.querySelector('i');
  root.setAttribute('data-theme', currentTheme);
  if (icon) icon.className = currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// ---------- Data ----------
async function loadJSON(url) {
  try {
    const ts = window.preloadTimestamp || Date.now();
    const res = await fetch(`${url}?v=${ts}`, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`loadJSON error for ${url}:`, err);
    // Return fallback data based on URL
    if (url.includes('projects')) return getFallbackProjects();
    if (url.includes('services')) return getFallbackServices();
    return [];
  }
}

// Fallback data for when JSON files fail to load
function getFallbackProjects() {
  return [{
    id: 'fallback',
    title: 'Sample Project',
    year: 2025,
    summary: 'This is a fallback project shown when the main data fails to load.',
    role: 'Developer',
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
  // Show loading states
  showLoadingStates();
  
  try {
    const [projectsData, servicesData] = await Promise.all([
      loadJSON('./projects.json'),
      loadJSON('./services.json')
    ]);

    projects = Array.isArray(projectsData) ? projectsData : [];
    services = Array.isArray(servicesData?.services) ? servicesData.services : [];

    // Hide loading states
    hideLoadingStates();

    renderProjects();
    renderServices();
    renderSkills(Array.isArray(servicesData?.skills) ? servicesData.skills : []);
    renderCertifications(Array.isArray(servicesData?.certifications) ? servicesData.certifications : []);

    if (projects.length === 0) showFallbackMessage('projects');
    if (services.length === 0) showFallbackMessage('services');
  } catch (e) {
    console.error('loadData error:', e);
    hideLoadingStates();
    showFallbackMessage('projects');
    showFallbackMessage('services');
  }
}

function showLoadingStates() {
  if (projectsContainer) {
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
      trackEvent('mobile_menu_toggle', isOpen ? 'open' : 'close');
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
    trackEvent('scroll_to_top', 'button_click');
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
  trackEvent('project_search', q);
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
  trackEvent('project_filter', filter);
}

// ---------- Render: Projects ----------
function renderProjects(list = projects) {
  if (!projectsContainer) return;
  
  // For home page, show only featured projects (max 3)
  const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  const displayList = isHomePage ? list.slice(0, 3) : list;
  
  projectsContainer.innerHTML = displayList.map(toCardHTML).join('');
  initializeRevealAnimations();
  attachCardEvents(displayList);
}

function toCardHTML(p) {
  const hasCaseStudy = !!p.caseStudy;
  const cover = p.coverImage || {};
  const live = p.links?.live || '#';
  const repo = p.links?.repo || '#';

  return `
    <div class="portfolio-item reveal" data-project-id="${p.id}">
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
          <a href="${live}" target="_blank" rel="noopener" class="btn-primary" aria-label="View live demo" onclick="trackEvent('project_live_click','${p.id}')">
            <i class="fas fa-external-link-alt"></i>
            Live Demo
          </a>
          <a href="${repo}" target="_blank" rel="noopener" class="btn-secondary" aria-label="View source code" onclick="trackEvent('project_repo_click','${p.id}')">
            <i class="fab fa-github"></i>
            Code
          </a>
          ${hasCaseStudy ? `
          <a href="/case-studies/${p.slug}.html" class="btn-case-study" aria-label="Read case study" onclick="trackEvent('case_study_click','${p.id}')">
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
  list.forEach((p) => {
    const card = document.querySelector(`[data-project-id="${CSS.escape(String(p.id))}"]`);
    if (!card) return;

    const viewBtn = card.querySelector('.view-details-btn');
    viewBtn?.addEventListener('click', () => {
      openProjectModal(p);
      trackEvent('project_view', p.id);
    });

    const galleryBtn = card.querySelector('.btn-gallery');
    galleryBtn?.addEventListener('click', () => {
      openGalleryModal(p);
      trackEvent('project_gallery_view', p.id);
    });
  });
}

// ---------- Render: Services / Skills / Certs ----------
function renderServices() {
  if (!servicesContainer) return;
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
  if (!skillsContainer || !skills.length) return;

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
    const groups = groupSkillsByCategory(skills);

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
                    <div class="skill-progress">
                      <svg viewBox="0 0 100 100" aria-hidden="true">
                        <circle class="bg" cx="50" cy="50" r="45"></circle>
                        <circle class="progress ${sk.level}" cx="50" cy="50" r="45" style="stroke-dashoffset:314"></circle>
                      </svg>
                      <div class="skill-percentage">
                        <div class="percentage">${pct}%</div>
                        <div class="label">${sk.level}</div>
                      </div>
                    </div>
                  </div>`;
              })
              .join('')}
          </div>
        </div>`;
    }
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
  if (!certificationsContainer) return;
  
  // Only show certifications on About page, not on Home page
  const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
  const isAboutPage = window.location.pathname.includes('about.html');
  
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
  const modal = document.getElementById('gallery-modal');
  if (!modal || !Array.isArray(p.gallery) || p.gallery.length === 0) return;

  const wrap = modal.querySelector('.gallery-wrap');
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

  function update(index) {
    current = (index + p.gallery.length) % p.gallery.length;
    const img = p.gallery[current];
    mainImg.src = img.src;
    mainImg.alt = img.alt;

    thumbs?.querySelectorAll('.gallery-item').forEach((el, i) => el.classList.toggle('active', i === current));
    dots?.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev?.addEventListener('click', () => update(current - 1));
  next?.addEventListener('click', () => update(current + 1));
  thumbs?.querySelectorAll('.gallery-item').forEach((el) =>
    el.addEventListener('click', () => update(parseInt(el.dataset.index, 10)))
  );
  dots?.forEach((d) =>
    d.addEventListener('click', () => update(parseInt(d.dataset.index, 10)))
  );

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
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('show'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('show');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
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