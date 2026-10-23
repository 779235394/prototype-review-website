import type { Config } from "@react-router/dev/config";
import { siteConfig } from "./site.config.ts";

/** 只在构建期生成完整页面，不部署运行时渲染服务或动态路由清单。 */
export default {
  appDirectory: "src",
  basename: siteConfig.basePath,
  ssr: false,
  prerender: ["/", "/guide", "/deployment", "/404"],
  routeDiscovery: { mode: "initial" },
} satisfies Config;
