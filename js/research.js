import { education, research } from "./data.js";
import { renderHeader, renderFooter, setupReveal } from "./shared.js";

function renderPublications() {
  const html = research.map(item => {
    const badge = item.award ? `<span class="badge">${item.award}</span>` : "";
    return `
      <a class="research-card reveal" href="${item.link}" target="_blank" rel="noopener">
        <h3>${item.title}</h3>
        <p class="authors">${item.authors}</p>
        <p class="venue">${item.venue}</p>
        ${badge}
      </a>
    `;
  }).join("");
  document.getElementById("publications").innerHTML = `<p class="eyebrow">Peer reviewed</p><h2>Publications</h2>${html}`;
}

function renderEducation() {
  const html = education.map(edu => `
    <div class="entry reveal">
      <div class="entry-head">
        <h3 class="entry-org">${edu.school}</h3>
        <span class="entry-place">${edu.location}</span>
      </div>
      <div class="role-head">
        <span class="role-title">${edu.degree}</span>
        <span class="role-date">${edu.duration}</span>
      </div>
      <ul class="points">${edu.points.map(point => `<li>${point}</li>`).join("")}</ul>
    </div>
  `).join("");
  document.getElementById("education").innerHTML = `<p class="eyebrow">Where I studied</p><h2>Education</h2>${html}`;
}

renderHeader("research");
renderPublications();
renderEducation();
renderFooter();
setupReveal();
