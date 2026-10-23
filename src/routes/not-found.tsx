import { ArrowLeftIcon, FileSearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sitePath } from "@/lib/site";

/** 不存在页面禁止索引，元信息不依赖访问者输入的错误地址。 */
export function meta() {
  return [
    { title: "地址不存在｜原型评审台" },
    { name: "robots", content: "noindex" },
    { name: "description", content: "这个地址没有对应页面，可以返回首页或查看使用说明。" },
  ];
}

/** 为静态托管提供独立不存在页面，不跳转或重写为首页。 */
export default function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className="site-container not-found-page grow">
      <FileSearchIcon className="not-found-symbol" aria-hidden="true" />
      <h1>这个地址没有对应的页面。</h1>
      <p className="reading-text">地址可能已更改，也可能输入有误。你可以返回首页，或者查看使用说明。</p>
      <div className="hero-actions">
        <Button asChild size="lg"><a href={sitePath()}><ArrowLeftIcon className="size-4" aria-hidden="true" />返回首页</a></Button>
        <Button asChild variant="outline" size="lg"><a href={sitePath("guide/")}>查看使用说明</a></Button>
      </div>
    </main>
  );
}
