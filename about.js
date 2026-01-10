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
  // Chart.js Visualization
  const initChart = async () => {
    const ctx = document.getElementById('skillRadarChart');
    if (!ctx) return;

    try {
      const response = await fetch('services.json');
      const data = await response.json();
      const skills = data.skills || [];

      // Group and score skills
      const scores = {
        'Data & Analytics': 0,
        'Automation': 0,
        'Science & QA': 0,
        'Development': 0,
        'Testing': 0
      };

      const counts = { ...scores };

      const mapping = {
        'Data': 'Data & Analytics',
        'Analytics': 'Data & Analytics',
        'Automation': 'Automation',
        'Science': 'Science & QA',
        'Fullstack': 'Development',
        'Frontend': 'Development',
        'Backend': 'Development',
        'DevOps': 'Development',
        'Geo': 'Development',
        'Testing': 'Testing',
        'UX': 'Development',
        'Performance': 'Testing'
      };

      const levelScore = { 'high': 90, 'medium': 70, 'low': 40 };

      skills.forEach(s => {
        const key = mapping[s.group] || 'Development';
        if (scores[key] !== undefined) {
          scores[key] += levelScore[s.level] || 50;
          counts[key]++;
        }
      });

      // Calculate average
      const labels = Object.keys(scores);
      const values = labels.map(k => counts[k] ? Math.round(scores[k] / counts[k]) : 0);

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Skill Proficiency',
            data: values,
            fill: true,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: '#dc2626',
            pointBackgroundColor: '#dc2626',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#dc2626'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            line: { borderWidth: 3 }
          },
          scales: {
            r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              pointLabels: {
                color: '#fff',
                font: { size: 14, family: "'Inter', sans-serif", weight: 'bold' }
              },
              ticks: { display: false, backdropColor: 'transparent' },
              suggestedMin: 0,
              suggestedMax: 100
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    } catch (e) {
      console.warn('Failed to load chart data', e);
    }
  };

  initChart();
});