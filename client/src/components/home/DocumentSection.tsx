import { CommonService } from "@/services/common.service";
import DocumentView from "./DocumentView";
import { DocumentSchema } from "@/types";

export default async function SectionDocument() {
  const fetchDocuments = await CommonService.getAll(DocumentSchema, {
    query: {
      isActive: true,
      type: "DOCUMENT",
      limit: 10,
    },
    revalidate: 300,
    tags: ["document"],
  });

  const dataDocuments: any[] = Array.isArray(fetchDocuments?.data)
    ? fetchDocuments.data
    : [];

  if (!dataDocuments.length) {
    return null;
  }

  return <DocumentView documents={dataDocuments} />;
}
