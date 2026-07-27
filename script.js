/* ==========================================================================
   GILZ // COMIC PORTFOLIO — SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------- */
    /* SPLINE 3D — AUTO LOAD (robot scene) */
    /* Ganti nilai SPLINE_URL nek link scene.splinecode wis kok duweni */
    /* ---------------------------------- */
    const SPLINE_URL = 'https://prod.spline.design/sBfg7RofZiNApl05/scene.splinecode';
    const heroSpline = document.getElementById('heroSpline');
    const orbitBadge = document.querySelector('.orbit-badge');

    if(heroSpline){
        if(SPLINE_URL){
            heroSpline.setAttribute('url', SPLINE_URL);

            // Cek langsung apa scene-e isok diakses publik, ben ketok jelas nek gagal
            fetch(SPLINE_URL, { method:'HEAD' })
                .then(res => {
                    if(!res.ok){
                        showToast('⚠️ Scene 3D gak isok diakses (status ' + res.status + '). Cek apa scene wis di-publish/public nang Spline.');
                    }
                })
                .catch(() => {
                    showToast('⚠️ Gagal njupuk scene 3D — cek koneksi utawa link scene-e.');
                });
        } else {
            // Durung ono URL asli -> sembunyikan slot 3D ben gak muncul kothak kosong
            heroSpline.style.display = 'none';
            if(orbitBadge) orbitBadge.style.position = 'relative';
        }
        heroSpline.addEventListener('load', () => {
            heroSpline.classList.add('loaded');
        });
        heroSpline.addEventListener('error', () => {
            showToast('⚠️ Spline viewer error saat memuat scene.');
        });
    }

    /* ---------------------------------- */
    /* PARTICLE FIELD (HERO)              */
    /* ---------------------------------- */
    const particleField = document.getElementById('particleField');
    if(particleField){
        const particleCount = window.innerWidth < 560 ? 18 : 34;
        for(let i = 0; i < particleCount; i++){
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDelay = (Math.random() * 3.5) + 's';
            p.style.animationDuration = (2.5 + Math.random() * 3) + 's';
            particleField.appendChild(p);
        }
    }

    /* ---------------------------------- */
    /* AOS INIT                           */
    /* ---------------------------------- */
    if(window.AOS){
        AOS.init({ duration:700, easing:'ease-out-cubic', once:true, offset:60 });
    }

    /* ---------------------------------- */
    /* LOADING SCREEN                     */
    /* ---------------------------------- */
    const loaderScreen = document.getElementById('loaderScreen');
    const loaderBarFill = document.getElementById('loaderBarFill');
    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 18 + 8;
        if(loadProgress >= 100){
            loadProgress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loaderScreen.classList.add('hide');
                document.body.style.overflow = '';
            }, 300);
        }
        loaderBarFill.style.width = loadProgress + '%';
    }, 180);
    document.body.style.overflow = 'hidden';
    // Safety fallback in case interval logic stalls
    window.addEventListener('load', () => {
        setTimeout(() => {
            loaderScreen.classList.add('hide');
            document.body.style.overflow = '';
        }, 2200);
    });

    /* ---------------------------------- */
    /* DARK MODE                          */
    /* ---------------------------------- */
    const btnDarkMode = document.getElementById('btnDarkMode');
    const bodyEl = document.body;
    const savedTheme = localStorage.getItem('gilz-theme');
    if(savedTheme === 'dark'){
        bodyEl.classList.add('dark-mode');
        btnDarkMode.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    btnDarkMode.addEventListener('click', () => {
        bodyEl.classList.toggle('dark-mode');
        const isDark = bodyEl.classList.contains('dark-mode');
        btnDarkMode.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('gilz-theme', isDark ? 'dark' : 'light');
    });

    /* ---------------------------------- */
    /* CUSTOM CURSOR + MOUSE GLOW         */
    /* ---------------------------------- */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing(){
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, .tilt-card, .skill-card, .masonry-item, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    /* ---------------------------------- */
    /* SCROLL PROGRESS BAR                */
    /* ---------------------------------- */
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';

        navbar.classList.toggle('scrolled', scrollTop > 20);
        backToTop.classList.toggle('show', scrollTop > 500);

        updateActiveNavLink();
    }, { passive:true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top:0, behavior:'smooth' });
    });

    /* ---------------------------------- */
    /* MOBILE MENU                        */
    /* ---------------------------------- */
    const btnBurger = document.getElementById('btnBurger');
    const navMenu = document.getElementById('navMenu');
    btnBurger.addEventListener('click', () => {
        btnBurger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            btnBurger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    /* ---------------------------------- */
    /* ACTIVE NAV LINK ON SCROLL           */
    /* ---------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink(){
        let currentId = sections[0] ? sections[0].id : '';
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if(rect.top <= 140 && rect.bottom >= 140){
                currentId = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    /* ---------------------------------- */
    /* TYPING EFFECT (HERO ROLE)          */
    /* ---------------------------------- */
    const roles = ['WEB DEVELOPER', 'BOT ARCHITECT', 'BACKEND ENGINEER', 'AUTOMATION BUILDER'];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    const typedText = document.getElementById('typedText');
    if(typedText){
        function typeLoop(){
            const currentRole = roles[roleIndex];
            if(isDeleting){
                charIndex--;
            } else {
                charIndex++;
            }
            typedText.textContent = currentRole.substring(0, charIndex);

            let speed = isDeleting ? 45 : 90;

            if(!isDeleting && charIndex === currentRole.length){
                speed = 1400;
                isDeleting = true;
            } else if(isDeleting && charIndex === 0){
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }
            setTimeout(typeLoop, speed);
        }
        typeLoop();
    }

    /* ---------------------------------- */
    /* ANIMATED COUNTERS (IntersectionObserver) */
    /* ---------------------------------- */
    const statBoxes = document.querySelectorAll('.stat-box');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const box = entry.target;
                const counterEl = box.querySelector('.counter');
                const target = parseInt(box.dataset.count, 10);
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 60));
                const timer = setInterval(() => {
                    current += step;
                    if(current >= target){
                        current = target;
                        clearInterval(timer);
                    }
                    counterEl.textContent = current;
                }, 25);
                counterObserver.unobserve(box);
            }
        });
    }, { threshold:0.4 });
    statBoxes.forEach(box => counterObserver.observe(box));

    /* ---------------------------------- */
    /* SKILL PROGRESS BARS                */
    /* ---------------------------------- */
    const progressFills = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.style.width = entry.target.dataset.width + '%';
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold:0.5 });
    progressFills.forEach(fill => progressObserver.observe(fill));

    /* ---------------------------------- */
    /* CIRCULAR PROGRESS SKILLS           */
    /* ---------------------------------- */
    const circleFills = document.querySelectorAll('.circle-fill');
    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const circle = entry.target;
                const percent = parseInt(circle.dataset.percent, 10);
                const circumference = 314; // 2 * PI * r(50)
                const offset = circumference - (percent / 100) * circumference;
                circle.style.strokeDashoffset = offset;
                circleObserver.unobserve(circle);
            }
        });
    }, { threshold:0.5 });
    circleFills.forEach(circle => circleObserver.observe(circle));

    /* ---------------------------------- */
    /* TILT CARD EFFECT                   */
    /* ---------------------------------- */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ---------------------------------- */
    /* RIPPLE BUTTON EFFECT               */
    /* ---------------------------------- */
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.style.position = btn.style.position || 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function(e){
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple-el';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ---------------------------------- */
    /* LIGHTBOX (GALLERY)                 */
    /* ---------------------------------- */
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxIcon = document.getElementById('lightboxIcon');
    const lightboxLabel = document.getElementById('lightboxLabel');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.masonry-item').forEach(item => {
        item.addEventListener('click', () => {
            const iconHTML = item.querySelector('i').outerHTML;
            lightboxIcon.innerHTML = iconHTML;
            lightboxLabel.textContent = item.dataset.lightboxLabel || '';
            lightboxOverlay.classList.add('active');
        });
    });
    function closeLightbox(){ lightboxOverlay.classList.remove('active'); }
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', (e) => {
        if(e.target === lightboxOverlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') closeLightbox();
    });

    /* ---------------------------------- */
    /* TESTIMONIAL SLIDER                 */
    /* ---------------------------------- */
    const testiTrack = document.getElementById('testiTrack');
    const testiCards = document.querySelectorAll('.testi-card');
    const testiDotsWrap = document.getElementById('testiDots');
    const testiPrev = document.getElementById('testiPrev');
    const testiNext = document.getElementById('testiNext');
    let testiIndex = 0;

    testiCards.forEach((_, i) => {
        const dot = document.createElement('span');
        if(i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTesti(i));
        testiDotsWrap.appendChild(dot);
    });
    const testiDots = testiDotsWrap.querySelectorAll('span');

    function goToTesti(index){
        testiIndex = (index + testiCards.length) % testiCards.length;
        testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
        testiDots.forEach((d, i) => d.classList.toggle('active', i === testiIndex));
    }
    testiPrev.addEventListener('click', () => goToTesti(testiIndex - 1));
    testiNext.addEventListener('click', () => goToTesti(testiIndex + 1));

    let testiAutoplay = setInterval(() => goToTesti(testiIndex + 1), 5000);
    document.querySelector('.testi-slider').addEventListener('mouseenter', () => clearInterval(testiAutoplay));
    document.querySelector('.testi-slider').addEventListener('mouseleave', () => {
        testiAutoplay = setInterval(() => goToTesti(testiIndex + 1), 5000);
    });

    /* ---------------------------------- */
    /* TOAST HELPER                       */
    /* ---------------------------------- */
    const toastComic = document.getElementById('toastComic');
    let toastTimer;
    function showToast(message){
        toastComic.textContent = message;
        toastComic.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastComic.classList.remove('show'), 3000);
    }

    /* ---------------------------------- */
    /* CONTACT FORM -> REDIRECT KE WHATSAPP */
    /* Tanpa backend: pesan disusun otomatis lalu dibuka di WA GILZ. */
    /* ---------------------------------- */
    const WA_NUMBER = '6287827101306';
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fName').value.trim();
        const email = document.getElementById('fEmail').value.trim();
        const subject = document.getElementById('fSubject').value.trim();
        const message = document.getElementById('fMessage').value.trim();

        const waText =
            `Halo GILZ, saya ${name} (${email}).%0A` +
            `Subject: ${subject}%0A%0A` +
            `${message}`;

        showToast('✅ Membuka WhatsApp...');
        window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank');
        contactForm.reset();
    });

    /* ---------------------------------- */
    /* DOWNLOAD CV (DEMO NOTICE)          */
    /* ---------------------------------- */
    const btnDownloadCV = document.getElementById('btnDownloadCV');
    if(btnDownloadCV){
        btnDownloadCV.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('📄 CV belum di-upload — ganti link ini di index.html ya!');
        });
    }

    /* ---------------------------------- */
    /* FOOTER YEAR                        */
    /* ---------------------------------- */
    document.getElementById('yearNow').textContent = new Date().getFullYear();

    /* Initial call in case page loads mid-scroll */
    updateActiveNavLink();
});
