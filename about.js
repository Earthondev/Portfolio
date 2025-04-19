document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.getElementById('likeButton');
    const likeCountSpan = document.getElementById('likeCount');
    let likeCount = parseInt(localStorage.getItem('likeCount')) || 0;
    likeCountSpan.innerText = likeCount + ' คน';
  
    likeButton.addEventListener('click', function() {
      likeCount++;
      likeCountSpan.innerText = likeCount + ' คน';
      localStorage.setItem('likeCount', likeCount);
      // เพิ่ม Animation เล็กๆ เมื่อกด Like
      likeButton.classList.add('liked');
      setTimeout(() => {
        likeButton.classList.remove('liked');
      }, 300);
    });
  
    // Night Mode Toggle
    const nightModeToggle = document.createElement('button');
    nightModeToggle.classList.add('night-mode-toggle');
    nightModeToggle.innerText = '🌙 Night Mode';
    document.body.appendChild(nightModeToggle);
  
    // ตรวจสอบสถานะ Night Mode ที่บันทึกไว้
    const isNightMode = localStorage.getItem('nightMode') === 'enabled';
    if (isNightMode) {
      enableNightMode();
    }
  
    nightModeToggle.addEventListener('click', function() {
      document.body.classList.toggle('night-mode');
      const elementsWithNightMode = document.querySelectorAll('.skills, .skills h2, .skill span, .bar, .tools-grid, .tools h2, .tool p, header, nav a, .nav-link a, .like-button, .like-count');
      elementsWithNightMode.forEach(element => {
        element.classList.toggle('night-mode');
      });
      nightModeToggle.classList.toggle('night-mode');
  
      if (document.body.classList.contains('night-mode')) {
        nightModeToggle.innerText = '☀️ Light Mode';
        localStorage.setItem('nightMode', 'enabled');
      } else {
        nightModeToggle.innerText = '🌙 Night Mode';
        localStorage.setItem('nightMode', 'disabled');
      }
    });
  
    function enableNightMode() {
      document.body.classList.add('night-mode');
      const elementsWithNightMode = document.querySelectorAll('.skills, .skills h2, .skill span, .bar, .tools-grid, .tools h2, .tool p, header, nav a, .nav-link a, .like-button, .like-count');
      elementsWithNightMode.forEach(element => {
        element.classList.add('night-mode');
      });
      nightModeToggle.classList.add('night-mode');
      nightModeToggle.innerText = '☀️ Light Mode';
    }
  });