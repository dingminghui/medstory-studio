import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { documents } from "@/db/schema";
import {
  CreateDocumentInputSchema,
  createDefaultDocumentContent,
} from "@/lib/document-model";
import { getDb } from "@/lib/db";
import {
  listDocumentHistory,
  serializeDocument,
  serializeDocumentHistoryItem,
} from "@/lib/documents";

export const runtime = "nodejs";

export async function GET() {
  const history = await listDocumentHistory();

  return NextResponse.json(history.map(serializeDocumentHistoryItem));
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容格式不正确" }, { status: 400 });
  }

  const result = CreateDocumentInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "标题无效" }, { status: 400 });
  }

  const [document] = await getDb()
    .insert(documents)
    .values({
      id: randomUUID(),
      title: result.data.title,
      content: createDefaultDocumentContent(),
    })
    .returning();

  return NextResponse.json(serializeDocument(document), { status: 201 });
}
