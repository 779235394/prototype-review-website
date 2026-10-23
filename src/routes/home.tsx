import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeClosing, HomeFeatures, HomeQuestions, HomeWorkflow } from "@/components/marketing/home-sections";
import { PrototypeDemo } from "@/components/marketing/prototype-demo";
import { createPageMeta } from "@/lib/page-meta";
import { sitePath } from "@/lib/site";

/** 首页标题和摘要来自已确认的官网内容稿。 */
export function meta() {
  return createPageMeta(
    "原型评审台｜把批注，留在原型上。",
    "了解按上传人组织网页原型、选择页面节点添加富文本批注、保留修改历史，以及分享指定版本的评审方式。",
    "",
  );
}

/** 首页基础内容入口；完整产品示意、功能与常见问题由首页实现任务继续交付。 */
/** 首页实现任务现已补齐上述内容，产品示意仅承载静态方案阅读。 */
export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="home-page grow">
      <section className="site-container home-hero" aria-labelledby="hero-title">
        <p className="home-release-note">评审应用建设中</p>
        <h1 id="hero-title">把批注，<br />留在原型上。</h1>
        <p className="hero-description">在项目中按上传人找到原型，选中具体页面区域写下批注。团队成员共同修改当前内容，每次保存都有修改人和历史记录可查。</p>
        <div className="home-hero-action-row">
          <div className="hero-actions">
            <Button asChild size="lg">
              <a href={sitePath("#workflow")}>了解评审方式<ArrowRightIcon className="size-4" aria-hidden="true" /></a>
            </Button>
            <Button asChild variant="outline" size="lg"><a href={sitePath("guide/")}>查看使用说明</a></Button>
          </div>
          <p className="home-annotation-path" aria-hidden="true">区域 ③ <span>→</span> 当前批注 <span>→</span> 修改历史</p>
        </div>
        <p className="home-device-note">评审应用面向电脑端，官网支持手机阅读。</p>
        <PrototypeDemo />
      </section>
      <HomeFeatures />
      <HomeWorkflow />
      <HomeQuestions />
      <HomeClosing />
    </main>
  );
}
