/* ========================================================
   PROFESSIONAL PORTFOLIO — Small, dependency-free script.
   Mobile navigation, sticky header, active links, footer year.
   No OS windows / drag events / touch click replacements.
   ======================================================== */
(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  const isHome = document.body.classList.contains("home-page");

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    header?.classList.remove("menu-active");
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const opening = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", opening);
      header?.classList.toggle("menu-active", opening);
      document.body.classList.toggle("nav-open", opening);
    });

    // Clicking a page link closes the drawer, including on iOS Safari.
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (toggle.getAttribute("aria-expanded") === "true") {
          closeMenu();
          toggle.focus();
        }
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    }, { passive: true });
  }

  // Transparent over the hero; opaque when content scrolls behind the header.
  function updateHeader() {
    header?.classList.toggle("is-scrolled", !isHome || window.scrollY > 36);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Highlight the section currently in view, if IntersectionObserver is supported.
  if (isHome && "IntersectionObserver" in window) {
    const links = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
    const sections = links.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    if (sections.length) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(item => item.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach(link => {
          if (link.getAttribute("href") === `#${visible.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }, { rootMargin: "-25% 0px -50% 0px", threshold: [0, .2, .4] });
      sections.forEach(section => observer.observe(section));
    }
  }

  document.querySelectorAll("[data-current-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();
