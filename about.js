document.addEventListener('DOMContentLoaded', function() {
    const fireButton = document.getElementById('fireButton');
    const fireCountSpan = document.getElementById('fireCount');
    let fireCount = parseInt(localStorage.getItem('fireCount')) || 0;
    let growCount = parseInt(localStorage.getItem('growCount')) || 0;

    fireCountSpan.innerText = fireCount;

    fireButton.addEventListener('click', function() {
        fireCount++;
        fireCountSpan.innerText = fireCount;
        localStorage.setItem('fireCount', fireCount);

        if (growCount < 5) {
            growCount++;
            localStorage.setItem('growCount', growCount);
            fireButton.classList.add('fire-grow');
            setTimeout(() => {
                fireButton.classList.remove('fire-grow');
            }, 300);
            // Optionally increase font size for grow effect
            fireButton.style.fontSize = `${2 + (growCount * 0.2)}em`;
        } else {
            // After 5 grows, just do a small shake
            fireButton.classList.add('pulse');
            setTimeout(() => {
                fireButton.classList.remove('pulse');
            }, 300);
        }
    });

    // Night Mode Toggle (Automatic based on system preference)
    function updateNightMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('night-mode');
            const elementsWithNightMode = document.querySelectorAll('.skills-section, .skills-section h2, .skill span, .bar, .tools-grid, .tools h2, .tool p, header, nav a, .fire-count');
            elementsWithNightMode.forEach(element => {
                element.classList.add('night-mode');
            });
        } else {
            document.body.classList.remove('night-mode');
            const elementsWithNightMode = document.querySelectorAll('.skills-section, .skills-section h2, .skill span, .bar, .tools-grid, .tools h2, .tool p, header, nav a, .fire-count');
            elementsWithNightMode.forEach(element => {
                element.classList.remove('night-mode');
            });
        }
    }

    // Listen for changes in system color scheme
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateNightMode);
    }

    // Initial check for night mode
    updateNightMode();
});