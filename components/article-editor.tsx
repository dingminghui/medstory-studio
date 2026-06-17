"use client";

import {
  BasicBlocksPlugin,
  BasicMarksPlugin,
} from "@platejs/basic-nodes/react";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";

import type { DocumentContent } from "@/lib/document-model";

type ArticleEditorProps = {
  value: DocumentContent;
};

export function ArticleEditor({ value }: ArticleEditorProps) {
  const editor = usePlateEditor(
    {
      plugins: [BasicBlocksPlugin, BasicMarksPlugin],
      value,
    },
    [value],
  );

  return (
    <section className="flex flex-1 px-4 py-6 md:px-8">
      <div className="bg-card text-card-foreground mx-auto w-full max-w-4xl rounded-xl border shadow-xs">
        <Plate editor={editor}>
          <PlateContent
            className="placeholder:text-muted-foreground min-h-[560px] px-5 py-5 text-base leading-7 outline-none focus-visible:outline-none md:px-10 md:py-8"
            placeholder="开始写作..."
          />
        </Plate>
      </div>
    </section>
  );
}
