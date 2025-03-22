import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      boxShadow: {
        softGlow: '0 0 5px rgba(100, 140, 200, 0.5)',
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'Montserrat', ...fontFamily.sans],
        body: ['var(--font-montserrat)', 'Montserrat', ...fontFamily.sans],
        montserrat: ['var(--font-montserrat)', 'Montserrat', ...fontFamily.sans]
      },
      colors: {
        border: "hsl(220, 20%, 30%)", // Dark gray-blue
        input: "hsl(220, 30%, 40%)", // Matches primary muted blue
        ring: "hsl(265, 40%, 50%)", // Purple highlight effect
        background: "#191970", // Midnight blue
        foreground: "#5A7D7C", // NYVEX brand color
     
        primary: {
          DEFAULT: "#5A7D7C", // NYVEX brand color
          foreground: "hsl(40, 20%, 95%)", // Off-white text
        },
        secondary: {
          DEFAULT: "hsl(210, 35%, 45%)", // Steel Blue
          foreground: "hsl(40, 20%, 95%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 70%, 50%)", // Red for errors or destructive actions
          foreground: "hsl(40, 20%, 95%)",
        },
        muted: {
          DEFAULT: "hsl(220, 20%, 25%)", // Dark muted gray-blue
          foreground: "hsl(40, 20%, 80%)",
        },
        accent: {
          DEFAULT: "#5A7D7C", // NYVEX brand color
          foreground: "hsl(40, 20%, 95%)",
        },
        popover: {
          DEFAULT: "hsl(220, 50%, 15%)", // Slightly lighter than background
          foreground: "hsl(40, 20%, 95%)",
        },
        card: {
          DEFAULT: "hsl(220, 40%, 12%)", // Dark card background
          foreground: "hsl(40, 20%, 95%)",
        },
      },      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
        'subtle-pulse': 'subtlePulse 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default config
