const STORAGE_KEY = "preferred-theme";

function resolveStartingTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function flipTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

export function setupTheme() {
  applyTheme(resolveStartingTheme());
  const button = document.querySelector(".theme-toggle");
  if (button) button.addEventListener("click", flipTheme);
}
