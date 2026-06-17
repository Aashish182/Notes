/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1117",
        surface: "#1a1d2e",
        surface2: "#232640",
        border: "#2e3156",
        primary: { DEFAULT: "#7c6aff", hover: "#9d8fff" },
        accent: "#ff6b6b",
        muted: "#8888aa",
        success: "#4ade80",
        warning: "#fbbf24",
        note: {
          red: "#ff6b6b",
          orange: "#ff9f43",
          yellow: "#ffd32a",
          green: "#4ade80",
          blue: "#60a5fa",
          purple: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease",
        "slide-up": "slideUp 0.2s ease",
        "slide-in-right": "slideInRight 0.25s ease",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};