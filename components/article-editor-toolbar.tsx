"use client";

import type { ReactNode } from "react";
import { AIChatPlugin } from "@platejs/ai/react";
import {
  flip,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@platejs/floating";
import type { LucideIcon } from "lucide-react";
import {
  AtSignIcon,
  BoldIcon,
  ChevronsUpDownIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  MessageCircleQuestionIcon,
  Redo2Icon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { KEYS } from "platejs";
import {
  useEditorId,
  useEditorState,
  useEventEditorValue,
} from "platejs/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  label: string;
  onPress?: () => void;
};

type ToolbarContentProps = {
  showHistory?: boolean;
};

type BlockType =
  | typeof KEYS.p
  | typeof KEYS.h1
  | typeof KEYS.h2
  | typeof KEYS.h3;
type MarkType =
  | typeof KEYS.bold
  | typeof KEYS.italic
  | typeof KEYS.underline
  | typeof KEYS.strikethrough;

const BLOCK_TYPES = [KEYS.p, KEYS.h1, KEYS.h2, KEYS.h3] as const;

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  [KEYS.p]: "文本",
  [KEYS.h1]: "标题 1",
  [KEYS.h2]: "标题 2",
  [KEYS.h3]: "标题 3",
};

const BLOCK_TYPE_ICONS: Record<BlockType, LucideIcon> = {
  [KEYS.p]: TextIcon,
  [KEYS.h1]: Heading1Icon,
  [KEYS.h2]: Heading2Icon,
  [KEYS.h3]: Heading3Icon,
};

function getActiveBlockType(type: unknown): BlockType {
  return BLOCK_TYPES.includes(type as BlockType) ? (type as BlockType) : KEYS.p;
}

export function ArticleEditorToolbar() {
  return (
    <div className="sticky top-14 z-2 border-b border-border bg-background text-foreground">
      <ScrollArea className="h-9" scrollbars="horizontal">
        <div className="flex h-9 w-max items-center gap-0.5 px-2">
          <ToolbarContent showHistory />
        </div>
      </ScrollArea>
    </div>
  );
}

export function ArticleEditorFloatingToolbar() {
  const editorId = useEditorId();
  const focusedEditorId = useEventEditorValue("focus");
  const state = useFloatingToolbarState({
    editorId,
    focusedEditorId,
    floatingOptions: {
      middleware: [offset(12), flip({ padding: 12 })],
      placement: "top",
    },
  });
  const { clickOutsideRef, hidden, props, ref } = useFloatingToolbar(state);

  if (hidden) {
    return null;
  }

  return (
    <div ref={clickOutsideRef}>
      <div
        ref={ref}
        {...props}
        className="z-50 flex h-10 items-center gap-1 rounded-xl bg-popover px-1.5 text-popover-foreground shadow-md ring-0 ring-border/70"
      >
        <ToolbarContent />
      </div>
    </div>
  );
}

function ToolbarContent({ showHistory = false }: ToolbarContentProps) {
  const editor = useEditorState();
  const activeMarks = editor.api.marks() ?? {};
  const selectedBlockType = getActiveBlockType(editor.api.block()?.[0]?.type);
  const isBlockquoteActive = editor.api.some({
    match: { type: KEYS.blockquote },
  });
  const isTextSelectionExpanded = editor.api.isExpanded();

  const hasUndo = (editor.history?.undos.length ?? 0) > 0;
  const hasRedo = (editor.history?.redos.length ?? 0) > 0;

  const isMarkActive = (mark: string) =>
    Boolean(activeMarks[mark as keyof typeof activeMarks]);

  const focusEditor = () => {
    editor.tf.focus();
  };

  const setBlockType = (type: BlockType) => {
    if (isBlockquoteActive) {
      editor.tf.toggleBlock(KEYS.blockquote, { wrap: true });
    }

    editor.tf.setNodes({ type });
    focusEditor();
  };

  const toggleMark = (mark: MarkType) => {
    editor.tf.toggleMark(mark);
    focusEditor();
  };

  return (
    <>
      {!showHistory && isTextSelectionExpanded ? (
        <>
          <ToolbarButton
            className="pr-2"
            label="问 AI"
            onPress={() => {
              editor.getApi(AIChatPlugin).aiChat.show();
            }}
          >
            <MessageCircleQuestionIcon className="text-muted-foreground" />
            <span className="text-sm leading-5 font-medium text-foreground">
              问 AI
            </span>
          </ToolbarButton>

          <ToolbarSeparator />
        </>
      ) : null}

      {showHistory && (
        <>
          <div className="flex items-center gap-0.5">
            <ToolbarButton
              disabled={!hasUndo}
              label="撤销"
              onPress={() => {
                editor.tf.undo();
                focusEditor();
              }}
            >
              <Undo2Icon />
            </ToolbarButton>
            <ToolbarButton
              disabled={!hasRedo}
              label="重做"
              onPress={() => {
                editor.tf.redo();
                focusEditor();
              }}
            >
              <Redo2Icon />
            </ToolbarButton>
          </div>

          <ToolbarSeparator />
        </>
      )}

      <BlockTypeMenu onValueChange={setBlockType} value={selectedBlockType} />

      <ToolbarSeparator />

      <div className="flex items-center gap-0.5">
        <ToolbarButton
          active={isMarkActive(KEYS.bold)}
          label="加粗"
          onPress={() => {
            toggleMark(KEYS.bold);
          }}
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(KEYS.italic)}
          label="斜体"
          onPress={() => {
            toggleMark(KEYS.italic);
          }}
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(KEYS.underline)}
          label="下划线"
          onPress={() => {
            toggleMark(KEYS.underline);
          }}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive(KEYS.strikethrough)}
          label="删除线"
          onPress={() => {
            toggleMark(KEYS.strikethrough);
          }}
        >
          <StrikethroughIcon />
        </ToolbarButton>
      </div>

      <ToolbarSeparator />

      <ToolbarButton
        active={isBlockquoteActive}
        label="引用"
        onPress={() => {
          editor.tf.toggleBlock(KEYS.blockquote, { wrap: true });
          focusEditor();
        }}
      >
        <AtSignIcon className="text-muted-foreground" />
        <span className="text-sm leading-5 font-medium text-foreground">
          引用
        </span>
      </ToolbarButton>
    </>
  );
}

function BlockTypeMenu({
  onValueChange,
  value,
}: {
  onValueChange: (type: BlockType) => void;
  value: BlockType;
}) {
  const ActiveIcon = BLOCK_TYPE_ICONS[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="段落类型"
          className="h-7 min-w-32 gap-2 rounded-lg border-0 bg-transparent px-1.5 text-sm font-medium text-foreground hover:bg-muted hover:text-foreground"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          size="default"
          type="button"
          variant="ghost"
        >
          <ActiveIcon aria-hidden="true" data-icon="inline-start" />
          <span className="min-w-16 text-left">{BLOCK_TYPE_LABELS[value]}</span>
          <ChevronsUpDownIcon
            aria-hidden="true"
            className="ml-auto text-muted-foreground"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="ignore-click-outside/toolbar w-36"
        sideOffset={6}
      >
        <DropdownMenuRadioGroup
          onValueChange={(type) => {
            onValueChange(type as BlockType);
          }}
          value={value}
        >
          {BLOCK_TYPES.map((type) => {
            const Icon = BLOCK_TYPE_ICONS[type];

            return (
              <DropdownMenuRadioItem key={type} value={type}>
                <Icon aria-hidden="true" />
                {BLOCK_TYPE_LABELS[type]}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToolbarButton({
  active = false,
  children,
  className,
  disabled = false,
  label,
  onPress,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-pressed={active || undefined}
          className={cn(
            "h-7 min-w-7 gap-1 rounded-lg border-0 bg-transparent px-1.5 text-sm leading-5 font-medium text-foreground hover:bg-muted hover:text-foreground",
            active && "bg-muted text-foreground",
            disabled && "pointer-events-none opacity-40",
            className,
          )}
          disabled={disabled}
          onClick={onPress}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          size="default"
          type="button"
          variant="ghost"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarSeparator() {
  return (
    <Separator
      aria-hidden="true"
      className="mx-1 h-4! self-center! bg-border"
      orientation="vertical"
    />
  );
}
