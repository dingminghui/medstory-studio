"use client";

import { AI_PREVIEW_KEY } from "@platejs/ai";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { getTransientSuggestionKey } from "@platejs/suggestion";
import { SuggestionPlugin } from "@platejs/suggestion/react";
import { KEYS, type RenderLeafProps } from "platejs";
import {
  Plate,
  PlateContent,
  useEditorRef,
  usePlateEditor,
} from "platejs/react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArticleEditorAIChatPlugin,
  ArticleEditorAIPlugin,
} from "@/components/article-editor-ai";
import {
  ArticleEditorFloatingToolbar,
  ArticleEditorToolbar,
} from "@/components/article-editor-toolbar";
import { ArticleEditorPaperReferencePlugin } from "@/components/article-editor-paper-reference";
import { Input } from "@/components/ui/input";
import { ArticleEditorCorePlugins } from "@/lib/article-editor-kit";
import type { DocumentContent } from "@/lib/document-model";
import { normalizeDocumentContent } from "@/lib/document-model";
import { useUpdateDocument } from "@/hooks/use-update-document";
import { cn } from "@/lib/utils";
import { createPlatePlugin } from "platejs/react";

type ArticleEditorProps = {
  documentId: string;
  title: string;
  value: DocumentContent;
};

const transientSuggestionKey = getTransientSuggestionKey();

function hasSuggestionType(value: unknown): value is { type?: string } {
  return !!value && typeof value === "object" && "type" in value;
}

function ArticleEditorLeaf({ attributes, children, leaf }: RenderLeafProps) {
  const editor = useEditorRef();
  const suggestionApi = editor.getApi(SuggestionPlugin).suggestion;
  const leafRecord = leaf as Record<string, unknown>;
  const suggestionData = suggestionApi.suggestionData(
    leaf as Parameters<typeof suggestionApi.suggestionData>[0],
  );
  const suggestionType = hasSuggestionType(suggestionData)
    ? suggestionData.type
    : null;
  const isSuggestionSpan = !!leafRecord[KEYS.suggestion];

  return (
    <span
      {...attributes}
      className={cn(
        attributes.className,
        isSuggestionSpan &&
          suggestionType !== "remove" &&
          "rounded bg-emerald-100/85 px-0.5 ring-1 ring-emerald-200/80 selection:bg-emerald-200/95 dark:bg-emerald-500/20 dark:ring-emerald-400/25 dark:selection:bg-emerald-400/35",
        isSuggestionSpan &&
          suggestionType === "remove" &&
          "rounded bg-rose-100/85 px-0.5 text-foreground/75 line-through decoration-rose-500 decoration-2 selection:bg-rose-200/95 dark:bg-rose-500/20 dark:selection:bg-rose-400/35",
      )}
      data-suggestion-leaf={
        isSuggestionSpan ? (suggestionType ?? "") : undefined
      }
    >
      {children}
    </span>
  );
}

function hasPendingAIState(value: DocumentContent): boolean {
  const visit = (node: Record<string, unknown>): boolean => {
    if (node[AI_PREVIEW_KEY] || node[KEYS.ai] || node[transientSuggestionKey]) {
      return true;
    }

    if (!Array.isArray(node.children)) {
      return false;
    }

    return node.children.some(
      (child) => typeof child === "object" && child !== null && visit(child),
    );
  };

  return value.some((node) => visit(node));
}

export function ArticleEditor({
  documentId,
  title,
  value,
}: ArticleEditorProps) {
  const normalizedValue = useMemo(
    () => normalizeDocumentContent(value),
    [value],
  );
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftContent, setDraftContent] = useState(normalizedValue);
  const lastSavedSnapshotRef = useRef(
    JSON.stringify({
      content: value,
      title,
    }),
  );
  const { mutate: updateDocument } = useUpdateDocument(documentId);
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
      plugins: [
        ...ArticleEditorCorePlugins,
        BlockSelectionPlugin,
        SuggestionPlugin,
        ArticleEditorAIPlugin,
        ArticleEditorAIChatPlugin,
        ArticleEditorPaperReferencePlugin,
        floatingToolbarPlugin,
      ],
      value: normalizedValue,
    },
    [floatingToolbarPlugin, normalizedValue],
  );

  const draftSnapshot = useMemo(
    () =>
      JSON.stringify({
        content: draftContent,
        title: draftTitle,
      }),
    [draftContent, draftTitle],
  );

  useEffect(() => {
    if (draftSnapshot === lastSavedSnapshotRef.current) {
      return;
    }

    if (hasPendingAIState(draftContent)) {
      return;
    }

    const timer = window.setTimeout(() => {
      updateDocument(
        {
          content: draftContent,
          title: draftTitle,
        },
        {
          onSuccess: (_document, variables) => {
            lastSavedSnapshotRef.current = JSON.stringify(variables);
          },
        },
      );
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draftContent, draftSnapshot, draftTitle, updateDocument]);

  return (
    <section className="size-full bg-background">
      <Plate
        editor={editor}
        onValueChange={({ value: nextValue }) => {
          setDraftContent(nextValue as DocumentContent);
        }}
      >
        <ArticleEditorToolbar />
        <div className="mx-auto w-full max-w-4xl px-2 pt-16 pb-24 text-foreground md:px-10 md:pt-6">
          <Input
            aria-label="标题"
            className="mb-3 h-auto rounded-none border-0 border-b! border-b-foreground/5 px-0 pb-4 leading-tight font-semibold shadow-none placeholder:text-muted-foreground focus-visible:ring-0 md:mb-5 md:text-3xl!"
            onChange={(event) => {
              setDraftTitle(event.target.value);
            }}
            placeholder="未命名"
            value={draftTitle}
          />
          <PlateContent
            className="min-h-140 text-base leading-7 outline-none placeholder:text-muted-foreground focus-visible:outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:leading-tight [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:leading-snug [&_h3]:font-semibold [&_p]:my-2"
            placeholder="开始写作..."
            renderLeaf={(props) => <ArticleEditorLeaf {...props} />}
          />
        </div>
      </Plate>
    </section>
  );
}
