"use client";

import { useEffect, useState } from "react";
import { Document } from "@/types";
import slugify from "slugify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CardDocument from "@/components/common/card/card-doc";

type PageProps = {
  documents: Document[];
  categoryTitle?: string;
  page: number;
  total: number;
  limit: number;
  search?: string;
};

export default function CategoryView({
  documents,
  categoryTitle,
  page,
  total,
  limit,
  search,
}: PageProps) {
  const totalPages = Math.ceil(total / limit);
  const router = useRouter();

  const [query, setQuery] = useState(search || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query && query.trim() !== "") {
        router.push(`?page=1&search=${encodeURIComponent(query)}`);
      } else {
        router.push(`?page=1`);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, router]);

  return (
    <section className="w-full py-10">
      {/* SEO heading */}
      {categoryTitle && (
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-sans uppercase font-[700] text-gray-900 mb-2">
            Tài liệu về {categoryTitle}
          </h1>
          <p className="text-gray-600">
            Khám phá kho tài liệu hữu ích liên quan đến {categoryTitle}.
          </p>
        </header>
      )}

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {documents.length > 0 ? (
          documents.map((doc) => <CardDocument key={doc.id} item={doc} />)
        ) : (
          <p className="text-gray-500 italic text-center col-span-full">
            Không có tài liệu nào trong mục này
          </p>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {(() => {
            const pages: (number | string)[] = [];

            if (totalPages <= 5) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);

              if (page > 3) pages.push("...");

              const start = Math.max(2, page - 1);
              const end = Math.min(totalPages - 1, page + 1);

              for (let i = start; i <= end; i++) pages.push(i);

              if (page < totalPages - 2) pages.push("...");

              pages.push(totalPages);
            }

            return pages.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-3 py-2 text-gray-500 select-none"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={p}
                  href={`?page=${p}`}
                  className={`px-4 py-2 rounded-lg ${
                    p === page
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {p}
                </Link>
              )
            );
          })()}
        </div>
      )}
    </section>
  );
}
