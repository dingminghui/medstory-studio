import { notFound } from "next/navigation";

import { ArticleEditor } from "@/components/article-editor";
import { MainHeader } from "@/components/main-header";
import { getDocumentById } from "@/lib/documents";

type DocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <>
      <MainHeader title={document.title} />
      <main className="flex flex-1">
        <ArticleEditor title={document.title} value={document.content} />
      </main>
    </>
  );
}
