export type ThemeMode = "light" | "dark" | "system";

export const themeStorageKey = "prototype-review.website.theme";

/** 校验界面偏好，只接受已经确认的三种主题模式。 */
export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

/** 读取官网独立的界面偏好；从未选择时使用已确认的跟随系统规则。 */
export function readThemeMode(): ThemeMode {
  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === null) {
    return "system";
  }
  if (!isThemeMode(stored)) {
    throw new Error("[原型评审台官网] 已保存的主题值无效，请清除该站点的主题偏好后重新选择。");
  }
  return stored;
}

/** 根据所选模式更新官网外壳，不操作任何产品示意图片的颜色。 */
export function applyThemeMode(mode: ThemeMode): void {
  let dark = mode === "dark";
  if (mode === "system") {
    dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.dataset.themeMode = mode;
  if (dark) {
    root.style.colorScheme = "dark";
  } else {
    root.style.colorScheme = "light";
  }
}

/** 首屏同步脚本保持固定字面量，使构建期与客户端接管时的脚本内容一致。 */
export const themeBootstrapScript = `
/* 首屏绘制前应用官网主题，不请求接口、不保存业务内容。 */
(function initializeWebsiteTheme() {
  var stored = window.localStorage.getItem(${JSON.stringify(themeStorageKey)});
  var mode = stored;
  if (stored === null) {
    mode = "system";
  }
  if (mode !== "light" && mode !== "dark" && mode !== "system") {
    throw new Error("[原型评审台官网] 已保存的主题值无效，请清除主题偏好后重新选择。");
  }
  var dark = mode === "dark";
  if (mode === "system") {
    dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dataset.themeMode = mode;
  if (dark) {
    document.documentElement.style.colorScheme = "dark";
  } else {
    document.documentElement.style.colorScheme = "light";
  }
})();`;
