import { index, route } from "@react-router/dev/routes";
import type { RouteConfig } from "@react-router/dev/routes";

/** 所有公开内容路由均参与静态生成，通配路由只展示地址不存在页面。 */
export default [
  index("routes/home.tsx"),
  route("guide", "routes/guide.tsx"),
  route("deployment", "routes/deployment.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
