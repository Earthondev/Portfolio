# 🌐 Portfolio Website — Nattapart Worakun

> **ภาษาที่ต้องการให้ตอบ: ภาษาไทยเสมอ** (ยกเว้นผู้ใช้ถามเป็นภาษาอังกฤษ)

---

## 📋 ภาพรวมของ Project

เว็บไซต์ Portfolio ส่วนตัวของ **Nattapart Worakun (ณัฐภาส วรคันธ์)** — Data Analyst & BI Developer ที่มีพื้นฐานจากสายเคมี แล้วเปลี่ยนมาสาย Tech

### จุดประสงค์
- แสดงผลงาน projects ทั้งหมด (Web App, Mobile App, Automation, watchOS)
- นำเสนอ skills, services, certifications
- เป็นช่องทางติดต่อสำหรับงาน freelance / job opportunity

### หน้าหลัก
| ไฟล์ | หน้า | หน้าที่ |
|---|---|---|
| `index.html` | Home | หน้าแรก — Hero, ไฮไลท์ projects, services |
| `portfolio.html` | Portfolio | แสดง projects ทั้งหมด พร้อม filter/search |
| `about.html` | About | ประวัติ, skills, certifications |
| `contact.html` | Contact | ฟอร์มติดต่อ |

### ข้อมูลที่ขับเคลื่อน
- `projects.json` — ข้อมูล projects ทั้งหมด (9 projects)
- `services.json` — ข้อมูล services และ skills

### โครงสร้างโฟลเดอร์
```
Portfolio/
├── index.html              # หน้าหลัก
├── about.html              # เกี่ยวกับตัว
├── portfolio.html          # แสดงผลงาน
├── contact.html            # ติดต่อ
├── style.css               # Design tokens & global styles
├── about.css / contact.css # Page-specific styles
├── script.js               # Logic หลัก (1,200 บรรทัด)
├── sw.js                   # Service Worker (PWA)
├── performance.js          # Performance monitoring
├── projects.json           # ข้อมูล projects
├── services.json           # ข้อมูล services
├── assets/
│   ├── projects/           # ภาพ screenshots & covers
│   ├── Profile/            # รูปโปรไฟล์
│   ├── decoration/         # ภาพตกแต่ง
│   └── og/                 # Open Graph images
└── .github/                # GitHub Actions
```

---

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **HTML5** — Semantic markup, SEO-optimized
- **Tailwind CSS (CDN)** — ใช้ผ่าน `cdn.tailwindcss.com` พร้อม custom config inline
- **Vanilla JavaScript (ES6+)** — ไม่ใช้ framework ใดๆ
- **Font Awesome 6.5** — Icons

### Design System
- **Theme:** Deep Space / Cyberpunk Dark Mode
- **Primary Color:** `#00D9FF` (Neon Cyan)
- **Secondary Color:** `#00FF94` (Neon Green)
- **Accent Color:** `#FFE600` (Neon Yellow)
- **Background:** `#0a0a0f`
- **Surface:** `#111827`
- **Fonts:** `Space Grotesk` (headings) + `Sarabun` (body — Thai support)
- **Effects:** Glassmorphism, Gradient text, Floating animations, Blur backgrounds

### CSS Design Tokens (จาก `style.css`)
```css
:root {
  --bg-dark: #0a0a0f;
  --bg-surface: #111827;
  --primary: #00D9FF;
  --secondary: #00FF94;
  --accent: #FFE600;
  --text-main: #f3f4f6;
  --text-muted: #9ca3af;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.05);
  --glass-blur: blur(12px);
}
```

### Performance & PWA
- **Service Worker** (`sw.js`) — Offline support ด้วย Cache strategies:
  - Cache-First สำหรับ static assets
  - Network-First สำหรับ JSON data
  - Stale-While-Revalidate สำหรับ CSS/JS
- **Lazy Loading** — รูปทั้งหมดใช้ lazy loading
- **Cache Busting** — `cache-bust.js`

### Hosting & Deploy
- **GitHub Pages** — Deploy อัตโนมัติ
- **URL:** `https://earthondev.github.io/Portfolio/`
- **Dev Server:** `python3 -m http.server 8000`

---

## 📐 Conventions / สไตล์การเขียนโค้ด

### HTML
- ใช้ **Tailwind CSS classes** inline ใน HTML เป็นหลัก
- ใช้ `style.css` สำหรับ design tokens, utility classes, และ animations เท่านั้น
- แต่ละหน้ามี `<style>` block ใน `<head>` สำหรับ page-specific styles ที่สำคัญ (critical CSS)
- ใช้ semantic HTML: `<nav>`, `<section>`, `<main>`, `<footer>`
- ทุกหน้ามี Open Graph meta tags ครบ
- รองรับ Mobile-first design

### JavaScript (`script.js`)
- ใช้ **Vanilla JS** ล้วน — ไม่มี framework
- Pattern: Module-style ด้วย functions
- State variables อยู่บนสุด: `projects`, `services`, `currentFilter`, `currentTheme`
- DOM Cache ใช้ `Map` เพื่อ performance
- Helper functions: `$(sel)` = querySelector, `$$(sel)` = querySelectorAll
- ตรวจหน้าปัจจุบันด้วย `location.pathname` เพื่อโหลด logic ที่เกี่ยวข้อง
- ข้อมูล projects/services โหลดจาก JSON files (มี fallback data)
- Modal system สำหรับแสดงรายละเอียด project

### JSON Data
- `projects.json` — แต่ละ project มี: `id`, `title`, `slug`, `year`, `summary`, `role[]`, `stack[]`, `highlights[]`, `coverImage`, `gallery[]`, `links`, `tags[]`, `status`, `caseStudy`
- `services.json` — รายการ services, skills, certifications

### Naming Conventions
- **ไฟล์ HTML/CSS/JS:** lowercase, เช่น `portfolio.html`, `style.css`
- **ไฟล์รูป:** อยู่ใน `assets/projects/<project-id>/`
- **CSS classes:** ใช้ Tailwind + custom classes เช่น `.glass-card-premium`, `.text-gradient`, `.animate-float`
- **JS functions:** camelCase เช่น `renderProjects()`, `openProjectModal()`, `setupNavbar()`

### Git
- Branch หลัก: `main`
- Deploy ผ่าน GitHub Pages โดยอัตโนมัติ

---

## 🚫 สิ่งที่ไม่ควรทำ

1. **ห้ามเปลี่ยน** color scheme หลัก (Cyan/Green/Yellow Dark theme) โดยไม่ได้รับอนุญาต
2. **ห้ามเพิ่ม** JS framework (React, Vue, etc.) — project นี้ใช้ Vanilla JS เท่านั้น
3. **ห้ามลบ** Tailwind CDN config — มี custom theme config ที่สำคัญใน `<script>` tag
4. **ห้ามแก้ไข** โครงสร้าง `projects.json` schema โดยไม่อัปเดต `script.js` ที่อ่านข้อมูล
5. **ห้ามลบ** Service Worker (`sw.js`) — เป็น core feature สำหรับ offline support
6. **ห้ามใส่** API keys หรือข้อมูลส่วนตัวลงใน source code
7. **ห้ามเปลี่ยน** font Sarabun — จำเป็นสำหรับรองรับภาษาไทย
8. **ห้ามใช้** external CSS framework อื่น (Bootstrap, Bulma) แทน Tailwind CDN
9. **ระวัง** เมื่อแก้ `script.js` — ไฟล์ใหญ่ 1,200+ บรรทัด ต้องทดสอบให้ครบทุกหน้า
10. **ห้ามลบ** SEO meta tags (Open Graph, Twitter Card, Schema.org)

---

## 🔧 วิธีรัน Development Server

```bash
# วิธีที่ 1: Python
python3 -m http.server 8000

# วิธีที่ 2: npm script
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:8000`

---

## 📦 Projects ที่แสดงอยู่ (9 projects)

1. **Guessing Game Quest** — เกมทายภาพ (HTML/CSS/JS)
2. **Laundry App** — แอปจัดการร้านซักรีด (Flutter)
3. **Care for Mom** — แอปดูแลสุขภาพ AI (Flutter + Gemini)
4. **Slack Drive Bot** — บอทจัดการไฟล์อัตโนมัติ (Python)
5. **Expense Tracker** — แอปบันทึกรายรับรายจ่าย (Flutter)
6. **HaaNaiHang** — แอปค้นหาห้าง/ร้าน (React + Firebase)
7. **Inventory Amino** — ระบบจัดการสต็อกแล็บ (AppSheet)
8. **SentaiWatch DX** — จำลอง Megaranger Digitizer (SwiftUI/watchOS)
9. **TonfernPDF v3.0** — เครื่องมือจัดการ PDF (HTML/JS/pdf-lib)
