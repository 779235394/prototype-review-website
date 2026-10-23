import { ArrowRightIcon, FolderIcon, HistoryIcon, LinkIcon, MinusIcon, MousePointer2Icon, PaperclipIcon, PlusIcon, UsersIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { homeFeatures, homeQuestions, homeWorkflow } from "@/content/home";
import { siteConfig, sitePath } from "@/lib/site";

const featureIcons = {
  organization: FolderIcon,
  selection: MousePointer2Icon,
  history: HistoryIcon,
  attachments: PaperclipIcon,
  sharing: LinkIcon,
  teams: UsersIcon,
};

/** 每项功能使用短文案与线性图标，按已确认图稿排列为两列场景说明。 */
export function HomeFeatures() {
  /** 将内容稿中的一项计划能力转换为语义完整的说明条目。 */
  function renderFeature(feature: (typeof homeFeatures)[number]) {
    const Icon = featureIcons[feature.id];
    return (
      <li key={feature.id} className="home-feature-item">
        <Icon className="home-feature-icon" aria-hidden="true" />
        <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
      </li>
    );
  }
  return (
    <section id="features" tabIndex={-1} className="site-container home-features" aria-labelledby="features-title">
      <h2 id="features-title" className="home-section-heading">从原型到批注，<br />让上下文始终在一起。</h2>
      <ul className="home-feature-grid">{homeFeatures.map(renderFeature)}</ul>
    </section>
  );
}

/** 四步流程按真实先后顺序介绍评审应用，官网本身不执行这些业务操作。 */
export function HomeWorkflow() {
  /** 为有序流程提供明确的步骤、标题与说明。 */
  function renderStep(step: (typeof homeWorkflow)[number]) {
    return (
      <li className="home-workflow-step" key={step.id}>
        <span className="home-step-number" aria-hidden="true">{step.number}</span>
        <h3>{step.title}</h3><p>{step.description}</p>
      </li>
    );
  }
  return (
    <section id="workflow" tabIndex={-1} className="home-workflow" aria-labelledby="workflow-title">
      <div className="site-container">
        <h2 id="workflow-title" className="home-section-heading">围绕一个版本，完成一次清楚的沟通。</h2>
        <ol className="home-workflow-list">{homeWorkflow.map(renderStep)}</ol>
        <a className="home-text-link" href={sitePath("guide/")}>了解完整使用方式<ArrowRightIcon className="size-4" aria-hidden="true" /></a>
      </div>
    </section>
  );
}

/** 保留全部已确认问题，默认展开建设状态，其余使用单项可收起的基础折叠组件。 */
export function HomeQuestions() {
  /** 问答始终来自仓库内静态内容，不远程获取或拼接答案。 */
  function renderQuestion(item: (typeof homeQuestions)[number]) {
    return (
      <AccordionItem key={item.id} value={item.id} className="home-question-item">
        <AccordionTrigger className="home-question-trigger">
          <span>{item.question}</span>
          <span className="home-question-indicator" aria-hidden="true"><PlusIcon className="home-question-plus" /><MinusIcon className="home-question-minus" /></span>
        </AccordionTrigger>
        <AccordionContent className="home-question-answer h-auto"><p>{item.answer}</p></AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <section id="questions" className="site-container home-questions" aria-labelledby="questions-title">
      <div className="home-questions-intro">
        <h2 id="questions-title" className="home-section-heading">常见问题</h2>
        <p>从原型准备到分享，<br />先了解使用边界。</p>
      </div>
      <Accordion type="single" defaultValue="availability" collapsible className="home-questions-list">
        {homeQuestions.map(renderQuestion)}
      </Accordion>
    </section>
  );
}

/** 页尾提供有效的阅读入口，建设状态不伪装成可进入的评审应用。 */
export function HomeClosing() {
  return (
    <section className="site-container home-closing" aria-labelledby="closing-title">
      <div className="home-closing-panel">
        <div>
          <h2 id="closing-title" className="home-section-heading">先了解评审方式，<br />再准备团队的使用环境。</h2>
          <p>查看使用说明，了解项目、原型、批注与分享的关系；部署说明将随着实际工程交付更新。</p>
        </div>
        <div className="home-closing-actions">
          <Button asChild size="lg"><a href={sitePath("guide/")}>查看使用说明</a></Button>
          <Button asChild variant="outline" size="lg"><a href={sitePath("deployment/")}>查看部署说明</a></Button>
          {siteConfig.application.state === "building" && <p className="application-status">评审应用建设中</p>}
          {siteConfig.application.state === "available" && siteConfig.application.url !== null && <a className="home-text-link" href={siteConfig.application.url}>进入评审应用<ArrowRightIcon className="size-4" aria-hidden="true" /></a>}
        </div>
      </div>
    </section>
  );
}
