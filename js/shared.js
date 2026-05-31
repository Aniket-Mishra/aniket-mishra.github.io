import { profile, radarBlips } from "./data.js";

const githubIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A12 12 0 0 0 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12.6 12 12 0 0 0 12 .5Z"/></svg>`;
const linkedinIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33 0-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z"/></svg>`;
const emailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>`;
const catIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 5l3.5 2.5a8 8 0 0 1 13 0L22 5v9a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8V5Zm7 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 1.2-1.2 1.2a1.7 1.7 0 0 0 2.4 0L12 15.2Z"/></svg>`;
const linkedinBrand = `<svg viewBox="0 0 382 382" aria-hidden="true"><path fill="#0077B7" d="M347.445 0H34.555C15.471 0 0 15.471 0 34.555v312.889C0 366.529 15.471 382 34.555 382h312.889C366.529 382 382 366.529 382 347.444V34.555C382 15.471 366.529 0 347.445 0zM118.207 329.844c0 5.554-4.502 10.056-10.056 10.056H65.345c-5.554 0-10.056-4.502-10.056-10.056V150.403c0-5.554 4.502-10.056 10.056-10.056h42.806c5.554 0 10.056 4.502 10.056 10.056v179.441zM86.748 123.432c-22.459 0-40.666-18.207-40.666-40.666S64.289 42.1 86.748 42.1s40.666 18.207 40.666 40.666-18.207 40.666-40.666 40.666zM341.91 330.654c0 5.106-4.14 9.246-9.246 9.246H286.73c-5.106 0-9.246-4.14-9.246-9.246v-84.168c0-12.556 3.683-55.021-32.813-55.021-28.309 0-34.051 29.066-35.204 42.11v97.079c0 5.106-4.139 9.246-9.246 9.246h-44.426c-5.106 0-9.246-4.14-9.246-9.246V149.593c0-5.106 4.14-9.246 9.246-9.246h44.426c5.106 0 9.246 4.14 9.246 9.246v15.655c10.497-15.753 26.097-27.912 59.312-27.912 73.552 0 73.131 68.716 73.131 106.472v110.844z"/></svg>`;
const moonIcon = `<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`;
const sunIcon = `<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

export const icons = { github: githubIcon, linkedin: linkedinIcon, email: emailIcon, cat: catIcon, linkedinBrand };

const menuIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`;

export function renderHeader(activePage) {
  const mark = page => (page === activePage ? ' aria-current="page"' : "");
  document.getElementById("topbar").innerHTML = `
    <div class="topbar-inner">
      <a href="/" class="brand"><span class="paw">${catIcon}</span>${profile.name}</a>
      <button class="hamburger" aria-label="Open menu" aria-expanded="false">${menuIcon}</button>
      <nav class="nav">
        <a href="/"${mark("home")}>Home</a>
        <a href="/experience.html"${mark("experience")}>Experience</a>
        <a href="/research.html"${mark("research")}>Research</a>
        <a href="/projects.html"${mark("projects")}>Projects</a>
        <a href="/blog/"${mark("blog")}>Blog</a>
        <button class="theme-toggle" aria-label="Switch light or dark theme">${moonIcon}${sunIcon}</button>
      </nav>
      <div class="nav-scrim"></div>
    </div>
  `;
  setupMenu();
}

function setupMenu() {
  const button = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  const scrim = document.querySelector(".nav-scrim");
  if (!button || !nav) return;

  const close = () => {
    nav.classList.remove("open");
    scrim.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    nav.classList.add("open");
    scrim.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  };

  button.addEventListener("click", () => {
    nav.classList.contains("open") ? close() : open();
  });
  scrim.addEventListener("click", close);
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  nav.querySelector(".theme-toggle").addEventListener("click", close);
}

export function renderFooter() {
  const { socials, name } = profile;
  document.getElementById("footer").innerHTML = `
    <div class="page">
      <div class="icon-row">
        <a href="${socials.github}" target="_blank" rel="noopener" aria-label="GitHub">${githubIcon}</a>
        <a href="${socials.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${linkedinIcon}</a>
        <a href="${socials.email}" aria-label="Email">${emailIcon}</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} ${name}. Built by hand, powered by coffee and curiosity.</p>
      <p class="paw-line">cat tax paid in the corner ${"\u{1F431}"}</p>
    </div>
  `;
}

export function renderRadar(mountId) {
  const blips = radarBlips.map((label, index) => {
    const angle = (360 / radarBlips.length) * index - 90;
    const radius = index % 2 === 0 ? 40 : 30;
    const left = 50 + radius * Math.cos(angle * Math.PI / 180);
    const top = 50 + radius * Math.sin(angle * Math.PI / 180);
    return `<span class="radar-blip" style="left:${left}%;top:${top}%">${label}</span>`;
  }).join("");

  document.getElementById(mountId).innerHTML = `
    <div class="radar">
      <div class="radar-ring r1"></div>
      <div class="radar-ring r2"></div>
      <div class="radar-ring r3"></div>
      <div class="radar-cross"></div>
      <div class="radar-sweep"></div>
      <div class="radar-core">${catIcon}</div>
      ${blips}
    </div>
  `;
}

const statPattern = /(~?>?\d[\d,.]*\+?\s?(?:%|x\b|GW|gigawatts|months?|days?|hours?|minutes?|weeks?)\+?|\d[\d,.]*\+)/gi;

export function highlightStats(text) {
  return text.replace(statPattern, match => `<span class="stat">${match}</span>`);
}

export function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("shown");
    });
  }, { threshold: 0.08 });
  items.forEach(item => observer.observe(item));
}

export function greetTheNerds() {
  const style = "color:#a78bfa;font-family:monospace;font-size:13px";
  console.log("%c/\\_/\\  hello, fellow tinkerer.", style);
  console.log("%c( o.o ) you opened the console. we'd get along.", style);
  console.log("%c > ^ <  poke around: github.com/Aniket-Mishra", style);
}
