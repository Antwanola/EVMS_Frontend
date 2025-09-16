// theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";
import { background } from "@chakra-ui/system";

const config = {
  theme: {
    tokens: {
      colors: {
        appbg: { value: " oklch(0.95 0.0058 264.53)" }, //  --secondary: oklch(0.95 0.0058 264.53);

        brand: {
          background: { value: "var(--background)" },
          foreground: { value: "var(--foreground)" },
          700: { value: "#2a69ac" },
        },
      },
      fonts: {
        heading: { value: "var(--font-manrope)f" },
        body: { value: "var(--font-manrope)" },
      },
    },
    styles: {
      global: {
        body: {
          overflowX: "hidden", // 👈 prevents global horizontal scroll
          width: "100%",
          bg: "rgba(215, 235, 245, 1)", // 👈 global body background
          color: "black", // 👈 optional text color
        },
        html: {
          height: "100%",
          bg: "#d8e1ecff", // also apply to <html>
        },
      },
    },
  },
};

const theme = createSystem(defaultConfig, config);

export default theme;
