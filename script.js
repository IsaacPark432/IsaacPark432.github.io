// ---------- Typing effect for hero subtitle rotation ----------
const phrases = [
  "QA & test automation",
  "hardware test systems",
  "python tooling",
  "AI agent orchestration",
  "self-hosted infrastructure"
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function tick() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    cIdx++;
    typedEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }
  } else {
    cIdx--;
    typedEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(tick, deleting ? 40 : 70);
}
tick();

// ---------- Tab switcher (Projects / Experience / About) ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ---------- Scroll-reveal animations ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Live GitHub stats widget ----------
async function loadGithubStats() {
  const user = 'IsaacPark432';
  try {
    const userRes = await fetch(`https://api.github.com/users/${user}`);
    const userData = await userRes.json();
    document.getElementById('gh-repos').textContent = userData.public_repos ?? '–';
    document.getElementById('gh-followers').textContent = userData.followers ?? '–';

    const reposRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
    const repos = await reposRes.json();
    if (Array.isArray(repos)) {
      const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      document.getElementById('gh-stars').textContent = stars;

      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0];
      document.getElementById('gh-lang').textContent = topLang ? topLang[0] : '–';
    }
  } catch (e) {
    document.getElementById('gh-stats').innerHTML = '<div class="gh-stat gh-error">GitHub stats unavailable</div>';
  }
}
loadGithubStats();

// ---------- Animated network-particle background ----------
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 140;
  const emberColor = '255, 107, 53';

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = `rgba(${emberColor}, ${0.12 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.fillStyle = `rgba(${emberColor}, 0.5)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(step);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  initParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  if (!prefersReducedMotion) requestAnimationFrame(step);
})();

// ---------- Mini interactive terminal ----------
const term = document.getElementById('term-output');
const input = document.getElementById('term-input');

const commands = {
  help: () => "Commands: about, experience, projects, skills, contact, whoami, resume, clear",
  whoami: () => "isaac@homelab:~$ QA/test engineer, builder of test rigs and automation tooling",
  about: () => { document.querySelector('[data-tab="about"]').click(); return "Switched to About tab."; },
  experience: () => { document.querySelector('[data-tab="experience"]').click(); return "Switched to Experience tab."; },
  projects: () => { document.querySelector('[data-tab="projects"]').click(); return "Switched to Projects tab."; },
  skills: () => "Python, C++, C, C#, Pytest, hardware bring-up, thermal testing, data analysis, soldering",
  contact: () => "Reach me via GitHub: github.com/IsaacPark432 or LinkedIn: linkedin.com/in/isaac-parker111",
  linkedin: () => { window.open('https://www.linkedin.com/in/isaac-parker111/', '_blank'); return "Opening LinkedIn..."; },
  resume: () => { window.open('resume.pdf', '_blank'); return "Opening resume.pdf..."; },
  clear: () => { term.innerHTML = ""; return null; }
};

function printLine(text) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.textContent = text;
  term.appendChild(line);
  term.scrollTop = term.scrollHeight;
}

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = input.value.trim();
  input.value = "";
  if (!raw) return;
  printLine('> ' + raw);
  const cmd = raw.toLowerCase();
  const handler = commands[cmd];
  if (handler) {
    const out = handler();
    if (out) printLine(out);
  } else {
    printLine(`command not found: ${raw} (try 'help')`);
  }
});
