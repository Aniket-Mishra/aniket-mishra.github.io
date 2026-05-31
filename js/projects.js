import { projects, projectFilters } from "./data.js";
import { renderHeader, renderFooter, setupReveal } from "./shared.js";

function cardMarkup(project) {
  return `
    <a class="project-card reveal" href="${project.link}" target="_blank" rel="noopener">
      <span class="cat">${project.category}</span>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">${project.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
    </a>
  `;
}

function showProjects(filter) {
  const visible = filter === "All" ? projects : projects.filter(project => project.filter === filter);
  document.getElementById("project-grid").innerHTML = visible.map(cardMarkup).join("");
  setupReveal();
}

function renderFilterBar() {
  const buttons = projectFilters.map((name, index) =>
    `<button class="filter-btn${index === 0 ? " active" : ""}" data-filter="${name}">${name}</button>`
  ).join("");
  document.getElementById("filter-bar").innerHTML = buttons;

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      button.classList.add("active");
      showProjects(button.dataset.filter);
    });
  });
}

renderHeader("projects");
renderFilterBar();
showProjects("All");
renderFooter();
