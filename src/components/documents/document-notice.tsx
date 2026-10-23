import type { ReactNode } from "react";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentNoticeProps {
  title: string;
  children: ReactNode;
}

/** 静态提示说明功能边界，不把初始阅读内容作为即时警报播报。 */
export function DocumentNotice({ title, children }: DocumentNoticeProps) {
  return (
    <Alert role="note" className="document-notice">
      <InfoIcon aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
