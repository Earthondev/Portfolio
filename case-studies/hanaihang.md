---
id: hanaihang
title: HaaNaiHang – Mall & Store Finder + Admin
date: 2025-08-31
cover: /assets/projects/hanaihang/cover.webp
tags: [Geolocation, Admin, UI/UX]
---

## Overview

HaaNaiHang เป็นเว็บแอปพลิเคชันสำหรับค้นหาศูนย์การค้าและร้านค้าใกล้คุณ พร้อมระบบแอดมินที่ช่วยให้ผู้ดูแลสามารถเพิ่ม แก้ไข และจัดการข้อมูลศูนย์การค้าและร้านค้าได้อย่างเป็นระบบ

## Key Features

### 🔍 **การค้นหาแบบ Smart**
- ค้นหาตามระยะทางโดยใช้ Geolocation
- ค้นหาด้วยข้อความ (ชื่อห้าง, ร้านค้า, หมวดหมู่)
- แสดงระยะทางแบบ Real-time (เช่น 7.0 กม.)

### 🏢 **ข้อมูลครบถ้วน**
- เวลาทำการของห้างและร้านค้า
- หมวดหมู่ร้านค้า
- ชั้น (floor) และหมายเลขยูนิต
- เบอร์โทรศัพท์ติดต่อ

### ⚙️ **ระบบแอดมิน**
- แยกแท็บ: ศูนย์การค้า / ร้านค้า
- ฟอร์มเพิ่ม/แก้ไขข้อมูลแบบละเอียด
- ตารางแสดงข้อมูลพร้อมการค้นหาและกรอง

### 📱 **UI/UX ที่ใช้งานง่าย**
- การ์ด UI อ่านง่าย
- Responsive design รองรับทุกอุปกรณ์
- การแสดงผลที่ชัดเจนและเข้าใจง่าย

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Database, Storage)
- **Deployment**: Netlify
- **Maps**: Google Maps API

## Development Process

### 1. **Research & Planning**
- ศึกษาความต้องการของผู้ใช้
- วิเคราะห์ฟีเจอร์ที่จำเป็น
- ออกแบบ UI/UX wireframes

### 2. **Development**
- สร้าง React app ด้วย TypeScript
- ใช้ Tailwind CSS สำหรับ styling
- เชื่อมต่อ Firebase สำหรับ backend
- พัฒนาระบบแอดมิน

### 3. **Testing & QA**
- ทดสอบฟังก์ชันการค้นหา
- ตรวจสอบระบบแอดมิน
- ทดสอบบนอุปกรณ์ต่างๆ

### 4. **Deployment**
- Deploy บน Netlify
- ตั้งค่า custom domain
- ทดสอบการทำงานจริง

## Challenges & Solutions

### 🎯 **Challenge 1: Geolocation Accuracy**
**ปัญหา**: การระบุตำแหน่งไม่แม่นยำ
**วิธีแก้**: ใช้ Google Maps API และเพิ่มการแสดงผลระยะทางแบบ Real-time

### 🎯 **Challenge 2: Data Management**
**ปัญหา**: การจัดการข้อมูลห้างและร้านค้าที่ซับซ้อน
**วิธีแก้**: สร้างระบบแอดมินแยกแท็บและฟอร์มที่ใช้งานง่าย

### 🎯 **Challenge 3: Performance**
**ปัญหา**: การโหลดข้อมูลช้าเมื่อมีข้อมูลมาก
**วิธีแก้**: ใช้ Firebase Firestore และ implement pagination

## Results

- ✅ ระบบค้นหาทำงานได้อย่างแม่นยำ
- ✅ ระบบแอดมินใช้งานง่ายและมีประสิทธิภาพ
- ✅ UI/UX ได้รับการตอบรับที่ดี
- ✅ Performance ดีขึ้นอย่างเห็นได้ชัด

## Future Enhancements

- [ ] เพิ่มระบบรีวิวและคะแนน
- [ ] เพิ่มฟีเจอร์จองโต๊ะร้านอาหาร
- [ ] เพิ่มระบบแจ้งเตือนโปรโมชั่น
- [ ] พัฒนา Mobile App

## Links

- **Live Demo**: [https://hanaihang.netlify.app/](https://hanaihang.netlify.app/)
- **GitHub**: [https://github.com/Earthondev/Hanaihang](https://github.com/Earthondev/Hanaihang)

---

*Project completed in 2025*
