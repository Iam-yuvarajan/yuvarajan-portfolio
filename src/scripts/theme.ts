// ============================================================
// THEME MANAGEMENT (shared across all pages)
// ============================================================

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);

  document.querySelectorAll<HTMLButtonElement>(".theme-toggle").forEach((toggle) => {
    toggle.innerHTML =
      theme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    toggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
    toggle.setAttribute("aria-pressed", String(theme === "light"));
  });
}

export function initTheme(): void {
  const toggles = document.querySelectorAll<HTMLButtonElement>(".theme-toggle");

  if (toggles.length === 0) return;

  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial: Theme = saved ?? (prefersDark ? "dark" : "light");

  applyTheme(initial);

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") as Theme;
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });

  // Follow system preference only while the user has not chosen manually
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
}
