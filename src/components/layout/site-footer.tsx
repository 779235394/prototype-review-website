import { sitePath } from "@/lib/site";

/** 说明官网与评审应用的设备范围，页尾仅提供使用与部署说明入口。 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <div>
          <p className="font-semibold">原型评审台</p>
          <p className="mt-2 text-muted-foreground">评审应用面向电脑端，官网支持手机阅读。</p>
        </div>
        <nav className="flex gap-6" aria-label="页尾导航">
          <a className="navigation-link" href={sitePath("guide/")}>使用说明</a>
          <a className="navigation-link" href={sitePath("deployment/")}>部署说明</a>
        </nav>
      </div>
    </footer>
  );
}
