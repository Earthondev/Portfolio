# ณัฐภาส วรคันธ์ (Nattapart Worakun) — Portfolio Website

A modern, high-performance portfolio website for **ณัฐภาส วรคันธ์ (Nattapart Worakun)**, showcasing my journey from Chemistry Lab to Automation, Data & QA. Built with **Vanilla HTML/CSS/JS**, animated with **GSAP**, and styled with a luxury **pastel + dark** aesthetic with cinematic page entrances.

## 🚀 Live Demo
**Website**: [https://earthondev.github.io/Portfolio/](https://earthondev.github.io/Portfolio/)

---

## ✨ About Me
**Chemistry → Automation → Data & QA**

I am a chemist who evolved into a tech enthusiast. Starting from optimizing lab workflows with Excel VBA, I expanded my skills to **Python, SQL, R, Power BI, and Web Development**. I specialize in:

- **Inventory Analytics:** Stock reporting, KPI dashboards, demand vs supply analysis.
- **Automation:** Reducing manual tasks by 60–80% using Python, Apps Script, and AppSheet.
- **Data Analysis:** SQL queries, R statistical analysis (ggplot2, dplyr), Power BI dashboards.
- **Web Development:** Building responsive, offline-first apps with Vanilla JS, Flutter, and React.
- **QA Mindset:** Applying lab-grade precision to data validation and software testing.

---

## 🛠️ Tech Stack

| Category | Tools |
| :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS CLI, Vanilla JavaScript (ES6+) |
| **Animation** | GSAP 3.12, Lenis (smooth scroll), custom CSS keyframes |
| **Design** | Pastel curtain transitions, split-text hover effects, glassmorphism cards |
| **Performance** | Lazy loading, `preconnect` hints, Service Worker (PWA), compressed images |
| **Hosting** | GitHub Pages |

---

## ✨ Page Entrance Animations

Each page features a unique cinematic entrance:

| Page | Curtain Color | Animation |
| :--- | :--- | :--- |
| **Home** | Beige `#e8e4dd` | `NATTAPART` scaleY squeeze → chars scatter in random directions |
| **Certificates** | Warm gray `#d4cfc7` | `CERTIFICATES` 3D rotateY flip from left → chars fly out in 360° |
| **Projects** | Sage green `#c8d5c3` | `PROJECTS` clip-path wipe from bottom → blur dissolve from center |
| **Contact** | Dark `#111827` | Overlay rises → text floats up with R→L char reveal → glides to final position |

---

## 📂 Featured Projects (9 Projects)

| Project | Category | Tech Stack | Highlights |
| :--- | :--- | :--- | :--- |
| **Inventory Analytics Dashboard** | Analytics | Power BI, SQL, AppSheet | 1,200+ SKU records, 6 KPIs, weekly action summary |
| **Guessing Game Quest** | Web App | HTML5, CSS3, JS | Interactive image guessing game with score tracking |
| **TonfernPDF v3.0** | Web App | HTML5, JS, pdf-lib | Professional PDF toolkit (100% local, no upload) |
| **SentaiWatch DX** | watchOS App | Swift, SwiftUI | Hyper-realistic Megaranger Digitizer replica |
| **Laundry App** | Mobile App | Flutter, Google Sheets | Smart laundry shop management with real-time sync |
| **Care for Mom** | Mobile App | Flutter, Gemini AI | AI-powered health companion for elderly care |
| **HaaNaiHang** | Web App | React, Firebase | Mall & Store finder with proximity calculation |
| **Slack Drive Bot** | Automation | Python, Slack API | Automated file organization saving 90% admin time |
| **Inventory Amino** | Automation | AppSheet, No-Code | Mobile lab stock management with low-stock alerts |

---

## 🏅 Certificates (22)

Credentials grouped by focus area — Data, Automation, QA/Governance, Security, Cloud, and Education.  
Full list: [earthondev.github.io/Portfolio/certificates.html](https://earthondev.github.io/Portfolio/certificates.html)

Most recent: **Google Sheets Crash Course** — DataRockie School (2026-05-03)

---

## 📁 Project Structure

```
Portfolio/
├── index.html                          # Home (NATTAPART entrance)
├── certificates.html                   # Certificates (CERTIFICATES entrance)
├── portfolio.html                      # Projects (PROJECTS entrance + cinema slider)
├── contact.html                        # Contact (CONTACT cinematic entrance)
├── inventory-analytics-dashboard.html  # Featured project page
├── case-studies/                       # Detailed case studies
│   ├── inventory-amino.html
│   └── inventory-analytics-dashboard.html
├── style.css                           # Design tokens & global styles
├── cache-bust.js                       # Cache busting helper
├── sw.js                               # Service Worker (PWA)
├── certificates.json                   # Certificates data (22 entries)
├── projects.json                       # Projects data (9 entries)
├── sitemap.xml                         # SEO sitemap
├── assets/
│   ├── projects/                       # Project screenshots & covers (compressed ≤1024px)
│   ├── Profile/                        # Profile photos (compressed ≤900px)
│   ├── img/                            # General images (compressed ≤900px)
│   ├── certificates/                   # Certificate PDFs & images (compressed ≤1000px)
│   ├── og/                             # Open Graph preview images
│   ├── js/
│   │   ├── animations.js               # GSAP/CSS animation helpers
│   │   ├── common.js                   # Shared nav/scroll/mobile-menu helpers
│   │   └── inventory-analytics-dashboard.js
│   └── css/                            # Tailwind input and generated CSS
└── .github/                            # GitHub Actions
```

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Earthondev/Portfolio.git
   cd Portfolio
   ```

2. **Run locally**
   ```bash
   python3 -m http.server 8000
   # or
   npm run dev
   ```

3. **Open in browser**
   Go to `http://localhost:8000`

---

## 🎨 Design System

| Token | Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#00D9FF` (Neon Cyan) | Links, active states, accents |
| **Secondary** | `#00FF94` (Neon Green) | Highlights, success states |
| **Accent** | `#FFE600` (Neon Yellow) | Credentials, featured items |
| **Pastel Beige** | `#e8e4dd` | Curtain (Home), case study button |
| **Pastel Gray** | `#d4cfc7` | Curtain (Certificates) |
| **Pastel Sage** | `#c8d5c3` | Curtain (Projects) |
| **Background** | `#0a0a0f` | Page background |
| **Surface** | `#111827` | Cards, panels |
| **Navbar** | `rgba(251,250,247,0.88)` | Frosted glass light navbar |
| **Heading Font** | Space Grotesk | Display & headings |
| **Body Font** | Sarabun | Body text (Thai + English support) |

---

## ⚡ Performance Notes

- All images compressed: covers ≤1024px, profiles ≤900px, certificates ≤1000px
- `preconnect` hints for Google Fonts, Font Awesome, GSAP, and Lenis CDNs
- `preload` for LCP image on contact.html
- Service Worker with Cache-First (static) + Network-First (JSON) strategies
- `loading="lazy"` on all non-critical images

---

## 📞 Contact

**Nattapart Worakun**
- **Email**: [earthlikemwbb@gmail.com](mailto:earthlikemwbb@gmail.com)
- **LinkedIn**: [linkedin.com/in/earthondev](https://www.linkedin.com/in/earthondev/)
- **Website**: [earthondev.github.io/Portfolio](https://earthondev.github.io/Portfolio/)

---

© 2026 Nattapart Worakun. All rights reserved.
