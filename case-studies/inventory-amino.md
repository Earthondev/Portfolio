# Inventory Amino - Lab Stock Management System

## Project Overview

**Inventory Amino** เป็นระบบจัดการสต็อกสารเคมี/วัสดุในแล็บ Mobile-first พร้อมแกลเลอรีรูป, รายงานคงเหลือ และแจ้งเตือนของใกล้หมด

### Key Details
- **Role:** Product Designer, No-Code Developer, Data Modeler
- **Tech Stack:** AppSheet, Google Sheets, Google Drive, Google Apps Script
- **Timeline:** 2 weeks design + 1 week implementation
- **Team Size:** Solo project

## The Problem

### Current Challenges
- **Paper-based Records:** สต็อกสารเคมีบันทึกกระดาษ/สเปรดชีต กระจัดกระจาย หา/หยิบช้าผิดบ่อย
- **Time-consuming Search:** ใช้เวลานานในการค้นหาและหยิบของที่ถูกต้อง
- **Stock Shortages:** ไม่มีการแจ้งเตือนของใกล้หมด ทำให้ขาดสต็อกบ่อย
- **No Audit Trail:** ไม่มีประวัติการเคลื่อนไหวของสต็อก ทำให้ตรวจสอบยาก

## The Solution

สร้าง AppSheet แอปเดียวรวมรายการคงเหลือ, แกลเลอรีรูป, ประวัติธุรกรรม และแจ้งเตือนของใกล้หมด

### Key Features
- **📱 Mobile-First Design:** ออกแบบให้ใช้งานผ่านโทรศัพท์/แท็บเล็ตเป็นหลัก
- **🔄 Order → Receive → Use Flow:** ระบบธุรกรรมที่ครอบคลุมตั้งแต่สั่งซื้อ รับของ ไปจนถึงการใช้งาน
- **📸 Image Gallery:** แกลเลอรีรูปภาพฉลาก/ภาชนะจริงเพื่อช่วยหยิบของถูกต้อง
- **🚨 Low Stock Alerts:** แจ้งเตือนอัตโนมัติเมื่อสต็อกใกล้หมดหรือหมด

## Technical Implementation

### Data Model
```
Tables:
  Items(id, name, category, unit, min_stock, image_url, hazard_class, supplier, created_at)
  Transactions(id, date, item_id, type{ORDER|RECEIVE|USE}, qty, note, user, created_at)

Views:
  StockView(item_id, name, current_stock, status)

Bots:
  NotifyLowStock -> when current_stock <= min_stock -> Email/Line
```

### Key Technical Features
- **Computed Fields:** current_stock, status ("ปกติ/ใกล้หมด/หมด")
- **Validations:** qty > 0, use_qty ≤ current_stock
- **Derived Views:** รายงานคงเหลือ, ประวัติรายการตามช่วงเวลา
- **Conditional Formatting:** แถบสี/ไอคอนเตือนใน list เมื่อใกล้หมด
- **Row-Level Security:** จำกัดข้อมูลตามทีม/ห้องแล็บ

### Automation & Workflow
- **Low Stock Alert:** แจ้งเตือนอีเมล/ไลน์เมื่อ current_stock ≤ min_stock
- **Image Handling:** อัปโหลดภาพไปยัง Drive แล้ว bind URL กลับเข้ารายการ
- **Audit Trail:** เก็บประวัติการแก้ไข stock
- **Data Backup:** สำรองข้อมูลตามรอบ (export CSV/Sheets snapshot)

## Results & Impact

### Performance Metrics
- **30-50%** ลดเวลาค้นหา/หยิบของ (Gallery + Search)
- **≥40%** ลดข้อผิดพลาดการเบิกจ่าย (ฟอร์ม + validation)
- **Real-time** อัปเดตรายงานคงเหลือจากธุรกรรม
- **<30 min** Onboarding ผู้ใช้ใหม่

### Business Impact
- ลดเวลาการทำงานประจำวันของทีมแล็บ
- ป้องกันการขาดสต็อกที่สำคัญ
- เพิ่มความแม่นยำในการบันทึกข้อมูล
- สร้าง audit trail ที่สมบูรณ์

## Lessons Learned

### Technical Insights
- **No-Code Power:** AppSheet สามารถสร้างระบบที่ซับซ้อนได้โดยไม่ต้องเขียนโค้ด แต่ต้องออกแบบ data model ให้ดี
- **Mobile-First Critical:** ในสภาพแวดล้อมแล็บ การใช้งานผ่านมือถือสำคัญกว่าการใช้ผ่านคอมพิวเตอร์
- **Visual Recognition:** รูปภาพช่วยให้ผู้ใช้จำและหยิบของถูกต้องได้มากกว่าการอ่านชื่อเพียงอย่างเดียว
- **Validation is Key:** การตรวจสอบข้อมูลที่เข้มงวดช่วยป้องกันข้อผิดพลาดที่อาจเกิดจากความเร่งรีบในแล็บ

### Process Improvements
- การออกแบบ UX ที่เข้าใจ workflow จริงของผู้ใช้สำคัญมาก
- การทดสอบกับผู้ใช้จริงช่วยให้เห็นปัญหาที่ไม่คาดคิด
- การสร้างระบบที่ยืดหยุ่นแต่มี validation ที่เข้มงวดเป็นกุญแจสำคัญ

## Future Enhancements

### Potential Improvements
- **Barcode Integration:** เพิ่มการสแกนบาร์โค้ดเพื่อความแม่นยำ
- **Advanced Analytics:** รายงานการใช้งานและแนวโน้มสต็อก
- **Multi-lab Support:** รองรับหลายห้องแล็บในระบบเดียว
- **API Integration:** เชื่อมต่อกับระบบ ERP หรือระบบอื่นๆ

## Conclusion

Inventory Amino แสดงให้เห็นว่า No-Code tools สามารถสร้างระบบที่ซับซ้อนและมีประสิทธิภาพได้ โดยเฉพาะเมื่อออกแบบให้เข้าใจความต้องการของผู้ใช้จริงและสภาพแวดล้อมการทำงาน

การเน้น Mobile-first design และการใช้งานรูปภาพช่วยให้ระบบนี้ประสบความสำเร็จในการลดเวลาและข้อผิดพลาดในการทำงานประจำวันของทีมแล็บ
