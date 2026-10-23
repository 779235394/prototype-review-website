import { CommandBlock } from "@/components/documents/command-block";
import { DocumentNotice } from "@/components/documents/document-notice";
import type { DocumentChapters } from "@/content/documents";
import { canonicalUrl, sitePath } from "@/lib/site";

/** 官网命令来自当前工程，业务部署只描述准备事项，不发布未实现的命令。 */
export const deploymentChapters = [
  {
    id: "three-projects", title: "三个工程各自负责什么", sections: [
      { id: "project-responsibilities", title: "分别构建，分别部署", content: <>
        <dl className="document-definitions">
          <div><dt>官网 <code>website/</code></dt><dd>产品介绍、使用说明与部署说明。纯静态页面，不调用业务接口，可独立运行。</dd></div>
          <div><dt>评审前端 <code>frontend/</code></dt><dd>电脑端团队、项目、原型管理及节点批注交互，需要连接业务后端。</dd></div>
          <div><dt>后端 <code>backend/</code></dt><dd>账号、团队隔离、权限、业务记录、修改历史与文件保存，使用独立的服务进程。</dd></div>
        </dl>
        <p>当前交付范围是官网。评审前端与后端仍在建设中，不能仅部署官网就获得原型上传、登录或批注保存能力。</p>
      </> },
    ],
  },
  {
    id: "deploy-website", title: "部署官网", sections: [
      { id: "website-environment", title: "准备环境与工程", content: <>
        <p>以下命令都在已取得的官网工程 <code>website/</code> 目录执行。官网源码仓库已公开，评审前端与后端保持私有；整体开源许可证尚未确定。</p>
        <p>构建环境固定为 <code>Node.js 24.14.0</code> 与 <code>npm 11.9.0</code>。界面采用 <code>React</code> 与 <code>shadcn/ui</code>，由 <code>React Router</code> 在构建期生成完整静态页面，依赖版本由锁文件固定。</p>
        <CommandBlock title="安装固定依赖" command="npm ci" />
        <p>需要修改页面时可以启动本地开发服务，地址为 <code>http://127.0.0.1:5173/prototype-review-website/</code>。端口占用会明确报错，不自动换端口。</p>
        <CommandBlock title="启动官网开发服务" command="npm run dev" />
      </> },
      { id: "website-build", title: "顺序构建与本地查看", content: <>
        <p>类型编译与构建按顺序执行，两者都会生成框架文件，不要并行运行。类型编译成功后再执行构建；构建结果不能代替浏览器交互或性能检查。</p>
        <CommandBlock title="类型编译" command="npm run typecheck" />
        <CommandBlock title="生成静态页面" command="npm run build" />
        <p>构建完成后，使用本地静态服务查看整理后的发布产物，访问 <code>http://127.0.0.1:4173/prototype-review-website/</code>。该进程只用于本机查看。</p>
        <CommandBlock title="查看静态产物" command="npm run preview" />
      </> },
      { id: "website-output-and-publishing", title: "发布目录与仓库子路径", content: <>
        <p>最终只发布 <code>build/pages/</code>。首页、使用说明、部署说明分别生成完整页面，说明页可以直接访问和刷新；不存在地址由独立的 <code>404.html</code> 承接，不把所有地址重写到首页。</p>
        <div className="document-file-tree" aria-label="官网发布目录"><pre><code>{"build/pages/\n  index.html\n  guide/index.html\n  deployment/index.html\n  404.html\n  assets/\n  favicon.svg"}</code></pre></div>
        <p>站点配置集中在 <code>site.config.ts</code>，当前仓库子路径为 <code>/prototype-review-website/</code>。页面、资源、导航和规范地址共用该前缀，不能只修改链接或资源中的一部分。</p>
        <p>工程提供 <code>.github/workflows/pages.yml</code>，通过仓库的静态发布任务部署到 <code>GitHub Pages</code>。官网仓库公开，站点来源已设置为自动化发布，访问地址以成功部署后的任务结果为准。</p>
        <p>配置进入远程仓库后，推送到 <code>codex/initial-setup</code> 分支会在构建成功后发布；也可以从仓库的自动化任务入口选择该分支手动运行。指向该分支的合并请求只编译构建，不上传发布产物或部署站点；实际部署不会取消正在进行的部署。</p>
        <DocumentNotice title="官网访问地址"><p>官网已发布，可访问<a href={canonicalUrl()}>原型评审台官网</a>。站点只包含官网静态产物，不包含同级文档、评审前端、后端或本机配置；评审应用仍在建设中。</p></DocumentNotice>
      </> },
    ],
  },
  {
    id: "review-service-preparation", title: "评审服务部署准备", sections: [
      { id: "service-prerequisites", title: "准备可访问的业务环境", content: <>
        <ul>
          <li>为评审前端和后端准备团队可访问的部署地址。</li>
          <li>准备达梦数据库及本项目使用的结构化数据存储空间。</li>
          <li>为后端准备专用磁盘目录，保存原型资源、批注图片与附件。</li>
          <li>确保后端能够连接数据库并读写专用文件目录。</li>
        </ul>
        <p>局域网多人访问需要成员与分享接收者能够连到业务服务。官网是独立静态站点，不能代替后端，也不会探测业务服务是否可用。</p>
      </> },
      { id: "business-startup-pending", title: "业务启动步骤待交付", content: <>
        <DocumentNotice title="准备说明，尚非业务部署教程"><p>评审前端与后端的依赖环境、配置项、启动及更新命令，将在对应工程完成后提供。当前不提供虚构启动命令或一键部署包。</p></DocumentNotice>
      </> },
    ],
  },
  {
    id: "database-preparation", title: "数据库准备", sections: [
      { id: "manual-schema-setup", title: "手动执行本项目建表脚本", content: <>
        <p>本项目新建表统一采用 <code>hjl_</code> 前缀。部署维护者审阅后手动执行脚本，后端启动不自动建表，也不迁移或修改同库其他项目的对象。</p>
        <p>建表脚本尚未交付，因此这里没有下载入口或可执行的建表语句。后续脚本与实际字段说明会随后端工程一起提供。</p>
      </> },
      { id: "structured-data-only", title: "数据库保存记录与文件引用", content: <>
        <p>达梦保存账号、团队、项目、原型版本、批注与历史等结构化记录，以及文件的路径与引用关系。原型网页、图片、样式、脚本和批注附件保存在后端专用目录，不把文件内容写入数据库。</p>
      </> },
    ],
  },
  {
    id: "configuration-and-files", title: "配置与文件", sections: [
      { id: "configuration-categories", title: "区分公开配置与本机配置", content: <>
        <dl className="document-definitions">
          <div><dt>官网公开配置</dt><dd>站点来源、仓库子路径、应用建设状态、源码公开状态；应用上线后才填写已确认的真实入口。</dd></div>
          <div><dt>评审前端配置</dt><dd>业务服务访问地址及运行所需的公开参数，具体字段待对应工程确认。</dd></div>
          <div><dt>后端本机配置</dt><dd>数据库连接、数据库账号、数据库密码与专用文件目录，具体配置方式随后端交付。</dd></div>
        </dl>
        <p>真实连接信息和密码只保存在后端被忽略的本机配置中，不提交到仓库，不写入官网页面、构建产物或日志。本页不提供真实连接参数，也不把尚未实现的字段示例当作可运行配置。</p>
      </> },
      { id: "file-retention", title: "文件目录与保留规则", content: <>
        <p>原型按版本保存资源。批注文件选中即临时上传，保存批注后建立正式引用；正文移除某个文件时，历史仍引用的文件继续保留。</p>
        <p>从未被成功保存引用的临时文件，上传满二十四小时后每小时扫描清理。删除批注或上级对象时清理相应范围，清理不能影响其他团队或其他项目的文件。</p>
      </> },
    ],
  },
  {
    id: "access-and-sharing", title: "访问与分享", sections: [
      { id: "reach-the-business-service", title: "分享地址需要能够连通", content: <>
        <p>持有链接只授予对应版本的阅读入口，不改变网络访问条件。部署在局域网的评审服务，需要接收者能够访问该局域网地址；公开发布官网不表示业务服务也已公开。</p>
        <p>匿名接收者阅读当前批注；有团队权限的成员登录后再按权限编辑。团队邀请与原型分享是两个独立入口，分享链接不能直接添加团队成员。</p>
        <p>完整的链接有效规则和编辑边界见<a href={`${sitePath("guide/")}#sharing-and-editing`}>使用说明中的分享章节</a>。</p>
      </> },
    ],
  },
  {
    id: "maintenance-and-updates", title: "运维与更新", sections: [
      { id: "keep-records-and-files-together", title: "同时维护数据库与文件", content: <>
        <p>数据库中的路径、引用与磁盘文件需要保持一致。后续备份、迁移和恢复方案必须同时覆盖结构化数据与专用文件目录，不能只复制数据库或只复制原型文件。</p>
        <p>原型及批注资源没有固定容量限额，应按实际使用量准备磁盘空间。资源不足要明确处理失败，不能通过截断、跳过文件或清除旧内容继续提交。</p>
      </> },
      { id: "update-instructions-pending", title: "后续按实际工程补充", content: <>
        <p>官网内容修改后需要重新构建发布。业务应用的版本升级、备份、恢复、维护者重置密码和故障处理步骤，将在后端及接口联调完成后提供，当前不编造管理命令。</p>
      </> },
    ],
  },
] as const satisfies DocumentChapters;
