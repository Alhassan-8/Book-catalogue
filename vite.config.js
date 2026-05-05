import { defineConfig } from "vite";

export default defineConfig({
  // Base path - use / for Netlify (root deployment), /Book-catalogue/ for GitHub Pages
  base: "/",

  // Root is the project root (index.html lives here)
  root: ".",

  build: {
    outDir: "dist",
    // Produce a single JS bundle and a single CSS file
    rollupOptions: {
      output: {
        // Force a single JS entry chunk
        entryFileNames: "assets/app.js",
        // Inline all CSS into the single CSS file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/style.css";
          }
          return "assets/[name][extname]";
        },
        // Prevent code-splitting (keep everything in one JS file)
        manualChunks: undefined,
      },
    },
    // Ensure no additional chunk splitting
    chunkSizeWarningLimit: 2000,
  },

  server: {
    port: 3000,
    open: true,
  },
});
