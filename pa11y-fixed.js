// pa11y-fixed.js
const pa11y = require('pa11y');

(async () => {
  // รายการเพจหลักที่อยากเช็ค
  const urls = [
    'http://localhost:8000/',
    'http://localhost:8000/portfolio.html',
    'http://localhost:8000/about.html',
    'http://localhost:8000/contact.html',
    'http://localhost:8000/case-studies/hanaihang.html'
  ];

  // ตั้งค่า Chromium ให้รันใน CI ได้ (no-sandbox)
  const baseOpts = {
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    standard: 'WCAG2AA',     // ปรับได้ตามที่ต้องการ
    timeout: 300000          // กัน timeout บน CI
  };

  let hasErrors = false;

  for (const url of urls) {
    console.log(`\n=== Running Pa11y on ${url} ===`);
    try {
      const results = await pa11y(url, baseOpts);

      if (!results.issues.length) {
        console.log('✅ No accessibility issues found.');
        continue;
      }

      // สรุปเฉพาะ serious/error (ลด noise)
      const important = results.issues.filter(i =>
        ['error', 'serious'].includes(i.type)
      );

      if (important.length === 0) {
        console.log(`ℹ️  Issues found but none serious/error. Count: ${results.issues.length}`);
      } else {
        hasErrors = true;
        console.log(`❌ Serious/Error issues: ${important.length}`);
        important.slice(0, 50).forEach((i, idx) => {
          console.log(
            `#${idx + 1} [${i.type}] ${i.code}\n  message: ${i.message}\n  selector: ${i.selector}\n`
          );
        });
      }
    } catch (err) {
      hasErrors = true;
      console.error(`❌ Pa11y failed on ${url}`);
      console.error(err?.message || err);
    }
  }

  process.exit(hasErrors ? 1 : 0);
})();
