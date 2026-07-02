import axios from "axios";

import { KnowledgeBasePaperListResponseSchema } from "@/lib/knowledge-base-model";

import type { ListKnowledgeBasePapersResponse } from "./typings";

export async function listKnowledgeBasePapers(): Promise<ListKnowledgeBasePapersResponse> {
  try {
    const response = await axios.get<unknown>("/api/knowledge-base/papers");

    return KnowledgeBasePaperListResponseSchema.parse(response.data);
  } catch {
    throw new Error("知识库加载失败，请稍后重试");
  }
}
