import "../styles/main.css";
import { initTheme } from "./theme";

document.addEventListener("DOMContentLoaded", () => {
  // Theme (shared with the main page)
  initTheme();

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Cursor glow (eased follow)
  const glow = document.querySelector<HTMLElement>(".cursor-glow");
  if (glow) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener("pointermove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.classList.add("active");
    });

    const follow = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      glow.style.left = `${currentX}px`;
      glow.style.top = `${currentY}px`;
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);
  }

  // Mouse position CSS variables
  document.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  });

  console.log("✅ Achievements page loaded.");
});
