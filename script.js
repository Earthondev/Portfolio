// Global variables
let projects = [];
let services = [];
let currentFilter = 'all';

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const servicesContainer = document.getElementById('services-container');
const skillsContainer = document.getElementById('skills-container');
const certificationsContainer = document.getElementById('certifications-container');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    setupModal();
});

// Load data from JSON files
async function loadData() {
    try {
        const [projectsResponse, servicesResponse] = await Promise.all([
            fetch('/projects.json', { cache: 'no-store' }),
            fetch('services.json')
        ]);
        
        projects = await projectsResponse.json();
        const servicesData = await servicesResponse.json();
        services = servicesData.services;
        
        renderProjects();
        renderServices();
        renderSkills(servicesData.skills);
        renderCertifications(servicesData.certifications);
    } catch (error) {
        console.error('Error loading data:', error);
    }
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
}

// Render projects
function renderProjects(projectsToRender = projects) {
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projectsToRender.map(project => toCardHTML(project)).join('');
    
    // Re-initialize reveal animations
    initializeRevealAnimations();
    
    // Attach card events
    attachCardEvents(projectsToRender);
}

// Convert project to card HTML
function toCardHTML(project) {
    return `
        <article class="portfolio-item reveal" data-id="${project.id}">
            <div class="portfolio-image-container">
                <img class="portfolio-image" src="${project.coverImage.src}" alt="${project.coverImage.alt}" 
                     loading="lazy" onerror="this.src='https://via.placeholder.com/400x250/1f2937/ffffff?text=${encodeURIComponent(project.title)}'">
                <div class="portfolio-overlay">
                    <button class="view-details-btn" data-id="${project.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
            <div class="portfolio-content">
                <div class="portfolio-header">
                    <h2 class="portfolio-title">${project.title}</h2>
                    <span class="portfolio-year">${project.year}</span>
                </div>
                <p class="portfolio-summary">${project.summary}</p>
                <div class="portfolio-meta">
                    <div class="portfolio-role">
                        <span class="meta-label">Role:</span>
                        <span>${project.role.join(', ')}</span>
                    </div>
                    <div class="portfolio-stack">
                        <span class="meta-label">Stack:</span>
                        <span>${project.stack.slice(0, 3).join(', ')}${project.stack.length > 3 ? '...' : ''}</span>
                    </div>
                </div>
                <div class="portfolio-tags">
                    ${project.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                </div>
                <div class="portfolio-actions">
                    <a class="portfolio-link" href="${project.links.live}" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i> Live
                    </a>
                    <a class="portfolio-link" href="${project.links.repo}" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i> Code
                    </a>
                    <button class="btn-gallery" data-id="${project.id}">
                        <i class="fas fa-images"></i> Screens
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Attach card events
function attachCardEvents(projects) {
    // Gallery buttons
    document.querySelectorAll('.btn-gallery').forEach(btn => {
        btn.addEventListener('click', () => {
            const project = projects.find(p => p.id === btn.dataset.id);
            if (project) openGalleryModal(project);
        });
    });
    
    // View details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const project = projects.find(p => p.id === btn.dataset.id);
            if (project) openProjectModal(project);
        });
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

// Open gallery modal
function openGalleryModal(project) {
    const modal = document.getElementById('gallery-modal');
    const galleryWrap = modal.querySelector('.gallery-wrap');
    
    galleryWrap.innerHTML = project.gallery.map(img => `
        <figure class="gallery-item">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
            <figcaption>${img.alt}</figcaption>
        </figure>
    `).join('');
    
    modal.style.display = 'flex';
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
