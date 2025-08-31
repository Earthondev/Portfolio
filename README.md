# 🚀 Dynamic Portfolio Website

Portfolio website ที่รองรับการอัพเดตผลงานแบบง่ายๆ โดยไม่ต้องแก้ไข HTML โดยตรง

## ✨ Features

- **Dynamic Content Loading** - โหลดข้อมูลจาก JSON files
- **Search & Filter** - ค้นหาและกรองโปรเจกต์
- **Project Modal** - แสดงรายละเอียดโปรเจกต์แบบ popup
- **Gallery Modal** - แสดงรูปภาพโปรเจกต์แบบ gallery
- **Responsive Design** - รองรับทุกขนาดหน้าจอ
- **Smooth Animations** - เอฟเฟกต์การเคลื่อนไหวที่นุ่มนวล
- **Easy Updates** - อัพเดตผลงานง่ายๆ แค่แก้ JSON

## 📁 File Structure

```
Portfolio/
├── index.html                 # หน้าหลัก
├── portfolio.html             # หน้า Portfolio
├── style.css                  # CSS หลัก
├── script.js                  # JavaScript สำหรับ dynamic loading
├── projects.json              # ข้อมูลโปรเจกต์
├── services.json              # ข้อมูล services และ skills
├── assets/
│   └── projects/
│       ├── hanaihang/
│       │   ├── cover.webp     # รูปปกโปรเจกต์
│       │   ├── gallery-01.webp # รูปภาพ gallery
│       │   ├── gallery-02.webp
│       │   └── ...
│       ├── amino-acid-profile/
│       └── inventory-chemical/
├── case-studies/
│   └── hanaihang.md           # Case study แบบ Markdown
├── about.html                 # หน้า About
├── contact.html               # หน้า Contact
└── README.md
```

## 🔧 วิธีการใช้งาน

### 1. เพิ่มโปรเจกต์ใหม่

#### Step 1: สร้างโฟลเดอร์รูปภาพ
```bash
mkdir -p assets/projects/new-project-id
```

#### Step 2: เพิ่มรูปภาพ
- `cover.webp` - รูปปกการ์ด (720-960px)
- `gallery-01.webp` - รูปภาพ gallery (1280-1600px)
- `gallery-02.webp` - รูปภาพ gallery
- ...

#### Step 3: แก้ไข `projects.json`
```json
{
  "id": "new-project-id",
  "title": "ชื่อโปรเจกต์",
  "slug": "new-project-id",
  "year": 2025,
  "summary": "คำอธิบายโปรเจกต์",
  "role": ["Role 1", "Role 2"],
  "stack": ["Tech 1", "Tech 2"],
  "highlights": [
    "Feature 1",
    "Feature 2"
  ],
  "coverImage": {
    "src": "/assets/projects/new-project-id/cover.webp",
    "alt": "Alt text สำหรับรูปปก"
  },
  "gallery": [
    {
      "src": "/assets/projects/new-project-id/gallery-01.webp",
      "alt": "Alt text สำหรับรูป gallery"
    }
  ],
  "links": {
    "live": "https://demo-link.com",
    "repo": "https://github.com/username/project"
  },
  "tags": ["Tag 1", "Tag 2"],
  "cta": "View project",
  "status": "Active"
}
```

### 2. อัพเดต Services/Skills

แก้ไขไฟล์ `services.json`:

```json
{
  "services": [
    {
      "id": 4,
      "title": "Service ใหม่",
      "description": "คำอธิบาย service",
      "image": "https://example.com/image.jpg",
      "icon": "fas fa-rocket"
    }
  ],
  "skills": [
    {
      "name": "Skill ใหม่",
      "level": "high",
      "icon": "fas fa-star"
    }
  ]
}
```

### 3. สร้าง Case Study (ทางเลือก)

สร้างไฟล์ Markdown ใน `case-studies/`:

```markdown
---
id: project-id
title: ชื่อโปรเจกต์
date: 2025-08-31
cover: /assets/projects/project-id/cover.webp
tags: [Tag1, Tag2]
---

## Overview
คำอธิบายโปรเจกต์...

## Key Features
- Feature 1
- Feature 2

## Tech Stack
- Tech 1
- Tech 2

## Links
- Live: https://demo.com
- Code: https://github.com/username/project
```

## 🎨 Customization

### สี Theme

แก้ไขใน `style-new.css`:

```css
:root {
    --gradient-start: #b22222;  /* สีเริ่มต้น */
    --gradient-end: #ff4d4d;    /* สีสิ้นสุด */
    --accent-color: #fecaca;    /* สีเน้น */
}
```

### Filter Categories

เพิ่ม categories ใหม่ใน `portfolio-new.html`:

```html
<button class="filter-btn" data-filter="new-category">New Category</button>
```

## 🚀 การ Deploy

### Local Development

```bash
# รัน local server
python3 -m http.server 8000

# เปิดเบราว์เซอร์
http://localhost:8000/index.html
```

### Production

อัปโหลดไฟล์ทั้งหมดไปยัง web server หรือ hosting service

## 📱 Responsive Design

เว็บไซต์รองรับ:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔍 Search & Filter

### Search
- ค้นหาจากชื่อโปรเจกต์
- ค้นหาจากคำอธิบาย
- ค้นหาจาก tags
- ค้นหาจาก tech stack

### Filter
- All Projects
- Web App
- Automation
- Admin Panel
- UI/UX

## 🎯 Features ใหม่

### Project Modal
- แสดงรายละเอียดโปรเจกต์ครบถ้วน
- Role และ Tech Stack
- Key Features
- Links ไปยัง Live Demo และ Code

### Gallery Modal
- แสดงรูปภาพโปรเจกต์แบบ gallery
- Alt text สำหรับ accessibility
- Responsive design

### Enhanced Cards
- แสดงปีที่ทำโปรเจกต์
- Role และ Tech Stack
- ปุ่ม Live, Code, และ Screens

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ สามารถติดต่อได้ที่:
- Email: earthlikemwbb@gmail.com
- LinkedIn: [Nattapart Worakun](https://www.linkedin.com/in/nattapart-worakun-74a5a821b/)

---

**Made with ❤️ by Nattapart Worakun**
