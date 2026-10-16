/**
 * EagleNest Academy — Tailwind CSS Configuration
 * Loaded via <script> before the Tailwind CDN script.
 */
window.tailwind = window.tailwind || {};

tailwind.config = {
  /* ─── Theme ─────────────────────────────────────────────── */
  theme: {
    extend: {
      /* Brand colours */
      colors: {
        sky: {
          50:  "#F0F9FF",
          100: "#E0F2FE",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        leaf: {
          50:  "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
        },
        ink: "#0F2A43",
      },

      /* Brand typography */
      fontFamily: {
        heading: ['"Century Gothic"', "Questrial", "sans-serif"],
        body:    ["Montserrat", "sans-serif"],
      },

      /* Soft shadow utilities */
      boxShadow: {
        soft:   "0 2px 12px 0 rgba(15,42,67,0.08)",
        medium: "0 4px 24px 0 rgba(15,42,67,0.12)",
        strong: "0 8px 40px 0 rgba(15,42,67,0.18)",
      },

      /* Rounded sizes */
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },

  /* ─── Plugins ────────────────────────────────────────────── */
  plugins: [],
};
