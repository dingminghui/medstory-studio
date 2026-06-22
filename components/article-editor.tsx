"use client";

import { useMemo, useState } from "react";
import {
  BasicBlocksPlugin,
  BasicMarksPlugin,
} from "@platejs/basic-nodes/react";
import {
  createPlatePlugin,
  Plate,
  PlateContent,
  usePlateEditor,
} from "platejs/react";

import {
  ArticleEditorFloatingToolbar,
  ArticleEditorToolbar,
} from "@/components/article-editor-toolbar";
import { Input } from "@/components/ui/input";
import type { DocumentContent } from "@/lib/document-model";

type ArticleEditorProps = {
  title: string;
  value: DocumentContent;
};

export function ArticleEditor({ title, value }: ArticleEditorProps) {
  const [draftTitle, setDraftTitle] = useState(title);
  const floatingToolbarPlugin = useMemo(
    () =>
      createPlatePlugin({
        key: "floating-toolbar",
        render: {
          afterEditable: ArticleEditorFloatingToolbar,
        },
      }),
    [],
  );
  const editor = usePlateEditor(
    {
      plugins: [BasicBlocksPlugin, BasicMarksPlugin, floatingToolbarPlugin],
      value,
    },
    [floatingToolbarPlugin, value],
  );

  return (
    <section className="bg-background size-full">
      <Plate editor={editor}>
        <ArticleEditorToolbar />
        <div className="text-foreground mx-auto w-full max-w-4xl px-2 pt-16 pb-24 md:px-10 md:pt-6">
          <Input
            aria-label="标题"
            className="placeholder:text-muted-foreground border-b-foreground/5 mb-2 h-auto rounded-none border-0 border-b! px-0 pb-4 text-2xl! leading-tight font-semibold shadow-none focus-visible:ring-0 md:mb-4"
            onChange={(event) => {
              setDraftTitle(event.target.value);
            }}
            placeholder="未命名"
            value={draftTitle}
          />
          <PlateContent
            className="placeholder:text-muted-foreground [&_blockquote]:border-border [&_blockquote]:text-muted-foreground min-h-140 text-base leading-7 outline-none focus-visible:outline-none [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-[30px] [&_h1]:leading-tight [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-[26px] [&_h2]:leading-tight [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-[22px] [&_h3]:leading-snug [&_h3]:font-semibold [&_p]:my-2"
            placeholder="开始写作..."
          />
        </div>
      </Plate>
    </section>
  );
}
