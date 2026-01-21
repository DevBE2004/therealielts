"use client";

import { useEffect, useState } from "react";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, Document, DocumentSchema } from "@/types";
import { Category } from "@/types/category";
import CardDocument from "@/components/common/card/card-doc";
import { toast } from "react-toastify";

type Props = {
  c: Category;
  debouncedQuery: string;
  orderBy: string;
  urlWeb: string;
  onDocsFetched?: (categoryId: number, hasDocs: boolean) => void;
};

const LIMIT = 4;

const CategoryDocs: React.FC<Props> = ({
  c,
  debouncedQuery,
  orderBy,
  urlWeb,
  onDocsFetched,
}) => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasErrorToast, setHasErrorToast] = useState(false);

  const hasMore = docs.length < total;

  const fetchDocs = async (pageNum: number, append = false) => {
    if (loading) return;
    setLoading(true);

    try {
      // const res = await clientHttp(ApiResponseSchema(DocumentSchema.array()), {
      //   method: "GET",
      //   path: "/common",
      //   query: {
      //     isActive: true,
      //     page: pageNum,
      //     limit: LIMIT,
      //     categoryId: c.id,
      //     type: "DOCUMENT",
      //     search: debouncedQuery || undefined,
      //     orderBy: orderBy,
      //   },
      // });

      // console.log("orderBy", orderBy);

      const params = new URLSearchParams({
        categoryId: c.id.toString(),
        type: "DOCUMENT",
        page: pageNum.toString(),
        limit: LIMIT.toString(),
        search: debouncedQuery || "",
        orderBy: orderBy || "",
        tag: "document",
      });

      const res: { data: Document[]; total?: number } = await fetch(
        `${urlWeb}/api/common?${params.toString()}`,
        {
          cache: "no-store",
        }
      ).then((r) => r.json());

      // console.log("RESSSS: ", urlWeb)

      const fetched = res.data || [];

      // console.log("RESSSS 2: ", fetched)

      setDocs((prev) => {
        const merged = append ? [...prev, ...fetched] : fetched;
        return Array.from(new Map(merged.map((d) => [d.id, d])).values());
      });
      if (res.total !== undefined) {
        setTotal(res.total);
      } else {
        setTotal((prev) => (append ? prev + fetched.length : fetched.length));
      }

      setPage(pageNum);

      onDocsFetched?.(c.id, fetched.length > 0);
    } catch (err: any) {
      console.error("fetchDocs error", err);
      if (!hasErrorToast) {
        setHasErrorToast(true);
        if (err?.status === 429) {
          toast.warning("Vượt quá request, vui lòng refresh lại sau 60 giây");
        } else {
          console.error(err);
        }
        setTimeout(() => setHasErrorToast(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load lại khi đổi category hoặc search
  useEffect(() => {
    fetchDocs(1, false);
  }, [debouncedQuery, c.id, orderBy]);

  const handleShowMore = () => {
    fetchDocs(page + 1, true);
  };

  if (!docs.length && !loading) return null;

  return (
    <section key={c.id} className="mb-16">
      <h3 className="text-xl lg:text-2xl xl:text-3xl font-sans font-[700] uppercase text-[#333399] mb-6 border-l-4 border-[#333399] pl-3">
        {c.name}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {docs.map((doc) => (
          <CardDocument key={doc.id} item={doc} />
        ))}
      </div>

      {hasMore && !loading && (
        <div className="mt-6 text-center">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-gradient-to-r from-[#D1228A] to-[#6B3D97] cursor-pointer text-white rounded-lg hover:scale-105 transition"
          >
            Xem thêm
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500 mt-4">Đang tải...</div>
      )}
    </section>
  );
};

export default CategoryDocs;
