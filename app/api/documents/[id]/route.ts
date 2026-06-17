import { NextResponse } from "next/server";

import { getDocumentById, serializeDocument } from "@/lib/documents";

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
