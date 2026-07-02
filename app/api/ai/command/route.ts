import { NextResponse } from "next/server";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getMarkdown } from "@platejs/ai";
import { createSlateEditor } from "platejs";
import { z } from "zod";

import { ArticleEditorServerPlugins } from "@/lib/article-editor-server-kit";
import { DocumentContentSchema } from "@/lib/document-model";

export const runtime = "nodejs";

const AICommandRequestSchema = z.object({
  ctx: z.object({
    children: DocumentContentSchema,
    selection: z.unknown().nullable(),
    toolName: z.enum(["comment", "edit", "generate"]).nullable(),
  }),
  messages: z.array(z.custom<UIMessage>()),
  model: z.string().trim().min(1).optional(),
});

const deepseek = createOpenAICompatible({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
  name: "deepseek",
});

function buildSystemPrompt({
  selectionMarkdown,
  toolName,
}: {
  selectionMarkdown: string;
  toolName: "comment" | "edit" | "generate" | null;
}) {
  if (toolName === "edit") {
    return [
      "你是一名严谨的中文写作编辑。",
      "请把用户选中的内容改写成自然、干净的 Markdown。",
      "除非指令明确要求，否则不要改变事实、原意和结构。",
      "只返回改写后的 Markdown，不要附带解释，也不要加代码块围栏。",
      "",
      "当前选中内容：",
      selectionMarkdown,
    ].join("\n");
  }

  return [
    "你是一名中文写作助手。",
    "只返回用户要求的 Markdown 结果，不要附带解释，也不要加代码块围栏。",
    "",
    "当前选中内容：",
    selectionMarkdown,
  ].join("\n");
}

export async function POST(request: Request) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "AI 服务尚未配置" }, { status: 500 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容格式不正确" }, { status: 400 });
  }

  const result = AICommandRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "AI 请求参数无效" }, { status: 400 });
  }

  const { ctx, messages, model } = result.data;
  const editor = createSlateEditor({
    plugins: [...ArticleEditorServerPlugins],
    selection: (ctx.selection ?? undefined) as never,
    value: ctx.children,
  });
  const selectionMarkdown = getMarkdown(editor, {
    type: ctx.selection ? "blockSelection" : "block",
  }).trim();
  const system = buildSystemPrompt({
    selectionMarkdown,
    toolName: ctx.toolName,
  });

  const stream = streamText({
    messages: await convertToModelMessages(messages),
    model: deepseek.chatModel(model ?? "deepseek-chat"),
    system,
    temperature: ctx.toolName === "edit" ? 0.2 : 0.7,
  });

  return stream.toUIMessageStreamResponse({
    originalMessages: messages,
  });
}
