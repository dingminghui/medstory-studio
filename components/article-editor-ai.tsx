"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AIChatPlugin,
  AIPlugin,
  applyAISuggestions,
  useChatChunk,
  useEditorChat,
} from "@platejs/ai/react";
import { replacePlaceholders, withAIBatch } from "@platejs/ai";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { getTransientSuggestionKey } from "@platejs/suggestion";
import type { LucideIcon } from "lucide-react";
import {
  BotMessageSquareIcon,
  CheckIcon,
  ListPlusIcon,
  LoaderCircleIcon,
  PencilSparklesIcon,
  RotateCcwIcon,
  SpellCheck2Icon,
  XIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef, usePluginOption } from "platejs/react";

import { useArticleEditorAIChat } from "@/hooks/use-article-editor-ai-chat";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

type AnchorBox = {
  left: number;
  top: number;
};

type AskAICommand = {
  description: string;
  icon: LucideIcon;
  instruction: string;
  label: string;
  value: string;
};

type AskAIAction = {
  icon: ReactNode;
  label: string;
  onSelect: () => void;
  value: string;
};

const ASK_AI_COMMANDS: AskAICommand[] = [
  {
    description: "提高清晰度与自然度，保留原意",
    icon: PencilSparklesIcon,
    instruction:
      "请润色这段内容，让表达更清晰、更自然，但不要改变原意，也不要补充无关信息。",
    label: "润色表达",
    value: "polish-writing",
  },
  {
    description: "补足语境与细节，扩展为更完整段落",
    icon: ListPlusIcon,
    instruction:
      "请扩写这段内容，让论述更完整、衔接更自然。可以补充合理的医学写作语境，但不要编造具体数据、病例或文献结论。",
    label: "扩写内容",
    value: "expand-writing",
  },
  {
    description: "修正错别字、语法与标点问题",
    icon: SpellCheck2Icon,
    instruction: "请修正这段内容中的语法、错别字和标点问题，保持原意不变。",
    label: "修正语法",
    value: "fix-grammar",
  },
];

function buildEditPrompt(
  editor: ReturnType<typeof useEditorRef>,
  instruction: string,
) {
  return replacePlaceholders(
    editor,
    [
      "请直接改写下面选中的 Markdown 内容。",
      "除非指令明确要求，否则不要改变原意。",
      "只返回改写后的 Markdown，不要解释。",
      "",
      "要求：",
      instruction,
      "",
      "内容：",
      "{blockSelection}",
    ].join("\n"),
  );
}

function resolveAnchorBox(anchorElement: HTMLElement): AnchorBox {
  const rect = anchorElement.getBoundingClientRect();

  return {
    left: rect.left + rect.width / 2,
    top: rect.bottom,
  };
}

function ArticleEditorAILoadingBar() {
  const editor = useEditorRef();
  const chat = usePluginOption(AIChatPlugin, "chat");
  const toolName = usePluginOption(AIChatPlugin, "toolName");
  const isLoading = chat.status === "streaming" || chat.status === "submitted";

  if (!isLoading || toolName !== "edit") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-md border bg-popover px-3 py-1.5 text-sm shadow-md">
      <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />
      <span className="text-muted-foreground">AI 正在处理...</span>
      <button
        className="text-xs text-muted-foreground hover:text-foreground"
        onClick={() => {
          editor.getApi(AIChatPlugin).aiChat.stop();
        }}
        type="button"
      >
        停止
      </button>
    </div>
  );
}

function ArticleEditorAIHeader() {
  return (
    <div className="flex items-center gap-2 border-b border-border/80 px-3 py-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <BotMessageSquareIcon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-foreground">Ask AI</div>
        <div className="text-xs leading-4 text-muted-foreground">
          选择对选中文本的处理方式
        </div>
      </div>
    </div>
  );
}

function AskAICommandItem({
  command,
  onSelect,
}: {
  command: AskAICommand;
  onSelect: () => void;
}) {
  const Icon = command.icon;

  return (
    <CommandItem
      className="items-start gap-3 px-2.5 py-2.5"
      onSelect={onSelect}
      value={command.value}
    >
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm leading-5 font-medium text-foreground">
          {command.label}
        </span>
        <span className="block text-xs leading-5 text-muted-foreground">
          {command.description}
        </span>
      </span>
    </CommandItem>
  );
}

function AskAIActionItem({ action }: { action: AskAIAction }) {
  return (
    <CommandItem
      className="gap-2.5 px-2.5 py-2.5"
      onSelect={action.onSelect}
      value={action.value}
    >
      {action.icon}
      <span className="text-sm font-medium">{action.label}</span>
    </CommandItem>
  );
}

export function ArticleEditorAIMenu() {
  const editor = useEditorRef();
  const open = usePluginOption(AIChatPlugin, "open");
  const toolName = usePluginOption(AIChatPlugin, "toolName");
  const streaming = usePluginOption(AIChatPlugin, "streaming");
  const chat = usePluginOption(AIChatPlugin, "chat");
  const messages = chat.messages ?? [];
  const isLoading = chat.status === "streaming" || chat.status === "submitted";
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [anchorBox, setAnchorBox] = useState<AnchorBox | null>(null);

  const resultActions = useMemo<AskAIAction[]>(
    () => [
      {
        icon: <CheckIcon className="size-4 text-muted-foreground" />,
        label: "接受结果",
        onSelect: () => {
          editor.getTransforms(AIChatPlugin).aiChat.accept();
          editor.tf.focus({ edge: "end" });
        },
        value: "accept",
      },
      {
        icon: <RotateCcwIcon className="size-4 text-muted-foreground" />,
        label: "重新生成",
        onSelect: () => {
          editor.getApi(AIChatPlugin).aiChat.reload();
        },
        value: "retry",
      },
      {
        icon: <XIcon className="size-4 text-muted-foreground" />,
        label: "放弃修改",
        onSelect: () => {
          editor.getTransforms(AIPlugin).ai.undo();
          editor.getApi(AIChatPlugin).aiChat.hide();
        },
        value: "discard",
      },
    ],
    [editor],
  );

  useEffect(() => {
    if (!open || !anchorElement) {
      return;
    }

    const updateAnchorBox = () => {
      setAnchorBox(resolveAnchorBox(anchorElement));
    };

    updateAnchorBox();

    window.addEventListener("resize", updateAnchorBox);
    window.addEventListener("scroll", updateAnchorBox, true);

    return () => {
      window.removeEventListener("resize", updateAnchorBox);
      window.removeEventListener("scroll", updateAnchorBox, true);
    };
  }, [anchorElement, open]);

  useEffect(() => {
    if (!streaming) {
      return;
    }

    const anchorEntry = editor
      .getApi(AIChatPlugin)
      .aiChat.node({ anchor: true });

    if (!anchorEntry) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- The AI anchor node is created by Plate outside React state and must be mirrored here.
    setAnchorElement(editor.api.toDOMNode(anchorEntry[0]) as HTMLElement);
  }, [editor, streaming]);

  useEffect(() => {
    if (toolName !== "edit" || isLoading) {
      return;
    }

    let anchorNode = editor.api.node({
      at: [],
      reverse: true,
      match: (node) => {
        const nodeRecord = node as Record<string, unknown>;

        return (
          !!nodeRecord[KEYS.suggestion] &&
          !!nodeRecord[getTransientSuggestionKey()]
        );
      },
    });

    if (!anchorNode) {
      anchorNode = editor
        .getApi(BlockSelectionPlugin)
        .blockSelection.getNodes({ selectionFallback: true, sort: true })
        .at(-1);
    }

    if (!anchorNode) {
      return;
    }

    const block = editor.api.block({ at: anchorNode[1] });

    if (!block) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- The result menu needs to move to the final suggestion block after streaming ends.
    setAnchorElement(editor.api.toDOMNode(block[0]) as HTMLElement);
  }, [editor, isLoading, toolName]);

  useEditorChat({
    onOpenChange: (nextOpen) => {
      if (!nextOpen) {
        setAnchorElement(null);
        setAnchorBox(null);
      }
    },
    onOpenSelection: () => {
      const anchorBlock = editor.api.blocks().at(-1);

      if (!anchorBlock) {
        return;
      }

      setAnchorElement(editor.api.toDOMNode(anchorBlock[0]) as HTMLElement);
    },
  });

  const submitCommand = (command: AskAICommand) => {
    editor.getApi(AIChatPlugin).aiChat.submit("", {
      mode: "chat",
      prompt: buildEditPrompt(editor, command.instruction),
      toolName: "edit",
    });
  };

  if (!anchorBox) {
    return <ArticleEditorAILoadingBar />;
  }

  if (toolName === "edit" && isLoading) {
    return <ArticleEditorAILoadingBar />;
  }

  return (
    <>
      <Popover
        modal={false}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            editor.getApi(AIChatPlugin).aiChat.show();
            return;
          }

          if (isLoading) {
            editor.getApi(AIChatPlugin).aiChat.stop();
          }

          editor.getApi(AIChatPlugin).aiChat.hide();
        }}
        open={open}
      >
        <PopoverAnchor asChild>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed size-0"
            style={{
              left: anchorBox.left,
              top: anchorBox.top,
            }}
          />
        </PopoverAnchor>

        <PopoverContent
          align="center"
          className="w-80 border-none bg-transparent p-0 shadow-none"
          onEscapeKeyDown={(event) => {
            event.preventDefault();

            if (isLoading) {
              editor.getApi(AIChatPlugin).aiChat.stop();
              return;
            }

            editor.getApi(AIChatPlugin).aiChat.hide();
          }}
          side="bottom"
        >
          <Command className="w-full rounded-lg border border-border/90 bg-popover shadow-md">
            <ArticleEditorAIHeader />

            <CommandList>
              <CommandGroup className="p-1.5">
                {messages.length > 0
                  ? resultActions.map((action) => (
                      <AskAIActionItem action={action} key={action.value} />
                    ))
                  : ASK_AI_COMMANDS.map((command) => (
                      <AskAICommandItem
                        command={command}
                        key={command.value}
                        onSelect={() => {
                          submitCommand(command);
                        }}
                      />
                    ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ArticleEditorAILoadingBar />
    </>
  );
}

export const ArticleEditorAIChatPlugin = AIChatPlugin.extend({
  render: {
    afterEditable: ArticleEditorAIMenu,
  },
  useHooks: ({ editor, setOption }) => {
    useArticleEditorAIChat();

    useChatChunk({
      onChunk: ({ isFirst, text }) => {
        if (editor.getOption(AIChatPlugin, "toolName") !== "edit") {
          return;
        }

        withAIBatch(
          editor,
          () => {
            applyAISuggestions(editor, text);
          },
          { split: isFirst },
        );
      },
      onFinish: () => {
        setOption("streaming", false);
      },
    });
  },
});

export const ArticleEditorAIPlugin = AIPlugin;
