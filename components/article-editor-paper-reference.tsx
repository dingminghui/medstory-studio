"use client";

import { createPlatePlugin, PlateElement } from "platejs/react";
import type { PlateElementProps } from "platejs/react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useKnowledgeBasePanel } from "@/components/knowledge-base-panel";
import type { KnowledgeBasePaperResponse } from "@/lib/knowledge-base-model";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/date";

export const PAPER_REFERENCE_TYPE = "paper-reference";

export type PaperReferenceElement = {
  type: typeof PAPER_REFERENCE_TYPE;
  paperId: string;
  title: string;
  journal: string;
  authors: string;
  keywords: string;
  ifValue: number;
  doi: string;
  publishDate: string;
  abstract?: string;
  children: [{ text: "" }];
};

const MAX_DISPLAY_TITLE_LENGTH = 18;

function middleEllipsis(value: string, maxLength = MAX_DISPLAY_TITLE_LENGTH) {
  const characters = Array.from(value);

  if (characters.length <= maxLength) {
    return value;
  }

  const headLength = Math.ceil((maxLength - 3) / 2);
  const tailLength = Math.floor((maxLength - 3) / 2);

  return `${characters.slice(0, headLength).join("")}...${characters
    .slice(characters.length - tailLength)
    .join("")}`;
}

function isPaperReferenceElement(
  element: PlateElementProps["element"],
): element is PaperReferenceElement {
  return (
    element.type === PAPER_REFERENCE_TYPE &&
    typeof element.paperId === "string" &&
    typeof element.title === "string" &&
    typeof element.journal === "string" &&
    typeof element.authors === "string" &&
    typeof element.keywords === "string" &&
    typeof element.ifValue === "number" &&
    typeof element.doi === "string" &&
    typeof element.publishDate === "string"
  );
}

export function createPaperReferenceElement(
  paper: KnowledgeBasePaperResponse,
): PaperReferenceElement {
  return {
    type: PAPER_REFERENCE_TYPE,
    paperId: paper.id,
    title: paper.title,
    journal: paper.journal,
    authors: paper.authors,
    keywords: paper.keywords,
    ifValue: paper.ifValue,
    doi: paper.doi,
    publishDate: paper.publishDate,
    abstract: paper.abstract,
    children: [{ text: "" }],
  };
}

function createPaperResponseFromElement(
  element: PaperReferenceElement,
): KnowledgeBasePaperResponse {
  return {
    id: element.paperId,
    title: element.title,
    journal: element.journal,
    authors: element.authors,
    keywords: element.keywords,
    ifValue: element.ifValue,
    doi: element.doi,
    publishDate: element.publishDate,
    abstract: element.abstract ?? "",
  };
}

export const ArticleEditorPaperReferencePlugin = createPlatePlugin({
  key: PAPER_REFERENCE_TYPE,
  node: {
    component: PaperReferenceElement,
    isElement: true,
    isInline: true,
    isMarkableVoid: true,
    isVoid: true,
    type: PAPER_REFERENCE_TYPE,
  },
});

export function PaperReferenceElement({
  children,
  className,
  element,
  ...props
}: PlateElementProps) {
  const { previewPaper } = useKnowledgeBasePanel();

  if (!isPaperReferenceElement(element)) {
    return (
      <PlateElement
        as="span"
        className={className}
        element={element}
        {...props}
      >
        {children}
      </PlateElement>
    );
  }

  const paper = createPaperResponseFromElement(element);

  return (
    <PlateElement
      as="span"
      className={cn("inline-block max-w-50 align-baseline", className)}
      element={element}
      {...props}
    >
      <HoverCard closeDelay={120} openDelay={120}>
        <HoverCardTrigger asChild>
          <span
            className="inline max-w-50 cursor-pointer text-sm leading-5 font-medium text-blue-600 underline decoration-blue-600/35 underline-offset-2 hover:text-blue-700 hover:decoration-blue-700"
            contentEditable={false}
            onClick={() => {
              previewPaper(paper);
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            [{middleEllipsis(element.title)}]
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-80 border border-border/40 bg-white shadow-sm ring-0"
          side="top"
        >
          <div className="flex flex-col gap-1">
            <div className="line-clamp-2 text-sm leading-5 font-medium">
              {element.title}
            </div>
            <div className="text-xs leading-5 text-muted-foreground">
              {element.journal}&nbsp;·&nbsp;
              {formatDate(element.publishDate, "YYYY.MM.DD")}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      {children}
    </PlateElement>
  );
}
