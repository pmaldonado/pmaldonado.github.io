// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: "https://pmaldonado.com",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
