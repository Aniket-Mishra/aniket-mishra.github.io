import { experience, skills } from "./data.js";
import { renderHeader, renderFooter, setupReveal, highlightStats } from "./shared.js";

function renderExperience() {
  const html = experience.map(company => {
    const roles = company.roles.map(role => `
      <div class="role">
        <div class="role-head">
          <span class="role-title">${role.title}</span>
          <span class="role-date">${role.duration}</span>
        </div>
        <ul class="points">${role.points.map(point => `<li>${highlightStats(point)}</li>`).join("")}</ul>
      </div>
    `).join("");
    return `
      <div class="entry reveal">
        <div class="entry-head">
          <h3 class="entry-org">${company.company}</h3>
          <span class="entry-place">${company.location}</span>
        </div>
        ${roles}
      </div>
    `;
  }).join("");
  document.getElementById("experience").innerHTML = `<p class="eyebrow">Where I have worked</p><h2>Industry</h2>${html}`;
}

function renderSkills() {
  const html = skills.map(block => `
    <div class="skill-block reveal">
      <h3>${block.title}</h3>
      <div class="skill-list">${block.items.map(item => `<span>${item}</span>`).join("")}</div>
    </div>
  `).join("");
  document.getElementById("skills").innerHTML = `<p class="eyebrow">Toolbox</p><h2>What I work with</h2>${html}`;
}

renderHeader("experience");
renderExperience();
renderSkills();
renderFooter();
setupReveal();
