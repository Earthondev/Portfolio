# 🔍 SEO Setup Guide — Nattapart Worakun Portfolio

> ขั้นตอนที่ต้องทำด้วยตัวเองเพื่อให้เว็บติดการค้นหาของ Google

---

## ✅ สิ่งที่ทำเสร็จแล้ว (ในโค้ด)

| สิ่งที่แก้ | ผลลัพธ์ |
|---|---|
| เพิ่มชื่อไทย "ณัฐภาส วรคันธ์" ในทุกหน้า | Google อ่านชื่อไทยได้แล้ว |
| Schema.org `Person` บน index.html | Google รู้ว่า portfolio นี้เป็นของใคร |
| `keywords` meta ทุกหน้า | ครอบคลุม Bing/Yahoo |
| `BreadcrumbList` schema ทุก sub-page | Google แสดง breadcrumb ใน search results |
| `og:locale` (en_US + th_TH) | รองรับทั้งสองภาษา |
| Twitter Card ครบทุกหน้า | Social preview สมบูรณ์ |
| `link rel="me"` → GitHub + LinkedIn | Google เชื่อม identity |
| Title tags รวมชื่อไทย + "Bangkok" | Local SEO |

---

## 🚨 สิ่งที่ต้องทำด้วยตัวเอง (สำคัญมาก!)

### 1. 📋 ลงทะเบียน Google Search Console

**ทำไมถึงสำคัญ**: ถ้าไม่ submit Google อาจใช้เวลา 3-6 เดือนกว่าจะ index เว็บ — พอ submit แล้วอาจเร็วได้ถึง 1-2 สัปดาห์

**ขั้นตอน:**
1. ไปที่ [search.google.com/search-console](https://search.google.com/search-console)
2. เพิ่ม property: `https://earthondev.github.io/Portfolio/`
3. เลือก verify method: **"HTML tag"**
4. Copy meta tag ที่ได้ เช่น:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXX" />
   ```
5. เพิ่มลงใน `<head>` ของ `index.html` (ใต้ `<meta name="author">`)
6. กลับมา Search Console แล้วกด **Verify**
7. หลัง verify แล้ว → ไปที่ **Sitemaps** → ใส่: `sitemap.xml` → กด Submit

---

### 2. 🔗 อัปเดต LinkedIn Profile ให้ชี้มาที่เว็บ

**ทำไม**: Google ใช้ signal จาก LinkedIn เพื่อยืนยัน identity

1. ไปที่ [linkedin.com/in/earthondev](https://www.linkedin.com/in/earthondev/)
2. Edit profile → **Website** → เพิ่ม URL: `https://earthondev.github.io/Portfolio/`
3. เพิ่มในส่วน "About" ด้วย: "Portfolio: https://earthondev.github.io/Portfolio/"

---

### 3. 🐙 อัปเดต GitHub Profile

1. ไปที่ [github.com/earthondev](https://github.com/earthondev)
2. Edit profile → **Website**: `https://earthondev.github.io/Portfolio/`
3. เพิ่ม bio ที่รวมคำว่า "Data Analyst" และชื่อ

---

### 4. 📍 Google My Business / Google Knowledge Panel

เมื่อ Google รู้จักตัวตนดีพอแล้ว จะมี Knowledge Panel ขึ้นโดยอัตโนมัติ เร่งได้โดย:
1. ค้นหาชื่อตัวเองใน Google → กด **"Claim this Knowledge Panel"** ถ้ามี
2. ถ้ายังไม่มี → รอหลัง Search Console submit ประมาณ 2-4 สัปดาห์

---

## ⏱️ Timeline คาดการณ์

| ช่วงเวลา | สิ่งที่จะเกิดขึ้น |
|---|---|
| **วันที่ submit sitemap** | Google เริ่ม crawl เว็บ |
| **1-3 วัน** | หน้า index.html ถูก index |
| **1-2 สัปดาห์** | ค้นหา "Nattapart Worakun" → เจอเว็บ |
| **2-4 สัปดาห์** | ค้นหา "ณัฐภาส วรคันธ์" → เจอเว็บ |
| **1-2 เดือน** | ค้นหา "data analyst portfolio Bangkok" → เจอเว็บ |
| **2-3 เดือน** | เริ่มขึ้น Google Knowledge Panel |

---

## 🎯 คำค้นหาที่คาดว่าจะเจอเว็บ (หลัง setup เสร็จ)

| คำค้นหา | โอกาสติดหน้า 1 |
|---|---|
| `Nattapart Worakun` | ⭐⭐⭐⭐⭐ (ชื่อเฉพาะ) |
| `ณัฐภาส วรคันธ์` | ⭐⭐⭐⭐⭐ (ชื่อไทยเฉพาะ) |
| `ณัฐภาส data analyst` | ⭐⭐⭐⭐ |
| `earthondev` | ⭐⭐⭐⭐⭐ (username เฉพาะ) |
| `Nattapart data analyst Bangkok` | ⭐⭐⭐⭐ |
| `data analyst portfolio Bangkok` | ⭐⭐ (แข่งขันสูง) |
| `inventory analytics dashboard portfolio` | ⭐⭐⭐ |

---

## 📝 หมายเหตุเพิ่มเติม

- **Google ไม่รับประกันอันดับ** — SEO ใช้เวลาและขึ้นกับหลายปัจจัย
- **สำหรับชื่อสะกดผิด** เช่น "Nattpaart" หรือ "ณัฐภาส" — Google มี spell correction อยู่แล้ว ถ้าค้น "Nattpaart Worakun" Google จะถามว่า "หมายถึง Nattapart Worakun หรือเปล่า?"
- **Backlinks** ช่วยมาก — ถ้าแชร์เว็บในกลุ่ม tech, LinkedIn, หรือ GitHub จะช่วยให้ rank เร็วขึ้น
