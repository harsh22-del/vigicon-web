/* ═══════════════════════════════════════════════
   VIGICON Enterprises – script.js
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     1. NAVBAR – scroll & hamburger
  ────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    handleBackToTop();
    handleVideoTrigger();
    handleScrollSpy();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });


  /* ──────────────────────────────
     2. SCROLL SPY – active nav link
  ────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScrollSpy() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }


  /* ──────────────────────────────
     3. INTERSECTION OBSERVER – reveal
  ────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .svc-item, .process-step').forEach(el => {
    revealObserver.observe(el);
  });

  // Staggered service cards
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });

  // Staggered process steps
  const processSteps = document.querySelectorAll('.process-step');
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 150);
          stepObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  processSteps.forEach(step => stepObserver.observe(step));

  // Staggered svc items
  const svcItems = document.querySelectorAll('.svc-item');
  const svcObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          svcObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );
  svcItems.forEach(item => svcObserver.observe(item));


  /* ──────────────────────────────
     4. CONTACT FORM
  ────────────────────────────── */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();

    if (!name || !email) {
      shakeForm(contactForm);
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });

  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => el.style.animation = '', 400);
  }

  // Add shake keyframe dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0);}
      20%{transform:translateX(-6px);}
      40%{transform:translateX(6px);}
      60%{transform:translateX(-4px);}
      80%{transform:translateX(4px);}
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ──────────────────────────────
     5. BACK TO TOP BUTTON
  ────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ──────────────────────────────
     6. FLOATING VIDEO PLAYER
  ────────────────────────────── */
  const videoPlayer   = document.getElementById('videoPlayer');
  const videoTrigger  = document.getElementById('videoTrigger');
  const vpClose       = document.getElementById('vpClose');
  const vpVideo       = document.getElementById('vpVideo');
  const vpPlayPause   = document.getElementById('vpPlayPause');
  const vpPlayIcon    = document.getElementById('vpPlayIcon');
  const vpBar         = document.getElementById('vpBar');
  const vpPlaceholder = document.getElementById('vpPlaceholder');

  let videoShown = false;

  function handleVideoTrigger() {
    if (window.scrollY > 300 && !videoShown) {
      videoTrigger.classList.add('visible');
    }
  }

  videoTrigger.addEventListener('click', () => {
    videoPlayer.classList.add('open');
    videoTrigger.classList.remove('visible');
    videoShown = true;
  });

  vpClose.addEventListener('click', () => {
    videoPlayer.classList.remove('open');
    vpVideo.pause();
    vpPlayIcon.className = 'fas fa-play';
  });

  vpPlayPause.addEventListener('click', () => {
    // Check if actual video src exists
    const hasSrc = vpVideo.querySelector('source') &&
                   vpVideo.querySelector('source').getAttribute('src') !== '';
    if (!hasSrc || vpVideo.error) {
      // No real video – show placeholder pulse
      vpPlaceholder.style.color = 'rgba(243,148,34,0.8)';
      setTimeout(() => vpPlaceholder.style.color = '', 600);
      return;
    }
    if (vpVideo.paused) {
      vpVideo.play();
      vpPlayIcon.className = 'fas fa-pause';
      vpPlaceholder.style.display = 'none';
    } else {
      vpVideo.pause();
      vpPlayIcon.className = 'fas fa-play';
    }
  });

  vpVideo.addEventListener('timeupdate', () => {
    if (vpVideo.duration) {
      const pct = (vpVideo.currentTime / vpVideo.duration) * 100;
      vpBar.style.width = pct + '%';
    }
  });

  vpVideo.addEventListener('ended', () => {
    vpPlayIcon.className = 'fas fa-play';
    vpBar.style.width = '0%';
  });

  // If video cannot load (placeholder scenario)
  vpVideo.addEventListener('error', () => {
    vpPlaceholder.style.display = 'flex';
  });


  /* ──────────────────────────────
     7. SMOOTH ANCHOR SCROLLING
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────
     8. HERO PARALLAX SUBTLE
  ────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg-grid');
  window.addEventListener('scroll', () => {
    if (heroBg) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });


  /* ──────────────────────────────
     9. COUNTER ANIMATION for hero stats
  ────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');
  let counted = false;

  function animateCounters() {
    if (counted) return;
    counted = true;
    statNums.forEach(el => {
      const target = parseInt(el.textContent);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      let start = 0;
      const duration = 1800;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  const statsObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) animateCounters();
    },
    { threshold: 0.5 }
  );
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObs.observe(statsSection);

  // Initial calls
  handleScrollSpy();
  handleBackToTop();

}); // end DOMContentLoaded
