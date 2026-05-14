/* Manoj Kumar — Futuristic Portfolio JS */

(() => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // Loader
    window.addEventListener('load', () => {
        const loader = $('#loader');
        if (loader) loader.style.display = 'none';
    });

    // Cursor glow
    const cursorGlow = $('.cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            cursorGlow.style.setProperty('--x', `${x}%`);
            cursorGlow.style.setProperty('--y', `${y}%`);
        }, {
            passive: true
        });
    }

    // Theme toggle
    const themeToggle = $('#themeToggle');
    const storedTheme = localStorage.getItem('portfolio-theme');
    if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('portfolio-theme', next);
        });
    }

    // Mobile menu
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');
    const closeMenuOnNav = () => {
        if (!navMenu) return;
        navMenu.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        $$('a.nav-link', navMenu).forEach(a => {
            a.addEventListener('click', closeMenuOnNav);
        });
    }

    // Navbar scrolled class
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
        if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, {
        passive: true
    });
    onScroll();

    // Active section highlight
    const sections = ['home', 'about', 'skills', 'projects', 'services', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const navLinks = $$('[data-nav]');
    const highlightActive = () => {
        const y = window.scrollY + 120;
        let current = sections[0]?.id;

        for (const sec of sections) {
            if (sec.offsetTop <= y) current = sec.id;
        }

        navLinks.forEach(l => {
            const key = l.getAttribute('data-nav');
            const link = document.querySelector(`.nav-link[data-nav="${key}"]`);
            if (link) link.classList.toggle('is-active', key === current);
        });
    };

    // Fallback if CSS query above doesn’t work (because we marked nav-link has data-nav)
    const highlightActiveFallback = () => {
        const y = window.scrollY + 120;
        let current = sections[0]?.id;
        for (const sec of sections) {
            if (sec.offsetTop <= y) current = sec.id;
        }
        $$('.nav-link').forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('data-nav') === current);
        });
    };

    const useFallback = () => {
        highlightActiveFallback();
    };
    // decide after DOM ready
    window.addEventListener('DOMContentLoaded', () => {
        // if initial selector doesn't find expected, use fallback
        if (!$('.nav-link.is-active') && navLinks.length === 0) useFallback();
    });

    window.addEventListener('scroll', () => {
        highlightActiveFallback();
    }, {
        passive: true
    });

    // Smooth scroll enhancement for reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
        $$('a.nav-link[href^="#"], a.btn[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMenuOnNav();
            });
        });
    }

    // Typing animation (only for the static hero typing element)
    const typingWrap = document.querySelector('[data-typing]');
    if (typingWrap) {
        // Keep text as-is; animate a subtle cursor pulse and optional per-letter effect
        const typingText = typingWrap.querySelector('.typing__text');
        const target = typingText ? typingText.textContent : 'modern and responsive websites.';

        // Convert into typed characters on load
        if (typingText) {
            typingText.textContent = '';
            const chars = [...target];
            let i = 0;
            const speed = 28;
            const start = () => {
                typingText.textContent += chars[i++];
                if (i < chars.length) setTimeout(start, speed);
            };
            setTimeout(start, 450);
        }
    }

    // Scroll reveal
    const revealEls = $$('[data-reveal]');
    if (revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    e.target.classList.add('reveal-in');
                    io.unobserve(e.target);
                }
            }
        }, {
            threshold: 0.14
        });

        revealEls.forEach(el => io.observe(el));
    }

    // Project actions: copy URL
    $$('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const url = btn.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(url);
                btn.classList.add('is-copied');
                const prev = btn.innerText;
                btn.querySelector('.btn__icon')?.setAttribute('aria-hidden', 'true');
                btn.dataset.prev = prev;
                btn.innerHTML = '<span class="btn__icon" aria-hidden="true">✓</span> Copied';
                setTimeout(() => {
                    btn.classList.remove('is-copied');
                    btn.innerHTML = prev;
                }, 1400);
            } catch {
                // Fallback: prompt
                window.prompt('Copy this URL:', url);
            }
        });
    });

    // Tilt 3D effect
    const tiltEls = $$('[data-tilt]');
    tiltEls.forEach(el => {
        const strength = 14;
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rx = (0.5 - py) * strength;
            const ry = (px - 0.5) * strength;
            el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        }, {
            passive: true
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });

    // Back to top
    const toTop = $('#toTop');
    const year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    const toggleToTop = () => {
        if (!toTop) return;
        toTop.classList.toggle('is-visible', window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleToTop, {
        passive: true
    });
    toggleToTop();

    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReduced ? 'auto' : 'smooth'
            });
        });
    }

    // Contact form UI (no backend)
    const contactForm = $('#contactForm');
    const formStatus = $('#formStatus');
    const whatsappBtn = $('#whatsappBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = contactForm.querySelector('input[name="email"]')?.value?.trim();
            const msg = contactForm.querySelector('textarea[name="message"]')?.value?.trim();
            if (formStatus) {
                formStatus.textContent = 'Sending...';
            }
            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = `Thanks${email ? `, ${email}` : ''}! Your message is ready. (UI demo)`;
                }
                contactForm.reset();
            }, 900);
        });
    }

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            // Update number/message if you have specifics
            const phone = '9000000000';
            const text = encodeURIComponent('Hi Manoj! I would like to discuss a project.');
            window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener');
        });
    }

    // Particles canvas
    const canvas = $('#bgParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w = 0,
            h = 0;
        const DPR = Math.min(2, window.devicePixelRatio || 1);

        const rand = (min, max) => Math.random() * (max - min) + min;

        const particles = [];
        const settings = {
            count: 70,
            linkDist: 120,
            speed: 0.18,
        };

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * DPR);
            canvas.height = Math.floor(h * DPR);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

            particles.length = 0;
            const count = Math.floor(settings.count * (w < 520 ? 0.65 : 1));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: rand(0, w),
                    y: rand(0, h),
                    vx: rand(-1, 1) * settings.speed,
                    vy: rand(-1, 1) * settings.speed,
                    r: rand(1.2, 2.4),
                    a: rand(0.25, 0.8)
                });
            }
        };

        window.addEventListener('resize', resize);
        resize();

        let rafId;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < settings.linkDist) {
                        const t = 1 - dist / settings.linkDist;
                        ctx.strokeStyle = `rgba(79,211,255,${0.22 * t})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            for (const p of particles) {
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
                grd.addColorStop(0, `rgba(79,211,255,${0.25 * p.a})`);
                grd.addColorStop(0.35, `rgba(166,107,255,${0.18 * p.a})`);
                grd.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(234,240,255,${0.26 * p.a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            rafId = requestAnimationFrame(draw);
        };

        draw();

        // Stop for reduced motion
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion && rafId) cancelAnimationFrame(rafId);
    }
})();