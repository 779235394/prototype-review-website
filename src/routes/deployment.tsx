import { DocumentLayout } from "@/components/layout/document-layout";
import { deploymentChapters } from "@/content/deployment";
import { createPageMeta } from "@/lib/page-meta";

/** 部署说明元信息独立生成，不需要运行任何业务服务。 */
export function meta() {
  return createPageMeta("部署说明｜原型评审台", "了解独立静态官网与评审应用的部署边界及准备事项。", "deployment/");
}

/** 仅说明当前工程边界，不编造尚未交付的后端启动命令。 */
export default function DeploymentPage() {
  return (
    <DocumentLayout page="deployment" title="部署说明" description="官网、评审前端和后端是三个独立工程。官网可独立静态部署；评审业务需要后端、数据库与文件目录。当前先交付官网，业务部署步骤将在对应工程完成后提供。" summary="先独立运行官网，再为团队准备可访问的评审服务。" chapters={deploymentChapters} />
  );
}
