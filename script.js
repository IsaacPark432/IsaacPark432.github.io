// Typing effect for hero subtitle rotation
const phrases = [
  "homelab automation",
  "AI agent orchestration",
  "self-hosted infrastructure",
  "python + javascript"
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

// Mini interactive terminal
const term = document.getElementById('term-output');
const input = document.getElementById('term-input');

const commands = {
  help: () => "Commands: about, projects, contact, whoami, clear",
  whoami: () => "isaac@asmodeus:~$ builder of homelabs and AI agents",
  about: () => "Self-taught systems tinkerer. Runs a homelab (asmodeus), automates it with an AI agent, plays too much Deadlock.",
  projects: () => "See the Projects section above, or type: linkedin, resume",
  contact: () => "Reach me via GitHub: github.com/IsaacPark432 or LinkedIn: linkedin.com/in/isaac-parker111",
  linkedin: () => "linkedin.com/in/isaac-parker111",
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
