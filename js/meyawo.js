(() => {
    'use strict';

    const root = document.documentElement;
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('portfolio-theme');
    } catch {
        // Local storage can be unavailable when index.html is opened directly.
    }
    const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(preferredTheme);

    function setTheme(theme) {
        root.dataset.theme = theme;
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch {
            // Theme still works for this visit without persistent storage.
        }
        themeToggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        if (themeMeta) themeMeta.content = theme === 'dark' ? '#07111f' : '#f2f7f8';
    }

    themeToggle?.addEventListener('click', () => {
        setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    navToggle?.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
        navLinks.classList.toggle('open', !isOpen);
        document.body.classList.toggle('nav-open', !isOpen);
    });

    navLinks?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.setAttribute('aria-label', 'Open navigation');
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        });
    });

    const navbar = document.querySelector('.navbar');
    const updateNavbar = () => navbar?.classList.toggle('scrolled', window.scrollY > 24);
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    const revealItems = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((item) => item.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const delay = Number(entry.target.dataset.delay || 0);
                window.setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.13 });
        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const sections = document.querySelectorAll('main section[id]');
    const navigationItems = document.querySelectorAll('.nav-links a');
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navigationItems.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-38% 0px -55% 0px' });
        sections.forEach((section) => sectionObserver.observe(section));
    }

    const typedOutput = document.querySelector('#typed-output');
    const terminalLines = [
        'Linux • Monitoring • Bash • SQL',
        'SFTP • Schedulers • Deployments',
        'Troubleshoot • Automate • Improve'
    ];
    let terminalLineIndex = 0;
    if (typedOutput && !reduceMotion) {
        window.setInterval(() => {
            typedOutput.classList.add('changing');
            window.setTimeout(() => {
                terminalLineIndex = (terminalLineIndex + 1) % terminalLines.length;
                typedOutput.textContent = terminalLines[terminalLineIndex];
                typedOutput.classList.remove('changing');
            }, 220);
        }, 3200);
    }

    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach((item) => item.classList.toggle('active', item === button));
            projectCards.forEach((card) => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.hidden = !shouldShow;
                if (shouldShow) card.animate(
                    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
                    { duration: 300, easing: 'ease-out' }
                );
            });
        });
    });

    const copyButton = document.querySelector('.copy-email');
    const toast = document.querySelector('.toast');
    let toastTimer;
    copyButton?.addEventListener('click', async () => {
        const email = copyButton.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
        } catch {
            const temporaryInput = document.createElement('input');
            temporaryInput.value = email;
            document.body.appendChild(temporaryInput);
            temporaryInput.select();
            document.execCommand('copy');
            temporaryInput.remove();
        }
        copyButton.querySelector('.copy-label').textContent = 'Copied!';
        toast?.classList.add('show');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
            toast?.classList.remove('show');
            copyButton.querySelector('.copy-label').textContent = 'Copy email';
        }, 2200);
    });

    const glow = document.querySelector('.cursor-glow');
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', (event) => {
            glow?.style.setProperty('--mouse-x', `${event.clientX}px`);
            glow?.style.setProperty('--mouse-y', `${event.clientY}px`);
        }, { passive: true });

        document.querySelectorAll('.tilt-card').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const bounds = card.getBoundingClientRect();
                const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
                const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    const canvas = document.querySelector('#network-canvas');
    const context = canvas?.getContext('2d');
    const particles = [];
    let animationFrame;

    function resizeCanvas() {
        if (!canvas || !context) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        createParticles();
    }

    function createParticles() {
        particles.length = 0;
        const count = Math.min(55, Math.floor(window.innerWidth / 26));
        for (let index = 0; index < count; index += 1) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                size: Math.random() * 1.3 + 0.5
            });
        }
    }

    function drawNetwork() {
        if (!canvas || !context) return;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const isLight = root.dataset.theme === 'light';
        const pointColor = isLight ? '20, 104, 112' : '45, 226, 197';

        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

            context.beginPath();
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            context.fillStyle = `rgba(${pointColor}, .38)`;
            context.fill();

            for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
                const next = particles[nextIndex];
                const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
                if (distance > 120) continue;
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(next.x, next.y);
                context.strokeStyle = `rgba(${pointColor}, ${(1 - distance / 120) * 0.11})`;
                context.lineWidth = 0.7;
                context.stroke();
            }
        });

        animationFrame = window.requestAnimationFrame(drawNetwork);
    }

    if (canvas && context && !reduceMotion) {
        resizeCanvas();
        drawNetwork();
        let resizeTimer;
        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(resizeCanvas, 160);
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                window.cancelAnimationFrame(animationFrame);
            } else {
                drawNetwork();
            }
        });
    }

    const year = document.querySelector('#current-year');
    if (year) year.textContent = new Date().getFullYear();
})();
