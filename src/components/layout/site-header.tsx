import { MenuIcon, MessageSquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { navigationItems } from "@/content/navigation";
import { siteConfig, sitePath } from "@/lib/site";

/** 建设状态显示文字；应用正式上线且配置有效后才出现真实入口。 */
function ApplicationEntry() {
  if (siteConfig.application.state === "available" && siteConfig.application.url !== null) {
    return <a className="navigation-link" href={siteConfig.application.url}>进入评审应用</a>;
  }
  return <span className="application-status">评审应用建设中</span>;
}

/** 全站导航共用同一组地址，桌面导航和手机抽屉保持内容一致。 */
export function SiteHeader() {
  const location = useLocation();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const brandLink = useRef<HTMLAnchorElement>(null);
  const pendingAnchor = useRef<string | null>(null);
  const focusFrame = useRef<number | null>(null);

  /** 切回电脑布局时关闭手机抽屉，卸载时清理尚未执行的焦点交接。 */
  useEffect(function watchNavigationViewport() {
    const desktop = window.matchMedia("(min-width: 768px)");
    /** 电脑主导航出现后不继续占用手机抽屉的遮罩和焦点。 */
    function closeNavigationOnDesktop() {
      if (desktop.matches) {
        setNavigationOpen(false);
      }
    }
    desktop.addEventListener("change", closeNavigationOnDesktop);
    /** 移除当前页的窗口监听和待执行帧。 */
    return function stopNavigationViewportWatch() {
      desktop.removeEventListener("change", closeNavigationOnDesktop);
      if (focusFrame.current !== null) {
        window.cancelAnimationFrame(focusFrame.current);
      }
    };
  }, []);

  /** 两种导航以相同规则标记当前说明页，首页区块仍使用锚点语义。 */
  function currentNavigationPage(item: (typeof navigationItems)[number]): "page" | undefined {
    if (item.page !== null && location.pathname.replace(/\/$/, "") === `/${item.page}`) {
      return "page";
    }
    return undefined;
  }

  /** 只为当前首页内的区块跳转登记目标，跨页跳转交由完整文档导航处理。 */
  function prepareMobileAnchor(item: (typeof navigationItems)[number]) {
    pendingAnchor.current = null;
    if (location.pathname === "/" && item.path.startsWith("#")) {
      pendingAnchor.current = item.path.slice(1);
    }
  }

  /** 抽屉关闭后把页内阅读焦点交给目标区块，普通关闭仍遵循组件的焦点返回规则。 */
  function finishMobileNavigation(event: Event) {
    const anchor = pendingAnchor.current;
    pendingAnchor.current = null;
    if (anchor !== null) {
      event.preventDefault();
      /** 等抽屉退出及页面滚动锁解除后再定位，不让返回入口抢走正文焦点。 */
      focusFrame.current = window.requestAnimationFrame(function focusSelectedHomeSection() {
        focusFrame.current = null;
        const target = document.getElementById(anchor);
        if (target === null) {
          throw new Error("[原型评审台官网] 手机导航缺少对应的首页区块。");
        }
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start" });
      });
    } else if (window.matchMedia("(min-width: 768px)").matches) {
      event.preventDefault();
      brandLink.current?.focus({ preventScroll: true });
    }
  }

  /** 文档路由用当前页面语义标记，首页区块链接保留明确的锚点。 */
  function renderNavigationItem(item: (typeof navigationItems)[number]) {
    const current = currentNavigationPage(item);
    return <a key={item.path} className="navigation-link" href={sitePath(item.path)} aria-current={current}>{item.label}</a>;
  }

  /** 点击手机导航后交由基础抽屉组件关闭并恢复触发按钮的焦点。 */
  function renderMobileNavigationItem(item: (typeof navigationItems)[number]) {
    /** 在抽屉关闭前保留本次选择的锚点，不改变浏览器链接历史。 */
    function selectMobileNavigationItem() {
      prepareMobileAnchor(item);
    }
    return (
      <SheetClose key={item.path} asChild>
        <a className="navigation-link min-h-12 px-4 text-base" href={sitePath(item.path)} aria-current={currentNavigationPage(item)} onClick={selectMobileNavigationItem}>{item.label}</a>
      </SheetClose>
    );
  }

  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <a ref={brandLink} className="site-brand" href={sitePath()} aria-label="原型评审台首页">
          <MessageSquareIcon className="brand-symbol" aria-hidden="true" />
          <span>{siteConfig.siteName}</span>
        </a>
        <nav className="desktop-navigation" aria-label="主要导航">
          {navigationItems.map(renderNavigationItem)}
        </nav>
        <div className="header-actions">
          <ThemeSelector />
          <div className="header-application-status"><ApplicationEntry /></div>
          <Sheet open={navigationOpen} onOpenChange={setNavigationOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="mobile-navigation-trigger size-11" aria-label="打开导航">
                <MenuIcon className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="site-navigation-sheet" onCloseAutoFocus={finishMobileNavigation}>
              <SheetHeader className="pr-16">
                <SheetTitle>原型评审台</SheetTitle>
                <SheetDescription>产品介绍与使用部署说明</SheetDescription>
              </SheetHeader>
              <nav className="grid gap-2" aria-label="手机主要导航">
                {navigationItems.map(renderMobileNavigationItem)}
              </nav>
              <div className="mt-auto border-t p-4"><ApplicationEntry /></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
