import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { applyThemeMode, readThemeMode, themeStorageKey } from "@/lib/theme";
import type { ThemeMode } from "@/lib/theme";

interface ThemeContextValue {
  mode: ThemeMode;
  ready: boolean;
  error: string | null;
  selectMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** 统一管理官网主题偏好，首次客户端接管后才显示实际选择。 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transitionTimer = useRef<number | null>(null);

  /** 只在日夜配色变化期间启用全站颜色过渡，普通悬停保持独立的交互时长。 */
  function transitionToMode(nextMode: ThemeMode) {
    const root = document.documentElement;
    root.classList.add("theme-changing");
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }
    /** 配色过渡结束后移除临时标记，时长与已确认的主题变量一致。 */
    transitionTimer.current = window.setTimeout(function finishThemeTransition() {
      root.classList.remove("theme-changing");
      transitionTimer.current = null;
    }, 220);
    applyThemeMode(nextMode);
  }

  /** 读取首屏主题并启用后续颜色过渡，避免首次加载播放切换动画。 */
  useEffect(function initializeThemePreference() {
    try {
      const preference = readThemeMode();
      applyThemeMode(preference);
      setMode(preference);
      setReady(true);
    } catch (cause) {
      console.error("[原型评审台官网] 读取主题偏好失败。", cause);
      setError("无法读取主题偏好，请检查浏览器的站点存储设置。");
      return;
    }

    const frame = window.requestAnimationFrame(function enableThemeTransition() {
      document.documentElement.classList.add("theme-ready");
    });

    /** 取消尚未执行的初始化帧，避免卸载后继续修改文档。 */
    return function cancelThemeInitialization() {
      window.cancelAnimationFrame(frame);
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
      document.documentElement.classList.remove("theme-ready", "theme-changing");
    };
  }, []);

  /** 只有跟随系统模式会订阅设备配色变化，手动选择不被覆盖。 */
  useEffect(function subscribeSystemTheme() {
    if (!ready || mode !== "system") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    /** 将系统的日夜变化同步到当前官网外壳。 */
    function updateSystemTheme() {
      transitionToMode("system");
    }

    media.addEventListener("change", updateSystemTheme);
    /** 离开系统模式时移除订阅，保留本人选择。 */
    return function unsubscribeSystemTheme() {
      media.removeEventListener("change", updateSystemTheme);
    };
  }, [mode, ready]);

  /** 偏好成功写入后再切换，存储失败时明确报错且保留当前选择。 */
  function selectMode(nextMode: ThemeMode): void {
    try {
      window.localStorage.setItem(themeStorageKey, nextMode);
      transitionToMode(nextMode);
      setMode(nextMode);
      setError(null);
    } catch (cause) {
      console.error("[原型评审台官网] 保存主题偏好失败。", cause);
      setError("主题设置未保存，请检查浏览器的站点存储权限后重试。");
    }
  }

  return (
    <ThemeContext.Provider value={{ mode, ready, error, selectMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** 仅允许在官网主题提供器内部读取和修改主题。 */
export function useWebsiteTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("[原型评审台官网] 主题控件缺少提供器。");
  }
  return context;
}
