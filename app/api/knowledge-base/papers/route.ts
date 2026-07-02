import { NextResponse } from "next/server";

import {
  listKnowledgeBasePapers,
  serializeKnowledgeBasePaper,
} from "@/lib/knowledge-base";

export const runtime = "nodejs";

export async function GET() {
  const papers = await listKnowledgeBasePapers();

  return NextResponse.json(papers.map(serializeKnowledgeBasePaper));
}
