import { useId, useRef, useState } from "react";
import { ChevronDownIcon, Maximize2Icon, PaperclipIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prototypeExample } from "@/content/home";
import { cn } from "@/lib/utils";

/** 说明旧修订只读，人员色只用于头像和边线，不降低历史正文可读性。 */
function HistoricalRevision() {
  const revision = prototypeExample.history;
  return (
    <div className="demo-history-record">
      <div className="demo-author demo-history-author">
        <span className="demo-avatar" aria-hidden="true">{revision.avatar}</span>
        <span>{revision.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={revision.dateTime}>{revision.time}</time>
      </div>
      <p className="demo-revision-label">历史 · 只读</p>
      <p className="demo-annotation-text">{revision.text}</p>
    </div>
  );
}

/** 在官网内展示同一预置样例；编号与页签只控制阅读，不创建评审业务数据。 */
function PrototypeExample({ expanded = false }: { expanded?: boolean }) {
  const [revision, setRevision] = useState("current");
  const annotationId = useId();
  const annotationHeading = useRef<HTMLHeadingElement>(null);

  /** 点击示例编号后显示当前内容，将阅读焦点交给对应的批注标题。 */
  function showCurrentAnnotation() {
    setRevision("current");
    annotationHeading.current?.focus({ preventScroll: true });
  }

  /** 只在已声明的两类静态修订之间切换，不修改任何正文。 */
  function selectRevision(value: string) {
    if (value !== "current" && value !== "history") {
      throw new Error("[原型评审台官网] 示例修订不在约定范围内。");
    }
    setRevision(value);
  }

  /** 输出原型自身的虚构订单，订单状态不代表批注处理状态。 */
  function renderExampleOrder(order: (typeof prototypeExample.orders)[number]) {
    return (
      <tr key={order.name}>
        <td>{order.name}</td><td>{order.customer}</td><td>{order.status}</td>
      </tr>
    );
  }

  return (
    <div className={cn("prototype-demo", expanded && "demo-expanded")}>
      <div className="demo-toolbar">
        <p className="demo-project-path">{prototypeExample.project}<span aria-hidden="true"> / </span>{prototypeExample.prototype}<span aria-hidden="true"> / </span>{prototypeExample.version}</p>
        <p className="demo-mobile-project">订单模块</p>
      </div>
      <div className="demo-body">
        <aside className="demo-sidebar" aria-label="按上传人组织的原型">
          <p className="demo-sidebar-label">上传人</p>
          <p className="demo-uploader">林可</p>
          <p className="demo-selected-prototype">订单模块</p>
          <p className="demo-version">第一版</p>
          <p className="demo-uploader demo-second-uploader">周宁</p>
          <p className="demo-other-prototype">商品模块</p>
          <p className="demo-sidebar-note">独立原型，各自迭代</p>
        </aside>
        <section className="demo-prototype" aria-label="订单列表原型">
          <div className="demo-page-heading">
            <h2>{prototypeExample.page}</h2>
            <p>查看订单与筛选条件</p>
          </div>
          <div className="demo-node-selection">
            <Button type="button" variant="ghost" className="demo-marker" aria-label="查看编号三的批注" aria-controls={annotationId} onClick={showCurrentAnnotation}>
              <span aria-hidden="true">{prototypeExample.number}</span>
            </Button>
            <div className="demo-filter-fields">
              <div className="demo-filter-field">
                <p>订单状态</p>
                <div className="demo-field-value">全部状态<ChevronDownIcon className="size-4" aria-hidden="true" /></div>
              </div>
              <div className="demo-filter-field demo-date-field">
                <p>下单时间</p>
                <div className="demo-field-value demo-field-placeholder">选择时间范围</div>
              </div>
            </div>
            <p className="demo-node-hint">点击编号，查看这一区域的批注</p>
          </div>
          <table className="demo-order-table">
            <caption className="sr-only">原型中的虚构订单</caption>
            <thead><tr><th scope="col">订单编号</th><th scope="col">客户</th><th scope="col">订单状态</th></tr></thead>
            <tbody>{prototypeExample.orders.map(renderExampleOrder)}</tbody>
          </table>
        </section>
        <section id={annotationId} className="demo-annotation" aria-label="节点批注与修改历史">
          <h2 className="demo-annotation-heading" ref={annotationHeading} tabIndex={-1}>批注 {prototypeExample.number}</h2>
          <Tabs value={revision} onValueChange={selectRevision} className="demo-revision-tabs">
            <TabsList className="demo-revision-tab-list" aria-label="查看批注修订">
              <TabsTrigger className="demo-revision-tab" value="current">当前批注</TabsTrigger>
              <TabsTrigger className="demo-revision-tab" value="history">修改历史</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="demo-revision-panel">
              <div className="demo-revision-meta">
                <Badge className="demo-current-badge" variant="secondary">当前有效</Badge>
                <div className="demo-author demo-current-author">
                  <span className="demo-avatar" aria-hidden="true">{prototypeExample.current.avatar}</span>
                  <span>{prototypeExample.current.author}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={prototypeExample.current.dateTime}>{prototypeExample.current.time}</time>
                </div>
              </div>
              <p className="demo-annotation-text">{prototypeExample.current.text}</p>
              <div className="demo-attachment"><PaperclipIcon className="size-4" aria-hidden="true" /><span>筛选说明</span></div>
              <div className="demo-history-preview">
                <h3>修改历史</h3>
                <HistoricalRevision />
              </div>
            </TabsContent>
            <TabsContent value="history" className="demo-revision-panel">
              <p className="demo-history-intro">历史内容只读，旧修订不会覆盖当前有效内容。</p>
              <HistoricalRevision />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}

/** 以可读页面结构展示评审示意，并用基础对话框提供完整界面放大阅读。 */
export function PrototypeDemo() {
  return (
    <figure className="home-product-figure" aria-labelledby="product-demo-caption">
      <PrototypeExample />
      <figcaption id="product-demo-caption" className="home-product-caption">
        <div>
          <p>同一个编号，连接具体区域、当前内容和每次修改。</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" className="demo-expand-button"><Maximize2Icon className="size-4" aria-hidden="true" />放大查看</Button>
          </DialogTrigger>
          <DialogContent className="home-demo-dialog">
            <DialogHeader className="pr-12">
              <DialogTitle>评审界面</DialogTitle>
              <DialogDescription>同一个编号连接页面区域、当前批注与只读历史。</DialogDescription>
            </DialogHeader>
            <div className="home-demo-dialog-scroll" role="region" aria-label="完整评审界面，可在区域内滚动查看" tabIndex={0}>
              <PrototypeExample expanded />
            </div>
          </DialogContent>
        </Dialog>
      </figcaption>
    </figure>
  );
}
