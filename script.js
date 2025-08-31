// Global variables
let projects = [];
let services = [];
let currentFilter = 'all';
let currentTheme = localStorage.getItem('theme') || 'dark';

// DOM Elements
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    setupModal();
    setupNavbar();
    setupScrollToTop();
    setupThemeToggle();
    applyTheme();
});

// Analytics tracking function
function trackEvent(eventName, eventLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'portfolio_interaction',
            event_label: eventLabel
        });
    }
    console.log(`Event tracked: ${eventName} - ${eventLabel}`);
}

// Theme toggle functionality
function setupThemeToggle() {
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme();
        trackEvent('theme_toggle', currentTheme);
    });
}

function applyTheme() {
    const root = document.documentElement;
    const themeIcon = themeToggle?.querySelector('i');
    
    if (currentTheme === 'light') {
        root.classList.add('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    } else {
        root.classList.remove('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
}

// Enhanced JSON loading with error handling
async function loadJSON(url) {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return await res.json();
    } catch (e) {
        console.error(`Error loading ${url}:`, e);
        return []; // Return empty array as fallback
    }
}

// Load data from JSON files with error handling
async function loadData() {
    try {
        const [projectsData, servicesData] = await Promise.all([
            loadJSON('/projects.json'),
            loadJSON('services.json')
        ]);
        
        projects = projectsData;
        services = servicesData.services || [];
        
        renderProjects();
        renderServices();
        renderSkills(servicesData.skills || []);
        renderCertifications(servicesData.certifications || []);
        
        // Show fallback message if no data loaded
        if (projects.length === 0) {
            showFallbackMessage('projects');
        }
        if (services.length === 0) {
            showFallbackMessage('services');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showFallbackMessage('general');
    }
}

// Show fallback message when data fails to load
function showFallbackMessage(type) {
    const container = type === 'projects' ? projectsContainer : 
                     type === 'services' ? servicesContainer : null;
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="fallback-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Unable to load ${type}</h3>
            <p>Please check your connection and refresh the page.</p>
            <button onclick="location.reload()" class="btn-primary">
                <i class="fas fa-redo"></i> Refresh
            </button>
        </div>
    `;
}

// Setup navbar scroll effect
function setupNavbar() {
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn && navbarNav) {
        mobileMenuBtn.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navbarNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbarNav.classList.remove('active');
            });
        });
    }
}

// Setup scroll to top button
function setupScrollToTop() {
    if (!scrollToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        trackEvent('scroll_to_top', 'button_click');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.summary.toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        project.stack.some(tech => tech.toLowerCase().includes(searchTerm))
    );
    renderProjects(filteredProjects);
    trackEvent('project_search', searchTerm);
}

// Handle filter
function handleFilter(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter projects
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.tags.some(tag => 
            tag.toLowerCase().includes(filter.toLowerCase())
        ));
    
    renderProjects(filteredProjects);
    trackEvent('project_filter', filter);
}

// Render projects with enhanced features
function renderProjects(projectsToRender = projects) {
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projectsToRender.map(project => toCardHTML(project)).join('');
    
    // Re-initialize reveal animations
    initializeRevealAnimations();
    
    // Attach card events
    attachCardEvents(projectsToRender);
}

// Enhanced project card HTML with case study button
function toCardHTML(project) {
    const hasCaseStudy = project.caseStudy || false;
    
    return `
        <div class="portfolio-item" data-project-id="${project.id}">
            <div class="portfolio-image-container">
                <img src="${project.coverImage.src}" alt="${project.coverImage.alt}" class="portfolio-image" loading="lazy">
                <div class="portfolio-overlay">
                    <button class="view-details-btn" aria-label="View project details">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                </div>
            </div>
            <div class="portfolio-content">
                <div class="portfolio-header">
                    <h3 class="portfolio-title">${project.title}</h3>
                    <span class="portfolio-year">${project.year}</span>
                </div>
                <p class="portfolio-summary">${project.summary}</p>
                <div class="portfolio-meta">
                    <div class="portfolio-role">
                        <span class="meta-label">Role:</span>
                        ${project.role.map(role => `<span>${role}</span>`).join('')}
                    </div>
                    <div class="portfolio-stack">
                        <span class="meta-label">Tech:</span>
                        ${project.stack.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="portfolio-actions">
                    <a href="${project.links.live}" target="_blank" class="btn-primary" aria-label="View live demo" onclick="trackEvent('project_live_click', '${project.id}')">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>
                    <a href="${project.links.repo}" target="_blank" class="btn-secondary" aria-label="View source code" onclick="trackEvent('project_repo_click', '${project.id}')">
                        <i class="fab fa-github"></i>
                        Code
                    </a>
                    ${hasCaseStudy ? `
                        <a href="/case-studies/${project.slug}.html" class="btn-case-study" aria-label="Read case study" onclick="trackEvent('case_study_click', '${project.id}')">
                            <i class="fas fa-book-open"></i>
                            Case Study
                        </a>
                    ` : ''}
                </div>
                ${project.gallery && project.gallery.length > 0 ? `
                    <a href="#" class="btn-gallery" data-project-id="${project.id}" aria-label="View project screenshots">
                        <i class="fas fa-images"></i>
                        Screenshots (${project.gallery.length})
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Attach card events with analytics
function attachCardEvents(projectsToRender) {
    projectsToRender.forEach(project => {
        const card = document.querySelector(`[data-project-id="${project.id}"]`);
        if (!card) return;
        
        // View details button
        const viewBtn = card.querySelector('.view-details-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                openProjectModal(project);
                trackEvent('project_view', project.id);
            });
        }
        
        // Gallery button
        const galleryBtn = card.querySelector('.btn-gallery');
        if (galleryBtn) {
            galleryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openGalleryModal(project);
                trackEvent('project_gallery_view', project.id);
            });
        }
    });
}

// Render services
function renderServices() {
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = services.map(service => `
        <div class="service-card">
            <img class="service-image" src="${service.image}" alt="${service.title}">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-desc">${service.description}</p>
        </div>
    `).join('');
}

// Render skills
function renderSkills(skills) {
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-card" data-level="${skill.level}">
            <i class="${skill.icon} skill-icon"></i>
            <span>${skill.name}</span>
            <div class="skill-level">
                <div class="skill-bar ${skill.level}"></div>
            </div>
        </div>
    `).join('');
}

// Render certifications
function renderCertifications(certifications) {
    if (!certificationsContainer) return;
    
    certificationsContainer.innerHTML = certifications.map(cert => `
        <div class="cert-card">
            <i class="fas fa-certificate cert-icon"></i>
            <span>${cert}</span>
        </div>
    `).join('');
}

// Modal functionality
function setupModal() {
    // Create project modal HTML
    const projectModalHTML = `
        <div id="project-modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-body">
                    <div class="modal-image-container">
                        <img id="modal-image" src="" alt="">
                    </div>
                    <div class="modal-info">
                        <h2 id="modal-title"></h2>
                        <div class="modal-meta">
                            <span id="modal-year"></span>
                            <span id="modal-status"></span>
                        </div>
                        <p id="modal-summary"></p>
                        <div class="modal-details">
                            <div class="modal-role">
                                <h4>Role</h4>
                                <p id="modal-role"></p>
                            </div>
                            <div class="modal-stack">
                                <h4>Tech Stack</h4>
                                <p id="modal-stack"></p>
                            </div>
                        </div>
                        <div class="modal-highlights">
                            <h4>Key Features</h4>
                            <ul id="modal-highlights"></ul>
                        </div>
                        <div id="modal-tags" class="modal-tags"></div>
                        <div class="modal-links">
                            <a id="modal-live" href="" target="_blank" class="modal-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                            <a id="modal-repo" href="" target="_blank" class="modal-link">
                                <i class="fab fa-github"></i> View Code
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create gallery modal HTML
    const galleryModalHTML = `
        <div id="gallery-modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-body">
                    <div class="gallery-wrap"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', projectModalHTML);
    document.body.insertAdjacentHTML('beforeend', galleryModalHTML);
    
    // Setup modal event listeners
    setupModalEventListeners();
}

// Setup modal event listeners
function setupModalEventListeners() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.onclick = () => closeModal(modal);
        modal.onclick = function(e) {
            if (e.target === modal) closeModal(modal);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: flex"]');
            if (openModal) closeModal(openModal);
        }
    });
}

// Open project modal
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    const modalStatus = document.getElementById('modal-status');
    const modalSummary = document.getElementById('modal-summary');
    const modalRole = document.getElementById('modal-role');
    const modalStack = document.getElementById('modal-stack');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalTags = document.getElementById('modal-tags');
    const modalLive = document.getElementById('modal-live');
    const modalRepo = document.getElementById('modal-repo');
    
    modalImage.src = project.coverImage.src;
    modalImage.alt = project.coverImage.alt;
    modalTitle.textContent = project.title;
    modalYear.textContent = project.year;
    modalStatus.textContent = project.status;
    modalSummary.textContent = project.summary;
    modalRole.textContent = project.role.join(', ');
    modalStack.textContent = project.stack.join(', ');
    
    modalHighlights.innerHTML = project.highlights.map(highlight => 
        `<li>${highlight}</li>`
    ).join('');
    
    modalTags.innerHTML = project.tags.map(tag => 
        `<span class="modal-tag">${tag}</span>`
    ).join('');
    
    modalLive.href = project.links.live;
    modalRepo.href = project.links.repo;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Enhanced Gallery Modal
function openGalleryModal(project) {
    const modal = document.getElementById('gallery-modal');
    const mainImg = document.getElementById('gallery-main-img');
    const thumbnails = document.getElementById('gallery-thumbnails');
    
    if (!modal || !project.gallery || project.gallery.length === 0) return;
    
    let currentIndex = 0;
    
    // Set main image
    function updateMainImage(index) {
        const image = project.gallery[index];
        mainImg.src = image.src;
        mainImg.alt = image.alt;
        
        // Update active thumbnail
        thumbnails.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Update active dot
        const dots = modal.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Create gallery HTML with navigation
    const galleryHTML = `
        <div class="gallery-main">
            <img id="gallery-main-img" src="${project.gallery[0].src}" alt="${project.gallery[0].alt}">
            ${project.gallery.length > 1 ? `
                <button class="gallery-nav prev" id="gallery-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="gallery-nav next" id="gallery-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            ` : ''}
        </div>
        ${project.gallery.length > 1 ? `
            <div class="gallery-dots" id="gallery-dots">
                ${project.gallery.map((_, index) => `
                    <div class="gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                `).join('')}
            </div>
        ` : ''}
        <div class="gallery-thumbnails" id="gallery-thumbnails">
            ${project.gallery.map((image, index) => `
                <figure class="gallery-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${image.src}" alt="${image.alt}" loading="lazy">
                    <figcaption>${image.alt}</figcaption>
                </figure>
            `).join('')}
        </div>
    `;
    
    modal.querySelector('.gallery-wrap').innerHTML = galleryHTML;
    
    // Navigation functions
    function nextImage() {
        currentIndex = (currentIndex + 1) % project.gallery.length;
        updateMainImage(currentIndex);
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + project.gallery.length) % project.gallery.length;
        updateMainImage(currentIndex);
    }
    
    // Add event listeners
    const prevBtn = modal.querySelector('#gallery-prev');
    const nextBtn = modal.querySelector('#gallery-next');
    const dots = modal.querySelectorAll('.gallery-dot');
    
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.index);
            updateMainImage(currentIndex);
        });
    });
    
    // Thumbnail navigation
    thumbnails.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            currentIndex = parseInt(item.dataset.index);
            updateMainImage(currentIndex);
        });
    });
    
    // Keyboard navigation
    const handleKeydown = (e) => {
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'Escape') {
            closeModal(modal);
        }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // Store cleanup function
    modal.dataset.cleanup = 'true';
    modal.addEventListener('close', () => {
        document.removeEventListener('keydown', handleKeydown);
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Initialize reveal animations
function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('show'));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    
    revealElements.forEach(el => observer.observe(el));
}

// Utility function to debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
