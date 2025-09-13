// about.js
document.addEventListener('DOMContentLoaded', () => {
  // Guard: ทำงานเฉพาะหน้า about
  if (!location.pathname.includes('about.html')) {
    console.debug('Not on about page, skipping about.js initialization');
    return;
  }

  // ให้แอนิเมชันทำงานเฉพาะถ้า init สำเร็จ
  document.documentElement.classList.add('js-ready');

  // ทุกการอ้างอิง DOM ต้องเช็คก่อนเสมอ
  const nameEl = document.querySelector('[data-about-name]');
  if (nameEl) nameEl.textContent = 'Nattapart Worakun';

  const taglineEl = document.querySelector('[data-about-tagline]');
  if (taglineEl) taglineEl.textContent = 'Chemistry → Automation → Data & QA';

  // IntersectionObserver เพื่อโชว์ .reveal
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')), { threshold: 0.1 })
    : null;

  document.querySelectorAll('.reveal').forEach(el => {
    if (io) io.observe(el); else el.classList.add('is-visible'); // fallback ถ้าไม่มี IO
  });
});