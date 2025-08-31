# 🎨 Nattapart Worakun Portfolio

A modern, dynamic portfolio website built with HTML, CSS, and JavaScript. Features dynamic content loading from JSON files, responsive design, and interactive project showcases.

## ✨ Features

- **Dynamic Content Loading** - Projects, skills, and services loaded from JSON files
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Interactive Modals** - Project details and image galleries with navigation
- **Search & Filter** - Find projects by title, tech stack, or tags
- **Modern UI/UX** - Glass effect navbar, smooth animations, and hover effects
- **SEO Optimized** - Meta tags, Open Graph, and Twitter Cards
- **Performance Optimized** - Lazy loading, caching headers, and optimized images

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Earthondev/Portfolio.git
   cd Portfolio
   ```

2. **Start local server**
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
Portfolio/
├── index.html              # Home page
├── portfolio.html          # Projects page
├── about.html             # About page
├── contact.html           # Contact page
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript
├── projects.json          # Project data
├── services.json          # Services & skills data
├── assets/
│   └── projects/
│       └── hanaihang/     # Project images
├── case-studies/          # Markdown case studies
└── netlify.toml           # Deployment config
```

## 🔧 Adding New Projects

### 1. Prepare Images

Create a folder for your project:
```bash
mkdir assets/projects/my-project
```

Add images with these specifications:
- **Cover Image**: `cover.webp` (900-1200px wide, aspect ratio 16:9)
- **Gallery Images**: `gallery-01.webp`, `gallery-02.webp`, etc. (1280-1600px wide)
- **Format**: WebP with 80% quality for optimal size/quality balance
- **Alt Text**: Descriptive text for accessibility

### 2. Add Project Data

Edit `projects.json` and add a new project object:

```json
{
  "id": "my-project",
  "title": "My Amazing Project",
  "slug": "my-project",
  "year": 2025,
  "summary": "A brief description of what this project does and its impact.",
  "role": ["Frontend Developer", "UI/UX Designer"],
  "stack": ["React", "TypeScript", "Tailwind CSS"],
  "highlights": [
    "Key feature or achievement 1",
    "Key feature or achievement 2",
    "Key feature or achievement 3"
  ],
  "coverImage": {
    "src": "/assets/projects/my-project/cover.webp",
    "alt": "Screenshot of the main interface"
  },
  "gallery": [
    {
      "src": "/assets/projects/my-project/gallery-01.webp",
      "alt": "Homepage with search functionality"
    },
    {
      "src": "/assets/projects/my-project/gallery-02.webp",
      "alt": "Admin dashboard showing analytics"
    }
  ],
  "links": {
    "live": "https://my-project-demo.com",
    "repo": "https://github.com/username/my-project"
  },
  "tags": ["Web App", "UI/UX", "React"],
  "status": "Active"
}
```

### 3. Commit and Deploy

```bash
git add .
git commit -m "feat: Add new project - My Amazing Project"
git push origin main
```

## 🎯 Key Features Explained

### Dynamic Content Loading

The website loads content from JSON files, making it easy to update without editing HTML:

- `projects.json` - Project data with images, descriptions, and links
- `services.json` - Services, skills, and certifications

### Interactive Modals

- **Project Modal**: Shows detailed project information with tech stack and highlights
- **Gallery Modal**: Image carousel with navigation arrows, dots, and keyboard controls

### Search & Filter

- **Search**: Find projects by title, description, tech stack, or tags
- **Filter**: Filter by project categories (Web App, Admin Panel, UI/UX, etc.)

### Responsive Design

- **Desktop**: Multi-column grid layouts
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single column layout with touch-friendly buttons

## 🚀 Deployment

### GitHub Pages

1. Go to repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Save and wait for deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
3. Deploy automatically on push to main branch

### Vercel

1. Import your GitHub repository
2. Framework preset: Other
3. Deploy automatically

## 🔧 Customization

### Colors & Theme

Edit CSS variables in `style.css`:

```css
:root {
    --gradient-start: #b22222;
    --gradient-end: #ff4d4d;
    --bg-secondary: #2E2E2E;
    --bg-light: #F9F9F9;
    --bg-cream: #FEF7F0;
    /* ... more variables */
}
```

### Adding New Sections

1. Add HTML structure in the appropriate page
2. Add CSS styles in `style.css`
3. Add JavaScript functionality in `script.js` if needed

### Skills & Services

Edit `services.json` to update:

- **Services**: What you offer to clients
- **Skills**: Your technical skills with proficiency levels
- **Certifications**: Your professional certifications

## 🐛 Troubleshooting

### Images Not Loading

1. Check file paths in JSON files
2. Ensure images are in the correct folder structure
3. Verify image file names match exactly
4. Check browser console for 404 errors

### JSON Loading Issues

1. Check browser console for fetch errors
2. Verify JSON syntax is valid
3. Ensure files are accessible via HTTP server
4. Try clearing browser cache

### Modal Not Working

1. Check if JavaScript is loaded properly
2. Verify modal HTML structure
3. Check for JavaScript errors in console
4. Ensure event listeners are attached

### Mobile Issues

1. Test on actual mobile devices
2. Check viewport meta tag
3. Verify touch targets are large enough
4. Test mobile menu functionality

## 📱 Mobile Testing

### Manual Testing Checklist

- [ ] Navigation menu opens/closes properly
- [ ] Project cards display in single column
- [ ] Touch targets are large enough (44px minimum)
- [ ] Modals open and close with touch
- [ ] Gallery navigation works with touch
- [ ] Scroll-to-top button appears and works
- [ ] Search and filter work on mobile

### Device Testing

Test on:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)
- Various screen sizes

## 🔍 Performance Optimization

### Image Optimization

- Use WebP format for better compression
- Optimize images to appropriate sizes
- Use `loading="lazy"` for images below the fold
- Provide descriptive alt text

### Caching

- Static assets (CSS, JS, images) cached for 1 year
- JSON files cached for 1 hour
- HTML files cached for 1 hour

### Loading Performance

- Preconnect to external domains
- Use CDN for fonts and icons
- Minimize render-blocking resources
- Implement lazy loading

## 📊 Analytics & SEO

### SEO Features

- Meta descriptions for all pages
- Open Graph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Alt text for all images

### Performance Monitoring

- Core Web Vitals optimization
- Mobile-first responsive design
- Accessibility compliance
- Fast loading times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

If you have questions or need help:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ by Nattapart Worakun**
