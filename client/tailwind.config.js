/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      nunito: ["Nunito", "sans-serif"],
    },
    extend: {
      keyframes: {
        "border-light": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#20376C",
        },
        custom: {
          cyan: "#99F3EA",
          blue: "#223850",
        },
      },
      animation: {
        "border-light": "border-light 3s linear infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        slideDown: "slideDown 300ms ease-out",
        slideUp: "slideUp 300ms ease-in",
      },
      fontWeight: {
        hairline: "100",
        thin: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      backgroundImage: {
        "hero-pattern":
          "url('https://therealielts.vn/wp-content/uploads/2023/07/Ve-Retheielts_v1.1-min-1.jpg.webp')",
      },
    },
  },
  plugins: [],
};
