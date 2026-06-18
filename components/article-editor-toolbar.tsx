"use client";

import type { ReactNode } from "react";
import {
  AtSignIcon,
  BoldIcon,
  ChevronsUpDownIcon,
  ItalicIcon,
  PilcrowIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorState } from "platejs/react";

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
  label: string;
  onPress?: () => void;
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

function getActiveBlockType(type: unknown): BlockType {
  return BLOCK_TYPES.includes(type as BlockType) ? (type as BlockType) : KEYS.p;
}

export function ArticleEditorToolbar() {
  const editor = useEditorState();
  const activeMarks = editor.api.marks() ?? {};
  const selectedBlockType = getActiveBlockType(editor.api.block()?.[0]?.type);
  const isBlockquoteActive = editor.api.some({
    match: { type: KEYS.blockquote },
  });

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
    <div className="bg-background text-foreground border-border sticky top-14 z-10 border-b">
      <ScrollArea className="h-9" scrollbars="horizontal">
        <div className="flex h-9 w-max items-center gap-0.5 px-2">
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

          <BlockTypeMenu
            onValueChange={setBlockType}
            value={selectedBlockType}
          />

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
            <span className="text-foreground text-xs leading-5 font-medium">
              引用
            </span>
          </ToolbarButton>
        </div>
      </ScrollArea>
    </div>
  );
}

function BlockTypeMenu({
  onValueChange,
  value,
}: {
  onValueChange: (type: BlockType) => void;
  value: BlockType;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label="段落类型"
            className="text-foreground hover:bg-muted hover:text-foreground h-7 min-w-32 gap-2 rounded-lg border-0 bg-transparent px-1.5 text-sm font-medium"
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            size="default"
            type="button"
            variant="ghost"
          >
            <PilcrowIcon aria-hidden="true" data-icon="inline-start" />
            <span className="min-w-16 text-left">
              {BLOCK_TYPE_LABELS[value]}
            </span>
            <ChevronsUpDownIcon
              aria-hidden="true"
              className="text-muted-foreground ml-auto"
            />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-36" sideOffset={6}>
        <DropdownMenuRadioGroup
          onValueChange={(type) => {
            onValueChange(type as BlockType);
          }}
          value={value}
        >
          {Object.entries(BLOCK_TYPE_LABELS).map(([type, label]) => (
            <DropdownMenuRadioItem closeOnClick key={type} value={type}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToolbarButton({
  active = false,
  children,
  disabled = false,
  label,
  onPress,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            aria-pressed={active || undefined}
            className={cn(
              "text-foreground hover:bg-muted hover:text-foreground h-7 min-w-7 gap-1 rounded-lg border-0 bg-transparent px-1.5 text-xs leading-5 font-medium",
              active && "bg-muted text-foreground",
              disabled && "pointer-events-none opacity-40",
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
        }
      />
      <TooltipContent sideOffset={8}>{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarSeparator() {
  return (
    <Separator
      aria-hidden="true"
      className="bg-border mx-1 h-4! self-center!"
      orientation="vertical"
    />
  );
}
