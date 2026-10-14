const hosts = document.querySelectorAll<HTMLElement>('[data-badge-scene]');
const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue;
        const host = entry.target;
        observer.unobserve(host);
        host.dataset.badgeState = 'loading';
        import('./scene').then(({ mountBadge }) => mountBadge(host)).catch((error: unknown) => {
            console.error('The interactive badge could not be initialized:', error);
            host.dataset.badgeState = 'fallback';
            const canvas = host.querySelector('canvas');
            if (canvas) { canvas.setAttribute('aria-hidden', 'true'); canvas.tabIndex = -1; }
            const fallback = host.querySelector('.badge-scene__fallback');
            fallback?.removeAttribute('aria-hidden');
            host.querySelector('.badge-scene__fallback img')?.setAttribute('alt', "Nattapart Worakun's identity card with his real original photo");
            const status = host.querySelector<HTMLElement>('[data-badge-status]');
            if (status) status.textContent = 'The static badge is shown because 3D is unavailable.';
        });
    }
}, { rootMargin: '250px' });
hosts.forEach(host => observer.observe(host));
