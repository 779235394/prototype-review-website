import { Links, Meta, Outlet, Scripts, isRouteErrorResponse, useRouteError } from "react-router";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { sitePath } from "@/lib/site";
import { themeBootstrapScript } from "@/lib/theme";
import stylesheet from "@/styles/app.css?url";

/** 提供所有静态页面共用的样式和站点图标。 */
export function links() {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "icon", type: "image/svg+xml", sizes: "any", href: sitePath("favicon.svg") },
  ];
}

/** 生成完整文档，首屏脚本只预先改变根元素的主题属性。 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    /* 仅根元素的预置主题属性存在预期差异，正文及其他节点仍正常参与接管校验。 */
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider delayDuration={300}>
            <div className="flex min-h-dvh flex-col">
              <a className="skip-link" href="#main-content">跳转到正文</a>
              <SiteHeader />
              {children}
              <SiteFooter />
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

/** 承载已明确声明的官网静态内容路由。 */
export default function App() {
  return <Outlet />;
}

/** 将真实渲染异常明确展示出来，不返回伪造的正常页面。 */
export function ErrorBoundary() {
  const error = useRouteError();
  let description = "页面渲染发生错误，请刷新后重试；若仍失败，请联系维护者。";
  if (isRouteErrorResponse(error)) {
    description = `页面请求未成功，返回状态为 ${error.status}。`;
  }
  return (
    <main id="main-content" tabIndex={-1} className="site-container grow py-24">
      <h1 className="text-3xl font-semibold">页面暂时无法显示</h1>
      <p className="reading-text mt-4" role="alert">{description}</p>
      <a className="navigation-link mt-6" href={sitePath()}>返回首页</a>
    </main>
  );
}
