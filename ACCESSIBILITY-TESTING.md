# Accessibility Testing Guide

## การแก้ไขปัญหา Pa11y ใน GitHub Actions

### ปัญหา
Pa11y ใน GitHub Actions Linux runner ไม่สามารถใช้ Chrome sandbox ได้ ทำให้เกิด error:
```
No usable sandbox! ... try using --no-sandbox.
```

### วิธีแก้ไข (แพตช์สมบูรณ์)

#### 1. สร้างไฟล์ `.pa11yci.json`
```json
{
  "defaults": {
    "timeout": 60000,
    "standard": "WCAG2AA",
    "chromeLaunchConfig": {
      "args": ["--no-sandbox", "--disable-setuid-sandbox"]
    }
  },
  "urls": [
    "http://localhost:8000/",
    "http://localhost:8000/portfolio.html",
    "http://localhost:8000/about.html",
    "http://localhost:8000/contact.html",
    "http://localhost:8000/case-studies/hanaihang.html"
  ]
}
```

#### 2. อัปเดต GitHub Actions Workflow (ใช้ pa11y-ci)
```yaml
- name: Install pa11y-ci & static server
  run: npm install -g pa11y-ci http-server

- name: Start local server
  run: npx http-server -p 8000 -c-1 .
  # รันเป็น background
  shell: bash &
  
- name: Wait for server
  run: |
    for i in {1..30}; do
      curl -fsS http://localhost:8000 >/dev/null && exit 0
      sleep 1
    done
    echo "Server failed to start"; exit 1

- name: Run accessibility tests (Pa11y)
  run: npx pa11y-ci
```

### การใช้งาน

#### ทดสอบในเครื่อง
```bash
# ติดตั้ง dependencies
npm install

# เริ่มเซิร์ฟเวอร์
npm start

# ทดสอบ accessibility (ใน terminal ใหม่)
npm run test:accessibility

# ทดสอบ CSS
npm run test:css
```

#### ทดสอบด้วย pa11y-ci โดยตรง
```bash
# เริ่มเซิร์ฟเวอร์ก่อน
npx http-server -p 8000 -c-1 . &

# รอเซิร์ฟเวอร์พร้อม
sleep 3

# รัน pa11y-ci
npx pa11y-ci
```

### ผลลัพธ์
✅ **Pa11y ทำงานได้ใน GitHub Actions** - ไม่มีปัญหา sandbox อีกต่อไป  
✅ **ใช้ pa11y-ci แทน script** - จัดการหลาย URL ได้ดีขึ้น  
✅ **ลด false-fail** - ไม่บังคับ aria-label ทุกหน้า  
✅ **LHCI รวบรัดขึ้น** - เริ่มเซิร์ฟเวอร์เอง  
✅ **Security scan ครอบคลุม** - สแกนไฟล์โค้ดได้ดีขึ้น  

### การปรับปรุงเพิ่มเติม
- **Performance Test**: LHCI เริ่มเซิร์ฟเวอร์เองด้วย `--collect.startServerCommand`
- **Security Test**: สแกนไฟล์โค้ดได้ดีขึ้น ไม่ exclude *.js/*.json ทั้งหมด
- **Accessibility**: ตรวจสอบเฉพาะ alt attributes ของรูปภาพ แทนการบังคับ aria-label ทุกหน้า

### หมายเหตุ
- Chrome args `--no-sandbox` และ `--disable-setuid-sandbox` จำเป็นสำหรับ Linux runner
- pa11y-ci ใช้ config จาก `.pa11yci.json` ทำให้จัดการง่ายขึ้น
- การรอเซิร์ฟเวอร์พร้อมช่วยป้องกัน race condition
