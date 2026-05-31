import { profile, research, recommendations } from "./data.js";
import { renderHeader, renderFooter, renderRadar, setupReveal, greetTheNerds, icons } from "./shared.js";

function renderHero() {
  const p = profile;
  document.getElementById("hero").innerHTML = `
    <div class="hero-copy">
      <p class="eyebrow">${p.tagline} · ${p.location}</p>
      <h1>Hey, I'm <span class="name">${p.name}</span></h1>
      <p class="pitch">${p.pitch}</p>
      <p>${p.intro}</p>
    </div>
    <div id="radar-mount"></div>
  `;
}

function renderSignal() {
  const p = profile;
  document.getElementById("signal").innerHTML = `
    <div class="availability">
      <span class="status"><span class="dot"></span>${p.availability.status}</span>
      <p>${p.availability.detail}</p>
    </div>
    <div class="actions">
      <a href="${p.resumeUrl}" target="_blank" rel="noopener" class="btn primary">Resume, 1 page</a>
      <a href="${p.cvUrl}" target="_blank" rel="noopener" class="btn">Full CV, 4 pages</a>
      <a href="/experience.html" class="btn">See what I have built</a>
    </div>
    <div class="icon-row">
      <a href="${p.socials.github}" target="_blank" rel="noopener" aria-label="GitHub">${icons.github}</a>
      <a href="${p.socials.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icons.linkedin}</a>
      <a href="${p.socials.email}" aria-label="Email">${icons.email}</a>
    </div>
  `;
}

function renderAbout() {
  const p = profile;
  document.getElementById("about").innerHTML = `
    <p class="eyebrow">Off the resume</p>
    <h2>A bit about me</h2>
    <div class="about-grid">
      <div>
        <p>${p.personality}</p>
      </div>
      <img class="portrait" src="${p.image}" alt="${p.name}" />
    </div>
  `;
}

function renderRecommendations() {
  const cards = recommendations.map((rec, index) => `
    <div class="rec-card reveal">
      <a class="rec-linkedin" href="${rec.link}" target="_blank" rel="noopener" aria-label="${rec.name} on LinkedIn">${icons.linkedinBrand}</a>
      <p class="quote clamped" id="rec-text-${index}">${rec.text}</p>
      <button class="rec-toggle" data-target="rec-text-${index}">Read more</button>
      <div class="rec-who">
        <a href="${rec.link}" target="_blank" rel="noopener">${rec.name}</a>
        <span class="role">${rec.title}</span>
        <span class="relation">${rec.relation}</span>
      </div>
    </div>
  `).join("");
  document.getElementById("recommendations").innerHTML = `
    <p class="eyebrow">In their words</p>
    <h2>What colleagues say</h2>
    <div class="rec-grid">${cards}</div>
  `;

  document.querySelectorAll(".rec-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const quote = document.getElementById(button.dataset.target);
      const expanded = quote.classList.toggle("clamped") === false;
      button.textContent = expanded ? "Read less" : "Read more";
    });
  });
}

function renderResearchTeaser() {
  const latest = research[0];
  document.getElementById("research-teaser").innerHTML = `
    <p class="eyebrow">Research</p>
    <h2>What I'm publishing</h2>
    <a class="research-card" href="${latest.link}" target="_blank" rel="noopener">
      <h3>${latest.title}</h3>
      <p class="authors">${latest.authors}</p>
      <p class="venue">${latest.venue}</p>
    </a>
    <div class="actions">
      <a href="/research.html" class="btn">All publications</a>
      <a href="/blog/" class="btn">Read the blog</a>
    </div>
  `;
}

renderHeader("home");
renderHero();
renderRadar("radar-mount");
renderSignal();
renderAbout();
renderRecommendations();
renderResearchTeaser();
renderFooter();
setupReveal();
greetTheNerds();
