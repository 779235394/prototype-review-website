/** 官网公开导航只包含静态内容，不提供尚未上线的应用或私有源码入口。 */
export const navigationItems = [
  { label: "功能", path: "#features", page: null },
  { label: "评审方式", path: "#workflow", page: null },
  { label: "使用说明", path: "guide/", page: "guide" },
  { label: "部署说明", path: "deployment/", page: "deployment" },
] as const;

/** 两类说明采用同一阅读布局，内容目录将在完整正文实现时补齐。 */
/** 章节现由各自的静态正文提供，本清单仅维护两类说明的页面入口。 */
export const documentNavigationItems = [
  { label: "使用说明", path: "guide/", page: "guide" },
  { label: "部署说明", path: "deployment/", page: "deployment" },
] as const;
