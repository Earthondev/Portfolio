# Contributing to Nattapart Worakun Portfolio

Thank you for your interest in contributing to my portfolio website! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a suggestion, please:

1. **Check existing issues** first to avoid duplicates
2. **Create a new issue** with:
   - Clear title describing the problem
   - Detailed description of the issue
   - Steps to reproduce (if applicable)
   - Expected vs actual behavior
   - Screenshots (if relevant)
   - Browser/device information

### Suggesting Enhancements

For feature requests:

1. **Check existing issues** for similar requests
2. **Create an enhancement issue** with:
   - Clear title describing the feature
   - Detailed description of the proposed feature
   - Use cases and benefits
   - Mockups or examples (if applicable)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test your changes** thoroughly
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 📋 Development Guidelines

### Code Style

- **HTML**: Use semantic HTML5 elements
- **CSS**: Follow BEM methodology for class names
- **JavaScript**: Use ES6+ features, prefer const/let over var
- **Comments**: Add comments for complex logic
- **Indentation**: Use 2 spaces for indentation

### File Structure

```
Portfolio/
├── index.html              # Home page
├── about.html              # About page
├── portfolio.html          # Portfolio page
├── contact.html            # Contact page
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript
├── projects.json          # Projects data
├── services.json          # Services data
└── case-studies/          # Case study pages
```

### Testing Requirements

Before submitting a PR, ensure:

- [ ] **HTML validation** passes
- [ ] **CSS validation** passes
- [ ] **JavaScript** runs without errors
- [ ] **Responsive design** works on all devices
- [ ] **Accessibility** standards are met
- [ ] **Performance** is not degraded
- [ ] **Cross-browser** compatibility

### Performance Guidelines

- **Images**: Optimize and use appropriate formats (WebP, AVIF)
- **CSS**: Minimize unused styles
- **JavaScript**: Avoid blocking scripts
- **Fonts**: Use font-display: swap
- **Caching**: Implement proper caching strategies

### Accessibility Guidelines

- **Semantic HTML**: Use proper heading hierarchy
- **ARIA labels**: Add labels for screen readers
- **Keyboard navigation**: Ensure all functionality is keyboard accessible
- **Color contrast**: Meet WCAG 2.1 AA standards
- **Alt text**: Provide descriptive alt text for images

## 🛠️ Development Setup

### Prerequisites

- Modern web browser
- Node.js 18+
- Python 3 (for local server)
- Git

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Portfolio.git
   cd Portfolio
   ```

2. **Start development server**
   ```bash
   python3 -m http.server 8000
   # or
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Testing Commands

```bash
# Validate HTML
npm run validate

# Run Lighthouse audit
npm run lighthouse

# Check file sizes
find . -name "*.html" -exec wc -c {} \;
```

## 📝 Content Guidelines

### Adding Projects

When adding new projects to `projects.json`:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "year": 2025,
  "summary": "Brief project description",
  "role": "Your role in the project",
  "stack": ["Technology1", "Technology2"],
  "highlights": ["Key feature 1", "Key feature 2"],
  "coverImage": {
    "src": "path/to/image.jpg",
    "alt": "Descriptive alt text"
  },
  "gallery": [
    {
      "src": "path/to/screenshot.jpg",
      "alt": "Screenshot description"
    }
  ],
  "links": {
    "live": "https://project-url.com",
    "repo": "https://github.com/username/project"
  },
  "tags": ["web", "react", "typescript"],
  "status": "Active",
  "caseStudy": true
}
```

### Adding Skills

When adding skills to `services.json`:

```json
{
  "name": "Skill Name",
  "level": "high|medium|low",
  "icon": "fas fa-icon-name",
  "group": "Frontend|Backend|Tools|Design"
}
```

### Writing Case Studies

Case studies should include:

- **Project overview** and objectives
- **Technical challenges** and solutions
- **Key features** and functionality
- **Results** and impact
- **Lessons learned**
- **Future enhancements**

## 🚫 What Not to Contribute

Please avoid:

- **Personal information** changes (name, contact info, etc.)
- **Major design changes** without discussion
- **Breaking changes** to existing functionality
- **Unoptimized images** or large files
- **Non-semantic HTML** or poor accessibility
- **Hardcoded values** instead of data-driven content

## 📞 Getting Help

If you need help:

1. **Check the README** for common questions
2. **Search existing issues** for similar problems
3. **Create a new issue** with your question
4. **Contact me directly** at earthlikemwbb@gmail.com

## 🎯 Areas for Contribution

### High Priority

- **Bug fixes** and performance improvements
- **Accessibility** enhancements
- **Mobile responsiveness** improvements
- **SEO** optimizations

### Medium Priority

- **New features** and functionality
- **Content** improvements
- **Documentation** updates
- **Testing** improvements

### Low Priority

- **Design** tweaks and refinements
- **Code refactoring**
- **Dependency** updates

## 📋 Pull Request Template

When creating a PR, please include:

### Description
Brief description of changes made.

### Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

### Testing
- [ ] HTML validation passes
- [ ] CSS validation passes
- [ ] JavaScript runs without errors
- [ ] Responsive design works
- [ ] Accessibility standards met
- [ ] Performance not degraded

### Screenshots
If applicable, add screenshots of changes.

### Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes

## 🙏 Recognition

Contributors will be:

- **Listed** in the README acknowledgments
- **Mentioned** in release notes
- **Credited** for significant contributions
- **Invited** to collaborate on future projects

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to my portfolio! Your help makes this project better for everyone. 🚀
