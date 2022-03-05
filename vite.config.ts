import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "tinyClientReact",
      fileName: (format) => `tiny-client-react.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
    },
  },
});
