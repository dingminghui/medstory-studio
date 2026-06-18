"use client";

import { useState } from "react";
import {
  BasicBlocksPlugin,
  BasicMarksPlugin,
} from "@platejs/basic-nodes/react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";

import { Input } from "@/components/ui/input";
import type { DocumentContent } from "@/lib/document-model";

type ArticleEditorProps = {
  title: string;
  value: DocumentContent;
};

export function ArticleEditor({ title, value }: ArticleEditorProps) {
  const [draftTitle, setDraftTitle] = useState(title);
  const editor = usePlateEditor(
    {
      plugins: [BasicBlocksPlugin, BasicMarksPlugin],
      value,
    },
    [value],
  );

  return (
    <section className="size-full">
      <div className="bg-card text-card-foreground mx-auto w-full max-w-4xl px-2">
        <Input
          aria-label="标题"
          className="my-3 h-auto rounded-none border-0 p-0 text-xl! font-semibold shadow-none focus-visible:ring-0"
          onChange={(event) => {
            setDraftTitle(event.target.value);
          }}
          placeholder="未命名"
          value={draftTitle}
        />
        <Plate editor={editor}>
          <PlateContent
            className="placeholder:text-muted-foreground min-h-140 text-base leading-7 outline-none focus-visible:outline-none"
            placeholder="开始写作..."
          />
        </Plate>
      </div>
    </section>
  );
}
