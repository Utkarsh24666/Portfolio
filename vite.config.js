import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replace(/\\/g, "/");
          if (moduleId.includes("/node_modules/three/")) return "three-core";
          if (
            moduleId.includes("/node_modules/@react-three/") ||
            moduleId.includes("/node_modules/three-stdlib/")
          ) {
            return "react-three";
          }
        },
      },
    },
  },
});
