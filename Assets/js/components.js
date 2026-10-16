/**
 * EagleNest Academy — Shared Components
 * Injects the sticky navbar (#site-header) and footer (#site-footer),
 * plus a floating WhatsApp button.
 *
 * Usage: call initComponents() after DOMContentLoaded, or include this
 * script at the bottom of <body> and it self-initialises.
 */

/* ── Configuration ────────────────────────────────────────── */
const SITE = {
  name:   "EagleNest Academy",
  phone:  "+254XXXXXXXXX",          // placeholder — replace with real number
  email:  "info@eaglenestacademy.ac.ke",
  address: "123 Eagle Rise, Nairobi, Kenya",
  hours: {
    weekdays: "Mon – Fri: 7:00 AM – 5:00 PM",
    saturday: "Sat: 8:00 AM – 12:00 PM",
    sunday:   "Sun: Closed",
  },
  socials: {
    facebook:  "#",
    twitter:   "#",
    instagram: "#",
    youtube:   "#",
  },
  logo: "Assets/logo/logo.png",          // update path as needed
};

/* Navigation links — order matters for display */
const NAV_LINKS = [
  { label: "Home",        href: "index.html"        },
  { label: "About",       href: "about.html"         },
  { label: "Academics",   href: "academics.html"     },
  { label: "Student Life",href: "Student -life.html" },
  { label: "Admissions",  href: "Admissions.html"    },
  { label: "Contact",     href: "contact.html"       },
];

/* ── Helper: detect active page ───────────────────────────── */
function getActivePage() {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "index.html";
  return file.toLowerCase();
}

/* ── Navbar HTML builder ───────────────────────────────────── */
function buildNavbar() {
  const active = getActivePage();

  const linkItems = NAV_LINKS.map(({ label, href }) => {
    const isActive = href.toLowerCase() === active;
    const activeClass = isActive ? " active-link" : "";
    const ariaCurrent = isActive ? ' aria-current="page"' : "";
    return `
      <li>
        <a href="${href}"
           class="nav-link text-sm font-semibold text-ink hover:text-leaf-500 transition-colors duration-200${activeClass}"
           ${ariaCurrent}>
          ${label}
        </a>
      </li>`;
  }).join("");

  const mobileLinks = NAV_LINKS.map(({ label, href }) => {
    const isActive = href.toLowerCase() === active;
    const activeClass = isActive ? " active-link" : "";
    return `
      <a href="${href}"
         class="block px-4 py-3 text-sm font-semibold text-ink hover:bg-leaf-50 rounded-lg transition-colors${activeClass}">
        ${label}
      </a>`;
  }).join("");

  return `
  <header id="site-header-inner"
          class="sticky top-0 z-50 bg-white shadow-soft transition-shadow duration-300"
          role="banner">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">

        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="${SITE.name} home">
          <img src="${SITE.logo}"
               alt="${SITE.name} logo"
               class="h-10 w-auto"
               onerror="this.replaceWith(document.querySelector('#logo-fallback').content.cloneNode(true))">
          <template id="logo-fallback">
            <span class="text-xl font-heading font-bold text-ink">
              Eagle<span class="text-leaf-500">Nest</span>
            </span>
          </template>
        </a>

        <!-- Desktop nav -->
        <nav class="hidden lg:flex items-center" aria-label="Main navigation">
          <ul class="flex items-center gap-6 list-none m-0 p-0">
            ${linkItems}
          </ul>
        </nav>

        <!-- Desktop CTA -->
        <div class="hidden lg:block">
          <a href="Admissions.html"
             class="inline-flex items-center gap-2 bg-leaf-500 hover:bg-leaf-600 text-white
                    font-heading font-bold text-sm px-5 py-2.5 rounded-full
                    shadow-soft hover:shadow-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2">
            Apply Now
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
                 aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Mobile hamburger -->
        <button id="mobile-menu-btn"
                type="button"
                class="lg:hidden inline-flex items-center justify-center p-2 rounded-lg
                       text-ink hover:bg-sky-50 transition-colors duration-200"
                aria-controls="mobile-menu"
                aria-expanded="false"
                aria-label="Open navigation menu">
          <!-- Hamburger icon (shown when menu closed) -->
          <svg id="icon-open" xmlns="http://www.w3.org/2000/svg"
               class="w-6 h-6" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <!-- Close icon (shown when menu open) -->
          <svg id="icon-close" xmlns="http://www.w3.org/2000/svg"
               class="w-6 h-6 hidden" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <div id="mobile-menu"
         class="lg:hidden hidden border-t border-sky-100 bg-white px-4 pb-4 pt-2"
         role="navigation"
         aria-label="Mobile navigation">
      <div class="flex flex-col gap-1">
        ${mobileLinks}
        <a href="Admissions.html"
           class="mt-3 inline-flex justify-center items-center gap-2 bg-leaf-500
                  hover:bg-leaf-600 text-white font-heading font-bold text-sm
                  px-5 py-3 rounded-full shadow-soft transition-all duration-200">
          Apply Now
        </a>
      </div>
    </div>
  </header>`;
}

/* ── Footer HTML builder ───────────────────────────────────── */
function buildFooter() {
  const year = new Date().getFullYear();

  const quickLinks = NAV_LINKS.map(({ label, href }) =>
    `<li><a href="${href}" class="text-sky-100 hover:text-white transition-colors text-sm">${label}</a></li>`
  ).join("");

  return `
  <footer id="site-footer-inner" class="bg-ink text-sky-100" role="contentinfo">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Col 1: About blurb -->
        <div>
          <a href="index.html" class="inline-block mb-4" aria-label="${SITE.name} home">
            <span class="text-2xl font-heading font-bold text-white">
              Eagle<span class="text-leaf-500">Nest</span> Academy
            </span>
          </a>
          <p class="text-sm leading-relaxed text-sky-100">
            Nurturing tomorrow's leaders through academic excellence, character
            development, and a culture of innovation in the heart of Nairobi.
          </p>
        </div>

        <!-- Col 2: Quick links -->
        <div>
          <h3 class="text-white font-heading font-bold text-base mb-4 uppercase tracking-wide">
            Quick Links
          </h3>
          <ul class="flex flex-col gap-2 list-none m-0 p-0">
            ${quickLinks}
          </ul>
        </div>

        <!-- Col 3: Contact details -->
        <div>
          <h3 class="text-white font-heading font-bold text-base mb-4 uppercase tracking-wide">
            Contact Us
          </h3>
          <address class="not-italic flex flex-col gap-3 text-sm">
            <span class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 shrink-0 text-leaf-500"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              ${SITE.address}
            </span>
            <span class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-leaf-500"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a href="tel:${SITE.phone}" class="hover:text-white transition-colors">
                ${SITE.phone}
              </a>
            </span>
            <span class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 text-leaf-500"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:${SITE.email}" class="hover:text-white transition-colors">
                ${SITE.email}
              </a>
            </span>
          </address>
        </div>

        <!-- Col 4: Hours + Socials -->
        <div>
          <h3 class="text-white font-heading font-bold text-base mb-4 uppercase tracking-wide">
            Office Hours
          </h3>
          <ul class="flex flex-col gap-1.5 text-sm list-none m-0 p-0 mb-6">
            <li>${SITE.hours.weekdays}</li>
            <li>${SITE.hours.saturday}</li>
            <li class="text-sky-100/60">${SITE.hours.sunday}</li>
          </ul>

          <!-- Social icons -->
          <h3 class="text-white font-heading font-bold text-base mb-3 uppercase tracking-wide">
            Follow Us
          </h3>
          <div class="flex items-center gap-3">
            <!-- Facebook -->
            <a href="${SITE.socials.facebook}"
               target="_blank" rel="noopener noreferrer"
               class="w-9 h-9 flex items-center justify-center rounded-full bg-white/10
                      hover:bg-leaf-500 transition-colors duration-200"
               aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <!-- Twitter / X -->
            <a href="${SITE.socials.twitter}"
               target="_blank" rel="noopener noreferrer"
               class="w-9 h-9 flex items-center justify-center rounded-full bg-white/10
                      hover:bg-leaf-500 transition-colors duration-200"
               aria-label="Twitter / X">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <!-- Instagram -->
            <a href="${SITE.socials.instagram}"
               target="_blank" rel="noopener noreferrer"
               class="w-9 h-9 flex items-center justify-center rounded-full bg-white/10
                      hover:bg-leaf-500 transition-colors duration-200"
               aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </a>
            <!-- YouTube -->
            <a href="${SITE.socials.youtube}"
               target="_blank" rel="noopener noreferrer"
               class="w-9 h-9 flex items-center justify-center rounded-full bg-white/10
                      hover:bg-leaf-500 transition-colors duration-200"
               aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0F2A43"/>
              </svg>
            </a>
          </div>
        </div>

      </div><!-- /grid -->
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                  flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sky-100/60">
        <p>&copy; ${year} ${SITE.name}. All rights reserved.</p>
        <nav aria-label="Legal links" class="flex gap-4">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Use</a>
        </nav>
      </div>
    </div>
  </footer>`;
}

/* ── WhatsApp floating button ─────────────────────────────── */
function buildWhatsApp() {
  const encoded = SITE.phone.replace(/\D/g, "");   // strip non-digits
  const msg = encodeURIComponent("Hello! I'd like to learn more about EagleNest Academy.");
  return `
  <a href="https://wa.me/${encoded}?text=${msg}"
     id="whatsapp-fab"
     target="_blank"
     rel="noopener noreferrer"
     class="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center
            rounded-full bg-[#25D366] shadow-strong hover:scale-110
            transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
     aria-label="Chat with us on WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-white" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>`;
}

/* ── Back-to-top button ───────────────────────────────────── */
function buildBackToTop() {
  return `
  <button id="back-to-top"
          type="button"
          class="fixed bottom-24 right-6 z-40 w-11 h-11 flex items-center justify-center
                 rounded-full bg-ink text-white shadow-medium
                 hover:bg-leaf-500 transition-all duration-200
                 focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2"
          aria-label="Scroll back to top">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
    </svg>
  </button>`;
}

/* ── Mount everything ─────────────────────────────────────── */
function initComponents() {
  const headerEl = document.getElementById("site-header");
  if (headerEl) headerEl.innerHTML = buildNavbar();

  const footerEl = document.getElementById("site-footer");
  if (footerEl) footerEl.innerHTML = buildFooter();

  // Append floating buttons directly to body
  document.body.insertAdjacentHTML("beforeend", buildWhatsApp());
  document.body.insertAdjacentHTML("beforeend", buildBackToTop());
}

/* Auto-initialise when the DOM is ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents);
} else {
  initComponents();
}
