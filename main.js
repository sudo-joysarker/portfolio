// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('done');
  }, 1200);
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
}
animFollower();

document.querySelectorAll('a, button, .service-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    follower.style.transform = 'translate(-50%,-50%) scale(0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ===== TYPED.JS =====
new Typed('.typed-text', {
  strings: ['Web Developer', 'Frontend Developer', 'UI/UX Designer', 'App Developer', 'Problem Solver'],
  typeSpeed: 80, backSpeed: 50, backDelay: 1500, loop: true, showCursor: false
});

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// ===== HAMBURGER =====
const menuBtn = document.getElementById('menuBtn');
const navbar  = document.getElementById('navbar');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  navbar.classList.toggle('open');
});
navbar.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    navbar.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
    menuBtn.classList.remove('open');
    navbar.classList.remove('open');
  }
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  const scrollY = window.scrollY;
  sections.forEach(sec => {
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector('.nav-link[href="#' + sec.id + '"]');
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

// ===== ABOUT IMAGE — auto try .jpg then .jpeg =====
const aboutImg = document.getElementById('aboutImg');
if (aboutImg) {
  aboutImg.onerror = function() {
    if (this.src.indexOf('.jpeg') === -1) {
      this.src = 'humancartoon.jpeg';
    } else {
      this.style.display = 'none';
    }
  };
}

// ===== SKILL BARS + CIRCLES =====
let skillsAnimated = false;
const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !skillsAnimated) {
    skillsAnimated = true;

    document.querySelectorAll('.skill-item').forEach(item => {
      const val  = parseInt(item.dataset.value);
      const fill = item.querySelector('.skill-fill');
      const pct  = item.querySelector('.skill-pct');
      fill.style.width = val + '%';
      let cur = 0;
      const t = setInterval(() => {
        cur++;
        pct.textContent = cur + '%';
        if (cur >= val) clearInterval(t);
      }, 1200 / val);
    });

    document.querySelectorAll('.circle-skill').forEach(c => {
      const val  = parseInt(c.dataset.value);
      const prog = c.querySelector('.circle-prog');
      const pct  = c.querySelector('.circle-pct');
      const circumference = 2 * Math.PI * 42;
      let cur = 0;
      const t = setInterval(() => {
        cur++;
        const dashArr = (cur / 100) * circumference;
        prog.style.strokeDasharray = dashArr + ' ' + circumference;
        pct.textContent = cur + '%';
        if (cur >= val) clearInterval(t);
      }, 1200 / val);
    });
  }
}, { threshold: 0.3 });

if (skillsSection) skillObserver.observe(skillsSection);

// ===== TIMELINE REVEAL =====
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-card').forEach(c => timelineObserver.observe(c));

// ===== CONTACT FORM =====
const form  = document.getElementById('contactForm');
const toast = document.getElementById('formToast');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        toast.className = 'form-toast success';
        toast.textContent = 'Message sent! I will get back to you soon.';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      toast.className = 'form-toast error';
      toast.textContent = 'Something went wrong. Please try again.';
    }

    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => { toast.className = 'form-toast'; toast.textContent = ''; }, 5000);
  });
}

// ===== BACK TO TOP =====
document.getElementById('backTop')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== PROJECTS MODAL =====
const projectsBtn = document.getElementById('projectsBtn');
const projectsModal = document.getElementById('projectsModal');
const modalClose = document.getElementById('modalClose');

if (projectsBtn) {
  projectsBtn.addEventListener('click', () => {
    projectsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (modalClose) {
  modalClose.addEventListener('click', () => {
    projectsModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}
if (projectsModal) {
  projectsModal.addEventListener('click', e => {
    if (e.target === projectsModal) {
      projectsModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
