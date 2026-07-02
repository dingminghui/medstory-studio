"use client";

import { useEffect, useMemo } from "react";
import { type UseChatHelpers, useChat } from "@ai-sdk/react";
import { AIChatPlugin } from "@platejs/ai/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEditorPlugin } from "platejs/react";

type ArticleEditorAIMessageData = {
  comment?: {
    blockId: string;
    comment: string;
    content: string;
  };
  toolName: "comment" | "edit" | "generate";
};

export type ArticleEditorAIMessage = UIMessage<
  Record<string, never>,
  ArticleEditorAIMessageData
>;

export function useArticleEditorAIChat() {
  const { setOption } = useEditorPlugin(AIChatPlugin);
  const chat = useChat<ArticleEditorAIMessage>({
    id: "article-editor",
    transport: new DefaultChatTransport({
      api: "/api/ai/command",
    }),
  });
  const plateChat = useMemo<UseChatHelpers<ArticleEditorAIMessage>>(
    () => ({
      addToolApprovalResponse: chat.addToolApprovalResponse,
      addToolOutput: chat.addToolOutput,
      addToolResult: chat.addToolResult,
      clearError: chat.clearError,
      error: chat.error,
      id: chat.id,
      messages: chat.messages,
      regenerate: chat.regenerate,
      resumeStream: chat.resumeStream,
      sendMessage: chat.sendMessage,
      setMessages: chat.setMessages,
      status: chat.status,
      stop: chat.stop,
    }),
    [
      chat.addToolApprovalResponse,
      chat.addToolOutput,
      chat.addToolResult,
      chat.clearError,
      chat.error,
      chat.id,
      chat.messages,
      chat.regenerate,
      chat.resumeStream,
      chat.sendMessage,
      chat.setMessages,
      chat.status,
      chat.stop,
    ],
  );

  useEffect(() => {
    setOption("chat", plateChat);
  }, [plateChat, setOption]);

  return plateChat;
}
