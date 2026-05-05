import { getSavedTheme, saveTheme } from "../utils/storage.js";

const THEMES = ["light", "dark", "sepia"];

export function initTheme() {
  const saved = getSavedTheme();
  applyTheme(saved);
  buildThemeSwitcher(saved);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  // Update active pills
  document.querySelectorAll(".theme-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.theme === theme);
  });
}

function buildThemeSwitcher(current) {
  const nav = document.querySelector(".header__nav");

  const oldBtn = document.getElementById("themeToggleBtn");
  if (oldBtn) oldBtn.remove();

  const switcher = document.createElement("div");
  switcher.className = "theme-switcher";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Colour theme");

  THEMES.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = `theme-pill${t === current ? " active" : ""}`;
    btn.dataset.theme = t;
    btn.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    btn.setAttribute("aria-pressed", String(t === current));
    btn.addEventListener("click", () => {
      applyTheme(t);
      saveTheme(t);
      switcher.querySelectorAll(".theme-pill").forEach((p) => {
        p.setAttribute("aria-pressed", String(p.dataset.theme === t));
      });
    });
    switcher.appendChild(btn);
  });

  nav.appendChild(switcher);
}
