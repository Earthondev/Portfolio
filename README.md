# Nattapart Worakun - Portfolio Website

A modern, responsive portfolio website showcasing my work as a Data Analyst & BI Developer. Built with vanilla HTML, CSS, and JavaScript for optimal performance and accessibility.

## 🚀 Live Demo

**Website**: [https://earthondev.github.io/Portfolio/](https://earthondev.github.io/Portfolio/)

## ✨ Features

### 🎨 Design & UX
- **Modern Design**: Clean, professional interface with smooth animations
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Micro-interactions**: Engaging hover effects and transitions

### ⚡ Performance
- **Fast Loading**: Optimized assets and lazy loading
- **Service Worker**: Offline functionality and caching
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Compression**: Gzip compression and minification
- **CDN**: External resources from reliable CDNs

### 🔒 Security
- **Content Security Policy**: XSS protection
- **Security Headers**: Complete security header implementation
- **HTTPS**: Enforced secure connections
- **Input Validation**: Form validation and sanitization

### 📊 Analytics & Tracking
- **Google Analytics**: Comprehensive event tracking
- **Custom Analytics**: Offline-capable analytics system
- **Performance Monitoring**: Core Web Vitals tracking
- **User Behavior**: Scroll depth, time on page, interactions

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties and Grid/Flexbox
- **JavaScript (ES6+)**: Vanilla JS with modern features
- **Font Awesome**: Icon library
- **Google Fonts**: Poppins font family

### Tools & Services
- **Service Worker**: Offline functionality
- **GitHub Pages**: Hosting and deployment
- **Netlify**: Alternative hosting with advanced features
- **Google Analytics**: Website analytics
- **Formspree**: Contact form handling

## 📁 Project Structure

```
Portfolio/
├── index.html              # Home page
├── about.html              # About page
├── portfolio.html          # Portfolio page
├── contact.html            # Contact page
├── 404.html               # Error page
├── 500.html               # Server error page
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript
├── contact.css            # Contact page styles
├── contact.js             # Contact page scripts
├── projects.json          # Projects data
├── services.json          # Services and skills data
├── sw.js                  # Service worker
├── cache-bust.js          # Cache busting utility
├── .htaccess              # Apache configuration
├── netlify.toml           # Netlify configuration
├── package.json           # Node.js dependencies
├── case-studies/          # Case study pages
│   ├── hanaihang.html     # HaaNaiHang case study
│   └── case-study.css     # Case study styles
└── assets/                # Static assets
    ├── images/            # Images
    └── projects/          # Project images
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18+ (for development)
- Python 3 (for local server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Earthondev/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies** (optional)
   ```bash
   npm install
   ```

3. **Start local development server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development Commands

```bash
# Start development server
npm run dev

# Validate HTML
npm run validate

# Run Lighthouse audit
npm run lighthouse

# Deploy (via GitHub Actions)
npm run deploy
```

## 📝 Content Management

### Adding Projects

1. **Edit `projects.json`**
   ```json
   {
     "id": "project-name",
     "title": "Project Title",
     "year": 2025,
     "summary": "Project description",
     "role": "Developer",
     "stack": ["React", "TypeScript", "Node.js"],
     "highlights": ["Feature 1", "Feature 2"],
     "coverImage": {
       "src": "path/to/image.jpg",
       "alt": "Image description"
     },
     "gallery": [
       {
         "src": "path/to/image1.jpg",
         "alt": "Screenshot 1"
       }
     ],
     "links": {
       "live": "https://project-url.com",
       "repo": "https://github.com/username/project"
     },
     "tags": ["web", "react"],
     "status": "Active",
     "caseStudy": true
   }
   ```

2. **Add case study** (if `caseStudy: true`)
   - Create `case-studies/project-name.html`
   - Follow the existing case study template

### Adding Skills

Edit `services.json`:
```json
{
  "services": [...],
  "skills": [
    {
      "name": "Skill Name",
      "level": "high|medium|low",
      "icon": "fas fa-icon-name",
      "group": "Frontend|Backend|Tools"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}
```

## 🎨 Customization

### Theme Colors

Edit CSS custom properties in `style.css`:
```css
:root {
  --brand-600: #dc2626;
  --brand-500: #ef4444;
  --accent: #fecaca;
  /* ... other colors */
}
```

### Typography

Change fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Layout

Modify grid layouts in `style.css`:
```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}
```

## 🔧 Configuration

### Google Analytics

1. **Get GA4 Measurement ID**
2. **Update `index.html`**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

### Contact Form

1. **Sign up for Formspree**
2. **Update form action in `contact.html`**
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Deployment

#### GitHub Pages
1. **Enable GitHub Pages** in repository settings
2. **Set source** to main branch
3. **Push changes** - auto-deploy via GitHub Actions

#### Netlify
1. **Connect repository** to Netlify
2. **Configure build settings** (already in `netlify.toml`)
3. **Deploy** - auto-deploy on push

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 🔍 SEO Features

- **Structured Data**: JSON-LD for Person, WebSite, TechArticle
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Sitemap**: Auto-generated sitemap
- **Canonical URLs**: Proper canonicalization
- **Robots.txt**: Search engine directives

## ♿ Accessibility

- **WCAG 2.1 AA**: Compliant
- **Keyboard Navigation**: Full support
- **Screen Reader**: Optimized
- **Color Contrast**: Meets standards
- **Focus Management**: Proper focus handling
- **ARIA Labels**: Complete labeling

## 🧪 Testing

### Manual Testing
- [ ] All pages load correctly
- [ ] Theme toggle works
- [ ] Mobile menu functions
- [ ] Contact form submits
- [ ] All links work
- [ ] Images load properly

### Automated Testing
- **HTML Validation**: `html-validate`
- **CSS Validation**: `css-validator`
- **Lighthouse CI**: Performance audits
- **GitHub Actions**: CI/CD pipeline

## 📈 Analytics Events

Tracked events:
- `page_view` - Page visits
- `scroll_depth` - Scroll milestones
- `time_on_page` - Time spent
- `theme_toggle` - Theme changes
- `project_view` - Project interactions
- `form_submit` - Form submissions
- `external_link_click` - External link clicks

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Nattapart Worakun**
- **Email**: [earthlikemwbb@gmail.com](mailto:earthlikemwbb@gmail.com)
- **LinkedIn**: [nattapart-worakun-74a5a821b](https://www.linkedin.com/in/nattapart-worakun-74a5a821b/)
- **Portfolio**: [https://earthondev.github.io/Portfolio/](https://earthondev.github.io/Portfolio/)

## 🙏 Acknowledgments

- **Font Awesome** for icons
- **Google Fonts** for typography
- **Unsplash** for placeholder images
- **GitHub Pages** for hosting
- **Netlify** for advanced features

---

⭐ **Star this repository** if you found it helpful!