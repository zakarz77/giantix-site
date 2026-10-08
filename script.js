const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", isOpen);
};

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header") && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
  }
});

const header = document.querySelector(".site-header");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const navLinks = [...navigation.querySelectorAll(".nav-link")];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visibleSection) return;

    navLinks.forEach((link) => {
      const isActive = link.hash === `#${visibleSection.target.id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const revealTargets = document.querySelectorAll(
  ".section-intro, .service-card, .project-card, .about-description, .process-card, .careers-inner"
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => revealObserver.observe(target));
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
