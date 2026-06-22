import axios from "axios";
import { z } from "zod";

import {
  CreateDocumentInputSchema,
  DocumentHistoryResponseSchema,
  DocumentResponseSchema,
} from "@/lib/document-model";

import type {
  CreateDocumentRequest,
  CreateDocumentResponse,
  ListDocumentsResponse,
} from "./typings";

const ApiErrorSchema = z.object({
  error: z.string(),
});

function getDocumentApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const result = ApiErrorSchema.safeParse(error.response?.data);

    if (result.success) {
      return result.data.error;
    }
  }

  if (error instanceof z.ZodError) {
    return "接口返回格式不正确";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "创建文档失败，请稍后重试";
}

export async function createDocument(
  input: CreateDocumentRequest,
): Promise<CreateDocumentResponse> {
  const payload = CreateDocumentInputSchema.parse(input);

  try {
    const response = await axios.post<unknown>("/api/documents", payload);

    return DocumentResponseSchema.parse(response.data);
  } catch (error) {
    throw new Error(getDocumentApiErrorMessage(error));
  }
}

export async function listDocuments(): Promise<ListDocumentsResponse> {
  try {
    const response = await axios.get<unknown>("/api/documents");

    return DocumentHistoryResponseSchema.parse(response.data);
  } catch (error) {
    throw new Error(getDocumentApiErrorMessage(error));
  }
}
