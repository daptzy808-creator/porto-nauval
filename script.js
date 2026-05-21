/* ============================================================
   Personal Branding Website - script.js
   Particles | Navbar | Typewriter | Scroll Reveal | Skills
   Chart | Smooth Scroll | Contact Form
   ============================================================ */

/* ============================================================
   1. PARTICLE ANIMATION
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  // Resize handler
  window.addEventListener("resize", () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 80;
  const MAX_DIST = 140;
  const particles = [];

  // Particle colors - gold palette
  const colors = ["rgba(201,168,76,", "rgba(232,201,122,", "rgba(154,122,46,", "rgba(245,220,150,"];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = Math.random() * 0.4 + 0.1;
      this.r  = Math.random() * 2 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10) this.reset(false);
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ")";
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ============================================================
   2. NAVBAR SCROLL EFFECT & ACTIVE LINK
   ============================================================ */
(function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  if (!navbar) return;

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link based on scroll position
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   3. HAMBURGER MENU TOGGLE
   ============================================================ */
(function initHamburger() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks  = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

/* ============================================================
   4. TYPEWRITER EFFECT
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const phrases = [
    "Interested in Design",
    "Web Designer",
    "Gamer",
    "Creative Thinker"
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let pauseTimer  = null;

  const TYPING_SPEED   = 90;   // ms per char when typing
  const DELETING_SPEED = 50;   // ms per char when deleting
  const PAUSE_AFTER    = 1800; // ms pause after full phrase

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing - pause then delete
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting - move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(type, delay);
  }

  type();
})();

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll("[data-aos]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute("data-aos-delay") || "0");
          setTimeout(() => {
            entry.target.classList.add("aos-animate");
            // Hapus transform inline setelah animasi selesai agar tidak konflik
            setTimeout(() => {
              entry.target.style.transform = "";
              entry.target.style.opacity  = "";
            }, 700 + delay);
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. SKILL BAR ANIMATION
   ============================================================ */
(function initSkillBars() {
  const skillsSection = document.querySelector(".skills");
  if (!skillsSection) return;

  let animated = false;

  function animateBars() {
    if (animated) return;
    animated = true;

    // Animate fill bars
    document.querySelectorAll(".skill-fill").forEach(bar => {
      const target = bar.getAttribute("data-width") || "0";
      setTimeout(() => {
        bar.style.width = target + "%";
      }, 200);
    });

    // Animate percentage counters
    document.querySelectorAll(".skill-percent").forEach(el => {
      const target = parseInt(el.getAttribute("data-target") || el.textContent);
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + "%";
      }, 20);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBars();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillsSection);
})();

/* ============================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.querySelector(".navbar")?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* ============================================================
   8. CONTACT FORM SUBMIT HANDLER
   ============================================================ */
(function initContactForm() {
  const form = document.querySelector(".contact-form form") ||
               document.getElementById("contact-form");
  if (!form) return;

  // Create inline success message element
  const successMsg = document.createElement("div");
  successMsg.className = "form-success";
  successMsg.style.cssText = [
    "display:none",
    "margin-top:1rem",
    "padding:1rem 1.25rem",
    "background:rgba(34,197,94,0.1)",
    "border:1px solid rgba(34,197,94,0.3)",
    "border-radius:12px",
    "color:#22c55e",
    "font-size:0.9rem",
    "font-weight:500",
    "text-align:center"
  ].join(";");
  successMsg.textContent = "Message sent! I will get back to you soon.";
  form.appendChild(successMsg);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = "rgba(239,68,68,0.6)";
        input.style.boxShadow   = "0 0 0 3px rgba(239,68,68,0.1)";
      } else {
        input.style.borderColor = "";
        input.style.boxShadow   = "";
      }
    });

    if (!valid) return;

    // Simulate sending (replace with real fetch/API call)
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    setTimeout(() => {
      form.reset();
      successMsg.style.display = "block";
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
      // Hide success message after 5 seconds
      setTimeout(() => { successMsg.style.display = "none"; }, 5000);
    }, 1200);
  });

  // Remove error styling on input
  form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", function () {
      this.style.borderColor = "";
      this.style.boxShadow   = "";
    });
  });
})();

/* ============================================================
   9. SKILLS CHART (Canvas Bar Chart)
   ============================================================ */
(function initSkillsChart() {
  const canvas = document.getElementById("skillsChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Chart data
  const skills = [
    { label: "HTML",    value: 45, color: "#c9a84c" },
    { label: "CSS",     value: 30, color: "#e8c97a" },
    { label: "JS",      value: 20, color: "#9a7a2e" },
    { label: "Cisco",   value: 50, color: "#d4b060" },
    { label: "Canva",   value: 80, color: "#f0d080" }
  ];

  const DPR    = window.devicePixelRatio || 1;
  const W_CSS  = canvas.parentElement ? canvas.parentElement.clientWidth - 64 : 320;
  const H_CSS  = 220;

  canvas.width  = W_CSS * DPR;
  canvas.height = H_CSS * DPR;
  canvas.style.width  = W_CSS + "px";
  canvas.style.height = H_CSS + "px";
  ctx.scale(DPR, DPR);

  const PAD_LEFT   = 48;
  const PAD_RIGHT  = 16;
  const PAD_TOP    = 16;
  const PAD_BOTTOM = 36;
  const chartW = W_CSS - PAD_LEFT - PAD_RIGHT;
  const chartH = H_CSS - PAD_TOP  - PAD_BOTTOM;

  let animProgress = 0;
  let rafId;

  function drawChart(progress) {
    ctx.clearRect(0, 0, W_CSS, H_CSS);

    const barCount  = skills.length;
    const barWidth  = (chartW / barCount) * 0.55;
    const barGap    = chartW / barCount;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth   = 1;
    [0, 25, 50, 75, 100].forEach(pct => {
      const y = PAD_TOP + chartH - (pct / 100) * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(PAD_LEFT + chartW, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = "rgba(148,163,184,0.7)";
      ctx.font = "10px Poppins, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(pct + "%", PAD_LEFT - 6, y + 4);
    });

    // Draw bars
    skills.forEach((skill, i) => {
      const x       = PAD_LEFT + i * barGap + (barGap - barWidth) / 2;
      const maxH    = chartH;
      const barH    = (skill.value / 100) * maxH * progress;
      const y       = PAD_TOP + chartH - barH;

      // Gradient fill
      const grad = ctx.createLinearGradient(x, y, x, PAD_TOP + chartH);
      grad.addColorStop(0, skill.color);
      grad.addColorStop(1, "rgba(201,168,76,0.2)");

      // Bar with rounded top
      ctx.beginPath();
      const radius = 4;
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, PAD_TOP + chartH);
      ctx.lineTo(x, PAD_TOP + chartH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Glow effect
      ctx.shadowColor  = skill.color;
      ctx.shadowBlur   = 8;
      ctx.fill();
      ctx.shadowBlur   = 0;

      // Value label on top of bar
      if (progress > 0.8) {
        ctx.fillStyle  = "#ffffff";
        ctx.font       = "bold 10px Poppins, sans-serif";
        ctx.textAlign  = "center";
        ctx.fillText(skill.value + "%", x + barWidth / 2, y - 6);
      }

      // X-axis label
      ctx.fillStyle  = "rgba(148,163,184,0.9)";
      ctx.font       = "11px Poppins, sans-serif";
      ctx.textAlign  = "center";
      ctx.fillText(skill.label, x + barWidth / 2, PAD_TOP + chartH + 18);
    });
  }

  function animate() {
    animProgress += 0.025;
    if (animProgress > 1) animProgress = 1;
    drawChart(animProgress);
    if (animProgress < 1) {
      rafId = requestAnimationFrame(animate);
    }
  }

  // Only animate when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animProgress = 0;
          cancelAnimationFrame(rafId);
          animate();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(canvas);

  // Redraw on resize
  window.addEventListener("resize", () => {
    const newW = canvas.parentElement ? canvas.parentElement.clientWidth - 64 : 320;
    canvas.width  = newW * DPR;
    canvas.height = H_CSS * DPR;
    canvas.style.width  = newW + "px";
    canvas.style.height = H_CSS + "px";
    ctx.scale(DPR, DPR);
    drawChart(1);
  });
})();

/* ============================================================
   10. FLOATING BADGES SUBTLE JS ANIMATION (optional boost)
   ============================================================ */
(function initFloatingBadges() {
  const badges = document.querySelectorAll(".floating-badge");
  if (!badges.length) return;

  // CSS handles the main float animation.
  // This adds a subtle parallax on mouse move for desktop.
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;

    badges.forEach((badge, i) => {
      const factor = (i + 1) * 4;
      badge.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });

  hero.addEventListener("mouseleave", () => {
    badges.forEach(badge => {
      badge.style.transform = "";
    });
  });
})();

/* ============================================================
   INIT - Run after DOM is ready
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Personal branding site initialized.");
});
