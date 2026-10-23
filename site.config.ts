/** 官网全部可公开的构建输入，不接入业务接口或本机秘密。 */
export const siteConfig: SiteConfig = {
  siteName: "原型评审台",
  siteOrigin: "https://779235394.github.io",
  basePath: "/prototype-review-website/",
  application: {
    state: "building",
    url: null,
  },
  source: {
    state: "public",
    websiteUrl: "https://github.com/779235394/prototype-review-website",
    license: null,
  },
};

export interface SiteConfig {
  siteName: string;
  siteOrigin: string;
  basePath: string;
  application: {
    state: "building" | "available";
    url: string | null;
  };
  source: {
    state: "private" | "public";
    websiteUrl: string;
    license: string | null;
  };
}

/** 在开发和构建前拒绝缺失或互相矛盾的公开配置，不猜测应用入口。 */
export function validateSiteConfig(config: SiteConfig): void {
  if (config.siteName.trim().length === 0) {
    throw new Error("[原型评审台官网] 必须配置站点名称。");
  }

  const origin = new URL(config.siteOrigin);
  if (origin.protocol !== "https:" && origin.protocol !== "http:") {
    throw new Error("[原型评审台官网] 站点来源必须是网页地址。");
  }
  if (origin.origin !== config.siteOrigin) {
    throw new Error("[原型评审台官网] 站点来源不能包含路径、参数或末尾斜线。");
  }
  if (!/^\/[a-zA-Z0-9_-]+\/$/.test(config.basePath)) {
    throw new Error("[原型评审台官网] 仓库子路径必须使用单层目录，并保留首尾斜线。");
  }
  if (config.application.state !== "building" && config.application.state !== "available") {
    throw new Error("[原型评审台官网] 应用状态不在已约定范围内。");
  }
  if (config.application.state === "building" && config.application.url !== null) {
    throw new Error("[原型评审台官网] 建设状态不能配置可用应用入口。");
  }
  if (config.application.state === "available") {
    if (config.application.url === null || config.application.url.trim().length === 0) {
      throw new Error("[原型评审台官网] 应用上线状态必须配置完整入口。");
    }
    const applicationUrl = new URL(config.application.url);
    if (applicationUrl.protocol !== "https:" && applicationUrl.protocol !== "http:") {
      throw new Error("[原型评审台官网] 应用入口必须是网页地址。");
    }
  }
  if (config.source.state !== "private" && config.source.state !== "public") {
    throw new Error("[原型评审台官网] 源码公开状态不在已约定范围内。");
  }
  const sourceUrl = new URL(config.source.websiteUrl);
  if (sourceUrl.protocol !== "https:") {
    throw new Error("[原型评审台官网] 源码地址必须使用加密网页地址。");
  }
}

validateSiteConfig(siteConfig);
