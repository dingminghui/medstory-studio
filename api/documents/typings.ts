import type {
  CreateDocumentInput,
  DocumentHistoryResponse,
  DocumentResponse,
  UpdateDocumentInput,
} from "@/lib/document-model";

export type CreateDocumentRequest = CreateDocumentInput;
export type CreateDocumentResponse = DocumentResponse;
export type ListDocumentsResponse = DocumentHistoryResponse;
export type UpdateDocumentRequest = UpdateDocumentInput;
export type UpdateDocumentResponse = DocumentResponse;
