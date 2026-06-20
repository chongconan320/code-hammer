import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--color-border))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        card: "hsl(var(--color-card))",
        "card-foreground": "hsl(var(--color-card-foreground))",
        muted: "hsl(var(--color-muted))",
        "muted-foreground": "hsl(var(--color-muted-foreground))",
        primary: "hsl(var(--color-primary))",
        "primary-foreground": "hsl(var(--color-primary-foreground))",
        sidebar: "hsl(var(--color-sidebar))",
        "sidebar-foreground": "hsl(var(--color-sidebar-foreground))",
        "sidebar-muted": "hsl(var(--color-sidebar-muted))",
        "sidebar-border": "hsl(var(--color-sidebar-border))",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
