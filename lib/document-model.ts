import { z } from "zod";

export const MAX_DOCUMENT_TITLE_LENGTH = 255;

export const DocumentContentSchema = z.array(
  z.object({
    type: z.string(),
    children: z.array(
      z.object({
        text: z.string(),
      }),
    ),
  }),
);

export const CreateDocumentInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "请输入文章标题")
    .max(MAX_DOCUMENT_TITLE_LENGTH, "标题不能超过 255 个字符"),
});

export const DocumentResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: DocumentContentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;
export type DocumentContent = z.infer<typeof DocumentContentSchema>;
export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;

const DEFAULT_DOCUMENT_SECTIONS = [
  "引言",
  "文献综述",
  "方法论",
  "结果",
  "讨论",
  "结论",
];

export function createDefaultDocumentContent(): DocumentContent {
  return DEFAULT_DOCUMENT_SECTIONS.flatMap((section) => [
    {
      type: "h3",
      children: [{ text: section }],
    },
    {
      type: "p",
      children: [{ text: "" }],
    },
  ]);
}
