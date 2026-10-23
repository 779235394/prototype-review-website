import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowRightIcon, ChevronDownIcon, ListIcon } from "lucide-react";
import { DocumentNotice } from "@/components/documents/document-notice";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { DocumentChapter, DocumentChapters, DocumentSection } from "@/content/documents";
import { documentNavigationItems } from "@/content/navigation";
import { sitePath } from "@/lib/site";
import { cn } from "@/lib/utils";

interface DocumentLayoutProps {
  page: "guide" | "deployment";
  title: string;
  description: string;
  summary: string;
  chapters: DocumentChapters;
}

/** 两类静态说明共用阅读宽度与目录，小屏使用可展开入口。 */
export function DocumentLayout({ page, title, description, summary, chapters }: DocumentLayoutProps) {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [activeSectionId, setActiveSectionId] = useState(chapters[0].sections[0].id);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const chapterFocusFrame = useRef<number | null>(null);
  /** 阅读状态必须对应真实章节，错误状态不替换成其他内容。 */
  function matchesActiveChapter(chapter: DocumentChapter) {
    return chapter.id === activeChapterId;
  }
  const currentChapter = chapters.find(matchesActiveChapter);
  if (!currentChapter) {
    throw new Error("当前说明章节不存在。");
  }

  /** 按正文顺序和吸顶导航留白确定阅读位置，不改写地址或触发自动滚动。 */
  useEffect(() => {
    const headings: { element: HTMLElement; chapterId: string; sectionId: string }[] = [];
    for (const chapter of chapters) {
      const chapterHeading = document.getElementById(chapter.id);
      if (!chapterHeading) {
        throw new Error("说明章节缺少对应正文标题。");
      }
      headings.push({ element: chapterHeading, chapterId: chapter.id, sectionId: chapter.sections[0].id });
      for (const section of chapter.sections) {
        const sectionHeading = document.getElementById(section.id);
        if (!sectionHeading) {
          throw new Error("说明小节缺少对应正文标题。");
        }
        headings.push({ element: sectionHeading, chapterId: chapter.id, sectionId: section.id });
      }
    }
    let frameId: number | null = null;

    /** 滚动时仅更新目录状态，章节始终来自当前静态正文。 */
    function updateReadingPosition() {
      frameId = null;
      let selected = headings[0];
      for (const heading of headings) {
        if (heading.element.getBoundingClientRect().top <= 144) {
          selected = heading;
        }
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        selected = headings[headings.length - 1];
      }
      setActiveChapterId(selected.chapterId);
      setActiveSectionId(selected.sectionId);
    }

    /** 同一帧合并滚动、缩放和锚点变化造成的位置读取。 */
    function requestReadingUpdate() {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateReadingPosition);
      }
    }

    requestReadingUpdate();
    window.addEventListener("scroll", requestReadingUpdate, { passive: true });
    window.addEventListener("resize", requestReadingUpdate);
    window.addEventListener("hashchange", requestReadingUpdate);

    /** 页面卸载时移除监听，避免留下重复目录更新。 */
    function stopReadingUpdates() {
      window.removeEventListener("scroll", requestReadingUpdate);
      window.removeEventListener("resize", requestReadingUpdate);
      window.removeEventListener("hashchange", requestReadingUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (chapterFocusFrame.current !== null) {
        window.cancelAnimationFrame(chapterFocusFrame.current);
      }
    }
    return stopReadingUpdates;
  }, [chapters]);

  /** 展开目录中的链接仍使用浏览器原生锚点，选择后收起手机目录。 */
  /** 展开目录收起后定位并聚焦真实标题，修饰键打开新页面时保留原生操作。 */
  function closeMobileNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const targetId = event.currentTarget.hash.slice(1);
    setMobileNavigationOpen(false);
    if (chapterFocusFrame.current !== null) {
      window.cancelAnimationFrame(chapterFocusFrame.current);
    }
    /** 等折叠布局更新后交接阅读焦点，地址锚点仍由浏览器维护。 */
    chapterFocusFrame.current = window.requestAnimationFrame(function focusSelectedChapter() {
      chapterFocusFrame.current = null;
      const heading = document.getElementById(targetId);
      if (heading === null) {
        throw new Error("[原型评审台官网] 目录选择的章节标题不存在。");
      }
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: "start" });
    });
  }

  /** 用同一套章节链接服务电脑目录与展开目录，当前章有文字与背景区别。 */
  function renderChapterLink(chapter: DocumentChapter) {
    let current: "location" | undefined;
    if (chapter.id === activeChapterId) {
      current = "location";
    }
    return (
      <a key={chapter.id} href={`#${chapter.id}`} aria-current={current} onClick={closeMobileNavigation} className="document-chapter-link">
        {chapter.title}
      </a>
    );
  }

  /** 输出带当前页语义的说明入口，不查询远程目录。 */
  function renderDocumentLink(item: (typeof documentNavigationItems)[number]) {
    let current: "page" | undefined;
    if (item.page === page) {
      current = "page";
    }
    return (
      <div key={item.path}>
        <a href={sitePath(item.path)} aria-current={current} className={cn("document-page-link", current === "page" && "text-foreground font-semibold")}>
          {item.label}
        </a>
        {current === "page" && <div className="document-chapter-links">{chapters.map(renderChapterLink)}</div>}
      </div>
    );
  }

  /** 本节内容仅列当前章节的小节，阅读高亮与正文标题共用稳定标识。 */
  function renderSectionLink(section: DocumentSection) {
    let current: "location" | undefined;
    if (section.id === activeSectionId) {
      current = "location";
    }
    return <a key={section.id} href={`#${section.id}`} aria-current={current} className="document-section-link">{section.title}</a>;
  }

  /** 小节使用三级标题，正文来自本工程静态内容，不执行远程内容加载。 */
  function renderSection(section: DocumentSection) {
    return <section key={section.id} aria-labelledby={section.id}><h3 id={section.id} tabIndex={-1}>{section.title}</h3>{section.content}</section>;
  }

  /** 每章保留独立定位点，连续阅读不依赖额外路由或运行时服务器。 */
  function renderChapter(chapter: DocumentChapter) {
    return <section key={chapter.id} className="document-chapter" aria-labelledby={chapter.id}><h2 id={chapter.id} tabIndex={-1}>{chapter.title}</h2>{chapter.sections.map(renderSection)}</section>;
  }

  let nextPath = "deployment/";
  let nextTitle = "部署说明";
  let nextDescription = "了解官网构建与评审服务准备";
  if (page === "deployment") {
    nextPath = "guide/";
    nextTitle = "使用说明";
    nextDescription = "回到产品规则与使用边界";
  }

  return (
    <main id="main-content" tabIndex={-1} className="site-container document-layout grow">
      <aside className="document-desktop-navigation" aria-label="说明导航">
        <nav className="document-navigation" aria-label="电脑章节目录">{documentNavigationItems.map(renderDocumentLink)}</nav>
      </aside>
      <article className="document-content min-w-0">
        <Collapsible className="document-mobile-navigation" open={mobileNavigationOpen} onOpenChange={setMobileNavigationOpen}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between">
              <span className="flex min-w-0 items-center gap-2"><ListIcon className="size-4 shrink-0" aria-hidden="true" /><span className="truncate">说明目录 · {currentChapter.title}</span></span><ChevronDownIcon className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav aria-label="展开章节目录" className="document-expanded-navigation">{documentNavigationItems.map(renderDocumentLink)}</nav>
          </CollapsibleContent>
        </Collapsible>
        <p className="document-eyebrow">原型评审台 / {title}</p>
        <DocumentNotice title="评审应用建设中"><p>{description}</p></DocumentNotice>
        <h1>{title}</h1>
        <p className="document-intro">{summary}</p>
        {chapters.map(renderChapter)}
        <Separator className="document-ending-separator" />
        <nav aria-label="继续阅读" className="document-next-page">
          <span>{nextDescription}</span>
          <a href={sitePath(nextPath)}>{nextTitle}<ArrowRightIcon className="size-4" aria-hidden="true" /></a>
        </nav>
      </article>
      <aside className="document-page-contents" aria-label="本节内容">
        <p>本节内容</p>
        <span className="document-contents-chapter">{currentChapter.title}</span>
        <nav aria-label="当前章节小节">{currentChapter.sections.map(renderSectionLink)}</nav>
      </aside>
    </main>
  );
}
