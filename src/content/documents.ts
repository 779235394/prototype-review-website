import type { ReactNode } from "react";

export interface DocumentSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface DocumentChapter {
  id: string;
  title: string;
  sections: readonly [DocumentSection, ...DocumentSection[]];
}

/** 两类说明都必须有明确章节，目录与正文共同读取这份静态内容。 */
export type DocumentChapters = readonly [DocumentChapter, ...DocumentChapter[]];
