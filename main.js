// ============================================================
// main.js — Animasi Keren untuk Novazz Novel
// (Tambahkan file ini setelah script utama di HTML)
// ============================================================

(function() {
    'use strict';

    // ------------------------------------------------------------
    // 1. CANVAS PARTIKEL (Bintang / Partikel berkilau)
    // ------------------------------------------------------------
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.35;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w, h;
    let particles = [];
    const PARTICLE_COUNT = 120;
    const MOUSE_RADIUS = 120;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.01 + Math.random() * 0.02;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;

            // Interaksi dengan mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    this.x += dx * force * 0.04;
                    this.y += dy * force * 0.04;
                }
            }

            // Batas layar
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }
        draw() {
            const size = this.size + Math.sin(this.pulse) * 0.4;
            const alpha = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 235, 210, ${alpha})`;
            ctx.fill();
            // Glow
            ctx.shadowColor = 'rgba(201, 168, 124, 0.2)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Inisialisasi partikel
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Mouse tracking
    const mouse = { x: null, y: null };
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Animasi loop
    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        // Gambar garis antar partikel yang berdekatan
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(201, 168, 124, ${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ------------------------------------------------------------
    // 2. EFIS TILT 3D PADA KARTU NOVEL
    // ------------------------------------------------------------
    const cards = document.querySelectorAll('.novel-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02) translateY(-6px)`;
            card.style.transition = 'transform 0.05s ease-out';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1) translateY(0)';
            card.style.transition = 'transform 0.4s ease';
        });
    });

    // ------------------------------------------------------------
    // 3. REVEAL ANIMASI SAAT SCROLL (Intersection Observer)
    // ------------------------------------------------------------
    const revealElements = document.querySelectorAll('.novel-card, .hero, .detail-top, .about-wrap, .reader-wrap');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });

    // ------------------------------------------------------------
    // 4. TYPING EFFECT PADA HERO
    // ------------------------------------------------------------
    function typeHero() {
        const heroH1 = document.querySelector('.hero h1');
        if (!heroH1) return;
        const originalText = heroH1.textContent.trim();
        // Simpan teks asli di atribut data
        heroH1.dataset.fullText = originalText;
        heroH1.textContent = '';
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < originalText.length) {
                heroH1.textContent += originalText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Tambahkan kursor berkedip setelah selesai (opsional)
            }
        }, 70);
    }

    // Jalankan setelah DOM siap
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        typeHero();
    } else {
        document.addEventListener('DOMContentLoaded', typeHero);
    }

    // ------------------------------------------------------------
    // 5. TRANSISI HALAMAN DENGAN SLIDE (Override showPage asli)
    // ------------------------------------------------------------
    // Karena kita tidak bisa mengubah HTML, kita tambahkan efek transisi
    // dengan cara menambahkan class pada halaman saat ditampilkan.
    // Kita akan memonitor perubahan halaman dan menambahkan animasi.

    const originalShowPage = window.showPage; // backup jika ada
    // Kita override dengan fungsi baru yang menambahkan efek
    const pages = {
        home: document.getElementById('page-home'),
        novel: document.getElementById('page-novel'),
        genre: document.getElementById('page-genre'),
        about: document.getElementById('page-about'),
        detail: document.getElementById('page-detail'),
        reader: document.getElementById('page-reader')
    };

    // Fungsi baru untuk menambahkan animasi slide
    function enhancedShowPage(page, data) {
        // Panggil fungsi asli jika ada, atau kita jalankan sendiri
        if (typeof window.originalShowPage === 'function') {
            window.originalShowPage(page, data);
        } else {
            // fallback: pindah halaman manual (sederhana)
            Object.keys(pages).forEach(key => {
                pages[key].classList.remove('active');
            });
            if (pages[page]) pages[page].classList.add('active');
            // update nav
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.dataset.page === page);
            });
        }

        // Efek tambahan: animasi masuk dengan slide + fade
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            activePage.style.animation = 'none';
            // Trigger reflow
            void activePage.offsetHeight;
            activePage.style.animation = 'pageSlide 0.5s ease both';
        }
    }

    // Tambahkan keyframe untuk slide jika belum ada
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes pageSlide {
            0% { opacity: 0; transform: translateX(40px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        .page.active {
            animation: pageSlide 0.5s ease both;
        }
    `;
    document.head.appendChild(styleSheet);

    // Simpan fungsi asli dan ganti dengan yang baru
    if (typeof window.showPage === 'function') {
        window.originalShowPage = window.showPage;
    }
    window.showPage = enhancedShowPage;

    // ------------------------------------------------------------
    // 6. EFEK GLOW MENGIKUTI KURSOR (tambahan)
    // ------------------------------------------------------------
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(201,168,124,0.10) 0%, transparent 70%);
        pointer-events: none;
        z-index: 1;
        transform: translate(-50%, -50%);
        transition: left 0.08s ease-out, top 0.08s ease-out;
        will-change: left, top;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });

    // ------------------------------------------------------------
    // 7. ANIMASI PARALLAX PADA BACKGROUND (opsional)
    // ------------------------------------------------------------
    document.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrollY * 0.1 + 'px';
        }
    });

    console.log('✨ Novazz — Animasi keren aktif!');
})();
