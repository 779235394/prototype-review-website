import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CommandBlockProps {
  title: string;
  command: string;
}

/** 仅承载官网实际已有的命令，复制结果以剪贴板接口的真实返回为准。 */
export function CommandBlock({ title, command }: CommandBlockProps) {
  const [copyState, setCopyState] = useState<"idle" | "pending" | "success" | "error">("idle");
  let copyLabel = "复制";
  let feedback = "";
  let CopyIndicator = CopyIcon;
  if (copyState === "pending") {
    copyLabel = "复制中";
  } else if (copyState === "success") {
    copyLabel = "已复制";
    feedback = `${title}：已复制。`;
    CopyIndicator = CheckIcon;
  } else if (copyState === "error") {
    feedback = "复制未完成，请手动选择并复制命令。";
  }

  /** 安全环境下请求复制；接口不可用或拒绝时直接告知，不使用其他复制方式。 */
  async function copyCommand() {
    setCopyState("pending");
    if (!window.isSecureContext || !navigator.clipboard) {
      setCopyState("error");
      return;
    }
    try {
      await navigator.clipboard.writeText(command);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <figure className="document-command">
      <figcaption className="document-command-header">
        <span>{title}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" className="document-copy-button" disabled={copyState === "pending"} onClick={copyCommand} aria-label={`复制${title}`}>
              <CopyIndicator className="size-4" aria-hidden="true" />{copyLabel}
            </Button>
          </TooltipTrigger>
          <TooltipContent>复制此处展示的命令</TooltipContent>
        </Tooltip>
      </figcaption>
      <pre tabIndex={0} aria-label={`${title}命令`}><code>{command}</code></pre>
      <p className="document-copy-feedback" data-error={copyState === "error"} role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
    </figure>
  );
}
