// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handling
    initContactForm();
    
    // Initialize analytics tracking
    initAnalytics();
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('sendBtn');
    const spinner = btn.querySelector('.btn-spinner');

    if (!form || !status || !btn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // honeypot check
        if (form._gotcha?.value) return;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            setStatus('⚠️ Please fill in all fields', 'error');
            return;
        }

        toggleButton(true);

        try {
            const fd = new FormData(form);
            const res = await fetch(form.action, { 
                method: 'POST', 
                body: fd, 
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                setStatus('✅ Thank you! Your message has been sent', 'success', true);
                form.reset();
                track('contact_form_submit', { source: 'contact' });
            } else {
                setStatus('⚠️ Something went wrong. Please try again later.', 'error');
            }
        } catch {
            setStatus('⚠️ Network error. Please try again.', 'error');
        } finally {
            toggleButton(false);
        }
    });

    function setStatus(msg, type, autohide = false) {
        status.textContent = msg;
        status.className = `form-status ${type} fade-in`;
        if (autohide) {
            setTimeout(() => {
                status.classList.replace('fade-in', 'fade-out');
                setTimeout(() => { 
                    status.textContent = ''; 
                    status.className = 'form-status'; 
                }, 300);
            }, 5000);
        }
    }

    function toggleButton(disabled) {
        btn.disabled = disabled;
        spinner.hidden = !disabled;
    }
}

function initAnalytics() {
    // CTA Tracking
    document.querySelectorAll('[data-track]').forEach(el => {
        el.addEventListener('click', () => {
            const trackName = el.dataset.track;
            const source = el.dataset.source || 'contact';
            track(trackName, { source });
        });
    });
}

function track(name, data = {}) {
    if (window.gtag) {
        window.gtag('event', name, data);
    }
    console.log('Analytics Event:', name, data);
}
