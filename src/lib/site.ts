import { siteConfig } from "../../site.config";

export { siteConfig };

/** 从唯一仓库前缀生成站内地址，调用处只传相对内容路径。 */
export function sitePath(path: string = ""): string {
  if (path.startsWith("/") || path.includes("..") || path.includes(":")) {
    throw new Error("[原型评审台官网] 站内链接必须使用相对内容路径。");
  }
  return `${siteConfig.basePath}${path}`;
}

/** 将站内内容地址转换为用于页面元信息的完整地址。 */
export function canonicalUrl(path: string = ""): string {
  return `${siteConfig.siteOrigin}${sitePath(path)}`;
}
