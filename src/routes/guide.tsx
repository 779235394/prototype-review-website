import { DocumentLayout } from "@/components/layout/document-layout";
import { guideChapters } from "@/content/guide";
import { createPageMeta } from "@/lib/page-meta";

/** 使用说明的标题、摘要和地址在静态构建时写入页面。 */
export function meta() {
  return createPageMeta("使用说明｜原型评审台", "了解团队、原型版本、节点备注、修改历史和分享的使用边界。", "guide/");
}

/** 提供可独立访问的说明入口，完整章节在使用与部署说明任务中补齐。 */
/** 本次已补齐十章静态说明，不将待交付的实际操作界面描述为现有功能。 */
export default function GuidePage() {
  return (
    <DocumentLayout page="guide" title="使用说明" description="本页介绍原型评审台已确定的使用方式。评审应用尚在建设中，当前内容用于了解功能与边界；实际操作图和按钮说明将在应用完成后补齐。" summary="从团队到节点备注，了解每一份内容的位置与保存规则。" chapters={guideChapters} />
  );
}
