import { NextResponse } from "next/server";

import { UpdateDocumentInputSchema } from "@/lib/document-model";
import {
  getDocumentById,
  serializeDocument,
  updateDocumentById,
} from "@/lib/documents";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    return NextResponse.json({ error: "文档不存在" }, { status: 404 });
  }

  return NextResponse.json(serializeDocument(document));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容格式不正确" }, { status: 400 });
  }

  const result = UpdateDocumentInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "文档内容无效" }, { status: 400 });
  }

  const document = await updateDocumentById(id, result.data);

  if (!document) {
    return NextResponse.json({ error: "文档不存在" }, { status: 404 });
  }

  return NextResponse.json(serializeDocument(document));
}
