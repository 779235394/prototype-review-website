import { siteConfig, sitePath } from "@/lib/site";

/** 说明官网与评审应用的设备范围，并按实际公开状态展示源码入口。 */
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
        <div className="site-footer-source text-muted-foreground">
          {siteConfig.source.state === "public" && <a className="navigation-link" href={siteConfig.source.websiteUrl}>查看官网源码</a>}
          {siteConfig.source.state === "private" && <p>计划开源，源码与许可证将在公开时提供。</p>}
        </div>
      </div>
    </footer>
  );
}
