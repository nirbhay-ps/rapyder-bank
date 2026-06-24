/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Brand
        maroon: {
          DEFAULT: "#9C1D26",
          deep: "#6B1219",
          light: "#C4404A",
          ring: "rgba(156,29,38,0.30)",
          ring2: "rgba(156,29,38,0.45)",
          tint6: "rgba(156,29,38,0.06)",
          tint8: "rgba(156,29,38,0.08)",
          tint15: "rgba(156,29,38,0.15)",
          tint20: "rgba(156,29,38,0.20)",
        },
        // Light surfaces
        surface: {
          page: "#FAF8F6",
          card: "#FFFFFF",
          muted: "#F2EEE9",
          divider: "#EDE8E3",
          rule: "#E8E0DC",
        },
        // Dark surfaces (sidebar, KPI cards) — warmer maroon-tinted darks
        dark: {
          base: "#3D1218",
          s1: "#5A0F16",
          s2: "#7A161E",
          ticker: "#1A0608",
          textPri: "#F8F1EE",
          textSec: "#D4B6B5",
          textMuted: "#A18586",
          navIdle: "#C9A4A6",
          sectionLabel: "#8A5C5F",
        },
        // Text
        ink: {
          900: "#1C1917",
          500: "#78716C",
          300: "#A8A29E",
        },
        // Semantic
        sage: { DEFAULT: "#2E7D52", fill: "#EAF4EE" },
        amber: { DEFAULT: "#B45309", fill: "#FEF3CD" },
        crit: { DEFAULT: "#991B1B", fill: "#FEE2E2" },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        sans: ['"DM Sans"', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        cap: "0.10em",
        capWide: "0.12em",
      },
      borderRadius: {
        none: "0",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.25,0.46,0.45,0.94)",
      },
    },
  },
  plugins: [],
};
