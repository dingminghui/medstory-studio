import { z } from "zod";

export const MAX_DOCUMENT_TITLE_LENGTH = 255;

export type DocumentText = {
  text: string;
  [key: string]: unknown;
};

export type DocumentElement = {
  id?: string;
  type: string;
  children: DocumentNode[];
  [key: string]: unknown;
};

export type DocumentNode = DocumentElement | DocumentText;
export type DocumentContent = DocumentElement[];

const DocumentTextSchema: z.ZodType<DocumentText> = z
  .object({
    text: z.string(),
  })
  .catchall(z.unknown());

const DocumentNodeSchema: z.ZodType<DocumentNode> = z.lazy(() =>
  z.union([DocumentElementSchema, DocumentTextSchema]),
);

const DocumentElementSchema: z.ZodType<DocumentElement> = z
  .object({
    id: z.string().optional(),
    type: z.string(),
    children: z.array(DocumentNodeSchema),
  })
  .catchall(z.unknown());

export const DocumentContentSchema: z.ZodType<DocumentContent> = z.array(
  DocumentElementSchema,
);

export const CreateDocumentInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "请输入文章标题")
    .max(MAX_DOCUMENT_TITLE_LENGTH, "标题不能超过 255 个字符"),
});

export const UpdateDocumentInputSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "请输入文章标题")
      .max(MAX_DOCUMENT_TITLE_LENGTH, "标题不能超过 255 个字符")
      .optional(),
    content: DocumentContentSchema.optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "至少提供一个待更新字段",
  });

export const DocumentResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: DocumentContentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DocumentHistoryItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DocumentHistoryResponseSchema = z.array(DocumentHistoryItemSchema);

export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentInputSchema>;
export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;
export type DocumentHistoryItem = z.infer<typeof DocumentHistoryItemSchema>;
export type DocumentHistoryResponse = z.infer<
  typeof DocumentHistoryResponseSchema
>;

const DEFAULT_DOCUMENT_SECTIONS = [
  "引言",
  "文献综述",
  "方法论",
  "结果",
  "讨论",
  "结论",
];

export function generateDocumentNodeId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `block-${Math.random().toString(36).slice(2, 10)}`;
}

function isDocumentElement(node: DocumentNode): node is DocumentElement {
  return "type" in node && Array.isArray(node.children);
}

function normalizeDocumentNode(node: DocumentNode): DocumentNode {
  if (!isDocumentElement(node)) {
    return node;
  }

  return {
    ...node,
    id: node.id ?? generateDocumentNodeId(),
    children: node.children.map(normalizeDocumentNode),
  };
}

export function normalizeDocumentContent(
  content: DocumentContent,
): DocumentContent {
  return content.map((node) => normalizeDocumentNode(node) as DocumentElement);
}

export function createDefaultDocumentContent(): DocumentContent {
  return normalizeDocumentContent(
    DEFAULT_DOCUMENT_SECTIONS.flatMap((section) => [
      {
        type: "h3",
        children: [{ text: section }],
      },
      {
        type: "p",
        children: [{ text: "" }],
      },
    ]),
  );
}
