import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Vegas Nights Theme - Neon Casino Aesthetic
                primary: {
                    DEFAULT: "#FF2D7C", // Hot Pink - main accent
                    dark: "#CC2463",
                    light: "#FF6B9D",
                    glow: "rgba(255, 45, 124, 0.6)",
                },
                accent: {
                    DEFAULT: "#00D4FF", // Electric Cyan
                    dark: "#00A3CC",
                    light: "#33E0FF",
                    glow: "rgba(0, 212, 255, 0.6)",
                    green: "#00FF88", // Neon Green
                    cyan: "#01d5ff", // Neon Cyan (app colors)
                    purple: "#A855F7", // Neon Purple
                    gold: "#FFE500", // Vegas Gold
                },
                // Neon colors matching mobile app
                neon: {
                    pink: "#eb2a73",
                    blue: "#01d5ff",
                    green: "#00fa9a",
                },
                background: "#121212", // Near black
                felt: "#1a1a1a", // Dark felt table
                surface: {
                    DEFAULT: "rgba(255, 255, 255, 0.08)", // Glass effect
                    elevated: "rgba(255, 255, 255, 0.12)",
                    dark: "rgba(0, 0, 0, 0.4)",
                    border: "rgba(255, 255, 255, 0.1)",
                    glass: "rgba(255, 255, 255, 0.15)",
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: "rgba(255, 255, 255, 0.7)",
                    muted: "rgba(255, 255, 255, 0.4)",
                },
                zinc: {
                    950: "#09090b",
                },
                success: "#00FF88", // Neon green
                warning: "#FFE500", // Vegas gold
                danger: "#FF2D7C", // Hot pink
            },
            fontFamily: {
                display: ["Inter", "system-ui", "sans-serif"],
                body: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "ui-monospace", "monospace"],
            },
            spacing: {
                xs: "0.25rem",
                sm: "0.5rem",
                md: "1rem",
                lg: "1.5rem",
                xl: "2rem",
                "2xl": "3rem",
                "3xl": "4rem",
                "4xl": "6rem",
            },
            borderRadius: {
                sm: "0.375rem",
                md: "0.5rem",
                lg: "0.75rem",
                xl: "1rem",
                "2xl": "1.5rem",
            },
        },
    },
    plugins: [],
};
export default config;
