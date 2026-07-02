import { z } from "zod";

export const KnowledgeBasePaperResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  journal: z.string(),
  authors: z.string(),
  keywords: z.string(),
  ifValue: z.number(),
  doi: z.string(),
  publishDate: z.string(),
  abstract: z.string(),
});

export const KnowledgeBasePaperListResponseSchema = z.array(
  KnowledgeBasePaperResponseSchema,
);

export type KnowledgeBasePaperResponse = z.infer<
  typeof KnowledgeBasePaperResponseSchema
>;
export type KnowledgeBasePaperListResponse = z.infer<
  typeof KnowledgeBasePaperListResponseSchema
>;
