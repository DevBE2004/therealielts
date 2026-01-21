"use client";

import Pagination from "@/components/common/Pagination";
import { StudyAbroad } from "@/types";
import { Category } from "@/types/category";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  category: Category;
  limit: number;
};

export default function PreviewPage({ category, limit }: Props) {
  const [loading, setLoading] = useState(false);
  const [studyAbroads, setStudyAbroads] = useState<StudyAbroad[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState("createdAt,DESC");

  useEffect(() => {
    const fetchStudyAbroads = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          type: "STUDYABROAD",
          categoryId: category?.id.toString(),
          limit: limit.toString(),
          page: page.toString(),
          orderBy: orderBy || "createdAt,DESC",
          tag: "study-abroad",
        });

        const res: { data: StudyAbroad[]; total?: number; success: boolean } =
          await fetch(
            `https://therealielts.vn/api/common?${params.toString()}`,
            {
              cache: "no-store",
            }
          ).then((r) => r.json());
        // console.log("STUDY ABROADS: ", res);

        if (res.success) {
          setTotal(res?.total || 0);
          setStudyAbroads(res.data);
        }
      } catch (error) {
        console.error("Fetch study-abroad fail: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyAbroads();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [page, orderBy, limit]);

  const sortOptions = [
    { label: "Ngày tạo (mới nhất)", value: "createdAt,DESC" },
    { label: "Ngày tạo (cũ nhất)", value: "createdAt,ASC" },
    { label: "Ngày cập nhật (mới nhất)", value: "updatedAt,DESC" },
    { label: "Ngày cập nhật (cũ nhất)", value: "updatedAt,ASC" },
  ];

  return (
    <section className="container w-full max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[#20376C] leading-tight tracking-tight">
          Cơ hội & các thông tin {category?.name ?? "du học"}
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Tìm hiểu các chương trình du học uy tín, cập nhật thông tin mới nhất.
        </p>
      </header>

      <div className="relative w-full sm:w-64 py-6">
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="w-full appearance-none cursor-pointer bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-xl 
              focus:border-[#333399] focus:ring-1 focus:ring-[#333399] px-4 py-2.5 pr-8 transition-all"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Grid */}
      <div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyAbroads.map((article: StudyAbroad) => (
            <li
              key={article.id}
              className="group relative bg-white shadow-md rounded-2xl overflow-hidden transition-all"
            >
              {/* Image */}
              {article.images?.[0] !== undefined && (
                <div className="relative h-52 w-full p-3">
                  <Link
                    href={`/${article.slug}`}
                    className="w-full h-full cursor-pointer rounded-xl overflow-hidden"
                  >
                    <Image
                      src={article.images?.[0]}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform"
                    />
                  </Link>
                </div>
              )}

              {/* Content */}
              <article className="px-6 pb-5 pt-3">
                <Link href={`/${article.slug}`}>
                  <h2 className="text-lg font-sans font-[500] text-[#c36] hover:text-blue-700 cursor-pointer mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                </Link>

                <div
                  dangerouslySetInnerHTML={{ __html: article.description }}
                  className="text-gray-600 text-sm md:text-base mb-4 line-clamp-4 leading-relaxed prose"
                />

                {/* Meta info */}
                <div className="flex flex-col text-sm text-gray-500 mb-5">
                  {/* <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    <time dateTime={new Date(article.createdAt).toLocaleDateString("vi-VN")}>
                      {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> Updated:
                    <time
                      dateTime={
                        article.updatedAt &&
                        new Date(article.updatedAt).toLocaleDateString("vi-VN")
                      }
                    >
                      {article.updatedAt &&
                        new Date(article.updatedAt).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </time>
                  </div>
                </div>

                {/* Call-to-action */}
                <a
                  href={`/${article.slug}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Đọc thêm <ArrowRight size={16} />
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <Pagination
        currentPage={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </section>
  );
}
