import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { siteConfig } from "./site.config.ts";

/** 官网资源路径与路由共用公开配置，避免项目站点出现根路径资源。 */
export default defineConfig({
  base: siteConfig.basePath,
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: ["chrome111", "edge111", "firefox128", "safari16.4"],
    sourcemap: false,
  },
});
