/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: "#6657F5",
          "violet-hover": "#5443EB",
          "violet-light": "#EEECFE",
          blue: "#3B82F6",
          "blue-hover": "#2563EB",
          "blue-light": "#EFF6FF",
          navy: "#0F172A",
          "navy-light": "#1E293B",
          bg: "#F7F8FC",
          card: "#FFFFFF",
          muted: "#64748B",
          border: "#E2E8F0",
        },
        status: {
          success: "#16A34A",
          "success-light": "#DCFCE7",
          warning: "#F59E0B",
          "warning-light": "#FEF3C7",
          error: "#DC2626",
          "error-light": "#FEE2E2",
          info: "#0284C7",
          "info-light": "#E0F2FE",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 10px 25px -5px rgba(102, 87, 245, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px -3px rgba(102, 87, 245, 0.35)",
      },
      borderRadius: {
        card: "16px",
      }
    },
  },
  plugins: [],
}
