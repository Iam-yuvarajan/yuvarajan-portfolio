import "../styles/main.css";
import { initTheme } from "./theme";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface SiteConfig {
  github: string;
  linkedin: string;
  instagram: string;
  email: string;
  phone: string;
  terminal: string;
  resume: string;
  passwordProject: string;
  pythonCertificate: string;
}

interface Skill {
  icon: string;
  title: string;
  description: string;
}

interface Project {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  linkText: string;
  external: boolean;
}

interface TypingAnimationConfig {
  words: string[];
  typeSpeed: number;
  deleteSpeed: number;
  typingPause: number;
  deletingPause: number;
}

// ============================================================
// SITE CONFIGURATION
// ============================================================

export const siteConfig: SiteConfig = {
  github: "https://github.com/Wolf-assualt",
  linkedin: "https://www.linkedin.com/in/yuvarajan-j-52a46a273/",
  instagram: "https://www.instagram.com/_yuva._.rajan__/?__pwa=1#",
  email: "yuva0051@gmail.com",
  phone: "+91 9342038458",
  terminal: "https://leetcode.com/u/OrqZrMg9nt/",
  resume: "/resume/Yuvarajan_Resume.pdf",
  passwordProject: "https://github.com/Wolf-assualt/password-generator",
  pythonCertificate: "/assets/YUVARAJAN-J-Participant-Certificate.pdf"
};

// ============================================================
// DATA
// ============================================================

const skills: Skill[] = [
  { icon: "fa-solid fa-network-wired", title: "Networking", description: "Network Configuration and Management" },
  { icon: "fa-solid fa-cloud", title: "Cloud Computing", description: "Cloud Platforms and Services" },
  { icon: "fa-solid fa-robot", title: "Artificial Intelligence", description: "Machine Learning and Neural Networks" },
  { icon: "fa-brands fa-html5", title: "HTML", description: "Web Structure" },
  { icon: "fa-solid fa-desktop", title: "Operating Systems", description: "System Administration" },
  { icon: "fa-solid fa-database", title: "Databases", description: "Database Management" },
  { icon: "fa-solid fa-shield-alt", title: "Cybersecurity", description: "Network Security and Protection" },
  { icon: "fa-solid fa-puzzle-piece", title: "Problem Solving", description: "Logical Reasoning and Debugging" },
  { icon: "fa-solid fa-laptop-code", title: "Software Development", description: "Programming and Debugging" },
  { icon: "fa-solid fa-js", title: "JavaScript", description: "Programming" },
  { icon: "fa-brands fa-css3-alt", title: "CSS", description: "Web Design" },
  { icon: "fa-brands fa-python", title: "Python", description: "Programming" },
  { icon: "fa-brands fa-git-alt", title: "Git", description: "Version Control" },
  { icon: "fa-brands fa-github", title: "GitHub", description: "Repositories" },
  { icon: "fa-brands fa-linux", title: "Linux", description: "Command Line" }
];

const projects: Project[] = [
  {
    icon: "fa-solid fa-lock",
    title: "Password Generator",
    description: "A simple password generator built using Python, HTML and CSS with customizable password options.",
    tags: ["Python", "HTML", "CSS"],
    link: "https://github.com/Wolf-assualt/password-generator",
    linkText: "View Project",
    external: true
  },
  {
    icon: "fa-solid fa-robot",
    title: "YUVA AI",
    description: "A personal AI assistant built from scratch with a unique twist — password-based relationship modes let the creator unlock different interaction styles with the assistant. The assistant can perform various tasks like answering questions, providing information, and engaging in conversations.",
    tags: ["HTML", "JavaScript", "CSS", "VS Code"],
    link: "https://yuva-ai.onrender.com/",
    linkText: "View Project",
    external: true
  },
  {
    icon: "fa-solid fa-code",
    title: "Personal Portfolio",
    description: "A responsive personal portfolio website designed to showcase my skills, projects and professional profile.",
    tags: ["HTML", "CSS", "Responsive"],
    link: "index.html",
    linkText: "Live Website",
    external: false
  }
];

// ============================================================
// DOM HELPERS
// ============================================================

function setLink(id: string, url: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (!url || url.startsWith("YOUR_")) {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Add this link in script.js → siteConfig.");
    });
    return;
  }
  if (el instanceof HTMLAnchorElement) {
    el.href = url;
  }
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

function renderSkills(): void {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;

  grid.innerHTML = skills.map((skill, index) => `
    <div class="skill-card" style="animation-delay: ${index * 30}ms">
      <i class="${skill.icon}"></i>
      <h3>${skill.title}</h3>
      <p>${skill.description}</p>
    </div>
  `).join("");
}

function getAllTags(): string[] {
  const allTags = projects.flatMap(p => p.tags);
  return [...new Set(allTags)].sort();
}

function renderProjects(filterTag: string = "all"): void {
  const grid = document.getElementById("projectsGrid");
  const filterContainer = document.getElementById("projectFilters");
  if (!grid) return;

  const filtered = filterTag === "all"
    ? projects
    : projects.filter(p => p.tags.includes(filterTag));

  grid.innerHTML = filtered.map((project, index) => `
    <article class="project-card" style="animation-delay: ${index * 50}ms">
      <div class="project-icon">
        <i class="${project.icon}"></i>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tags">
        ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>
      <a href="${project.link}" target="${project.external ? '_blank' : '_self'}" rel="${project.external ? 'noopener noreferrer' : ''}" class="project-link">
        ${project.linkText}
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    </article>
  `).join("");

  // Render filter buttons
  if (filterContainer) {
    const tags = ["all", ...getAllTags()];
    filterContainer.innerHTML = tags.map(tag => `
      <button class="filter-btn ${tag === filterTag ? "active" : ""}" data-filter="${tag}">
        ${tag === "all" ? "All" : tag}
      </button>
    `).join("");

    filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        renderProjects(filter);
      });
    });
  }
}

// ============================================================
// TYPING ANIMATION
// ============================================================

function initTypingAnimation(config: TypingAnimationConfig = defaultTypingConfig): void {
  const typingText = document.getElementById("typingText");
  if (!typingText) {
    console.error("❌ Typing animation: #typingText element not found.");
    return;
  }

  const { words, typeSpeed, deleteSpeed, typingPause, deletingPause } = config;
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop(): void {
    const currentWord = words[wordIndex];

    if (!deleting) {
      charIndex++;
      typingText!.textContent = currentWord.substring(0, charIndex);

      if (charIndex >= currentWord.length) {
        deleting = true;
        setTimeout(typeLoop, typingPause);
        return;
      }
      setTimeout(typeLoop, typeSpeed);
      return;
    }

    charIndex--;
    typingText!.textContent = currentWord.substring(0, charIndex);

    if (charIndex <= 0) {
      charIndex = 0;
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeLoop, deletingPause);
      return;
    }
    setTimeout(typeLoop, deleteSpeed);
  }

  typingText!.textContent = "";
  setTimeout(typeLoop, 500);
  console.log("✅ Typing animation started.");
}

const defaultTypingConfig: TypingAnimationConfig = {
  words: ["Web Experiences", "AI Applications", "Developer Tools", "Practical Solutions"],
  typeSpeed: 90,
  deleteSpeed: 50,
  typingPause: 1800,
  deletingPause: 500
};

// ============================================================
// GITHUB CONTRIBUTIONS COUNTER
// ============================================================

interface GitHubContributionData {
  total?: Record<string, number>;
  [key: string]: unknown;
}

async function loadGithubContributions(username: string = "Wolf-assualt"): Promise<void> {
  const counter = document.getElementById("githubContributionCount");
  const githubSection = document.getElementById("github-contributions");

  if (!counter || !githubSection) return;

  let animationStarted = false;

  function animateGithubCounter(target: number): void {
    if (animationStarted) return;
    animationStarted = true;

    const duration = 2200;
    const startTime = performance.now();

    function updateCounter(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);

      counter!.textContent = current.toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter!.textContent = target.toLocaleString("en-IN");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  try {
    console.log("Loading GitHub contributions...");
    const apiURL = `https://github-contributions-api.jogruber.de/v4/${username}?y=all`;
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubContributionData = await response.json();
    console.log("GitHub contribution data:", data);

    let total = 0;
    if (data.total && typeof data.total === "object") {
      Object.values(data.total).forEach(value => {
        const number = Number(value);
        if (Number.isFinite(number)) total += number;
      });
    }

    console.log("Total GitHub contributions:", total);

    if (total > 0) {
      animateGithubCounter(total);
    } else {
      console.warn("GitHub contribution total is 0.");
      counter!.textContent = "0";
    }
  } catch (error) {
    console.error("GitHub contribution error:", error);
    counter!.textContent = "—";
  }
}

function initGithubCounter(): void {
  const githubSection = document.getElementById("github-contributions");
  if (!githubSection) return;

  if ("IntersectionObserver" in window) {
    const githubObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadGithubContributions();
            githubObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    githubObserver.observe(githubSection);
  } else {
    loadGithubContributions();
  }
}

// ============================================================
// SCROLL REVEAL
// ============================================================

function initScrollReveal(): void {
  const revealElements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(el => observer.observe(el));
}

// ============================================================
// CURSOR GLOW
// ============================================================

function initCursorGlow(): void {
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow(): void {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    (glow as HTMLElement).style.left = glowX + "px";
    (glow as HTMLElement).style.top = glowY + "px";
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Show glow on first mouse move
  window.addEventListener("pointermove", () => {
    glow.classList.add("active");
  }, { once: true });
}

// ============================================================
// ACTIVE NAVIGATION
// ============================================================

function initActiveNavigation(): void {
  // Smooth scroll for anchor links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (this: HTMLAnchorElement, e: MouseEvent) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", href);
      }
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav nav a");

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(link => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );
    sections.forEach(s => observer.observe(s));
  }
}

// ============================================================
// MOUSE POSITION CSS VARIABLES
// ============================================================

function initMousePosition(): void {
  document.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
    document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");
  });
}

// ============================================================
// CONTACT FORM
// ============================================================

function initContactForm(): void {
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call (replace with real Formspree/EmailJS endpoint)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo: show success message
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
    submitBtn.style.background = "#22c55e";

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = "";
      form.reset();
    }, 3000);
  });
}

// ============================================================
// NAME PRONUNCIATION
// ============================================================

function initNamePronunciation(): void {
  const btn = document.getElementById("pronounceBtn") as HTMLButtonElement | null;
  if (!btn) return;

  // Check if SpeechSynthesis is supported
  if (!("speechSynthesis" in window)) {
    btn.style.display = "none";
    return;
  }

  // Pronunciation: "Yoo-vuh-ra-jan" (Yuvarajan) + "Jay" (J)
  const utterance = new SpeechSynthesisUtterance("Yuvarajan");
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to use a more natural voice if available
  const setVoice = () => {
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Natural")
    );
    if (preferred) utterance.voice = preferred;
  };
  setVoice();
  speechSynthesis.onvoiceschanged = setVoice;

  let isSpeaking = false;

  btn.addEventListener("click", () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      return;
    }

    isSpeaking = true;
    btn.classList.add("speaking");
    btn.innerHTML = '<i class="fa-solid fa-waveform"></i>';

    utterance.onend = () => {
      isSpeaking = false;
      btn.classList.remove("speaking");
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    };
    utterance.onerror = () => {
      isSpeaking = false;
      btn.classList.remove("speaking");
      btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    };

    speechSynthesis.speak(utterance);
  });

  // Stop speaking if user navigates away
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isSpeaking) {
      speechSynthesis.cancel();
    }
  });
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Set all links from config
  ["githubLink", "githubLink2"].forEach(id => setLink(id, siteConfig.github));
  ["linkedinLink", "linkedinLink2"].forEach(id => setLink(id, siteConfig.linkedin));
  ["instagramLink", "instagramLink2"].forEach(id => setLink(id, siteConfig.instagram));
  ["terminalLink", "terminalLink2"].forEach(id => setLink(id, siteConfig.terminal));
  setLink("passwordProjectLink", siteConfig.passwordProject);
  setLink("resumeLink", siteConfig.resume);
  setLink("pythonCertificateLink", siteConfig.pythonCertificate);

  // Email
  const emailLink = document.getElementById("emailLink");
  if (emailLink instanceof HTMLAnchorElement) {
    emailLink.href = "mailto:" + siteConfig.email;
  }

  // Contact email text
  const emailText = document.getElementById("contactEmailText");
  if (emailText) {
    emailText.textContent = siteConfig.email;
    if (emailText instanceof HTMLAnchorElement) {
      emailText.href = "mailto:" + siteConfig.email;
    }
  }

  // Phone
  const phoneLink = document.getElementById("phoneLink");
  if (phoneLink) {
    phoneLink.textContent = siteConfig.phone;
    if (phoneLink instanceof HTMLAnchorElement) {
      phoneLink.href = "tel:" + siteConfig.phone.replace(/\s/g, "");
    }
  }

  // Render dynamic content
  renderSkills();
  renderProjects();

  // Initialize features
  initTheme();
  initTypingAnimation();
  initGithubCounter();
  initScrollReveal();
  initCursorGlow();
  initActiveNavigation();
  initMousePosition();
  initContactForm();
  initNamePronunciation();
  // initParticles(); // Uncomment to enable particle background

  console.log("✅ Portfolio JavaScript loaded successfully.");
  console.log("Typing element:", document.getElementById("typingText"));
});