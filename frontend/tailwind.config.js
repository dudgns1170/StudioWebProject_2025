/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 새로운 컬러 팔레트
        primary: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#2C3E50", // 딥 블루 그레이
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#000000",
        },
        accent: {
          50: "#FDEDEC",
          100: "#FADBD8",
          200: "#F5B7B1",
          300: "#F1948A",
          400: "#EC7063",
          500: "#E74C3C", // 코랄 레드
          600: "#CB4335",
          700: "#A93226",
          800: "#922B21",
          900: "#7B241C",
        },
        neutral: {
          50: "#ECF0F1", // 라이트 그레이
          100: "#D5DBDB",
          200: "#ABB2B9",
          300: "#909497",
          400: "#5D6D7E",
          500: "#34495E", // 미디엄 블루 그레이
          600: "#283747",
          700: "#1C2833",
          800: "#17202A",
          900: "#0B0C10",
        },
        warm: {
          50: "#FEF9E7",
          100: "#FCF3CF",
          200: "#F9E79F",
          300: "#F7DC6F",
          400: "#F4D03F",
          500: "#F39C12", // 머스타드 옐로우
          600: "#E67E22",
          700: "#CA6F1E",
          800: "#BA4A00",
          900: "#935116",
        },
      },
      fontFamily: {
        sans: ["Noto Sans KR", "Poppins", "sans-serif"],
        display: ["Poppins", "Noto Sans KR", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        large:
          "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)",
        colored: "0 4px 20px -5px rgba(231, 76, 60, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
