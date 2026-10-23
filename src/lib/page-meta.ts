import type { MetaDescriptor } from "react-router";
import { canonicalUrl } from "./site";

/** 为预渲染页面生成静态标题、摘要和规范地址，不依赖请求接口。 */
export function createPageMeta(title: string, description: string, path: string): MetaDescriptor[] {
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl(path) },
  ];
}
