/**
 * EagleNest Academy — Main JS
 * Handles: mobile menu toggle, scroll-reveal, stat counters,
 *          accordion, and back-to-top button.
 *
 * Depends on components.js being loaded first (for the markup it injects).
 */

/* ─────────────────────────────────────────────────────────────
   1. MOBILE MENU TOGGLE
   ───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  // The button and drawer are injected by components.js; poll briefly
  // in case this script runs before the DOM injection finishes.
  const btn   = document.getElementById("mobile-menu-btn");
  const menu  = document.getElementById("mobile-menu");
  const iconO = document.getElementById("icon-open");
  const iconC = document.getElementById("icon-close");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("hidden") === false;
    btn.setAttribute("aria-expanded", String(isOpen));
    iconO.classList.toggle("hidden",  isOpen);
    iconC.classList.toggle("hidden", !isOpen);
  });

  // Close drawer when a link inside it is clicked (SPA-style feel)
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      iconO.classList.remove("hidden");
      iconC.classList.add("hidden");
    })
  );

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      iconO.classList.remove("hidden");
      iconC.classList.add("hidden");
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   2. SCROLL-REVEAL  (IntersectionObserver)
   ───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Unobserve so the animation only fires once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,    // trigger when ~12 % of element is visible
      rootMargin: "0px 0px -40px 0px",
    }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   3. ANIMATED STAT COUNTERS
   ───────────────────────────────────────────────────────────── */
/**
 * Add `data-count="1500"` (and optionally `data-suffix="+"`)
 * to any element you want to animate as a counter.
 * Example: <span class="stat-counter" data-count="1500" data-suffix="+">0</span>
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || "";
  const duration = 1800;           // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initStatCounters() {
  const counters = document.querySelectorAll(".stat-counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ─────────────────────────────────────────────────────────────
   4. ACCORDION
   ───────────────────────────────────────────────────────────── */
/**
 * Expected markup:
 *   <div class="accordion-item">
 *     <button class="accordion-trigger" aria-expanded="false">Question</button>
 *     <div class="accordion-content">Answer</div>
 *   </div>
 *
 * Wrap multiple items in a parent with class="accordion-group" if you
 * want only one panel open at a time.
 */
function initAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const content    = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const group      = trigger.closest(".accordion-group");

      // Collapse all others in the same group
      if (group) {
        group.querySelectorAll(".accordion-trigger").forEach((t) => {
          if (t !== trigger) {
            t.setAttribute("aria-expanded", "false");
            t.nextElementSibling?.classList.remove("open");
            // Rotate chevron back
            t.querySelector(".accordion-chevron")?.classList.remove("rotate-180");
          }
        });
      }

      // Toggle current
      trigger.setAttribute("aria-expanded", String(!isExpanded));
      content.classList.toggle("open", !isExpanded);
      trigger.querySelector(".accordion-chevron")?.classList.toggle("rotate-180", !isExpanded);
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   5. BACK-TO-TOP BUTTON
   ───────────────────────────────────────────────────────────── */
function initBackToTop() {
  // Button is injected by components.js; defer lookup
  function getBtn() { return document.getElementById("back-to-top"); }

  window.addEventListener("scroll", () => {
    const btn = getBtn();
    if (!btn) return;
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  document.addEventListener("click", (e) => {
    if (e.target.closest("#back-to-top")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   6. STICKY NAVBAR SHADOW ENHANCEMENT
   ───────────────────────────────────────────────────────────── */
function initNavbarScroll() {
  const header = document.getElementById("site-header-inner");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow-medium", window.scrollY > 10);
    header.classList.toggle("shadow-soft",   window.scrollY <= 10);
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   INIT — run after DOM (and components.js) are ready
   ───────────────────────────────────────────────────────────── */
function init() {
  initMobileMenu();
  initScrollReveal();
  initStatCounters();
  initAccordion();
  initBackToTop();
  initNavbarScroll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
